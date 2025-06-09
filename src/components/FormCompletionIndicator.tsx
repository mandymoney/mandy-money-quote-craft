
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, User, Building, Phone, Mail, MapPin } from 'lucide-react';

interface SchoolInfo {
  schoolName: string;
  schoolAddress: {
    streetNumber: string;
    streetName: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
  };
  coordinatorName: string;
  coordinatorEmail: string;
  contactPhone: string;
}

interface FormCompletionIndicatorProps {
  schoolInfo: SchoolInfo;
  isComplete: boolean;
}

export const FormCompletionIndicator: React.FC<FormCompletionIndicatorProps> = ({
  schoolInfo,
  isComplete
}) => {
  const requirements = [
    {
      id: 'schoolName',
      label: 'School Name',
      icon: Building,
      completed: !!schoolInfo.schoolName.trim()
    },
    {
      id: 'schoolAddress',
      label: 'School Address',
      icon: MapPin,
      completed: !!(schoolInfo.schoolAddress.streetNumber && 
                    schoolInfo.schoolAddress.streetName && 
                    schoolInfo.schoolAddress.suburb && 
                    schoolInfo.schoolAddress.state && 
                    schoolInfo.schoolAddress.postcode)
    },
    {
      id: 'coordinatorName',
      label: 'Coordinator Name',
      icon: User,
      completed: !!schoolInfo.coordinatorName.trim()
    },
    {
      id: 'coordinatorEmail',
      label: 'Coordinator Email',
      icon: Mail,
      completed: !!schoolInfo.coordinatorEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolInfo.coordinatorEmail)
    },
    {
      id: 'contactPhone',
      label: 'Contact Phone',
      icon: Phone,
      completed: !!schoolInfo.contactPhone.trim()
    }
  ];

  const completedCount = requirements.filter(req => req.completed).length;
  const completionPercentage = (completedCount / requirements.length) * 100;

  return (
    <Card className={`p-4 border-2 transition-all duration-300 ${
      isComplete 
        ? 'border-green-300 bg-green-50' 
        : 'border-orange-300 bg-orange-50'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
          <h4 className="font-semibold text-gray-800">
            Form Completion ({completedCount}/{requirements.length})
          </h4>
        </div>
        <Badge variant={isComplete ? "default" : "secondary"} className={
          isComplete ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
        }>
          {Math.round(completionPercentage)}%
        </Badge>
      </div>
      
      <div className="space-y-2">
        {requirements.map((req) => {
          const IconComponent = req.icon;
          return (
            <div key={req.id} className="flex items-center space-x-2 text-sm">
              <IconComponent className={`h-4 w-4 ${
                req.completed ? 'text-green-600' : 'text-gray-400'
              }`} />
              <span className={req.completed ? 'text-green-700' : 'text-gray-600'}>
                {req.label}
              </span>
              {req.completed && <CheckCircle className="h-3 w-3 text-green-600 ml-auto" />}
            </div>
          );
        })}
      </div>
      
      {!isComplete && (
        <div className="mt-3 text-xs text-orange-700">
          Please complete all required fields before placing an order or generating a quote.
        </div>
      )}
    </Card>
  );
};
