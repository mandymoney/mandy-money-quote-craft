import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, MessageCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateQuotePDF, generateOrderPDF, downloadPDF, createEmailSubject, createEmailBody } from '@/utils/pdfGenerator';
import { uploadPDFToStorage, generatePDFBlob } from '@/utils/pdfUpload';
import { supabase } from '@/integrations/supabase/client';
import { useFormValidation } from '@/hooks/useFormValidation';

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

  const showMissingFieldsToast = (actionType: 'quote' | 'order' | 'enquiry') => {
    const missingFields = [];
    
    if (actionType === 'quote') {
      if (!schoolInfo.schoolName) missingFields.push('School Name');
      if (!schoolInfo.coordinatorEmail || !/\S+@\S+\.\S+/.test(schoolInfo.coordinatorEmail)) missingFields.push('Valid Email');
    }
    
    if (actionType === 'enquiry') {
      if (!schoolInfo.schoolName) missingFields.push('School Name');
      if (!schoolInfo.coordinatorName) missingFields.push('Coordinator Name');
      if (!schoolInfo.coordinatorEmail || !/\S+@\S+\.\S+/.test(schoolInfo.coordinatorEmail)) missingFields.push('Valid Email');
    }
    
    if (actionType === 'order') {
      if (!schoolInfo.schoolName) missingFields.push('School Name');
      if (!schoolInfo.coordinatorName) missingFields.push('Coordinator Name');
      if (!schoolInfo.coordinatorEmail || !/\S+@\S+\.\S+/.test(schoolInfo.coordinatorEmail)) missingFields.push('Valid Email');
      if (!schoolInfo.contactPhone) missingFields.push('Contact Phone');
      if (!schoolInfo.schoolAddress.streetNumber || !schoolInfo.schoolAddress.streetName) missingFields.push('School Address');
      if (!schoolInfo.schoolAddress.suburb) missingFields.push('Suburb');
      if (!schoolInfo.schoolAddress.state) missingFields.push('State');
      if (!schoolInfo.schoolAddress.postcode) missingFields.push('Postcode');
    }
    
    if (missingFields.length > 0) {
      toast({
        title: `Missing Required Information for ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`,
        description: `Please complete: ${missingFields.join(', ')}`,
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
  };

  const validateBeforeSubmission = (actionType: 'quote' | 'order' | 'enquiry'): boolean => {
    return showMissingFieldsToast(actionType);
  };

  const showSuccessPopup = (actionType: 'enquiry' | 'order') => {
    // Create and show a modal-style popup
    const popup = document.createElement('div');
    popup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    `;
    
    popup.innerHTML = `
      <div style="
        background: white;
        padding: 3rem;
        border-radius: 1rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        max-width: 500px;
        margin: 2rem;
        text-align: center;
        position: relative;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        ">
          ✓
        </div>
        <h2 style="
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        ">${actionType === 'enquiry' ? 'Enquiry' : 'Order'} Prepared Successfully!</h2>
        <div style="
          background: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        ">
          <p style="
            font-weight: bold;
            color: #92400e;
            margin-bottom: 0.5rem;
          ">⚠️ IMPORTANT</p>
          <p style="
            color: #92400e;
            font-size: 0.9rem;
            line-height: 1.4;
          ">Your PDF must be emailed to <strong>hello@mandymoney.com.au</strong> for the ${actionType} to be received and processed.</p>
        </div>
        <button onclick="this.closest('div').remove()" style="
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
          Got it!
        </button>
      </div>
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(popup);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(popup)) {
        popup.remove();
      }
    }, 10000);
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

      console.log('Storing quote attempt:', quoteData);

      // Store in database
      const { error: dbError } = await supabase
        .from('quote_attempts')
        .insert([quoteData]);

      if (dbError) {
        console.error('Error storing quote attempt:', dbError);
        throw dbError;
      }

      console.log('Quote attempt stored successfully');

      // Send alert email
      try {
        const response = await supabase.functions.invoke('send-quote-alert', {
          body: { quoteData }
        });

        if (response.error) {
          console.error('Error sending alert email:', response.error);
        } else {
          console.log('Alert email sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending alert email:', emailError);
      }
    } catch (error) {
      console.error('Error in storeQuoteAttempt:', error);
      throw error;
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
      
      console.log('PDF generated and uploaded, URL:', pdfUrl);
    } catch (error) {
      console.error('Error generating/uploading PDF:', error);
    }
    
    // Store quote attempt with PDF URL
    await storeQuoteAttempt(type, pdfUrl || undefined);
    
    const subject = createEmailSubject(type, schoolInfo.schoolName);
    const body = createEmailBody(type, schoolInfo, pricing, teacherCount, studentCount, pdfUrl || undefined);
    
    const mailtoUrl = `mailto:hello@mandymoney.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoUrl, '_blank');
    
    // Show success popup
    showSuccessPopup(type);
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

  // Calculate potential savings (placeholder logic)
  const estimatedSavings = Math.floor(totalPrice * 0.1); // 10% example savings

  // Check completion status for different actions
  const isBasicComplete = isBasicInfoValid(schoolInfo);
  const isEssentialComplete = isEssentialInfoValid(schoolInfo);
  const isFullComplete = isFullInfoValid(schoolInfo);

  return (
    <div className="bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] rounded-lg p-8 text-center shadow-xl">
      <h2 className="text-white text-2xl font-bold mb-2">Ready to Get Started?</h2>
      <p className="text-white/90 mb-6">
        Lock in your ${totalPrice.toLocaleString()} price (including ${estimatedSavings.toLocaleString()} savings) today by exporting this quote or placing your order.
      </p>
      
      {/* Dynamic form completion messages */}
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
  );
};
