import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
      confirmButtonText: "Yes, proceed",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({
          parcelId: parcel._id,
          newStatus: nextStatus,
        });
      }
    });
  };

  if (isLoading) return <p>Loading pending deliveries...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Pending Deliveries</h2>
      {deliveries.length === 0 ? (
        <p>No pending deliveries assigned to you.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Tracking ID</th>
              <th className="border px-4 py-2">Receiver</th>
              <th className="border px-4 py-2">Delivery Address</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Delivery Status</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((parcel) => (
              <tr key={parcel._id}>
                <td className="border px-4 py-2">{parcel.tracking_id}</td>
                <td className="border px-4 py-2">{parcel.receiverName}</td>
                <td className="border px-4 py-2">{parcel.receiverAddress}</td>
                <td className="border px-4 py-2">{parcel.status}</td>
                <td className="border px-4 py-2">{parcel.delivery_status}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  {parcel.delivery_status === "rider_assigned" && (
                    <button
                      onClick={() => handleUpdateStatus(parcel, "in_transit")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Mark as Picked Up
                    </button>
                  )}
                  {parcel.delivery_status === "in_transit" && (
                    <button
                      onClick={() => handleUpdateStatus(parcel, "delivered")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingDeliveries;
