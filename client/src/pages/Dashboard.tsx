import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import './Dashboard.css'

type Reptile = {
  name: string,
  species: string,
  sex: string,
  id: number,
  schedules: Schedule[]
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
  const [reptileList, setReptileList] = useState<Reptile[]>([]);
  const [newReptile, setNewReptile] = useState<Reptile>({
    name: "",
    sex: "",
    species: "",
  } as Reptile);
  const [editingReptile, setEditingReptile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    console.log(resultBody);
    if (resultBody.message === "unauthorized") {
      console.log("unauthorized");
      navigate('../login', { replace: true });
    }
    setLoggedIn(true);
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     G E T     D A Y
  //
  //-------------------------------------------------------------------------------------------------------------
  const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  const getDay = (): string => {
    const d = new Date();
    let day = weekday[d.getDay()];
    return day;
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     P U L L     D A T A
  //
  //-------------------------------------------------------------------------------------------------------------
  async function getData() {
    const resultBody = await api.get(`/reptiles`);
    console.log(resultBody);
    let reptiles = resultBody.reptiles;
    for (const reptile of resultBody.reptiles) {
      let schedules = [];
      const scheduleResultBody = await api.get(`/schedules/${reptile.id}`);
      for (const schedule of scheduleResultBody.schedules as Schedule[]) {
        const today = getDay() as keyof typeof schedule;
        console.log(schedule);
        if (schedule[today] == true) {
          console.log(schedule);
          schedules.push(schedule);
        }
      }
      reptile.schedules = schedules;
    }
    setReptileList(reptiles);
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     E D I T     R E P T I L E
  //
  //-------------------------------------------------------------------------------------------------------------
  async function editReptile() {
    setErrorMessage('');
    const editReptileBody = await api.post(`/reptiles/`, newReptile);
    if (editReptileBody.message === "Reptile updated.") {
      setEditingReptile(false);
    } else {
      setErrorMessage(editReptileBody.message);
    }
    getData();
  }


  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     C R E A T E      R E P T I L E
  //
  //-------------------------------------------------------------------------------------------------------------
  const createReptileForm = (
    <>
      <div className='signUp' id='signUp'>
        <div className='company'>
          <h2>Create Reptile</h2>
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
            <a className='forgot' onClick={() => setEditingReptile(false)}>Cancel</a>
            <p>{errorMessage !== '' && errorMessage}</p>
          </form>
        </div>
      </div>
    </>
  )

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     D E L E T E     R E P T I L E
  //
  //-------------------------------------------------------------------------------------------------------------
  async function deleteReptile(id: number) {
    const deleteReptile = api.del(`/reptiles/${id}`);
    console.log(deleteReptile);
    const temp = [...reptileList];
    let theReptile = {} as Reptile;
    for (let i = 0; i < reptileList.length; i++) {
      if (reptileList[i].id == id) {
        theReptile = { ...reptileList[i] };
      }
    }
    temp.splice(temp.indexOf(theReptile), 1);
    setReptileList(temp);
    // getData();
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     C R E A T E     C A R D
  //
  //-------------------------------------------------------------------------------------------------------------
  function createCard(reptile: Reptile) {
    return (<>
      <div className="card">
        <div className="title"><a href={`reptile/${reptile.id}`}>{reptile.name}</a></div>
        <button className="delete" onClick={() => deleteReptile(reptile.id)}>X</button>
        <div className="image-container">
          <img src="https://via.placeholder.com/150x110" />
        </div>
        <div className="info">
          <div className="label">{getDay()} Schedule</div>
          <ul>
            {
              reptile.schedules.map((schedule) => (
                <li>{schedule.type} | {schedule.description}</li>
              ))
            }
          </ul>
        </div>
      </div>
    </>);
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     L O G O U T
  //
  //-------------------------------------------------------------------------------------------------------------
  function logout() {
    const name = "session-token";
    document.cookie = name + "=" + '=; Max-Age=0';
    setLoggedIn(false);
    navigate('../login', { replace: true });
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     V I E W     S C H E D U L E S
  //
  //-------------------------------------------------------------------------------------------------------------
  const dashboardPage = (
    <>

      <div>
        <div className="topnav">
          <a href="../login" onClick={() => logout()}>Logout</a>
          {/* TODO: Redirect to Reptile page to launch the "add reptile" form */}
          <a href="#" onClick={() => setEditingReptile(true)}>Create Reptile</a>
          
        </div>
        <div className="btn-info">ReptíDex<br />{getDay()}'s Dashboard</div>
        {/* TODO: for reptile in reptiles, display card */}
        <div className='reptiles'>
          {
            reptileList.map((reptileList) => (
              createCard(reptileList)
            ))
          }
        </div>
      </div>
      { editingReptile && createReptileForm}
    </>
  );

  return (
    <>
      {loggedIn && dashboardPage}
    </>
  );
}