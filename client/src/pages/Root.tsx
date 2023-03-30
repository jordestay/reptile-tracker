import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom"

export const Root = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let name = "";
  if (location.pathname.includes('/reptile')) {
    name = "Dashboard";
  }
//   if (location.pathname === '/') {
//     name = "Profile"
//   } else {
//     name = "Users"
//   }

  return (
    <>
      <nav className="navbar" onClick={() => navigate('/dashboard')}>{name}</nav>
      <Outlet />
    </>
  )
}