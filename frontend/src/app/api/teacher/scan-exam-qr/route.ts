
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Booklet from "@/models/Booklet";
import Student from "@/models/Student.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { examBarcode, studentBarcode } = await request.json();
    console.log(examBarcode, studentBarcode )
    // Determine student roll number from barcode (student barcode starts with 'L')
    let studentRollNumber = "";
    if (studentBarcode.startsWith("L")) {
      studentRollNumber = studentBarcode.replace("L", ""); // Extract roll number
    } else {
      return NextResponse.json(
        { message: "Invalid student barcode format." },
        { status: 400 }
      );
    }
    console.log(studentRollNumber)
    // Find the student by roll number
    const student = await Student.findOne({ rollNumber: studentRollNumber });
    if (!student) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }
    console.log(examBarcode)
    // Find the booklet by exam barcode and update it
    const booklet = await Booklet.findOne({ barcode: examBarcode });
    if (!booklet) {
      return NextResponse.json(
        { message: "Booklet not found." },
        { status: 404 }
      );
    }

    // Update the booklet with the student's information
    booklet.studentId = student._id;
    booklet.attended = true;
    booklet.status = "Issued";

    await booklet.save();

    return NextResponse.json({ message: "Booklet updated successfully." });
  } catch (error :any) {
    return NextResponse.json(
      { message: "Failed to process barcodes.", error: error.message },
      { status: 500 }
    );
  }
}
