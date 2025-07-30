import React from "react";
import { Card } from "./Card";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  groupName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-black">Delete Group</h3>
          <div className="mt-2 text-sm text-gray-700">
            <p>
              Are you sure you want to delete the group{" "}
              <span className="font-semibold">"{groupName}"</span>? This action
              cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            type="button"
          >
            Confirm Delete
          </button>
        </div>
      </Card>
    </div>
  );
};
