import React, { useState } from "react";

const initialApprovals = [
  {
    id: 1,
    request: "Office Equipment Purchase",
    requester: "John Kamau",
    department: "Operations",
    amount: "KES 85,000",
    submitted: "Today",
    status: "Pending",
  },
  {
    id: 2,
    request: "Software Licenses",
    requester: "Mary Wanjiku",
    department: "IT",
    amount: "KES 120,000",
    submitted: "Yesterday",
    status: "Pending",
  },
  {
    id: 3,
    request: "Field Operations Expenses",
    requester: "Peter Mwangi",
    department: "Projects",
    amount: "KES 65,000",
    submitted: "2 days ago",
    status: "Approved",
  },
];

function Approvals() {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [comments, setComments] = useState({});

  const updateStatus = (id, status) => {
    setApprovals((current) =>
      current.map((approval) =>
        approval.id === id ? { ...approval, status } : approval
      )
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Approvals</h1>
          <p>Review and manage requests awaiting approval.</p>
        </div>
      </div>

      <div className="approval-list">
        {approvals.map((approval) => (
          <div className="approval-card" key={approval.id}>
            <div className="approval-card-header">
              <div>
                <h2>{approval.request}</h2>
                <p>
                  Requested by {approval.requester} · {approval.department}
                </p>
              </div>

              <span
                className={`status-badge ${approval.status.toLowerCase()}`}
              >
                {approval.status}
              </span>
            </div>

            <div className="approval-details">
              <div>
                <span>Amount</span>
                <strong>{approval.amount}</strong>
              </div>

              <div>
                <span>Submitted</span>
                <strong>{approval.submitted}</strong>
              </div>
            </div>

            {approval.status === "Pending" && (
              <div className="approval-actions">
                <textarea
                  placeholder="Add a comment..."
                  value={comments[approval.id] || ""}
                  onChange={(event) =>
                    setComments({
                      ...comments,
                      [approval.id]: event.target.value,
                    })
                  }
                />

                <div className="action-buttons">
                  <button
                    className="approve-button"
                    onClick={() => updateStatus(approval.id, "Approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-button"
                    onClick={() => updateStatus(approval.id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            {approval.status !== "Pending" && (
              <div className="approval-completed">
                This request has been {approval.status.toLowerCase()}.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Approvals;
