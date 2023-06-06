import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Signup() {
  const { signup, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignup = async (data) => {
    try {
      setLoading(true);
      await signup(data.name, data.email, data.password);
      navigate("/")
    } catch (error) {
      toast.error(error.code)
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center mt-5"
      style={{ minHeight: "65vh" }}
    >
      {currentUser && <Navigate to="/" replace={true} />}
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h4 className="text-center mb-4">Create Account</h4>
            <Form onSubmit={handleSubmit(handleSignup)}>
              <Form.Group id="name">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  {...register("name", { required: true })}
                ></Form.Control>
                {errors.name && (
                  <p className="mt-1 text-danger">Name is required</p>
                )}
              </Form.Group>
              <Form.Group id="email" className="mt-3">
                <Form.Control
                  type="text"
                  name="email"
                  placeholder="Email"
                  {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                  })}
                ></Form.Control>
                {errors.email && errors.email.type === "required" && (
                  <p className="mt-1 text-danger">Email is required</p>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <p className="mt-1 text-danger">Email is not valid</p>
                )}
              </Form.Group>
              <Form.Group id="password" className="mt-3">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  {...register("password", { required: true, minLength: 6 })}
                ></Form.Control>
                <div className="icon-div" onClick={toggleShowPassword}>
                  <Link className="text-decoration-none text-black">
                    <i
                      className={
                        showPassword
                          ? "fa fa-eye password-icon"
                          : "fa fa-eye-slash password-icon"
                      }
                      aria-hidden="true"
                    ></i>
                  </Link>
                </div>
                {errors.password && errors.password.type === "required" && (
                  <p className="mt-1 text-danger">Password is required</p>
                )}
                {errors.password && errors.password.type === "minLength" && (
                  <p className="mt-1 text-danger">
                    Password must be at least 6 characters long
                  </p>
                )}
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-3" type="submit">
                {loading ? "Please Wait..." : "Sign Up"}
              </Button>
            </Form>
            <p className="mt-3">
              <small>
                By registering you agree to our terms of use and privacy policy.
              </small>
            </p>
            <div className="text-center mt-4">
              <span className="fw-bold">Already have an account?</span>{" "}
              <Link className="text-decoration-none" to="/login">
                Sign In
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
