import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Image, FileText, Loader } from 'lucide-react';

interface PaymentProofData {
  amount: number;
  gateway: string;
  comment: string;
  proofFile: File | null;
  proofPreview: string;
}

interface PaymentProofUploadProps {
  amount: number;
  gateway: string;
  onSubmit: (proofData: PaymentProofData) => void;
  isLoading?: boolean;
}

const PaymentProofUpload: React.FC<PaymentProofUploadProps> = ({
  amount,
  gateway,
  onSubmit,
  isLoading = false
}) => {
  const [comment, setComment] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and PDF files are allowed');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setError('');
    
    if (!validateFile(file)) {
      return;
    }

    setProofFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProofPreview(''); // PDF files don't show preview
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Remove file
  const removeFile = () => {
    setProofFile(null);
    setProofPreview('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit payment proof
  const handleSubmit = () => {
    setError('');

    if (!proofFile) {
      setError('Please upload payment proof');
      return;
    }

    if (!comment.trim()) {
      setError('Please add a comment for your payment');
      return;
    }

    onSubmit({
      amount,
      gateway,
      comment: comment.trim(),
      proofFile,
      proofPreview
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Payment Proof</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Payment Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Amount: <span className="font-bold">₦{amount.toLocaleString()}</span></li>
                <li>Payment Method: <span className="font-bold">{gateway}</span></li>
                <li>Upload clear proof of payment</li>
                <li>Add descriptive comment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Proof (Image or PDF)
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : proofFile
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {!proofFile ? (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-600">Drag and drop your payment proof here, or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Browse Files
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, PDF (Max 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-green-800 font-medium">{proofFile.name}</p>
                <p className="text-green-600 text-sm">
                  {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {proofPreview && (
                <div className="mt-4">
                  <img
                    src={proofPreview}
                    alt="Payment proof preview"
                    className="max-w-full max-h-48 mx-auto rounded-lg border border-gray-200"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={removeFile}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center mx-auto"
              >
                <X className="w-4 h-4 mr-1" />
                Remove File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Comment <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe your payment (e.g., Bank name, Transaction ID, Payment date)"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !proofFile || !comment.trim()}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Submitting Payment Proof...
          </>
        ) : (
          'Submit Payment Proof'
        )}
      </button>
    </div>
  );
};

export default PaymentProofUpload;
