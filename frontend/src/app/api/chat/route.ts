import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { message ,username} = body;

  // Initialize a default response
  let response = "How can I help you?";

  // Use a switch statement to handle different messages
  switch (message.toLowerCase()) {
    case "hi":
      response = "How can I help you?";
      break;
    case "hey, how can i improve in class?":
      response = `Based on your behavior on 9/17/2024, here’s how you can improve:\n\n1. Stay more focused on the teacher or board to increase attention.\n2. Raise your hand more to actively participate.\n3. Take notes during class to reinforce learning.\n4. Avoid distractions like turning around to stay engaged.\n\nKeep up the good work with reading!`;
      break;
    case "thanks":
    case "thank you":
      response = "You're welcome! Let me know if you need any more help.";
      break;
    default:
      response = "I'm not sure how to respond to that. Could you clarify?";
      break;
  }

  return NextResponse.json({ response });
}
