import React from "react";
import { useRouter } from "next/router";

const TeamDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div>Team Detail Page for ID: {id}</div>;
};
export default TeamDetailPage;
