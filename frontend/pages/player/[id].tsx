import React from "react";
import { useRouter } from "next/router";

const PlayerDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div>Player Detail Page for ID: {id}</div>;
};
export default PlayerDetailPage;
