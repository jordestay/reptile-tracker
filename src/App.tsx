import { useState } from 'react'
import { HomePage } from './HomePage'
import { DashboardPage } from './DashboardPage'
import { ReptilePage } from './ReptilePage'

export const App = () => {
  const [pageName, setPageName] = useState("toasts");
  console.log(pageName);
  return (
    <div>
      <button onClick={() => setPageName("home")}>Home</button>
      <button onClick={() => setPageName("login")}>Login</button>
      <button onClick={() => setPageName("signup")}>Signup</button>
      <button onClick={() => setPageName("dashboard")}>Dashboard</button>
      <button onClick={() => setPageName("reptile")}>Reptile</button>
      <div>
        {pageName === "home" && <HomePage />}
        {pageName === "login" && <LoginPage />}
        {pageName === "signup" && <SignupPage />}
        {pageName === "dashboard" && <DashboardPage />}
        {pageName === "reptile" && <ReptilePage />}
      </div>
    </div>
  )
}
