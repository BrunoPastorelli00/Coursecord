import { MdOutlinePersonAddAlt } from 'react-icons/md';
import IconButton from '@/components/buttons/iconButton';
import { useEffect } from 'react';
import AddExistingUser from './AddNewUser';
import { SessionWithToken, User } from '@/types';
import {
  deleteUserFromCourse,
  getCourseManagementInfo,
} from '@/services/apiClientService';
import { useSession } from 'next-auth/react';
import UserTable from './UserTable';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  addCourse,
  removeUserFromCourse,
} from '@/store/slices/managementSlice';

type CourseManagementProps = {
  courseId: string;
  showNewUserModal: (
    role: 'student' | 'instructor',
    users: { [key: string]: User }[]
  ) => void;
  showNewUser: boolean;
  setShowNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  role: string;
  existingUsers: User[];
};

export default function CourseManagement(props: CourseManagementProps) {
  const {
    courseId,
    showNewUserModal,
  } = props;

  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.management.cachedCourses);

  useEffect(() => {
    (async () => {
      if (!courses[courseId]) {
        const course = await getCourseManagementInfo(
          courseId,
          session as SessionWithToken
        );
        dispatch(addCourse(course));
      }
    })();
  }, []);

  async function removeUser(role: string, userId: string) {
    try {
      dispatch(removeUserFromCourse({ role, userId, courseId }));

      const userDeleted = await deleteUserFromCourse(
        courseId,
        role,
        userId,
        session as SessionWithToken
      );
      if (userDeleted) console.log(`${role} removed from course`);
      else window.alert('Something went wrong');
    } catch (error) {
      console.error('handleDelete - error :>> ', error);
    }
  }

  return (
    <>
      <div className='flex flex-row gap-4 align-middle justify-around'>
        <h1 className='text-2xl font-bold text-center my-auto drop-shadow-lg'>
          {courses[courseId]?.title} Course{' '}
        </h1>
        <div className='flex flex-col gap-2 align-middle justify-evenly w-1/4'></div>
      </div>

      {courses[courseId] != null && (
        <div className='mt-5 mx-auto'>
          <div className='flex items-center mb-5 justify-between'>
            <h2 className='text-xl font-semibold'>Instructors:</h2>
            <div>
              <IconButton
                icon={<MdOutlinePersonAddAlt />}
                title='Add New User'
                onClick={() =>
                  showNewUserModal('instructor', courses[courseId].instructors)
                }
              ></IconButton>
            </div>
          </div>
          <UserTable
            users={courses[courseId].instructors}
            type='instructor'
            removeUser={removeUser}
          />

          <div className='flex items-center my-5 justify-between'>
            <h2 className='text-xl font-semibold'>Students:</h2>
            <div>
              <IconButton
                icon={<MdOutlinePersonAddAlt />}
                title='Add New User'
                onClick={() =>
                  showNewUserModal('student', courses[courseId].students)
                }
              ></IconButton>
            </div>
          </div>
          <UserTable
            users={courses[courseId].students}
            type='student'
            removeUser={removeUser}
          />
        </div>
      )}
    </>
  );
}
