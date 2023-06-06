import React, { useState } from "react";
import { Form, ProgressBar, Card, Image, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useForm } from "react-hook-form";
// Create the file metadata
const metadata = {
  contentType: "image/jpeg",
};

export default function AddPost() {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageMessage, setImageMessage] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm();
  const storage = getStorage();

  const types = ["image/png", "image/jpeg"];

  // Image selection
  const handleImageChange = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      previewFile(selected);
      setImageMessage("");
    } else {
      setFile(null);
      setImageMessage("Images must be .png or .jpg");
    }
  };

  //Handle post image preview
  const previewFile = (image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      setImageFile(reader.result);
    };
  };

  // Submitting the post.
  const onSubmit = async (data) => {
    try {
      const imageUrl = await handleImageUpload();
      setLoading(true);
      const postsRef = collection(db, "posts");
      const newPost = {
        userId: currentUser.uid,
        post_id: uuidv4(),
        post_author: currentUser.displayName,
        post_message: data.post_message,
        photo_Url: imageUrl,
        created_at: serverTimestamp(),
        last_updated: serverTimestamp(),
      };
      await addDoc(postsRef, newPost);
      reset()
      setLoading(false);
      setImageMessage(null);
      toast.success("Success! Your post has been published");
    } catch (error) {
      toast.error("An error has occured")
      console.log(error);
      setLoading(false);
    }
  };

  // Upload an image for a post
  const handleImageUpload = async () => {
    if (file === null) {
      return null;
    }
    setLoading(true);
    const imageName = uuidv4();

    try {
      // Upload file and metadata to the object
      const storageRef = ref(storage, `posts_images/${imageName}`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      uploadTask.on("state_changed", (snapshot) => {
        let percentage = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percentage);
      });

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, resolve);
      });

      // Get the download URL
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      setLoading(false);
      setImageMessage(null);
      setProgress(0);
      setImageFile("");
      setFile(null);
      return downloadURL;
    } catch (error) {
      console.log(error);
    }
  };

  const removeImagePreview = () => {
    setImageFile("");
    setFile(null);
  }

  return (
    <>
      {/* Post form */}
      <Card style={{borderRadius: "10px" }}>
        <div style={{ padding: "16px" }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <textarea
                className="form-control p-2"
                rows="4"
                name="post_message"
                {...register("post_message")}
                placeholder="What would you like to say?"
              ></textarea>
            </div>
            {watch("post_message") || file ? (
              <button
                disabled={loading}
                className="btn btn-primary mt-2 btn-sm w-100"
                type="submit"
              >
                {loading ? "Please wait..." : "Post"}
              </button>
            ) : (
              ""
            )}
          </Form>
          {/* Image upload section */}
          <div className="mt-4">
            <Form.Group controlId="formFile">
              <Form.Label>Upload an image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
              />
              <div className="output">
                {imageMessage && (
                  <div className="error text-danger mt-1">{imageMessage}</div>
                )}
                {!progress ? (
                  ""
                ) : (
                  <ProgressBar
                    now={progress}
                    label={`${progress}%`}
                    className="mt-2"
                  />
                )}
              </div>
            </Form.Group>
            {/* Show preview of the image before uploading */}
            {imageFile && (
              <div className="text-center mt-2">
                <p>Image Preview:</p>
                <Image
                  src={imageFile}
                  style={{
                    width: "50%",
                  }}
                ></Image>
                <div><Button className="btn btn-sm btn-dark my-3" onClick={removeImagePreview}>Remove</Button></div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
