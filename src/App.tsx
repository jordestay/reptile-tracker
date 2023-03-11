import { useEffect, useState } from "react";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Reptile } from "./pages/Reptile";

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
