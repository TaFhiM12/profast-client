import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const regions = [
  "Dhaka Division",
  "Chittagong Division",
  "Khulna Division",
  "Rajshahi Division",
  "Sylhet Division",
  "Barisal Division",
  "Rangpur Division",
  "Mymensingh Division",
];

const districtsByRegion = {
  "Dhaka Division": [
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
  "Chittagong Division": [
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
  "Khulna Division": ["Bagerhat",
      "Chuadanga",
      "Jashore",
      "Jhenaidah",
      "Khulna",
      "Kushtia",
      "Magura",
      "Meherpur",
      "Narail",
      "Satkhira",],
  "Rajshahi Division": ["Bogura",
      "Chapainawabganj",
      "Joypurhat",
      "Naogaon",
      "Natore",
      "Pabna",
      "Rajshahi",
      "Sirajganj",],
  "Sylhet Division": ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
  "Barisal Division": ["Barguna",
      "Barisal",
      "Bhola",
      "Jhalokathi",
      "Patuakhali",
      "Pirojpur",],
  "Rangpur Division": [
    "Dinajpur",
      "Gaibandha",
      "Kurigram",
      "Lalmonirhat",
      "Nilphamari",
      "Panchagarh",
      "Rangpur",
      "Thakurgaon",
  ],
  "Mymensingh Division": [
    "Jamalpur", "Mymensingh", "Netrokona", "Sherpur"
  ],
};

const BeARider = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [selectedRegion, setSelectedRegion] = useState("");
  const axiosSecure = useAxiosSecure();
  const districts = selectedRegion ? districtsByRegion[selectedRegion] : [];

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user?.displayName || "",
      email: user?.email || "",
      status: "pending",
      created_at: new Date().toISOString(),
    };

     axiosSecure
    .post("/riders", riderData)
    .then((res) => {
      if (res.data?.message === "User is exist") {
        return Swal.fire({
          icon: "info",
          title: "Already Applied!",
          text: "You have already submitted an application.",
        });
      }

      if (res.data?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your application is pending approval.",
        });
        reset();
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to submit application. Please try again. ${error.message}`,
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Be a Rider</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our team of professional riders and enjoy flexible working
            hours with competitive earnings.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Tell us about yourself
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || ""}
                    readOnly
                    className="input input-bordered text-black w-full bg-gray-100"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="input input-bordered text-black w-full bg-gray-100"
                  />
                </div>
              </div>

              {/* Age and Phone Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Age</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your age"
                    className={`input input-bordered w-full ${
                      errors.age ? "input-error" : ""
                    }`}
                    {...register("age", {
                      required: "Age is required",
                      min: {
                        value: 18,
                        message: "Minimum age is 18",
                      },
                    })}
                  />
                  {errors.age && (
                    <span className="text-error text-sm mt-1">
                      {errors.age.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`input input-bordered w-full ${
                      errors.phone ? "input-error" : ""
                    }`}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Invalid phone number",
                      },
                    })}
                  />
                  {errors.phone && (
                    <span className="text-error text-sm mt-1">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>

              {/* NID */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    National ID Card Number
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your NID number"
                  className={`input input-bordered w-full ${
                    errors.nid ? "input-error" : ""
                  }`}
                  {...register("nid", {
                    required: "NID is required",
                    pattern: {
                      value: /^[0-9]{10,17}$/,
                      message: "Invalid NID number (10-17 digits)",
                    },
                  })}
                />
                {errors.nid && (
                  <span className="text-error text-sm mt-1">
                    {errors.nid.message}
                  </span>
                )}
              </div>

              {/* Region and District Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Region</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.region ? "select-error" : ""
                    }`}
                    {...register("region", { required: "Region is required" })}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="">Select Region</option>
                    {regions.map((region, idx) => (
                      <option key={idx} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <span className="text-error text-sm mt-1">
                      {errors.region.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">District</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.district ? "select-error" : ""
                    }`}
                    {...register("district", {
                      required: "District is required",
                    })}
                    disabled={!selectedRegion}
                  >
                    <option value="">Select District</option>
                    {districts.map((district, idx) => (
                      <option key={idx} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <span className="text-error text-sm mt-1">
                      {errors.district.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Bike Details Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Bike Brand</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Yamaha, Honda"
                    className={`input input-bordered w-full ${
                      errors.bike_brand ? "input-error" : ""
                    }`}
                    {...register("bike_brand", {
                      required: "Bike brand is required",
                    })}
                  />
                  {errors.bike_brand && (
                    <span className="text-error text-sm mt-1">
                      {errors.bike_brand.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Bike Registration Number
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., DHAKA-METRO-HA-123456"
                    className={`input input-bordered w-full ${
                      errors.bike_registration ? "input-error" : ""
                    }`}
                    {...register("bike_registration", {
                      required: "Registration number is required",
                      pattern: {
                        value: /^[A-Za-z0-9-]+$/,
                        message: "Invalid registration number",
                      },
                    })}
                  />
                  {errors.bike_registration && (
                    <span className="text-error text-sm mt-1">
                      {errors.bike_registration.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Additional Information (Optional)
                  </span>
                </label>
                <textarea
                  placeholder="Any additional information you'd like to share"
                  className="textarea textarea-bordered w-full"
                  {...register("note")}
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full text-white bg-lime-500 hover:bg-lime-600 border-lime-500 hover:border-lime-600 text-lg py-3 h-auto"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>

          {/* Illustration Section */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="relative mx-auto w-80 h-80 bg-gradient-to-br from-lime-100 to-lime-200 rounded-full flex items-center justify-center mb-6">
                {/* Delivery Person Illustration */}
                <div className="relative">
                  {/* Helmet */}
                  <div className="w-16 h-16 bg-lime-500 rounded-full mx-auto mb-2 relative">
                    <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
                    <div className="absolute -right-1 top-1 w-4 h-4 bg-lime-600 rounded-full"></div>
                  </div>

                  {/* Head */}
                  <div className="w-12 h-12 bg-amber-200 rounded-full mx-auto mb-2 relative">
                    <div className="absolute top-3 left-3 w-1 h-1 bg-black rounded-full"></div>
                    <div className="absolute top-3 right-3 w-1 h-1 bg-black rounded-full"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-400 rounded-full"></div>
                  </div>

                  {/* Body */}
                  <div className="w-20 h-24 bg-lime-500 rounded-lg mx-auto mb-2 relative">
                    <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-400 rounded"></div>
                  </div>

                  {/* Package */}
                  <div className="absolute -right-8 top-8 w-8 h-8 bg-yellow-400 rounded transform rotate-12 border-2 border-yellow-500">
                    <div className="absolute inset-1 border border-yellow-600 rounded"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-500 rounded"></div>
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1 h-4 bg-red-500 rounded"></div>
                  </div>

                  {/* Motorcycle */}
                  <div className="mt-4">
                    <div className="w-24 h-12 bg-lime-600 rounded-lg mx-auto relative">
                      <div className="absolute -left-2 bottom-0 w-8 h-8 bg-black rounded-full"></div>
                      <div className="absolute -right-2 bottom-0 w-8 h-8 bg-black rounded-full"></div>
                      <div className="absolute left-2 bottom-2 w-4 h-4 bg-gray-300 rounded-full"></div>
                      <div className="absolute right-2 bottom-2 w-4 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Join Our Delivery Team!
                </h3>
                <p className="text-gray-600">
                  Become part of our growing network of professional riders and
                  enjoy flexible working hours, competitive earnings, and the
                  satisfaction of connecting people with their deliveries.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-lime-500 rounded-full mr-2"></span>
                    Flexible Schedule
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-lime-500 rounded-full mr-2"></span>
                    Good Earnings
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-lime-500 rounded-full mr-2"></span>
                    Support Team
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeARider;
