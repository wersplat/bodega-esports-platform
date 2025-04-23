import React from 'react';

function AdminSubmitResult() {
  return (
    <div className="main-content">
      <h1 className="page-title">Admin: Submit Match Result</h1>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px', background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
        <select className="form-input" required>
          <option value="">Select Match</option>
          {/* Dynamically populate matches here */}
        </select>

        <input
          type="number"
          placeholder="Team A Score"
          className="form-input"
          required
        />

        <input
          type="number"
          placeholder="Team B Score"
          className="form-input"
          required
        />

        <textarea
          placeholder="Notes (optional)"
          className="form-input"
        ></textarea>

        <button type="submit" className="form-button">
          Submit Result
        </button>
      </form>
    </div>
  );
}

export default AdminSubmitResult;
