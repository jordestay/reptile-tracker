/* TODO:
If I am already logged in, then I should be redirected (replace state) 
to the dashboard page when I reach this page. Otherwise I should be 
able to do the following:
- I should see the name of your application
- I should see a description of what the app does.
- I should be able to navigate to the Login page
- I should be able to navigate to the Signup page
*/
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

export const Home = () => {
  // const [pageName, setPage] = useState("toasts");
  // console.log(pageName);
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
