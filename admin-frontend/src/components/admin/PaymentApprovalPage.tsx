import React, { useState, useEffect } from 'react';
import { Eye, Download, CheckCircle, XCircle, AlertCircle, Loader, Search, Filter, Calendar, User, CreditCard, Image, FileText } from 'lucide-react';
import adminApiService from '../../services/adminApi';

interface PaymentProof {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  amount: number;
  gateway: string;
  comment: string;
  proofFile: string;
  proofFileName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComment?: string;
}

const PaymentApprovalPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentProof[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentProof | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Fetch payment proofs
  const fetchPaymentProofs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await adminApiService.getPaymentProofs();
      
      if (response.error) {
        setError(response.error);
      } else {
        setPayments(response.payments || []);
        setFilteredPayments(response.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch payment proofs:', error);
      setError('Failed to load payment proofs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentProofs();
  }, []);

  // Filter payments
  useEffect(() => {
    let filtered = payments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm)
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter]);

  // Handle payment approval/rejection
  const handleReview = async (paymentId: number, action: 'approve' | 'reject') => {
    if (!reviewComment.trim() && action === 'reject') {
      setError('Please provide a reason for rejection');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await adminApiService.reviewPaymentProof(paymentId, {
        action,
        comment: reviewComment.trim()
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(`Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
        setShowModal(false);
        setSelectedPayment(null);
        setReviewComment('');
        fetchPaymentProofs(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to review payment:', error);
      setError('Failed to review payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal for payment review
  const openReviewModal = (payment: PaymentProof) => {
    setSelectedPayment(payment);
    setShowModal(true);
    setReviewComment('');
    setError('');
    setSuccess('');
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get gateway badge
  const getGatewayBadge = (gateway: string) => {
    const gatewayConfig = {
      manual: 'bg-gray-100 text-gray-800',
      paystack: 'bg-blue-100 text-blue-800',
      card: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${gatewayConfig[gateway as keyof typeof gatewayConfig]}`}>
        {gateway.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Approval</h1>
            <p className="text-gray-600 mt-1">Review and approve user payment proofs</p>
          </div>
          <button
            onClick={fetchPaymentProofs}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Loader className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {payments.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {payments.filter(p => p.status === 'approved').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {payments.filter(p => p.status === 'rejected').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₦{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by user, email, amount, or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {/* Payment Proofs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gateway</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600">Loading payment proofs...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No payment proofs found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                          <div className="text-sm text-gray-500">{payment.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getGatewayBadge(payment.gateway)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openReviewModal(payment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {payment.proofFile && (
                            <a
                              href={payment.proofFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900"
                              title="Download Proof"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Modal */}
        {showModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Proof Review</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Payment Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">User:</span>
                          <span className="text-sm font-medium">{selectedPayment.userName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Email:</span>
                          <span className="text-sm font-medium">{selectedPayment.userEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="text-sm font-bold text-green-600">₦{selectedPayment.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Gateway:</span>
                          <span>{getGatewayBadge(selectedPayment.gateway)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span>{getStatusBadge(selectedPayment.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Submitted:</span>
                          <span className="text-sm">{new Date(selectedPayment.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">User Comment</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{selectedPayment.comment}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Review Comment</h4>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Add your review comment (required for rejection)..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Payment Proof */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Proof</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedPayment.proofFile ? (
                        selectedPayment.proofFileName.match(/\.(jpg|jpeg|png)$/i) ? (
                          <img
                            src={selectedPayment.proofFile}
                            alt="Payment proof"
                            className="w-full h-auto rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">{selectedPayment.proofFileName}</p>
                            <a
                              href={selectedPayment.proofFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Proof
                            </a>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-8">
                          <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">No proof file available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  {selectedPayment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReview(selectedPayment.id, 'reject')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          'Reject Payment'
                        )}
                      </button>
                      <button
                        onClick={() => handleReview(selectedPayment.id, 'approve')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          'Approve Payment'
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentApprovalPage;
