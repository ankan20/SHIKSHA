import { NextRequest, NextResponse } from "next/server";
import Booklet from "@/models/Booklet";
import dbConnect from "@/utils/dbConnect";

export async function POST(request: Request) {
  const { barcode } = await request.json();

  if (!barcode) {
    return new Response("Barcode is required.", { status: 400 });
  }

  try {
    // Ensure database connection
    await dbConnect();

    // Find the booklet by barcode
    const booklet = await Booklet.findOne({ barcode }).populate('studentId');

    if (!booklet) {
      return new Response("No booklet found with the provided barcode.", { status: 404 });
    }

    // Fetch student details if booklet is found
    const student =  booklet.studentId;

    if (!student) {
      return new Response("No student associated with the provided booklet.", { status: 404 });
    }

    const studentDetails = {
      id: student._id,
      name: student.username,
      rollNumber: student.rollNumber,
      className: student.className,
      attended: booklet.attended,
    };

    return new Response(JSON.stringify(studentDetails), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching student details:", error);
    return new Response("Failed to fetch student details.", { status: 500 });
  }
}
