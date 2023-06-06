import React, { useState } from "react";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";

export default function CommentForm({ id }) {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { register, handleSubmit, watch, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      
      // Create a reference to the comments subcollection for the given post ID
      const commentsRef = collection(doc(db, "posts", id), "comments");

      const comment = {
        uid: currentUser.uid,
        author: currentUser.displayName,
        comment: data.comment_message,
        created_at: serverTimestamp(),
      };

      await addDoc(commentsRef, comment);
      reset();
      setLoading(false);
      toast.success("Comment added");
    } catch (error) {
      console.log(error);
      toast.error("An error has occured");
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <textarea
            className="form-control"
            rows="1"
            name="comment_message"
            placeholder="Write a comment"
            {...register("comment_message")}
          ></textarea>
        </div>
        {watch("comment_message") ? (
          <button
            disabled={loading}
            className="btn btn-sm btn-dark mt-2"
            type="submit"
          >
            {loading ? "Please wait..." : "Post"}
          </button>
        ) : (
          ""
        )}
      </Form>
    </div>
  );
}
