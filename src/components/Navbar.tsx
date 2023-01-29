import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";

export type TNavbar = {
  uri: string;
  text: string;
}[];

const Navbar: React.FC<{ linkList: TNavbar }> = ({
  linkList,
}: {
  linkList: TNavbar;
}) => {
  return (
    <>
      <HamburgerMenu linkList={linkList} />
      <nav className="hidden w-full bg-gray-800 md:block">
        <div className="mx-auto flex justify-between bg-violet-500 px-4 py-2">
          <div>some logo</div>
          <div className="flex ">
            <div>
              <ul className="flex items-center justify-center">
                {linkList.map((link) => (
                  <li key={link.text} className="px-4">
                    <Link
                      href={link.uri}
                      className="block w-full text-white hover:bg-violet-600"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

const HamburgerIcon: React.FC<{
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}> = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`;
  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="group flex h-12 w-12 flex-col items-start justify-start rounded  border-black"
      >
        <div
          className={`${genericHamburgerLine} ${
            isOpen
              ? "translate-y-3 rotate-45 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        ></div>
        <div
          className={`${genericHamburgerLine} ${
            isOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"
          }`}
        ></div>
        <div
          className={`${genericHamburgerLine} ${
            isOpen
              ? "-translate-y-3 -rotate-45 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        ></div>
      </button>
    </div>
  );
};

const HamburgerMenu: React.FC<{ linkList: TNavbar }> = ({
  linkList,
}: {
  linkList: TNavbar;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-violet-500 px-4 pt-2 md:hidden">
      <HamburgerIcon isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`w-full transition-all duration-500 ease-in-out ${
          isOpen ? "visible h-52" : "invisible h-0"
        }`}
      >
        <ul className="flex flex-col transition-none duration-300">
          {linkList.map((link) => (
            <li key={link.text} className="py-2">
              <Link
                href={link.uri}
                className="block w-full text-white hover:bg-violet-600"
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
