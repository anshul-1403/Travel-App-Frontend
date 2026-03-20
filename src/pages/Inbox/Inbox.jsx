import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar, Alert } from "../../components";
import { useAuth, useAlert } from "../../context";
import "./Inbox.css";

export const Inbox = () => {
    const [notifications, setNotifications] = useState([]);
    const { accessToken } = useAuth();
    const { alert } = useAlert();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("https://travel-app-backend-zvzh.onrender.com/api/notifications", {
                    headers: { authorization: accessToken }
                });
                setNotifications(data);
                // Mark as read when viewing
                await axios.post("https://travel-app-backend-zvzh.onrender.com/api/notifications/mark-as-read", {}, {
                    headers: { authorization: accessToken }
                });
            } catch (err) {
                console.log(err);
            }
        })();
    }, [accessToken]);

    return (
        <div>
            <Navbar />
            <main className="inbox-container">
                <h2>Your Inbox</h2>
                {notifications.length === 0 ? (
                    <p>No new notifications</p>
                ) : (
                    <div className="notification-list">
                        {notifications.map(notif => (
                            <div key={notif._id} className={`notification-card ${notif.isRead ? 'read' : 'unread'}`}>
                                <div className="notif-header">
                                    <span className="material-icons-outlined">notifications</span>
                                    <span className="notif-time">{new Date(notif.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="notif-message">{notif.message}</p>
                                {notif.note && (
                                    <div className="notif-note">
                                        <strong>Admin's Note:</strong> {notif.note}
                                    </div>
                                ) }
                            </div>
                        ))}
                    </div>
                )}
            </main>
            {alert.open && <Alert />}
        </div>
    );
};
