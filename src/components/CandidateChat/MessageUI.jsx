import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/auth/useAuth";
import useLogout from "../../Hooks/useLogout";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import axios from "../../Hooks/axios";
import { Link } from "react-router-dom";

export default function MessageUI() {
  const {auth} = useAuth()
  const Logout = useLogout()
  const [users,setUsers] = useState()
  const [search,setSearch] = useState('')

  useEffect(()=>{
   const getAllUsers = async() => {
    await axios.get('api/auth/getUsers',{
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res)=>{
      console.log(res?.data)
      setUsers(res?.data)
    })
    .catch(err=>console.log(err))
   }
   getAllUsers()
  },[])
  console.log(users)
  return (
    <React.Fragment>
      <div className="">
    <div className="row justify-content-between align-items-center">
              <div className="col-3">
              <h1 style={{color:'green'}}>Hello {auth?.foundUser?.name}!</h1>
              </div>
              <div className="col-4">
                <h1><Link to='/message' style={{textDecoration:'none'}}>ChatMess!</Link></h1>
              </div>
              <div className="col-3">
              <button className="btn btn-success btn-sm">
                <a
                type="button" 
                onClick={Logout}
                style={{textDecoration:'none'}}
                >
                Sign Out
                </a>
                </button>
              </div>
              </div>    
        </div>
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      
      <MDBRow>
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
        <div className="d-flex justify-content-between mb-2">

          <h5 className="font-weight-bold mb-3 text-center text-lg-start">
            Users
          </h5>
          <input type='text' className="input" placeholder="Search by email"
            value={search}
            onChange={(e)=>{setSearch(e.target.value)}}
            />
            <p>{' '}</p>
            </div>
          <MDBCard style={{border:'1px solid grey ',borderRadius:'5px'}}>
            <MDBCardBody>
              <MDBTypography listUnStyled className="mb-0">
              <div style={{overflowY:'scroll',height:'400px',paddingRight:'5px'}}>
                {users?.filter(obj=>obj?.email.includes(search)).map((user)=>{
                  return (
                    <li className="p-2 mb-3"
                    style={{ border:'1px solid green ',borderRadius:'5px'}}
                    >
                    <a href={`/chat/${user?._id}`} className="d-flex justify-content-between"
                    style={{textDecoration:'none'}}>
                      <div className="d-flex ">
                        {/*<img
                          src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp"
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                        />*/}
                        <div 
                        className="rounded-circle d-flex justify-content-center align-self-center me-3 shadow-1-strong"
                        
                        style={{
                          textDecoration:'none',
                          border:'1px solid grey',
                          color:'black',
                          backgroundColor:'grey',
                          //paddingLeft:'5px',
                          padding:'12px',
                          height:'50px',
                          width:'50px',
                          fontSize:'20px'

                        }}
                        >

                        {user?.name[0].toUpperCase()}
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">{user?.name}</p>
                          <p style={{fontSize:'15px'}}>{user?.email}</p>
                          
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1"></p>
                      </div>
                    </a>
                  </li>    
                  )
                })}
                
                </div>
              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="6" lg="7" xl="8">
          <MDBTypography listUnStyled>
            
            <li className="d-flex justify-content-between mb-4 mt-5">
              <MDBCard className="w-100">
                <MDBCardHeader className="d-flex justify-content-center p-3">
                  <p className="fw-bold mb-0">Hello {auth?.foundUser?.name}</p>
                  
                </MDBCardHeader>
                <MDBCardBody>
                  <p className="mb-0">
                    Please Select a user to start Chat with.
                  </p>
                </MDBCardBody>
              </MDBCard>
              
            </li>
            
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </React.Fragment>
  );
}