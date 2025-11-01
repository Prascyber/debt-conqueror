import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export const KPICard = ({ title, value, icon: Icon, trend, variant = 'default' }: KPICardProps) => {
  const variantClasses = {
    default: 'border-primary/20 bg-primary/5',
    success: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    destructive: 'border-destructive/20 bg-destructive/5'
  };

  const iconClasses = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive'
  };

  return (
    <Card className={cn('border-2 transition-all hover:shadow-lg', variantClasses[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn('h-5 w-5', iconClasses[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <p className={cn(
            'text-xs mt-2 flex items-center gap-1',
            trend.isPositive ? 'text-success' : 'text-destructive'
          )}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}% from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
