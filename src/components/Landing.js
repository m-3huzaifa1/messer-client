import React from "react";
import img from '../assets/landscape.jpg'

export default function Landing() {
   return(<>
    <div>
        <div className="row justify-content-center align-items-center" 
        style={{
            paddingTop:'100px',
            paddingBottom:'300px',
            backgroundImage:`url(${img})`,
            //backgroundRepeat:'no-repeat',
            backgroundSize:'100%',
            
        }}>
              <h1 style={{marginBottom:'100px'}}>Messer Chat</h1>
              <div className="col-4 offset-2 d-flex justify-content-center align-items-center">
              <a href="/login" 
              style={{
                color:'red',
                fontSize:'50px',
                textDecoration:'none',
                border:'1px solid black',
                borderBlockColor:'gray'
              }}
              >
                Login
              </a>
              </div>
              <div className="col-5 offset-1 d-flex align-items-center">
                <a href="/register"
                style={{
                    color:'green',
                    fontSize:'50px',
                    textDecoration:'none',
                    border:'1px solid black',
                    borderBlockColor:'gray'
                  }}
                >
                 Register
                </a>
              </div>
               
        </div>
    </div>
    </>)
}