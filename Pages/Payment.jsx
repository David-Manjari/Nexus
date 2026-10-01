import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Payment.css";

function Payment() {
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    navigate("/receipt");
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1>Payment</h1>

        <form onSubmit={handlePayment}>
          <label>Card Number</label>
          <input
            type="text"
            placeholder="Enter card number"
            required
          />

          <label>Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            required
          />

          <label>CVV</label>
          <input
            type="text"
            placeholder="CVV"
            required
          />

          <button type="submit">Pay Now</button>
        </form>
      </div>
    </div>
  );
}

export default Payment;