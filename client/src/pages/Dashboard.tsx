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

export const Dashboard = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [loggedIn, setLoggedIn] = useState(false);

  async function authenticate() {
    // const result = await fetch(`localhost:3000/`, {
    //   // method: 'post',
    //   // headers: {
    //   //   "Content-Type": "application/json"
    //   // },
    //   credentials: "include",
    //   // body: JSON.stringify(body)
    // });

    const resultBody = await api.get(`/users/user`);
    console.log(resultBody);
    console.log(resultBody.message)
    if (resultBody.message === "unauthorized") {
      console.log("unauthorized");
      navigate('../login', {replace: true}); // navigates to a new page
    }

    setLoggedIn(true);
    // const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}/`);

    // console.log(resultBody);

    // return true;
  }

  function getData() {
    // TODO: fetch data for dashboard from server
  }

  useEffect(() => {
    authenticate();
    getData();
  }, [])

  return (
    <>
      {loggedIn && <h1>Dashboard</h1>}
    </>
  );
};


