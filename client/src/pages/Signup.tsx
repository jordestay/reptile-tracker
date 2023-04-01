/* TODO:
- I should be able to create a user account
- I should be able to navigate to the Login page
- Upon creating an account I should be redirected to the dashboard page
*/

import './SignUp.css';
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { useContext, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { AuthContext } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const api = useApi();
  const setAuth = useContext(AuthContext);

  async function signUp() {
    const body = {
      firstName,
      lastName,
      email,
      password
    }

    const result = await api.post(`/users`, body);
    // const result = await api.post(`/sessions`, body);

    if (result.message !== "User created.") {
      return;
    }

    navigate('../dashboard', {replace: true}); // navigates to a new page
    
    console.log("hit signup page")
    console.log(result);
  }

  return <div className='signUp' id='signUp'>
    <div className='company'>
      <h1>Reptile Tracker</h1>
    </div>
    <p className='msg'>Sign Up for Reptile Tracker</p>
    <div className='form'>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder='First Name' className='text' id='firstName' required /><br /><br />
        <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder='Last Name' className='text' id='lastName' required /><br /><br />
        <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder='Email' className='text' id='email' required /><br />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder='Password' className='password' /><br /><br />
        <a onClick={() => signUp()} className='btn-signUp' id='do-signUp'>Create Account</a>
        <a href="login" className='signIn'>Login</a>
      </form>
    </div>
  </div>
}