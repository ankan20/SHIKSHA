
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface BehaviorData {
  hand_raising: number;
  reading: number;
  turn_around: number;
  looking_forward: number;
  writing: number;
  using_phone: number;
  sleeping: number;
  totalAttendance?: number;
}

const Marksheet: React.FC<{ marksheet: { [key: string]: number }; totalMarks: number | null }> = ({ marksheet, totalMarks }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Internal assessment Marksheet</h2>
      <ul className="space-y-2">
        {Object.entries(marksheet).map(([key, value]) => (
          <li key={key} className="bg-gray-700 p-2 rounded">
            {key.replace(/_/g, " ").toUpperCase()}: {value}
          </li>
        ))}
        {totalMarks !== null && (
          <div className="mt-2 text-lg font-semibold">Total Marks: {totalMarks} / 20</div>
        )}
      </ul>
    </div>
  );
};

// Function to calculate marks with negative values
const calculateMarksWithNegative = (studentData: BehaviorData) => {
  const goodRanges = [
    [15, 100, 5],
    [10, 14, 4],
    [5, 9, 3],
    [2, 4, 2],
    [0, 1, 1],
  ];

  const badRanges = [
    [25, 100, -2],
    [20, 24, -1.5],
    [15, 19, -1],
    [10, 14, -0.5],
    [5, 9, 0],
    [0, 4, 0],
  ];

  const goodBehaviors = ["hand_raising", "reading", "looking_forward", "writing"];
  const badBehaviors = ["turn_around", "using_phone", "sleeping"];

  let totalMarks = 0;
  const marksheet: { [key: string]: number } = {};

  for (const [activity, score] of Object.entries(studentData)) {
    if (goodBehaviors.includes(activity)) {
      for (const [low, high, marks] of goodRanges) {
        if (score >= low && score <= high) {
          marksheet[activity] = marks;
          totalMarks += marks;
          break;
        }
      }
    }

    if (badBehaviors.includes(activity)) {
      for (const [low, high, marks] of badRanges) {
        if (score >= low && score <= high) {
          marksheet[activity] = marks;
          totalMarks += marks;
          break;
        }
      }
    }
  }

  return { marksheet, totalMarks };
};

