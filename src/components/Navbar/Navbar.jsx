import { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";
import { useDate, useAuth, useAlert } from "../../context";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ProfileDropDown } from "../ProfileDropDown/ProfileDropDown";
import { AuthModal } from "../AuthModal/AuthModal";

export const Navbar = ({route}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { destination, dateDispatch, checkInDate, checkOutDate, guests } =
    useDate();

  const { authDispatch, accessToken, isAuthModalOpen, isDropDownModalOpen } = useAuth();
  const { setAlert } = useAlert();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get("http://localhost:3200/api/notifications", {
          headers: { authorization: accessToken }
        });
        
        setHasUnread(data.some(n => !n.isRead));

        const latestNotif = data[0];
        if (latestNotif && !latestNotif.isRead) {
          const storedId = localStorage.getItem("latestNotifId");
          if (storedId !== latestNotif._id) {
            setAlert({
              open: true,
              message: `New Message: ${latestNotif.message}`,
              type: "success"
            });
            localStorage.setItem("latestNotifId", latestNotif._id);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Poll every 3 seconds so the red dot appears "instantly"
    const intervalId = setInterval(fetchNotifications, 3000);

    return () => clearInterval(intervalId);
  }, [accessToken, location.pathname, setAlert]);

  const handleSearchClick = () => {
    dateDispatch({
      type: "OPEN_SEARCH_MODAL",
    });
  };

  const handleAuthClick = () => {
    if (accessToken) {
      authDispatch({
        type: "SHOW_DROP_DOWN_OPTIONS"
      })
    } else {
      authDispatch({
        type: "SHOW_AUTH_MODAL",
      });
    }

  };

  return (
    <header className="heading d-flex align-center">
      <h1 className="heading-1">
        <Link className="link" to="/">
          TravelO
        </Link>
      </h1>
      {
        route !== "wishlist" && <div
        className="form-container d-flex align-center cursor-pointer shadow"
        onClick={handleSearchClick}
      >
        <span className="form-option">{route === "home" ? "Any Where" : (destination || "Any Where")}</span>
        <span className="border-right-1px"></span>
        <span className="form-option">
          {checkInDate && checkOutDate && route !== "home"
            ? `${checkInDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })} - ${checkOutDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}`
            : "Any Week"}
        </span>
        <span className="border-right-1px"></span>
        <span className="form-option">
          {route !== "home" && guests > 0 ? `${guests} guests` : "Add Guests"}
        </span>
        <span class="search material-icons-outlined">search</span>
      </div>
      }
      
      <nav className="d-flex align-center gap-large">
        {
          accessToken && (
            <div className="nav-icon-container cursor-pointer" style={{position: "relative"}} onClick={() => navigate("/inbox")}>
              <span className="material-icons-outlined">notifications</span>
              {hasUnread && <span className="notification-badge"></span>}
            </div>
          )
        }
        <div className="nav d-flex align-center cursor-pointer" onClick={handleAuthClick}>
          <span className="material-icons-outlined profile-option menu">
            menu
          </span>
          <span className="material-icons-outlined profile-option person">
            person_2
          </span>
        </div>
      </nav>
      {isAuthModalOpen && <AuthModal />}
      {isDropDownModalOpen && <ProfileDropDown />}
    </header>
  );
};
