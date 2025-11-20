import React from "react";
import { X } from "lucide-react";

const UserBadge = ({ name, members, setMembers, _id }) => {
  const handleRemoveUser = () => {
    setMembers(members.filter((member) => member._id !== _id));
  };

  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 border border-primary/20 text-primary text-sm font-medium transition-all hover:bg-primary/30 mr-2 mb-2">
      <span>{name}</span>
      <button
        onClick={handleRemoveUser}
        className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default UserBadge;
