import { NextResponse } from 'next/server';
import connectDb from '@/utils/dbConnect'; // Adjust the path as needed
import Student from '@/models/Student.model'; // Adjust the import path based on your folder structure

export async function POST(request: Request) {
  const { username } = await request.json();

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    await connectDb();

    // Check if the student exists
    const student = await Student.findOne({ username });

    if (student) {
      return NextResponse.json({ valid: true }, { status: 200 });
    } else {
      return NextResponse.json({ valid: false }, { status: 200 });
    }
  } catch (error) {
    console.error('Error checking student:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
