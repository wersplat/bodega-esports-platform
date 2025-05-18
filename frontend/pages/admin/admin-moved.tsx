import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PlasmicComponent, PlasmicRootProvider } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "@/plasmic-init";
import SidebarLayoutWrapper from "@/components/SidebarLayoutWrapper";

export default function AdminPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [plasmicData, setPlasmicData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) throw new Error('No access token');
        const res = await fetch("/auth-service/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        if (!data.is_admin) throw new Error("Access denied");
        setIsAdmin(true);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (isAdmin) {
      PLASMIC.fetchComponentData("AdminDashboardPage").then(setPlasmicData);
    }
  }, [isAdmin]);

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <SidebarLayoutWrapper>
      {plasmicData && (
        <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
          <PlasmicComponent component="AdminDashboardPage" />
        </PlasmicRootProvider>
      )}
    </SidebarLayoutWrapper>
  );
}
