import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      src="http://links.papareact.com/c2cdd5"
      alt="Trello Logo"
      width={300}
      height={100}
      className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
    />
  );
};
