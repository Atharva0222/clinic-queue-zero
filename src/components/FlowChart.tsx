import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FlowChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      }
    });

    if (chartRef.current) {
      const chartDefinition = `
        graph TD
            A[Patient Opens App] --> B{User Authentication}
            B --> C[Patient Dashboard]
            B --> D[Doctor Dashboard]
            B --> E[Compounder Dashboard]
            
            subgraph "Patient Journey"
                C --> F[View Available Doctors]
                F --> G[Select Doctor & Time Slot]
                G --> H[Book Appointment]
                H --> I[Join Queue]
                I --> J[Receive Wait Time Updates]
                J --> K[Get Called for Consultation]
                K --> L[Consultation Complete]
            end
            
            subgraph "Doctor Journey"
                D --> M[View Today's Schedule]
                M --> N[See Patient Queue]
                N --> O[Update Status Available/Busy/Away]
                O --> P[Start Patient Consultation]
                P --> Q[Mark Consultation In-Progress]
                Q --> R[Complete Consultation]
                R --> S[Update Patient Records]
            end
            
            subgraph "Compounder Journey"
                E --> T[Monitor All Queues]
                T --> U[Track Doctor Availability]
                U --> V[Manage Patient Flow]
                V --> W[Send Notifications to Patients]
                W --> X[Update Queue Status]
                X --> Y[Coordinate Between Doctors & Patients]
            end
            
            I --> T
            P --> T
            W --> J
      `;

      mermaid.render('flowchart', chartDefinition).then((result) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = result.svg;
        }
      });
    }
  }, []);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Healthcare Management System Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full overflow-x-auto" />
      </CardContent>
    </Card>
  );
};

export default FlowChart;