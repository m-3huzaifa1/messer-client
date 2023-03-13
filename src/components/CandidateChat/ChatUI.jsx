import React, { useEffect, useState, useRef } from "react";
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
import axios, {BASE_URL} from "../../Hooks/axios";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
//import { useDispatch } from "react-redux";
//import { process } from "../../redux/action/processAction";
//import { to_Decrypt, to_Encrypt } from "./aes.js";

export default function MessageUI({conversation}) {
//  const dispatch = useDispatch()
  const {auth} = useAuth()
  const Logout = useLogout()
  const [users,setUsers] = useState()
  const [userP,setUserP] = useState()
  const userId = useParams().userId
  const socket = auth?.socket
  const [messages, setMessages] = useState([]);
  const senderId = auth?.foundUser?._id;
  const recieverId = userId;
  const [value,setValue] = useState()
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [newMessageFlag, setNewMessageFlag] = useState(false);
  const scrollRef = useRef();
  const [search,setSearch] = useState('')

  /*const dispatchProcess = (encrypt, msg, cipher) => {
    dispatch(process(encrypt, msg, cipher))
  }*/

  useEffect(() => {
    console.log("inside conversations.jsx line 34");
    socket.emit("addUser", senderId);
    socket.on("getUsers", (data) => {
      console.log(data);
      //  setActiveUsers(data);
    });
    //  console.log(activeUsers);
  }, []);

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
  
  useEffect(()=>{
    const getUser = async() => {
     await axios.get(`api/auth/getUser/${userId}`,
     {
       headers: {
         "Content-Type": "application/json",
       },
       withCredentials: true,
     })
     .then((res)=>{
       console.log(res?.data)
       setUserP(res?.data)
     })
     .catch(err=>console.log(err))
    }
    getUser()
   },[])
   
  console.log(users)

  useEffect(() => {
    socket.on("getMessage", (data) => {
      // console.log("getting message", data);
      const {senderId, text,Date,targetId} = data;
      console.log(senderId, text,Date,targetId)

      if(targetId ==  auth?.foundUser?._id){
        console.log(true)        
      setIncomingMessage({
        senderId:senderId,
        text:text,
        Date:Date,
      });
      console.log(incomingMessage)
    }
    });
  }, []);
  console.log(incomingMessage)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ transition: "smooth" });
  }, [messages]);

  // setting the new incoming message into the message
  useEffect(() => {
    console.log("In incoming message", incomingMessage);
    if (incomingMessage && incomingMessage.senderId == recieverId) {
      console.log("yesss setting message");
      setMessages((prev) => [...prev, incomingMessage]);
    }
    // setNewMessageFlag((prev) => !prev);
  }, [incomingMessage]);

  //  recieving message

  useEffect(() => {
    const getMessage = async () => {
      // if(incomingMessage){
      console.log("candidate ", auth);
      const data = {
        senderId: senderId,
        receiverId: recieverId,
      };
      const response = await axios.post(
        "/api/message/getConversation",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response?.data)
      setMessages(response?.data?.message);
      // }}
    };
    getMessage();
  }, [recieverId, senderId,newMessageFlag]);


  /*const deleteText = async() => {

  }
*/
  const sendText = async (e) => {
    //   console.log(value);
    if (!value) return;
    try {
      if (true) {
        let message = {};
          message = {
            senderId: senderId,
            receiverId: recieverId,
            text: value,
          };
        
        console.log(message)
        socket.emit(
          "sendMessage",
          {
            senderId,
            recieverId,
            text: value,
            Date: Date.now(),
        
            },
          (res) => console.log(res)
        );

        console.log(message)
        const response = await axios.post(
          "/api/message/addConversation",
          JSON.stringify(message),
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        
        console.log(response);
        
        setValue("");
        setNewMessageFlag(!newMessageFlag);
      }
    } catch (err) {
      console.log("Error in adding message", err);
    }
  };




  return (
    <React.Fragment>
      <div className="" >
    <div className="row justify-content-between align-items-center">
              <div className="col-3">
               <h1 style={{color:'green'}}>Hello {auth?.foundUser?.name} !</h1>
               
              </div>
              <div className="col-4">
                <h1><Link to='/message' style={{textDecoration:'none'}}>Messer Chat</Link></h1>
              </div>
              <div className="col-3">
                <button className="btn btn-success btn-sm">
                <a
                type="button" 
                onClick={Logout}
                style={{textDecoration:'none',}}
                >
                Sign Out
                </a>
                </button>
              </div>
              </div>    
        </div>
    <MDBContainer fluid className="py-4" style={{ backgroundColor: "#eee" }}>
      
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
          <MDBCard>
            <MDBCardBody style={{border:'1px solid grey ',borderRadius:'5px'}}>
              <MDBTypography listUnStyled className="mb-0">
                <div style={{overflowY:'scroll',height:'400px',paddingRight:'5px'}}>
                {users?.filter(obj=>obj?.email.includes(search)).map((user)=>{
                  return (
                    <li 
                    className="p-2 mb-3"
                    style={{ backgroundColor: (user?.email === userP?.email)? "#eee":'white',border:'1px solid green ',borderRadius:'5px'}}
                    >
                    <a href={`/chat/${user?._id}`} className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
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
          end-to-end encryption
            <div className="msgarea" style={{overflowY:'scroll',height:'300px',marginTop:'25px',padding:'5px',border:'1px solid blue ',borderRadius:'5px',backgroundColor:'rgb(250,250,250)' }}>
            {messages?.map((item)=>{
            return(
                item.senderId != senderId ? (
                    <li className="d-flex justify-content-between mb-3 mt-3" ref={scrollRef}>
              
                    <MDBCard className="w-100">
                      <MDBCardHeader className="d-flex justify-content-between p-2">
                        <p className="fw-bold mb-0 text-success">{userP?.name}</p>
                        <p className="text-muted small mb-0">
                          <MDBIcon far icon="clock" /> 
                        </p>
                        <span type='button' className="fa fa-trash"
                        onClick={async()=>{
                            
                            const data = {
                                senderId: senderId,
                                receiverId: recieverId,
                                text: item?.text,
                                date: item?.Date,
                                sender:item?.senderId
                              };
                            await axios.post(
                                "/api/message/delConversation",
                                JSON.stringify(data),
                                {
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  withCredentials: true,
                                }
                              )
                              .then((resp)=>{
                                console.log(resp)
                                setNewMessageFlag((prev) => !prev);
                                
                              })
                              .catch(err=>console.log(err))  
                        }}
                        ></span>
                      </MDBCardHeader>
                      <MDBCardBody>
                        <p className="mb-0" style={{float:'left'}}>
                        {item?.text}
                        </p>
                      </MDBCardBody>
                    </MDBCard>
                  </li>
      
                ):
                (
                    <li className="d-flex justify-content-between mb-3 mt-3"  ref={scrollRef}>
                    <MDBCard className="w-100" >
                      <MDBCardHeader className="d-flex justify-content-between p-2">
                        <p className="fw-bold mb-0 text-primary">{auth?.foundUser?.name}</p>
                        <p className="text-muted small mb-0">
                          <MDBIcon far icon="clock" /> 
                        </p>
                        <span type='button' className="fa fa-trash"
                        onClick={async()=>{
                            
                            const data = {
                                senderId: senderId,
                                receiverId: recieverId,
                                text: item?.text,
                                date: item?.Date,
                                sender:item?.senderId
                              };
                            await axios.post(
                                "/api/message/delConversation",
                                JSON.stringify(data),
                                {
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  withCredentials: true,
                                }
                              )
                              .then((resp)=>{
                                console.log(resp)
                                setNewMessageFlag((prev) => !prev);
                                
                              })
                              .catch(err=>console.log(err))  
                        }}
                        ></span>
                      </MDBCardHeader>
                      <MDBCardBody>
                        
                      <p className="mb-0" style={{float:'left'}}>
                        {item?.text}
                        </p>
                      </MDBCardBody>
                    </MDBCard>
                    
                  </li>
                          
                )
            )
            })}
            
            </div>
            <li className="bg-white mb-3 mt-3">
            <MDBTextArea  id="textAreaExample" rows={3}
            value={value}
            onChange={(e)=>{setValue(e.target.value)}}
                 
            />
            </li>
            <button className="btn btn-large btn-primary" 
            onClick={()=>sendText()}>
                Send
            </button>
            
            
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </React.Fragment>
  );
}