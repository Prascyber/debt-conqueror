import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataStore } from '@/store/dataStore';
import { format } from 'date-fns';
import { Activity as ActivityIcon, User, Briefcase, LogIn, LogOut, Settings } from 'lucide-react';
import { Activity } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'case_update':
      return Briefcase;
    case 'agent_update':
      return User;
    case 'login':
      return LogIn;
    case 'logout':
      return LogOut;
    case 'system':
      return Settings;
    default:
      return ActivityIcon;
  }
};

export const ActivityLog = () => {
  const { activities } = useDataStore();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id}>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      {index < activities.length - 1 && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {activity.userName}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
