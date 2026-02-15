// Mock data generator for ATM monitoring system

import { ATMachine, Anomaly, Ticket, Technician, AnomalyType, TicketPriority, TicketStatus } from '../types';

export const generateATMs = (): ATMachine[] => {
  return [
    {
      id: 'ATM-001',
      location: 'Downtown Branch',
      address: '123 Main St, New York, NY 10001',
      status: 'online',
      cashLevel: 85,
      lastOnline: new Date(),
      temperature: 22,
      transactionsToday: 145,
      uptime: 99.8
    },
    {
      id: 'ATM-002',
      location: 'Airport Terminal A',
      address: '450 Airport Blvd, Newark, NJ 07114',
      status: 'warning',
      cashLevel: 15,
      lastOnline: new Date(),
      temperature: 24,
      transactionsToday: 289,
      uptime: 98.5
    },
    {
      id: 'ATM-003',
      location: 'Shopping Mall East',
      address: '789 Commerce Dr, Jersey City, NJ 07302',
      status: 'error',
      cashLevel: 45,
      lastOnline: new Date(Date.now() - 1000 * 60 * 15),
      temperature: 35,
      transactionsToday: 67,
      uptime: 95.2
    },
    {
      id: 'ATM-004',
      location: 'University Campus',
      address: '321 College Ave, New Brunswick, NJ 08901',
      status: 'online',
      cashLevel: 92,
      lastOnline: new Date(),
      temperature: 21,
      transactionsToday: 203,
      uptime: 99.9
    },
    {
      id: 'ATM-005',
      location: 'Train Station North',
      address: '555 Transit Way, Hoboken, NJ 07030',
      status: 'offline',
      cashLevel: 67,
      lastOnline: new Date(Date.now() - 1000 * 60 * 45),
      temperature: 0,
      transactionsToday: 0,
      uptime: 87.3
    },
    {
      id: 'ATM-006',
      location: 'Financial District',
      address: '101 Wall St, New York, NY 10005',
      status: 'online',
      cashLevel: 78,
      lastOnline: new Date(),
      temperature: 23,
      transactionsToday: 412,
      uptime: 99.5
    }
  ];
};

export const generateTechnicians = (): Technician[] => {
  return [
    {
      id: 'TECH-001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      assignedTickets: 2,
      available: true,
      location: 'New York, NY'
    },
    {
      id: 'TECH-002',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+1 (555) 234-5678',
      assignedTickets: 1,
      available: true,
      location: 'Newark, NJ'
    },
    {
      id: 'TECH-003',
      name: 'Mike Davis',
      email: 'mdavis@company.com',
      phone: '+1 (555) 345-6789',
      assignedTickets: 3,
      available: false,
      location: 'Jersey City, NJ'
    },
    {
      id: 'TECH-004',
      name: 'Emily Chen',
      email: 'emily.chen@company.com',
      phone: '+1 (555) 456-7890',
      assignedTickets: 0,
      available: true,
      location: 'Hoboken, NJ'
    }
  ];
};

export const anomalyDescriptions: Record<AnomalyType, (atmId: string) => string> = {
  cash_low: (id) => `ATM ${id} cash level critically low. Immediate refill required.`,
  hardware_failure: (id) => `Hardware malfunction detected in ATM ${id}. Bill dispenser not responding.`,
  network_issue: (id) => `Network connectivity lost for ATM ${id}. Unable to process transactions.`,
  card_reader_error: (id) => `Card reader malfunction in ATM ${id}. Customer cards being rejected.`,
  dispenser_jam: (id) => `Cash dispenser jam detected in ATM ${id}. Machine temporarily disabled.`,
  temperature_high: (id) => `Temperature exceeding safe limits in ATM ${id}. Risk of component damage.`,
  unauthorized_access: (id) => `Potential unauthorized access attempt detected at ATM ${id}.`
};

export const generateAnomaly = (atm: ATMachine): Anomaly | null => {
  const anomalies: Array<{ type: AnomalyType; condition: boolean; severity: TicketPriority }> = [
    { type: 'cash_low', condition: atm.cashLevel < 20, severity: 'high' },
    { type: 'network_issue', condition: atm.status === 'offline', severity: 'critical' },
    { type: 'temperature_high', condition: atm.temperature > 30, severity: 'medium' },
    { type: 'hardware_failure', condition: atm.status === 'error', severity: 'critical' }
  ];

  const detectedAnomaly = anomalies.find(a => a.condition);
  
  if (detectedAnomaly) {
    return {
      id: `ANO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      atmId: atm.id,
      type: detectedAnomaly.type,
      severity: detectedAnomaly.severity,
      detectedAt: new Date(),
      description: anomalyDescriptions[detectedAnomaly.type](atm.id),
      metadata: {
        cashLevel: atm.cashLevel,
        temperature: atm.temperature,
        status: atm.status,
        lastOnline: atm.lastOnline,
        transactionsToday: atm.transactionsToday
      }
    };
  }
  
  return null;
};

export const createTicketFromAnomaly = (anomaly: Anomaly, atm: ATMachine): Ticket => {
  const jsonPayload = {
    ticket: {
      id: `TKT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'ATM_MONITORING_SYSTEM',
      version: '1.0'
    },
    atm: {
      id: atm.id,
      location: atm.location,
      address: atm.address,
      coordinates: {
        latitude: 40.7128 + Math.random() * 0.1,
        longitude: -74.0060 + Math.random() * 0.1
      }
    },
    anomaly: {
      id: anomaly.id,
      type: anomaly.type,
      severity: anomaly.severity,
      detectedAt: anomaly.detectedAt.toISOString(),
      description: anomaly.description,
      metadata: anomaly.metadata
    },
    diagnostics: {
      cashLevel: atm.cashLevel,
      temperature: atm.temperature,
      uptime: atm.uptime,
      transactionsToday: atm.transactionsToday,
      lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
    },
    action_required: {
      priority: anomaly.severity,
      estimated_response_time: anomaly.severity === 'critical' ? '1 hour' : 
                               anomaly.severity === 'high' ? '4 hours' : 
                               anomaly.severity === 'medium' ? '24 hours' : '48 hours',
      required_parts: getRequiredParts(anomaly.type),
      estimated_duration: getEstimatedDuration(anomaly.type)
    }
  };

  return {
    id: jsonPayload.ticket.id,
    atmId: atm.id,
    atmLocation: atm.location,
    anomaly,
    status: 'open',
    priority: anomaly.severity,
    createdAt: new Date(),
    notes: [],
    jsonPayload
  };
};

const getRequiredParts = (type: AnomalyType): string[] => {
  const partsMap: Record<AnomalyType, string[]> = {
    cash_low: ['Cash cartridges'],
    hardware_failure: ['Bill dispenser unit', 'Replacement motors'],
    network_issue: ['Network cable', 'Router'],
    card_reader_error: ['Card reader module'],
    dispenser_jam: ['Cleaning kit', 'Bill separator'],
    temperature_high: ['Cooling fan', 'Thermal paste'],
    unauthorized_access: ['Security lock', 'Alarm system']
  };
  return partsMap[type] || [];
};

const getEstimatedDuration = (type: AnomalyType): string => {
  const durationMap: Record<AnomalyType, string> = {
    cash_low: '30 minutes',
    hardware_failure: '2-3 hours',
    network_issue: '1 hour',
    card_reader_error: '1.5 hours',
    dispenser_jam: '45 minutes',
    temperature_high: '1 hour',
    unauthorized_access: '2 hours'
  };
  return durationMap[type] || '1 hour';
};
