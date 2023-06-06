import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
//import AddPost from "./AddPost";
import Posts from "./Posts";
import Spinner from "./Spinner";
import { db } from "../config/firebase";
import { Container } from "react-bootstrap";
import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
  startAfter,
} from "firebase/firestore";

export default function UserPosts() {
  const [userPosts, setUserPosts] = useState([]);
  //const [hasMore, setHasMore] = useState(true)
  const [lastItem, setLastItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Fetches the first batch of posts.
  useEffect(() => {
    setLoading(true);
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("userId", "==", currentUser.uid),
      orderBy("created_at", "desc")
    );

    getDocs(q)
      .then((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            ...doc.data(),
            id: doc.id,
          });
          setLastItem(doc.data().created_at);
          setUserPosts(items);
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error getting posts: ", error);
      });
  }, [currentUser.uid]);

  //This function fetches more posts.
  const fetchMore = (lastItem) => {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("userId", "==", currentUser.uid),
      orderBy("created_at", "desc"),
      startAfter(lastItem)
    );

    getDocs(q)
      .then((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            ...doc.data(),
            id: doc.id,
          });
          setLastItem(doc.data().created_at);
          setLoading(false);
        });
        setUserPosts(userPosts.concat(items));
      })
      .catch((error) => {
        console.log("Error getting posts: ", error);
      });
  };

  return (
    <>
      <Container>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <div className="mb-5">
              <div className="row">
                <div className="col-md-6 mx-auto">
                  <div className="mt-4">
                    <hr></hr>
                    <h5 className="text-center">Your Posts</h5>
                    {/* <AddPost /> */}
                    {userPosts.length > 0 ? (
                      <InfiniteScroll
                        dataLength={userPosts.length}
                        next={() => fetchMore(lastItem)}
                        hasMore={true}
                      >
                        {userPosts.map((item) => (
                          <Posts
                            key={item.id}
                            id={item.id}
                            currentUser={currentUser.uid}
                            userId={item.userId}
                            post_author={item.post_author}
                            photo_Url={item.photo_Url}
                            post_message={item.post_message}
                            created_at={item.created_at}
                            loading={loading}
                          />
                        ))}
                      </InfiniteScroll>
                    ) : (
                      <p className="text-center mt-5">
                        You have not posted anything yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
