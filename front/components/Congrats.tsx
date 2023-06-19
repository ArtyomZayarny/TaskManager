import Link from "next/link";
import React from "react";

type Props = {
  onModalClosehandler: () => void;
};

export const Congrats = ({ onModalClosehandler }: Props) => {
  return (
    <div className="text-center">
      <p>You successfully registered!</p>
      <p>Go to the dashboard, to create your first tasks!</p>
      <Link href="/" onClick={onModalClosehandler}>
        <span className="my-2 inline-block text-blue-500">My Dashboard</span>
      </Link>
    </div>
  );
};
