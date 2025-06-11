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
  // Add prominent notice at the top
  doc.setFillColor(255, 0, 0); // Red background
  doc.rect(10, 10, 190, 25, 'F');
  
  doc.setTextColor(255, 255, 255); // White text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('⚠️ IMPORTANT: THIS PDF MUST BE SUBMITTED TO', 105, 20, { align: 'center' });
  doc.text('HELLO@MANDYMONEY.COM.AU FOR THE ENQUIRY OR ORDER TO BE RECEIVED', 105, 28, { align: 'center' });
  
  // Reset colors for rest of document
  doc.setTextColor(0, 0, 0);
  
  // Add title below the notice
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, 50);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Page ${pageNumber}`, 180, 50);
  
  return 60; // Return starting Y position for content (moved down due to notice)
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
    
    // Item header
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${item.item}`, 20, yPosition);
    
    // Price
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${item.totalPrice}`, 180, yPosition);
    
    yPosition += 8;
    
    // Item description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(item.description, 25, yPosition);
    yPosition += 6;
    
    // Quantity and unit price breakdown
    doc.text(`${item.count} x $${item.unitPrice} per ${item.type}`, 25, yPosition);
    
    // Show savings if applicable
    if (item.savings && item.savings > 0) {
      doc.setFont('helvetica', 'italic');
      doc.text(`(Save $${item.savings.toFixed(0)} each)`, 100, yPosition);
      doc.setFont('helvetica', 'normal');
    }
    
    yPosition += 12;
  });
  
  yPosition += 10;
  
  // Shipping section
  doc.setFont('helvetica', 'bold');
  doc.text('• Shipping', 20, yPosition);
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
  
  // What's Included section with updated digital classroom logic
  yPosition += 30;
  if (yPosition > 220) {
    doc.addPage();
    yPosition = addPageHeader(doc, 'Mandy Money High School Program Quote', doc.getNumberOfPages());
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("What's Included", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const inclusions = quoteItems.map(item => 
    `${item.count} x ${item.item.replace('Digital Pass + Textbook Bundle', 'Digital Pass & Print Textbooks').replace('Textbook Only', 'Print Textbooks')}`
  );

  // Check if we should include digital classroom spaces
  const hasTeacherDigitalPass = quoteItems.some(item => 
    item.type === 'teacher' && item.item.includes('Digital Pass')
  );
  const hasStudentDigitalPass = quoteItems.some(item => 
    item.type === 'student' && item.item.includes('Digital Pass')
  );

  // Only include digital classroom spaces if both teacher and student digital passes are selected
  if (hasTeacherDigitalPass && hasStudentDigitalPass) {
    const teacherDigitalPassCount = quoteItems
      .filter(item => item.type === 'teacher' && item.item.includes('Digital Pass'))
      .reduce((sum, item) => sum + item.count, 0);
    
    inclusions.push(`${teacherDigitalPassCount} x Digital Classroom Space`);
  }
  
  inclusions.forEach(inclusion => {
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
  let yPosition = addPageHeader(doc, 'Mandy Money High School Program Order');
  
  // Order header info
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
  
  // Add PDF link prominently if available
  if (pdfUrl) {
    const documentType = isEnquiry ? 'quote' : 'order';
    body += `IMPORTANT - Please find the detailed ${documentType} document here:\n`;
    body += `${pdfUrl}\n\n`;
    body += `You can view and download the PDF by clicking the link above.\n\n`;
  }
  
  body += `School Details:\n`;
  if (schoolInfo.schoolName) body += `- School: ${schoolInfo.schoolName}\n`;
  if (schoolInfo.coordinatorName) body += `- Coordinator: ${schoolInfo.coordinatorName}\n`;
  if (schoolInfo.coordinatorEmail) body += `- Email: ${schoolInfo.coordinatorEmail}\n`;
  if (schoolInfo.contactPhone) body += `- Phone: ${schoolInfo.contactPhone}\n`;
  if (schoolInfo.schoolABN) body += `- ABN: ${schoolInfo.schoolABN}\n`;
  
  // Add full address if available
  const address = formatAddress(schoolInfo.schoolAddress);
  if (address.trim()) body += `- Address: ${address}\n`;
  
  body += `\nProgram Requirements:\n`;
  body += `- Teachers: ${teacherCount}\n`;
  body += `- Students: ${studentCount}\n`;
  body += `- Program Start Date: ${new Date().toLocaleDateString()}\n`;
  body += `- Total Investment: $${pricing.total.toLocaleString()} (including GST)\n\n`;
  
  // Add detailed pricing breakdown
  body += `Investment Breakdown:\n`;
  body += `- Subtotal (exc. GST): $${pricing.subtotal.toFixed(2)}\n`;
  body += `- GST (10%): $${pricing.gst.toFixed(2)}\n`;
  if (pricing.shipping > 0) {
    body += `- Shipping: $${pricing.shipping.toFixed(2)}\n`;
  } else {
    body += `- Shipping: FREE (order over $90)\n`;
  }
  body += `- Total: $${pricing.total.toLocaleString()}\n\n`;
  
  if (schoolInfo.questionsComments) {
    body += `Additional Comments:\n${schoolInfo.questionsComments}\n\n`;
  }
  
  body += `Best regards,\n${schoolInfo.coordinatorName || 'School Coordinator'}`;
  
  return body;
};
