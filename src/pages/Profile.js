import React from "react";
import { Link } from "react-router-dom";
import UserPosts from "../components/UserPosts";
import { Container } from "react-bootstrap";
import Avatar from "../assets/images/avatar.png";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { currentUser } = useAuth();
 
  return (
    <>
      <Container>
        <div className="text-center mt-5">
          <img
            style={{ width: "100px", height: "100px" }}
            className="rounded-circle"
            alt="User"
            src={currentUser.photoURL ? currentUser.photoURL : Avatar}
          ></img>
          {currentUser.displayName ? (
            <h5 className="mt-2">Welcome, {currentUser.displayName}</h5>
          ) : (
            <h5 className="mt-2">Welcome to your profile</h5>
          )}
        </div>
        <div className="text-center">
          <Link
            to="/account-settings"
            className="mt-2 text-dark text-decoration-none btn btn-sm btn-light border"
          >
            Account Settings
          </Link>
        </div>
        <UserPosts />
      </Container>
    </>
  );
}
