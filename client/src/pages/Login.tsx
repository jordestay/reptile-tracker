/* TODO:
- I should be able to sign into a user account
- I should be able to navigate to the signup page
- Upon signing in, I should be redirected to the dashboard page
*/
import './Login.css'
export const Login = () => {
  
    return  <div className="login">
      <div className="company">
        <h1>Reptile Tracker Login</h1>
      </div>
      <div className="form">
        <form >
          <input className="text" type="text" placeholder="Email" id="email" required/>
          <input className="password" type="password" placeholder="Password" />
          <a href="#" className='btn-login' id='do-login'>Login</a>
          <a href="#" className='forgot'>Sign Up</a>
        </form>

      </div>
      
      
    </div>  
  }