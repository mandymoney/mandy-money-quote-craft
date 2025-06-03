import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateQuotePDF, generateOrderPDF, downloadPDF, createEmailSubject, createEmailBody } from '@/utils/pdfGenerator';
import { uploadPDFToStorage, generatePDFBlob } from '@/utils/pdfUpload';
import { supabase } from '@/integrations/supabase/client';

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
  const storeQuoteAttempt = async (type: 'quote' | 'order' | 'enquiry', pdfUrl?: string) => {
    try {
      const quoteData = {
        school_name: schoolInfo.schoolName || null,
        school_abn: schoolInfo.schoolABN || null,
        coordinator_name: schoolInfo.coordinatorName || null,
        coordinator_email: schoolInfo.coordinatorEmail || null,
        contact_phone: schoolInfo.contactPhone || null,
        teacher_count: teacherCount,
        student_count: studentCount,
        total_price: pricing.total,
        program_start_date: programStartDate.toISOString().split('T')[0],
        quote_items: quoteItems as any, // Cast to any to satisfy Json type
        pricing: pricing as any, // Cast to any to satisfy Json type
        pdf_url: pdfUrl || null,
        attempt_type: type
      };

      // Store in database
      const { error: dbError } = await supabase
        .from('quote_attempts')
        .insert([quoteData]);

      if (dbError) {
        console.error('Error storing quote attempt:', dbError);
      }

      // Send alert email
      try {
        const response = await fetch('/functions/v1/send-quote-alert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quoteData }),
        });

        if (!response.ok) {
          console.error('Error sending alert email:', response.statusText);
        }
      } catch (emailError) {
        console.error('Error sending alert email:', emailError);
      }
    } catch (error) {
      console.error('Error in storeQuoteAttempt:', error);
    }
  };

  const generateAndUploadQuote = async () => {
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
    
    // Generate blob and upload to storage
    const pdfBlob = generatePDFBlob(doc);
    const pdfUrl = await uploadPDFToStorage(pdfBlob, filename);
    
    // Also download locally
    downloadPDF(doc, filename);
    
    return { doc, pdfUrl };
  };

  const generateAndUploadOrder = async () => {
    const doc = generateOrderPDF(
      schoolInfo,
      quoteItems,
      pricing,
      teacherCount,
      studentCount,
      programStartDate,
      isUnlimited
    );
    
    const filename = `MandyMoney_Order_${schoolInfo.schoolName || 'School'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Generate blob and upload to storage
    const pdfBlob = generatePDFBlob(doc);
    const pdfUrl = await uploadPDFToStorage(pdfBlob, filename);
    
    // Also download locally
    downloadPDF(doc, filename);
    
    return { doc, pdfUrl };
  };

  const openEmailWithPDF = async (type: 'enquiry' | 'order') => {
    let pdfUrl: string | null = null;
    
    try {
      if (type === 'order') {
        const result = await generateAndUploadOrder();
        pdfUrl = result.pdfUrl;
      } else {
        // For enquiry, generate and upload quote
        const result = await generateAndUploadQuote();
        pdfUrl = result.pdfUrl;
      }
    } catch (error) {
      console.error('Error generating/uploading PDF:', error);
    }
    
    // Store quote attempt
    await storeQuoteAttempt(type, pdfUrl || undefined);
    
    const subject = createEmailSubject(type, schoolInfo.schoolName);
    const body = createEmailBody(type, schoolInfo, pricing, teacherCount, studentCount, pdfUrl || undefined);
    
    const mailtoUrl = `mailto:hello@mandymoney.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoUrl, '_blank');
  };

  const handleExportPDF = async () => {
    toast({
      title: "Generating PDF...",
      description: "Creating your quote document",
    });
    
    try {
      const result = await generateAndUploadQuote();
      
      // Store quote attempt
      await storeQuoteAttempt('quote', result.pdfUrl || undefined);
      
      toast({
        title: "Quote Generated!",
        description: "Your PDF quote has been generated, downloaded, and saved to our system.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlaceOrder = async () => {
    toast({
      title: "Preparing Order...",
      description: "Generating order document and setting up email",
    });
    
    try {
      await openEmailWithPDF('order');
      
      toast({
        title: "Email Ready!",
        description: "Your order document has been generated and email opened with the PDF link included.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBooklistingEnquiry = async () => {
    toast({
      title: "Preparing Enquiry...",
      description: "Generating quote and setting up email with PDF link",
    });
    
    try {
      await openEmailWithPDF('enquiry');
      
      toast({
        title: "Email Ready!",
        description: "Your enquiry email has been opened with the quote PDF link included.",
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
