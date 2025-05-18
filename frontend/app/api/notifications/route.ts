import { NextRequest, NextResponse } from 'next/server';

// This route proxies notification requests to the backend API, assuming auth is handled by auth-service
export async function GET(req: NextRequest) {
  try {
    // Forward the Authorization header (JWT) to the backend
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch notifications from backend API (assume endpoint exists)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/v2/notifications`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: response.status });
    }

    const notifications = await response.json();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error in notifications API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
