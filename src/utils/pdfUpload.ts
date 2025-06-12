
import { supabase } from '@/integrations/supabase/client';

export const uploadPDFToStorage = async (
  pdfBlob: Blob,
  filename: string
): Promise<string | null> => {
  try {
    // Ensure the bucket exists by attempting to create it (will fail silently if it already exists)
    await supabase.storage.createBucket('quote-pdfs', {
      public: true
    });

    const { data, error } = await supabase.storage
      .from('quote-pdfs')
      .upload(filename, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error('Error uploading PDF:', error);
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: publicData } = supabase.storage
      .from('quote-pdfs')
      .getPublicUrl(filename);

    return publicData.publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return null;
  }
};

export const generatePDFBlob = (doc: any): Blob => {
  // Convert jsPDF document to blob
  const pdfOutput = doc.output('blob');
  return pdfOutput;
};
