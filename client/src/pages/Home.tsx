import { useEffect } from "react";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { useApi } from "../hooks/useApi";
import './Home.css';
import { useNavigate, useParams } from "react-router-dom";
import { Dashboard } from "./Dashboard";

export const Home = () => {
  const navigate = useNavigate();
  const api = useApi();

  async function authenticate() {
    const resultBody = await api.get(`/users/user`);
    if (resultBody.message !== "unauthorized") {
      navigate('dashboard', { replace: true }); // navigates to a new page
    }
  }

  useEffect(() => {
    authenticate();
  }, [])

  return (
    <div>
      <div className="btn-bg Pokemon">
        <div className="btn-info">ReptíDex</div>
        <div className="btn-mention">
          <span>Gotta track 'em all!</span>
          <p>Herpetoculturist record-keeping for feedings, schedules, and husbandry.</p>
        </div>
        <div className="btn-group">
          <div className="btn ball">
            <button>
              <div className="pokemon-ball"></div>
              <a href='login'>Log In</a>
              <span data-letters="Go!"></span>
              <span data-letters="Go!"></span>
            </button>
          </div>
          <div className="btn ball">
            <button>
              <div className="pokemon-ball"></div>
              <a href='signup'>Sign Up</a>
              <span data-letters="Go!"></span>
              <span data-letters="Go!"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};