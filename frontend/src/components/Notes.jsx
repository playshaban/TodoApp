
import "../App.css";
import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { FaTrash, FaCheck, FaPlus, FaCalendarDay, FaX, FaRightFromBracket } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


function Notes() {

  document.title = "To Do | Notes";


  //format of date for fetching url 
  function formatDateToDdMmYyyy(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1.
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const [userId, setUserId] = useState('');
  const [date, setDate] = useState(new Date());
  const [cal, setCal] = useState(false);
  const [add, setAdd] = useState(false);
  const [bg, setBg] = useState('True');
  const [urldate, setUrldate] = useState(formatDateToDdMmYyyy(date));
  const [data, setData] = useState([]);
  const nav = useNavigate();

  const [note, setNote] = useState('');


  // here the content for time formats
  const timezone = "Asia/Kolkata";
  const formatter = new Intl.DateTimeFormat(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
    {
      timeZone: timezone,
      hour12: true,
    }
  );
  function getDate(D) {
    var getdate = date;
    return formatter.format(getdate);
  }


  //display calender 

  function Cal() {
    setCal(!cal);
    setBg(!bg);
  }

  function Add() {
    setAdd(!add);
    setBg(!bg);
  }

  const Logout = async()=> {

    try 
    {
      const res = await fetch('https://todoapi-ivory.vercel.app/signout',
        {
          method: "GET",
          headers:
          {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

      if(res.status === 200)
      {
        console.log("Sign out successfull");
        nav('/');
      }

      else {
        const error = new Error(res.error);
        throw error;
      }
      
    }
    catch(err)
    {
      alert(err);
      console.log(err);
    }

    
  }



  //function to get all the current note data

  const getNotesCurr = async () => {
      console.log(urldate);
      try {
        const response = await fetch(`https://todoapi-ivory.vercel.app/getdata/${urldate}/${userId}`);

        if (response.status === 200) {
          const currdata = await response.json(); // Parse the response as JSON

          //console.log(currdata);
          setData(currdata);

        } else {
          setData([]);
          console.error("Failed to fetch data");
        }
      } catch (e) {
        alert(e);
        console.error(e);
      }
  }


  const calluserAuth = async () => {
    try {
      const res = await fetch(`https://todoapi-ivory.vercel.app/userauth/${urldate}`,
        {
          method: "GET",
          headers:
          {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

      const data = await res.json();
      console.log(data);

      if(res.status === 201)
      {
        //console.log("status 201 , User Id :"+data[0].userId);
        setData(data);
        setUserId(data[0].userId);
      }
      else if(res.status === 202)
      {
        //console.log("status 202 , User Id :"+data);
        setData([]);
        setUserId(data);
      }

      else {
        const error = new Error(res.error);
        throw error;
      }
    }
    catch (err) {
    
      console.log(err);
     nav('/')
    }
  }


  useEffect(() => {
    //call user auth page 

    calluserAuth();
  }, [urldate]);


  const dateChange = (date) => {

    setDate(date);
    setUrldate(formatDateToDdMmYyyy(date));
    console.log(urldate);
    console.log(date);
    getNotesCurr();
    setCal(!cal);
    setBg(!bg);
  }




  //function rot add new note ;

  const addnote = async (e) => {
    e.preventDefault();
    try {
      const sending = await fetch("https://todoapi-ivory.vercel.app/addnote", {
        method: 'POST',
        headers:
        {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ note, urldate, userId })

      });

      if (sending.status === 201) {
        console.log("success");
        getNotesCurr();
      }
      else {
        alert("Faild To Add Note");
      }
      setNote('');
      Add();

    }
    catch (e) {
      alert(e);
      console.log(e);
    }
  }


  //function for deleting a node 
  const handleDelete = async (id) => {
    try {
      const reqDel = await fetch('https://todoapi-ivory.vercel.app/delete',
        {
          method: "POST",
          headers:
          {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id, userId })
        })

      if (reqDel.status === 200) {
        console.log("success");
        getNotesCurr();
      }
      else {
        alert("Faild To Delete Note");
      }
    }
    catch (e) {
      alert(e);
      console.log(e);
    }
  }

  //handle check sign for a specifi note 
  const handlecheck = async (id , userid) => {
    try {
      
      const response = await fetch(`https://todoapi-ivory.vercel.app/check/${id}/${userid}`);

      if (response.status === 200) {

        console.log(response.json);
        console.log("success");
        getNotesCurr();

      } else {
        console.error("Failed to fetch data");
      }
    }
    catch (e) {
      alert(e);
      console.log(e);
    }
  }


  return (
    <>
      <div className="Action">
        {
          cal ? (<Calendar className="Calender" onChange={dateChange} value={date} />) : (<></>)
        }
        {
          add ? (<form>
            <span className="Close-Add" onClick={Add}><FaX /></span>
            <h3>Add New Note</h3>
            <span>{getDate(date)}</span>
            <div className="Fields">
              <textarea rows="5" value={note} onChange={(e) => { setNote(e.target.value) }} placeholder="Type Your Note Here ... ">
              </textarea>
            </div>
            <div className="Btn">
              <button onClick={addnote}>
                Add
              </button>
            </div>
          </form>) : (<></>)
        }
      </div>
      <div className={bg ? "App-notes" : "App-notes Bgnone"}>
        <header>
          <h1>
            To Do <FaCheck />
          </h1>
          <span>{getDate()}</span>
          <span className="Back-btn" onClick={Logout}> Sign Out <FaRightFromBracket /> </span>
        </header>

        <div className="ListArea">

          {
            data?.length > 0
              ? (
                data.map((key) =>
                (<div className="Item" key={key._id}>
                  <input type="checkbox" checked={key.checked} onChange={() => handlecheck(key._id, userId)}></input>
                  <span className="Text" style={{ 'textDecoration': (key.checked) ? "line-through" : "" }}>
                    {key.textnote}
                  </span>
                  <span className="Del"><FaTrash onClick={() => { handleDelete(key._id) }} /></span>
                </div>
                ))
              ) :
              (
                <div className="Item">
                  <span className="Text" style={{'textAlign':'center','width':'100%'}}>
                    No records Found
                  </span>
                </div>
              )
          }

        </div>

        <div className="Nav">
          <div className="AddNew" onClick={Cal}>
            <FaCalendarDay />
          </div>
          <div className="AddNew" onClick={Add}>
            <FaPlus />
          </div>
        </div>

        <footer>
          Design & Developed By Shaban Khan
          <span>
            <a href="https://playshaban.github.io/profile/" target="_blank" rel="noreferrer">
              <br></br>Click Here
            </a>
            For Contacts
          </span>
        </footer>
      </div>
    </>);
}

export default Notes;
