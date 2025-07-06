import { Link, NavLink, useNavigate } from "react-router";
import ProfastLogo from "./ProfastLogo";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user , logOut } = useAuth();
  const navigate = useNavigate();
  const NavItems = (
    <>
      <li>
        <NavLink to='/'>Home</NavLink>
      </li>
      <li>
        <NavLink to='/coverage'>Coverage</NavLink>
      </li>
      <li>
        <NavLink to='/aboutUs'>About Us</NavLink>
      </li>
      <li>
        <NavLink to='/bearider'>Be A Rider</NavLink>
      </li>
    </>
  );

  const handleLogOut = () => {
    logOut()
    .then(() =>{
      Swal.fire({
        title: "Logout Successful",
        text: "You have successfully logged out.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate('/login');
    })
    .catch((error) => {
      Swal.fire({
        title: "Logout Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
  };
  return (
    <div className="navbar  bg-white rounded-2xl mt-2">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {NavItems}
          </ul>
        </div>
        <div className=" ml-6 mt-5">
            <ProfastLogo/>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {NavItems}
        </ul>
      </div>
      <div className="navbar-end">
        {
          user ? (
            <div className="flex items-center gap-4">
              <Link to='/dashboard' className="text-gray-700">{user.displayName}</Link>
              <button onClick={handleLogOut}  className="btn btn-primary">Logout</button>
            </div>
          ) :  <Link to='/login' className="btn btn-primary">Login</Link>
        }
      </div>
    </div>
  );
};

export default Navbar;
