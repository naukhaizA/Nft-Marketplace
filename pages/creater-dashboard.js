import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"
import { useRouter } from "next/router";


//importing the contract abis 

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

//importing reference to the contract addresses
import {
  nftAddress, nftMarketAddress
} from "../config"
import { Router } from "next/router"



function createrDashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter();


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
    const data = await marketContract.fetchItemsCreated();

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
        tokenId: i.tokenId,     //calling the toNumber() function to convert the returned string into a number
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        sold : i.sold
        
      }

      console.log("The item array is:", item)

      return item;

    }))

    //filtering the sold items by using the sold bool var and storing the filtered items into a new array
    setNfts(items)
    setLoadingState("loaded");
    const soldItems =  items.filter(i => i.sold)
    setSold(soldItems)
    console.log(nfts)
    
   
 
  }

  //cancelling the listin of a particular item
  async function cancelListing(nft){
    console.log(nft.tokenId)
    console.log("cancelListing called")

    //requiring the wallet connection in the buying function because the user can surf the website without having the need to connect the wallet

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    
    //establishing a web 3 provider to handle the transactions
    const provider = new ethers.providers.Web3Provider(connection);

    //since an account address is required for the transactions, we import one with the getSigner
    const signer = provider.getSigner();

    //establishing a reference to the NFTMarket contract to call its functions
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);

    // let nftContract = new ethers.Contract(nftAddress, NFT.abi, signer);

    // let listingPrice = await nftContract.getListingPrice();
    // listingPrice = listingPrice.toString();

    const transaction = await contract.cancelListing(nft.tokenId)
    //{value : listingPrice}

    //wait for the transcation to complete 
    await transaction.wait();

    console.log("nft has been deleted");
    router.reload();


  }
  async function Relist(nft){
    console.log(nft.tokenId)
    console.log("cancelListing called")

    //requiring the wallet connection in the buying function because the user can surf the website without having the need to connect the wallet

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    
    //establishing a web 3 provider to handle the transactions
    const provider = new ethers.providers.Web3Provider(connection);

    //since an account address is required for the transactions, we import one with the getSigner
    const signer = provider.getSigner();

    //establishing a reference to the NFTMarket contract to call its functions
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);

    // let nftContract = new ethers.Contract(nftAddress, NFT.abi, signer);

    // let listingPrice = await nftContract.getListingPrice();
    // listingPrice = listingPrice.toString();

    const transaction = await contract.Relist(nft.tokenId)
    //{value : listingPrice}

    //wait for the transcation to complete 
    await transaction.wait();

    router.push("/homepage")


  }
  

  return (
    
    <div className="bg-b7  bg-fixed  bg-cover"  style={{height:900}}>
      <div className="flex justify">
      <div className="px-4" style ={{ maxWidth: "1600px"}}>
      {Boolean(!nfts.length) &&
        (
        
          <h1 className="ml-80 mb-1 pl-20 font-mono font-semibold text-5xl ">N
          <span
            className=" inline-flex h-20 mt-32 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform">
            o Items Created!
          </span>
      
        </h1>
          ) 
        }
        
      




        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              //returning a div for each nft
              <div key = {i} className="border-dotted border-black w-64 ml-2 group transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-105  duration-300 hover:bg-gradient-to-b hover:via-black hover:from-red-800 hover:to-black border shadow-md rounded-xl overflow-hidden   ...">
                <img className="mt-4 mx-4 w-56" src = {nft.image}></img>
                <div className="p-4 ">
                  <p style={{ height: '50px' }} className="transition ease-in-out delay-10 group-hover:text-white pt-1 text-2xl text-center ttext-white font-semibold">{nft.name}</p>                  
                  <div className="p-1 ">
                  {!nft.sold  && nft.owner!=nftMarketAddress &&
                  <>
                    <p style={{ height: '40px' }} className="mx-2 group-hover:hidden bg-gray-200  rounded-2xl text-md py-2 text-center font-bold text-red-700"> Listed For : {nft.price} Eth</p> 

                    <button type="button" className= "hover:animate-spin transition ease-in-out delay-150 duration-300 hidden group-hover:block text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-md px-12 ml-2 py-2 text-center mr-1  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 hover:scale-105" onClick={() => cancelListing(nft)}>Cancel Listing</button>
                  </>
                  }
                  {!nft.sold  && nft.owner==nftMarketAddress &&
                  <>
                    <p style={{ height: '40px' }} className="mx-2 group-hover:hidden bg-gray-200  rounded-2xl text-md py-2 text-center font-bold text-orange-600">Delisted</p> 

                    <button type="button" className= "hover:animate-spin transition ease-in-out delay-150 duration-300 hidden group-hover:block text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-md px-12 ml-2 py-2 text-center mr-1   hover:scale-105" onClick={() => Relist(nft)}>List to Market</button>
                  </>
                  }
                  {nft.sold && <p style={{ height: '40px' }} className="rounded-full text-md py-2 text-center font-bold bg-gray-200 group-hover:bg-black  text-green-700 group-hover:text-green-500">Sold For : {nft.price} Eth</p> }
                  </div>
                </div>
                
              </div>

            ))
          }
        </div>

      {/* creating another div for the display of sold  nfts */}
      
       
        {Boolean(sold.length) &&
        (
          
          <h1 className="p-5  text-3xl" >Items Sold:</h1>

          ) 
        }
      
        <div className="px-4" style ={{ maxWidth: "1600px"}}> 

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            sold.map((nft, i) => (
              //returning a div for each nft
              <div key = {i} className="border-dotted border-black w-64 ml-2 group transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-105  duration-300 hover:bg-gradient-to-b hover:via-black hover:from-red-800 hover:to-black border shadow-md rounded-xl overflow-hidden   ...">
                <img className="mt-4 mx-4 w-56" src = {nft.image}></img>
                <div className="p-4 ">
                  <p style={{ height: '40px' }} className="transition ease-in-out delay-10 group-hover:text-white pt-1 text-2xl text-center ttext-white font-semibold">{nft.name}</p>

                <div className="px-3 p-2 rounded-full bg-gray-200 mb-2" >
                {nft.sold && <p  className="text-md text-center font-bold text-green-700">Sold For: {nft.price} Eth</p> }
                </div>
                                   
                </div>
                
              </div>

            ))
          }
      
        </div>
        </div>
      
      
        
      

      </div>
    </div>

    
    </div>
  )
}

export default createrDashboard
