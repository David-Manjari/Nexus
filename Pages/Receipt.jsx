import React from "react";
import "../Styles/Receipt.css";

function Receipt() {
  return (
    <div className="receipt-page">
      <div className="receipt-card">
        <h1>Payment Successful!</h1>

        <p className="success-message">
          Thank you for your purchase.
        </p>

        <div className="receipt-details">
          <p>
            <strong>Order Number:</strong> #SF001
          </p>

          <p>
            <strong>Payment Method:</strong> M-Pesa
          </p>

          <p>
            <strong>Status:</strong> Paid
          </p>

          <p>
            <strong>Total Amount:</strong> KSh 2,500
          </p>
        </div>

        <button
          className="continue-button"
          onClick={() => (window.location.href = "/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Receipt;

