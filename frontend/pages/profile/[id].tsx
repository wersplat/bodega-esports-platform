import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps, NextPage } from 'next';
import { Edit, Save, X } from 'lucide-react';

import { useAuth } from '@/components/auth/auth-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AvatarUpload } from '@/components/auth/avatar-upload';
import { RecentMatches } from '@/components/team/recent-matches';
import { Achievements } from '@/components/achievements';
import { PerformanceChart } from '@/components/performance-chart';
// TODO: Replace Supabase logic with backend API calls
import type { UserProfile, Team } from '@/types/api';

type ProfilePageProps = {
  initialProfile: UserProfile | null;
  initialTeam: Team | null;
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (context) => {
  const { id } = context.params as { id: string };
  
  try {
    // TODO: Replace with actual backend endpoint URLs
    // Fetch profile data
    const profileRes = await fetch(`${process.env.API_BASE_URL || ''}/api/profiles/${id}`)
    if (!profileRes.ok) {
      return { notFound: true };
    }
    const profile = await profileRes.json();

    // Fetch team data if user has a team
    let team = null;
    if (profile.team_id) {
      const teamRes = await fetch(`${process.env.API_BASE_URL || ''}/api/teams/${profile.team_id}`)
      if (teamRes.ok) {
        team = await teamRes.json();
      }
    }

    return {
      props: {
        initialProfile: profile,
        initialTeam: team,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
};

const UserProfilePage: NextPage<ProfilePageProps> = ({
  initialProfile,
  initialTeam,
  
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { id: userId } = router.query as { id: string };
  
  const [profile, setProfile] = useState(initialProfile);
  const [team] = useState(initialTeam);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(initialError || null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    position: "",
    jersey_number: "",
  });

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        position: profile.position || "",
        jersey_number: profile.jersey_number?.toString() || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (url: string | null) => {
    if (!profile) return;
    try {
      // TODO: Replace with actual backend endpoint URL
      const res = await fetch(`/api/profiles/${profile.id}/avatar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: url }),
      })
      if (!res.ok) throw new Error("Failed to update avatar");
      setProfile({ ...profile, avatar_url: url });
    } catch (err) {
      console.error("Error updating avatar:", err);
      // setError("Failed to update avatar");
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      setIsLoading(true);
      const updates = {
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        position: formData.position,
        jersey_number: formData.jersey_number ? Number(formData.jersey_number) : null,
        updated_at: new Date().toISOString(),
      };
      // TODO: Replace with actual backend endpoint URL
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Failed to update profile");
      setProfile({ ...profile, ...updates });
      setIsEditing(false);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      // setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-[#94a3b8] mb-4">The requested profile could not be found.</p>
          <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <AvatarUpload
              avatarUrl={profile.avatar_url ?? null}
              onAvatarChange={handleAvatarChange}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditing ? (
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="text-2xl font-bold p-2 mb-2"
                    />
                  ) : (
                    profile.full_name || 'Unnamed Player'
                  )}
                </h1>
                <p className="text-muted-foreground">
                  @{isEditing ? (
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                      className="inline-block w-auto p-1 text-base"
                    />
                  ) : (
                    profile.username || 'no-username'
                  )}
                </p>
              </div>
              
              {isOwnProfile && (
                <div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          'Saving...'
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" /> Save
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit Profile
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
                {isEditing ? (
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Position"
                    className="mt-1"
                  />
                ) : (
                  <p>{profile.position || 'Not specified'}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Jersey #</h3>
                {isEditing ? (
                  <Input
                    name="jersey_number"
                    type="number"
                    value={formData.jersey_number}
                    onChange={handleInputChange}
                    placeholder="Jersey Number"
                    className="mt-1"
                  />
                ) : (
                  <p>{profile.jersey_number || '--'}</p>
                )}
              </div>
              {team && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Team</h3>
                  <p>{team.name}</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  className="w-full p-2 border rounded-md min-h-[100px]"
                />
              ) : (
                <p className="whitespace-pre-line">{profile.bio || 'No bio provided.'}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
            <RecentMatches userId={profile.id} />
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance</h2>
            <PerformanceChart userId={profile.id} />
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <Achievements userId={profile.id} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
