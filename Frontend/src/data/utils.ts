import { Users, Camera, Database, Settings } from "lucide-react";

export const attendanceData = [
  {
    id: "231b234",
    name: "Pushkar Chaturvedi",
    subject: "Computer Science",
    batch: "B9",
    status: "Present",
    time: "9:15 AM",
  },
  {
    id: "231b235",
    name: "Sarah Wilson",
    subject: "Computer Science",
    batch: "B9",
    status: "Present",
    time: "9:18 AM",
  },
  {
    id: "231b236",
    name: "Mike Chen",
    subject: "Computer Science",
    batch: "B9",
    status: "Absent",
    time: "-",
  },
  {
    id: "231b237",
    name: "Emma Davis",
    subject: "Computer Science",
    batch: "B9",
    status: "Present",
    time: "9:22 AM",
  },
  {
    id: "231b238",
    name: "James Brown",
    subject: "Computer Science",
    batch: "B9",
    status: "Present",
    time: "9:25 AM",
  },
];

export const lastDetection = {
  name: "Alex Johnson",
  enrollment: "231b356",
  time: "9:30 AM",
  avatar: "/professional-student-avatar.jpg",
};

export const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Users },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "database", label: "Database", icon: Database },
  { id: "settings", label: "Settings", icon: Settings },
];
