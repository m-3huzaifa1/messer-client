import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../auth/useAuth";
import useRefreshToken from "./useRefreshToken";

const PersistLogin = ()=>{
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth} = useAuth();
    // const {companyId}= useCompany();
    useEffect(() => {
           
        let isMounted = true;
        console.log("PersistLogin");
        const verifyRefreshToken = async () => {
            try{
                await refresh();
            }
            catch(error){
                console.log(error);
            }
            finally{
                setIsLoading(false);
            }
        }
        verifyRefreshToken() ;
        return () => isMounted = false;
    },[])
    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`auth: ${JSON.stringify(auth?.accessToken)}`);
        console.log(`auth: ${JSON.stringify(auth?.foundUser)}`);
    }, [isLoading])

    return (
        <>
            {isLoading ? <div>Loading...</div> : <Outlet />}
        </>
    )
}
export default PersistLogin;

/*export const PersistCandidate = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshCandidates();
    const {auth} = useAuth();
    
    useEffect(() => {
        let isMounted = true;
        console.log("PersistCandidate");
        const verifyRefreshToken = async () => {
            try{
                await refresh();
            }
            catch(error){
                console.log(error);
            }
            finally{
                setIsLoading(false);
            }
        }
        // !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
        verifyRefreshToken();
        return () => isMounted = false;
    } ,[])

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        // console.log(`auth: ${JSON.stringify(auth?.accessToken)}`);
        // console.log(`auth: ${JSON.stringify(auth)}`);
        // console.log(`auth: ${JSON.stringify(auth?.candidate)}`);
        
    } ,[isLoading])
       
    return (
        <>
            {isLoading ? <div>Loading...</div> : <Outlet />}
        </>
    )   
}*/