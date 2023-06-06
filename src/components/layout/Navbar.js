import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AppNav() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  const authLinks = (
    <Fragment>
      <Link
       className="nav-link dropdown-toggle text-dark" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false"
      >
    My Account
      </Link>
      <div
        className="dropdown-menu dropdown-menu-right border rounded-0 shadow"
        aria-labelledby="navbarDropdownMenuLink"
      >
        <a className="dropdown-item" href="/">
          News Feed
        </a>
        <a className="dropdown-item" href="/profile">
          Profile
        </a>
        <Link className="dropdown-item" to="/account-settings">
          Account Settings
        </Link>
        <button className="dropdown-item" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide-sm">Logout</span>         
        </button>
      </div>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      {/* <Link
       className="nav-link dropdown-toggle text-dark" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false"
      >
      Sign In
      </Link>
      <div
        className="dropdown-menu dropdown-menu-right border rounded-0 shadow"
        aria-labelledby="navbarDropdownMenuLink"
      >
       <Link className="dropdown-item mt-1" to="/login">
         Sign In
        </Link>
        <Link className="dropdown-item mt-1" to="/signup">
         Create Account
        </Link>
        </div> */}
            <ul className="navbar-nav ml-auto">
        <li className="nav-item p-2">
          <Link className="nav-link btn btn-sm text-dark" to="/login">
            Login
          </Link>
        </li>
        <li className="nav-item p-2">
          <Link className="nav-link btn btn-sm btn-dark text-light" to="/signup">
            Sign up
          </Link>
        </li>
      </ul>
    </Fragment>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
        <a className="navbar-brand text-dark" href="/">
          Postee
        </a>
        <button
          className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse flex-grow-0" id="navbarNavDropdown">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown ml-auto">
              {currentUser ? authLinks : guestLinks}
            </li>
          </ul>
        </div>
        </div>
      </nav>
    </>
  );
}
