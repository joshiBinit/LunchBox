import React, { useState } from "react";
import { Plus } from "lucide-react";

interface AddMemberComponentProps {
  onAddMember: (name: string) => void;
}

export const AddMemberComponent: React.FC<AddMemberComponentProps> = ({
  onAddMember,
}) => {
  const [newMemberName, setNewMemberName] = useState("");

  const handleAdd = () => {
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName("");
    }
  };

  return (
    <div className="mt-4 flex gap-1">
      <input
        type="text"
        value={newMemberName}
        onChange={(e) => setNewMemberName(e.target.value)}
        placeholder="New member's name"
        className="flex-grow px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
      />
      <button
        onClick={handleAdd}
        className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-3 px-3 rounded-lg flex items-center  shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-400"
        type="button"
        aria-label="Add new member"
      >
        <Plus className="w-4 h-5" />
        <span>Add</span>
      </button>
    </div>
  );
};
