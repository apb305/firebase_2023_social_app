import  { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import {
  Form,
  Button,
  Accordion
} from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function AccountDetails () {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile(currentUser, {
        displayName: data.name,
        email: data.email
      });
      reset()
      setLoading(false);
      toast.success("Profile updated");
    } catch (error) {
      setLoading(false);
      toast.error("An error has occured");
      console.log(error);
    }
  };

  return (
    <>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Account Details</Accordion.Header>
        <Accordion.Body>
          <p className="fw-bold mt-2">
            Account Name:{" "}
            <small className="fw-light">{currentUser.displayName}</small>
          </p>
         <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Control
               type="text"
               name="name"
               placeholder="Enter name"
               {...register("name")}
            />
          </Form.Group>
          <p className="fw-bold mt-2">
            Display Email:{" "}
            <small className="fw-light">{currentUser.email}</small>
          </p>
          <Form.Group className="mb-3">
            <Form.Control
             type="text"
             name="email"
             placeholder="Enter email"
             {...register("email", {
               pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
             })}
            />
             {errors.email && errors.email.type === "pattern" && (
                  <p className="mt-1 text-danger">Email is not valid</p>
                )}
          </Form.Group>
          <div className="mt-2">
            {watch("name") || watch("email")?  <Button
              size="sm"
              className="w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Save"}
            </Button> : ""}
          </div>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}
