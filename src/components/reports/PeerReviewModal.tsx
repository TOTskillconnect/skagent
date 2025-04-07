import React, { useState } from 'react';
import Card from '@/components/common/Card';

interface PeerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewers: string[], message: string) => void;
  candidateName: string;
}

export default function PeerReviewModal({ isOpen, onClose, onSubmit, candidateName }: PeerReviewModalProps) {
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [newReviewer, setNewReviewer] = useState('');
  const [message, setMessage] = useState('');

  const handleAddReviewer = () => {
    if (newReviewer && !reviewers.includes(newReviewer)) {
      setReviewers([...reviewers, newReviewer]);
      setNewReviewer('');
    }
  };

  const handleRemoveReviewer = (reviewer: string) => {
    setReviewers(reviewers.filter(r => r !== reviewer));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reviewers, message);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Send for Peer Review</h2>
          <p className="text-gray-600 mb-6">
            Send {candidateName}'s report to your internal hiring team for feedback.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Reviewers
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={newReviewer}
                  onChange={(e) => setNewReviewer(e.target.value)}
                  placeholder="Enter email address"
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddReviewer}
                  className="btn-outline px-4"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {reviewers.map((reviewer) => (
                  <div
                    key={reviewer}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{reviewer}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReviewer(reviewer)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Reviewers
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to your team (optional)"
                className="form-textarea w-full h-32"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={reviewers.length === 0}
              >
                Send for Review
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
} 