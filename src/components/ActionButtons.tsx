
import React from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] rounded-lg p-8 text-center shadow-xl">
      <h2 className="text-white text-2xl font-bold mb-2">Ready to Get Started?</h2>
      <p className="text-white/90 mb-6">
        Your quote for {selectedTier.name} is ready at ${totalPrice.toLocaleString()} (inc. GST)
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <Button
          onClick={handleExportPDF}
          variant="secondary"
          size="lg"
          className="flex-1 bg-white/90 hover:bg-white text-orange-900 font-semibold transition-all duration-200 hover:scale-105"
        >
          <FileText className="h-5 w-5 mr-2" />
          Export Quote as PDF
        </Button>
        
        <Button
          onClick={handlePlaceOrder}
          size="lg"
          className="flex-1 bg-white text-orange-600 hover:bg-gray-100 font-bold transition-all duration-200 hover:scale-110 shadow-lg border-2 border-white text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          + PLACE ORDER NOW
        </Button>
      </div>
      
      <p className="text-white/80 text-sm mt-4">
        Questions? Contact our team at hello@mandymoney.com.au
      </p>
    </div>
  );
};
