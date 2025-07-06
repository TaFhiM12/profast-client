import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiSearch, FiShield, FiUserX } from 'react-icons/fi';
import Loading from '../../Components/Loading';

const ManageAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');

  const {
    data: matchedUsers = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['searchUsers', searchTerm],
    enabled: !!searchTerm,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${searchTerm}`);
      return res.data;
    },
  });

  const selectedUser = matchedUsers.find((user) => user.email === selectedEmail);

  const handleMakeAdmin = async (email) => {
    const result = await Swal.fire({
      title: 'Make Admin?',
      text: `Do you want to make ${email} an admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#84cc16',
      confirmButtonText: 'Yes, make admin',
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/make-admin/${email}`);
        if (res.data.modifiedCount > 0) {
          Swal.fire('Success', `${email} is now an admin`, 'success');
          setSelectedEmail('');
          refetch();
        } else {
          Swal.fire('Failed', 'No changes were made.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong.', 'error');
        console.error(error);
      }
    }
  };

  const handleRemoveAdmin = async (email) => {
    const result = await Swal.fire({
      title: 'Remove Admin?',
      text: `Do you want to remove ${email} from admin role?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f87171',
      confirmButtonText: 'Yes, remove',
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/remove-admin/${email}`);
        if (res.data.modifiedCount > 0) {
          Swal.fire('Success', `${email} is no longer an admin`, 'success');
          setSelectedEmail('');
          refetch();
        } else {
          Swal.fire('Failed', 'No changes were made.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong.', 'error');
        console.error(error);
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-lime-600 mb-4">Manage Admin</h2>

      {/* Search input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by email (e.g. tafhim)"
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedEmail('');
          }}
        />
        <button
          className="btn btn-lime"
          disabled={!searchTerm || isFetching}
          onClick={refetch}
        >
          <FiSearch />
        </button>
      </div>

      {/* Dropdown of matched users */}
      {matchedUsers.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-600">Select User</label>
          <select
            className="select select-bordered w-full"
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
          >
            <option value="">-- Choose a user --</option>
            {matchedUsers.map((user) => (
              <option key={user.email} value={user.email}>
                {user.email} ({user.role})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected user info */}
      {selectedUser && (
        <div className="card bg-base-100 shadow p-4 border border-lime-200">
          <h3 className="text-lg font-semibold text-lime-700 mb-2">User Info</h3>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
          <p><strong>Created At:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
          <p><strong>Last Login:</strong> {new Date(selectedUser.last_log_in).toLocaleString()}</p>

          <div className="mt-4 flex gap-2">
            {selectedUser.role === 'user' || selectedUser.role === 'rider' ? (
              <button
                onClick={() => handleMakeAdmin(selectedUser.email)}
                className="btn btn-success btn-sm"
              >
                <FiShield className="mr-1" /> Make Admin
              </button>
            ) : (
              <button
                onClick={() => handleRemoveAdmin(selectedUser.email)}
                className="btn btn-error btn-sm"
              >
                <FiUserX className="mr-1" /> Remove Admin
              </button>
            )}
          </div>
        </div>
      )}

      {/* No match */}
      {searchTerm && matchedUsers.length === 0 && !isFetching && (
        <p className="text-gray-500 mt-4">No users found matching: {searchTerm}</p>
      )}
    </div>
  );
};

export default ManageAdmin;
