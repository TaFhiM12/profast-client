import { createBrowserRouter } from "react-router";
import RootLayout from "../Root/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Root/AuthLayout";
import Login from "../Pages/Authentication/login";
import Register from "../Pages/Authentication/Register";
import ForgotPassword from "../Pages/Authentication/ForgotPassword";
import Coverage from "../Pages/Coverage/Coverage";
import DashboardLayout from "../Root/DashboardLayout";
import AddParcel from "../Pages/userDashboard/AddParcel/AddParcel";
import AllMyParcel from "../Pages/userDashboard/AllMyParcel/AllMyParcel";
import AboutUs from "../Pages/AboutUs/AboutUs";
import ParcelDetails from "../Pages/userDashboard/ParcelDetails/ParcelDetails";
import PrivateRoute from './PrivateRoute';
import Payment from "../Pages/userDashboard/Payments/Payment";
import PaymentHistory from "../Pages/userDashboard/PaymentHistory/PaymentHistory";
import Track from "../Pages/userDashboard/Track/Track";
import BeARider from "../Pages/BeARider/BeARider";
import ActiveRiders from "../Pages/BeARider/ActiveRiders";
import PendingRiders from "../Pages/BeARider/PendingRiders";
import ManageAdmin from "../Pages/ManageAdmin/ManageAdmin";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "./AdminRoute";
import AssignRider from "../Pages/AssignRider/AssignRider";
import PendingDeliveries from "../Pages/PendingDeliveries/PendingDeliveries";
import RiderRoute from "./RiderRoute";
import CompletedDeleveries from "../Pages/CompletedDeliveries/CompletedDeleveries";
import DashBoard from "../Pages/userDashboard/Dashboard/DashBoard";

export const router = createBrowserRouter([
    {
        path: '/',
        element:<RootLayout/>,
        children:[
            {
                index:true , 
                element: <Home/>
            },
            {
                path: '/coverage',
                element: <Coverage/>
            },
            {
                path:'/aboutUs',
                element: <AboutUs/>
            },
            {
                path: 'bearider',
                element: <PrivateRoute>
                    <BeARider/>
                </PrivateRoute>
            },
            {
                path: 'forbidden',
                element: <Forbidden/>
            }
        ]
    },
    {
        path: '/',
        element: <AuthLayout/>,
        children:[
            {
                path:'/login',
                element:<Login/>
            },
            {
                path:'/register',
                element: <Register/>
            },
            {
                path:'/forgotPassword',
                element: <ForgotPassword/>
            }

        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout/>
        </PrivateRoute>,
        children: [
            {
                index: true,
                element: <DashBoard/>
            },
            {
                path: 'addParcel',
                element: <AddParcel/>
            },
            {
                path: 'myParcels',
                element: <AllMyParcel/>
            },
            {
                path: 'payment/:parcelId',
                element: <Payment/>
            },
            {
                path: 'paymentHistory',
                element: <PaymentHistory/>
            },
            {
                path: 'track',
                element: <Track/>
            },
            {
                path: 'parcel/:id',
                element: <ParcelDetails/>
            },
            {
                path : 'pending-delivery' ,
                element: <RiderRoute>
                    <PendingDeliveries/>
                </RiderRoute>
            },
            {
                path: 'completed-deliveries',
                element: <RiderRoute>
                    <CompletedDeleveries/>
                </RiderRoute>
            },
            {
                path:'active-riders',
                element: <AdminRoute>
                    <ActiveRiders/>
                </AdminRoute>
            },
            {
                path: 'pending-riders',
                element: <AdminRoute>
                    <PendingRiders/>
                </AdminRoute>
            },
            {
                path: 'assign-rider',
                element: <AdminRoute>
                    <AssignRider/>
                </AdminRoute>
            },
            {
                path:'manage-admin',
                element: <AdminRoute>
                    <ManageAdmin/>
                </AdminRoute>
            }
        ]
    }
])