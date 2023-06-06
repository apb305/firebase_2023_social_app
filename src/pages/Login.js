import React, { useState } from "react";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

export default function Login() {
  const { login, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Please check your credentials");
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "75vh" }}
    >
      {currentUser && <Navigate to="/" replace={true} />}
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body className="shadow-sm">
            <h4 className="text-center mb-4">Sign in</h4>
            <Form onSubmit={handleSubmit(handleLogin)}>
              <Form.Group id="email">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                ></Form.Control>
                {errors.email && (
                  <p className="mt-1 text-danger">This field is required</p>
                )}
              </Form.Group>
              <Form.Group id="password" className="mt-3">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", { required: true })}
                ></Form.Control>
                  <div className="icon-div" onClick={toggleShowPassword}>
                  <Link className="text-decoration-none text-black"><i
                    className={showPassword ? "fa fa-eye password-icon" : "fa fa-eye-slash password-icon"}
                    aria-hidden="true"
                  ></i></Link>
                </div>
                {errors.password && (
                  <p className="mt-1 text-danger">This field is required</p>
                )}
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-3" type="submit">
                {loading ? "Please wait..." : "Sign In"}
              </Button>
            </Form>
            <div className="text-center mt-4">
              <Link className="text-decoration-none" to="/forgot-password">Forgot Password?</Link>
            </div>
            <div className="text-center mt-3">
              <span className="fw-bold">Need an account?</span> <Link className="text-decoration-none" to="/signup">Sign Up</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
