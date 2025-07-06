import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './../../../Components/Loading';
import { FaEye, FaTrash, FaMoneyBillWave } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const AllMyParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: parcels = [], isPending, refetch } = useQuery({
    queryKey: ['myParcels', user.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/parcels?email=${user.email}`);
      return response.data;
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const email = user.email;
        const res = await axiosSecure.delete(`/parcels/${id}`,{
          data : {email}
        });
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "Your parcel has been deleted.",
            icon: "success"
          });
        }
      }
    });
  };

  const handlePay = (id) => {
    Swal.fire({
      title: "Proceed to Payment",
      text: "You will be redirected to the payment gateway",
      icon: "info",
      confirmButtonText: "Continue",
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/dashboard/payment/${id}`)
      }
    });
  };

  const handleViewDetails = (parcel) => {
    Swal.fire({
      title: "Parcel Details",
      html: `
        <div class="text-left">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="font-semibold">Parcel Type:</p>
              <p>${parcel.type === 'document' ? 'Document' : 'Non-Document'}</p>
            </div>
            <div>
              <p class="font-semibold">Weight:</p>
              <p>${parcel.weight || 'N/A'} kg</p>
            </div>
            <div>
              <p class="font-semibold">Cost:</p>
              <p>৳${parcel.cost}</p>
            </div>
            <div>
              <p class="font-semibold">Status:</p>
              <p class="capitalize">${parcel.status}</p>
            </div>
          </div>
          <div class="mb-4">
            <p class="font-semibold">Tracking ID:</p>
            <p class="font-mono">${parcel.tracking_id}</p>
          </div>
          <div class="mb-4">
            <p class="font-semibold">Created At:</p>
            <p>${new Date(parcel.createdAt).toLocaleString()}</p>
          </div>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#22c55e"
    });
  };

  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Parcels</h1>
        <div className="badge badge-primary badge-lg">
          Total: {parcels.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Cost</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="btn btn-primary border-none">
                      {parcel.title }
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-neutral">
                      {parcel.type === 'document' ? 'Document' : 'Non-Doc'}
                    </div>
                  </div>
                </td>
                <td>
                  {new Date(parcel.createdAt).toLocaleDateString()}
                  <br />
                  <span className="text-sm text-gray-500">
                    {new Date(parcel.createdAt).toLocaleTimeString()}
                  </span>
                </td>
                <td>৳{parcel.cost}</td>
                <td>
                  <span className={`badge ${parcel.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {parcel.payment_status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDetails(parcel)}
                      className="btn btn-ghost btn-xs text-info"
                      title="View Details"
                    >
                      <FaEye size={20}/>
                    </button>
                    {parcel.payment_status === 'unpaid' && (
                      <button
                        onClick={() => handlePay(parcel._id)}
                        className="btn btn-ghost btn-xs text-success"
                        title="Pay Now"
                      >
                        <FaMoneyBillWave size={20}/>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="btn btn-ghost btn-xs text-error"
                      title="Delete"
                    >
                      <FaTrash size={20}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {parcels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No parcels found</p>
        </div>
      )}
    </div>
  );
};

export default AllMyParcel;