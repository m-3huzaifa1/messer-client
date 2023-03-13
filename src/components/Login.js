import React,{useState,useEffect, useRef} from "react";
import img from '../assets/landscape.jpg'
import { Link,useNavigate } from "react-router-dom";
import axios from "../Hooks/axios";
import useAuth from "../Hooks/auth/useAuth";

export default function Login() {
    const {auth,setAuth} = useAuth()
    const navigate = useNavigate()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    console.log(email,password)
    const EMAIL =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    const [validemail, setValidemail] = useState(true);
    const [validpassword, setValidpassword] = useState(true);
    const [errMsg, setErrMsg] = useState("");
   // const [user, setUser] = useState("");
   const errRef = useRef();

    useEffect(() => {
        setValidemail(EMAIL.test(email));
      }, [email]);
      useEffect(() => {
        setValidpassword(PASSWORD.test(password));
      }, [password]);
    
      useEffect(() => {
        setErrMsg("");
      }, [email, password])
      
    const handleSubmit = async(e) => {
        
        e.preventDefault();
        /*const v1 = EMAIL.test(email);
        const v2 = PASSWORD.test(password);
        if (!v1 || !v2) {
          setErrMsg("Invalid email or password");
          return;
        }
        navigate('/home');*/
        try {
          const response = await axios.post(
            'api/auth/login',
            JSON.stringify({
              email,
              password,
              // userType: "candidate",
            }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          console.log(response?.data);
          const accessToken = response?.data?.accessToken;
          const user = response?.data?.user
          /*setAuth({
            accessToken:accessToken,
            user:user,
          });*/
          setEmail("");
          setPassword("");
          navigate('/message');
        } catch (err) {
          if (!err?.response) {
            setErrMsg("No Server Response");
          } else if (err.response?.status === 400) {
            setErrMsg("Missing Username or Password");
          } else if (err.response?.status === 401) {
            setErrMsg("Unauthorized");
          } else {
            setErrMsg("Login Failed");
          }          
      errRef.current.focus();
        }
           
    }
    console.log(auth)
    const checkSubmit = email && password
    return(
    <div style={{paddingTop:'100px',paddingBottom:'300px',backgroundImage:`url(${img})`,
    //backgroundRepeat:'no-repeat',
    backgroundSize:'100%'}}>
        <h1>Messer Chat</h1>
        <br/><br/>
        <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
        <h3>Login</h3>
        <br/>
        <div className='row' >
                  
            <div className='col-12 d-flex justify-content-center' >
                
                <form>
  <div className="form-group">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" 
    onChange={(e)=>{setEmail(e.target.value)}} 
    value={email}
    id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
    {/*<small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>*/}
  </div>
  <div className="form-group">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" className="form-control"
    value={password}
    onChange={(e)=>{setPassword(e.target.value)}} id="exampleInputPassword1" placeholder="Password"/>
  </div>
  <br/>
  <button type="submit" className="btn btn-primary" disabled={!checkSubmit} onClick={handleSubmit}>Submit</button>
</form>
                
            </div>    
        </div>
        <br/>
        <h6>Not a member ? <Link to='/register'>Register</Link></h6>
    </div>
    )
}