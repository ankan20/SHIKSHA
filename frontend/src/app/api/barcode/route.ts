import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Booklet from "@/models/Booklet";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    
    const { barcode } = await request.json();
    const newBooklet = new Booklet({
            barcode,
           });
    await newBooklet.save();
    // Use the generated _id to form the barcode value
    const formattedBarcode = `EXAM-${newBooklet._id}`;

    // Update the document with the formatted barcode value
    newBooklet.barcode = formattedBarcode;
    await newBooklet.save();

    // Return a success response
    return NextResponse.json({ message: "Barcode saved successfully.", barcode: formattedBarcode });
  } catch (error: any) {
    // Return an error response
    return NextResponse.json(
      { message: "Failed to save barcode.", error: error.message },
      { status: 500 }
    );
  }
}
