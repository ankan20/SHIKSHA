import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/utils/dbConnect'; // Ensure this path is correct
import Student from '@/models/Student.model'; // Import the Student model
import Teacher from '@/models/Teacher.model'; // Import the Teacher model

export async function POST(req: NextRequest) {
  try {
    const { teacherId, studentUsername } = await req.json(); // Parse JSON body

    if (!teacherId || !studentUsername) {
      return NextResponse.json({ error: 'Teacher ID and Student Username are required' }, { status: 400 });
    }

    await connectDb(); // Connect to the database

    // Find the student by username
    const student = await Student.findOne({ username: studentUsername });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Check if student is already added to the teacher
    if (teacher.students.includes(student._id)) {
      return NextResponse.json({ error: 'Student is already added to this teacher' }, { status: 400 });
    }

    // Update the teacher's students list
    teacher.students.push(student._id);
    await teacher.save();

    // Update the student's teachers list
    if (!student.teachers.includes(teacher._id)) {
      student.teachers.push(teacher._id);
      await student.save();
    }

    return NextResponse.json({ message: `Student ${studentUsername} added successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
