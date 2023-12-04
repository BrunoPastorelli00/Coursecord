import { Router } from 'express';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';

const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);


router.get('/', Course.getCourses);
authRouter.post('/:orgId', Course.addCourse);
authRouter.put('/:courseId', Course.editCourse);
authRouter.delete('/:orgId/:courseId', Course.deleteCourse);

//USED BY CLIENT
router.get('/:orgId/course', Course.getCoursesByOrganisation);
authRouter.get('/:courseId/management', Course.getCourseManagementInfo);
router.get('/course', Course.getCourses);
router.get('/:courseId', Course.getCourseById);
//TILL HERE

authRouter.put('/:courseId/instructor/:userId', Course.addInstructorToCourse);
authRouter.put('/:courseId/student/:userId', Course.addStudentToCourse);

router.get('/:orgId/course', Course.getCoursesByOrganisation); //CAN DEFINITELY BE DELETED

export default router;
