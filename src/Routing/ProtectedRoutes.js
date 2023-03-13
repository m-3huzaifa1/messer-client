import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import useAuth from '../Hooks/auth/useAuth'
const ProtectedRoutes = ({children}) => {
  const { auth } = useAuth();
  const location = useLocation();
  console.log(auth)
  if(!auth || auth === undefined || auth === {} || auth === null){
      return <Navigate to="/login"/>
  }
  else {
    return <Outlet/>;
  }
  /*return (
    auth? (
      <Outlet />
    ) 
    : auth?.accessToken
    ? <Navigate to="/" state={{ from: location }} replace />
    : <Navigate to="/login" state={{ from: location }} replace />
  );*/
}

export default ProtectedRoutes