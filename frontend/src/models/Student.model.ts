import mongoose, { Document, Schema } from 'mongoose';

// Define BehaviorData interface
interface BehaviorData {
  teacherUsername: string;
  date: Date;
  hand_raising: number;
  reading: number;
  turn_around: number;
  looking_forward: number;
  writing: number;
  using_phone: number;
  sleeping: number;
}

// Define IStudent interface
interface IStudent extends Document {
  username: string;
  password: string;
  role: 'student';
  teachers: mongoose.Schema.Types.ObjectId[];
  images: {
    front: string;
    left: string;
    right: string;
    up: string;
  };
  className: string;
  rollNumber:string;
  behaviorData: BehaviorData[];
  attendanceData: {
    teacherUsername: string;
    date: Date;
    attendance: boolean; // Indicates whether the student was present on this date
  }[];
  addBehaviorData(data: BehaviorData): Promise<void>;
  markAttendance(teacherUsername: string, date: Date, attendance: boolean): Promise<void>;
  get7DayBehaviorData(teacherUsername: string): Promise<any>;
}

// Define BehaviorData schema
const behaviorDataSchema = new Schema<BehaviorData>({
  teacherUsername: { type: String, required: true },
  date: { type: Date, required: true },
  hand_raising: { type: Number, default: 0 },
  reading: { type: Number, default: 0 },
  turn_around: { type: Number, default: 0 },
  looking_forward: { type: Number, default: 0 },
  writing: { type: Number, default: 0 },
  using_phone: { type: Number, default: 0 },
  sleeping: { type: Number, default: 0 },
});

// Define AttendanceData schema
const attendanceDataSchema = new Schema({
  teacherUsername: { type: String, required: true },
  date: { type: Date, required: true },
  attendance: { type: Boolean, required: true },
});

// Define Student schema
const studentSchema = new Schema<IStudent>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNumber:{
    type:String,
    unique:true,
  },
  className:{
    type:String,
  },
  role: { type: String, required: true, enum: ['student'] },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
  images: {
    front: { type: String, default: null },
    left: { type: String, default: null },
    right: { type: String, default: null },
    up: { type: String, default: null },
  },
  behaviorData: [behaviorDataSchema],
  attendanceData: [attendanceDataSchema],
});

// Method to add behavior data
studentSchema.methods.addBehaviorData = async function (data: BehaviorData): Promise<void> {
  this.behaviorData.push(data);
  await this.save();
};

// Method to mark attendance
studentSchema.methods.markAttendance = async function (
  teacherUsername: string,
  date: Date,
  attendance: boolean
): Promise<void> {
  const formattedDate = date.toISOString().split('T')[0];
  const existingAttendance = this.attendanceData.find(
    (entry: any) =>
      entry.teacherUsername === teacherUsername &&
      new Date(entry.date).toISOString().split('T')[0] === formattedDate
  );

  if (existingAttendance) {
    existingAttendance.attendance = attendance;
  } else {
    this.attendanceData.push({ teacherUsername, date, attendance });
  }

  await this.save();
};

// Method to get 7-day behavior data including total attendance
studentSchema.methods.get7DayBehaviorData = async function (
  teacherUsername: string
): Promise<any> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentBehaviorData = this.behaviorData.filter(
    (data: any) =>
      data.teacherUsername === teacherUsername && data.date >= sevenDaysAgo
  );

  const recentAttendanceData = this.attendanceData.filter(
    (data: any) =>
      data.teacherUsername === teacherUsername && data.date >= sevenDaysAgo
  );

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

  const behaviorTotals = recentBehaviorData.reduce(
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

  const totalAttendance = recentAttendanceData.reduce(
    (acc: any, entry: any) => acc + (entry.attendance ? 1 : 0),
    0
  );

  const avgBehavior = {
    hand_raising: behaviorTotals.hand_raising / recentBehaviorData.length,
    reading: behaviorTotals.reading / recentBehaviorData.length,
    turn_around: behaviorTotals.turn_around / recentBehaviorData.length,
    looking_forward: behaviorTotals.looking_forward / recentBehaviorData.length,
    writing: behaviorTotals.writing / recentBehaviorData.length,
    using_phone: behaviorTotals.using_phone / recentBehaviorData.length,
    sleeping: behaviorTotals.sleeping / recentBehaviorData.length,
    totalAttendance,
  };

  return avgBehavior;
};

// Method to get average behavior data for the last 7 days
studentSchema.methods.getStudentDetails = async function (): Promise<any> {
  const recentBehaviorData = this.behaviorData.slice(-7); // Get the last 7 entries
  const recentAttendanceData = this.attendanceData.slice(-7); // Get the last 7 attendance entries

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
  const behaviorDataToUse = recentBehaviorData.length < 7 ? this.behaviorData : recentBehaviorData;

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
    ...avgBehavior,
    totalAttendance: avgAttendance,
  };
};


// Export Student model
const Student =
  mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);
export default Student;
