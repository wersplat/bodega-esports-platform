// frontend/pages/index.jsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-[#f8fafc]">Welcome to the new theme!</h1>
        <p className="mb-6 text-muted-foreground">Your UI is now powered by the new design system.</p>
        <Button>Click me</Button>
      </Card>
    </div>
  );
}
