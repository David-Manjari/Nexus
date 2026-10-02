import React, { useState } from "react";

const initialPayouts = [
  {
    id: 1,
    recipient: "John Kamau",
    reference: "PAY-001",
    amount: "KES 85,000",
    date: "Today",
    status: "Pending",
  },
  {
    id: 2,
    recipient: "Mary Wanjiku",
    reference: "PAY-002",
    amount: "KES 120,000",
    date: "Today",
    status: "Processing",
  },
  {
    id: 3,
    recipient: "Peter Mwangi",
    reference: "PAY-003",
    amount: "KES 65,000",
    date: "Yesterday",
    status: "Paid",
  },
  {
    id: 4,
    recipient: "Grace Achieng",
    reference: "PAY-004",
    amount: "KES 45,000",
    date: "Yesterday",
    status: "Failed",
  },
];

function Disbursements() {
  const [payouts, setPayouts] = useState(initialPayouts);

  const updateStatus = (id, status) => {
    setPayouts((current) =>
      current.map((payout) =>
        payout.id === id ? { ...payout, status } : payout
      )
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Disbursements</h1>
          <p>Manage approved requests and monitor payout status.</p>
        </div>
      </div>

      <div className="payout-list">
        {payouts.map((payout) => (
          <div className="payout-card" key={payout.id}>
            <div className="payout-main">
              <div>
                <h2>{payout.recipient}</h2>
                <p>{payout.reference}</p>
              </div>

              <span
                className={`status-badge ${payout.status.toLowerCase()}`}
              >
                {payout.status}
              </span>
            </div>

            <div className="payout-details">
              <div>
                <span>Amount</span>
                <strong>{payout.amount}</strong>
              </div>

              <div>
                <span>Date</span>
                <strong>{payout.date}</strong>
              </div>
            </div>

            <div className="payout-actions">
              {payout.status === "Pending" && (
                <button
                  className="process-button"
                  onClick={() => updateStatus(payout.id, "Processing")}
                >
                  Process Payout
                </button>
              )}

              {payout.status === "Processing" && (
                <>
                  <button
                    className="paid-button"
                    onClick={() => updateStatus(payout.id, "Paid")}
                  >
                    Mark as Paid
                  </button>

                  <button
                    className="failed-button"
                    onClick={() => updateStatus(payout.id, "Failed")}
                  >
                    Mark as Failed
                  </button>
                </>
              )}

              {payout.status === "Paid" && (
                <span className="completed-label">
                  Payout completed
                </span>
              )}

              {payout.status === "Failed" && (
                <button
                  className="process-button"
                  onClick={() => updateStatus(payout.id, "Processing")}
                >
                  Retry Payout
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Disbursements;
