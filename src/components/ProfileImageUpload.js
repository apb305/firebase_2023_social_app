import React, { useRef, useState } from "react";
import { Form, Button, ProgressBar, Image } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import Avatar from "../assets/images/avatar.png";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
// Create the file metadata
const metadata = {
  contentType: "image/jpeg",
};

export default function ProfileImageUpload() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(currentUser.photoURL)
  const [imageMessage, setImageMessage] = useState(null);
  const [profileImagePreview, setProfileImagePrview] = useState(null);
  const types = ["image/png", "image/jpeg"];
  const storage = getStorage();

  // Image selection
  const handleImageChange = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      previewFile(selected);
      setShow(true); // Set true to show the upload button for the profile image
      setImageMessage("");
    } else {
      setFile(null);
      setImageMessage("Images must be .png or .jpg");
    }
  };

  //Handle profile image preview
  const previewFile = (image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      setProfileImagePrview(reader.result);
    };
  };

  //Handle submitting the image for upload.
  const handleSubmit = async (e) => {
    e.preventDefault(e);
    setLoading(true);
    try {
      const oldImageUrl = currentUser.photoURL;
      
      // Call this to upload image file to Firebase Storage
      const newImageUrl = await handleImageUpload();
      
      if (newImageUrl === null) {
        setLoading(false);
        return null;
      }

      // Update user profile with new profile image URL
      await updateProfile(currentUser, {
        photoURL: newImageUrl
      });

      // Update the UI to display the new photo
      setProfileImageUrl(newImageUrl)

      // Create a reference to the current profile image
      const oldPhotoRef = ref(storage, oldImageUrl);

      //Delete the current profile photo
      if (oldPhotoRef) {
        await deleteObject(oldPhotoRef);
      }

      setLoading(false);
      toast.success("Profile image updated successfully!");
    } catch (error) {
      toast.error("An error has occured");
      setLoading(false);
      console.log(error);
    }
  };

  // Upload the new profile image
  const handleImageUpload = async () => {
    if (file === null) {
      return null;
    }
    setLoading(true);
    const imageName = uuidv4();

    try {
      // Upload file and metadata to the object
      const storageRef = ref(storage, `profile_images/${imageName}`);
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
      setProfileImagePrview("");
      setFile(null);
      return downloadURL;
    } catch (error) {
      console.log(error);
    }
  };

  const removeImagePreview = () => {
    setProfileImagePrview("");
    setFile(null);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        {/* Change profile image */}
        <div>
          <div className="text-center">
            <img
              src={profileImageUrl ? profileImageUrl : Avatar}
              alt="profile"
              style={{ width: "100px", height: "100px" }}
              className="rounded-circle"
            ></img>
            <p className="mt-2 font-weight-bold">{currentUser.displayName} </p>
          </div>
          <Form.Group controlId="formFileSm" className="mb-3 mt-4">
            <label>Update profile image</label>
            <Form.Control type="file" size="sm" onChange={handleImageChange} />
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
        </div>
        {show ? (
          <Button
            disabled={loading}
            className="w-100 mt-2 btn-sm"
            type="submit"
          >
            {loading ? "Please wait..." : "Upload"}
          </Button>
        ) : (
          ""
        )}
      </Form>
      {/* Show preview of the image before uploading */}
      {profileImagePreview && (
        <div className="text-center mt-2">
          <p>Image Preview:</p>
          <Image
            src={profileImagePreview}
            style={{
              width: "50%",
            }}
          ></Image>
          <div>
            <Button
              className="btn btn-sm btn-dark my-3"
              onClick={removeImagePreview}
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
