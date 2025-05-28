import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Student from '@/models/Student.model';
import Teacher from '@/models/Teacher.model';

export async function POST(req: NextRequest) {
  // Ensure the method check is removed, since it's already handled by the export function.
  
  const { behavior_data, teacherUsername } = await req.json();

  if (!behavior_data || !teacherUsername) {
    return NextResponse.json({ error: 'Missing behavior data or teacher username.' }, { status: 400 });
  }

  await dbConnect();

  try {
    // Step 1: Retrieve the teacher by username
    const teacher = await Teacher.findOne({ username: teacherUsername }).populate('students', 'username');

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found.' }, { status: 404 });
    }

    // Step 2: Convert the list of student usernames to a Set for quick lookup
    const validStudentUsernames = new Set(teacher.students.map((student: any) => student.username));

    // Step 3: Get today's date in ISO format (YYYY-MM-DD)
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Step 4: Iterate through each student's behavior data
    for (const [studentUsername, behaviors] of Object.entries(behavior_data) as any) {
      if (validStudentUsernames.has(studentUsername)) {
        // Find the student by username
        const student = await Student.findOne({ username: studentUsername });

        if (student) {
          // Update or add behavior data for the current date
          const existingBehavior = student.behaviorData.find(
            (data: any) => data.teacherUsername === teacherUsername && data.date.toISOString().split('T')[0] === today
          );

          if (existingBehavior) {
            // Update existing behavior data
            existingBehavior.hand_raising = behaviors.hand_raising;
            existingBehavior.reading = behaviors.reading;
            existingBehavior.turn_around = behaviors.turn_around;
            existingBehavior.looking_forward = behaviors.looking_forward;
            existingBehavior.writing = behaviors.writing;
            existingBehavior.using_phone = behaviors.using_phone;
            existingBehavior.sleeping = behaviors.sleeping;
          } else {
            // Add new behavior data entry
            student.behaviorData.push({
              teacherUsername,
              date: now,
              ...behaviors,
            });
          }

          // Save the updated student record
          await student.save();
        }
      }
    }

    return NextResponse.json({ message: 'Behavior data updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating behavior data:', error);
    return NextResponse.json({ error: 'Failed to update behavior data.' }, { status: 500 });
  }
}
