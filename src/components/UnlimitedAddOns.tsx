
import React from 'react';
import { Input } from '@/components/ui/input';
import { Image } from 'lucide-react';

interface AddOns {
  teacherBooks: number;
  studentBooks: number;
  posterA0: number;
}

interface UnlimitedAddOnsProps {
  addOns: AddOns;
  onAddOnsChange: (addOns: AddOns) => void;
  tierAddOns: {
    teacherBooks: number;
    studentBooks: number;
    posterA0: number;
  };
}

export const UnlimitedAddOns: React.FC<UnlimitedAddOnsProps> = ({
  addOns,
  onAddOnsChange,
  tierAddOns
}) => {
  const handleTeacherBooksChange = (value: string) => {
    const newCount = Math.max(0, parseInt(value) || 0);
    onAddOnsChange({ ...addOns, teacherBooks: newCount });
  };

  const handleStudentBooksChange = (value: string) => {
    const newCount = Math.max(0, parseInt(value) || 0);
    onAddOnsChange({ ...addOns, studentBooks: newCount });
  };

  const handlePosterA0Change = (value: string) => {
    const newCount = Math.max(0, parseInt(value) || 0);
    onAddOnsChange({ ...addOns, posterA0: newCount });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold text-gray-800 flex items-center">
        Optional Hard-Copy Add-ons
      </h4>
      
      {/* Print Teacher Textbooks */}
      <div className="bg-white/80 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Image className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-800">Print Teacher Textbooks</span>
            <span className="text-sm text-gray-600">(${tierAddOns.teacherBooks} each)</span>
          </div>
          <Input
            type="number"
            min="0"
            value={addOns.teacherBooks}
            onChange={(e) => {
              e.stopPropagation();
              handleTeacherBooksChange(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-20 bg-white text-gray-800 border-gray-300"
            placeholder="0"
          />
        </div>
        <div className="text-gray-600 text-sm">
          Total: ${(addOns.teacherBooks * tierAddOns.teacherBooks).toLocaleString()}
        </div>
      </div>

      {/* Print Student Textbooks */}
      <div className="bg-white/80 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Image className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-800">Print Student Textbooks</span>
            <span className="text-sm text-gray-600">(${tierAddOns.studentBooks} each)</span>
          </div>
          <Input
            type="number"
            min="0"
            value={addOns.studentBooks}
            onChange={(e) => {
              e.stopPropagation();
              handleStudentBooksChange(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-20 bg-white text-gray-800 border-gray-300"
            placeholder="0"
          />
        </div>
        <div className="text-gray-600 text-sm">
          Total: ${(addOns.studentBooks * tierAddOns.studentBooks).toLocaleString()}
        </div>
      </div>

      {/* A0 Posters */}
      <div className="bg-white/80 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Image className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-800">A0 Posters</span>
            <span className="text-sm text-gray-600">(${tierAddOns.posterA0} each)</span>
          </div>
          <Input
            type="number"
            min="0"
            value={addOns.posterA0}
            onChange={(e) => {
              e.stopPropagation();
              handlePosterA0Change(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-20 bg-white text-gray-800 border-gray-300"
            placeholder="0"
          />
        </div>
        <div className="text-gray-600 text-sm">
          Total: ${(addOns.posterA0 * tierAddOns.posterA0).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
