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
  el.style.transform = `translate(${e.clientX*value}px, ${e.clientY*value}px)`;
};



// Define the card data
const cardData = [
  {
    title: "Card 1",
    image: "https://via.placeholder.com/150",
    info: "This is card 1",
  },
  {
    title: "Card 2",
    image: "https://via.placeholder.com/150",
    info: "This is card 2",
  },
  {
    title: "Card 3",
    image: "https://via.placeholder.com/150",
    info: "This is card 3",
  },
  {
    title: "Card 4",
    image: "https://via.placeholder.com/150",
    info: "This is card 4",
  },
  {
    title: "Card 5",
    image: "https://via.placeholder.com/150",
    info: "This is card 5",
  },
];

// Define the createCard function
const createCard = (data) => {
  // Create the card elements
  const $card = document.createElement("div");
  $card.classList.add("card");

  const $pill = document.createElement("div");
  $pill.classList.add("pill");
  $pill.innerText = "New";

  const $title = document.createElement("h2");
  $title.classList.add("title");
  $title.innerText = data.title;

  const $delete = document.createElement("button");
  $delete.classList.add("delete");
  $delete.innerText = "X";

  const $imageContainer = document.createElement("div");
  $imageContainer.classList.add("image-container");

  const $image = document.createElement("img");
  $image.setAttribute("src", data.image);
  $image.setAttribute("alt", data.title);

  const $info = document.createElement("div");
  $info.classList.add("info");
  $info.innerText = data.info;

  // Append the card elements to the card
  $imageContainer.appendChild($image);
  $card.appendChild($pill);
  $card.appendChild($title);
  $card.appendChild($delete);
  $card.appendChild($imageContainer);
  $card.appendChild($info);

  // Append the card to the body
  document.body.appendChild($card);

  // Return the card
  return $card;
};

// Create and display 5 cards
for (let i = 0; i < 5; i++) {
  const card = createCard(cardData[i]);
}

