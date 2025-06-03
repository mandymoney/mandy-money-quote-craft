
import jsPDF from 'jspdf';

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

interface PricingDetails {
  subtotal: number;
  gst: number;
  total: number;
  shipping: number;
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

const formatAddress = (address: AddressComponents): string => {
  const parts = [
    address.streetNumber,
    address.streetName,
    address.suburb,
    address.state,
    address.postcode
  ].filter(Boolean);
  return parts.join(' ');
};

export const generateQuotePDF = (
  schoolInfo: SchoolInfo,
  quoteItems: QuoteItem[],
  pricing: PricingDetails,
  teacherCount: number,
  studentCount: number,
  programStartDate: Date,
  isUnlimited: boolean = false
): jsPDF => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Mandy Money High School Program Quote', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quote Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  doc.text(`Valid Until: 31st December, ${new Date().getFullYear()}`, 120, yPosition);
  yPosition += 20;
  
  // School Information
  if (schoolInfo.schoolName) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('School Information', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (schoolInfo.schoolName) {
      doc.text(`School Name: ${schoolInfo.schoolName}`, 20, yPosition);
      yPosition += 6;
    }
    
    if (formatAddress(schoolInfo.schoolAddress)) {
      doc.text(`Address: ${formatAddress(schoolInfo.schoolAddress)}`, 20, yPosition);
      yPosition += 6;
    }
    
    if (schoolInfo.schoolABN) {
      doc.text(`ABN: ${schoolInfo.schoolABN}`, 20, yPosition);
      yPosition += 6;
    }
    
    if (schoolInfo.coordinatorName) {
      doc.text(`Coordinator: ${schoolInfo.coordinatorName}`, 20, yPosition);
      if (schoolInfo.coordinatorPosition) {
        doc.text(` (${schoolInfo.coordinatorPosition})`, 80, yPosition);
      }
      yPosition += 6;
    }
    
    if (schoolInfo.coordinatorEmail) {
      doc.text(`Email: ${schoolInfo.coordinatorEmail}`, 20, yPosition);
      yPosition += 6;
    }
    
    if (schoolInfo.contactPhone) {
      doc.text(`Phone: ${schoolInfo.contactPhone}`, 20, yPosition);
      yPosition += 6;
    }
    
    yPosition += 10;
  }
  
  // Program Details
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Program Details', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Program Start: ${programStartDate.toLocaleDateString()}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Access Period: 12 months`, 20, yPosition);
  yPosition += 6;
  doc.text(`Teachers: ${teacherCount}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Students: ${studentCount}`, 20, yPosition);
  yPosition += 15;
  
  // Quote Items
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Quote Breakdown', 20, yPosition);
  yPosition += 10;
  
