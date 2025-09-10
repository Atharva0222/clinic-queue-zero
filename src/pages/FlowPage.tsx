import React from 'react';
import FlowChart from '@/components/FlowChart';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FlowPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const svg = document.querySelector('#flowchart svg');
    if (svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'healthcare-system-flow.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Flow Chart
          </Button>
        </div>
        
        <FlowChart />
        
        <div className="mt-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Experience</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Secure login & personalized dashboard</li>
                <li>• Browse doctors with ratings & availability</li>
                <li>• Real-time appointment scheduling</li>
                <li>• Live queue position tracking</li>
                <li>• Complete appointment history</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Doctor Workflow</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Daily schedule overview</li>
                <li>• Real-time status management</li>
                <li>• Sequential patient queue</li>
                <li>• Consultation controls</li>
                <li>• Patient record updates</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Compounder Operations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Monitor all queues centrally</li>
                <li>• Manage patient flow</li>
                <li>• Send automated notifications</li>
                <li>• Coordinate doctor schedules</li>
                <li>• Real-time analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowPage;