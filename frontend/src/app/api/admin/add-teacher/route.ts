import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/models/Admin.model';
import Teacher from '@/models/Teacher.model';
import connectDB from '@/utils/dbConnect';

export async function POST(req: NextRequest) {
  await connectDB(); // Ensure the database connection is established

  try {
    const { teacherUsername, adminId } = await req.json();

    // Validate request body
    if (!teacherUsername || !adminId) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Check if the teacher exists
    const teacher = await Teacher.findOne({ username: teacherUsername });
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Check if the admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Add teacher to admin's list of teachers
    if (!admin.teachers.includes(teacher._id as any)) {
      admin.teachers.push(teacher._id as any);
      await admin.save();
    }

    return NextResponse.json({ message: 'Teacher added successfully' });
  } catch (error) {
    console.error('Error adding teacher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
