import { NextResponse } from 'next/server';
import Student from '@/models/Student.model'; // Adjust the path as necessary
import Teacher from '@/models/Teacher.model';
import dbConnect from '@/utils/dbConnect';

// Threshold values for classification
const THRESHOLD_GOOD = 70; // Minimum score for a student to be considered "good"
const THRESHOLD_BAD = 40;  // Maximum score for a student to be considered "bad"

// Define weights for behavior categories (can adjust based on impact on behavior)
const behaviorWeights = {
  hand_raising: 10,
  reading: 10,
  looking_forward: 15,
  writing: 10,
  turn_around: -10,
  using_phone: -15,
  sleeping: -20,
};

export async function POST(request: Request) {
  const { teacherName } = await request.json();
  await dbConnect();
  
  if (!teacherName) {
    return NextResponse.json({ error: 'Teacher username is required' }, { status: 400 });
  }

  try {
    // Find the teacher and their students
    const teacher = await Teacher.findOne({ username: teacherName }).populate('students').exec();
    const students = teacher.students;

    const goodStudents: any[] = [];
    const badStudents: any[] = [];

    for (const student of students) {
      // Fetch 7-day behavior data specific to this teacher
      const behaviorData = await student.get7DayBehaviorData(teacherName);
      if (!behaviorData) continue;

      // Calculate weighted behavior score
      let totalScore = 0;
      for (const behavior in behaviorWeights) {
        totalScore += behaviorData[behavior] * behaviorWeights[behavior];
      }

      // Convert total score to a percentage
      const maxScore = Object.values(behaviorWeights)
        .map((weight) => Math.abs(weight))
        .reduce((a, b) => a + b, 0) * 7; // Assuming 7 is the max score per category

      const behaviorPercentage = (totalScore / maxScore) * 100;

      // Classify students as "good" or "bad" based on thresholds
      if (behaviorPercentage >= THRESHOLD_GOOD) {
        goodStudents.push({
          username: student.username,
          behaviorData,
          reason: 'Consistently good behavior across multiple categories',
        });
      } else if (behaviorPercentage <= THRESHOLD_BAD) {
        badStudents.push({
          username: student.username,
          behaviorData,
          reason: 'Poor behavior in multiple categories',
        });
      }
    }

    return NextResponse.json({ goodStudents, badStudents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
