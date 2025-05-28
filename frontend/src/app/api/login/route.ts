import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Student from '@/models/Student.model';
import Admin from '@/models/Admin.model';
import Teacher from '@/models/Teacher.model';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Select the model based on the role
    let user;
    switch (role) {
      case 'student':
        user = await Student.findOne({ username });
        break;
      case 'teacher':
        user = await Teacher.findOne({ username });
        break;
      case 'admin':
        user = await Admin.findOne({ username });
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid role specified.' },
          { status: 400 }
        );
    }

    // Simplified login logic: Check if user exists and password matches
    // Replace with proper password hashing and verification in production
    if (user && user.password === password) {
      // Set user session using cookies
      const response = NextResponse.json(
        {
          success: true,
          message: 'Login successful.',
          user: {
            id: user._id,
            username: user.username,
            role: user.role,
          },
        },
        { status: 200 }
      );

      // Create a session object
      const sessionData = { username: user.username, role: user.role };

      // Serialize session data into a cookie
      response.headers.set(
        'Set-Cookie',
        serialize('session', JSON.stringify(sessionData), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24, // 1 day
        })
      );

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error.' },
      { status: 500 }
    );
  }
}
