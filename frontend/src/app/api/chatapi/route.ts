import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect"; // Assuming you have a database connection utility
import Student from "@/models/Student.model"; // Your student schema
import axios from "axios";

export async function POST(request: NextRequest) {
  // Connect to the database
  await dbConnect();

  // Parse the request body
  const { username, message } = await request.json();

  try {
    // Find the student by ID
    const student = await Student.findOne({ username });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    // Get the student's behavior and attendance data
    const { avgBehavior, totalAttendance } =
      await getStudentDetails(student); // Modify with actual teacherUsername
    
    // Create a personalized prompt based on the student’s data and query
    const prompt = `
      Student details: 
      - Username: ${student.username}
      - Recent behavior: 
        Hand raising: ${avgBehavior.hand_raising},
        Reading: ${avgBehavior.reading},
        Turn around: ${avgBehavior.turn_around},
        Looking forward: ${avgBehavior.looking_forward},
        Writing: ${avgBehavior.writing},
        Using phone: ${avgBehavior.using_phone},
        Sleeping: ${avgBehavior.sleeping}
      - Attendance: ${totalAttendance}/7 days

      Student query: ${message}
    `;
    //call python backend to get response of ai
    const response = await axios.post('http://localhost:5001/chatbot', {
        prompt
      });
  
      // Return the response from the Python API
      return NextResponse.json({ response: response.data.response });
  } catch (error) {
    console.error("Error in chatbot route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


async function getStudentDetails(student :any): Promise<any> {
    
    const recentBehaviorData = student.behaviorData.slice(-7); // Get the last 7 entries
    const recentAttendanceData = student.attendanceData.slice(-7); // Get the last 7 attendance entries
    
    // If there are no behavior entries
    if (recentBehaviorData.length === 0) {
      return {
        hand_raising: 0,
        reading: 0,
        turn_around: 0,
        looking_forward: 0,
        writing: 0,
        using_phone: 0,
        sleeping: 0,
        totalAttendance: 0,
      };
    }
  
    // Calculate totals from behavior data
    const behaviorDataToUse = recentBehaviorData.length < 7 ? student.behaviorData : recentBehaviorData;
    const behaviorTotals = behaviorDataToUse.reduce(
      (acc: any, data: any) => {
        acc.hand_raising += data.hand_raising;
        acc.reading += data.reading;
        acc.turn_around += data.turn_around;
        acc.looking_forward += data.looking_forward;
        acc.writing += data.writing;
        acc.using_phone += data.using_phone;
        acc.sleeping += data.sleeping;
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
    
    // Calculate average behavior metrics based on the number of available data points
    const avgBehavior = {
      hand_raising: behaviorTotals.hand_raising / behaviorDataToUse.length,
      reading: behaviorTotals.reading / behaviorDataToUse.length,
      turn_around: behaviorTotals.turn_around / behaviorDataToUse.length,
      looking_forward: behaviorTotals.looking_forward / behaviorDataToUse.length,
      writing: behaviorTotals.writing / behaviorDataToUse.length,
      using_phone: behaviorTotals.using_phone / behaviorDataToUse.length,
      sleeping: behaviorTotals.sleeping / behaviorDataToUse.length,
    };
    
    // Calculate total attendance from the last 7 entries
    const totalAttendance = recentAttendanceData.reduce(
      (acc: any, entry: any) => acc + (entry.attendance ? 1 : 0),
      0
    );
  
    // If there are fewer than 7 attendance entries, calculate the average attendance
    const avgAttendance = recentAttendanceData.length > 0 
      ? totalAttendance / recentAttendanceData.length 
      : 0;
  
    return {
      avgBehavior,
      totalAttendance: avgAttendance,
    };
  };