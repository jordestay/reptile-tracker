/* TODO:
If I am already logged in, then I should be redirected (replace state) 
to the dashboard page when I reach this page. Otherwise I should be 
able to do the following:
- I should see the name of your application
- I should see a description of what the app does.
- I should be able to navigate to the Login page
- I should be able to navigate to the Signup page
*/
import { useEffect } from "react";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { useApi } from "../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";


export const Home = () => {
  const navigate = useNavigate();
  const api = useApi();

  // const [pageName, setPage] = useState("toasts");
  // console.log(pageName);

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
    // console.log(resultBody);
    // console.log(resultBody.message)
    if (resultBody.message !== "unauthorized") {
      // console.log("unauthorized");
      navigate('dashboard', {replace: true}); // navigates to a new page
    }
    // const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}/`);

    // console.log(resultBody);

    // return true;
  }

  useEffect(() => {
    authenticate();
  }, [])

  return (
    <div>
      <h1>Reptile Tracker</h1>
      <p>
        Description... Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
        enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
        in voluptate velit eu fugiat nulla pariatur.
      </p>
      <button onClick={() => navigate('login')}>Go to login</button>
      <button onClick={() => navigate('signup')}>Go to sign up</button>  

      {/* <div>
      <button onClick={() => setPage("login")}>Login</button>
      <button onClick={() => setPage("signup")}>Signup</button>
      <div>
        {pageName === "login" && <Login />}
        {pageName === "signup" && <Signup />}
      </div>
    </div> */}
    </div>
  );
};
