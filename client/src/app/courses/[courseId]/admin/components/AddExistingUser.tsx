import { DbUser, SessionWithToken, TRole } from '@/@types';
import React, { useEffect, useState } from 'react';
import { UserSelect } from './UserSelect';
import { RoleSelect } from './RoleSelect';
import IconButton from '@/components/buttons/iconButton';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import { useSession } from 'next-auth/react';



type AddUserProps = {
  courseId: string,
  setShowExistingUser:React.Dispatch<React.SetStateAction<boolean>>
  roles: TRole[]
}

export default function AddExistingUser({setShowExistingUser, courseId, roles}:AddUserProps) {
  const [potentialUsers, setPotentialUsers] = useState<DbUser[]>();
  const [selectedUser, setSelectedUser] = useState<DbUser>();
  const [selectedRole, setSelectedRole] = useState<TRole>();
  const session = useSession().data as SessionWithToken;
  console.log('session :>> ', session.accessToken);

  useEffect(() => {
    (async () => {
      try {
        const totalUsersRes = await fetch(`http://localhost:5000/6565c3bdf515f6ec9392f30e/users`); // TODO: replace with process.env.API_URL once orgId is dynamic
        const totalUsers:DbUser[] = await totalUsersRes.json();

        const instructorsRes = await fetch(`http://localhost:5000/${courseId}/instructors`); 
        const instructors:DbUser[] = await instructorsRes.json();
        const studentsRes = await fetch(`http://localhost:5000/${courseId}/students`); 
        const students:DbUser[] = await studentsRes.json();
        
        const existingUsersIds = [...instructors, ...students].map(user => user.id);
        const potentialUsers = totalUsers.filter(user => !existingUsersIds.includes(user.id));

        setPotentialUsers(potentialUsers);
      } catch (e) {
        console.error(e);
      }
    })();
    
  }, [courseId]);

  function closeModal() {
    setShowExistingUser(false);
  }

  function handleSubmit() {
    if (selectedUser && selectedRole) {
      console.log('selectedUser :>> ', selectedUser);
      console.log('selectedRole :>> ', selectedRole);
      console.log(`${process.env.API_URL || 'http://localhost:5000'}/user/${selectedUser.id}/${selectedRole.id}`)
      fetch(`${process.env.API_URL || 'http://localhost:5000'}/user/${selectedUser.id}/${selectedRole.id}`, {
        method:'PUT', 
        headers: {
          'Authorization': session.accessToken
        }
      })
        .then(res => {
          console.log('res :>> ', res);
          if (res.ok) closeModal(); 
          else throw new Error('Something went wrong!');
        })
        .catch(e => console.error(e))
    } else {
      window.alert('Please select a user and a role!');
    }
  }
  
  return (
    <div className='w-full h-full bg-slate-100 bg-opacity-50 absolute top-0 left-0 flex items-center justify-center'>
      <div className='w-1/3 h-1/3 bg-white rounded-lg shadow-lg p-8 fixed'>
        <div>
        <div className='cursor-pointer absolute right-6 top-4 text-xl' onClick={closeModal}>X</div>
          <h1 className='mx-auto text-center mt-2 mb-6 font-semibold text-2xl'>Add Existing User</h1>
          { 
          (
            !potentialUsers
           || !potentialUsers.length) 
           ? 
            <p>No new users found!</p> : 
            <div className='flex flex-col gap-4 justify-evenly'>
              <UserSelect users={potentialUsers} setSelectedUser={setSelectedUser}/> 
              <RoleSelect roles={roles} setRole={setSelectedRole}/>
            </div>
            }
            <IconButton icon={<MdOutlinePersonAddAlt/>} title='Submit' onClick={handleSubmit}/>
        </div>
      </div> 
    </div>
  );
}


