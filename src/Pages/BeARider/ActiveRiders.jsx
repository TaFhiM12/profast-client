import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../Components/Loading';
import Swal from 'sweetalert2';
import { FiXCircle } from 'react-icons/fi';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const {user} = useAuth();

  const { data: activeRiders = [], isLoading, refetch } = useQuery({
    queryKey: ['activeRiders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/riders/active' , {
        email : user?.email
      });
      return res.data;
    },
  });

  const handleDeactivate = (id, name) => {
    Swal.fire({
      title: `Deactivate ${name}?`,
      text: 'Are you sure you want to deactivate this rider?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactivate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#84cc16', // lime
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/riders/deactivate/${id}`);
          refetch();
          Swal.fire('Deactivated!', `${name} has been deactivated.`, 'success');
        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'Something went wrong.', 'error');
        }
      }
    });
  };

  const filteredRiders = activeRiders.filter((rider) =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-lime-600 mb-4">Active Riders</h2>

      <input
        type="text"
        placeholder="Search by name..."
        className="input input-bordered w-full max-w-sm mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-lime-100 text-lime-800">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Region</th>
              <th>District</th>
              <th>Bike</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.phone}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>{rider.bike_brand}</td>
                <td>
                  <span className="badge badge-success capitalize">
                    {rider.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleDeactivate(rider._id, rider.name)}
                    className="btn btn-sm btn-outline btn-error"
                    title="Deactivate"
                  >
                    <FiXCircle size={20}/>
                  </button>
                </td>
              </tr>
            ))}
            {filteredRiders.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-gray-500 py-4">
                  No matching riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRiders;
