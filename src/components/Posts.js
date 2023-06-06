import React, { useState, useEffect } from "react";
//import { useAuth } from "../contexts/AuthContext";
import { Card } from "react-bootstrap";
import CommentForm from "./CommentForm";
//import { FaTrashAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import Avatar from "../assets/images/avatar.png";
import { FaRegHeart } from "react-icons/fa";
import { BsChatSquareDotsFill } from "react-icons/bs";
import picture from "../assets/images/picture.png";
//import { FaHeart } from "react-icons/fa"
import { Link } from "react-router-dom";
import { db } from "../config/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { formatDistanceStrict } from "date-fns";
//import Skeleton from 'react-loading-skeleton';

export default function Posts({
  id,
  currentUser,
  userId,
  post_author,
  photo_Url,
  deletePost,
  post_message,
  profile_photo_URL,
}) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  //Get all comments for posts
  useEffect(() => {
    const commentsRef = collection(db, "posts", id, "comments");
    const q = query(commentsRef, orderBy("created_at", "desc"));

    //Subcribed to the real-time updates for comments
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newComments = [];
      querySnapshot.forEach((doc) => {
        newComments.push({ id: doc.id, ...doc.data() });
      });
      setComments(newComments);
    });
    return unsubscribe;
  }, [db, id]);

  return (
    <>
      <Card
        className="mt-3 shadow-sm"
        style={{ borderRadius: "10px", padding: "16px" }}
      >
        <div>
          {/* Card header section */}
          <div
            className="mb-3 border-sm p16"
            style={{
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <div className="d-flex">
              <img
                src={profile_photo_URL ? profile_photo_URL : Avatar}
                alt="User"
                style={{
                  width: 35,
                  height: 35,
                }}
                className="rounded-circle"
              ></img>
              <p className="fw-bold mx-2">{post_author}</p>
            </div>
            {/* Post options button */}
            <div className="dropdown">
              <BsThreeDots
                size="1.5em"
                type="button"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <div
                className="dropdown-menu text-center dropdown-menu-right"
                aria-labelledby="navbarDropdownMenuLink"
              >
                {currentUser === userId ? (
                  <Link
                    to="#"
                    onClick={() => {
                      deletePost(id, photo_Url);
                    }}
                    className="text-danger dropdown-item text-decoration-none d-block"
                  >
                    Delete post
                  </Link>
                ) : (
                  ""
                )}
                <Link
                  className="text-decoration-none dropdown-item d-block text-dark"
                  to="#"
                >
                  Report
                </Link>
                <Link
                  className="text-decoration-none dropdown-item d-block text-dark"
                  to="#"
                >
                  Hide Post
                </Link>
              </div>
            </div>
          </div>

          {/* Card body section */}
          <Card.Body className="p-0">
            {post_message ? (
              <div>
                <Card.Text className="mb-2">{post_message}</Card.Text>{" "}
              </div>
            ) : (
              ""
            )}
            {photo_Url ? (
              <Card.Img
                variant="top"
                src={photo_Url}
                className="mb-2"
                style={{
                  borderRadius: 0,
                  width: "100%",
                }}
              />
            ) : (
              ""
            )}
          </Card.Body>
          <hr></hr>
          <div
            style={{
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            {/* Button to display comment form and comments */}
            <Link
              className="text-dark text-decoration-none"
              to="#"
              onClick={() => setShowComments(!showComments)}
            >
              <BsChatSquareDotsFill className="mr-2" />
              <span className="mx-2 small">{comments.length}</span>
            </Link>
            <Link to="#" className="text-decoration-none text-dark">
              <FaRegHeart />
            </Link>
            {/*Add if post has been liked <FaHeart > */}
          </div>

          {/* Comment Section starts here */}
          {showComments ? (
            <div>
              <div className="mt-3">
                <CommentForm id={id} />
              </div>

              {/* Show comments here */}
              <div>
                {comments.length > 0 ? (
                  // <Comments id={id} comments={comments} />
                  comments.map((comment, index) => (
                    <div className="d-flex mt-4" key={index}>
                      <img
                        src={picture}
                        alt={comment.author}
                        className="me-3 mt-2 rounded-circle"
                        style={{
                          width: 32,
                          height: 32,
                        }}
                      ></img>
                      <div className="w-100">
                        <div
                          className="bg-light p-2"
                          style={{ borderRadius: "10px" }}
                        >
                          <small className="fw-bold">{comment.author}</small>
                          <small className="d-block">{comment.comment}</small>
                        </div>
                        <span className="text-muted" style={{ fontSize: 12 }}>
                          {" "}
                          {comment.created_at &&
                            formatDistanceStrict(
                              new Date(comment.created_at.toDate()),
                              new Date(),
                              { addSuffix: true }
                            )}
                        </span>
                        {/* Nested comments */}
                        <div className="d-flex mt-3">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/new/avatars/4.webp"
                            alt="Anna Doe"
                            className="me-3 mt-2 rounded-circle"
                            style={{
                              width: 32,
                              height: 32,
                            }}
                          ></img>
                          <div className="w-100">
                            <div
                              className="bg-light p-2"
                              style={{ borderRadius: "10px" }}
                            >
                              <span className="fw-bold">Anna Doe</span>
                              <small className="d-block">
                                Lorem ipsum dolor sit amet, consectetur
                                
                              </small>
                            </div>
                            <span
                              className="text-muted"
                              style={{ fontSize: 12 }}
                            >
                              2 days ago
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center mt-2"> No comments yet</p>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </Card>
    </>
  );
}
