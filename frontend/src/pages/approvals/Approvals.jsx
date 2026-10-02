import React, { useState } from "react";
import "./Approvals.css";

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
    request: "Staff Training",
    requester: "Mary Wanjiku",
    department: "Human Resources",
    amount: "KES 45,000",
    submitted: "Yesterday",
    status: "Pending",
  },
  {
    id: 3,
    request: "Software Licenses",
    requester: "David Otieno",
    department: "Technology",
    amount: "KES 120,000",
    submitted: "2 days ago",
    status: "Pending",
  },
];

function Approvals() {
  const [approvals, setApprovals] = useState(() => {
    const saved = localStorage.getItem("nexusApprovals");
    return saved ? JSON.parse(saved) : initialApprovals;
  });

  const [comments, setComments] = useState({});

  const updateStatus = (id, status) => {
    setApprovals((current) => {
      const updated = current.map((approval) =>
        approval.id === id
          ? { ...approval, status }
          : approval
      );

      localStorage.setItem("nexusApprovals", JSON.stringify(updated));

      if (status === "Approved") {
        const approvedRequest = updated.find(
          (approval) => approval.id === id
        );

        const existingPayouts = JSON.parse(
          localStorage.getItem("nexusPayouts") || "[]"
        );

        const alreadyExists = existingPayouts.some(
          (payout) => payout.id === approvedRequest.id
        );

        if (!alreadyExists) {
          existingPayouts.push({
            id: approvedRequest.id,
            recipient: approvedRequest.requester,
            reference: approvedRequest.request,
            amount: approvedRequest.amount,
            date: approvedRequest.submitted,
            status: "Pending",
          });

          localStorage.setItem(
            "nexusPayouts",
            JSON.stringify(existingPayouts)
          );
        }
      }

      return updated;
    });
  };

  const pendingCount = approvals.filter(
    (approval) => approval.status === "Pending"
  ).length;

  const getTimelineStatus = (status) => {
    if (status === "Pending") {
      return {
        review: "Current",
        decision: "Waiting",
        disbursement: "Waiting",
      };
    }

    if (status === "Approved") {
      return {
        review: "Completed",
        decision: "Approved",
        disbursement: "Ready for payout",
      };
    }

    return {
      review: "Completed",
      decision: "Rejected",
      disbursement: "Not applicable",
    };
  };

  return (
    <div className="approvals-page">
      <header className="approvals-header">
        <h1>Approvals</h1>
        <p>Review and manage requests awaiting approval.</p>
      </header>

      <div className="approval-summary">
        <strong>{pendingCount}</strong> request(s) awaiting approval
      </div>

      <div className="approval-list">
        {approvals.map((approval) => {
          const timeline = getTimelineStatus(approval.status);
          const statusClass = approval.status.toLowerCase();

          return (
            <div className="approval-card" key={approval.id}>
              <div className="approval-card-header">
                <div>
                  <h2>{approval.request}</h2>
                  <p>
                    Requested by {approval.requester} · {approval.department}
                  </p>
                </div>

                <strong className={`approval-status ${statusClass}`}>{approval.status}</strong>
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
                  <input
                    type="text"
                    placeholder="Add comment (optional)"
                    value={comments[approval.id] || ""}
                    onChange={(event) =>
                      setComments({
                        ...comments,
                        [approval.id]: event.target.value,
                      })
                    }
                  />

                  <button type="button" onClick={() => updateStatus(approval.id, "Approved")}>
                    Approve
                  </button>

                  <button type="button" onClick={() => updateStatus(approval.id, "Rejected")}>
                    Reject
                  </button>
                </div>
              )}

              {approval.status !== "Pending" && (
                <div className="approval-completed">
                  <p>
                    This request has been {approval.status.toLowerCase()}.
                  </p>

                  {comments[approval.id] && (
                    <p>
                      <strong>Comment:</strong> {comments[approval.id]}
                    </p>
                  )}
                </div>
              )}

              <section className="approval-timeline">
                <h3>Approval Timeline</h3>

                <div className="approval-timeline-item">
                  <strong>1. Request submitted</strong>
                  <p>Completed</p>
                </div>

                <div className="approval-timeline-item">
                  <strong>2. Review</strong>
                  <p>{timeline.review}</p>
                </div>

                <div className="approval-timeline-item">
                  <strong>3. Decision</strong>
                  <p>{timeline.decision}</p>
                </div>

                <div className="approval-timeline-item">
                  <strong>4. Disbursement</strong>
                  <p>{timeline.disbursement}</p>
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Approvals;