  // Table headers
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 20, yPosition);
  doc.text('Qty', 80, yPosition);
  doc.text('Unit Price', 100, yPosition);
  doc.text('Total', 140, yPosition);
  yPosition += 8;
  
  // Draw line under headers
  doc.line(20, yPosition - 2, 180, yPosition - 2);
  yPosition += 2;
  
  // Quote items
  doc.setFont('helvetica', 'normal');
  quoteItems.forEach(item => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(item.item.substring(0, 30), 20, yPosition);
    doc.text(item.count.toString(), 80, yPosition);
    doc.text(`$${item.unitPrice.toLocaleString()}`, 100, yPosition);
    doc.text(`$${item.totalPrice.toLocaleString()}`, 140, yPosition);
    
    if (item.savings && item.savings > 0) {
      doc.setFont('helvetica', 'italic');
      doc.text(`(Save $${item.savings.toFixed(0)} each)`, 145, yPosition + 4);
      doc.setFont('helvetica', 'normal');
      yPosition += 4;
    }
    
    yPosition += 8;
  });
  
  yPosition += 10;
  
  // Totals
  doc.line(100, yPosition - 5, 180, yPosition - 5);
  
  doc.text(`Subtotal (exc. GST): $${pricing.subtotal.toFixed(2)}`, 100, yPosition);
  yPosition += 6;
  doc.text(`GST (10%): $${pricing.gst.toFixed(2)}`, 100, yPosition);
  yPosition += 6;
  
  if (pricing.shipping > 0) {
    doc.text(`Shipping: $${pricing.shipping}`, 100, yPosition);
    yPosition += 6;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: $${pricing.total.toLocaleString()}`, 100, yPosition);
  
  // Footer
  yPosition += 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Contact: hello@mandymoney.com.au | www.mandymoney.com.au', 20, yPosition);
  
  return doc;
};

export const generateOrderPDF = (
  schoolInfo: SchoolInfo,
  quoteItems: QuoteItem[],
  pricing: PricingDetails,
  teacherCount: number,
  studentCount: number,
  programStartDate: Date,
  isUnlimited: boolean = false
): jsPDF => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Mandy Money High School Program Order', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  doc.text(`Program Start: ${programStartDate.toLocaleDateString()}`, 120, yPosition);
  yPosition += 20;
  
  // School Information
  if (schoolInfo.schoolName) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('School Information', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (schoolInfo.schoolName) {
      doc.text(`School Name: ${schoolInfo.schoolName}`, 20, yPosition);
      yPosition += 6;
    }
    
    if (formatAddress(schoolInfo.schoolAddress)) {
      doc.text(`Address: ${formatAddress(schoolInfo.schoolAddress)}`, 20, yPosition);
      yPosition += 6;
    }
    
    if (schoolInfo.schoolABN) {
      doc.text(`ABN: ${schoolInfo.schoolABN}`, 20, yPosition);
      yPosition += 6;
    }
    
    if (schoolInfo.coordinatorName) {
      doc.text(`Coordinator: ${schoolInfo.coordinatorName}`, 20, yPosition);
      if (schoolInfo.coordinatorPosition) {
        doc.text(` (${schoolInfo.coordinatorPosition})`, 80, yPosition);
      }
      yPosition += 6;
    }
    
    if (schoolInfo.coordinatorEmail) {
      doc.text(`Email: ${schoolInfo.coordinatorEmail}`, 20, yPosition);
      yPosition += 6;
    }
    
    if (schoolInfo.contactPhone) {
      doc.text(`Phone: ${schoolInfo.contactPhone}`, 20, yPosition);
      yPosition += 6;
    }
    
    yPosition += 10;
  }
  
  // Program Details
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Details', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Program Start: ${programStartDate.toLocaleDateString()}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Access Period: 12 months`, 20, yPosition);
  yPosition += 6;
  doc.text(`Teachers: ${teacherCount}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Students: ${studentCount}`, 20, yPosition);
  yPosition += 15;
  
  // Order Items
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Breakdown', 20, yPosition);
  yPosition += 10;
  
  // Table headers
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 20, yPosition);
  doc.text('Qty', 80, yPosition);
  doc.text('Unit Price', 100, yPosition);
  doc.text('Total', 140, yPosition);
  yPosition += 8;
  
  // Draw line under headers
  doc.line(20, yPosition - 2, 180, yPosition - 2);
  yPosition += 2;
  
  // Order items
  doc.setFont('helvetica', 'normal');
  quoteItems.forEach(item => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(item.item.substring(0, 30), 20, yPosition);
    doc.text(item.count.toString(), 80, yPosition);
    doc.text(`$${item.unitPrice.toLocaleString()}`, 100, yPosition);
    doc.text(`$${item.totalPrice.toLocaleString()}`, 140, yPosition);
    
    if (item.savings && item.savings > 0) {
      doc.setFont('helvetica', 'italic');
      doc.text(`(Save $${item.savings.toFixed(0)} each)`, 145, yPosition + 4);
      doc.setFont('helvetica', 'normal');
      yPosition += 4;
    }
    
    yPosition += 8;
  });
  
  yPosition += 10;
  
  // Totals
  doc.line(100, yPosition - 5, 180, yPosition - 5);
  
  doc.text(`Subtotal (exc. GST): $${pricing.subtotal.toFixed(2)}`, 100, yPosition);
  yPosition += 6;
  doc.text(`GST (10%): $${pricing.gst.toFixed(2)}`, 100, yPosition);
  yPosition += 6;
  
  if (pricing.shipping > 0) {
    doc.text(`Shipping: $${pricing.shipping}`, 100, yPosition);
    yPosition += 6;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: $${pricing.total.toLocaleString()}`, 100, yPosition);
  
  // Footer
  yPosition += 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Contact: hello@mandymoney.com.au | www.mandymoney.com.au', 20, yPosition);
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};

export const createEmailSubject = (type: 'enquiry' | 'order', schoolName?: string): string => {
  const prefix = type === 'enquiry' ? 'High School Program Enquiry' : 'New Order: High School Program';
  return schoolName ? `${prefix} - ${schoolName}` : prefix;
};

export const createEmailBody = (
  type: 'enquiry' | 'order',
  schoolInfo: SchoolInfo,
  pricing: PricingDetails,
  teacherCount: number,
  studentCount: number
): string => {
  const isEnquiry = type === 'enquiry';
  
  let body = `Dear Mandy Money Team,\n\n`;
  
  if (isEnquiry) {
    body += `I would like to enquire about the High School Program and booklisting options.\n\n`;
  } else {
    body += `I would like to place an order for the High School Program.\n\n`;
  }
  
  body += `School Details:\n`;
  if (schoolInfo.schoolName) body += `- School: ${schoolInfo.schoolName}\n`;
  if (schoolInfo.coordinatorName) body += `- Coordinator: ${schoolInfo.coordinatorName}\n`;
  if (schoolInfo.coordinatorEmail) body += `- Email: ${schoolInfo.coordinatorEmail}\n`;
  if (schoolInfo.contactPhone) body += `- Phone: ${schoolInfo.contactPhone}\n`;
  
  body += `\nProgram Requirements:\n`;
  body += `- Teachers: ${teacherCount}\n`;
  body += `- Students: ${studentCount}\n`;
  body += `- Total Investment: $${pricing.total.toLocaleString()}\n\n`;
  
  if (schoolInfo.questionsComments) {
    body += `Additional Comments:\n${schoolInfo.questionsComments}\n\n`;
  }
  
  const documentType = isEnquiry ? 'quote' : 'order';
  body += `Please find the detailed ${documentType} attached.\n\n`;
  body += `Best regards,\n${schoolInfo.coordinatorName || 'School Coordinator'}`;
  
  return body;
};
