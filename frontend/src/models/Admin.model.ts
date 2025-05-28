import mongoose, { Document, Schema } from 'mongoose';

interface IAdmin extends Document {
  username: string;
  password: string;
  role: 'admin';
  teachers: mongoose.Schema.Types.ObjectId[];
}

const adminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin'] },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }]
});

const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);
export default Admin;