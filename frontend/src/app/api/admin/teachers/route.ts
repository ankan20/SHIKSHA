
import connectDb from '@/utils/dbConnect'; // Ensure this path is correct
import Admin from '@/models/Admin.model'; // Adjust the import path based on your folder structure
import { NextResponse } from 'next/server';
import Teacher from '@/models/Teacher.model';
// Named export for the POST method
export async function POST(req: Request) {
    try {
      const { adminId } = await req.json(); // Use req.json() to parse JSON body
  
      if (!adminId) {
        return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
      }
  
      await connectDb();
  
      // Fetch the admin and populate the teachers field
      const admin = await Admin.findById(adminId).populate('teachers', 'username');
      if (!admin) {
        return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
      }
  
      return NextResponse.json({ teachers: admin.teachers }, { status: 200 });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }