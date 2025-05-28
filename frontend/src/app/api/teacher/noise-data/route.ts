import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Teacher from '@/models/Teacher.model'; // Assuming you have a Teacher model

// API route to get the last noise data point for a specific teacher by username
export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract the teacher's username from the request body
    const body = await request.json();
    const { teacherName } = body;
    

    if (!teacherName) {
      return NextResponse.json({ message: 'Teacher username is required.' }, { status: 400 });
    }

    // Find the teacher by their username and get their noise data
    const teacher = await Teacher.findOne({ username: teacherName }).select('noiceDetection');

    if (!teacher) {
      return NextResponse.json({ message: 'Teacher not found.' }, { status: 404 });
    }

    // Get the most recent noise data
    const lastNoiseData = teacher.noiceDetection[teacher.noiceDetection.length - 1];

    if (!lastNoiseData) {
      return NextResponse.json({ message: 'No noise data found for this teacher.' }, { status: 404 });
    }

    // Return the last noise data entry
    return NextResponse.json({ lastNoiseData }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching noise data:', error);
    return NextResponse.json({ message: 'Error fetching noise data.' }, { status: 500 });
  }
}
