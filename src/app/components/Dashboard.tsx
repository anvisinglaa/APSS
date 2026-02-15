import React, { useState, useEffect } from 'react';
import { ATMachine, Ticket, Technician } from '../types';
import { generateATMs, generateTechnicians, generateAnomaly, createTicketFromAnomaly } from '../utils/mockData';
import { ATMCard } from './ATMCard';
import { TicketCard } from './TicketCard';
import { ATMDetailsDialog } from './ATMDetailsDialog';
import { TechniciansPanel } from './TechniciansPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Search,
  Bell,
  PlayCircle,
  PauseCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './ui/input';

export function Dashboard() {
  const [atms, setAtms] = useState<ATMachine[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedATM, setSelectedATM] = useState<ATMachine | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastScan, setLastScan] = useState(new Date());

  // Initialize data
  useEffect(() => {
    const initialATMs = generateATMs();
    const initialTechnicians = generateTechnicians();
    setAtms(initialATMs);
    setTechnicians(initialTechnicians);

    // Generate initial tickets for existing anomalies
    const initialTickets: Ticket[] = [];
    initialATMs.forEach(atm => {
      const anomaly = generateAnomaly(atm);
      if (anomaly) {
        initialTickets.push(createTicketFromAnomaly(anomaly, atm));
      }
    });
    setTickets(initialTickets);
  }, []);

  // Anomaly detection simulation
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setAtms(currentAtms => {
        const updatedAtms = currentAtms.map(atm => {
          // Simulate random changes
          const rand = Math.random();
          
          if (rand < 0.1) {
            // Simulate cash level decrease
            return { ...atm, cashLevel: Math.max(0, atm.cashLevel - Math.floor(Math.random() * 10)) };
          } else if (rand < 0.15) {
            // Simulate temperature changes
            return { ...atm, temperature: atm.temperature + (Math.random() - 0.5) * 3 };
          } else if (rand < 0.2) {
            // Simulate transaction count increase
            return { ...atm, transactionsToday: atm.transactionsToday + Math.floor(Math.random() * 5) };
          }
          
          return atm;
        });

        // Check for new anomalies
        updatedAtms.forEach(atm => {
          const anomaly = generateAnomaly(atm);
          if (anomaly) {
            // Check if ticket already exists for this ATM
            const existingTicket = tickets.find(
              t => t.atmId === atm.id && ['open', 'assigned', 'in_progress'].includes(t.status)
            );
            
            if (!existingTicket) {
              const newTicket = createTicketFromAnomaly(anomaly, atm);
              setTickets(prev => [newTicket, ...prev]);
              
              toast.error(`Anomaly detected at ${atm.location}!`, {
                description: anomaly.description,
                action: {
                  label: 'View Ticket',
                  onClick: () => {
                    document.getElementById('tickets-tab')?.click();
                  }
                }
              });
            }
          }
        });

        return updatedAtms;
      });

      setLastScan(new Date());
    }, 10000); // Scan every 10 seconds

    return () => clearInterval(interval);
  }, [isMonitoring, tickets]);

  // Manual scan
  const handleManualScan = () => {
    toast.info('Running anomaly detection scan...');
    setLastScan(new Date());
    
    atms.forEach(atm => {
      const anomaly = generateAnomaly(atm);
      if (anomaly) {
        const existingTicket = tickets.find(
          t => t.atmId === atm.id && ['open', 'assigned', 'in_progress'].includes(t.status)
        );
        
        if (!existingTicket) {
          const newTicket = createTicketFromAnomaly(anomaly, atm);
          setTickets(prev => [newTicket, ...prev]);
          toast.error(`Anomaly detected at ${atm.location}!`);
        }
      }
    });

    setTimeout(() => {
      toast.success('Scan completed');
    }, 1000);
  };

  const handleUpdateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      )
    );

    // Update technician assignments
    if (updates.assignedTo) {
      setTechnicians(prev =>
        prev.map(tech => {
          if (tech.id === updates.assignedTo) {
            return { ...tech, assignedTickets: tech.assignedTickets + 1 };
          }
          // Remove from previous assignment if any
          const prevTicket = tickets.find(t => t.id === ticketId);
          if (prevTicket?.assignedTo === tech.id) {
            return { ...tech, assignedTickets: Math.max(0, tech.assignedTickets - 1) };
          }
          return tech;
        })
      );
    }
  };

  // Filter ATMs based on search
  const filteredATMs = atms.filter(atm =>
    atm.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    atm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    atm.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const stats = {
    total: atms.length,
    online: atms.filter(a => a.status === 'online').length,
    offline: atms.filter(a => a.status === 'offline').length,
    warnings: atms.filter(a => a.status === 'warning' || a.status === 'error').length,
    openTickets: tickets.filter(t => ['open', 'assigned', 'in_progress'].includes(t.status)).length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">ATM Monitoring Dashboard</h1>
              <p className="text-muted-foreground">Real-time anomaly detection & ticketing</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <p className="text-sm text-muted-foreground">Last Scan</p>
                <p className="text-sm font-medium">{lastScan.toLocaleTimeString()}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsMonitoring(!isMonitoring);
                  toast.success(isMonitoring ? 'Monitoring paused' : 'Monitoring resumed');
                }}
              >
                {isMonitoring ? (
                  <>
                    <PauseCircle className="size-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="size-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              <Button size="sm" onClick={handleManualScan}>
                <RefreshCw className="size-4 mr-2" />
                Scan Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total ATMs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.total}</div>
                <Activity className="size-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600">{stats.online}</div>
                <CheckCircle className="size-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Issues Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-orange-600">{stats.warnings}</div>
                <AlertTriangle className="size-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-red-600">{stats.openTickets}</div>
                <Bell className="size-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="atms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="atms">
              ATM Monitor
              <Badge variant="secondary" className="ml-2">{stats.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="tickets" id="tickets-tab">
              Tickets
              <Badge variant="destructive" className="ml-2">{stats.openTickets}</Badge>
            </TabsTrigger>
            <TabsTrigger value="technicians">
              Technicians
              <Badge variant="secondary" className="ml-2">{technicians.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* ATMs Tab */}
          <TabsContent value="atms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ATM Fleet Status</CardTitle>
                <CardDescription>
                  Monitor all ATMs in real-time. Click on any ATM for detailed information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by ID, location, or address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredATMs.map(atm => (
                    <ATMCard
                      key={atm.id}
                      atm={atm}
                      onViewDetails={setSelectedATM}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>
                  Manage anomaly tickets and assign technicians. JSON payloads are automatically generated for each ticket.
                </CardDescription>
              </CardHeader>
            </Card>

            {tickets.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Tickets</h3>
                    <p className="text-muted-foreground">
                      All systems are running smoothly. No anomalies detected.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    technicians={technicians}
                    onUpdateTicket={handleUpdateTicket}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Technicians Tab */}
          <TabsContent value="technicians">
            <Card>
              <CardHeader>
                <CardTitle>Technician Management</CardTitle>
                <CardDescription>
                  View and manage field technicians. Assign tickets from the Tickets tab.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TechniciansPanel technicians={technicians} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ATM Details Dialog */}
      <ATMDetailsDialog
        atm={selectedATM}
        open={!!selectedATM}
        onClose={() => setSelectedATM(null)}
      />
    </div>
  );
}
