import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import useAuth from "./../../Hooks/useAuth";
import Swal from "sweetalert2";
import  axios  from 'axios';
import useAxios from "../../Hooks/useAxios";

const Register = () => {
  const { setUser, createUser, signInWithGoogle, updateProfileUser } = useAuth();
  const [profilePic , setProfile] = useState('');
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    //create user with email and password
    createUser(data.email, data.password)
      .then( async() => {

        const userInfo = {
          email : data.email,
          role : 'user',
          created_at : new Date().toISOString(),
          last_log_in : new Date().toISOString(),
        }

        await axiosInstance.post('/users' , userInfo);

        const profile = {
          displayName: data.name,
          photoURL: profilePic
        };
        updateProfileUser(profile)
          .then(() => {
            setUser((prevUser) => ({
              ...prevUser,
              displayName: data.name,
              photoURL: profilePic
            }));
          })
          .catch((error) => {
            console.error("Error updating profile:", error);
            Swal.fire({
              title: "Profile Update Failed",
              text: error.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          });
        navigate("/");
        Swal.fire({
          title: "Registration Successful",
          text: "You have successfully registered.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Registration Failed",
          text: err.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleSignIn = () => {
    //sign in with google
    signInWithGoogle()
      .then(async(result) => {
        const data = result.user;
        const userInfo = {
          email : data.email,
          role : 'user',
          created_at : new Date().toISOString(),
          last_log_in : new Date().toISOString(),
        }

        await axiosInstance.post('/users' , userInfo);
        
        navigate("/");
        Swal.fire({
          title: "Login Successful",
          text: "You have successfully logged in with Google.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Login Failed",
          text: err.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleImageUpload =async( e )=> {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image' , image);
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,formData)
    setProfile(response.data.data.url)
  }
  return (
    <div>
      <div className="p-10">
        <div className="w-full md:w-[60%]">
          <div className="w-full">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Create an Account
            </h1>
            <p className="text-lg text-gray-600 mb-4">Regster with Profast</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  {...register("name", { 
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    minLength: {
                      value: 5,
                      message: "Minimum 5 characters or longer",
                    },
                    maxLength: {
                      value: 50,
                      message: "Maximum 18 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s'-]{2,50}$/,
                      message:
                        "Name can only contain letters, spaces, apostrophes, and hyphens",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-400">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  placeholder="Enter Your Profile picture"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  {...register("email", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message:
                        "Please enter a valid email address (e.g., name@example.com)",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  {...register("password", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                      message:
                        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-400">{errors.password.message}</p>
                )}
              </div>

              <input
                type="submit"
                className="w-full mt-4 btn btn-primary text-black font-medium py-3 px-4 rounded-lg transition duration-200"
                value="Register"
              />
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have any account?{" "}
              <Link
                to="/login"
                className="text-lime-600 hover:text-lime-800 font-medium"
              >
                Login
              </Link>
            </p>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              <FcGoogle className="text-xl" />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
