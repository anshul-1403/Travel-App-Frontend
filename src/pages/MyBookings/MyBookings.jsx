import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar, Alert } from "../../components";
import { useAuth, useAlert } from "../../context";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

export const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAuth();
    const { alert } = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            navigate("/");
            return;
        }
        (async () => {
            try {
                const { data } = await axios.get("https://travel-app-backend-zvzh.onrender.com/api/bookings", {
                    headers: { authorization: accessToken }
                });
                setBookings(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [accessToken, navigate]);

    return (
        <div>
            <Navbar />
            <main className="my-bookings-container">
                <h2 className="bookings-title">My Bookings</h2>

                {loading ? (
                    <p className="bookings-empty">Loading your bookings...</p>
                ) : bookings.length === 0 ? (
                    <div className="bookings-empty-state">
                        <span className="material-icons-outlined empty-icon">hotel</span>
                        <p>You haven't made any bookings yet.</p>
                        <button className="button btn-primary" onClick={() => navigate("/")}>
                            Explore Hotels
                        </button>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map(booking => (
                            <div key={booking._id} className={`booking-card ${booking.status === "cancelled" ? "booking-cancelled" : ""}`}>
                                <div className="booking-card-image">
                                    {booking.hotelId?.image && (
                                        <img src={booking.hotelId.image} alt={booking.hotelId.name} />
                                    )}
                                </div>
                                <div className="booking-card-info">
                                    <div className="booking-card-header">
                                        <h3>{booking.hotelId?.name || "Hotel"}</h3>
                                        <span className={`booking-status status-${booking.status}`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="booking-location">{booking.hotelId?.city}, {booking.hotelId?.state}</p>
                                    <div className="booking-dates">
                                        <span>📅 {new Date(booking.checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                        <span className="date-arrow">→</span>
                                        <span>{new Date(booking.checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                    </div>
                                    <div className="booking-meta">
                                        <span>👥 {booking.guests} guest{booking.guests !== 1 ? "s" : ""}</span>
                                        <span>💰 Rs. {booking.totalAmount}</span>
                                    </div>
                                    {booking.status === "cancelled" && booking.cancellationNote && (
                                        <div className="cancellation-note">
                                            <strong>Cancellation reason:</strong> {booking.cancellationNote}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            {alert.open && <Alert />}
        </div>
    );
};
