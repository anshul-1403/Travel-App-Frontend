import { Route, Routes } from "react-router-dom";
import {
  Home,
  SingleHotel,
  SearchResults,
  Wishlist,
  Payment,
  OrderSummary,
  AdminDashboard,
  Inbox,
  MyBookings,
} from "./pages";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/hotels/:name/:address/:id/reserve"
        element={<SingleHotel />}
      />
      <Route path="/hotels/:address" element={<SearchResults />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/confirm-booking/stay/:id" element={<Payment />} />
      <Route path="/order-summary" element={<OrderSummary />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/my-bookings" element={<MyBookings />} />
    </Routes>
  );
}

export default App;
