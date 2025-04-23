import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function PlayerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewPublic, setViewPublic] = useState(false); // State to toggle between public and private view

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').single();
        if (error) throw error;
        setProfile({
          ...data,
          gamertag: data.gamer_tag, // Map gamer_tag to gamertag
          avatarUrl: data.avatar_url, // Map avatar_url to avatarUrl
          displayName: data.display_name, // Map display_name to displayName
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (updates) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('profiles').update({
        ...updates,
        gamer_tag: updates.gamertag, // Map gamertag to gamer_tag
        avatar_url: updates.avatarUrl, // Map avatarUrl to avatar_url
        display_name: updates.displayName, // Map displayName to display_name
      }).eq('id', profile.id);
      if (error) throw error;
      setProfile({ ...profile, ...updates });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setViewPublic(!viewPublic);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Player Profile</h1>
      <button
        className={`mt-2 px-4 py-2 rounded transition-all duration-300 ${viewPublic ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
        onClick={toggleView}
      >
        {viewPublic ? 'View Private Profile' : 'View Public Profile'}
      </button>

      {profile ? (
        <div className={`mt-4 p-4 rounded-lg shadow-md ${viewPublic ? 'bg-gray-100' : 'bg-white'}`}>
          {viewPublic ? (
            <div>
              <p className="text-lg font-semibold"><strong>Gamertag:</strong> {profile.gamertag}</p>
              <p className="text-lg font-semibold"><strong>Positions:</strong> {profile.positions}</p>
              <p className="text-lg font-semibold"><strong>Platform:</strong> {profile.platform}</p>
              <p className="text-lg font-semibold"><strong>Career PPG:</strong> {profile.career_ppg}</p>
              <p className="text-lg font-semibold"><strong>Career APG:</strong> {profile.career_apg}</p>
              <p className="text-lg font-semibold"><strong>Career RPG:</strong> {profile.career_rpg}</p>
              <p className="text-lg font-semibold"><strong>Display Name:</strong> {profile.displayName}</p>
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full mt-4 border-2 border-gray-300"
              />
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold"><strong>Gamertag:</strong> {profile.gamertag}</p>
              <p className="text-lg font-semibold"><strong>Positions:</strong> {profile.positions}</p>
              <p className="text-lg font-semibold"><strong>Platform:</strong> {profile.platform}</p>
              <p className="text-lg font-semibold"><strong>Career PPG:</strong> {profile.career_ppg}</p>
              <p className="text-lg font-semibold"><strong>Career APG:</strong> {profile.career_apg}</p>
              <p className="text-lg font-semibold"><strong>Career RPG:</strong> {profile.career_rpg}</p>
              <p className="text-lg font-semibold"><strong>Display Name:</strong> {profile.displayName}</p>
              <p className="text-lg font-semibold"><strong>Email:</strong> {profile.email}</p>
              <p className="text-lg font-semibold"><strong>Career History:</strong> {profile.career_history || 'No career history available.'}</p>
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full mt-4 border-2 border-gray-300"
              />
              <button
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-all duration-300"
                onClick={() => handleUpdate({ gamertag: 'UpdatedGamertag' })} // Example update
              >
                Update Profile
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
    </div>
  );
}

export default PlayerProfile;
