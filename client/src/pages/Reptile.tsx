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
import { useNavigate, useParams, useResolvedPath } from "react-router-dom";
import { useEffect, useState } from "react";


type Reptile = {
  name: string,
  species: string,
  sex: string
}

type Feeding = {
  id: number
  foodItem: string
  updatedAt: string
}

type Husbandry = {
  id: number
  length: number
  weight: number
  temperature: number
  humidity: number
  updatedAt: string
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
  const [newReptile, setNewReptile] = useState<Reptile>({
    name: "",
    sex: "",
    species: ""
  } as Reptile);
  const [feedings, setFeedings] = useState<Feeding[]>([]);
  const [husbandries, setHusbandries] = useState<Husbandry[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [creatingFeeding, setCreatingFeeding] = useState(false);
  const [creatingHusbandry, setCreatingHusbandry] = useState(false);
  const [creatingSchedule, setCreatingSchedule] = useState(false);
  const [editingReptile, setEditingReptile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  useEffect(() => {
    if (creatingFeeding) {
      setCreatingHusbandry(false);
      setCreatingSchedule(false);
      setEditingReptile(false);
    } else {
      setFeeding({ foodItem: "" } as Feeding);
      setErrorMessage('');
    }
  }, [creatingFeeding]);

  useEffect(() => {
    if (creatingHusbandry) {
      setCreatingFeeding(false);
      setCreatingSchedule(false);
      setEditingReptile(false);
    } else {
      setHusbandry({
        length: 0,
        weight: 0,
        temperature: 0,
        humidity: 0,
      } as Husbandry);
      setErrorMessage('');
    }
  }, [creatingHusbandry]);

  useEffect(() => {
    if (creatingSchedule) {
      setCreatingHusbandry(false);
      setCreatingFeeding(false);
      setEditingReptile(false);
    } else {
      setSchedule({
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
      setErrorMessage('');
    }
  }, [creatingSchedule]);

  useEffect(() => {
    if (editingReptile) {
      setNewReptile({ ...reptile });
      setCreatingHusbandry(false);
      setCreatingFeeding(false);
      setCreatingSchedule(false);
    } else {
      setNewReptile({
        name: "",
        sex: "",
        species: ""
      } as Reptile);
      setErrorMessage('');
    }
  }, [editingReptile]);



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

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     F O R M A T     D A T E
  //
  //-------------------------------------------------------------------------------------------------------------
  function formatDate(date: Date): string {
    let morning = true;
    if (date.getHours() > 11) morning = false;
    const hour = date.getHours() === 12 ? 12 : date.getHours() % 12;
    let minutes = "" + date.getMinutes();
    if (date.getMinutes() < 10) minutes = `0${minutes}`;
    return `${date.toString().substring(4, 7)} ${date.getDate()} at ${hour}:${minutes} ${morning ? 'AM' : 'PM'}`;
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     P U L L     D A T A
  //
  //-------------------------------------------------------------------------------------------------------------
  async function getData() {
    const resultBody = await api.get(`/reptiles`);
    console.log(resultBody);
    if (!id || isNaN(parseInt(id))) {
      navigate('../dashboard, {replace: true}');
    } else {
      try {
        setReptile(resultBody.reptiles[parseInt(id)-1]);
      } catch (e) { // if there is no id-th reptile for the user
        navigate('../dashboard, {replace: true}');
      }
    }

    // retrieve feedings from database
    const feedingResultBody = await api.get(`/feedings/${id}`);
    const allFeedings: Feeding[] = feedingResultBody.feedings;
    // sort the feedings, newest first
    const sortedFeedings: Feeding[] = allFeedings.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    // update feedings to include retrieved feedings
    setFeedings(sortedFeedings);

    const husbandryResultBody = await api.get(`/husbandries/${id}`);
    const allHusbandries: Husbandry[] = husbandryResultBody.husbandries;
    // sort the husbandries, newest first
    const sortedHusbandries: Husbandry[] = allHusbandries.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    // update husbandries to include retrieved husbandries
    setHusbandries(sortedHusbandries);

    const scheduleResultBody = await api.get(`/schedules/${id}`);
    console.log(scheduleResultBody);
    setSchedules(scheduleResultBody.schedules);
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     E D I T     R E P T I L E
  //
  //-------------------------------------------------------------------------------------------------------------
  async function editReptile() {
    setErrorMessage('');
    const editReptileBody = await api.put(`/reptiles/${id}`, newReptile);
    console.log(editReptileBody);
    if (editReptileBody.message === "Reptile updated.") {
      const updatedReptile = editReptileBody.reptile;
      setReptile(updatedReptile);
      setEditingReptile(false);
    } else {
      setErrorMessage(editReptileBody.message);
    }
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     C R E A T E     F E E D I N G
  //
  //-------------------------------------------------------------------------------------------------------------
  async function createFeeding() {
    setErrorMessage('');
    const createFeedingBody = await api.post(`/feedings/${id}`, feeding);
    console.log(createFeedingBody);
    // feeding creation is successful
    if (createFeedingBody.message === "Feeding created.") {
      // add feeding to feedings
      const newFeeding = createFeedingBody.feeding;
      setFeedings([newFeeding, ...feedings]);
      // make feeding form disappear
      setCreatingFeeding(false);
    } else {
      setErrorMessage(createFeedingBody.message);
    }
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     C R E A T E     H U S B A N D R Y
  //
  //-------------------------------------------------------------------------------------------------------------
  async function createHusbandry() {
    setErrorMessage('');
    const createHusbandryBody = await api.post(`/husbandries/${id}`, husbandry);
    console.log(createHusbandryBody);
    if (createHusbandryBody.message === "Husbandry created.") {
      const newHusbandry = createHusbandryBody.husbandry;
      setHusbandries([newHusbandry, ...husbandries]);
      setCreatingHusbandry(false);
    } else {
      setErrorMessage(createHusbandryBody.message);
    }
  }

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     C R E A T E     S C H E D U L E
  //
  //-------------------------------------------------------------------------------------------------------------
  async function createSchedule() {
    setErrorMessage('');
    const createScheduleBody = await api.post(`/schedules/${id}`, schedule);
    console.log(createScheduleBody);
    if (createScheduleBody.message === "Schedule created.") {
      const newSchedule = createScheduleBody.schedule;
      setSchedules([newSchedule, ...schedules]);
      setCreatingSchedule(false);
    } else {
      setErrorMessage(createScheduleBody.message);
    }
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
    signUp();
  }, [])

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
            <a className='forgot' onClick={() => setEditingReptile(false)}>Cancel</a>
            {/* <button type="button" onClick={() => createFeeding()}>Add Feeding</button> */}
            <p>{errorMessage !== '' && errorMessage}</p>
          </form>
        </div>
      </div>
    </>
  )

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
            <a className='forgot' onClick={() => setCreatingFeeding(false)}>Cancel</a>
            {/* <button type="button" onClick={() => createFeeding()}>Add Feeding</button> */}
            <p>{errorMessage !== '' && errorMessage}</p>
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
      <div className='signUp' id='signUp'>
        <div className='company'>
          <h2>Create Husbandry</h2>
        </div>
        <p className='msg'>Please fill out the required information</p>
        <div className='form'>
          <form>
            <input
              type="number"
              placeholder="Length"
              onChange={(e) => {
                let newHusbandry = { ...husbandry };
                if (e.target.value === "") newHusbandry.length = 0;
                else newHusbandry.length = parseFloat(e.target.value);
                setHusbandry(newHusbandry);
              }}
              value={husbandry.length !== 0 ? husbandry.length : ""}
              className='text'
            ></input>
            <input
              type="number"
              placeholder="Weight"
              onChange={(e) => {
                let newHusbandry = { ...husbandry };
                if (e.target.value === "") newHusbandry.length = 0;
                else newHusbandry.weight = parseFloat(e.target.value);
                setHusbandry(newHusbandry);
              }}
              value={husbandry.weight !== 0 ? husbandry.weight : ""}
              className='text'
            ></input>
            <input
              type="number"
              placeholder="Temperature"
              onChange={(e) => {
                let newHusbandry = { ...husbandry };
                if (e.target.value === "") newHusbandry.length = 0;
                else newHusbandry.temperature = parseFloat(e.target.value);
                setHusbandry(newHusbandry);
              }}
              value={husbandry.temperature !== 0 ? husbandry.temperature : ""}
              className='text'
            ></input>
            <input
              type="number"
              placeholder="Humidity"
              onChange={(e) => {
                let newHusbandry = { ...husbandry };
                if (e.target.value === "") newHusbandry.length = 0;
                else newHusbandry.humidity = parseFloat(e.target.value);
                setHusbandry(newHusbandry);
              }}
              value={husbandry.humidity !== 0 ? husbandry.humidity : ""}
              className='text final'
            ></input>
            <a onClick={() => createHusbandry()} className='btn-signUp' id='do-signUp'>Add Husbandry</a>
            <a className='forgot' onClick={() => setCreatingHusbandry(false)}>Cancel</a>
            {/* <button type="button" onClick={() => createHusbandry()}>Add Husbandry</button> */}
            <p>{errorMessage !== '' && errorMessage}</p>
          </form>
        </div>
      </div>
    </>
  )

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     S C H E D U L E     F O R M
  //
  //-------------------------------------------------------------------------------------------------------------
  const createScheduleForm = (
    <>
      <div className='signUp' id='signUp'>
        <div className='company'>
          <h2>Create Schedule</h2>
        </div>
        <p className='msg'>Please fill out the required information</p>
        <div className='form'>
          <form>
            <input
              type="text"
              placeholder="Type"
              onChange={(e) => {
                let newSchedule = { ...schedule };
                newSchedule.type = e.target.value;
                setSchedule(newSchedule);
              }}
              value={schedule.type}
              className='text'
            ></input>
            <input
              placeholder="Description"
              onChange={(e) => {
                let newSchedule = { ...schedule };
                newSchedule.description = e.target.value;
                setSchedule(newSchedule);
              }}
              value={schedule.description}
              className='text'
            ></input>
            <div className="row">
              <input checked={schedule.monday} type="checkbox" onChange={() => {
                let newSchedule = { ...schedule };
                newSchedule.monday = !schedule.monday;
                setSchedule(newSchedule);
              }} />Monday
              <input checked={schedule.tuesday} type="checkbox" onChange={() => {
                let newSchedule = { ...schedule };
                newSchedule.tuesday = !schedule.tuesday;
                setSchedule(newSchedule);
              }} />Tuesday
              <input checked={schedule.wednesday} type="checkbox" onChange={() => {
                let newSchedule = { ...schedule };
                newSchedule.wednesday = !schedule.wednesday;
                setSchedule(newSchedule);
              }} />Wednesday
              <input checked={schedule.thursday} type="checkbox" onChange={() => {
                let newSchedule = { ...schedule };
                newSchedule.thursday = !schedule.thursday;
                setSchedule(newSchedule);
              }} />Thursday
              <input checked={schedule.friday} type="checkbox" onChange={() => {
                let newSchedule = { ...schedule };
                newSchedule.friday = !schedule.friday;
                setSchedule(newSchedule);
              }} />Friday
              <input checked={schedule.saturday} type="checkbox" onChange={() => {
                let newSchedule = { ...schedule };
                newSchedule.saturday = !schedule.saturday;
                setSchedule(newSchedule);
              }} />Saturday
              <input checked={schedule.sunday} type="checkbox" onChange={() => {
                let newSchedule = { ...schedule };
                newSchedule.sunday = !schedule.sunday;
                setSchedule(newSchedule);
              }} />Sunday
            </div>
            <a onClick={() => createSchedule()} className='btn-signUp' id='do-signUp'>Add Schedule</a>
            <a className='forgot' onClick={() => setCreatingSchedule(false)}>Cancel</a>
            {/* <button type="button" onClick={() => createSchedule()}>Add Schedule</button> */}
            <p>{errorMessage !== '' && errorMessage}</p>
          </form>
        </div>
      </div>
    </>
  )

  //-------------------------------------------------------------------------------------------------------------
  //
  //                                     P A G E     C O N T E N T S
  //
  //-------------------------------------------------------------------------------------------------------------
  const reptilePage = (
    <>
      <div className='page'>
        <div className="container top row section-heading">
          <div className='row'>
            <div className='reptile'>
              <h1 id='name'>{reptile.name}</h1>
              <p>{reptile.sex === 'f' ? 'female' : 'male'} {reptile.species ? reptile.species.replace("_", " ") : ""}</p>
            </div>
            <div>
              <button id='edit' onClick={() => { setEditingReptile(!editingReptile) }}>Edit</button>
              {editingReptile && updateReptileForm}
            </div>
          </div>
          <button onClick={() => { navigate('../dashboard') }}>Back to Dashboard</button>
        </div>
        <div className='row bottom'>
          <div className='col left'>
            <div className='container left'>
              <div className='row section-heading'>
                <h2>Schedules</h2>
                <button onClick={() => setCreatingSchedule(!creatingSchedule)}>Create Schedule</button>
              </div>
              <div className='items'>
                {
                  schedules.map((schedule) => (
                    <div key={schedule.id} className="item">
                      <div className='row section-heading'>
                        <div className='col'>
                          <h3>{schedule.type.toUpperCase()}&nbsp;</h3>
                          {/* <h4>Description</h4> */}
                          <p className='description'>{schedule.description}</p>
                          <br></br>
                        </div>
                        {/* <p>
                          {schedule.type}&nbsp;
                          {schedule.description}&nbsp;
                        </p> */}
                        <div className='row days'>

                          <p className='day'>{schedule.monday ? "M" : ""}</p>
                          <p className='day'>{schedule.tuesday ? "T" : ""}</p>

                          <p className='day'>{schedule.wednesday ? "W" : ""}</p>

                          <p className='day'>{schedule.thursday ? "T" : ""}</p>

                          <p className='day'>{schedule.friday ? "F" : ""}</p>

                          <p className='day'>{schedule.saturday ? "S" : ""}</p>

                          <p className='day'>{schedule.sunday ? "S" : ""}</p>

                        </div>
                        {/* <p>

                          |&nbsp;&nbsp;{schedule.monday ? "M" : "-"}&nbsp;&nbsp;|
                          &nbsp;&nbsp;{schedule.tuesday ? "T" : "-"}&nbsp;&nbsp;|
                          &nbsp;&nbsp;{schedule.wednesday ? "W" : "-"}&nbsp;&nbsp;|
                          &nbsp;&nbsp;{schedule.thursday ? "T" : "-"}&nbsp;&nbsp;|
                          &nbsp;&nbsp;{schedule.friday ? "F" : "-"}&nbsp;&nbsp;|
                          &nbsp;&nbsp;{schedule.saturday ? "S" : "-"}&nbsp;&nbsp;|
                          &nbsp;&nbsp;{schedule.sunday ? "S" : "-"}&nbsp;&nbsp;|
                        </p> */}
                      </div>
                      {/* <div>
                        <p>{schedule.description}</p>
                      </div> */}
                    </div>
                  ))
                }
              </div>
              {creatingSchedule && createScheduleForm}
            </div>
          </div>
          <div className='col right'>
            <div className='container right'>
              <div className='row section-heading'>
                <h2>Feedings</h2>
                <button onClick={() => setCreatingFeeding(!creatingFeeding)}>Create Feeding</button>
              </div>
              <div className='items'>
                {
                  feedings.map((feeding) => (
                    <div key={feeding.id} className="item">
                      <div className='row section-heading'>
                        <h3>{feeding.foodItem}</h3>
                        <p>{formatDate(new Date(feeding.updatedAt))}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
              {creatingFeeding && createFeedingForm}
            </div>
            <div className='container right'>
              <div className='row section-heading'>
                <h2>Husbandries</h2>
                <button onClick={() => setCreatingHusbandry(!creatingHusbandry)}>Create Husbandry</button>
              </div>
              <div className='items'>
                {
                  husbandries.map((husbandry) => (
                    <div key={husbandry.id} className="item row stats">
                      {/* <div className='section-heading'> */}
                      <div>
                        <h3>Length</h3>
                        <p>{husbandry.length}</p>
                      </div>
                      <div>
                        <h3>Weight</h3>
                        <p>{husbandry.weight}</p>
                      </div>
                      <div>
                        <h3>Temperature</h3>
                        <p>{husbandry.temperature}</p>
                      </div>
                      <div>
                        <h3>Humidity</h3>
                        <p>{husbandry.humidity}</p>
                      </div>
                      <p>{formatDate(new Date(husbandry.updatedAt))}</p>
                      {/* </div> */}
                    </div>
                  ))
                }
              </div>
              {creatingHusbandry && createHusbandryForm}
            </div>
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