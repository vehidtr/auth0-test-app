import { Container, Row, Col } from "reactstrap";

import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {
  User,
  Signature,
  Mail,
  BadgeCheck,
  Hash,
  Phone,
  Home,
} from "lucide-react";

export const ProfileComponent = () => {
  const { user } = useAuth0();

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
        <ul className="space-y-2 text-gray-800">
          <li className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Name:</span>
            <span>{user.name}</span>
          </li>

          <li className="flex items-center gap-2">
            <Signature className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Nickname:</span>
            <span>{user.nickname}</span>
          </li>

          <li className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Email:</span>
            <span>{user.email}</span>
          </li>

          <li className="flex items-center gap-2">
            <BadgeCheck
              className={`w-4 h-4 ${
                user.email_verified ? "text-green-500" : "text-red-500"
              }`}
            />
            <span className="font-medium">Verified:</span>
            <span>{user.email_verified ? "Yes" : "No"}</span>
          </li>

          <li className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Sub:</span>
            <span className="truncate">{user.sub}</span>
          </li>

          {user["https://tob/phone"] && (
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Phone:</span>
              <span>{user["https://tob/phone"]}</span>
            </li>
          )}

          {user["https://tob/address"] && (
            <li className="flex items-center gap-2">
              <Home className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Address:</span>
              <span>{user["https://tob/address"]}</span>
            </li>
          )}
        </ul>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
