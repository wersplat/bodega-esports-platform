import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast'; // ✅ Added toast

function SubmitResult() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [teamAScore, setTeamAScore] = useState('');
  const [teamBScore, setTeamBScore] = useState('');
  const [mvp, setMvp] = useState('');
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('id, team_a, team_b')
      .order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching matches:', error.message);
    } else {
      setMatches(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMatchId || teamAScore === '' || teamBScore === '') {
      toast.error('Please complete all fields.');
      return;
    }

    const updates = {
      team_a_score: parseInt(teamAScore, 10),
      team_b_score: parseInt(teamBScore, 10),
      mvp,
      notes,
      status: 'Completed'
    };

    // Upload screenshot if provided
    if (screenshot) {
      const filename = `${selectedMatchId}-${Date.now()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(filename, screenshot);

      if (uploadError) {
        console.error('Upload error:', uploadError.message);
        toast.error('Failed to upload screenshot.');
        return;
      }

      updates.screenshot_url = uploadData.path;
    }

    const { error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', selectedMatchId);

    if (error) {
      console.error('Error submitting result:', error.message);
      toast.error('Failed to submit result.');
    } else {
      toast.success('Result submitted successfully!');
      setSelectedMatchId('');
      setTeamAScore('');
      setTeamBScore('');
      setMvp('');
      setNotes('');
      setScreenshot(null);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Submit Match Result</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 500, margin: '0 auto' }}>
        <select
          value={selectedMatchId}
          onChange={(e) => setSelectedMatchId(e.target.value)}
          className="form-input"
          required
          style={{ background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
        >
          <option value="">Select Match</option>
          {matches.map((match) => (
            <option key={match.id} value={match.id} style={{ background: '#1e293b', color: '#f8fafc' }}>
              {match.team_a} vs {match.team_b}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="form-input"
          placeholder="Team A Score"
          value={teamAScore}
          onChange={(e) => setTeamAScore(e.target.value)}
          required
          style={{ background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
        />
        <input
          type="number"
          className="form-input"
          placeholder="Team B Score"
          value={teamBScore}
          onChange={(e) => setTeamBScore(e.target.value)}
          required
          style={{ background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="MVP (optional)"
          value={mvp}
          onChange={(e) => setMvp(e.target.value)}
          style={{ background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
        />
        <textarea
          className="form-input"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
        />
        <input
          type="file"
          className="form-input"
          onChange={(e) => setScreenshot(e.target.files[0])}
          style={{ background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
        />

        <button type="submit" className="form-button" style={{ backgroundColor: '#10b981', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none', marginTop: '20px' }}>
          Submit Result
        </button>
      </form>
    </div>
  );
}

export default SubmitResult;
