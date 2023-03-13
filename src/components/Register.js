import React,{useState,useEffect} from "react";
import img from '../assets/landscape.jpg'
import { Link,useNavigate } from "react-router-dom";
import axios from "../Hooks/axios";

export default function Register() {
    const Navigate = useNavigate()
    const [username,setUsername] = useState()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    console.log(username,email,password)
    const EMAIL =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    const [validemail, setValidemail] = useState(true);
    const [validpassword, setValidpassword] = useState(true);
    const [errMsg, setErrMsg] = useState("");
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
        }*/
        
        try {
          const res = await axios.post(
            'api/auth/register',
            JSON.stringify({
            name: username,
            email: email,
            password: password,
              // userType: "candidate",
            }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
        console.log(res?.data);
        console.log(JSON.stringify(res));
          Navigate("/login");
          
        setUsername("");
        setPassword("");
        setEmail("");
        alert('Registered Successfully')
        console.log("submitted candidate");
      }
     catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      
    }
           
    }
    const checkSubmit = username && email && password
    return(
    <div style={{paddingTop:'70px',paddingBottom:'300px',backgroundImage:`url(${img})`,
    //backgroundRepeat:'no-repeat',
    backgroundSize:'100%'}}>
        <h1>Messer Chat</h1>
        <br/>
        <h3>Register</h3>
        <br/>
        <div className='row' >
                  
            <div className='col-12 d-flex justify-content-center' >
                
                <form>
    <div className="form-group">
    <label htmlFor="exampleInputusername1" className="form-label">Username</label>
    <input type="text" className="form-control" 
    onChange={(e)=>{setUsername(e.target.value)}} 
    value={username}
    id="exampleInputUsername1"  placeholder="Enter username"/>
    {/*<small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>*/}
  </div>
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
        <h6>Already Registered ? <Link to='/login'>Login</Link></h6>
    </div>
    )
}