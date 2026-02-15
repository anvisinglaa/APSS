import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ATMachine } from '../types';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Banknote, 
  Thermometer, 
  Activity, 
  TrendingUp,
  Clock,
  Wifi,
  HardDrive,
  Zap
} from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface ATMDetailsDialogProps {
  atm: ATMachine | null;
  open: boolean;
  onClose: () => void;
}

export function ATMDetailsDialog({ atm, open, onClose }: ATMDetailsDialogProps) {
  if (!atm) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      case 'offline': return 'destructive';
      default: return 'default';
    }
  };

  const getCashLevelColor = (level: number) => {
    if (level < 20) return 'text-red-500';
    if (level < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{atm.id}</DialogTitle>
          <DialogDescription>{atm.location}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div>
            <Badge variant={getStatusColor(atm.status)} className="text-sm">
              {atm.status.toUpperCase()}
            </Badge>
          </div>

          {/* Location Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{atm.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Banknote className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cash Level</p>
                    <p className={`text-2xl font-bold ${getCashLevelColor(atm.cashLevel)}`}>
                      {atm.cashLevel}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Thermometer className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className={`text-2xl font-bold ${atm.temperature > 30 ? 'text-red-500' : ''}`}>
                      {atm.temperature}°C
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions Today</p>
                    <p className="text-2xl font-bold">{atm.transactionsToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-bold">{atm.uptime}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-sm">Last Online</span>
                </div>
                <span className="font-medium">{atm.lastOnline.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="size-4 text-muted-foreground" />
                  <span className="text-sm">Connection Status</span>
                </div>
                <span className="font-medium">
                  {atm.status === 'offline' ? 'Disconnected' : 'Connected'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="size-4 text-muted-foreground" />
                  <span className="text-sm">Disk Usage</span>
                </div>
                <span className="font-medium">67%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-muted-foreground" />
                  <span className="text-sm">Power Status</span>
                </div>
                <span className="font-medium">Normal</span>
              </div>
            </CardContent>
          </Card>

          {/* Health Status */}
          <Card className={
            atm.status === 'online' ? 'bg-green-50 border-green-200' :
            atm.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
            atm.status === 'error' ? 'bg-orange-50 border-orange-200' :
            'bg-red-50 border-red-200'
          }>
            <CardContent className="pt-6">
              <div>
                <p className="font-medium mb-2">System Health</p>
                <div className="space-y-1 text-sm">
                  {atm.status === 'online' && (
                    <p className="text-green-700">✓ All systems operational</p>
                  )}
                  {atm.cashLevel < 20 && (
                    <p className="text-red-700">⚠ Cash level critically low</p>
                  )}
                  {atm.temperature > 30 && (
                    <p className="text-orange-700">⚠ Temperature above normal range</p>
                  )}
                  {atm.status === 'offline' && (
                    <p className="text-red-700">✗ ATM is offline - connectivity issue detected</p>
                  )}
                  {atm.status === 'error' && (
                    <p className="text-orange-700">✗ Hardware error detected</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
