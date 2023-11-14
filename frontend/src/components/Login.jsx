import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Login = ({setError , setErrormsg , setSuccess , setLogin })=>
{
    document.title="To Do | Login ";
  const [istap, setIstap] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();
  const handleLogin = async (e) => {
    setIstap(true);
    e.preventDefault();
    try{
        const res = await fetch('/signin' , 
        {
            method:"POST",
            headers: 
            {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(
                {
                    email, password
                }
            ),
            credentials: 'include',
        });
        //console.log(res);
        const data = await res.json();
        console.log(data);
        if(res.status===200)
        {
            setIstap(false);
            nav('/notes');
        }
        else 
        {
            setIstap(false);
            setErrormsg(data.error);
            setSuccess(false);
            setError(true);

            setTimeout(()=>
            {
                setError(false);
            },3000)
        }
    }
    catch(err)
    {
      setIstap(false);
      alert(err);
        console.log(err);
    }

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    return(
        <form>
        <h2>User Login</h2>
        <div className="Field">
          <label htmlFor="email">Username</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="Field">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="Passicon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        <div className="Btn">
          <button onClick={handleLogin} disabled={istap} >{istap ? "Logging in..." : "Login"}</button>
        </div>
      </form>
    )
}

export default Login;
