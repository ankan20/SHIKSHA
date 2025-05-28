// utils/generateFeedback.js

function generateDynamicComments(studentData:any) {
    const comments = [];
    const suggestions = [];
    const studentName = Object.keys(studentData)[0];
    const activities = studentData[studentName];
  
    // Define multiple templates for each activity based on 20-value ranges
    const templates = {
      hand_raising: {
        (0, 20): [
          {
            comment: `${studentName} raises their hand infrequently, indicating low participation.`,
            suggestion: `Encourage ${studentName} to participate more by asking open-ended questions and creating opportunities for them to contribute during class discussions.`
          },
          {
            comment: `${studentName} rarely participates by raising their hand. More engagement would be beneficial.`,
            suggestion: `Consider using techniques like small group discussions to help ${studentName} feel more comfortable participating.`
          },
          {
            comment: `${studentName} seldom raises their hand. Encouraging more participation could be helpful.`,
            suggestion: `Set specific participation goals with ${studentName} and provide positive reinforcement when they contribute.`
          }
        ],
        (20, 40): [
          {
            comment: `${studentName} raises their hand occasionally, showing moderate engagement.`,
            suggestion: `Provide ${studentName} with regular feedback on their participation to help maintain their current level of engagement.`
          },
          {
            comment: `${studentName} participates by raising their hand sometimes, reflecting moderate involvement.`,
            suggestion: `Encourage ${studentName} to continue participating and explore areas where they can contribute more actively.`
          },
          {
            comment: `${studentName} raises their hand sporadically. With a bit more effort, their engagement could improve.`,
            suggestion: `Have one-on-one discussions with ${studentName} to understand any barriers to participation and work on strategies to overcome them.`
          }
        ],
        (40, 60): [
          {
            comment: `${studentName} is fairly engaged in class, raising their hand frequently.`,
            suggestion: `Acknowledge ${studentName}'s participation and provide them with more opportunities to take on leadership roles or contribute in more significant ways.`
          },
          {
            comment: `${studentName} raises their hand regularly, indicating a good level of participation.`,
            suggestion: `Encourage ${studentName} to continue their positive participation and challenge them with more complex questions or tasks.`
          },
          {
            comment: `${studentName} is actively involved in discussions by frequently raising their hand.`,
            suggestion: `Consider involving ${studentName} in peer-teaching opportunities to further enhance their learning and contribution.`
          }
        ],
        (60, 80): [
          {
            comment: `${studentName} is actively participating, raising their hand often.`,
            suggestion: `Provide ${studentName} with advanced tasks or responsibilities to keep them engaged and challenged.`
          },
          {
            comment: `${studentName} frequently raises their hand, showing strong engagement.`,
            suggestion: `Recognize ${studentName}'s engagement and encourage them to help facilitate group discussions or activities.`
          },
          {
            comment: `${studentName} demonstrates solid class involvement through frequent hand-raising.`,
            suggestion: `Ensure ${studentName} receives appropriate feedback and encouragement to sustain their high level of participation.`
          }
        ],
        (80, 100): [
          {
            comment: `${studentName} is highly engaged and frequently raises their hand.`,
            suggestion: `Challenge ${studentName} with leadership roles or advanced projects to harness their high level of engagement.`
          },
          {
            comment: `${studentName} is very involved in class, consistently raising their hand.`,
            suggestion: `Encourage ${studentName} to mentor or assist other students to further their involvement and leadership skills.`
          },
          {
            comment: `${studentName} shows strong participation by frequently raising their hand.`,
            suggestion: `Provide ${studentName} with opportunities to lead class discussions or projects to maximize their potential.`
          }
        ]
      },
      reading: {
        (0, 20): [
          {
            comment: `${studentName} spends very little time reading, needing more focus on this activity.`,
            suggestion: `Encourage ${studentName} to set aside specific times for reading and provide them with engaging reading materials.`
          },
          {
            comment: `${studentName} seems to have minimal reading time. Encouraging more could improve their understanding.`,
            suggestion: `Set reading goals and track progress with ${studentName}, offering incentives or praise for meeting those goals.`
          },
          {
            comment: `${studentName} dedicates limited time to reading. More focus on this area could help.`,
            suggestion: `Provide ${studentName} with structured reading assignments and discuss the importance of regular reading.`
          }
        ],
        (20, 40): [
          {
            comment: `${studentName} dedicates a moderate amount of time to reading.`,
            suggestion: `Continue to support ${studentName}'s reading habits by recommending new materials and discussing their reading progress.`
          },
          {
            comment: `${studentName} is spending some time on reading, showing a fair commitment.`,
            suggestion: `Encourage ${studentName} to explore different genres or topics to maintain their interest in reading.`
          },
          {
            comment: `${studentName} has a balanced approach to reading but could benefit from spending a bit more time.`,
            suggestion: `Discuss with ${studentName} the benefits of increasing their reading time and set achievable goals for improvement.`
          }
        ],
        (40, 60): [
          {
            comment: `${studentName} spends a significant amount of time reading, showing dedication.`,
            suggestion: `Provide ${studentName} with advanced reading materials to further challenge their skills and maintain their interest.`
          },
          {
            comment: `${studentName} is focused on reading and dedicates considerable time to it.`,
            suggestion: `Encourage ${studentName} to share their insights or summaries of their readings with the class.`
          },
          {
            comment: `${studentName} spends a good portion of their time engaged in reading activities.`,
            suggestion: `Support ${studentName} in setting higher reading goals or exploring topics of greater interest.`
          }
        ],
        (60, 80): [
          {
            comment: `${studentName} is highly focused on reading.`,
            suggestion: `Consider offering ${studentName} opportunities to lead book discussions or projects based on their readings.`
          },
          {
            comment: `${studentName} dedicates a substantial amount of time to reading, showing commitment.`,
            suggestion: `Encourage ${studentName} to use their reading skills in other areas, such as research or writing.`
          },
          {
            comment: `${studentName} is regularly engaged in reading activities, which is commendable.`,
            suggestion: `Support ${studentName} in pursuing independent reading projects or advanced topics.`
          }
        ],
        (80, 100): [
          {
            comment: `${studentName} is deeply engaged with reading materials.`,
            suggestion: `Challenge ${studentName} with complex texts and encourage them to share their insights with peers.`
          },
          {
            comment: `${studentName} is very focused on reading, showing strong dedication.`,
            suggestion: `Encourage ${studentName} to mentor others in reading strategies or lead reading-related activities.`
          },
          {
            comment: `${studentName} shows a deep interest in reading, spending much time on it.`,
            suggestion: `Provide ${studentName} with opportunities to explore advanced reading topics or take on reading-related leadership roles.`
          }
        ]
      },
      turn_around: {
        (0, 20): [
          {
            comment: `${studentName} is focused on their own work.`,
            suggestion: `Encourage ${studentName} to collaborate more with peers to enhance their learning experience and social interactions.`
          },
          {
            comment: `${studentName} prefers to work independently, seldom interacting with peers.`,
            suggestion: `Create more group activities or pair work to help ${studentName} interact more with their classmates.`
          },
          {
            comment: `${studentName} is self-contained, focusing on their tasks without turning around.`,
            suggestion: `Incorporate peer discussions or group projects to help ${studentName} engage more with others.`
          }
        ],
        (20, 40): [
          {
            comment: `${studentName} occasionally turns around, showing a balance between focus and curiosity about their surroundings.`,
            suggestion: `Acknowledge ${studentName}'s occasional interactions and encourage more consistent engagement with peers.`
          },
          {
            comment: `${studentName} sometimes interacts with peers, indicating moderate engagement.`,
            suggestion: `Foster ${studentName}'s interaction by setting up collaborative activities or discussion groups.`
          },
          {
            comment: `${studentName} shows a healthy mix of focus and awareness of their peers by turning around occasionally.`,
            suggestion: `Encourage ${studentName} to continue their balanced approach and engage in more collaborative tasks.`
          }
        ],
        (40, 60): [
          {
            comment: `${studentName} frequently turns around, suggesting active engagement with peers.`,
            suggestion: `Support ${studentName}'s interactions by involving them in group activities and discussions.`
          },
          {
            comment: `${studentName} is often involved in class interactions, showing a high level of social engagement.`,
            suggestion: `Encourage ${studentName} to take on leadership roles in group activities or projects.`
          },
          {
            comment: `${studentName} regularly turns around, indicating a desire to participate in discussions or group activities.`,
            suggestion: `Foster ${studentName}'s engagement by involving them in collaborative projects or peer mentoring.`
          }
        ],
        (60, 80): [
          {
            comment: `${studentName} actively engages with their peers and turns around frequently.`,
            suggestion: `Provide ${studentName} with opportunities to lead group work or collaborative projects to further develop their social skills.`
          },
          {
            comment: `${studentName} shows strong social engagement by frequently turning around and interacting with peers.`,
            suggestion: `Encourage ${studentName} to use their interaction skills in peer-teaching or group leadership roles.`
          },
          {
            comment: `${studentName} demonstrates high engagement with peers, turning around regularly during class.`,
            suggestion: `Consider assigning ${studentName} more group responsibilities or leadership roles to leverage their strong social skills.`
          }
        ],
        (80, 100): [
          {
            comment: `${studentName} is highly engaged with peers, frequently turning around and interacting.`,
            suggestion: `Encourage ${studentName} to take on leadership roles or facilitate group discussions to further utilize their social engagement.`
          },
          {
            comment: `${studentName} shows exceptional social engagement by frequently turning around and participating with peers.`,
            suggestion: `Challenge ${studentName} with advanced collaborative projects or leadership roles to fully utilize their social skills.`
          },
          {
            comment: `${studentName} is very active in peer interactions, turning around often.`,
            suggestion: `Support ${studentName} in leading team activities or mentoring peers to capitalize on their high level of social engagement.`
          }
        ]
      },
      looking_forward: {
        (0, 20): [
          {
            comment: `${studentName} rarely looks forward, often distracted.`,
            suggestion: `Help ${studentName} focus better by creating a distraction-free learning environment and setting clear expectations.`
          },
          {
            comment: `${studentName} shows limited focus on the front, which could impact their learning.`,
            suggestion: `Encourage ${studentName} to participate more actively and provide strategies for improving focus.`
          },
          {
            comment: `${studentName} is frequently distracted and seldom looks forward.`,
            suggestion: `Implement strategies to help ${studentName} stay engaged, such as visual aids or interactive activities.`
          }
        ],
        (20, 40): [
          {
            comment: `${studentName} sometimes looks forward, indicating occasional focus.`,
            suggestion: `Encourage ${studentName} to maintain their focus by setting specific learning goals and providing regular feedback.`
          },
          {
            comment: `${studentName} shows moderate attention by occasionally looking forward.`,
            suggestion: `Support ${studentName} with techniques to improve sustained focus, such as structured breaks or goal-setting.`
          },
          {
            comment: `${studentName} is moderately attentive, looking forward at times.`,
            suggestion: `Discuss with ${studentName} strategies to enhance their focus and set incremental goals for improvement.`
          }
        ],
        (40, 60): [
          {
            comment: `${studentName} frequently looks forward, showing good attention to the front.`,
            suggestion: `Reinforce ${studentName}'s positive behavior by setting more challenging tasks or leadership opportunities.`
          },
          {
            comment: `${studentName} demonstrates a strong focus on the front, indicating good attention.`,
            suggestion: `Encourage ${studentName} to take on additional responsibilities or participate in advanced activities.`
          },
          {
            comment: `${studentName} consistently looks forward, showing high levels of attention.`,
            suggestion: `Provide ${studentName} with opportunities to share their insights or lead discussions to further utilize their focus.`
          }
        ],
        (60, 80): [
          {
            comment: `${studentName} shows strong focus by frequently looking forward.`,
            suggestion: `Challenge ${studentName} with complex tasks or projects to maintain their high level of engagement and focus.`
          },
          {
            comment: `${studentName} is highly attentive, looking forward regularly.`,
            suggestion: `Consider involving ${studentName} in leading classroom activities or mentoring peers to leverage their focus.`
          },
          {
            comment: `${studentName} demonstrates excellent attention to the front.`,
            suggestion: `Encourage ${studentName} to participate in advanced projects or take on leadership roles to further develop their skills.`
          }
        ],
        (80, 100): [
          {
            comment: `${studentName} is exceptionally focused, consistently looking forward.`,
            suggestion: `Leverage ${studentName}'s focus by involving them in high-level projects or leadership roles to maximize their potential.`
          },
          {
            comment: `${studentName} shows outstanding attention by always looking forward.`,
            suggestion: `Encourage ${studentName} to mentor others or lead class activities to utilize their exceptional focus.`
          },
          {
            comment: `${studentName} is highly attentive and consistently engaged with the front.`,
            suggestion: `Provide ${studentName} with challenging assignments or opportunities to lead discussions to fully harness their focus.`
          }
        ]
      },
      writing: {
        (0, 20): [
          {
            comment: `${studentName} writes very little, indicating possible disengagement.`,
            suggestion: `Encourage ${studentName} to participate more in writing tasks by providing engaging and relevant prompts.`
          },
          {
            comment: `${studentName} shows minimal writing activity, which could affect their learning.`,
            suggestion: `Set specific writing goals and offer positive reinforcement to motivate ${studentName} to write more.`
          },
          {
            comment: `${studentName} writes infrequently, which may impact their class performance.`,
            suggestion: `Provide ${studentName} with structured writing exercises and feedback to improve their writing habits.`
          }
        ],
        (20, 40): [
          {
            comment: `${studentName} engages in writing activities occasionally.`,
            suggestion: `Support ${studentName} with feedback on their writing and encourage regular practice to build their skills.`
          },
          {
            comment: `${studentName} writes moderately, showing some involvement in writing tasks.`,
            suggestion: `Encourage ${studentName} to explore different writing styles or topics to increase their engagement.`
          },
          {
            comment: `${studentName} demonstrates moderate writing activity.`,
            suggestion: `Provide ${studentName} with regular writing prompts and feedback to help them improve and stay engaged.`
          }
        ],
        (40, 60): [
          {
            comment: `${studentName} shows good writing habits, engaging in tasks frequently.`,
            suggestion: `Encourage ${studentName} to take on more challenging writing projects or share their work with the class.`
          },
          {
            comment: `${studentName} writes consistently, indicating a good level of engagement.`,
            suggestion: `Recognize ${studentName}'s writing efforts and provide them with opportunities to lead writing-related activities.`
          },
          {
            comment: `${studentName} is actively involved in writing tasks.`,
            suggestion: `Challenge ${studentName} with advanced writing assignments or collaborative writing projects to further develop their skills.`
          }
        ],
        (60, 80): [
          {
            comment: `${studentName} is highly engaged in writing, showing strong skills.`,
            suggestion: `Provide ${studentName} with opportunities to lead writing workshops or mentor peers in writing activities.`
          },
          {
            comment: `${studentName} writes frequently and with good quality.`,
            suggestion: `Encourage ${studentName} to undertake advanced writing projects or explore new genres to further their skills.`
          },
          {
            comment: `${studentName} demonstrates strong writing abilities.`,
            suggestion: `Leverage ${studentName}'s skills by involving them in peer review activities or advanced writing challenges.`
          }
        ],
        (80, 100): [
          {
            comment: `${studentName} shows exceptional writing skills, consistently producing high-quality work.`,
            suggestion: `Utilize ${studentName}'s writing prowess by assigning them leadership roles in writing projects or peer mentoring.`
          },
          {
            comment: `${studentName} is highly proficient in writing, consistently producing excellent work.`,
            suggestion: `Challenge ${studentName} with advanced writing assignments and consider them for leadership roles in writing-related activities.`
          },
          {
            comment: `${studentName} excels in writing, demonstrating exceptional skills.`,
            suggestion: `Provide ${studentName} with opportunities to showcase their writing skills through presentations or publication.`
          }
        ]
      },
      using_phone: {
        (0, 20): [
          {
            comment: `${studentName} rarely uses their phone during class.`,
            suggestion: `Continue to encourage ${studentName}'s positive behavior and ensure they stay focused on classroom activities.`
          },
          {
            comment: `${studentName} shows minimal phone usage, indicating good classroom focus.`,
            suggestion: `Reinforce ${studentName}'s positive behavior by acknowledging their attentiveness and setting goals for maintaining focus.`
          },
          {
            comment: `${studentName} does not use their phone much during class, reflecting good focus.`,
            suggestion: `Maintain ${studentName}'s current level of focus by providing engaging activities and regular feedback.`
          }
        ],
        (20, 40): [
          {
            comment: `${studentName} occasionally uses their phone, showing moderate focus.`,
            suggestion: `Discuss with ${studentName} the importance of limiting phone usage and offer strategies to stay focused during class.`
          },
          {
            comment: `${studentName} uses their phone occasionally, which could distract them.`,
            suggestion: `Set clear expectations for phone use and offer alternatives to help ${studentName} remain engaged in class activities.`
          },
          {
            comment: `${studentName} sometimes uses their phone, which may affect their attention.`,
            suggestion: `Encourage ${studentName} to set phone usage limits and provide strategies to enhance their classroom focus.`
          }
        ],
        (40, 60): [
          {
            comment: `${studentName} uses their phone frequently, which might impact their focus.`,
            suggestion: `Implement classroom rules regarding phone use and engage ${studentName} with activities that minimize distractions.`
          },
          {
            comment: `${studentName} demonstrates frequent phone usage during class.`,
            suggestion: `Discuss the impact of phone usage on learning with ${studentName} and encourage strategies to improve focus.`
          },
          {
            comment: `${studentName} frequently uses their phone, which could affect their attention span.`,
            suggestion: `Set clear guidelines for phone use and offer support to help ${studentName} stay engaged in class.`
          }
        ],
        (60, 80): [
          {
            comment: `${studentName} occasionally uses their phone but maintains a good level of focus.`,
            suggestion: `Encourage ${studentName} to continue managing phone use effectively and provide positive reinforcement for their focus.`
          },
          {
            comment: `${studentName} shows moderate phone usage but remains focused on class activities.`,
            suggestion: `Support ${studentName} in maintaining their current balance and offer strategies to manage phone use in a way that supports their learning.`
          },
          {
            comment: `${studentName} uses their phone occasionally but generally stays engaged.`,
            suggestion: `Acknowledge ${studentName}'s effective management of phone use and encourage them to continue their good habits.`
          }
        ],
        (80, 100): [
          {
            comment: `${studentName} uses their phone rarely, indicating strong focus.`,
            suggestion: `Continue to acknowledge ${studentName}'s excellent focus and provide opportunities for them to share strategies with peers.`
          },
          {
            comment: `${studentName} demonstrates minimal phone use, reflecting their strong concentration.`,
            suggestion: `Support ${studentName} by involving them in activities where they can use their focus skills to benefit others.`
          },
          {
            comment: `${studentName} rarely uses their phone during class, showcasing excellent focus.`,
            suggestion: `Encourage ${studentName} to mentor peers on effective focus strategies and continue their strong classroom performance.`
          }
        ]
      }
    };
  }
  