import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import "./scss/Login.scss";
import Login from "./Login";
import Signup from "./Signup";
const Index = () => {

  const [login , setLogin] = useState(true);

  const [error, setError] = useState(false);
  const [errormsg, setErrormsg] = useState('An Error Occurred')
  const [success , setSuccess] = useState(false);
  return (
    <div className="App-notes">
      <header>
        <h1>
        <FaCheck />  To Do 
        </h1>
      </header>
      {
        error?(<div className="Error" style={{"backgroundColor":(success)? "green":"red" }}>
            <span> {errormsg} </span>
        </div>):(<></>)
      }

      {
        login? (<Login setError={setError} setErrormsg={setErrormsg} setSuccess= {setSuccess} setLogin={setLogin} /> ):( <Signup setError={setError} setErrormsg={setErrormsg} setSuccess= {setSuccess} setLogin={setLogin} /> )
      }
      
      {
        login? (<span>New to Todo? <button onClick={()=> setLogin(!login) }>Signup Here</button> </span>):(
          <span>Already a user ? <button onClick={()=> setLogin(!login) }>Login Here</button> </span>
        )
      }
      <footer>
        Design & Developed By Shaban Khan
        <span>
          <a
            href="https://playshaban.github.io/profile/"
            target="_blank"
            rel="noreferrer"
          >
            <br />
            Click Here
          </a>
          For Contacts
        </span>
      </footer>
    </div>
  );
};

export default Index;
