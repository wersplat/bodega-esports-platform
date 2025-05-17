import React from "react";
import { useRouter } from "next/router";

const LeagueDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div>League Detail Page for ID: {id}</div>;
};
export default LeagueDetailPage;
