import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Student from '@/models/Student.model';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ exists: false, message: 'Username is required.' }, { status: 400 });
    }

    const student = await Student.findOne({ username });

    if (student) {
      return NextResponse.json({ exists: true, message: 'Student found.' });
    } else {
      return NextResponse.json({ exists: false, message: 'Student not found.' });
    }
  } catch (error: any) {
    return NextResponse.json({ exists: false, message: `Error: ${error.message}` }, { status: 500 });
  }
}
