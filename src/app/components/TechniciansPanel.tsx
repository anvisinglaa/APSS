import React from 'react';
import { Technician } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';

interface TechniciansPanelProps {
  technicians: Technician[];
}

export function TechniciansPanel({ technicians }: TechniciansPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Available Technicians</h3>
        <p className="text-sm text-muted-foreground">
          {technicians.filter(t => t.available).length} of {technicians.length} available
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {technicians.map(tech => (
          <Card key={tech.id} className={tech.available ? '' : 'opacity-60'}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="size-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{tech.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{tech.id}</p>
                  </div>
                </div>
                <Badge variant={tech.available ? 'default' : 'secondary'}>
                  {tech.available ? 'Available' : 'Busy'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">{tech.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">{tech.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">{tech.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm pt-2 border-t">
                <Briefcase className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {tech.assignedTickets} active {tech.assignedTickets === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
