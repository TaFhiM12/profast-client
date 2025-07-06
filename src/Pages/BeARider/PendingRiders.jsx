import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import Loading from '../../Components/Loading';
import { FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedRider, setSelectedRider] = useState(null);

  const { data: pendingRiders = [], isLoading, refetch } = useQuery({
    queryKey: ['pendingRiders'],
    queryFn: async () => {
      const response = await axiosSecure.get('/pending', {
        params: { email: user?.email },
      });
      return response.data;
    },
  });

  const approveRider = async (id , email) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to approve this rider!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve!',
      confirmButtonColor: '#84cc16', // lime-500
    });

    if (result.isConfirmed) {
      await axiosSecure.patch(`/riders/status/${id}` , {
        status : 'active',
        email : email
      });
      refetch();
      Swal.fire('Approved!', 'Rider has been approved.', 'success');
    }
  };

  const cancelRider = async (id , email) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to cancel this application!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel!',
      confirmButtonColor: '#dc2626', // red-600
    });

    if (result.isConfirmed) {
      await axiosSecure.patch(`/riders/status/${id}`,{
        status : 'reject',
        email : email
      });
      refetch();
      Swal.fire('Cancelled!', 'Rider application has been cancelled.', 'success');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-lime-600 mb-4">Pending Riders</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-lime-100 text-lime-800">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Bike</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRiders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>{rider.bike_brand}</td>
                <td>
                  <span className="badge badge-warning capitalize">
                    {rider.status}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-outline btn-lime"
                    onClick={() => setSelectedRider(rider)}
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-success"
                    onClick={() => approveRider(rider._id , rider.email)}
                  >
                    <FiCheckCircle size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => cancelRider(rider._id , rider.email)}
                  >
                    <FiXCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rider Details Modal */}
      {selectedRider && (
        <dialog id="rider_modal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg text-lime-600 mb-2">
              Rider Application Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Name:</strong> {selectedRider.name}</p>
              <p><strong>Email:</strong> {selectedRider.email}</p>
              <p><strong>Phone:</strong> {selectedRider.phone}</p>
              <p><strong>Age:</strong> {selectedRider.age}</p>
              <p><strong>NID:</strong> {selectedRider.nid}</p>
              <p><strong>Region:</strong> {selectedRider.region}</p>
              <p><strong>District:</strong> {selectedRider.district}</p>
              <p><strong>Bike Brand:</strong> {selectedRider.bike_brand}</p>
              <p><strong>Bike Reg:</strong> {selectedRider.bike_registration}</p>
              <p><strong>Status:</strong> {selectedRider.status}</p>
              <p className="sm:col-span-2"><strong>Note:</strong> {selectedRider.note}</p>
              <p className="sm:col-span-2 text-sm text-gray-500">
                <strong>Submitted:</strong>{' '}
                {new Date(selectedRider.created_at).toLocaleString()}
              </p>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setSelectedRider(null)}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