const generateInsights = (data: BehaviorData) => {
  const {
    hand_raising,
    reading,
    turn_around,
    looking_forward,
    writing,
    using_phone,
    sleeping,
  } = data;

  const insights: string[] = [];
  const actions: string[] = [];

  if (
    hand_raising === 0 &&
    reading === 0 &&
    turn_around === 0 &&
    looking_forward === 0 &&
    writing === 0 &&
    using_phone === 0 &&
    sleeping === 0 
    
  ) {
    insights.push('The student has zero recorded activity, indicating no attendance.');
    actions.push('Reach out to the student to understand the reasons for their absence and provide necessary support.');
    return { insights, actions };
  }


  // Hand Raising
  if (hand_raising >= 0 && hand_raising < 20) {
    insights.push('Student rarely raises their hand, indicating very low participation in class.');
    actions.push('Encourage student to participate in class discussions more actively.');
  } else if (hand_raising >= 20 && hand_raising < 40) {
    insights.push('Student raises their hand occasionally, showing moderate engagement.');
    actions.push('Consider providing more opportunities for the student to engage.');
  } else if (hand_raising >= 40 && hand_raising < 60) {
    insights.push('Student has a balanced participation rate, engaging reasonably well.');
    actions.push('Maintain current engagement strategies to keep the student involved.');
  } else if (hand_raising >= 60 && hand_raising < 80) {
    insights.push('Student frequently raises their hand, showing high participation in class.');
    actions.push('Acknowledge the student’s active participation, and challenge them with deeper questions.');
  } else if (hand_raising >= 80 && hand_raising <= 100) {
    insights.push('Student consistently raises their hand, demonstrating excellent engagement.');
    actions.push('Encourage the student to continue contributing and potentially mentor peers.');
  }

  // Reading
  if (reading >= 0 && reading < 20) {
    insights.push('Student shows very low engagement with reading tasks.');
    actions.push('Provide additional support and ensure reading materials are accessible.');
  } else if (reading >= 20 && reading < 40) {
    insights.push('Student demonstrates moderate engagement with reading tasks.');
    actions.push('Encourage consistent reading habits and provide interesting materials.');
  } else if (reading >= 40 && reading < 60) {
    insights.push('Student is adequately engaged in reading activities.');
    actions.push('Maintain the current level of support and motivation for reading.');
  } else if (reading >= 60 && reading < 80) {
    insights.push('Student shows high engagement with reading tasks.');
    actions.push('Offer advanced reading materials to challenge the student further.');
  } else if (reading >= 80 && reading <= 100) {
    insights.push('Student is very engaged with reading and excels in this area.');
    actions.push('Consider assigning leadership roles in reading activities or projects.');
  }

  // Turn Around
if (turn_around >= 0 && turn_around < 20) {
  insights.push('Prefers to work independently, seldom interacting with peers.');
  actions.push('Encourage and support the student’s preference for independent work while promoting balanced peer interaction.');
} else if (turn_around >= 20 && turn_around < 40) {
  insights.push('Occasionally turns around, showing a balance between focus and curiosity about their surroundings.');
  actions.push('Provide opportunities for collaborative work, while helping the student stay focused on tasks.');
} else if (turn_around >= 40 && turn_around < 60) {
  insights.push('Frequently turns around, suggesting active engagement with peers.');
  actions.push('Promote structured peer interaction while reinforcing the importance of staying on task.');
} else if (turn_around >= 60 && turn_around < 80) {
  insights.push('Is very social in class, frequently engaging with others around them.');
  actions.push('Encourage the student’s social skills but emphasize the need to balance socializing with focused classwork.');
} else if (turn_around >= 80 && turn_around <= 100) {
  insights.push('Turns around almost constantly, indicating a high level of social interaction.');
  actions.push('Foster a more focused learning environment, and discuss ways to reduce excessive socializing in class.');
}

  // Looking Forward
  if (looking_forward >= 0 && looking_forward < 20) {
    insights.push('Student rarely looks forward, indicating very low focus.');
    actions.push('Discuss with the student any issues affecting their focus, and consider seating adjustments.');
  } else if (looking_forward >= 20 && looking_forward < 40) {
    insights.push('Student occasionally looks forward, showing some focus but also distraction.');
    actions.push('Encourage more engagement and look into potential distractions.');
  } else if (looking_forward >= 40 && looking_forward < 60) {
    insights.push('Student maintains a moderate level of focus in class.');
    actions.push('Reinforce good focus habits and provide occasional breaks to maintain attention.');
  } else if (looking_forward >= 60 && looking_forward < 80) {
    insights.push('Student frequently looks forward, indicating good focus and attention.');
    actions.push('Continue reinforcing positive behaviours and offer additional challenges.');
  } else if (looking_forward >= 80 && looking_forward <= 100) {
    insights.push('Student consistently looks forward, demonstrating excellent focus.');
    actions.push('Encourage the student to maintain their high level of focus and reward their attention to detail.');
  }

  // Writing
  if (writing >= 0 && writing < 20) {
    insights.push('Student shows very low engagement in writing tasks.');
    actions.push('Provide additional support and ensure the student understands the writing assignments.');
  } else if (writing >= 20 && writing < 40) {
    insights.push('Student occasionally engages in writing tasks, showing some effort.');
    actions.push('Encourage the student to be more consistent with writing and provide engaging writing prompts.');
  } else if (writing >= 40 && writing < 60) {
    insights.push('Student is moderately engaged in writing tasks.');
    actions.push('Maintain current support levels and reinforce writing as a positive learning tool.');
  } else if (writing >= 60 && writing < 80) {
    insights.push('Student is highly engaged in writing tasks.');
    actions.push('Consider offering more advanced writing challenges to further develop the student’s skills.');
  } else if (writing >= 80 && writing <= 100) {
    insights.push('Student consistently excels in writing tasks, showing a strong command of writing skills.');
    actions.push('Encourage the student to participate in writing competitions or lead peer writing workshops.');
  }

  // Using Phone
  if (using_phone >= 0 && using_phone < 20) {
    insights.push('Student rarely uses their phone, showing strong focus.');
    actions.push('Continue reinforcing positive behaviours and reward focus.');
  } else if (using_phone >= 20 && using_phone < 40) {
    insights.push('Student occasionally uses their phone, which could indicate mild distraction.');
    actions.push('Monitor phone usage and provide reminders about class policies.');
  } else if (using_phone >= 40 && using_phone < 60) {
    insights.push('Student often uses their phone, suggesting moderate distraction.');
    actions.push('Discuss the impact of phone usage on learning and set clear boundaries.');
  } else if (using_phone >= 60 && using_phone < 80) {
    insights.push('Student frequently uses their phone, which indicates significant distraction.');
    actions.push('Implement strategies to minimize phone usage during class and consider setting consequences for excessive use.');
  } else if (using_phone >= 80 && using_phone <= 100) {
    insights.push('Student constantly uses their phone, showing very high distraction levels.');
    actions.push('Address phone usage directly with the student and establish a plan to reduce distractions.');
  }

  // Sleeping
  if (sleeping >= 0 && sleeping < 20) {
    insights.push('Student rarely sleeps in class, showing good energy levels.');
    actions.push('Encourage the student to maintain their positive energy levels and healthy sleep habits.');
  } else if (sleeping >= 20 && sleeping < 40) {
    insights.push('Student occasionally sleeps in class, suggesting mild fatigue.');
    actions.push('Discuss sleep habits with the student and encourage regular sleep schedules.');
  } else if (sleeping >= 40 && sleeping < 60) {
    insights.push('Student often sleeps in class, which may indicate moderate fatigue.');
    actions.push('Address potential issues such as sleep deprivation and offer strategies for staying alert.');
  } else if (sleeping >= 60 && sleeping < 80) {
    insights.push('Student frequently sleeps in class, showing significant signs of fatigue.');
    actions.push('Work with the student to identify underlying causes and create a plan to improve sleep hygiene.');
  } else if (sleeping >= 80 && sleeping <= 100) {
    insights.push('Student is constantly sleeping in class, showing very high levels of fatigue.');
    actions.push('Have a one-on-one discussion with the student and potentially involve parents or guardians to address the issue.');
  }
    return { insights, actions };
  }

  // Add insights and actions based on behavior data...

 


