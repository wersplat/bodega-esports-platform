import React from "react";
import { useRouter } from "next/router";

const MatchDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div>Match Detail Page for ID: {id}</div>;
};
export default MatchDetailPage;
