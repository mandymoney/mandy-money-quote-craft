
import { supabase } from '@/integrations/supabase/client';

export const uploadPDFToStorage = async (
  pdfBlob: Blob,
  filename: string
): Promise<string | null> => {
  try {
    // Upload the PDF directly to the existing bucket
    const { data, error } = await supabase.storage
      .from('quote-pdfs')
      .upload(filename, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error('Error uploading PDF:', error);
      // If bucket doesn't exist, the SQL migration should have created it
      // Don't try to create it here as it causes permission issues
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: publicData } = supabase.storage
      .from('quote-pdfs')
      .getPublicUrl(filename);

    console.log('PDF uploaded successfully:', publicData.publicUrl);
    return publicData.publicUrl;
  } catch (error) {
    console.error('Error in uploadPDFToStorage:', error);
    return null;
  }
};

export const generatePDFBlob = (doc: any): Blob => {
  // Convert jsPDF document to blob
  const pdfOutput = doc.output('blob');
  return pdfOutput;
};
