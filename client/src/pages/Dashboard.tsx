import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import { Reptile } from "./Reptile";
import './Dashboard.css'

const [addingReptile, setAddingReptile] = useState(false);
const [newReptile, setNewReptile] = useState<Reptile>({
  name: "",
  sex: "",
  species: ""
} as Reptile);

useEffect(() => {
  if (addingReptile) {
    setNewReptile({ ...reptile });
  } else {
    setNewReptile({
      name: "",
      sex: "",
      species: ""
    } as Reptile);
  }
}, [addingReptile]);

type Reptile = {
  name: string,
  species: string,
  sex: string
}

type Schedule = {
  id: number
  type: string
  description: string
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [loggedIn, setLoggedIn] = useState(false);

  const { id } = useParams();
  const [reptile, setReptile] = useState<Reptile>({} as Reptile);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newReptile, setNewReptile] = useState<Reptile>({
    name: "",
    sex: "",
    species: ""
  } as Reptile);

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     S T A R T     U P
  //
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    authenticate();
    getData();
  }, [])

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     A U T H E N T I C A T E
  //
  //-------------------------------------------------------------------------------------------------------------
  async function authenticate() {
    const resultBody = await api.get(`/users/user`);
    if (resultBody.message === "unauthorized") {
      navigate('../login', { replace: true });
    }
    setLoggedIn(true);
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     G E T     D A Y
  //
  //-------------------------------------------------------------------------------------------------------------
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getDay = () => {
    const d = new Date();
    let day = weekday[d.getDay()];
    return day;
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     P U L L     D A T A
  //
  //-------------------------------------------------------------------------------------------------------------
  /*
    for reptile in reptiles
      create card
        link to reptile page
        add delete button
      for schedule in schedules
        if schedule.day == true
          add schedule to card
    add cards to screen
*/
  async function getData() {
    const resultBody = await api.get(`/reptiles`);
    if (!id || isNaN(parseInt(id)) || id > resultBody.reptiles.length) {
      navigate('../dashboard', { replace: false });
    } else {
      setReptile(resultBody.reptiles[parseInt(id) - 1]);
    }

    const scheduleResultBody = await api.get(`/schedules/${id}`);
    setSchedules(scheduleResultBody.schedules);
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     C R E A T E     C A R D
  //
  //-------------------------------------------------------------------------------------------------------------
  let createCard = (
    <>
      <div className="card">
        {/* TODO: Add reptile id link */}
        <div className="title"><a href="{reptile.id}">{reptile.name}</a></div>
        {/* TODO: Add delete functionality */}
        <button className="delete">X</button>
        <div className="image-container">
          <img src="https://via.placeholder.com/150x110" />
        </div>
        <div className="info">
          <div className="label">{getDay()} Schedule</div>
          <div className='items'>
            {
              schedules.map((schedule) => (
                <div key={schedule.id} className="item">
                  <div className='row section-heading'>
                    <div className='col'>
                      <h3>{schedule.type.toUpperCase()}&nbsp;</h3>
                      <p className='description'>{schedule.description}</p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     A D D    R E P T I L E
  //
  //-------------------------------------------------------------------------------------------------------------
  /*
      navigate to Reptile page and launch the "add reptile" form
  */

        //-------------------------------------------------------------------------------------------------------------
  //
  //                                     R E P T I L E     F O R M
  //
  //-------------------------------------------------------------------------------------------------------------
  const updateReptileForm = (
    <>
      <div className='signUp' id='signUp'>
        <div className='company'>
          <h2>Update {reptile.name}</h2>
        </div>
        <p className='msg'>Please fill out the required information</p>
        <div className='form'>
          <form>
            <input type="text" placeholder="Name" onChange={(e) => {
              let updatedReptile = { ...newReptile };
              updatedReptile.name = e.target.value;
              setNewReptile(updatedReptile);
            }} value={newReptile.name} className="text"></input>
            <input type="text" placeholder="Sex" onChange={(e) => {
              let updatedReptile = { ...newReptile };
              updatedReptile.sex = e.target.value;
              setNewReptile(updatedReptile);
            }} value={newReptile.sex} className="text"></input>
            <input type="text" placeholder="Species" onChange={(e) => {
              let updatedReptile = { ...newReptile };
              updatedReptile.species = e.target.value;
              setNewReptile(updatedReptile);
            }} value={newReptile.species} className="text final"></input>
            <a onClick={() => editReptile()} className='btn-signUp' id='do-signUp'>Submit Changes</a>
            <a className='forgot' onClick={() => setAddingReptile(false)}>Cancel</a>
          </form>
        </div>
      </div>
    </>
  )

    //-------------------------------------------------------------------------------------------------------------
  //
  //                                     E D I T     R E P T I L E
  //
  //-------------------------------------------------------------------------------------------------------------
  async function editReptile() {
    const editReptileBody = await api.put(`/reptiles/${id}`, newReptile);
    if (editReptileBody.message === "Reptile updated.") {
      const updatedReptile = editReptileBody.reptile;
      setReptile(updatedReptile);
      setAddingReptile(false);
    }
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     L O G O U T
  //
  //-------------------------------------------------------------------------------------------------------------
  /*
      sign out user, navigate to login page
  */

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     V I E W     S C H E D U L E S
  //
  //-------------------------------------------------------------------------------------------------------------
  const dashboardPage = (
    <>
      <div>
        <div className="topnav">
          <a href="#">Logout</a>
          {/* TODO: Redirect to Reptile page to launch the "add reptile" form */}
          <a href="#">Create Reptile</a>
        </div>
        <div className="btn-info">ReptíDex<br />{getDay()}'s Dashboard</div>\
        {/* TODO: for reptile in reptiles, display card */}
      </div>
    </>
  );

  return (
    <>
      {loggedIn && dashboardPage}
    </>
  );
}