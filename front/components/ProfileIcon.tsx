import { AppContext } from "@/context/app-context";
import { Menu } from "@headlessui/react";
import { Fragment, useContext } from "react";
import Avatar from "react-avatar";

export const ProfileIcon = () => {
  const { logOut } = useContext(AppContext);
  const links = [{ href: "/profile", label: "Profile" }];

  return (
    <Menu>
      <Menu.Button>
        <Avatar name="Artem Zaiarnyi" round color="#0055D1" size="40" />
      </Menu.Button>

      <Menu.Items className="p-5 bg-slate-100 rounded-lg flex flex-col absolute right-0 top-20 mt-2 w-56 origin-top-right">
        {links.map((link) => (
          /* Use the `active` state to conditionally style the active item. */
          <Menu.Item key={link.href} as={Fragment}>
            {({ active }) => (
              <a
                href={link.href}
                className={`p-2 rounded-sm ${
                  active ? "bg-gray-200 text-gray " : "bg-slate-100 text-black"
                }`}
              >
                {link.label}
              </a>
            )}
          </Menu.Item>
        ))}
        <Menu.Item
          key="sign-out"
          as="div"
          className={`p-2 rounded-sm hover:bg-gray-200 cursor-pointer`}
          onClick={logOut}
        >
          Sign Out
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};
