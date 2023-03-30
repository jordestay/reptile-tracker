/* TODO:
- I should see a list of all of the feedings for this reptile
- I should see a list of all of the husbandry records for this reptile
- I should see a list of all of the schedules for this reptile.
- I should be able to update this reptile
- I should be able to create a feeding for this reptile
- I should be able to create a husbandry record for this reptile
- I should be able to create a schedule for this reptile
*/
import './Reptile.css';
import { useApi } from "../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";


type Reptile = {
  name: string,
  species: string,
  sex: string
}

type Feeding = {
  id: number
  foodItem: string
}

type Husbandry = {
  id: number
  length: number
  weight: number
  temperature: number
  humidity: number
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

export const Reptile = () => {
  const navigate = useNavigate();
  const api = useApi();
  const { id } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [reptile, setReptile] = useState<Reptile>({} as Reptile);
  const [feedings, setFeedings] = useState<Feeding[]>([]);
  const [husbandries, setHusbandries] = useState<Husbandry[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [creatingFeeding, setCreatingFeeding] = useState(false);
  const [creatingHusbandry, setCreatingHusbandry] = useState(false);
  const [creatingSchedule, setCreatingSchedule] = useState(false);
  const [feeding, setFeeding] = useState<Feeding>({ foodItem: "" } as Feeding);
  const [husbandry, setHusbandry] = useState<Husbandry>({
    length: 0,
    weight: 0,
    temperature: 0,
    humidity: 0,
  } as Husbandry);
  const [schedule, setSchedule] = useState<Schedule>({
    type: "",
    description: "",
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  } as Schedule);




  async function signUp() {
    const body = {
      firstName: "Nate",
      lastName: "Taylor",
      email: "nate.taylor@usu.edu",
      password: "password"
    }
    // const result = await api.post(`/users`, body);
    const result = await api.post(`/sessions`, body);

    console.log(result);
  }

  async function createReptile() {
    const body = {
      name: "ash",
      species: "redtail_boa",
      sex: "f"
    }
    const result = await api.post(`/reptiles`, body);
    console.log(result);
  }

  async function authenticate() {
    const resultBody = await api.get(`/users/user`);
    if (resultBody.message === "unauthorized") {
      navigate('../login', { replace: true });
    }
    setLoggedIn(true);
  }

  async function getData() {
    // TODO: fetch data for dashboard from server
    // console.log(id);
    const resultBody = await api.get(`/reptiles`);
    console.log(resultBody);
    if (!id || isNaN(parseInt(id))) return; // TODO: boot them back to dashboard
    else {
      setReptile(resultBody.reptiles[parseInt(id)]);
    }

    const feedingResultBody = await api.get(`/feedings/${id}`);
    console.log(feedingResultBody);
    setFeedings(feedingResultBody.feedings);

    const husbandryResultBody = await api.get(`/husbandries/${id}`);
    console.log(husbandryResultBody);
    setHusbandries(husbandryResultBody.husbandries);

    const scheduleResultBody = await api.get(`/schedules/${id}`);
    console.log(scheduleResultBody);
    setSchedules(scheduleResultBody.schedules);
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     C R E A T E     F E E D I N G
  //
  //-------------------------------------------------------------------------------------------------------------
  async function createFeeding() {
    const createFeedingBody = await api.post(`/feedings/${id}`, feeding);
    console.log(createFeedingBody);
    const feedingResultBody = await api.get(`/feedings/${id}`);
    console.log(feedingResultBody);
    setFeedings(feedingResultBody.feedings);
    // TODO: update feedings list
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     C R E A T E     H U S B A N D R Y
  //
  //-------------------------------------------------------------------------------------------------------------
  async function createHusbandry() {
    const createHusbandryBody = await api.post(`/husbandries/${id}`, husbandry);
    console.log(createHusbandryBody);
    const husbandriesResultBody = await api.get(`/husbandries/${id}`);
    console.log(husbandriesResultBody);
    setHusbandries(husbandriesResultBody.husbandries);
    // TODO: update feedings list
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     C R E A T E     S C H E D U L E
  //
  //-------------------------------------------------------------------------------------------------------------
  async function createSchedule() {
    const createScheduleBody = await api.post(`/schedules/${id}`, schedule);
    console.log(createScheduleBody);
    const schedulesResultBody = await api.get(`/schedules/${id}`);
    console.log(schedulesResultBody);
    setSchedules(schedulesResultBody.schedules);
    // TODO: update feedings list
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     S T A R T     U P
  //
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    authenticate();
    getData();
    // createReptile();
    // signUp();
  }, [])



  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     F E E D I N G     F O R M
  //
  //-------------------------------------------------------------------------------------------------------------
  const createFeedingForm = (
    <>
      <div className='signUp' id='signUp'>
        <div className='company'>
          <h2>Create Feeding</h2>
        </div>
        <p className='msg'>Please fill out the required information</p>
        <div className='form'>
          <form>
            <input type="text" placeholder="Food" onChange={(e) => {
              let newFeeding = { ...feeding };
              newFeeding.foodItem = e.target.value;
              setFeeding(newFeeding);
            }} value={feeding.foodItem} className="text final"></input>
            <a onClick={() => createFeeding()} className='btn-signUp' id='do-signUp'>Add Feeding</a>
            {/* <button type="button" onClick={() => createFeeding()}>Add Feeding</button> */}
          </form>
        </div>
      </div>
    </>
  )

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     H U S B A N D R Y     F O R M
  //
  //-------------------------------------------------------------------------------------------------------------
  const createHusbandryForm = (
    <>
      <form>
        <input type="number" placeholder="Length" onChange={(e) => {
          let newHusbandry = { ...husbandry };
          if (e.target.value === "") newHusbandry.length = 0;
          else newHusbandry.length = parseFloat(e.target.value);
          setHusbandry(newHusbandry);
        }} value={husbandry.length !== 0 ? husbandry.length : ""}></input>
        <input type="number" placeholder="Weight" onChange={(e) => {
          let newHusbandry = { ...husbandry };
          if (e.target.value === "") newHusbandry.length = 0;
          else newHusbandry.weight = parseFloat(e.target.value);
          setHusbandry(newHusbandry);
        }} value={husbandry.weight !== 0 ? husbandry.weight : ""}></input>
        <input type="number" placeholder="Temperature" onChange={(e) => {
          let newHusbandry = { ...husbandry };
          if (e.target.value === "") newHusbandry.length = 0;
          else newHusbandry.temperature = parseFloat(e.target.value);
          setHusbandry(newHusbandry);
        }} value={husbandry.temperature !== 0 ? husbandry.temperature : ""}></input>
        <input type="number" placeholder="Humidity" onChange={(e) => {
          let newHusbandry = { ...husbandry };
          if (e.target.value === "") newHusbandry.length = 0;
          else newHusbandry.humidity = parseFloat(e.target.value);
          setHusbandry(newHusbandry);
        }} value={husbandry.humidity !== 0 ? husbandry.humidity : ""}></input>
        <button type="button" onClick={() => createHusbandry()}>Add Husbandry</button>
      </form>
    </>
  )

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     S C H E D U L E     F O R M
  //
  //-------------------------------------------------------------------------------------------------------------
  const createScheduleForm = (
    <>
      <form>
        <input type="text" placeholder="Type" onChange={(e) => {
          let newSchedule = { ...schedule };
          newSchedule.type = e.target.value;
          setSchedule(newSchedule);
        }} value={schedule.type}></input>
        <textarea placeholder="Description" onChange={(e) => {
          let newSchedule = { ...schedule };
          newSchedule.description = e.target.value;
          setSchedule(newSchedule);
        }} value={schedule.description}></textarea>
        <input checked={schedule.monday} type="checkbox" onChange={() => {
          let newSchedule = { ...schedule };
          newSchedule.monday = !schedule.monday;
          setSchedule(newSchedule);
        }} />Monday
        <input checked={schedule.tuesday} type="checkbox" onChange={() => {
          let newSchedule = { ...schedule };
          newSchedule.tuesday = !schedule.tuesday;
          setSchedule(newSchedule);
        }} />tuesday
        <input checked={schedule.wednesday} type="checkbox" onChange={() => {
          let newSchedule = { ...schedule };
          newSchedule.wednesday = !schedule.wednesday;
          setSchedule(newSchedule);
        }} />wednesday
        <input checked={schedule.thursday} type="checkbox" onChange={() => {
          let newSchedule = { ...schedule };
          newSchedule.thursday = !schedule.thursday;
          setSchedule(newSchedule);
        }} />thursday
        <input checked={schedule.friday} type="checkbox" onChange={() => {
          let newSchedule = { ...schedule };
          newSchedule.friday = !schedule.friday;
          setSchedule(newSchedule);
        }} />friday
        <input checked={schedule.saturday} type="checkbox" onChange={() => {
          let newSchedule = { ...schedule };
          newSchedule.saturday = !schedule.saturday;
          setSchedule(newSchedule);
        }} />saturday
        <input checked={schedule.sunday} type="checkbox" onChange={() => {
          let newSchedule = { ...schedule };
          newSchedule.sunday = !schedule.sunday;
          setSchedule(newSchedule);
        }} />sunday
        <button type="button" onClick={() => createSchedule()}>Add Schedule</button>
      </form>
    </>
  )

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     P A G E     C O N T E N T S
  //
  //-------------------------------------------------------------------------------------------------------------
  const reptilePage = (
    <>
      <div className="header container">
        <h1>{reptile.name}</h1>
        <h2>{reptile.species ? reptile.species.replace("_", " ") : ""}</h2>
        <h2>{reptile.sex}</h2>
      </div>
      <div className='row'>
        <div className='col'>
          <div className='container'>
            {
              schedules.map((schedule) => (
                <div key={schedule.id}>
                  <p>
                    {schedule.type}&nbsp;
                    {schedule.description}&nbsp;
                    {schedule.monday ? "Monday" : ""}&nbsp;
                    {schedule.tuesday ? "Tuesday" : ""}&nbsp;
                    {schedule.wednesday ? "Wednesday" : ""}&nbsp;
                    {schedule.thursday ? "Thursday" : ""}&nbsp;
                    {schedule.friday ? "Friday" : ""}&nbsp;
                    {schedule.saturday ? "Saturday" : ""}&nbsp;
                    {schedule.sunday ? "Sunday" : ""}&nbsp;
                  </p>
                </div>
              ))
            }
            <button onClick={() => setCreatingSchedule(!creatingSchedule)}>Create Schedule</button>
            {creatingSchedule && createScheduleForm}
          </div>
        </div>
        <div className='col'>

          <div className='container'>
            {
              feedings.map((feeding) => (
                <div key={feeding.id}>
                  <p>{feeding.foodItem}</p>
                </div>
              ))
            }
            <button onClick={() => setCreatingFeeding(!creatingFeeding)}>Create Feeding</button>
            {creatingFeeding && createFeedingForm}
          </div>
          <div className='container'>
            {
              husbandries.map((husbandry) => (
                <div key={husbandry.id}>
                  <p>length {husbandry.length} humidity {husbandry.humidity} temp {husbandry.temperature} weight {husbandry.weight}</p>
                </div>
              ))
            }
            <button onClick={() => setCreatingHusbandry(!creatingHusbandry)}>Create Husbandry</button>
            {creatingHusbandry && createHusbandryForm}
          </div>
        </div>

      </div>
    </>
  );


  return (
    <>
      {loggedIn && reptilePage}
    </>
  );
}