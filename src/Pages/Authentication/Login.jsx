import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";

const LoginPage = () => {
  const {signInUser , signInWithGoogle} = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignInWithGoogle = () => {
    signInWithGoogle()
    .then(async(result) => {

      const info = result.user;
        const userInfo = {
          email : info.email,
          role : 'user',
          created_at : new Date().toISOString(),
          last_log_in : new Date().toISOString(),
        }

      await axiosInstance.post('/users' , userInfo);

      navigate(from, { replace: true });
      Swal.fire({
        title: "Login Successful",
        text: "You have successfully logged in with Google.",
        icon: "success",
        confirmButtonText: "OK",
      }
      )
    })
    .catch((error) => {
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
  }


  const onSubmit = (data) => {
    signInUser(data.email , data.password)
    .then(() => {
      navigate(from, { replace: true });
      Swal.fire({
        title: "Login Successful",
        text: "You have successfully logged in.",
        icon: "success",
        confirmButtonText: "OK",
      });
    })
    .catch(err => {
      Swal.fire({
        title: "Login Failed",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    })
  };

  return (
    <div className="p-10">
      <div className="w-full md:w-[60%]">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600 mb-4">Login with Profast</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
                  type="password"
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

            <div className="flex justify-end">
              <Link
                to="/forgotPassword"
                className="text-sm text-lime-600 hover:text-lime-800 font-medium"
              >
                Forget Password?
              </Link>
            </div>

            <input
              type="submit"
              className="w-full btn btn-primary text-black font-medium py-3 px-4 rounded-lg transition duration-200"
              value="Login"
            />
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have any account?{" "}
            <Link
              to="/register"
              className="text-lime-600 hover:text-lime-800 font-medium"
            >
              Register
            </Link>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={handleSignInWithGoogle}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            <FcGoogle className="text-xl" />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
