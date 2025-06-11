
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProgramStartDateProps {
  startDate: Date;
  onStartDateChange: (date: Date) => void;
  endDate: Date;
}

export const ProgramStartDate: React.FC<ProgramStartDateProps> = ({
  startDate,
  onStartDateChange,
  endDate
}) => {
  return (
    <Card className="mb-8 p-6 bg-white border border-gray-200">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Program Start Date
        </h3>
        
        <div className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-64 justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && onStartDateChange(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-orange-800">
              <p className="font-semibold mb-1">12 Month Access Period</p>
              <p className="text-sm">
                Program starts: <span className="font-medium">{format(startDate, 'PPP')}</span>
              </p>
              <p className="text-sm">
                Access ends: <span className="font-medium">{format(endDate, 'PPP')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
