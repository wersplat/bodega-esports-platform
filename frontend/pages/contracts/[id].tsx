import React from "react";
import { useRouter } from "next/router";

const ContractDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div>Contract Detail Page for ID: {id}</div>;
};
export default ContractDetailPage;
