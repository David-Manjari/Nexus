import React, { useEffect, useState } from "react";
import "./Disbursements.css";

function Disbursements() {
  const [payouts, setPayouts] = useState(() => {
    const saved = localStorage.getItem("nexusPayouts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadPayouts = () => {
      const saved = localStorage.getItem("nexusPayouts");
      setPayouts(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener("storage", loadPayouts);

    const interval = setInterval(loadPayouts, 500);

    return () => {
      window.removeEventListener("storage", loadPayouts);
      clearInterval(interval);
    };
  }, []);

  const updateStatus = (id, status) => {
    setPayouts((current) => {
      const updated = current.map((payout) =>
        payout.id === id
          ? { ...payout, status }
          : payout
      );

      localStorage.setItem(
        "nexusPayouts",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const pending = payouts.filter(
    (payout) => payout.status === "Pending"
  );

  const processing = payouts.filter(
    (payout) => payout.status === "Processing"
  );

  const completed = payouts.filter(
    (payout) => payout.status === "Paid"
  );

  const failed = payouts.filter(
    (payout) => payout.status === "Failed"
  );

  const renderPayout = (payout) => {
    const statusClass = payout.status.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="payout-card" key={payout.id}>
        <div className="payout-main">
          <div>
            <h3>{payout.recipient}</h3>
            <p>{payout.reference}</p>
          </div>

          <strong className={`payout-status ${statusClass}`}>{payout.status}</strong>
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
            <button type="button" onClick={() => updateStatus(payout.id, "Processing")}>
              Process Payout
            </button>
          )}

          {payout.status === "Processing" && (
            <>
              <button type="button" onClick={() => updateStatus(payout.id, "Paid")}>
                Mark as Paid
              </button>

              <button type="button" onClick={() => updateStatus(payout.id, "Failed")}>
                Mark Failed
              </button>
            </>
          )}

          {payout.status === "Failed" && (
            <button type="button" onClick={() => updateStatus(payout.id, "Processing")}>
              Retry Payout
            </button>
          )}

          {payout.status === "Paid" && <p>Payout completed successfully.</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="disbursements-page">
      <header className="disbursements-header">
        <h1>Disbursements</h1>
        <p>Manage approved requests and monitor payout status.</p>
      </header>

      <section className="payout-queue">
        <h2>Payout Queue</h2>

        <div className="payout-counts">
          <span className="payout-count">Pending: {pending.length}</span>
          <span className="payout-count">Processing: {processing.length}</span>
          <span className="payout-count">Paid: {completed.length}</span>
          <span className="payout-count">Failed: {failed.length}</span>
        </div>
      </section>

      <section className="disbursements-section">
        <h2>Pending Payouts</h2>

        <div className="payout-list">
          {pending.length === 0 ? <p>No pending payouts.</p> : pending.map(renderPayout)}
        </div>
      </section>

      <section className="disbursements-section">
        <h2>Processing</h2>

        <div className="payout-list">
          {processing.length === 0 ? <p>No payouts currently processing.</p> : processing.map(renderPayout)}
        </div>
      </section>

      <section className="disbursements-section">
        <h2>Completed / Failed</h2>

        <div className="payout-list">
          {completed.length === 0 && failed.length === 0 ? (
            <p>No completed or failed payouts.</p>
          ) : (
            [...completed, ...failed].map(renderPayout)
          )}
        </div>
      </section>
    </div>
  );
}

export default Disbursements;
