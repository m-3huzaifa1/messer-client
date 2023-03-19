import React,{useState,useEffect, useRef} from "react";
import img from '../assets/landscape.jpg'
import { Link,useNavigate } from "react-router-dom";
import axios from "../Hooks/axios";
import useAuth from "../Hooks/auth/useAuth";
import {Input} from 'reactstrap'

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
      <>
      {/*<div className="d-flex justify-content-center text-white">
    <div className="bg-image h-100 view" style={{width: '360px', minHeight: '640px'}}>
        <img src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/6-col/img%20(122).jpg" style={{minHeight: '640px'}} />
        <div className="mask" style={{background: "linear-gradient(to bottom, rgba(0, 47, 75, 0.8) 0%, rgba(220, 66, 37, 0.8))"}}>
            
            <a href="#" className="float-end font-weight-bold text-white me-4 mt-2">Skip </a>

            <div class="h-100 w-100 align-items-center">
                <div class="mt-5 p-4 text-center">
                    <div class="form-outline form-white my-4">
                        <input type="email" id="typeEmail" class="form-control form-control-lg" />
                        <label class="form-label text-white" for="typeEmail">E-mail</label>
                    </div>

                    <div class="form-outline form-white my-4">
                        <input type="password" id="typePassword" class="form-control form-control-lg" />
                        <label class="form-label text-white" for="typePassword">Password</label>
                    </div>

                    <a href="" class="text-white my-4">Forgot password?</a>

                    <div class="d-grid my-4">
                    <button class="btn btn-lg btn-outline-white btn-block mb-3" type="submit">Sign in</button>

                    <button class="btn btn-lg btn-outline-white btn-block" type="submit">
                      <i class="fab fa-facebook-f me-2"></i>Facebook</button>
                  </div>

                    <p>
                        Not a member?
                        <a href="" class="text-white"><strong>Register</strong></a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>*/}
<div className="row" 
style={{
  paddingTop:'100px',
  backgroundColor:'aliceblue',
  paddingBottom:'100px',
  background: "linear-gradient(to bottom, rgba(0, 47, 75, 0.8) 0%, rgba(220, 66, 37, 0.8))"
  //backgroundImage:`url(${img})`,
  //backgroundRepeat:'no-repeat',
  //backgroundSize:'100%'
  }}>
    <div className="col-6 offset-3 p-4" //style={{}}
        >

        <h1>ChatMess !</h1>
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
        <div className='row'  
        >
                  
            <div className='col-12 d-flex justify-content-center' >
                
                <form>
  <div className="form-group">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input style={{border:'1px solid black'}} type="email" className="form-control" 
    onChange={(e)=>{setEmail(e.target.value)}} 
    value={email}
    id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
    
  </div>
  <div className="form-group">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input style={{border:'1px solid black'}} type="password" className="form-control"
    value={password}
    onChange={(e)=>{setPassword(e.target.value)}} id="exampleInputPassword1" placeholder="Password"/>
  </div>
  <br/>
  <button type="submit" className="btn btn-primary" disabled={!checkSubmit} onClick={handleSubmit}>Submit</button>
</form>
                
            </div>    
        </div>
        <br/>
        <h6>Not a member ? <Link to='/register' style={{textDecoration:'none',color:'blue',fontSize:'20px'}}>Register</Link></h6>
    </div>
     </div>
        </>
    )
}