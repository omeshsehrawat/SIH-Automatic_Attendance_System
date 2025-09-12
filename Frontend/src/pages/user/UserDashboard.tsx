import  { useState, useEffect, type JSX } from 'react'
import { Calendar, Clock, BookOpen, BarChart3, ChevronRight, Filter, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

// TypeScript interfaces
interface SubjectSchedule {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  classStartTime: string;
  classEndTime: string;
  classDays: string[];
  instructor: string;
}

interface AttendanceRecord {
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'excellent' | 'good' | 'warning' | 'poor';
}

interface UserData {
  fullname: string;
  ern: string;
  batch: string;
  email: string;
  profilePic: string;
  subjectSchedules: SubjectSchedule[];
  attendance: AttendanceRecord[];
}

type ActiveTab = 'classes' | 'attendance';
type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type AttendanceStatus = 'excellent' | 'good' | 'warning' | 'poor';

function UserDashboard(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>('classes')
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Mock user data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUserData: UserData = {
        fullname: "John Doe",
        ern: "EN21CS001",
        batch: "2021-2025",
        email: "john.doe@example.com",
        profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        subjectSchedules: [
          {
            subjectId: "1",
            subjectCode: "CS101",
            subjectName: "Computer Science Fundamentals",
            classStartTime: "09:00",
            classEndTime: "11:00",
            classDays: ["Monday", "Wednesday", "Friday"],
            instructor: "Dr. Smith"
          },
          {
            subjectId: "2",
            subjectCode: "MATH201",
            subjectName: "Advanced Mathematics",
            classStartTime: "11:30",
            classEndTime: "13:00",
            classDays: ["Tuesday", "Thursday"],
            instructor: "Prof. Johnson"
          },
          {
            subjectId: "3",
            subjectCode: "PHY101",
            subjectName: "Physics Laboratory",
            classStartTime: "14:00",
            classEndTime: "16:00",
            classDays: ["Monday", "Wednesday"],
            instructor: "Dr. Brown"
          },
          {
            subjectId: "4",
            subjectCode: "ENG101",
            subjectName: "Technical Writing",
            classStartTime: "10:00",
            classEndTime: "11:30",
            classDays: ["Friday"],
            instructor: "Prof. Wilson"
          }
        ],
        attendance: [
          {
            subjectCode: "CS101",
            subjectName: "Computer Science Fundamentals",
            totalClasses: 45,
            attendedClasses: 42,
            percentage: 93.3,
            status: "excellent"
          },
          {
            subjectCode: "MATH201",
            subjectName: "Advanced Mathematics", 
            totalClasses: 30,
            attendedClasses: 24,
            percentage: 80.0,
            status: "good"
          },
          {
            subjectCode: "PHY101",
            subjectName: "Physics Laboratory",
            totalClasses: 36,
            attendedClasses: 25,
            percentage: 69.4,
            status: "warning"
          },
          {
            subjectCode: "ENG101",
            subjectName: "Technical Writing",
            totalClasses: 20,
            attendedClasses: 18,
            percentage: 90.0,
            status: "excellent"
          }
        ]
      }
      setUserData(mockUserData)
      setLoading(false)
    }, 1000)
  }, [])

  const getClassesForDay = (day: DayOfWeek): SubjectSchedule[] => {
    if (!userData) return []
    return userData.subjectSchedules
      .filter(schedule => schedule.classDays.includes(day))
      .sort((a, b) => a.classStartTime.localeCompare(b.classStartTime))
  }

  const getAttendanceColor = (status: AttendanceStatus): string => {
    switch (status) {
      case 'excellent': return 'bg-green-100 border-green-300 text-green-800'
      case 'good': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'warning': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      default: return 'bg-red-100 border-red-300 text-red-800'
    }
  }

  const getAttendanceIcon = (status: AttendanceStatus): JSX.Element => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'good': return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default: return <XCircle className="w-5 h-5 text-red-600" />
    }
  }

  const getProgressBarColor = (status: AttendanceStatus): string => {
    switch (status) {
      case 'excellent': return 'bg-gradient-to-r from-green-400 to-green-600'
      case 'good': return 'bg-gradient-to-r from-blue-400 to-blue-600'
      case 'warning': return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      default: return 'bg-gradient-to-r from-red-400 to-red-600'
    }
  }

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Failed to load user data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-2xl min-h-screen">
          {/* Profile Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src={userData.profilePic} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-4 border-blue-200 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{userData.fullname}</h2>
                <p className="text-blue-100 text-sm">{userData.ern}</p>
                <p className="text-blue-100 text-sm">{userData.batch}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6">
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab('classes')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                  activeTab === 'classes'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-semibold">Classes</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                  activeTab === 'attendance'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-semibold">Attendance</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'classes' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">My Classes</h1>
                  <p className="text-blue-100">View your class schedule by day</p>
                </div>
              </div>

              {/* Day Filter */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Filter by Day</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {daysOfWeek.map((day: DayOfWeek) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        selectedDay === day
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Classes for Selected Day */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Calendar className="w-7 h-7 text-blue-600" />
                  Classes for {selectedDay}
                </h3>
                
                {getClassesForDay(selectedDay).length > 0 ? (
                  <div className="grid gap-6">
                    {getClassesForDay(selectedDay).map((classItem: SubjectSchedule, index: number) => (
                      <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"></div>
                                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                  {classItem.subjectCode}
                                </span>
                              </div>
                              <h4 className="text-xl font-bold text-gray-800 mb-2">{classItem.subjectName}</h4>
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{classItem.instructor}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">
                                {formatTime(classItem.classStartTime)} - {formatTime(classItem.classEndTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                              <Calendar className="w-4 h-4 text-green-600" />
                              <span className="font-medium">{classItem.classDays.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Classes Today</h3>
                    <p className="text-gray-500">You don't have any classes scheduled for {selectedDay}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">My Attendance</h1>
                  <p className="text-blue-100">Track your attendance across all subjects</p>
                </div>
              </div>

              {/* Attendance Overview */}
              <div className="grid gap-6">
                {userData.attendance.map((subject: AttendanceRecord, index: number) => (
                  <div key={index} className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${getAttendanceColor(subject.status).replace('bg-', 'border-').replace('-100', '-200')}`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              {subject.subjectCode}
                            </span>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(subject.status)}`}>
                              {getAttendanceIcon(subject.status)}
                              <span className="capitalize">{subject.status}</span>
                            </div>
                          </div>
                          <h4 className="text-xl font-bold text-gray-800 mb-4">{subject.subjectName}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-800 mb-1">
                            {subject.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(subject.status)}`}
                            style={{ width: `${subject.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-gray-800">{subject.totalClasses}</div>
                          <div className="text-sm text-gray-600">Total Classes</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-green-600">{subject.attendedClasses}</div>
                          <div className="text-sm text-gray-600">Attended</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-red-600">{subject.totalClasses - subject.attendedClasses}</div>
                          <div className="text-sm text-gray-600">Missed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard