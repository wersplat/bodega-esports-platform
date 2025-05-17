import { MainLayout } from '@/src/components/layout/main-layout';

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to Bodega Esports</h1>
        <p className="text-lg text-muted-foreground">
          Your one-stop platform for esports management and competition.
        </p>
      </div>
    </MainLayout>
  );
}
