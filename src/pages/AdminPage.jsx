import { useEffect, useState, useRef } from "react";

import Header from "../components/Header";
import api from "../api/api";
import "../css/admin.css";

const AdminPage = () => {
  const effectRan = useRef(false);

  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState({});
  const [date, setDate] = useState("");

  const [overlay, setOverlay] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [success, setSuccess] = useState(undefined);

  useEffect(() => {
    setTimeout(() => {
      setInfoMessage("");
    }, 3000);
  }, [infoMessage]);

  // fetch users from server
  useEffect(() => {
    if (effectRan.current === false) {
      const fetchAllUsers = async () => {
        try {
          const { data } = await api.get("/users/allUsers");
          setAllUsers(data.data);
        } catch (err) {
          console.log(err);
          setErrMessage("Error: Did not receive expected data");
        }
      };

      fetchAllUsers();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const showUserDetails = async (e, id) => {
    e.preventDefault();

    try {
      const { data } = await api.get(`/users/${id}`);
      setUser(data.data);
      setDate(data.data.createdAt.slice(0, 10));
      setOverlay(true);
    } catch (err) {
      console.log(err);
      setErrMessage("Error: Did not receive expected data");
    }
  };

  const switchUsersRole = async (e, id) => {
    e.preventDefault();

    const url = `/users/${id}`;
    const data = {
      role: user.role === "ADMIN" ? "USER" : "ADMIN",
    };
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    };

    try {
      await api.put(url, data, headers);

      // update UI
      setUser({
        ...user,
        role: user.role === "ADMIN" ? "USER" : "ADMIN",
      });
      setInfoMessage("role was succesfully updated");
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setInfoMessage("Error: role was not updated");
      setSuccess(false);
    }
  };

  const usersList = allUsers.map((user) => {
    return (
      <tr
        key={user.id}
        onClick={(e) => {
          showUserDetails(e, user.id);
        }}
      >
        <td>{user.id}</td>
        <td>{user.nickName}</td>
      </tr>
    );
  });

  const handleOverlayClose = (e) => {
    if (e.target === e.currentTarget) {
      setOverlay(false);
    }

    if (e.key === "Escape") {
      setOverlay(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleOverlayClose);

    return () => {
      document.removeEventListener("keydown", handleOverlayClose);
    };
  }, []);

  return (
    <>
      <Header text="admin panel" backButton={false} />
      <main className="admin-page">
        <div className="container">
          <div className="user-list-wrapper">
            <h3>list of all users, tap to show details</h3>
            {errMessage && <p>{errMessage}</p>}
            {!errMessage && (
              <table>
                <tbody>
                  <tr>
                    <th>user id</th>
                    <th>user nickName</th>
                  </tr>

                  {usersList}
                </tbody>
              </table>
            )}
          </div>

          {errMessage && <p>{errMessage}</p>}
          {overlay === true && !errMessage && (
            <div className="overlay" onClick={(e) => handleOverlayClose(e)}>
              <div className="user-detail">
                <h3>detail of user: {user.nickName}</h3>

                <table>
                  <tbody>
                    <tr>
                      <td>id:</td>
                      <td>{user.id}</td>
                    </tr>
                    <tr>
                      <td>email:</td>
                      <td>{user.email}</td>
                    </tr>
                    <tr>
                      <td>name</td>
                      <td>{user.name}</td>
                    </tr>
                    <tr>
                      <td>surname</td>
                      <td>{user.surname}</td>
                    </tr>
                    <tr>
                      <td>nickName</td>
                      <td>{user.nickName}</td>
                    </tr>
                    <tr>
                      <td>age</td>
                      <td>{user.age}</td>
                    </tr>
                    <tr>
                      <td>account created:</td>
                      <td>{date}</td>
                    </tr>
                    <tr>
                      <td>role</td>
                      <td>{user.role} </td>
                    </tr>
                  </tbody>
                </table>
                <div className="button-wrapper">
                  <button onClick={(e) => switchUsersRole(e, user.id)}>
                    switch users role
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {infoMessage !== "" && (
          <p
            className="info-message"
            style={{
              background: success ? "#59f750" : "#c4090a",
            }}
          >
            {infoMessage}
          </p>
        )}
      </main>
    </>
  );
};

export default AdminPage;
