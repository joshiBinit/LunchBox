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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50 p-6">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 shadow-md">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="mt-5 text-2xl font-extrabold text-gray-900 select-none">
            Delete Group
          </h3>
          <div className="mt-4 text-base text-gray-700">
            <p>
              Are you sure you want to delete the group{" "}
              <span className="font-semibold text-gray-900">"{groupName}"</span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-extrabold hover:bg-red-700 transition-colors focus:outline-none focus:ring-4 focus:ring-red-400 shadow-lg"
          >
            Confirm Delete
          </button>
        </div>
      </Card>
    </div>
  );
};
