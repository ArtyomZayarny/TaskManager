import React from "react";

type Props = {
  error: string;
};

export const ErrorMessage = ({ error }: Props) => {
  return (
    <div className="mb-5">
      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
        <span className="font-medium">Oh, snapp! </span>
        <span className="font-medium">{error}</span>
      </p>
    </div>
  );
};
