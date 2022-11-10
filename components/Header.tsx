import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {};

function Header({}: Props) {
  const connectWothMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-6xl mx-auto py-2 px-4 ">
      <nav className="flex justify-between">
        <div className="flex items-center space-x-2 text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              Hi, {address.slice(0, 5) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button
              onClick={connectWothMetamask}
              className="connectWalletBtn hover:text-[#1989ac]"
            >
              Connect your wallet
            </button>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <p className="">Let's Enjoy a New Way of Marchandise</p>
        </div>
      </nav>
      <hr className="mt-2" />

      <section className="flex items-center space-x-2 py-5 justify-between">
        <div className="w-20 sm:w-28 md:w-36 cursor-pointer flex-shrink-0">
          <Link href="/">
            <Image
              className="h-full w-full object-contain"
              alt="NFT marketplace Logo"
              src="/logo.png"
              width={100}
              height={100}
              priority
            />
          </Link>
        </div>
        <Link href="/" className="link">
          Go to Home
        </Link>
        <Link href="/addItem" className="link">
          Add to inventory
        </Link>
        <Link href="/create" className="link">
          List your Item
        </Link>
      </section>
      <hr />
    </div>
  );
}

export default Header;
