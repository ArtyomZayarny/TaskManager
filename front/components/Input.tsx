import React from "react";

type Props = {
  type: string;
  value: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = ({ type, value, onChangeHandler }: Props) => {
  return (
    <input
      className="w-full border border-gray-300 rounded-md outline-none p-2"
      type={type}
      placeholder={`Enter your ${type}`}
      value={value}
      required
      onChange={(e) => onChangeHandler(e)}
    />
  );
};
