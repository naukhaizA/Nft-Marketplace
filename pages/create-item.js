//purpose :
// 1- To upload a file to the ipfs server
// 2- To allow the user to list the uploaded file to the nft marketplace

import { ethers } from "ethers";
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { nftAddress, nftMarketAddress } from "../config";


//declaring the infura based ipfs client to upload and download the nfts from ipfs server

// const client =  IPFS.create("https://ipfs.infura.io/api/v0")
// const client = ipfsHttpClient({
//   host : "https://ipfs.infura.io/api/v0",
//   headers : new Headers(
//     {"Content-Type": "application/xml",
//      "Accept":"application/xml"}
//      )
//     })

function CreateItem() {
  //setting a state hook for the fileUrl variable that would store the url of the file uploaded on ipfs
  const [fileUrl, setFileUrl] = useState(null);

  const [invalidData, setInvalidData] = useState(false);

  //setting a state hook for the form by passing null default values
  const [formInput, updateFormInput] = useState({
    name: "",
    description: "",
    price: "",
  });

  // const file = useRef();

  //creating a reference to the router
  const router = useRouter();

  //creating a function that would create a ipfs based url for file and store it
  async function onChange(e) {
    
    // const file1 = e.target.files[0];
    // if(!file) {
    //   console.log(file, 'not found');
    //   return;
    // }
    try {

      var Image = new FormData();
      const imagefile = e.target.files[0];
      Image.append("image", imagefile)
      const response = await axios.post(
        "https://ipfs.infura.io:5001/api/v0/add",
        Image,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          auth: {
            username: "2EtPJiLLo547ir9xtKryFin1wGz",
            password: "b999f1efe075d11a070c91d121be8799",
          },
        }
      );

      // console.log("uploading", upload);

      console.log(response.data.Hash)
      const url = `https://ipfs.io/ipfs/${response.data.Hash}`;
      setFileUrl(url);
    } catch (e) {
      console.log("An error has occured:", e);
    }
    // const url = `https://infura-ipfs.io/ipfs/QmRK1jzVDJyDbMFo7Y1hhQMNM4PgXTLQy6fwGaDyLYyR91`
    // setFileUrl(url)
  }

  //validation of form and uploading file to ipfs
  async function main(e) {
    
    const { name, description, price } = formInput;
    // const name = e.target.value[0]
    // const description = e.target.value[1]
    // const price = e.target.value[2]

    //a form validation that would terminate if any of the fields is empty
    if (!name || !description || !price || !fileUrl) 
    {
      setInvalidData(true)
      return ;
    }

    const jsonData = JSON.stringify({
      name: name,
      description: description, 
      price: price,
      image: fileUrl
    })
    const blob = new Blob([jsonData], {
      type: 'application/json'
    })


    var data = new FormData();
    data.append("data", blob)
    // data.append("name", formInput.name)
    // data.append("description", formInput.description)
    // data.append("price", formInput.price)

    // console.log("data: ", data)
    
    try {
      //uploading the data to ipfs client

      // var data = new FormData(name);
      // data.append("image", fileUrl)
      var response = await axios.post(
        "https://ipfs.infura.io:5001/api/v0/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          auth: {
            username: "2EtPJiLLo547ir9xtKryFin1wGz",
            password: "b999f1efe075d11a070c91d121be8799",
          },
        }
      );
      console.log("response of data: ", response);

      const url = `ipfs.io/ipfs/${response.data.Hash}`;
      
      console.log("the url for the hash is: " + url);
      createSale(url);
    } catch (e) {
      console.log("An error has occured:", e);
    }

    // createSale(fileUrl)
  }

  //A function that would take url and mint an nft and list the item
  async function createSale(url) {
    //initializing the web3 object to connect wallet
    const web3Modal = new Web3Modal();

    //establishing a connection with the wallet
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);

    //getting the address of the wallet
    const signer = provider.getSigner();

    //importing the NFT contract
    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);

    //************MINTING THE NFT****************
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    //triggering the transcation event
    let event = tx.events[0];

    //storing the tokenId returned after the validation of the transaction
    let value = event.args[2];
    let tokenId = value.toNumber();

    console.log("tokenId: " + tokenId);

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    //importing the NFT Market contract in the same variable over writing it
    contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);

    //importing the listing price
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    //**********LISTING THE ITEM TO THE MARKET**************/

    transaction = await contract.createMarketItem(nftAddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();

    //redirecting to the homepage after the successful upload of the nft
    router.push("/homepage");
  }

  return (

     <div className="bg-b7  bg-fixed  bg-cover " style={{height:560}}>
      <div >
        <h1 className="ml-72 pt-12 pb-5 font-mono text-3xl">Create Your Own Nft And List It to Market!</h1>

      <div className="flex  justify-left ml-60">
        
        <div className="w-1/2 mt-1 flex flex-col pb-12">
          <input
            placeholder="Name"
            className=" mt-8 border border-gray-400  rounded-lg p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Creator Name"
            className="mt-2 border border-gray-400  rounded-lg p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder="Price in Eth"
            className="mt-2 border border-gray-400  rounded-lg p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          <input
            type="file"
            name="Asset"
            className="my-4"
            onChange={onChange}
          />
          {invalidData && (
             <h1 className="mb-1 font-bold font-mono">I
             <span
               className=" inline-flex h-10  overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform">
               nvalid Data!
             </span>
         
           </h1>
          )}
          
          <button
            onClick={main}
            className="hover:animate-spin  transition ease-in-out delay-150 duration-200 hover:scale-105 mr-2 px-7 py-2 rounded-3xl bg-[#98071f] text-white hover:bg-[#7F0519]"
          >
            Create NFT
          </button>
        </div>
          <div className="pb-3 pr-3 pl-7  mb-20   ml-10 ">

            {/* <h1 className="text-center text-xl ml-20 pl-5">Preview</h1> */}
            {!fileUrl &&
              <div >
                <h1 className="text-center  font-semibold text-xl  ml-4 pl-14">Preview</h1>
                <div className="border-dashed  border-black border-2 rounded-xl mt-5 ml-20 h-72 w-72 p-3 pl-1 bg-gray-100">
                  
                </div>
              </div> 
              }
            {fileUrl && (
              <>
              <h1 className="text-center font-semibold text-xl ml-20 pl-5">Preview</h1>
              <img className="border-dashed  border-black border-2 rounded-xl ml-20  h-72 w-72  bg-gray-100 .. text-center rounded mt-4"  src={fileUrl} />
              </>
                
              
              )}
            
        </div>
      </div>
      </div>
      
     </div> 
    )
  
}

export default CreateItem;
