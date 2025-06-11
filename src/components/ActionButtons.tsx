import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, MessageCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateQuotePDF, generateOrderPDF, downloadPDF, createEmailSubject, createEmailBody } from '@/utils/pdfGenerator';
import { uploadPDFToStorage, generatePDFBlob } from '@/utils/pdfUpload';
import { supabase } from '@/integrations/supabase/client';
import { useFormValidation } from '@/hooks/useFormValidation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

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
  const { validateBasicInfo, validateEssentialInfo, validateFullInfo, isBasicInfoValid, isEssentialInfoValid, isFullInfoValid, errors } = useFormValidation();
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);

  const validateBeforeSubmission = (actionType: 'quote' | 'order' | 'enquiry'): boolean => {
    if (actionType === 'quote') {
      const isValid = validateBasicInfo(schoolInfo);
      if (!isValid) {
        toast({
          title: "Please Check Your Information",
          description: "Please correct any formatting errors in the form before generating a quote.",
          variant: "destructive",
        });
        
        // Show specific missing fields
        const missingFields = [];
        if (!schoolInfo.coordinatorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolInfo.coordinatorEmail)) {
          missingFields.push("Valid coordinator email");
        }
        
        if (missingFields.length > 0) {
          setTimeout(() => {
            toast({
              title: "Missing Information",
              description: `Please provide: ${missingFields.join(", ")}`,
              variant: "destructive",
            });
          }, 1000);
        }
        
        return false;
      }
      return true;
    }

    if (actionType === 'enquiry') {
      const isValid = validateEssentialInfo(schoolInfo);
      if (!isValid) {
        const missingFields = [];
        if (!schoolInfo.schoolName.trim()) missingFields.push("School name");
        if (!schoolInfo.coordinatorName.trim()) missingFields.push("Coordinator name");
        if (!schoolInfo.coordinatorEmail.trim()) missingFields.push("Coordinator email");
        
        toast({
          title: "Essential Information Required",
          description: `Please provide: ${missingFields.join(", ")} to make an enquiry.`,
          variant: "destructive",
        });
        
        const formSection = document.querySelector('[data-form-section]');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return false;
      }
      return true;
    }

    if (actionType === 'order') {
      const isValid = validateFullInfo(schoolInfo);
      if (!isValid) {
        const missingFields = [];
        if (!schoolInfo.schoolName.trim()) missingFields.push("School name");
        if (!schoolInfo.coordinatorName.trim()) missingFields.push("Coordinator name");
        if (!schoolInfo.coordinatorEmail.trim()) missingFields.push("Coordinator email");
        if (!schoolInfo.contactPhone.trim()) missingFields.push("Contact phone");
        
        const { streetNumber, streetName, suburb, state, postcode } = schoolInfo.schoolAddress;
        if (!streetNumber || !streetName || !suburb || !state || !postcode) {
          missingFields.push("Complete school address");
        }
        
        toast({
          title: "Complete Information Required",
          description: `Please provide: ${missingFields.join(", ")} to place an order.`,
          variant: "destructive",
        });
        
        const formSection = document.querySelector('[data-form-section]');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return false;
      }
      return true;
    }

    return false;
  };

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
        quote_items: quoteItems as any,
        pricing: pricing as any,
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
    
    const pdfBlob = generatePDFBlob(doc);
    const pdfUrl = await uploadPDFToStorage(pdfBlob, filename);
    
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
    
    const pdfBlob = generatePDFBlob(doc);
    const pdfUrl = await uploadPDFToStorage(pdfBlob, filename);
    
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
        const result = await generateAndUploadQuote();
        pdfUrl = result.pdfUrl;
      }
    } catch (error) {
      console.error('Error generating/uploading PDF:', error);
    }
    
    // Store quote attempt with PDF URL
    await storeQuoteAttempt(type, pdfUrl || undefined);
    
    const subject = createEmailSubject(type, schoolInfo.schoolName);
    const body = createEmailBody(type, schoolInfo, pricing, teacherCount, studentCount, pdfUrl || undefined);
    
    const mailtoUrl = `mailto:hello@mandymoney.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoUrl, '_blank');
    
    // Show success dialog
    setShowSuccessDialog(true);
  };

  const handleExportPDF = async () => {
    if (!validateBeforeSubmission('quote')) return;

    toast({
      title: "Generating PDF...",
      description: "Creating your quote document",
    });
    
    try {
      const result = await generateAndUploadQuote();
      
      await storeQuoteAttempt('quote', result.pdfUrl || undefined);
      
      toast({
        title: "Quote Generated!",
        description: "Your PDF quote has been generated, downloaded, and saved to our system.",
      });
    } catch (error) {
      console.error('Error generating quote:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateBeforeSubmission('order')) return;

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
      console.error('Error preparing order:', error);
      toast({
        title: "Error",
        description: "Failed to prepare order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBooklistingEnquiry = async () => {
    if (!validateBeforeSubmission('enquiry')) return;

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
      console.error('Error preparing enquiry:', error);
      toast({
        title: "Error",
        description: "Failed to prepare enquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!selectedTier) return null;

  const estimatedSavings = Math.floor(totalPrice * 0.1);
  const isBasicComplete = isBasicInfoValid(schoolInfo);
  const isEssentialComplete = isEssentialInfoValid(schoolInfo);
  const isFullComplete = isFullInfoValid(schoolInfo);

  return (
    <>
      <div className="bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] rounded-lg p-8 text-center shadow-xl">
        <h2 className="text-white text-2xl font-bold mb-2">Ready to Get Started?</h2>
        <p className="text-white/90 mb-6">
          Lock in your ${totalPrice.toLocaleString()} price (including ${estimatedSavings.toLocaleString()} savings) today by exporting this quote or placing your order.
        </p>
        
        {!isFullComplete && (
          <div className="mb-6 p-4 bg-white/20 rounded-lg border border-white/30">
            <div className="flex items-center justify-center space-x-2 text-white">
              <AlertTriangle className="h-5 w-5" />
              <div className="text-sm">
                <div className="font-medium">Complete your information below to proceed</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto">
          <Button
            onClick={handleExportPDF}
            size="lg"
            className="flex-1 font-semibold transition-all duration-300 hover:scale-105 shadow-lg border-0 hover:shadow-xl min-h-[3rem] bg-white hover:bg-gray-50 text-gray-800"
          >
            <FileText className="h-5 w-5 mr-2" />
            Export Quote as PDF
          </Button>
          
          <Button
            onClick={handleBooklistingEnquiry}
            size="lg"
            disabled={!isEssentialComplete}
            className={`flex-1 font-semibold transition-all duration-300 hover:scale-105 shadow-lg border-0 hover:shadow-xl min-h-[3rem] ${
              isEssentialComplete 
                ? 'bg-white hover:bg-gray-50 text-gray-800' 
                : 'bg-white/50 text-gray-500 cursor-not-allowed'
            }`}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Enquire about Booklisting
          </Button>
          
          <Button
            onClick={handlePlaceOrder}
            size="lg"
            disabled={!isFullComplete}
            className={`flex-1 font-bold transition-all duration-300 hover:scale-105 shadow-lg border-0 hover:shadow-xl min-h-[3rem] ${
              isFullComplete 
                ? 'bg-white hover:bg-gray-50 text-orange-600 hover:text-orange-700' 
                : 'bg-white/50 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="h-5 w-5 mr-2" />
            Place Order Now
          </Button>
        </div>
        
        <p className="text-white/80 text-sm mt-4">
          Questions? Contact our team at hello@mandymoney.com.au
        </p>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-green-600">
              📧 Email Ready!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              <div className="space-y-3">
                <p className="font-semibold">
                  Important: Your PDF must be emailed to 
                  <span className="text-orange-600"> hello@mandymoney.com.au</span> 
                  for the enquiry or order to be received.
                </p>
                <p className="text-sm text-gray-600">
                  We've opened your email client with the PDF link included. 
                  Please send the email to complete your submission.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction 
            onClick={() => setShowSuccessDialog(false)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Got it!
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
