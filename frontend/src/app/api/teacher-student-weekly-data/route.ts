// // app/api/student/behavior/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import Student from '@/models/Student.model'; // Adjust the import path as needed
// import dbConnect from '@/utils/dbConnect';

// // Connect to your MongoDB (adjust with your connection logic if needed)

// // Route handler to get 7-day average behavior data and attendance data
// export async function POST(req: NextRequest) {
//   try {
//     await dbConnect();

//     // Parse the request body
//     const { studentUsername, teacherUsername } = await req.json();

//     if (!studentUsername || !teacherUsername) {
//       return NextResponse.json(
//         { error: 'Student username and teacher username are required' },
//         { status: 400 }
//       );
//     }

//     // Find the student by username
//     const student = await Student.findOne({ username: studentUsername });

//     if (!student) {
//       return NextResponse.json(
//         { error: 'Student not found' },
//         { status: 404 }
//       );
//     }

//     // Fetch the 7-day behavior data
//     const behaviorData = await student.get7DayBehaviorData(teacherUsername);

//     // Calculate attendance data for the teacher
//     const recentAttendanceData = student.attendanceData.filter(
//       (data: any) => data.teacherUsername === teacherUsername
//     );

//     const totalClasses = recentAttendanceData.length;
//     const totalAttendance = recentAttendanceData.reduce(
//       (acc: number, entry: any) => acc + (entry.attendance ? 1 : 0),
//       0
//     );

//     // Calculate attendance percentage
//     const attendancePercentage = totalClasses > 0 ? (totalAttendance / totalClasses) * 100 : 0;

//     // Fallback to average of all behavior data if the last 7 days' data is not available
//     if (behaviorData.hand_raising === 0 &&
//         behaviorData.reading === 0 &&
//         behaviorData.turn_around === 0 &&
//         behaviorData.looking_forward === 0 &&
//         behaviorData.writing === 0 &&
//         behaviorData.using_phone === 0 &&
//         behaviorData.sleeping === 0) {
        
//       const allBehaviorData = student.behaviorData.filter(
//         (data: any) => data.teacherUsername === teacherUsername
//       );

//       if (allBehaviorData.length === 0) {
//         return NextResponse.json(
//           { message: 'No behavior data found for this teacher' },
//           { status: 404 }
//         );
//       }

//       const avgBehavior = allBehaviorData.reduce(
//         (acc: any, data: any, _, { length }) => {
//           acc.hand_raising += data.hand_raising / length;
//           acc.reading += data.reading / length;
//           acc.turn_around += data.turn_around / length;
//           acc.looking_forward += data.looking_forward / length;
//           acc.writing += data.writing / length;
//           acc.using_phone += data.using_phone / length;
//           acc.sleeping += data.sleeping / length;
//           return acc;
//         },
//         {
//           hand_raising: 0,
//           reading: 0,
//           turn_around: 0,
//           looking_forward: 0,
//           writing: 0,
//           using_phone: 0,
//           sleeping: 0,
//         }
//       );
//       console.log(attendancePercentage)
//       return NextResponse.json({ behaviorData: avgBehavior, attendancePercentage });
//     }

    

//     return NextResponse.json({ behaviorData, attendancePercentage });

//   } catch (error) {
//     console.error('Error fetching behavior data:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// Function to generate insights, actions, and suggestions based on behavior data


import { NextRequest, NextResponse } from 'next/server';
import Student from '@/models/Student.model'; // Adjust the import path as needed
import dbConnect from '@/utils/dbConnect';

// Connect to your MongoDB (adjust with your connection logic if needed)

// Route handler to get 7-day average behavior data and attendance data
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Parse the request body
    const { studentUsername, teacherUsername } = await req.json();

    if (!studentUsername || !teacherUsername) {
      return NextResponse.json(
        { error: 'Student username and teacher username are required' },
        { status: 400 }
      );
    }

    // Find the student by username
    const student = await Student.findOne({ username: studentUsername });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Fetch the 7-day behavior data
    const behaviorData = await student.get7DayBehaviorData(teacherUsername);

    // Calculate attendance data for the teacher
    const recentAttendanceData = student.attendanceData.filter(
      (data: any) => data.teacherUsername === teacherUsername
    );

    const totalClasses = recentAttendanceData.length;
    const totalAttendance = recentAttendanceData.reduce(
      (acc: number, entry: any) => acc + (entry.attendance ? 1 : 0),
      0
    );

    // Calculate attendance percentage
    const attendancePercentage = totalClasses > 0 ? (totalAttendance / totalClasses) * 100 : 0;

    // Fallback to average of all behavior data if the last 7 days' data is not available
    if (
      behaviorData.hand_raising === 0 &&
      behaviorData.reading === 0 &&
      behaviorData.turn_around === 0 &&
      behaviorData.looking_forward === 0 &&
      behaviorData.writing === 0 &&
      behaviorData.using_phone === 0 &&
      behaviorData.sleeping === 0
    ) {
      const allBehaviorData = student.behaviorData.filter(
        (data: any) => data.teacherUsername === teacherUsername
      );

      if (allBehaviorData.length === 0) {
        return NextResponse.json(
          { message: 'No behavior data found for this teacher' },
          { status: 404 }
        );
      }

      const avgBehavior = allBehaviorData.reduce(
        (acc: any, data: any, _, { length }) => {
          acc.hand_raising += data.hand_raising / length;
          acc.reading += data.reading / length;
          acc.turn_around += data.turn_around / length;
          acc.looking_forward += data.looking_forward / length;
          acc.writing += data.writing / length;
          acc.using_phone += data.using_phone / length;
          acc.sleeping += data.sleeping / length;
          return acc;
        },
        {
          hand_raising: 0,
          reading: 0,
          turn_around: 0,
          looking_forward: 0,
          writing: 0,
          using_phone: 0,
          sleeping: 0,
        }
      );

      return NextResponse.json({ behaviorData: avgBehavior, attendancePercentage });
    }

    return NextResponse.json({ behaviorData, attendancePercentage });

  } catch (error) {
    console.error('Error fetching behavior data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
