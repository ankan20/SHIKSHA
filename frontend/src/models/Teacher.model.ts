import mongoose, { Document, Schema } from 'mongoose';

interface INoiceDetection {
  noice: number;
  voice: number;
}

interface ITeacher extends Document {
  username: string;
  password: string;
  role: 'teacher';
  students: mongoose.Schema.Types.ObjectId[];
  noiceDetection: INoiceDetection[]; // Array of objects containing noice and voice
}

const noiceDetectionSchema = new Schema<INoiceDetection>({
  noice: { type: Number, required: true },
  voice: { type: Number, required: true },
});

const teacherSchema = new Schema<ITeacher>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['teacher'] },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  noiceDetection: [noiceDetectionSchema], // Array of noiceDetection objects
});

const Teacher = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', teacherSchema);

export default Teacher;
