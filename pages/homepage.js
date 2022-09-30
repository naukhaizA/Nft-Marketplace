import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

//importing reference to the contract addresses
import { nftAddress, nftMarketAddress } from "../config";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [percent, setPercentage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadNFTs();
  }, []);

  // A function that would load and list an nft into the market
  async function loadNFTs() {
    // using a json provider to decode the contract abi to be able to use its functions
    const provider = new ethers.providers.JsonRpcProvider(); //"https://ropsten.infura.io/v3/a6d6901188c14155ba0b7165bd21c54a"

    //importing the NFT Contract abi
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);

    //importing the NFTMarket Contract abi
    const marketContract = new ethers.Contract(
      nftMarketAddress,
      Market.abi,
      provider
    );

    setPercentage(Math.floor(Math.random() * (500 - 0 + 1)) + 0);

    //To get the array of those items that are listed on the market by the user
    const data = await marketContract.fetchMarketItems();

    console.log("data: ", data);

    const items = await Promise.all(
      data.map(async (i) => {
        //fetching the uri of the token by calling the tokenURI func and passing in the id of the token
        const tokenURI = null;
        if (i.tokenId != null && i.tokenId != 0)
          tokenURI = await tokenContract.tokenURI(i.tokenId);

        //to fetch the meta data of the nft
        console.log("token id: ", i.tokenId);
        console.log("tokenURI: ", tokenURI);

        const meta = await axios({
          method: "get",
          url: `https://${tokenURI}`,
        });

        setPercentage(Math.floor(Math.random() * (1000 - 500 + 1)) + 500);

        //formating the price output in order to display it in a normal manner (since the unformated value gives 18 zeroes appended to it)
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        //creating an item object that would be stored in the item array to be return

        let item = {
          price,
          tokenId: i.tokenId.toNumber(), //calling the toNumber() function to convert the returned string into a number
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return item;
      })
    );
    setNfts(items);
    setLoadingMessage(false);
    setLoadingState("loaded");
  }

  async function buyNFT(nft) {
    //requiring the wallet connection in the buying function because the user can surf the website without having the need to connect the wallet

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    //establishing a web 3 provider to handle the transactions
    const provider = new ethers.providers.Web3Provider(connection);

    //since an account address is required for the transactions, we import one with the getSigner
    const signer = provider.getSigner();

    //establishing a reference to the NFTMarket contract to call its functions
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);

    //parsing the price output to display in a regular manner
    console.log("The price of this nft is: ", nft.price);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    //selling the listed nft to the signer by passing the price
    const transaction = await contract.createMarketSale(
      nftAddress,
      nft.tokenId,
      { value: price }
    );

    //wait for the transcation to complete
    await transaction.wait();
    console.log("The new owner is : ", nft.owner);
    //after the transaction has been verified, the sold nft would have a not null owner and thus it must be delisted from the market
    loadNFTs();

    router.push("/my-assets");
  }

  //if the state is loaded and no nft is minted yet
  if (loadingState === "loaded" && !nfts.length)
    return (
      <div className="bg-b7  bg-fixed  bg-cover" style={{ height: 560 }}>
        <h1 className="ml-80 mb-1 pl-20 font-mono font-semibold text-5xl ">
          N
          <span className=" inline-flex h-20 mt-32 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform">
            o Item in Marketplace!
          </span>
        </h1>
      </div>
    );
  console.log("The Nfts array", nfts);

  return (
    <div className="bg-b7  bg-fixed  bg-cover" style={{ height: 560 }}>
      <div className="flex ml-2">
        {/* A progress bar based on axios get */}
        {loadingMessage && (
          <div className=" mt-40 ml-40 ">
            {/* <h1 className=" mb-1 font-mono  text-5xl ">P
    <span
      className=" inline-flex h-20 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform">
      lease wait...
    </span>

  </h1> */}

            <h1 className="mt-24 font-mono  text-3xl ">
              L
              <span className=" inline-flex h-12 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform">
                oading...
              </span>
            </h1>
            <div
              id="bar-text"
              className="w-full shadow-lg bg-black bg-opacity-90 rounded-full h-7 pt-1 px-1 dark:bg-gray-700"
              style={{ width: 1000 }}
            >
              <div
                className="transition-all  ease-out duration-1000 h-fll relative w-0 bg-[#98071f] h-5 rounded-full"
                id="progress-bar"
                style={{ width: percent }}
              ></div>
            </div>
            <p className="font-bold text-[#98071f]">{percent / 10}%</p>
          </div>
        )}
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              //returning a div for each nft
              <>

                
                <div
                  key={i}
                  className="border-dotted border-black ml-2  group transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-105  duration-300 hover:bg-gradient-to-b hover:via-black hover:from-red-800 hover:to-black border shadow-md rounded-xl overflow-hidden   ..."
                >
                <div class="hidden group-hover:block inline-flex absolute mt-2 ml-3 group-hover:scale-110  items-center py-1 px-3 text-xs font-semibold text-white bg-black  rounded-2xl border border-2 border-white ">
                  {nft.description}
                </div>
                  {/* <div className="pt-1  bg-gradient-to-b from-red-800 to-black"> */}
                  <img
                    className="mt-4 mx-4 w-56"
                    src={nft.image}
                    ></img>

                  {/* </div> */}
                  <div className="p-4">
                    <p
                      style={{ height: "40px" }}
                      className="transition ease-in-out delay-10 group-hover:text-white pt-1 text-2xl text-center ttext-white font-semibold"
                    >
                      {nft.name}
                    </p>
                    <div className="px-4 py-3">
                      <button
                        className="hover:animate-spin transition ease-in-out delay-150  hover:scale-105  duration-300 ... w-full rounded-3xl bg-[#98071f] text-white hover:bg-[#7F0519] font-bold py-2 px-12 "
                        onClick={() => buyNFT(nft)}
                      >
                        Buy {nft.price} Eth
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
