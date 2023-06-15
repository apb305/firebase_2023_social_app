import { useState } from "react";
import { Button, Form, Accordion } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

function AccountSecurity() {
  const { updateUserPassword, currentUser } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      await updateUserPassword(
        currentUser.email,
        data.currentPassword,
        data.newPassword
      );
      reset()
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowPasswordtwo = () => {
    setShowPasswordTwo(!showPasswordTwo);
  };

  return (
    <>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Account Security</Accordion.Header>
        <Accordion.Body>
          <p className="fw-bold mt-2 text-center">Change password</p>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                placeholder="Current password"
                {...register("currentPassword", { required: true })}
              />
              {/* Toggle show password eye icon */}
              <div className="icon-div" onClick={toggleShowPassword}>
                <Link className="text-decoration-none text-black">
                  <i
                    className={
                      showPassword
                        ? "fa fa-eye-slash password-icon" : "fa fa-eye password-icon"
                    }
                    aria-hidden="true"
                  ></i>
                </Link>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-danger">Current password is required</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type={showPasswordTwo ? "text" : "password"}
                name="newPassword"
                placeholder="New password"
                {...register("newPassword", { required: true, minLength: 6 })}
              />
              {/* Toggle show password eye icon */}
              <div className="icon-div" onClick={toggleShowPasswordtwo}>
                <Link className="text-decoration-none text-black">
                  <i
                    className={
                      showPasswordTwo
                        ? "fa fa-eye-slash password-icon" : "fa fa-eye password-icon"
                    }
                    aria-hidden="true"
                  ></i>
                </Link>
              </div>
              {errors.newPassword && errors.newPassword.type === "required" && (
                <p className="mt-1 text-danger">Password is required</p>
              )}
              {errors.newPassword &&
                errors.newPassword.type === "minLength" && (
                  <p className="mt-1 text-danger">
                    Password must be at least 6 characters long
                  </p>
                )}
            </Form.Group>
            <div className="mt-2">
              {watch("currentPassword") && watch("newPassword") ?
              <Button
                size="sm"
                className="w-100"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Save"}
              </Button> : "" }
            </div>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}
export default AccountSecurity;
