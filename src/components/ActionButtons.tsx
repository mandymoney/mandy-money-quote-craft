import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, MessageCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { generateQuotePDF, generateOrderPDF, downloadPDF, createEmailSubject, createEmailBody } from '@/utils/pdfGenerator';
import { uploadPDFToStorage, generatePDFBlob } from '@/utils/pdfUpload';
import { supabase } from '@/integrations/supabase/client';
import { useFormValidation } from '@/hooks/useFormValidation';
import { SuccessPopup } from './SuccessPopup';

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
  titleOverride?: string;
  descriptionOverride?: string;
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
  isUnlimited = false,
  titleOverride,
  descriptionOverride
}) => {
  const { validateBasicInfo, validateEssentialInfo, validateFullInfo, isBasicInfoValid, isEssentialInfoValid, isFullInfoValid, errors } = useFormValidation();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupType, setSuccessPopupType] = useState<'enquiry' | 'order'>('enquiry');

  const validateBeforeSubmission = (actionType: 'quote' | 'order' | 'enquiry'): boolean => {
    if (actionType === 'quote') {
      // For quotes, validation is optional - just check for basic formatting
      const isValid = validateBasicInfo(schoolInfo);
      if (!isValid) {
        toast({
          title: "Please Check Your Information",
          description: "Please correct any formatting errors in the form.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }

    if (actionType === 'enquiry') {
      // For enquiries, need school name, coordinator name, and email
      const isValid = validateEssentialInfo(schoolInfo);
      if (!isValid) {
        toast({
          title: "Essential Information Required",
          description: "Please provide school name, coordinator name, and email to make an enquiry.",
          variant: "destructive",
        });
        
        // Scroll to the form section
        const formSection = document.querySelector('[data-form-section]');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return false;
      }
      return true;
    }

    if (actionType === 'order') {
      // For orders, need complete information
      const isValid = validateFullInfo(schoolInfo);
      if (!isValid) {
        toast({
          title: "Complete Information Required",
          description: "Please complete all required fields to place an order.",
          variant: "destructive",
        });
        
        // Scroll to the form section
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
        toast({
          title: "Database Error",
          description: "Failed to store quote attempt. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Quote attempt stored successfully');
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
      console.log(`Starting ${type} process...`);
      
      if (type === 'order') {
        const result = await generateAndUploadOrder();
        pdfUrl = result.pdfUrl;
      } else {
        // For enquiry, generate and upload quote
        const result = await generateAndUploadQuote();
        pdfUrl = result.pdfUrl;
      }

      console.log('PDF upload result:', pdfUrl);

      // Continue even if PDF upload fails - user can still send the locally downloaded PDF
      if (!pdfUrl) {
        console.warn('PDF upload failed, but continuing with email generation');
        toast({
          title: "PDF Upload Warning",
          description: "PDF was downloaded locally but cloud storage failed. Please attach the downloaded PDF to your email.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error generating/uploading PDF:', error);
      toast({
        title: "PDF Generation Error",
        description: "There was an issue with PDF generation. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    // Store quote attempt with PDF URL (even if null)
    await storeQuoteAttempt(type, pdfUrl || undefined);
    
    const subject = createEmailSubject(type, schoolInfo.schoolName);
    const body = createEmailBody(type, schoolInfo, pricing, teacherCount, studentCount, pdfUrl);
    
    console.log('Opening email with subject:', subject);
    console.log('Email body length:', body.length);
    
    const mailtoUrl = `mailto:hello@mandymoney.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open the email client
    window.open(mailtoUrl, '_blank');
    
    // Show success popup - this should always happen
    console.log('Showing success popup for type:', type);
    setSuccessPopupType(type);
    setShowSuccessPopup(true);
  };

  const handleExportPDF = async () => {
    if (!validateBeforeSubmission('quote')) return;

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
      
      console.log('Order process completed successfully');
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
      
      console.log('Enquiry process completed successfully');
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

  // Calculate potential savings (placeholder logic)
  const estimatedSavings = Math.floor(totalPrice * 0.1); // 10% example savings

  // Check completion status for different actions
  const isBasicComplete = isBasicInfoValid(schoolInfo);
  const isEssentialComplete = isEssentialInfoValid(schoolInfo);
  const isFullComplete = isFullInfoValid(schoolInfo);

  // Helper function to get missing info for tooltips
  const getMissingInfo = (level: 'essential' | 'full') => {
    const missing: string[] = [];
    
    if (!schoolInfo.schoolName.trim()) missing.push('School name');
    if (!schoolInfo.coordinatorName.trim()) missing.push('Coordinator name');
    if (!schoolInfo.coordinatorEmail.trim()) missing.push('Coordinator email');
    
    if (level === 'full') {
      if (!schoolInfo.contactPhone.trim()) missing.push('Contact phone');
      const { streetNumber, streetName, suburb, state, postcode } = schoolInfo.schoolAddress;
      if (!streetNumber || !streetName || !suburb || !state || !postcode) {
        missing.push('Complete school address');
      }
    }
    
    return missing;
  };

  // Use override values if provided, otherwise use defaults
  const title = titleOverride || "Ready to Get Started?";
  const description = descriptionOverride || `Lock in your $${totalPrice.toLocaleString()} price (including $${estimatedSavings.toLocaleString()} savings) today by exporting this quote or placing your order.`;

  return (
    <TooltipProvider>
      <div className="bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] rounded-lg p-8 text-center shadow-xl">
        <h2 className="text-white text-2xl font-bold mb-2">{title}</h2>
        <p className="text-white/90 mb-6">
          {description}
        </p>
        
        {/* Dynamic form completion messages */}
        {!isFullComplete && (
          <div className="mb-6 p-4 bg-white/20 rounded-lg border border-white/30">
            <div className="flex items-center justify-center space-x-2 text-white">
              <AlertTriangle className="h-5 w-5" />
              <div className="text-sm">
                <div className="font-medium">Complete your information above to proceed</div>
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
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex-1">
                <Button
                  onClick={handleBooklistingEnquiry}
                  size="lg"
                  disabled={!isEssentialComplete}
                  className={`w-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg border-0 hover:shadow-xl min-h-[3rem] ${
                    isEssentialComplete 
                      ? 'bg-white hover:bg-gray-50 text-gray-800' 
                      : 'bg-white/50 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Enquire about Booklisting
                </Button>
              </div>
            </TooltipTrigger>
            {!isEssentialComplete && (
              <TooltipContent>
                <p>Missing: {getMissingInfo('essential').join(', ')}</p>
              </TooltipContent>
            )}
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex-1">
                <Button
                  onClick={handlePlaceOrder}
                  size="lg"
                  disabled={!isFullComplete}
                  className={`w-full font-bold transition-all duration-300 hover:scale-105 shadow-lg border-0 hover:shadow-xl min-h-[3rem] ${
                    isFullComplete 
                      ? 'bg-white hover:bg-gray-50 text-orange-600 hover:text-orange-700' 
                      : 'bg-white/50 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Place Order Now
                </Button>
              </div>
            </TooltipTrigger>
            {!isFullComplete && (
              <TooltipContent>
                <p>Missing: {getMissingInfo('full').join(', ')}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
        
        <p className="text-white/80 text-sm mt-4">
          Questions? Contact our team at hello@mandymoney.com.au
        </p>
      </div>

      <SuccessPopup 
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        type={successPopupType}
      />
    </TooltipProvider>
  );
};
