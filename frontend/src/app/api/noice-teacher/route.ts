import { NextResponse } from 'next/server';
import Teacher from '@/models/Teacher.model';
import dbConnect from '@/utils/dbConnect'; // Ensure your database connection setup is correct

export async function POST(req: Request) {
  try {
    await dbConnect(); // Connect to the database

    const { teacherUsername, noicePercentage, voicePercentage } = await req.json();
    console.log(teacherUsername, noicePercentage, voicePercentage)
    if (!teacherUsername || noicePercentage === undefined || voicePercentage === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const teacher = await Teacher.findOne({ username: teacherUsername }).exec();
    if (!teacher) {
      return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
    }

    // Update teacher's noiceDetection array with new data
    const newDetection = {
      noice: parseFloat(noicePercentage),
      voice: parseFloat(voicePercentage),
    };
    teacher.noiceDetection.push(newDetection);
    await teacher.save();

    return NextResponse.json({ message: 'Teacher data updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating teacher data:', error);
    return NextResponse.json({ message: 'Failed to update teacher data' }, { status: 500 });
  }
}
