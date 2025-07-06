import React from 'react';
import useAuth from '../Hooks/useAuth';
import Loading from '../Components/Loading';
import useUserRole from '../Hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

const AdminRoute = ({children}) => {
    const {user , loading} = useAuth(); 
    const {role , isLoading} = useUserRole();
    const location = useLocation();

    if(loading || isLoading){
        return <Loading/>
    }

    if(!user || role !== 'admin'){
        return <Navigate state={ {from : location.pathname}}  to='/forbidden'/>
    }

    return children;
};

export default AdminRoute;