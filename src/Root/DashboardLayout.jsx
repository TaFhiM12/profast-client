import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import ProfastLogo from "../Pages/Shared/ProfastLogo";
import {
  FiHome,
  FiPackage,
  FiPlus,
  FiList,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiSearch,
  FiBell,
  FiLogOut,
  FiTruck,
  FiMapPin,
  FiCreditCard,
  FiUser,
  FiMail,
  FiPhone,
  FiMap,
  FiBox,
  FiArchive,
  FiSettings,
  FiClock,
  FiUsers,
  FiShield,
  FiUserCheck,
  FiCheckCircle,
} from "react-icons/fi";
import useUserRole from "../Hooks/useUserRole";
import Loading from "../Components/Loading";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const { role, isLoading } = useUserRole();
  if (isLoading) {
    return <Loading />;
  }

  const handleMenuClick = (menuId, path) => {
    setActiveMenu(menuId);
    navigate(path);
  };

  const handleDropdownToggle = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <FiHome className="w-5 h-5" />,
      path: "/dashboard",
      badge: null,
    },
    {
      id: "parcels",
      name: "My Parcels",
      icon: <FiPackage className="w-5 h-5" />,
      hasDropdown: true,
      badge: null,
      children: [
        {
          name: "Send New Parcel",
          path: "/dashboard/addParcel",
          icon: <FiPlus className="w-4 h-4 mr-2" />,
        },
        {
          name: "All My Parcels",
          path: "/dashboard/myParcels",
          icon: <FiList className="w-4 h-4 mr-2" />,
        },
        {
          name: "Payment History",
          path: "/dashboard/paymentHistory",
          icon: <FiDollarSign className="w-4 h-4 mr-2" />,
        },
      ],
    },
    {
      id: "tracking",
      name: "Track Parcel",
      icon: <FiTruck className="w-5 h-5" />,
      path: "/dashboard/track",
      badge: null,
    },
  ];

  if (!isLoading && role === "rider") {
    menuItems.push(
      {
        id: "pendingDelivery",
        name: "Pending Delivery",
        icon: <FiClock className="w-5 h-5" />, // You can replace with another icon if needed
        path: "/dashboard/pending-delivery",
        badge: null,
      },
      {
        id: "completedDeliveries",
        name: "Completed Deliveries",
        icon: <FiCheckCircle className="w-5 h-5" />, // Use a success icon
        path: "/dashboard/completed-deliveries",
        badge: null,
      }
    );
  }
  if (!isLoading && role === "admin") {
    menuItems.push(
      {
        id: "activeRiders",
        name: "Active Riders",
        icon: <FiUsers className="w-5 h-5" />,
        path: "/dashboard/active-riders",
        badge: null,
      },
      {
        id: "pendingRiders",
        name: "Pending Riders",
        icon: <FiClock className="w-5 h-5" />,
        path: "/dashboard/pending-riders",
        badge: null,
      },
      {
        id: "assignRider",
        name: "Assign Rider",
        icon: <FiUserCheck className="w-5 h-5" />,
        path: "/dashboard/assign-rider",
        badge: null,
      },
      {
        id: "manageAdmin",
        name: "Manage Admin",
        icon: <FiShield className="w-5 h-5" />,
        path: "/dashboard/manage-admin",
        badge: null,
      }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div>
            <div className="flex items-center justify-between">
              <div className={`${!isSidebarCollapsed ? "ml-4 pt-2" : ""}`}>
                {!isSidebarCollapsed && (
                  <Link to="/">
                    <ProfastLogo />
                  </Link>
                )}
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.hasDropdown ? (
                <div>
                  <button
                    onClick={() => handleDropdownToggle(item.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-lime-50 hover:text-lime-600 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 group-hover:text-lime-500">
                        {item.icon}
                      </span>
                      {!isSidebarCollapsed && (
                        <>
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="bg-lime-100 text-lime-700 text-xs font-semibold px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {!isSidebarCollapsed &&
                      (activeDropdown === item.id ? (
                        <FiChevronUp className="w-4 h-4 transition-transform" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 transition-transform" />
                      ))}
                  </button>

                  {!isSidebarCollapsed && activeDropdown === item.id && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleMenuClick(`${item.id}-${index}`, child.path)
                          }
                          className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            activeMenu === `${item.id}-${index}`
                              ? "bg-lime-100 text-lime-700 font-medium border-r-2 border-lime-500"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                          }`}
                        >
                          {child.icon}
                          <span className="ml-2">{child.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleMenuClick(item.id, item.path)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors group w-full text-left ${
                    activeMenu === item.id
                      ? "bg-lime-100 text-lime-700 border-r-4 border-lime-500"
                      : "text-gray-700 hover:bg-lime-50 hover:text-lime-600"
                  }`}
                >
                  <span
                    className={`${
                      isSidebarCollapsed
                        ? "text-gray-500"
                        : "text-gray-500 group-hover:text-lime-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="bg-lime-100 text-lime-700 text-xs font-semibold px-2 py-1 rounded-full ml-auto">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center ${
                isSidebarCollapsed ? "mx-auto" : ""
              }`}
            >
              <span className="text-white font-semibold">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user?.displayName?.charAt(0).toUpperCase() || "U"
                )}
              </span>
            </div>
            {!isSidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{role}</p>
                </div>
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <FiLogOut className="w-4 h-4 text-gray-500" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeMenu === "dashboard" && "My Dashboard"}
                {activeMenu.startsWith("parcels") && "My Parcels"}
                {activeMenu === "tracking" && "Track Parcel"}
                {activeMenu === "addresses" && "My Addresses"}
                {activeMenu === "payments" && "Payment Methods"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {activeMenu === "dashboard" &&
                  "Welcome back! Track your shipments and manage your account"}
                {activeMenu.startsWith("parcels") &&
                  "View and manage all your parcels"}
                {activeMenu === "tracking" &&
                  "Track your parcel's delivery status"}
                {activeMenu === "addresses" && "Manage your saved addresses"}
                {activeMenu === "payments" &&
                  "View and manage your payment methods"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Track a parcel..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 outline-none"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                <FiBell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              <button
                onClick={() =>
                  handleMenuClick("parcels-0", "/dashboard/addParcel")
                }
                className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FiPlus className="w-5 h-5" />
                Send Parcel
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
