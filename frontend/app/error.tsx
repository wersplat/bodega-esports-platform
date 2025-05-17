'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-destructive">Something went wrong!</h1>
        <p className="text-muted-foreground">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              Go to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
