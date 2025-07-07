import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import useTrackingLogger from "../../../Hooks/useTrackingLogger";
import LoginPage from './../../Authentication/Login';

const AddParcelForm = () => {
  const [showToast, setShowToast] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { logTracking } = useTrackingLogger();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (user?.displayName) {
      setValue("senderName", user.displayName);
    }
  }, [user, setValue]);

  const regions = [
    { id: "dhaka", name: "Dhaka Division" },
    { id: "chittagong", name: "Chittagong Division" },
    { id: "khulna", name: "Khulna Division" },
    { id: "rajshahi", name: "Rajshahi Division" },
    { id: "sylhet", name: "Sylhet Division" },
    { id: "barisal", name: "Barisal Division" },
    { id: "rangpur", name: "Rangpur Division" },
    { id: "mymensingh", name: "Mymensingh Division" },
  ];
  const serviceCenters = {
    dhaka: [
      "Dhaka",
      "Faridpur",
      "Gazipur",
      "Gopalganj",
      "Kishoreganj",
      "Madaripur",
      "Manikganj",
      "Munshiganj",
      "Narayanganj",
      "Narsingdi",
      "Rajbari",
      "Shariatpur",
      "Tangail",
    ],
    chittagong: [
      "Bandarban",
      "Brahmanbaria",
      "Chandpur",
      "Chattogram",
      "Cumilla",
      "Cox's Bazar",
      "Feni",
      "Khagrachhari",
      "Lakshmipur",
      "Noakhali",
      "Rangamati",
    ],
    khulna: [
      "Bagerhat",
      "Chuadanga",
      "Jashore",
      "Jhenaidah",
      "Khulna",
      "Kushtia",
      "Magura",
      "Meherpur",
      "Narail",
      "Satkhira",
    ],
    rajshahi: [
      "Bogura",
      "Chapainawabganj",
      "Joypurhat",
      "Naogaon",
      "Natore",
      "Pabna",
      "Rajshahi",
      "Sirajganj",
    ],
    sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
    barisal: [
      "Barguna",
      "Barisal",
      "Bhola",
      "Jhalokathi",
      "Patuakhali",
      "Pirojpur",
    ],
    rangpur: [
      "Dinajpur",
      "Gaibandha",
      "Kurigram",
      "Lalmonirhat",
      "Nilphamari",
      "Panchagarh",
      "Rangpur",
      "Thakurgaon",
    ],
    mymensingh: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
  };


  // Watch form values for cost calculation
  const watchedValues = watch();

  // Calculate delivery cost based on new pricing structure
  const calculateCost = (formData) => {
    let cost = 0;
    const isSameRegion = formData.senderRegion === formData.receiverRegion;
    const weight = parseFloat(formData.weight) || 0;

    if (formData.type === "document") {
      cost = isSameRegion ? 60 : 80;
    } else {
      // Non-document pricing
      if (weight <= 3) {
        cost = isSameRegion ? 110 : 150;
      } else {
        const extraWeight = weight - 3;
        cost = isSameRegion
          ? 110 + extraWeight * 40
          : 150 + extraWeight * 40 + 40; // Additional 40 for outside city
      }
    }

    return cost;
  };

  const onSubmit = (data) => {
    const cost = calculateCost(data);
    setCalculatedCost(cost);
    setShowToast(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const randomTrackingId = `ZAP-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const parcelData = {
        ...watchedValues,
        cost: calculatedCost,
        status: "pending",
        delivery_status: "not_collected",
        createdBy: user?.email,
        createdAt: new Date().toISOString(),
        payment_status: "unpaid",
        tracking_id : randomTrackingId
      };

      
      

      const response = await axiosSecure.post("/parcels", parcelData);


      if (response.data.insertedId) {
        await Swal.fire({
          title: "Parcel Booked Successfully!",
          html: `
            <div class="text-left">
              <p><strong>Tracking ID:</strong> ${parcelData.tracking_id}</p>
              <p><strong>Cost:</strong> ৳${calculatedCost}</p>
              <p><strong>Status:</strong> ${parcelData.status}</p>
            </div>
          `,
          icon: "success",
          confirmButtonText: "View My Parcels",
          confirmButtonColor: "#10b981",
        });

        await logTracking(
          {
            tracking_id: parcelData.tracking_id,
            status : "parcel_created",
            details : `created by ${user.displayName}`,
            updated_by : user?.email
          }
        )

        reset();
        navigate("/dashboard/myParcels");
      }
    } catch (error) {
      console.error("Error submitting parcel:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to book parcel. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
      setShowToast(false);
    }
  };

  const handleCancel = () => {
    setShowToast(false);
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lime-600 mb-2">Add Parcel</h1>
          <p className="text-lg text-base-content/70">
            Door to Door Delivery Service
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Parcel Information */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lime-600 text-xl mb-4">
                Parcel Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Parcel Type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Parcel Type *
                    </span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.type ? "select-error" : ""
                    }`}
                    {...register("type", {
                      required: "Parcel type is required",
                    })}
                  >
                    <option value="">Select parcel type</option>
                    <option value="document">Document</option>
                    <option value="non-document">Non-Document</option>
                  </select>
                  {errors.type && (
                    <span className="text-error text-sm mt-1">
                      {errors.type.message}
                    </span>
                  )}
                </div>

                {/* Parcel Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Parcel Title *
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter parcel title"
                    className={`input input-bordered w-full ${
                      errors.title ? "input-error" : ""
                    }`}
                    {...register("title", {
                      required: "Parcel title is required",
                    })}
                  />
                  {errors.title && (
                    <span className="text-error text-sm mt-1">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                {/* Weight (only for non-document) */}
                {watchedValues.type === "non-document" && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Weight (kg) *
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="Enter weight in kg"
                      className={`input input-bordered w-full ${
                        errors.weight ? "input-error" : ""
                      }`}
                      {...register("weight", {
                        required: "Weight is required for non-document parcels",
                        min: {
                          value: 0.1,
                          message: "Weight must be greater than 0",
                        },
                      })}
                    />
                    {errors.weight && (
                      <span className="text-error text-sm mt-1">
                        {errors.weight.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sender Information */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lime-600 text-xl mb-4">
                Sender Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sender Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Name *</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${
                      errors.senderName ? "input-error" : ""
                    }`}
                    readOnly
                    {...register("senderName", {
                      required: "Sender name is required",
                    })}
                  />
                  {errors.senderName && (
                    <span className="text-error text-sm mt-1">
                      {errors.senderName.message}
                    </span>
                  )}
                </div>

                {/* Sender Contact */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Contact *</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter contact number"
                    className={`input input-bordered w-full ${
                      errors.senderContact ? "input-error" : ""
                    }`}
                    {...register("senderContact", {
                      required: "Sender contact is required",
                    })}
                  />
                  {errors.senderContact && (
                    <span className="text-error text-sm mt-1">
                      {errors.senderContact.message}
                    </span>
                  )}
                </div>

                {/* Sender Region */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Region *</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.senderRegion ? "select-error" : ""
                    }`}
                    {...register("senderRegion", {
                      required: "Sender region is required",
                    })}
                  >
                    <option value="">Select region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {errors.senderRegion && (
                    <span className="text-error text-sm mt-1">
                      {errors.senderRegion.message}
                    </span>
                  )}
                </div>

                {/* Sender Service Center */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Service Center *
                    </span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.senderServiceCenter ? "select-error" : ""
                    }`}
                    {...register("senderServiceCenter", {
                      required: "Sender service center is required",
                    })}
                  >
                    <option value="">Select service center</option>
                    {watchedValues.senderRegion &&
                      serviceCenters[watchedValues.senderRegion]?.map(
                        (center) => (
                          <option key={center} value={center}>
                            {center}
                          </option>
                        )
                      )}
                  </select>
                  {errors.senderServiceCenter && (
                    <span className="text-error text-sm mt-1">
                      {errors.senderServiceCenter.message}
                    </span>
                  )}
                </div>

                {/* Sender Address */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Address *</span>
                  </label>
                  <textarea
                    placeholder="Enter pickup address"
                    className={`textarea textarea-bordered w-full ${
                      errors.senderAddress ? "textarea-error" : ""
                    }`}
                    rows={3}
                    {...register("senderAddress", {
                      required: "Sender address is required",
                    })}
                  />
                  {errors.senderAddress && (
                    <span className="text-error text-sm mt-1">
                      {errors.senderAddress.message}
                    </span>
                  )}
                </div>

                {/* Pickup Instructions */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Pickup Instructions *
                    </span>
                  </label>
                  <textarea
                    placeholder="Enter pickup instructions"
                    className={`textarea textarea-bordered w-full ${
                      errors.pickupInstructions ? "textarea-error" : ""
                    }`}
                    rows={2}
                    {...register("pickupInstructions", {
                      required: "Pickup instructions are required",
                    })}
                  />
                  {errors.pickupInstructions && (
                    <span className="text-error text-sm mt-1">
                      {errors.pickupInstructions.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Receiver Information */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lime-600 text-xl mb-4">
                Receiver Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Receiver Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter receiver name"
                    className={`input input-bordered w-full ${
                      errors.receiverName ? "input-error" : ""
                    }`}
                    {...register("receiverName", {
                      required: "Receiver name is required",
                    })}
                  />
                  {errors.receiverName && (
                    <span className="text-error text-sm mt-1">
                      {errors.receiverName.message}
                    </span>
                  )}
                </div>

                {/* Receiver Contact */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Contact *</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter contact number"
                    className={`input input-bordered w-full ${
                      errors.receiverContact ? "input-error" : ""
                    }`}
                    {...register("receiverContact", {
                      required: "Receiver contact is required",
                    })}
                  />
                  {errors.receiverContact && (
                    <span className="text-error text-sm mt-1">
                      {errors.receiverContact.message}
                    </span>
                  )}
                </div>

                {/* Receiver Region */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Region *</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.receiverRegion ? "select-error" : ""
                    }`}
                    {...register("receiverRegion", {
                      required: "Receiver region is required",
                    })}
                  >
                    <option value="">Select region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {errors.receiverRegion && (
                    <span className="text-error text-sm mt-1">
                      {errors.receiverRegion.message}
                    </span>
                  )}
                </div>

                {/* Receiver Service Center */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Service Center *
                    </span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.receiverServiceCenter ? "select-error" : ""
                    }`}
                    {...register("receiverServiceCenter", {
                      required: "Receiver service center is required",
                    })}
                  >
                    <option value="">Select service center</option>
                    {watchedValues.receiverRegion &&
                      serviceCenters[watchedValues.receiverRegion]?.map(
                        (center) => (
                          <option key={center} value={center}>
                            {center}
                          </option>
                        )
                      )}
                  </select>
                  {errors.receiverServiceCenter && (
                    <span className="text-error text-sm mt-1">
                      {errors.receiverServiceCenter.message}
                    </span>
                  )}
                </div>

                {/* Receiver Address */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Address *</span>
                  </label>
                  <textarea
                    placeholder="Enter delivery address"
                    className={`textarea textarea-bordered w-full ${
                      errors.receiverAddress ? "textarea-error" : ""
                    }`}
                    rows={3}
                    {...register("receiverAddress", {
                      required: "Receiver address is required",
                    })}
                  />
                  {errors.receiverAddress && (
                    <span className="text-error text-sm mt-1">
                      {errors.receiverAddress.message}
                    </span>
                  )}
                </div>

                {/* Delivery Instructions */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Delivery Instructions *
                    </span>
                  </label>
                  <textarea
                    placeholder="Enter delivery instructions"
                    className={`textarea textarea-bordered w-full ${
                      errors.deliveryInstructions ? "textarea-error" : ""
                    }`}
                    rows={2}
                    {...register("deliveryInstructions", {
                      required: "Delivery instructions are required",
                    })}
                  />
                  {errors.deliveryInstructions && (
                    <span className="text-error text-sm mt-1">
                      {errors.deliveryInstructions.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="btn btn-lg bg-lime-500 hover:bg-lime-600 text-white border-none px-12"
            >
              Calculate Cost & Submit
            </button>
          </div>
        </div>

        {/* Toast Modal */}
        {showToast && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card bg-base-100 shadow-2xl max-w-md w-full mx-4">
              <div className="card-body text-center">
                <h3 className="text-2xl font-bold text-lime-600 mb-4">
                  Delivery Cost
                </h3>
                <div className="text-4xl font-bold text-base-content mb-4">
                  ৳{calculatedCost}
                </div>
                <div className="text-left mb-4 p-4 bg-base-200 rounded-lg">
                  <p className="font-semibold">Pricing Details:</p>
                  <ul className="list-disc pl-5">
                    <li>
                      Type:{" "}
                      {watchedValues.type === "document"
                        ? "Document"
                        : "Non-Document"}
                    </li>
                    {watchedValues.type === "non-document" && (
                      <li>Weight: {watchedValues.weight} kg</li>
                    )}
                    <li>
                      Route:{" "}
                      {watchedValues.senderRegion ===
                      watchedValues.receiverRegion
                        ? "Within City"
                        : "Outside City"}
                    </li>
                  </ul>
                </div>
                <p className="text-base-content/70 mb-6">
                  Please confirm to proceed with the parcel booking
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleCancel}
                    className="btn btn-outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`btn bg-lime-500 hover:bg-lime-600 text-white border-none ${
                      isSubmitting ? "loading" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Confirming..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddParcelForm;
