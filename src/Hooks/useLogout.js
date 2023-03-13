import axios from "./axios";
import useAuth from "./auth/useAuth";
import { useNavigate } from "react-router";

const useLogout = () =>{
    const {setAuth} = useAuth();
    const Navigate = useNavigate()
    const logout = async () => {
        setAuth();
        try{
            const response = await axios('/api/auth/logout', {
                withCredentials: true
            });
            
        }
        catch(error){
            console.log(error);
        }
    }
    return logout;
    
}

export default useLogout;