// Type definitions for the ATM monitoring system

export type ATMStatus = 'online' | 'offline' | 'warning' | 'error';
export type AnomalyType = 'cash_low' | 'hardware_failure' | 'network_issue' | 'card_reader_error' | 'dispenser_jam' | 'temperature_high' | 'unauthorized_access';
export type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ATMachine {
  id: string;
  location: string;
  address: string;
  status: ATMStatus;
  cashLevel: number;
  lastOnline: Date;
  temperature: number;
  transactionsToday: number;
  uptime: number;
}

export interface Anomaly {
  id: string;
  atmId: string;
  type: AnomalyType;
  severity: TicketPriority;
  detectedAt: Date;
  description: string;
  metadata: Record<string, any>;
}

export interface Ticket {
  id: string;
  atmId: string;
  atmLocation: string;
  anomaly: Anomaly;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  assignedTo?: string;
  resolvedAt?: Date;
  notes: string[];
  jsonPayload: any;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedTickets: number;
  available: boolean;
  location: string;
}
