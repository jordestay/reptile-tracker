/* TODO:
- I should be able to sign into a user account
- I should be able to navigate to the signup page
- Upon signing in, I should be redirected to the dashboard page
*/
import { useContext, useState } from 'react';
import { useApi } from '../hooks/useApi';
import './Login.css'
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const api = useApi();
  

  async function login() {
    const body = {
      email,
      password
    }

    const resultBody = await api.post(`/sessions`, body);
    

    if (resultBody.message !== "Successfully logged in.") {
      return;
    }
    navigate('../dashboard', {replace: true}); // navigates to a new page

    console.log("hit the login page");
    
  
  }

  
    return  <div className="login">
      <div className="company">
        <h1>Reptile Tracker Login</h1>
      </div>
      <div className="form">
        <form >
          <input onChange={e => setEmail(e.target.value)} className="text" type="text" placeholder="Email" id="email" required/>
          <input onChange={e => setPassword(e.target.value)} className="password" type="password" placeholder="Password" />
          <a href="#" className='btn-login' id='do-login' onClick={() => login()}>Login</a>
          <a href="signup" className='forgot'>Sign Up</a>
        </form>

      </div>
      
      
    </div>  
  }