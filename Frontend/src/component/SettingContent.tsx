import React, { useState, useEffect } from 'react';
import { CheckCircle, Search, XCircle, Users, BookOpen, Clock, User, Save } from 'lucide-react';

interface Student {
    _id: string;
    fullname: string;
    ern: string;
    batch: string;
    email: string;
    profilePic?: string;
    createdAt: string;
}

interface Subject {
    _id: string;
    Code: string;
    name: string;
    instructor: string;
    classTime: string;
    classDays: string[];
    students?: Student[];
}

interface AttendanceRecord {
    _id?: string;
    student: string;
    subject: string;
    date: string;
    status: 'Present' | 'Absent';
    time: string;
}

interface StudentWithAttendance extends Student {
    attendanceStatus?: 'Present' | 'Absent';
    attendanceTime?: string;
    attendanceId?: string;
}

const SettingsContent: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [students, setStudents] = useState<Student[]>([]);
    const [studentsWithAttendance, setStudentsWithAttendance] = useState<StudentWithAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [isMarkingMode, setIsMarkingMode] = useState<boolean>(false);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchStudentsBySubject(selectedSubject);
            fetchAttendanceForDate(selectedSubject, selectedDate);
        }
    }, [selectedSubject, selectedDate]);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/register/subjects', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch subjects');
            }

            const data = await response.json();
            setSubjects(data);
            if (data.length > 0) {
                setSelectedSubject(data[0]._id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentsBySubject = async (subjectId: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/register/subjects/${subjectId}/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }

            const data = await response.json();
            setStudents(data);
            console.log("Students fetched:", data);
            mergeStudentsWithAttendance(data, attendanceRecords);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch students');
        }
    };
    const fetchAttendanceForDate = async (subjectId: string, date: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/register/attendance/${subjectId}/${date}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const attendanceData = await response.json();
                setAttendanceRecords(attendanceData);
                mergeStudentsWithAttendance(students, attendanceData);
            } else {
                setAttendanceRecords([]);
                mergeStudentsWithAttendance(students, []);
            }
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setAttendanceRecords([]);
            mergeStudentsWithAttendance(students, []);
        }
    };

    // Merge students data with attendance data
    const mergeStudentsWithAttendance = (studentsList: Student[], attendanceList: AttendanceRecord[]) => {
        const studentsWithAtt: StudentWithAttendance[] = studentsList.map(student => {
            const attendanceRecord = attendanceList.find(att => att.student === student._id);
            return {
                ...student,
                attendanceStatus: attendanceRecord?.status || 'Absent',
                attendanceTime: attendanceRecord?.time || '',
                attendanceId: attendanceRecord?._id || ''
            };
        });
        setStudentsWithAttendance(studentsWithAtt);
    };

    const handleSubjectChange = (subjectId: string) => {
        setSelectedSubject(subjectId);
        setIsMarkingMode(false);
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setIsMarkingMode(false);
    };

    // Toggle attendance status for a student
    const toggleAttendanceStatus = (studentId: string) => {
        setStudentsWithAttendance(prev => 
            prev.map(student => 
                student._id === studentId 
                    ? { 
                        ...student, 
                        attendanceStatus: student.attendanceStatus === 'Present' ? 'Absent' : 'Present',
                        attendanceTime: student.attendanceStatus === 'Absent' ? new Date().toLocaleTimeString() : ''
                    }
                    : student
            )
        );
    };

    // Save attendance records
    const saveAttendance = async () => {
        try {
            setSaveLoading(true);
            const attendanceData = studentsWithAttendance.map(student => ({
                student: student._id,
                subject: selectedSubject,
                date: selectedDate,
                status: student.attendanceStatus || 'Absent',
                time: student.attendanceTime || ''
            }));

            const response = await fetch('http://localhost:5000/api/attendance/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ attendanceRecords: attendanceData })
            });

            if (!response.ok) {
                throw new Error('Failed to save attendance');
            }

            setIsMarkingMode(false);
            // Refresh attendance data
            fetchAttendanceForDate(selectedSubject, selectedDate);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save attendance');
        } finally {
            setSaveLoading(false);
        }
    };

    const filteredStudents = studentsWithAttendance.filter((student) =>
        student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.ern.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedSubjectInfo = subjects.find(subject => subject._id === selectedSubject);

    // Calculate statistics
    const presentCount = studentsWithAttendance.filter(student => student.attendanceStatus === 'Present').length;
    const absentCount = studentsWithAttendance.filter(student => student.attendanceStatus === 'Absent').length;

    if (loading) {
        return (
            <div className="p-9 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-9">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    Error: {error}
                    <button 
                        onClick={() => setError('')}
                        className="ml-4 text-red-600 hover:text-red-800"
                    >
                        ×
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-9 space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
                <h1 className="text-2xl font-bold text-blue-900 mb-4">Attendance Management</h1>
                
                {/* Subject Selection and Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                            Select Subject
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => handleSubjectChange(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-blue-900 shadow-lg font-medium"
                        >
                            {subjects.map((subject) => (
                                <option key={subject._id} value={subject._id}>
                                    {subject.name} ({subject.Code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-blue-900 shadow-lg font-medium"
                        />
                    </div>
                    
                    {selectedSubjectInfo && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-2">Subject Details</h3>
                            <div className="space-y-1 text-sm text-blue-700">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>Instructor: {selectedSubjectInfo.instructor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Time: {selectedSubjectInfo.classTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>Students: {students.length}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-blue-900 shadow-lg placeholder-blue-400 font-medium"
                    />
                </div>
                <div className="flex gap-3">
                    {!isMarkingMode ? (
                        <button 
                            onClick={() => setIsMarkingMode(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 shadow-lg border border-green-500 font-medium"
                        >
                            <Users className="w-4 h-4" />
                            Mark Attendance
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button 
                                onClick={saveAttendance}
                                disabled={saveLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-all duration-200 shadow-lg border border-blue-500 font-medium"
                            >
                                <Save className="w-4 h-4" />
                                {saveLoading ? 'Saving...' : 'Save Attendance'}
                            </button>
                            <button 
                                onClick={() => setIsMarkingMode(false)}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 shadow-lg border border-gray-500 font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-200">
                <div className="bg-blue-600 p-4 border-b border-blue-500">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {selectedSubjectInfo ? `${selectedSubjectInfo.name} - Students` : 'Students'}
                        <span className="bg-blue-500 text-blue-100 px-2 py-1 rounded-full text-sm">
                            {filteredStudents.length}
                        </span>
                        {isMarkingMode && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm ml-2">
                                Marking Mode
                            </span>
                        )}
                    </h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="text-left p-4 font-semibold text-blue-900">Photo</th>
                                <th className="text-left p-4 font-semibold text-blue-900">Enrollment</th>
                                <th className="text-left p-4 font-semibold text-blue-900">Name</th>
                                <th className="text-left p-4 font-semibold text-blue-900">Email</th>
                                <th className="text-left p-4 font-semibold text-blue-900">Batch</th>
                                <th className="text-left p-4 font-semibold text-blue-900">Status</th>
                                <th className="text-left p-4 font-semibold text-blue-900">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-blue-500">
                                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="font-medium">No students found</p>
                                        <p className="text-sm text-blue-400 mt-1">
                                            {searchTerm ? 'Try adjusting your search terms' : 'No students registered for this subject'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student, index) => {
                                    const isPresent = student.attendanceStatus === 'Present';
                                    return (
                                        <tr
                                            key={student._id}
                                            className={`${index % 2 === 0 ? "bg-blue-50" : "bg-white"} hover:bg-blue-100 transition-colors border-b border-blue-200 last:border-b-0`}
                                        >
                                            <td className="p-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    {student.profilePic ? (
                                                        <img
                                                            src={`http://localhost:5000/${student.profilePic}`}
                                                            alt={student.fullname}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="w-5 h-5 text-blue-500" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-blue-700 font-mono text-sm font-medium">
                                                {student.ern}
                                            </td>
                                            <td className="p-4 text-blue-900 font-semibold">
                                                {student.fullname}
                                            </td>
                                            <td className="p-4 text-blue-700 font-medium text-sm">
                                                {student.email}
                                            </td>
                                            <td className="p-4 text-blue-700 font-medium">
                                                {student.batch}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => isMarkingMode && toggleAttendanceStatus(student._id)}
                                                    disabled={!isMarkingMode}
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                                                        isPresent 
                                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                                            : 'bg-red-100 text-red-800 border border-red-200'
                                                    } ${isMarkingMode ? 'hover:shadow-md cursor-pointer' : 'cursor-default'}`}
                                                >
                                                    {isPresent ? (
                                                        <CheckCircle className="w-3 h-3" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3" />
                                                    )}
                                                    {student.attendanceStatus}
                                                </button>
                                            </td>
                                            <td className="p-4 text-blue-700 font-mono text-sm font-medium">
                                                {student.attendanceTime || '-'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Statistics */}
            {studentsWithAttendance.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Present</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900 mt-1">
                            {presentCount}
                        </div>
                    </div>
                    
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <div className="flex items-center gap-2 text-red-700">
                            <XCircle className="w-5 h-5" />
                            <span className="font-semibold">Absent</span>
                        </div>
                        <div className="text-2xl font-bold text-red-900 mt-1">
                            {absentCount}
                        </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700">
                            <Users className="w-5 h-5" />
                            <span className="font-semibold">Total Students</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900 mt-1">
                            {studentsWithAttendance.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsContent;