import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar, Alert } from "../../components";
import { useAuth, useAlert } from "../../context";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export const AdminDashboard = () => {
    const { accessToken, role } = useAuth();
    const { alert } = useAlert();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState("hotels");

    useEffect(() => {
        if (!accessToken || role !== "admin") {
            navigate("/");
        }
    }, [accessToken, role, navigate]);

    return (
        <div>
            <Navbar route="admin" />
            <div className="admin-container">
                <aside className="admin-sidebar">
                    <button 
                        className={`admin-tab ${selectedTab === "hotels" ? "active" : ""}`}
                        onClick={() => setSelectedTab("hotels")}
                    >
                        Manage Hotels
                    </button>
                    <button 
                        className={`admin-tab ${selectedTab === "users" ? "active" : ""}`}
                        onClick={() => setSelectedTab("users")}
                    >
                        Manage Users
                    </button>
                    <button 
                        className={`admin-tab ${selectedTab === "bookings" ? "active" : ""}`}
                        onClick={() => setSelectedTab("bookings")}
                    >
                        Manage Bookings
                    </button>
                </aside>
                <main className="admin-main">
                    {selectedTab === "hotels" && <ManageHotels />}
                    {selectedTab === "users" && <ManageUsers />}
                    {selectedTab === "bookings" && <ManageBookings />}
                </main>
            </div>
            {alert.open && <Alert />}
        </div>
    );
};

