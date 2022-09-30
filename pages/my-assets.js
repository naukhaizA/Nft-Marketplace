import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"

//importing the contract abis 

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

//importing reference to the contract addresses
import {
  nftAddress, nftMarketAddress
} from "../config"



function myAssets() {

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  // A function that would load and list an nft into the market
  async function loadNFTs(){


    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    
    //establishing a web 3 provider to handle the transactions
    const provider = new ethers.providers.Web3Provider(connection);

    //since an account address is required for the transactions, we import one with the getSigner
    const signer = provider.getSigner();

    //importing the NFTMarket Contract abi
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
    
    //importing the NFT Contract abi
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    

    //To get the array of those items that are listed on the market by the user
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(data.map(async i =>{

      //fetching the uri of the token by calling the tokenURI func and passing in the id of the token
      const tokenURI = await tokenContract.tokenURI(i.tokenId)
      
      //to fetch the meta data of the nft
      const meta = await axios.get(`https://${tokenURI}`)
      
      //formating the price output in order to display it in a normal manner (since the unformated value gives 18 zeroes appended to it)
      let price = ethers.utils.formatUnits(i.price.toString(), "ether")

      //creating an item object that would be stored in the item array to be return

      let item = {
        price, 
        tokenId: i.tokenId.toNumber(),     //calling the toNumber() function to convert the returned string into a number
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      console.log("The owner is: ",item.owner)
      return item;

    }))
    setNfts(items);
    setLoadingState("loaded");
  }
  //if the state is loaded and user has no nft
  if(loadingState === "loaded" && !nfts.length) return (
    <div className="bg-b7  bg-fixed  bg-cover"  style={{height:560} }>
      
    <h1 className="ml-80 mb-1 pl-20 font-mono font-semibold text-5xl ">N
    <span
      className=" inline-flex h-20 mt-32 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform">
      o Assets Found!
    </span>

  </h1>
    </div>
  )

  return (
    <div className="bg-b7 bg-fixed  bg-cover" style={{height:560}}>
    <div className="flex ">
      <div className="px-4" style ={{ maxWidth: "1600px"}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              //returning a div for each nft
              <div key = {i} className="border-dotted border-black ml-2 group transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-105  duration-300 hover:bg-gradient-to-b hover:via-black hover:from-red-800 hover:to-black border shadow-md rounded-xl overflow-hidden   ...">
                <div class="hidden group-hover:block inline-flex absolute mt-2 ml-3 group-hover:scale-110  items-center py-1 px-3 text-xs font-semibold text-white bg-black  rounded-2xl border border-2 border-white ">
                  {nft.description}
                </div>
                <img className="mt-4 mx-4 w-56" src = {nft.image} title={nft.description}></img>
                <div className="p-4">
                  <p style={{ height: '40px' }} className="ransition ease-in-out delay-10 group-hover:text-white pt-1 text-2xl text-center ttext-white font-semibold">{nft.name}</p>                  
                  {/* <p className="text-lg font-semibold text-center text-black">{nft.description} </p> */}
                  <div className="mx-4 my-3 px-3 rounded-full text-md  text-center font-bold bg-gray-200 group-hover:bg-black  text-green-700 group-hover:text-green-500">
                  <p className=" py-2 text-md font-bold text-center text-green-700">Bought For: {nft.price} Eth </p>
                  </div>
                </div>
                
              </div>

            ))
          }
        </div>
      </div>
    </div>
      
    </div>
  )
}

export default myAssets

