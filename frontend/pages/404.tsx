import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/layout';
import { Home } from 'lucide-react';

const Custom404: NextPage = () => {
  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-5xl font-bold text-center text-destructive">
              404
            </CardTitle>
            <CardDescription className="text-center text-xl">
              Page Not Found
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Sorry, we couldn&#39;t find the page you&#39;re looking for.
            </p>
            <Button asChild>
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Back Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Custom404;
