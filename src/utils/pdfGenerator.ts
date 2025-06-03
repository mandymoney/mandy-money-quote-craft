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

const addPageHeader = (doc: jsPDF, title: string, pageNumber: number = 1) => {
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, 20);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Page ${pageNumber}`, 180, 20);
  
  return 30; // Return starting Y position for content
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
  let yPosition = addPageHeader(doc, 'Mandy Money High School Program Quote');
  
  // Quote header info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quote Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  doc.text(`Valid Until: 31st December, ${new Date().getFullYear()}`, 120, yPosition);
  yPosition += 20;
  
  // School Information Section
  if (schoolInfo.schoolName) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('School Information', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const schoolDetails = [
      { label: 'School Name', value: schoolInfo.schoolName },
      { label: 'Address', value: formatAddress(schoolInfo.schoolAddress) },
      { label: 'ABN', value: schoolInfo.schoolABN },
      { label: 'Coordinator', value: schoolInfo.coordinatorName + (schoolInfo.coordinatorPosition ? ` (${schoolInfo.coordinatorPosition})` : '') },
      { label: 'Email', value: schoolInfo.coordinatorEmail },
      { label: 'Phone', value: schoolInfo.contactPhone }
    ];
    
    schoolDetails.forEach(detail => {
      if (detail.value) {
        doc.text(`${detail.label}: ${detail.value}`, 20, yPosition);
        yPosition += 6;
      }
    });
    
    yPosition += 10;
  }
  
  // Program Details Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Program Details', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const accessEndDate = new Date(programStartDate);
  accessEndDate.setFullYear(accessEndDate.getFullYear() + 1);
  
  const programDetails = [
    `Program Start: ${programStartDate.toLocaleDateString()}`,
    `Access Ends: ${accessEndDate.toLocaleDateString()}`,
    `Access Period: 12 months`,
    `Teachers: ${teacherCount}`,
    `Students: ${studentCount}`,
    `Full 12-month access to all digital content and resources`
  ];
  
  programDetails.forEach(detail => {
    doc.text(detail, 20, yPosition);
    yPosition += 6;
  });
  
  yPosition += 15;
  
  // Investment Breakdown Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Breakdown', 20, yPosition);
  yPosition += 10;
  
  // Check if we need a new page
  if (yPosition > 220) {
    doc.addPage();
    yPosition = addPageHeader(doc, 'Mandy Money High School Program Quote', 2);
  }
  
  // Detailed item breakdown
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  quoteItems.forEach(item => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = addPageHeader(doc, 'Mandy Money High School Program Quote', doc.getNumberOfPages());
    }
    
    // Item header with badge
    doc.setFont('helvetica', 'bold');
    doc.text(`● ${item.item}`, 20, yPosition);
    
    // Add type badge
    if (item.type === 'teacher') {
      doc.setFillColor(72, 187, 120);
    } else {
      doc.setFillColor(245, 158, 11);
    }
    doc.roundedRect(130, yPosition - 4, 25, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(item.type.charAt(0).toUpperCase() + item.type.slice(1), 135, yPosition);
    doc.setTextColor(0, 0, 0);
    
    // Price
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${item.totalPrice}`, 160, yPosition);
    
    yPosition += 8;
    
    // Item description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(item.description, 25, yPosition);
    yPosition += 6;
    
    // Quantity and unit price breakdown
    doc.text(`${item.count} × $${item.unitPrice}`, 25, yPosition);
    
    // Show savings if applicable
    if (item.savings && item.savings > 0) {
      doc.setFont('helvetica', 'italic');
      doc.text(`(Save $${item.savings.toFixed(0)} each)`, 80, yPosition);
      doc.setFont('helvetica', 'normal');
    }
    
    yPosition += 12;
  });
  
  yPosition += 10;
  
  // Shipping section
  doc.setFont('helvetica', 'bold');
  doc.text('● Shipping', 20, yPosition);
  doc.text('FREE', 160, yPosition);
  yPosition += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.text('Free shipping (order over $90)', 25, yPosition);
  yPosition += 15;
  
  // Financial summary
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 8;
  
  const summaryItems = [
    { label: 'Subtotal (exc. GST)', value: `$${pricing.subtotal.toFixed(2)}` },
    { label: 'GST (10%)', value: `$${pricing.gst.toFixed(2)}` }
  ];
  
  doc.setFont('helvetica', 'normal');
  summaryItems.forEach(item => {
    doc.text(item.label, 130, yPosition);
    doc.text(item.value, 170, yPosition);
    yPosition += 6;
  });
  
  // Total investment highlight
  yPosition += 5;
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(125, yPosition - 8, 65, 20, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Total Investment', 130, yPosition);
  doc.setFontSize(16);
  doc.text(`$${pricing.total.toLocaleString()}`, 155, yPosition + 8);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('(Price includes 10% GST)', 135, yPosition + 15);
  
  doc.setTextColor(0, 0, 0);
  
  // What's Included section
  yPosition += 30;
  if (yPosition > 220) {
    doc.addPage();
    yPosition = addPageHeader(doc, 'Mandy Money High School Program Quote', doc.getNumberOfPages());
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("What's Included", 20, yPosition);
  yPosition += 10;
  
  // Extract inclusions from quote items and display them
  const teacherInclusions = quoteItems
    .filter(item => item.type === 'teacher')
    .map(item => `${item.count} × ${item.item.replace('Digital Pass + Textbook Bundle', 'Teacher Digital Pass & Print Textbooks').replace('Textbook Only', 'Teacher Print Textbooks')}`);
  
  const studentInclusions = quoteItems
    .filter(item => item.type === 'student')
    .map(item => `${item.count} × ${item.item.replace('Digital Pass + Textbook Bundle', 'Student Digital Pass & Print Textbooks').replace('Textbook Only', 'Student Print Textbooks')}`);
  
  const allInclusions = [
    ...teacherInclusions,
    ...studentInclusions,
    '1 × Digital Classroom Space'
  ];
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  allInclusions.forEach(inclusion => {
    doc.text('✓', 25, yPosition);
    doc.text(inclusion, 35, yPosition);
    yPosition += 7;
  });
  
  // Footer
  yPosition += 15;
  if (yPosition > 270) {
    doc.addPage();
    yPosition = 20;
  }
  
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
  studentCount: number,
  pdfUrl?: string
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
  
  if (pdfUrl) {
    body += `Please find the detailed ${documentType} document here:\n${pdfUrl}\n\n`;
    body += `You can view and download the PDF by clicking the link above.\n\n`;
  } else {
    body += `Please find the detailed ${documentType} attached.\n\n`;
  }
  
  body += `Best regards,\n${schoolInfo.coordinatorName || 'School Coordinator'}`;
  
  return body;
};
