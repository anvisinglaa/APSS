import React from 'react';
import { ATMachine } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Banknote, 
  Thermometer, 
  Activity, 
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi
} from 'lucide-react';

interface ATMCardProps {
  atm: ATMachine;
  onViewDetails: (atm: ATMachine) => void;
}

export function ATMCard({ atm, onViewDetails }: ATMCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      online: 'default',
      warning: 'secondary',
      error: 'destructive',
      offline: 'destructive'
    };
    return variants[status] || 'default';
  };

  const getCashLevelColor = (level: number) => {
    if (level < 20) return 'text-red-500';
    if (level < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatLastOnline = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer border-l-4"
      style={{ borderLeftColor: `var(--${getStatusColor(atm.status).replace('bg-', '')})` }}
      onClick={() => onViewDetails(atm)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{atm.id}</CardTitle>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <MapPin className="size-3" />
              <p className="text-sm">{atm.location}</p>
            </div>
          </div>
          <Badge variant={getStatusBadge(atm.status)}>
            {atm.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Cash Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Banknote className="size-4 text-muted-foreground" />
              <span className="text-sm">Cash Level</span>
            </div>
            <span className={`font-semibold ${getCashLevelColor(atm.cashLevel)}`}>
              {atm.cashLevel}%
            </span>
          </div>

          {/* Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="size-4 text-muted-foreground" />
              <span className="text-sm">Temperature</span>
            </div>
            <span className={atm.temperature > 30 ? 'text-red-500 font-semibold' : ''}>
              {atm.temperature}°C
            </span>
          </div>

          {/* Transactions Today */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              <span className="text-sm">Transactions</span>
            </div>
            <span>{atm.transactionsToday}</span>
          </div>

          {/* Uptime */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" />
              <span className="text-sm">Uptime</span>
            </div>
            <span>{atm.uptime}%</span>
          </div>

          {/* Last Online */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <span className="text-sm">Last Online</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatLastOnline(atm.lastOnline)}
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 pt-3 border-t flex items-center gap-2">
          {atm.status === 'online' && (
            <>
              <CheckCircle className="size-4 text-green-500" />
              <span className="text-sm text-green-600">Operational</span>
            </>
          )}
          {atm.status === 'warning' && (
            <>
              <AlertTriangle className="size-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">Attention Required</span>
            </>
          )}
          {atm.status === 'error' && (
            <>
              <XCircle className="size-4 text-orange-500" />
              <span className="text-sm text-orange-600">Error Detected</span>
            </>
          )}
          {atm.status === 'offline' && (
            <>
              <Wifi className="size-4 text-red-500" />
              <span className="text-sm text-red-600">Offline</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
