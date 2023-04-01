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

  return <div>
    <div className="card">
      <div className="pill">Type</div>
      <div className="title">Pikachu</div>
      <button className="delete">Delete</button>
      <div className="image-container">
      </div>
      <div className="info">
        <div className="label">Height</div>
        <div className="value">40 cm</div>
        <div className="label">Weight</div>
        <div className="value">6.0 kg</div>
        <div className="label">Abilities</div>
        <div className="value">Static, Lightning Rod</div>
      </div>
    </div>
  </div>
};


document.onmousemove = (event) => {
  const e = event || window.event;
      const $card = document.querySelector('.card');
      const $pill = document.querySelector('.pill');
      const $title = document.querySelector('.title');
      const $delete = document.querySelector('.delete');
      const $image = document.querySelector('.image-container');
      const $info = document.querySelector('.info');

      const x = (e.pageX - cumulativeOffset($card).left - ($card.offsetWidth / 2)) * -1 / 100;
      const y = (e.pageY - cumulativeOffset($card).top - ($card.offsetHeight / 2)) * -1 / 100;

      const matrix = [
      [1, 0, 0, -x * 0.00005],
      [0, 1, 0, -y * 0.00005],
      [0, 0, 1, 1],
      [0, 0, 0, 1]
      ];

      generateTranslate($pill, e, 0.03);
      generateTranslate($title, e, 0.03);
      generateTranslate($delete, e, 0.03);
      generateTranslate($image, e, 0.03);
      generateTranslate($info, e, 0.03);

      $card.style.transform = `matrix3d(${matrix.toString()})`;
};

      function cumulativeOffset(element) {
        let top = 0, left = 0;
      do {
        top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
  } while (element);

      return {
        top: top,
      left: left
  };
}

const generateTranslate = (el, e, value) => {
        el.style.transform = `translate(${e.clientX * value}px, ${e.clientY * value}px)`;
};

     
