'use client';

import { MainLayout } from '@/src/components/layout/main-layout';
import { useUser } from '@/components/auth/use-user';
import { useEffect, useState } from 'react';
import { logError } from '@/utils/logger';

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function NotificationsPage() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        logError('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-muted-foreground">No new notifications</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg transition-colors ${
                  notification.is_read 
                    ? 'bg-background hover:bg-accent/50' 
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
