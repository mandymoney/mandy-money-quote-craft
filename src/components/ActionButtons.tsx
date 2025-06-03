
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateQuotePDF, downloadPDF, createEmailSubject, createEmailBody } from '@/utils/pdfGenerator';

interface AddressComponents {
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

interface SchoolInfo {
  schoolName: string;
  schoolAddress: AddressComponents;
  schoolABN: string;
  contactPhone: string;
  deliveryAddress: AddressComponents;
  deliveryIsSameAsSchool: boolean;
  billingAddress: AddressComponents;
  billingIsSameAsSchool: boolean;
  accountsEmail: string;
  coordinatorEmail: string;
  coordinatorName: string;
  coordinatorPosition: string;
  purchaseOrderNumber: string;
  paymentPreference: string;
  supplierSetupForms: string;
  questionsComments: string;
}

interface QuoteItem {
  item: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
  type: string;
  description: string;
  savings?: number;
}

interface ActionButtonsProps {
  selectedTier: any;
  totalPrice: number;
  teacherCount: number;
  studentCount: number;
  schoolInfo: SchoolInfo;
  quoteItems: QuoteItem[];
  pricing: {
    subtotal: number;
    gst: number;
    total: number;
    shipping: number;
  };
  programStartDate: Date;
  isUnlimited?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedTier,
  totalPrice,
  teacherCount,
  studentCount,
  schoolInfo,
  quoteItems,
  pricing,
  programStartDate,
  isUnlimited = false
}) => {
  const generateAndDownloadPDF = () => {
    const doc = generateQuotePDF(
      schoolInfo,
      quoteItems,
      pricing,
      teacherCount,
      studentCount,
      programStartDate,
      isUnlimited
    );
    
    const filename = `MandyMoney_Quote_${schoolInfo.schoolName || 'School'}_${new Date().toISOString().split('T')[0]}.pdf`;
    downloadPDF(doc, filename);
    
    return doc;
  };

  const openEmailWithPDF = (type: 'enquiry' | 'order') => {
    const doc = generateAndDownloadPDF();
    
    const subject = createEmailSubject(type, schoolInfo.schoolName);
    const body = createEmailBody(type, schoolInfo, pricing, teacherCount, studentCount);
    
    const mailtoUrl = `mailto:hello@mandymoney.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoUrl, '_blank');
  };

  const handleExportPDF = () => {
    toast({
      title: "Generating PDF...",
      description: "Creating your quote document",
    });
    
    try {
      generateAndDownloadPDF();
      
      toast({
        title: "Quote Downloaded!",
        description: "Your PDF quote has been generated and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlaceOrder = () => {
    toast({
      title: "Preparing Order...",
      description: "Generating quote and setting up email",
    });
    
    try {
      openEmailWithPDF('order');
      
      toast({
        title: "Email Ready!",
        description: "Your quote has been downloaded and email opened for order placement.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBooklistingEnquiry = () => {
    toast({
      title: "Preparing Enquiry...",
      description: "Generating quote and setting up email",
    });
    
    try {
      openEmailWithPDF('enquiry');
      
      toast({
        title: "Email Ready!",
        description: "Your quote has been downloaded and email opened for booklisting enquiry.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare enquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!selectedTier) return null;

  // Calculate potential savings (placeholder logic)
  const estimatedSavings = Math.floor(totalPrice * 0.1); // 10% example savings

  return (
    <div className="bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] rounded-lg p-8 text-center shadow-xl">
      <h2 className="text-white text-2xl font-bold mb-2">Ready to Get Started?</h2>
      <p className="text-white/90 mb-6">
        Lock in your ${totalPrice.toLocaleString()} price (including ${estimatedSavings.toLocaleString()} savings) today by exporting this quote or placing your order.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto">
        <Button
          onClick={handleExportPDF}
          size="lg"
          className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-semibold transition-all duration-300 hover:scale-105 shadow-lg border-0 hover:shadow-xl min-h-[3rem]"
        >
          <FileText className="h-5 w-5 mr-2" />
          Export Quote as PDF
        </Button>
        
        <Button
          onClick={handleBooklistingEnquiry}
          size="lg"
          className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-semibold transition-all duration-300 hover:scale-105 shadow-lg border-0 hover:shadow-xl min-h-[3rem]"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Enquire about Booklisting
        </Button>
        
        <Button
          onClick={handlePlaceOrder}
          size="lg"
          className="flex-1 bg-white hover:bg-gray-50 text-orange-600 font-bold transition-all duration-300 hover:scale-105 shadow-lg border-0 hover:text-orange-700 hover:shadow-xl min-h-[3rem]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Place Order Now
        </Button>
      </div>
      
      <p className="text-white/80 text-sm mt-4">
        Questions? Contact our team at hello@mandymoney.com.au
      </p>
    </div>
  );
};
