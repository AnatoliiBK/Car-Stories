import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { setHeaders, url } from "../../slices/api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = () => {
  const params = useParams();
  //   console.log("Params ID:", params.id);
  //   console.log("Params:", params);

  const [user, setUser] = useState({
    name: "",
    email: "",
    isAdmin: false,
    password: "",
  });
  console.log("USER : ", user);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${url}/users/find/${params.id}`,
          setHeaders()
        );
        console.log("RES : ", res.data);
        setUser({
          ...res.data,
          password: "", // потрібно очистити відображення пароля
        });
        setLoading(false);
      } catch (error) {
        console.log("ERROR RES", error.res);
      }
    };
    fetchUser();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const res = await axios.put(`${url}/users/${params.id}`, { ...user }, setHeaders())
      console.log("UPDATE USER RES DATA ", res)
      setUser({ ...res.data, password: "" })
      toast.success("Profile Updated")
    } catch (error) {
      console.log(error)
      toast.error("An error occurred while updating the profile");
    }
    setUpdating(false)

  }

  return (
    <StyledProfile>
      <ProfileContainer>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>User Profile</h3>
            {user.isAdmin ? (
              <Admin>Admin</Admin>
            ) : (
              <Customer>Customer</Customer>
            )}
            <label htmlFor="name">Name:</label>
            <StyledInput
              type="text"
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <label htmlFor="email">Email:</label>
              <StyledInput
              type="text"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <label htmlFor="password">Password:</label>
              <StyledInput
              type="text"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <StyledButton>{updating ? "Updating" : "Update Profile"}</StyledButton>
          </form>
        )}
      </ProfileContainer>
    </StyledProfile>
  );
};

export default UserProfile;

const StyledProfile = styled.div`
  margin: 3rem;
  display: flex;
  justify-content: center;
`;

const ProfileContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: auto;
  display: flex;
  box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
  border-radius: 5px;
  padding: 2rem;
  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    h3 {
      margin-bottom: 0.5rem;
    }
    label {
      color: gray;
      margin-bottom: 0.2rem;
    }
    input {
      margin-bottom: 1rem;
      border: none;
      outline: none;
      border-bottom: 1px solid gray;
    }
  }
`;

const Admin = styled.div`
  color: rgb(253, 181, 40);
  background-color: rgba(253, 181, 40, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
  margin-bottom: 1rem;
`;

const Customer = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgba(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
  margin-bottom: 1rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  &:hover {
    border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  &:focus {
    border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
     background-color: #0056b3;
  }
`
