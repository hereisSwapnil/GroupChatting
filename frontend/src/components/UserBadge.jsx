import React from "react";

const UserBadge = ({ name, members, setMembers, _id }) => {
  const handleRemoveUser = () => {
    console.log(members);
    setMembers(members.filter((member) => member._id !== _id));
  };
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-purple-100 px-2.5 py-0.5 text-purple-700 my-[4px] mx-[2px]">
      <p className="whitespace-nowrap text-sm">{name}</p>

      <button
        className="-me-1 ms-1.5 inline-block rounded-full bg-purple-200 p-0.5 text-purple-700 transition hover:bg-purple-300"
        onClick={handleRemoveUser}
      >
        <span className="sr-only">Remove User</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-3 w-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
};

export default UserBadge;
