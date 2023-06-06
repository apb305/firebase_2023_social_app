import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import AddPost from "../components/AddPost";
import Posts from "../components/Posts";
import Spinner from "../components/Spinner";
import { db } from "../config/firebase";
import { Container } from "react-bootstrap";
import {
  collection,
  orderBy,
  limit,
  query,
  doc,
  deleteDoc,
  getDocs,
  startAfter,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, deleteObject, ref } from "firebase/storage";
import { toast } from "react-toastify";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastItem, setLastItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Fetches the first batch of posts.
  useEffect(() => {
    setLoading(true);
    const postsRef = collection(db, "posts");
    const postQuery = query(postsRef, orderBy("created_at", "desc"), limit(10));
    const unsubscribe = onSnapshot(
      postQuery,
      (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(posts);
        setLastItem(querySnapshot.docs[querySnapshot.size - 1]);
        setLoading(false);
      },
      (error) => {
        console.log("Error getting posts: ", error);
        toast.error("An error has occured");
      }
    );
    return unsubscribe;
  }, [db]);

  //This function fetches more posts.
  const fetchMore = async () => {
    if (!hasMore) {
      return; // stop fetching for more data
    }
    try {
      const postsRef = collection(db, "posts");
      const postQuery = query(
        postsRef,
        orderBy("created_at", "desc"),
        startAfter(lastItem),
        limit(10)
      );
      const querySnapshot = await getDocs(postQuery);
      const additionalPost = [];
      querySnapshot.forEach((doc) => {
        additionalPost.push({ id: doc.id, ...doc.data() });
      });
      setPosts([...posts, ...additionalPost]);
      setLastItem(querySnapshot.docs[querySnapshot.size - 1]);
      if (querySnapshot.size < 10) {
        setHasMore(false); // stop fetching for more data
      }
    } catch (error) {
      console.log("Error getting posts: ", error);
      toast.error("An error has occured");
    }
  };

  //Delete a post
  const deletePost = async (postId, photo) => {
    try {
      const storage = getStorage();
      const postRef = doc(db, "posts", postId);
      // Create a reference to the file to delete
      const photoRef = ref(storage, photo);
      await deleteDoc(postRef);
      if (photo) {
        await deleteObject(photoRef);
      }
      toast.success("Your post has been removed");
    } catch (err) {
      toast.error("An error has occured");
      return console.log(err);
    }
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
                    <h5 className="text-center">News Feed</h5>
                    <AddPost />
                    {posts.length > 0 ? (
                      <InfiniteScroll
                        dataLength={posts.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        loader={
                          <div>
                            <Spinner />
                          </div>
                        }
                      >
                        {posts.map((item) => (
                          <Posts
                            key={item.id}
                            id={item.id}
                            currentUser={currentUser.uid}
                            userId={item.userId}
                            post_author={item.post_author}
                            photo_Url={item.photo_Url}
                            // profile_photo_URL={currentUser.photoURL}
                            post_message={item.post_message}
                            created_at={item.created_at}
                            loading={loading}
                            deletePost={deletePost}
                          />
                        ))}
                      </InfiniteScroll>
                    ) : (
                      <p className="text-center mt-5">
                        Nothing here yet. Be the first to post something.
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