const StudentBehaviorPage: React.FC = () => {
  const router = useRouter();
  const { studentname } = useParams();
  let teacherUsername = "";

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      const userObject = JSON.parse(storedUser);
      teacherUsername = userObject.username || "";
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }

  const [behaviorData, setBehaviorData] = useState<BehaviorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState<number | null>(null);
  const [marksheet,setMarksheet] = useState<{ [key: string]: number }>({});
  const [totalMarks,setTotalMarks]= useState<any>(null);

  useEffect(() => {
    if (studentname && teacherUsername) {
      const fetchBehaviorData = async () => {
        try {
          const response = await fetch("/api/teacher-student-weekly-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentUsername: studentname, teacherUsername }),
          });

          const data = await response.json();
          console.log(data);
          if (response.ok) {
            setBehaviorData(data.behaviorData);
            const { insights, actions } = generateInsights(data.behaviorData);
            setInsights(insights);
            setActions(actions);
            setAttendancePercentage(data.attendancePercentage);
            const{ marksheet, totalMarks } = calculateMarksWithNegative(data.behaviorData);
            setMarksheet(marksheet);
            setTotalMarks(totalMarks);

          } else {
            setError("Failed to fetch behaviour data.");
          }
        } catch (err) {
          setError("An error occurred while fetching behaviour data.");
        } finally {
          setLoading(false);
        }
      };

      fetchBehaviorData();
    }
  }, [studentname, teacherUsername]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  // if(studentname =="abhisri" || studentname=="arijit" || studentname=="aishik"){
  //   return (
  //     <>
      
  //     <div className=" mt-40 flex items-center justify-center h-full p-6 bg-gray-800 text-white rounded-lg shadow-md w-[50%] ml-[20%]">
  //     <div className="text-center">
  //       <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
  //       <p className="text-gray-400">
  //         The student has not attended any class 
  //       </p>
  //     </div>
  //   </div>
  //     </>
  //   )
  // }
  if(!behaviorData){
     
     return (
       <>
      
       <div className=" mt-40 flex items-center justify-center h-full p-6 bg-gray-800 text-white rounded-lg shadow-md w-[50%]">
    <div className="text-center">
       <h2 className="text-xl font-semibold mb-2 ">No Data Available</h2>
         <p className="text-gray-400">
           The student has not attended any class 
         </p>
       </div>
     </div>
       </>
     )
   }
  if (error ) return <div className="text-red-500 text-center">{error}</div>;
 
  return (
    <div className="mt-32 min-w-3xl mx-auto p-6  text-white rounded-lg shadow-md space-y-6">
      <h1 className=" text-3xl font-bold text-center">Student Behaviour Insights</h1>

      {behaviorData && (
        <div className="bg-gray-800 p-4 rounded-lg shadow space-y-2">
          <h2 className="text-xl font-semibold mb-2">Behaviour Data</h2>
          <ul className="grid grid-cols-2 gap-4">
            <li className="bg-gray-700 p-2 rounded">Hand Raising: {behaviorData.hand_raising} %</li>
            <li className="bg-gray-700 p-2 rounded">Reading: {behaviorData.reading} %</li>
            <li className="bg-gray-700 p-2 rounded">Turn Around: {behaviorData.turn_around} %</li>
            <li className="bg-gray-700 p-2 rounded">Looking Forward: {behaviorData.looking_forward} %</li>
            <li className="bg-gray-700 p-2 rounded">Writing: {behaviorData.writing} %</li>
            <li className="bg-gray-700 p-2 rounded">Using Phone: {behaviorData.using_phone} %</li>
            <li className="bg-gray-700 p-2 rounded">Sleeping: {behaviorData.sleeping} %</li>
            {attendancePercentage !== null && (
              <li className="bg-gray-700 p-2 rounded">Total Attendance : {attendancePercentage} %</li>
            )}
          </ul>
        </div>
      )}
  <div className="flex  justify-evenly gap-4">
  <div className="bg-gray-800 p-4 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Insights</h2>
        <ul className="list-disc list-inside space-y-1">
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Actions</h2>
        <ul className="list-disc list-inside space-y-1">
          {actions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
  </div>
      
      <div className="bg-gray-800 p-4 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Behaviour Marks</h2>
        <Marksheet marksheet={marksheet} totalMarks={totalMarks} />
      </div>
      
    </div>
  );
};

export default StudentBehaviorPage;
