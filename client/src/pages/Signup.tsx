/* TODO:
- I should be able to create a user account
- I should be able to navigate to the Login page
- Upon creating an account I should be redirected to the dashboard page
*/

import './SignUp.css'
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";

export const Signup = () => {

  return <div className='signUp' id='signUp'>
    <div className='company'>
      <h1>Reptile Tracker</h1>
    </div>
    <p className='msg'>Sign Up for Reptile Tracker</p>
    <div className='form'>
      <form>
        <input type="text" placeholder='First Name' className='text' id='firstName' required /><br /><br />
        <input type="text" placeholder='Last Name' className='text' id='lastName' required /><br /><br />
        <input type="text" placeholder='Email' className='text' id='email' required /><br />
        <input type="password" placeholder='Password' className='password' /><br /><br />
        <a href="dashboard" className='btn-signUp' id='do-signUp'>Create Account</a>
        <a href="login" className='signIn'>Login</a>
      </form>
    </div>
  </div>
}