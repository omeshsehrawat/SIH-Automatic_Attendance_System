import express from 'express';
import { upload } from '../util/store.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { getAllStudents, getAllSubjects, getStudentsBySubject, registerController, suggestStudents, suggestSubjects } from '../Controllers/registerController.js';
import { bulkCreateOrUpdateAttendance, deleteAttendance, getAttendanceBySubjectAndDate, getAttendanceSummary, getStudentAttendance } from '../Controllers/attendenceController.js';
const router = express.Router();



router.post('/', upload.single('image'), protectRoute,registerController);
router.get('/suggest/subject',protectRoute,suggestSubjects);
router.get('/suggest/students', protectRoute, suggestStudents);
router.get('/students', protectRoute, getAllStudents);
router.get('/subjects', protectRoute, getAllSubjects);
router.get('/subjects/:subjectId', protectRoute, getStudentsBySubject);
router.get('/attendance/:subjectId/:date', getAttendanceBySubjectAndDate);
router.post('/attendance/bulk', bulkCreateOrUpdateAttendance);
router.get('/attendance/summary/:subjectId', getAttendanceSummary);
router.get('/attendance/student/:studentId', getStudentAttendance);
router.delete('/attendance/:attendanceId', deleteAttendance);

export default router;
