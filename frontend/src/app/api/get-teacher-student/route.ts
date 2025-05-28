import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Student from '@/models/Student.model'; // Adjust the import path based on your project structure
import dbConnect from '@/utils/dbConnect';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

   await dbConnect() // Ensure your MongoDB URI is set in your environment variables

    const student = await Student.findOne({ username }).populate('teachers', 'username').exec();

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const teachers = student.teachers.map((teacher: any) => ({
      teacherId: teacher._id,
      teacherName: teacher.username
    }));

    return NextResponse.json(teachers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } 
}
