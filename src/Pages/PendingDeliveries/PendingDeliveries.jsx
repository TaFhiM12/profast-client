import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { FaTruck, FaBoxOpen, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import useTrackingLogger from "../../Hooks/useTrackingLogger";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {logTracking} =useTrackingLogger();

  const {
    data: deliveries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["riderPendingDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/rider/pending-deliveries", {
        params: { email: user.email },
      });
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcelId, newStatus }) => {
      const res = await axiosSecure.patch(`/parcel/status/${parcelId}`, {
        newStatus,
      });
      return res.data;
    },
    onSuccess: () => {

      queryClient.invalidateQueries(["riderPendingDeliveries", user.email]);
    },
    onError: () => {
      Swal.fire("Error", "Something went wrong", "error");
    },
  });

  const handleUpdateStatus = (parcel, nextStatus) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You are marking this parcel as '${nextStatus}'`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
    }).then(async(result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({
          parcelId: parcel._id,
          newStatus: nextStatus,
        });
      }
      let trackDetails = `picked up ${user.displayName}`;
      if(nextStatus == 'delivered'){
        trackDetails = `delivered by ${user.displayName}`
      }
      await logTracking(
          {
            tracking_id: parcel.tracking_id,
            status: nextStatus,
            details: trackDetails,
            updated_by: user?.email,
          }
        )
    });
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
    </div>
  );

  if (isError) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error: {error.message}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaTruck className="mr-2 text-lime-600" />
            Pending Deliveries
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-lime-100 text-lime-800">
            {deliveries.length} parcels
          </span>
        </div>
      </div>

      {deliveries.length === 0 ? (
        <div className="p-12 text-center">
          <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No pending deliveries</h3>
          <p className="mt-1 text-gray-500">You currently have no assigned deliveries.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receiver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((parcel) => (
                <tr key={parcel._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{parcel.tracking_id}</div>
                    <div className="text-sm text-gray-500">{parcel.receiverAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{parcel.receiverName}</div>
                    <div className="text-sm text-gray-500">{parcel.receiverContact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      parcel.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      parcel.status === 'delivered' ? 'bg-lime-100 text-lime-800' : 
                      'bg-lime-100 text-lime-800'
                    }`}>
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${
                        parcel.delivery_status === 'rider_assigned' ? 'bg-yellow-400' : 
                        parcel.delivery_status === 'in_transit' ? 'bg-lime-500' : 
                        'bg-lime-500'
                      }`}></div>
                      <div className="ml-2 text-sm text-gray-500 capitalize">{parcel.delivery_status.replace('_', ' ')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {parcel.delivery_status === "rider_assigned" && (
                      <button
                        onClick={() => handleUpdateStatus(parcel, "in_transit")}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        <FaArrowRight className="mr-1" /> Pick Up
                      </button>
                    )}
                    {parcel.delivery_status === "in_transit" && (
                      <button
                        onClick={() => handleUpdateStatus(parcel, "delivered")}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                      >
                        <FaCheckCircle className="mr-1" /> Deliver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;