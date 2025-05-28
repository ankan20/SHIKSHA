import { NextRequest, NextResponse } from 'next/server';
import Teacher from '@/models/Teacher.model'; 
import Student from '@/models/Student.model'; 
import connectDb from '@/utils/dbConnect'; 
import mongoose from 'mongoose';

mongoose.model('Teacher', Teacher.schema);
mongoose.model('Student', Student.schema);

export  async function POST(request: NextRequest) {
  try {
    await connectDb();

    const teacherUsername = await request.json();
    console.log(teacherUsername)
    if (!teacherUsername) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    // Fetch the teacher document along with their students
    const teacher = await Teacher.findOne({username:teacherUsername.username}).populate('students','username').exec();
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Return the students associated with the teacher
    return NextResponse.json({ students: teacher.students }, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
