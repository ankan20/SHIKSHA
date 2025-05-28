// backend/api/get-weekly-data/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConnect'; // Adjust the path according to your project structure
import Student from '@/models/Student.model'; // Adjust the path according to your project structure

// Ensure database connection
connectDB();

export async function POST(request: Request) {
  try {
    const { studentUsername, teacherUsername } = await request.json();
    
    if (!studentUsername || !teacherUsername) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Find the student by username
    const student = await Student.findOne({ username: studentUsername });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Fetch behavior data for the past 7 days associated with the teacher
    const behaviorData = student.behaviorData.filter(
      (data: any) => data.teacherUsername === teacherUsername
    ).slice(-7); // Assuming behaviorData is sorted, get the last 7 entries

    // Fallback to average if no recent data is available
    const behaviorDataFallback = {
      hand_raising: 0,
      reading: 0,
      turn_around: 0,
      looking_forward: 0,
      writing: 0,
      using_phone: 0,
      sleeping: 0,
    };

    if (behaviorData.length === 0) {
      const allBehaviorData = student.behaviorData.filter(
        (data: any) => data.teacherUsername === teacherUsername
      );

      if (allBehaviorData.length > 0) {
        // Calculate average
        allBehaviorData.forEach((data: any) => {
          behaviorDataFallback.hand_raising += data.hand_raising;
          behaviorDataFallback.reading += data.reading;
          behaviorDataFallback.turn_around += data.turn_around;
          behaviorDataFallback.looking_forward += data.looking_forward;
          behaviorDataFallback.writing += data.writing;
          behaviorDataFallback.using_phone += data.using_phone;
          behaviorDataFallback.sleeping += data.sleeping;
        });

        Object.keys(behaviorDataFallback).forEach(key => {
          behaviorDataFallback[key] /= allBehaviorData.length;
        });
      }
    }

    // Fetch attendance data associated with the teacher
    const attendanceData = student.attendanceData.filter(
      (data: any) => data.teacherUsername === teacherUsername
    ).slice(-7); // Assuming attendanceData is sorted, get the last 7 entries

    // Calculate attendance percentage
    const totalClasses = attendanceData.length;
    const totalAttendance = attendanceData.reduce(
      (acc: number, entry: any) => acc + (entry.attendance ? 1 : 0),
      0
    );
    const attendancePercentage = totalClasses > 0 ? (totalAttendance / totalClasses) * 100 : 0;

    return NextResponse.json({
      behaviorData: behaviorData.length ? behaviorData : behaviorDataFallback,
      attendancePercentage
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
