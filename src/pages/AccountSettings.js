import { Form, Container, Accordion } from "react-bootstrap";
import AccountDetails from "../components/AccountDetails";
import ProfileImageUpload from "../components/ProfileImageUpload";
import AccountSecurity from "../components/AccountSecurity";

export default function AccountSettings() {
 
  return (
    <Container className="align-items-center justify-content-center mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <h4 className="text-center mb-4">Account Settings</h4>
          <hr></hr>
          {/* Profile Image upload */}
          <ProfileImageUpload />
            <Accordion className="my-3">
              <AccountDetails />
              <AccountSecurity />
            </Accordion>
          <div className="text-center mt-3">
            <a
              href="/profile"
              className="btn btn-sm text-decoration-none text-white btn-sm btn-dark border"
            >
              Back to profile
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
