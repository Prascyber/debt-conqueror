import { MainLayout } from '@/components/layout/MainLayout';
import { ActivityLog } from '@/components/activity/ActivityLog';

export default function Activity() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">Track all system activities and user actions</p>
        </div>

        <ActivityLog />
      </div>
    </MainLayout>
  );
}
