import { useEffect, useState } from 'react';
import { ContractsTable } from '@/components/contracts/contracts-table';


import type { Contract } from '@/types/contract';

const MyContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/contracts/my');
      if (!res.ok) throw new Error('Failed to load contracts');
      const data = await res.json();
      setContracts(data.map((c: any) => ({
  ...c,
  status: (['active', 'pending', 'expired'].includes(c.status) ? c.status : 'pending') as 'active' | 'pending' | 'expired',
})));

    } catch (err) {
      // Handle error (was: console.error(err))
      // Add specific error handling logic here
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="main-content text-[#cbd5e1]">Loading…</div>;

  return (
    <div className="main-content max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#f8fafc] mb-6">My Contract Offers</h1>
      {/* Optionally enable filtering in the future */}
      {/* <ContractFilter /> */}
      <ContractsTable contracts={contracts} />
    </div>
  );
};

export default MyContracts;
