// import { FaSignInAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../components/navbar.css";
// eslint-disable-next-line
import ErrorBoundary from "../errorBoundary/errorBoundary";

function NavBar() {
  return (
    <>
      <header className="navbar">
        <li>
          <Link className="nav-link home-left" to="/">
            Shopping Site
          </Link>
        </li>
        <ul>
          <li>
            <Link className="nav-link lr-right" to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link className="nav-link lr-right" to="/register">
              Register
            </Link>
          </li>
        </ul>
      </header>
    </>
  );
}

export default NavBar;
