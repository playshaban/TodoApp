import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
const Signup =({setError , setErrormsg , setSuccess , setLogin})=>
{   
    document.title="To Do | Sign Up ";

  const [istap, setIstap] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const handleLogin = async (e) => {
       setIstap(true);
        e.preventDefault();
        console.log(name + " " + email + " " + password );
        try{
            const res = await fetch('/register' , 
            {
                method:"POST",
                headers: 
                {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(
                    {
                        name, email, password
                    }
                )
            });
            const data = await res.json();
            console.log(data);
            if(res.status===200)
            {
                setIstap(false);
                setErrormsg(data.message);
                setSuccess(true);
                setError(true);
                setTimeout(()=>
                {
                    setError(false);
                },3000)

                setLogin(true);
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
        <h2>User Sign Up</h2>
        <div className="Field">
          <label htmlFor="id">Full Name </label>
          <input
            type="text"
            id="id"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="Field">
          <label htmlFor="email"> Choose Username </label>
          <div className="input">
            <input
              type="email"
              id="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="Field">
          <label htmlFor="password"> Password </label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="Passicon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        <div className="Btn">
        <button onClick={handleLogin} disabled={istap} >{istap ? "Creating Account..." : "Register"}</button>
        </div>
      </form>
    )
}

export default Signup;