import { useEffect, useState } from "react";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { Dashboard } from "../pages/Dashboard";
import { Reptile } from "../pages/Reptile";

function Router() {
  const [page, setPage] = useState(window.location.hash.replace("#", ""));

  // this synchronizes the application state with the browser location state
  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  // this synchronizes the browser location state with our application state
  useEffect(() => {
    const hashChange = () => {
      setPage(window.location.hash.replace("#", ""));
    };
    window.addEventListener("hashchange", hashChange);

    return () => {
      window.removeEventListener("hashchange", hashChange);
    };
  }, []);

  // dynamically select which page to render based on application state
  let component = <div>Not found</div>;
  if (page === "home") component = <Home />;
  else if (page === "login") component = <Login />;
  else if (page === "signup") component = <Signup />;
  else if (page === "dashboard") component = <Dashboard />;
  else if (page === "reptile") component = <Reptile />;

  return (
    <div>
      <nav>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("signup")}>Signup</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("reptile")}>Reptile</button>
      </nav>
      {component}
    </div>
  );
}

export default Router;


// import { useState } from "react";

// export const App = () => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   async function signUp() {
//     const body = {
//       firstName,
//       lastName,
//       email,
//       password
//     }
//     const result = await fetch(`/users`, {
//       method: 'post',
//       headers: {
//         "Content-Type": "application/json"
//       },
//       credentials: "include",
//       body: JSON.stringify(body)
//     });
//   }

//   return (
//     <form className="signup-form">
//       <label>
//         First Name
//         <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" />
//       </label>
//       <label>
//         Last Name
//         <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" />
//       </label>
//       <label>
//         Email
//         <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
//       </label>
//       <label>
//         Password yo!
//         <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
//       </label>
//       <button type="button" onClick={signUp}>Sign up</button>
//     </form>
//   )
// }