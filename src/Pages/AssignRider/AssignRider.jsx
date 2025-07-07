import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  Package,
  User,
  MapPin,
  Truck,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";
import Swal from "sweetalert2";
import useTrackingLogger from "../../Hooks/useTrackingLogger";
import useAuth from "../../Hooks/useAuth";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const { logTracking } = useTrackingLogger();
  const {user} = useAuth();

  const {
    data: parcels = [],
    isLoading: loadingParcels,
    refetch: refetchParcels,
  } = useQuery({
    queryKey: [
      "parcels",
      { status: "pending", delivery_status: "not_collected" },
    ],
    queryFn: async () => {
      const res = await axiosSecure.get("/assignrider/parcels", {
        params: { status: "pending", delivery_status: "not_collected" },
      });
      return res.data;
    },
  });

  const { data: riders = [], isLoading: loadingRiders } = useQuery({
    enabled: !!selectedParcel,
    queryKey: ["riders", selectedParcel?.senderServiceCenter],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders", {
        params: {
          district: selectedParcel?.senderServiceCenter,
          work_status: "available", // Only fetch available riders
        },
      });
      return res.data;
    },
  });

  const handleAssignClick = (parcel) => {
    setSelectedParcel(parcel);
  };

  const handleCloseModal = () => {
    setSelectedParcel(null);
  };

  const handleAssignRider = async (rider) => {
    try {
      const res = await axiosSecure.patch(
        `/parcels/assign/${selectedParcel._id}`,
        {
          riderId: rider._id,
          riderName: rider.name,
          riderEmail: rider.email,
        }
      );

      if (res.data.parcelModified > 0 && res.data.riderModified > 0) {
        Swal.fire(
          "Success",
          "Rider assigned and parcel marked as in-transit!",
          "success"
        );

        
        // tracking history
        await logTracking({
          tracking_id: selectedParcel.tracking_id,
          status: "rider_assigned",
          details: `Assigned to ${rider.name}`,
          updated_by: user?.email,
        });

        refetchParcels(); // Refresh the parcels list
        handleCloseModal();
      } else {
        Swal.fire("Failed", "Could not update parcel or rider.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong.", err);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-green-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-lime-600 to-green-600 p-3 rounded-full shadow-lg">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Assign Rider to Parcels
          </h1>
          <p className="text-gray-600 text-lg">
            Manage parcel assignments and rider allocation efficiently
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loadingParcels ? (
            <LoadingSpinner />
          ) : parcels.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Pending Parcels
              </h3>
              <p className="text-gray-500">
                All parcels have been assigned or there are no pending parcels
                to assign.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tracking Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Sender Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Receiver Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {parcels.map((parcel, index) => (
                      <tr
                        key={parcel._id}
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-lime-600 mr-3" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {parcel.tracking_id}
                              </p>
                              <p className="text-xs text-gray-500">
                                Tracking ID
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {parcel.senderName}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {parcel.senderServiceCenter}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {parcel.receiverName}
                              </p>
                              <p className="text-xs text-gray-500">Receiver</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            {parcel.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleAssignClick(parcel)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-lime-600 to-green-600 text-white text-sm font-medium rounded-lg hover:from-lime-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Assign Rider
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {parcels.map((parcel) => (
                  <div
                    key={parcel._id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-lime-600 mr-2" />
                        <span className="font-semibold text-gray-900">
                          {parcel.tracking_id}
                        </span>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {parcel.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-gray-600">From:</span>
                        <span className="ml-1 font-medium">
                          {parcel.senderName}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-lime-600 mr-2" />
                        <span className="text-gray-600">Pickup:</span>
                        <span className="ml-1 font-medium">
                          {parcel.senderServiceCenter}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-gray-600">To:</span>
                        <span className="ml-1 font-medium">
                          {parcel.receiverName}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAssignClick(parcel)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-lime-600 to-green-600 text-white text-sm font-medium rounded-lg hover:from-lime-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Assign Rider
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Assign Rider Modal */}
        {selectedParcel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in duration-300">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-lime-600 to-green-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Assign Rider</h3>
                    <p className="text-lime-100 text-sm mt-1">
                      Parcel: {selectedParcel.tracking_id}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {loadingRiders ? (
                  <LoadingSpinner />
                ) : riders.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No Available Riders
                    </h3>
                    <p className="text-gray-500">
                      No available riders are currently in{" "}
                      <span className="font-semibold text-gray-700">
                        {selectedParcel.senderServiceCenter}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                      Available Riders in {selectedParcel.senderServiceCenter}
                    </h4>
                    {riders.map((rider) => (
                      <div
                        key={rider._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-lime-300 hover:bg-lime-50/50 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full mr-3">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {rider.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {rider.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignRider(rider)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Assign
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignRider;
