import React, { useState } from "react";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(data.email);
      setMessage("Check your email for the password reset instructions");
    } catch (error) {
      console.log(error.code)
      if (error.code === "auth/user-not-found") {
        setError("Account not found")
      } else {
        setError("Failed to reset password");
      }
    }
    setLoading(false);
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "60vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <div className="text-center mb-4">
              <h4>Forgot your password?</h4>
              <small>Enter your email below to reset your password</small>
            </div>
            {error && <Alert className="text-center" variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group id="email">
                <Form.Control
                  type="email"
                  name="email"
                  {...register("email", { required: true })}
                  placeholder="Email"
                ></Form.Control>
                {errors.email && (
                  <p className="mt-1 text-danger">This field is required</p>
                )}
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-2" type="submit">
                {loading ? "Please Wait..." : "Reset Password"}
              </Button>
            </Form>
            <div className="text-center mt-4">
              Already have an account?{" "}
              <Link className="text-decoration-none" to="/login">
                Login
              </Link>
            </div>
            <div className="text-center mt-3">
              Need an account?{" "}
              <Link className="text-decoration-none" to="/signup">
                Sign Up
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
