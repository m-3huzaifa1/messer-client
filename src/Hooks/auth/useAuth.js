import { useContext } from "react";
import AuthContext from "./AuthProvider";

const useAuth = () => {
  // const { auth, setAuth} = useContext(AuthContext);
  // useDebugValue(auth, auth => {
  //   return `${auth.user?.email} - ${auth.user?.roles?.join(", ")}`;
  // } );
  return useContext(AuthContext);
}

export default useAuth;