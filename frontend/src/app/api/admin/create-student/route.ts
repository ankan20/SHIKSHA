import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Student from '@/models/Student.model';

export async function POST(request: Request) {
  try {
    // Parse JSON body
    await dbConnect();
    const { rollNumber, username, className } = await request.json();

    // Validate input
    if (!rollNumber || !username || !className) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

   // Find student by username
   const student = await Student.findOne({ username });

   // If student doesn't exist, return error
   if (!student) {
     return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
   }

   student.rollNumber = rollNumber;
    student.className = className;

    // Save the updated student
    await student.save();
    
    return NextResponse.json({ message: 'Student info added successfully!' }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding info of student:', error);
    return NextResponse.json({ message: `Error adding info of student: ${error.message}` }, { status: 500 });
  }
}
