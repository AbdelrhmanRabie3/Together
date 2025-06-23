import { useContext } from 'react';
import { AuthContext } from './context/AuthContextProvider';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
     return <>
    <Navigate to={'/'}/>
    </>
  }
  else
  return children;
};

export default ProtectedRoute;