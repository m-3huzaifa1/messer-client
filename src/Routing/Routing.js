import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import MessageUI from "../components/CandidateChat/MessageUI";
import ChatUI from "../components/CandidateChat/ChatUI";
import Login from "../components/Login";
import Register from "../components/Register";
import { AuthProvider } from "../Hooks/auth/AuthProvider";
import PersistLogin from '../Hooks/Token/PersistLogin'
import ProtectedRoutes from './ProtectedRoutes'

export default function Routing() {
   return(<>
    <AuthProvider>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/> 
        <Route element={<PersistLogin/>}>
        <Route element={<ProtectedRoutes/>}>    
                <Route path='message' element={<MessageUI />} />
                <Route path='chat/:userId' element={<ChatUI/>} />  
        </Route>
        </Route> 
    </Routes>
    </BrowserRouter>
    </AuthProvider>
    </>
)
}