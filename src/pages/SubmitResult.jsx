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
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">Submit Match Result</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <select
          value={selectedMatchId}
          onChange={(e) => setSelectedMatchId(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select Match</option>
          {matches.map((match) => (
            <option key={match.id} value={match.id}>
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
        />
        <input
          type="number"
          className="form-input"
          placeholder="Team B Score"
          value={teamBScore}
          onChange={(e) => setTeamBScore(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-input"
          placeholder="MVP (optional)"
          value={mvp}
          onChange={(e) => setMvp(e.target.value)}
        />
        <textarea
          className="form-input"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <input
          type="file"
          className="form-input"
          onChange={(e) => setScreenshot(e.target.files[0])}
        />

        <button type="submit" className="form-button" style={{ backgroundColor: '#10b981' }}>
          Submit Result
        </button>
      </form>
    </div>
  );
}

export default SubmitResult;
