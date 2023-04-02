/* TODO:
- I should see all of the schedules for my user for the day of the week it is (for example, if it is Monday then I should only see the schedules that have me doing something on Monday.)
- I should see a list of all my reptiles
- When selecting a reptile the app should navigate to the Reptile page
- I should be able to create a new reptile (you can do this on this page via something like a pop up, or you can create a new page for this)
- I should be able to delete a reptile.
- I should be able to log out of my account
*/
import { useEffect, useState } from "react";
import { Reptile } from "./Reptile";
import { useApi } from "../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import './Dashboard.css'

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


  async function authenticate() {
    const resultBody = await api.get(`/users/user`);
    console.log(resultBody);
    console.log(resultBody.message)
    if (resultBody.message === "unauthorized") {
      console.log("unauthorized");
      navigate('../login', { replace: true }); // navigates to a new page
    }

    setLoggedIn(true);
  }

  useEffect(() => {
    authenticate();
    getData();
  }, [])
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
  //                                     V I E W     S C H E D U L E S
  //
  //-------------------------------------------------------------------------------------------------------------
  const dashboardPage = (
    <>
      <div>
        <div className="btn-info">ReptíDex<br />{getDay()} Dashboard</div>
        <div className="card">
          <div className="title"><a href="reptile">{reptile.name}</a></div>
          <button className="delete">X</button>
          <div className="image-container">
            <img src="https://via.placeholder.com/150x110" alt="Pikachu" />
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
                        <br></br>
                      </div>
                      <div className='row days'>
                        <p className='day'>{schedule.monday ? "M" : ""}</p>
                        <p className='day'>{schedule.tuesday ? "T" : ""}</p>
                        <p className='day'>{schedule.wednesday ? "W" : ""}</p>
                        <p className='day'>{schedule.thursday ? "T" : ""}</p>
                        <p className='day'>{schedule.friday ? "F" : ""}</p>
                        <p className='day'>{schedule.saturday ? "S" : ""}</p>
                        <p className='day'>{schedule.sunday ? "S" : ""}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {loggedIn && dashboardPage}
    </>
  );
}