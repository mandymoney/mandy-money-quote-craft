
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, X } from 'lucide-react';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'enquiry' | 'order';
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const title = type === 'enquiry' ? 'Enquiry Prepared!' : 'Order Prepared!';
  const message = type === 'enquiry' 
    ? 'Your enquiry email has been opened with the quote PDF link included.'
    : 'Your order email has been opened with the order PDF link included.';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-orange-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Mail className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-800 mb-2 text-lg">
                🚨 IMPORTANT: Final Step Required! 🚨
              </h3>
              <p className="text-red-700 text-sm font-medium">
                Your {type} will NOT be received unless you send the email with the PDF link to{' '}
                <strong className="text-red-800">hello@mandymoney.com.au</strong>
              </p>
              <p className="text-red-600 text-sm mt-2">
                The PDF contains all necessary information for processing your {type}.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            I understand - I'll send the email!
          </Button>
        </div>
      </div>
    </div>
  );
};
