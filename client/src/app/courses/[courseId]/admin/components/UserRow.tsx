'use client';
import React from 'react';
import { MdOutlineRestoreFromTrash } from 'react-icons/md';
import { SessionWithToken } from '@/types';
import { useSession } from 'next-auth/react';
import { deleteUserFromCourse } from '@/services/apiClientService';

type UserRowProps = {
  user: { name: string; email: string; id: string };
  role: string;
  removeUser: (role: string, userId: string) => void;
};

export default function UserRow({
  user,
  role,
  removeUser,
}: UserRowProps): React.JSX.Element {

  return (
    <>
      <div className='flex flex-row justify-center col-span-1 gap-2 py-2 bg-white border-b border-primary-2 border-opacity-40'>
        <div
          className='cursor-pointer'
          onClick={() => removeUser(role, user.id)}
        >
          <MdOutlineRestoreFromTrash />
        </div>
      </div>
      <div className='col-span-2 py-2 text-center bg-white border-b border-primary-2 border-opacity-40'>
        {user.name}
      </div>
      <div className='col-span-2 py-2 text-center bg-white border-b border-primary-2 border-opacity-40'>
        {user.email}
      </div>
    </>
  );
}
