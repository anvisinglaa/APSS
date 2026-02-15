import React, { useState } from 'react';
import { Ticket, Technician, TicketStatus } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Clock, 
  MapPin, 
  User, 
  AlertCircle,
  Code,
  CheckCircle2,
  XCircle,
  Timer,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';

interface TicketCardProps {
  ticket: Ticket;
  technicians: Technician[];
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
}

export function TicketCard({ ticket, technicians, onUpdateTicket }: TicketCardProps) {
  const [showJSON, setShowJSON] = useState(false);
  const [newNote, setNewNote] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'assigned': return 'secondary';
      case 'in_progress': return 'default';
      case 'resolved': return 'outline';
      case 'closed': return 'outline';
      default: return 'default';
    }
  };

  const handleAssignTechnician = (technicianId: string) => {
    const technician = technicians.find(t => t.id === technicianId);
    onUpdateTicket(ticket.id, {
      assignedTo: technicianId,
      status: 'assigned'
    });
    toast.success(`Ticket assigned to ${technician?.name}`);
  };

  const handleStatusChange = (status: TicketStatus) => {
    onUpdateTicket(ticket.id, {
      status,
      ...(status === 'resolved' || status === 'closed' ? { resolvedAt: new Date() } : {})
    });
    toast.success(`Ticket status updated to ${status}`);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    onUpdateTicket(ticket.id, {
      notes: [...ticket.notes, `${new Date().toLocaleString()}: ${newNote}`]
    });
    setNewNote('');
    toast.success('Note added to ticket');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{ticket.id}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="size-3" />
              {ticket.atmLocation} ({ticket.atmId})
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={getPriorityColor(ticket.priority)}>
              {ticket.priority.toUpperCase()}
            </Badge>
            <Badge variant={getStatusColor(ticket.status)}>
              {ticket.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Anomaly Information */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{ticket.anomaly.type.replace('_', ' ').toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">{ticket.anomaly.description}</p>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          <span>Created: {formatDate(ticket.createdAt)}</span>
        </div>

        {/* Action Required Info */}
        {ticket.jsonPayload.action_required && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Timer className="size-4 text-blue-600" />
              <span className="font-medium">Response Time:</span>
              <span>{ticket.jsonPayload.action_required.estimated_response_time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="size-4 text-blue-600" />
              <span className="font-medium">Duration:</span>
              <span>{ticket.jsonPayload.action_required.estimated_duration}</span>
            </div>
            {ticket.jsonPayload.action_required.required_parts.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Required Parts:</span>
                <ul className="ml-4 mt-1 list-disc">
                  {ticket.jsonPayload.action_required.required_parts.map((part: string, idx: number) => (
                    <li key={idx}>{part}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Technician Assignment */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="size-4" />
            Assign Technician
          </label>
          <Select 
            value={ticket.assignedTo || ''} 
            onValueChange={handleAssignTechnician}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map(tech => (
                <SelectItem key={tech.id} value={tech.id} disabled={!tech.available}>
                  {tech.name} {!tech.available && '(Unavailable)'}
                  {tech.assignedTickets > 0 && ` - ${tech.assignedTickets} tickets`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Update */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Update Status</label>
          <Select 
            value={ticket.status} 
            onValueChange={(value) => handleStatusChange(value as TicketStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        {ticket.notes.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Notes:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {ticket.notes.map((note, idx) => (
                <p key={idx} className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Add Note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
          />
          <Button onClick={handleAddNote} size="sm" disabled={!newNote.trim()}>
            Add Note
          </Button>
        </div>

        {/* JSON Payload Viewer */}
        <div className="border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowJSON(!showJSON)}
            className="w-full"
          >
            <Code className="size-4 mr-2" />
            {showJSON ? 'Hide' : 'View'} JSON Payload
          </Button>
          
          {showJSON && (
            <div className="mt-4">
              <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(ticket.jsonPayload, null, 2)}
              </pre>
              <Button
                variant="secondary"
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(ticket.jsonPayload, null, 2));
                  toast.success('JSON copied to clipboard');
                }}
              >
                Copy JSON
              </Button>
            </div>
          )}
        </div>

        {/* Resolution Info */}
        {ticket.resolvedAt && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Resolved</p>
              <p className="text-xs text-green-700">{formatDate(ticket.resolvedAt)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
