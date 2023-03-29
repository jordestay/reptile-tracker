/* TODO:
- I should see a list of all of the feedings for this reptile
- I should see a list of all of the husbandry records for this reptile
- I should see a list of all of the schedules for this reptile.
- I should be able to update this reptile
- I should be able to create a feeding for this reptile
- I should be able to create a husbandry record for this reptile
- I should be able to create a schedule for this reptile
*/
import { useApi } from "../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";


export const Reptile = () => {
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
      navigate('../login', { replace: true }); // navigates to a new page
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
      {loggedIn && <h1>Reptile</h1>}
    </>
  );
}