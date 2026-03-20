import "./ProfileDropDown.css";
import { useAuth, useDate, useFilter, useWishlist, useAlert } from "../../context";
import { useNavigate } from "react-router-dom";

export const ProfileDropDown = () => {

    const { authDispatch, role } = useAuth();

    const { dateDispatch } = useDate();

    const { filterDispatch } = useFilter();

    const { wishlistDispatch } = useWishlist();

    const { setAlert } = useAlert();

    const navigate = useNavigate();

    const handleWishlistClick = () => {
        authDispatch({
            type: "SHOW_DROP_DOWN_OPTIONS"
        })
        navigate("/wishlist");
    }

    const handleMyBookingsClick = () => {
        authDispatch({
            type: "SHOW_DROP_DOWN_OPTIONS"
        })
        navigate("/my-bookings");
    }

    const handleAdminClick = () => {
        authDispatch({
            type: "SHOW_DROP_DOWN_OPTIONS"
        })
        navigate("/admin");
    }

    const handleLogoutClick = () => {
        localStorage.clear();
        authDispatch({
            type: "CLEAR_USER_DATA"
        })
        authDispatch({
            type: "CLEAR_CREDENTIALS"
        })
        authDispatch({
            type: "SHOW_DROP_DOWN_OPTIONS"
        })
        dateDispatch({
            type: "CLEAR_INPUTS"
        })
        filterDispatch({
            type: "CLEAR_ALL"
        })
        wishlistDispatch({
            type: "CLEAR_WISHLIST"
        })
        navigate("/")
        setAlert({
            open: true,
            message: "Logged out successfully",
            type: "success"
        })
    }

    return (
        <div className="drop-down-container shadow d-flex direction-column absolute">
            <span className="option-span wishlist-span cursor-pointer d-flex align-center gap-small" onClick={handleWishlistClick}><span class="material-icons-outlined">
                favorite_border
            </span>
                Wishlist
            </span>
            <span className="option-span wishlist-span cursor-pointer d-flex align-center gap-small" onClick={handleMyBookingsClick}>
                <span class="material-icons-outlined">book_online</span>
                My Bookings
            </span>
            {role === "admin" && (
                <span className="option-span wishlist-span cursor-pointer d-flex align-center gap-small" onClick={handleAdminClick}>
                    <span class="material-icons-outlined">
                        dashboard
                    </span>
                    Admin Panel
                </span>
            )}
            <span className="option-span logout cursor-pointer d-flex align-center gap-small" onClick={handleLogoutClick}>
                <span class="material-icons-outlined">
                    logout
                </span>
                Logout</span>
        </div>
    )
}