import React, { useEffect } from "react";
import useAuth from "../Hooks/auth/useAuth";
import useLogout from "../Hooks/useLogout";

export default function Home() {
   const {auth} = useAuth()
   const Logout = useLogout()
   console.log(auth)
   if (auth) {
    console.log(auth)
   }
   else {
    console.log(null)
   }
  
   return(<>
    <div className="container">
        <div className="row justify-content-center align-items-center">
              <div className="col-6 offset-3">
              Hello {auth?.foundUser?.name}
              </div>
              <div className="col-3">
                <a
                type="button" 
                onClick={Logout}
                style={{textDecoration:'none'}}
                >
                Sign Out
                </a>
              </div>
               
        </div>
    </div>
    </>)
}