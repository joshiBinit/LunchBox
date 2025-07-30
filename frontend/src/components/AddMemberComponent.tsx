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
    <div className="mt-4 flex space-x-2">
      <input
        type="text"
        value={newMemberName}
        onChange={(e) => setNewMemberName(e.target.value)}
        placeholder="New member's name"
        className="flex-grow px-3 py-2 rounded border border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
      />
      <button
        onClick={handleAdd}
        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 shadow-md"
        type="button"
      >
        <Plus className="w-5 h-5" />
        <span>Add</span>
      </button>
    </div>
  );
};
