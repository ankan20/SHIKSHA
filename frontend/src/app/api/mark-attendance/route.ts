import { NextRequest, NextResponse } from 'next/server';
import Student from '@/models/Student.model';
import dbConnect from '@/utils/dbConnect';
import Teacher from '@/models/Teacher.model'; // Ensure your database connection setup is correct

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Connect to the database

    const { teacherUsername, attendanceData } = await req.json();
    console.log('Received Data:', { teacherUsername, attendanceData });

    // Use current date instead of receiving it from request
    const currentDate = new Date();

    if (!teacherUsername || !attendanceData) {
      console.log('Invalid data provided');
      return NextResponse.json({ message: 'Invalid data provided' }, { status: 400 });
    }

    // Fetch the teacher's ID based on their username
    const teacher = await Teacher.findOne({ username: teacherUsername }).exec();
    if (!teacher) {
      console.log('Teacher not found');
      return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
    }
    const teacherId = teacher._id;

    const attendancePromises = attendanceData.map(async (attendanceItem: { "Student Name": string, "Attendance Status": string }) => {
      const student = await Student.findOne({ username: attendanceItem["Student Name"] }).exec();
      console.log('Found Student:', student);

      // Check if the student has this teacher by teacherId
      if (student && student.teachers.includes(teacherId)) {
        // Convert attendance status to boolean
        const isPresent = attendanceItem["Attendance Status"] === 'Present';
        console.log(`Updating attendance for ${student.username} - Present: ${isPresent}`);

        // Update attendance by passing teacherId instead of teacherUsername
        await student.markAttendance(teacherUsername, currentDate, isPresent);
      } else {
        console.log(`Student ${attendanceItem["Student Name"]} is not under teacher ${teacherUsername}`);
      }
    });

    await Promise.all(attendancePromises);

    return NextResponse.json({ message: 'Attendance marked successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ message: 'Failed to mark attendance' }, { status: 500 });
  }
}
