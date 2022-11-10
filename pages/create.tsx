import React, { FormEvent, useState } from "react";
import Header from "../components/Header";
import {
  useAddress,
  useContract,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import {
  ChainId,
  NFT,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
} from "@thirdweb-dev/sdk";
import network from "../utils/network";
import { useRouter } from "next/router";

type Props = {};

function Create({}: Props) {
  const address = useAddress();
  const { contract: marketplaceContract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { contract: collectionContact } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  const ownedNFTs = useOwnedNFTs(collectionContact, address);
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const router = useRouter();
  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(marketplaceContract);
  const {
    mutate: createAuctionListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(marketplaceContract);
  console.log(selectedNFT)

  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!selectedNFT) {
      return;
    }

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };
    const { listingType, price } = target.elements;

    if (listingType.value === 'directListing') {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNFT.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS: ", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR: ", error, variables, context);
          },
        }
      );
    }

    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNFT.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS: ", data, variables, context);
            router.push("/");
          },
          onError(errorAuction, variables, context) {
            console.log("ERROR: ", errorAuction, variables, context);
          },
        }
      );
    }
  };

  return (
    <div className="bg-[#fef4e8] h-screen">
      <Header />
      <main className="max-x-6xl mx-auto p-10 pt-2">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an Item you would like to Sell
        </h2>
        <hr className="mb-5" />

        <p>Below you will find the NFT's you own in your wallet</p>

        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownedNFTs?.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              onClick={() => setSelectedNFT(nft)}
              className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 ${
                nft.metadata.id === selectedNFT?.metadata.id
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <MediaRenderer
                className="h-48 rounded-lg"
                src={nft.metadata.image}
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-xs truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>
        {selectedNFT && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r font-light">
                  Direct Listing / Fixed Price
                </label>
                <input
                  name="listingType"
                  type="radio"
                  value="directListing"
                  className="ml-auto h-10 w-10"
                />
                <label className="border-r font-light">Auction</label>
                <input
                  name="listingType"
                  type="radio"
                  value="auctionListing"
                  className="ml-auto h-10 w-10"
                />
                <label className="border-r font-light">Price</label>
                <input
                  type="text"
                  name="price"
                  placeholder="0.05"
                  className="bg-gray-100 p-5"
                />
              </div>
              <button
                className="bg-blue-600 text-white rounded-lg p-4 mt-8"
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default Create;
