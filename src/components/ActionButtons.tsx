
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  selectedTier: any;
  totalPrice: number;
  teacherCount: number;
  studentCount: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedTier,
  totalPrice,
  teacherCount,
  studentCount
}) => {
  const handleExportPDF = () => {
    toast({
      title: "PDF Export Started",
      description: `Generating quote for ${selectedTier?.name} - $${totalPrice.toLocaleString()} (inc. GST)`,
    });
    
    setTimeout(() => {
      toast({
        title: "Quote Ready!",
        description: "Your PDF quote has been generated and is ready for download.",
      });
    }, 2000);
  };

  const handlePlaceOrder = () => {
    toast({
      title: "Redirecting to Order",
      description: `Processing order for ${teacherCount} teacher${teacherCount > 1 ? 's' : ''} and ${studentCount} student${studentCount > 1 ? 's' : ''}`,
    });
    
    setTimeout(() => {
      toast({
        title: "Order Initiated",
        description: "You'll be redirected to the secure checkout page.",
      });
    }, 1500);
  };

  if (!selectedTier) return null;

  return (
    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-2xl animate-scale-in">
      <div className="p-8 text-center">
        <h2 className="text-white text-2xl font-bold mb-2">Ready to Get Started?</h2>
        <p className="text-white/90 mb-6">
          Your quote for {selectedTier.name} is ready at ${totalPrice.toLocaleString()} (inc. GST)
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button
            onClick={handleExportPDF}
            variant="secondary"
            size="lg"
            className="flex-1 bg-white/90 hover:bg-white text-gray-900 font-semibold transition-all duration-200 hover:scale-105"
          >
            <FileText className="h-5 w-5 mr-2" />
            Export Quote as PDF
          </Button>
          
          <Button
            onClick={handlePlaceOrder}
            size="lg"
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Place Order Now
          </Button>
        </div>
        
        <p className="text-white/80 text-sm mt-4">
          Questions? Contact our team at hello@mandymoney.com.au
        </p>
      </div>
    </Card>
  );
};