const ManageHotels = () => {
    const [hotels, setHotels] = useState([]);
    const { accessToken } = useAuth();
    const { setAlert } = useAlert();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newHotel, setNewHotel] = useState({
        name: "", category: "", image: "", imageArr: [], address: "", city: "", state: "", country: "", price: 0, rating: 0,
        numberOfBathrooms: 0, numberOfBeds: 0, numberOfguest: 0, numberOfBedrooms: 0, numberOfStudies: 0,
        hostName: "", hostJoinedOn: new Date().toLocaleDateString(), ameneties: [], healthAndSafety: [], houseRules: [], propertyType: "", isCancelable: true
    });

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("http://localhost:3200/api/hotels");
                setHotels(data);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3200/api/admin/hotels/${id}`, {
                headers: { authorization: accessToken }
            });
            setHotels(hotels.filter(h => h._id !== id));
            setAlert({ open: true, message: "Hotel deleted", type: "success" });
        } catch (err) {
            console.log(err);
            setAlert({ open: true, message: "Error deleting hotel", type: "error" });
        }
    };

    const handleAddHotel = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:3200/api/admin/hotels", newHotel, {
                headers: { authorization: accessToken }
            });
            setHotels([...hotels, data]);
            setShowAddForm(false);
            setAlert({ open: true, message: "Hotel added", type: "success" });
        } catch (err) {
            console.log(err);
            setAlert({ open: true, message: "Error adding hotel", type: "error" });
        }
    };

    return (
        <div className="manage-section">
            <div className="section-header">
                <h2>Manage Hotels</h2>
                <button className="button btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? "Cancel" : "Add New Hotel"}
                </button>
            </div>

            {showAddForm && (
                <form className="add-hotel-form" onSubmit={handleAddHotel}>
                    <input placeholder="Name" required onChange={e => setNewHotel({...newHotel, name: e.target.value})} />
                    <input placeholder="Category" required onChange={e => setNewHotel({...newHotel, category: e.target.value})} />
                    <input placeholder="Image URL" required onChange={e => setNewHotel({...newHotel, image: e.target.value})} />
                    <input placeholder="Address" required onChange={e => setNewHotel({...newHotel, address: e.target.value})} />
                    <input placeholder="City" required onChange={e => setNewHotel({...newHotel, city: e.target.value})} />
                    <input placeholder="State" required onChange={e => setNewHotel({...newHotel, state: e.target.value})} />
                    <input placeholder="Price" type="number" required onChange={e => setNewHotel({...newHotel, price: Number(e.target.value)})} />
                    <button className="button btn-primary" type="submit">Submit</button>
                </form>
            )}

            <div className="hotel-list">
                {hotels.map(hotel => (
                    <div key={hotel._id} className="admin-hotel-card">
                        <span>{hotel.name} - {hotel.city}</span>
                        <button className="button btn-secondary" onClick={() => handleDelete(hotel._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [warnMsg, setWarnMsg] = useState({});
    const [warningTargetId, setWarningTargetId] = useState(null);
    const { accessToken } = useAuth();
    const { setAlert } = useAlert();

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("http://localhost:3200/api/admin/users", {
                headers: { authorization: accessToken }
            });
            setUsers(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [accessToken]);

    const handleBlacklist = async (id) => {
        try {
            const { data } = await axios.post(`http://localhost:3200/api/admin/users/${id}/blacklist`, {}, {
                headers: { authorization: accessToken }
            });
            setAlert({ open: true, message: data.message, type: "success" });
            fetchUsers();
        } catch (err) {
            setAlert({ open: true, message: "Error updating user", type: "error" });
        }
    };

    const handleWarn = async (id) => {
        const message = warnMsg[id];
        if (!message?.trim()) return;
        try {
            await axios.post(`http://localhost:3200/api/admin/users/${id}/warn`, { message }, {
                headers: { authorization: accessToken }
            });
            setAlert({ open: true, message: "Warning sent to user's inbox", type: "success" });
            setWarningTargetId(null);
            setWarnMsg(prev => ({ ...prev, [id]: "" }));
        } catch (err) {
            setAlert({ open: true, message: "Error sending warning", type: "error" });
        }
    };

    return (
        <div className="manage-section">
            <h2>Registered Users</h2>
            <div className="user-cards">
                {users.map(user => (
                    <div key={user._id} className={`user-card ${user.isBlacklisted ? "user-blacklisted" : ""}`}>
                        <div className="user-card-info">
                            <div className="user-card-name">
                                {user.username}
                                {user.isBlacklisted && <span className="blacklist-badge">🚫 Blacklisted</span>}
                                {user.role === "admin" && <span className="admin-badge">👑 Admin</span>}
                            </div>
                            <div className="user-card-email">{user.email}</div>
                        </div>
                        {user.role !== "admin" && (
                            <div className="user-card-actions">
                                <button
                                    className={`button ${user.isBlacklisted ? "btn-primary" : "btn-secondary"}`}
                                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                                    onClick={() => handleBlacklist(user._id)}
                                >
                                    {user.isBlacklisted ? "Unblacklist" : "🚫 Blacklist"}
                                </button>
                                <button
                                    className="button"
                                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", background: "#ffc107", color: "#333" }}
                                    onClick={() => setWarningTargetId(warningTargetId === user._id ? null : user._id)}
                                >
                                    ⚠️ Send Warning
                                </button>
                            </div>
                        )}
                        {warningTargetId === user._id && (
                            <div className="warn-input-row">
                                <input
                                    placeholder="e.g. Late checkout penalty applied..."
                                    value={warnMsg[user._id] || ""}
                                    onChange={(e) => setWarnMsg(prev => ({ ...prev, [user._id]: e.target.value }))}
                                    style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }}
                                />
                                <button className="button btn-primary" style={{ fontSize: "0.8rem" }} onClick={() => handleWarn(user._id)}>
                                    Send
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [cancelNote, setCancelNote] = useState("");
    const [cancellingId, setCancellingId] = useState(null);
    const { accessToken } = useAuth();
    const { setAlert } = useAlert();

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get("http://localhost:3200/api/admin/bookings", {
                headers: { authorization: accessToken }
            });
            setBookings(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [accessToken]);

    const handleCancel = async (id) => {
        try {
            await axios.post(`http://localhost:3200/api/admin/bookings/cancel/${id}`, { note: cancelNote }, {
                headers: { authorization: accessToken }
            });
            setAlert({ open: true, message: "Booking cancelled and user notified", type: "success" });
            setCancellingId(null);
            setCancelNote("");
            fetchBookings();
        } catch (err) {
            console.log(err);
            setAlert({ open: true, message: "Error cancelling booking", type: "error" });
        }
    };

    return (
        <div className="manage-section">
            <h2>Manage Bookings</h2>
            <div className="booking-list">
                {bookings.map(booking => (
                    <div key={booking._id} className="admin-hotel-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                            <strong>{booking.hotelId.name}</strong>
                            <span className={`status-${booking.status}`}>{booking.status.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#666" }}>
                            User: {booking.userId.username} ({booking.userId.email}) <br />
                            Dates: {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                        </div>
                        {booking.status === "active" && (
                            <div style={{ width: "100%", marginTop: "1rem" }}>
                                {cancellingId === booking._id ? (
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <input 
                                            placeholder="Cancellation reason..." 
                                            value={cancelNote}
                                            onChange={(e) => setCancelNote(e.target.value)}
                                            style={{ flex: 1, padding: "0.5rem" }}
                                        />
                                        <button className="button btn-secondary" onClick={() => handleCancel(booking._id)}>Confirm</button>
                                        <button className="button" onClick={() => setCancellingId(null)}>Back</button>
                                    </div>
                                ) : (
                                    <button className="button btn-secondary" onClick={() => setCancellingId(booking._id)}>Cancel Booking</button>
                                )}
                            </div>
                        )}
                        {booking.cancellationNote && (
                            <div style={{ fontSize: "0.8rem", fontStyle: "italic", color: "#ff385c" }}>
                                Note: {booking.cancellationNote}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
