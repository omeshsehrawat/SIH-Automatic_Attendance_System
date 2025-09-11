import Attendance from "../model/attandence.model.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, status, time } = req.body;

    // Check if attendance for today already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = await Attendance.findOne({
      student: studentId,
      subject: subjectId,
      date: today,
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    // Create new attendance record
    const newAttendance = new Attendance({
      student: studentId,
      subject: subjectId,
      date: today,
      status,
      time,
    });

    await newAttendance.save();

    res.status(201).json({ message: "Attendance marked successfully", attendance: newAttendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAttendanceBySubjectAndDate = async (req, res) => {
  try {
    const { subjectId, date } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    const attendance = await Attendance.find({
      subject: subjectId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('student', 'fullname ern email batch profilePic');

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
};

// Create or update bulk attendance records
export const bulkCreateOrUpdateAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body;

    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ message: 'Invalid attendance data' });
    }

    const results = [];

    for (const record of attendanceRecords) {
      const { student, subject, date, status, time } = record;

      // Parse the date to get start and end of day for searching
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Check if attendance record already exists for this student, subject, and date
      const existingRecord = await Attendance.findOne({
        student,
        subject,
        date: {
          $gte: searchDate,
          $lte: endDate
        }
      });

      if (existingRecord) {
        // Update existing record
        existingRecord.status = status;
        existingRecord.time = time;
        const updated = await existingRecord.save();
        results.push(updated);
      } else {
        // Create new record
        const newRecord = new Attendance({
          student,
          subject,
          date: new Date(date),
          status,
          time
        });
        const saved = await newRecord.save();
        results.push(saved);
      }
    }

    res.status(200).json({ 
      message: 'Attendance records saved successfully', 
      records: results 
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ message: 'Error saving attendance records' });
  }
};

// Get attendance summary for a subject
export const getAttendanceSummary = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { startDate, endDate } = req.query;

    let dateFilter = { subject: subjectId };
    
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceRecords = await Attendance.find(dateFilter)
      .populate('student', 'fullname ern')
      .populate('subject', 'name Code');

    // Group by student
    const summary = {};
    attendanceRecords.forEach(record => {
      const studentId = record.student._id.toString();
      if (!summary[studentId]) {
        summary[studentId] = {
          student: record.student,
          present: 0,
          absent: 0,
          total: 0,
          percentage: 0
        };
      }
      
      if (record.status === 'Present') {
        summary[studentId].present++;
      } else {
        summary[studentId].absent++;
      }
      summary[studentId].total++;
      summary[studentId].percentage = Math.round((summary[studentId].present / summary[studentId].total) * 100);
    });

    res.status(200).json(Object.values(summary));
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
};

// Get student's attendance history
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId, startDate, endDate } = req.query;

    let filter = { student: studentId };
    
    if (subjectId) {
      filter.subject = subjectId;
    }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(filter)
      .populate('subject', 'name Code')
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ message: 'Error fetching student attendance' });
  }
};

// Delete attendance record
export const deleteAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    
    const deletedRecord = await Attendance.findByIdAndDelete(attendanceId);
    
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ message: 'Error deleting attendance record' });
  }
};

