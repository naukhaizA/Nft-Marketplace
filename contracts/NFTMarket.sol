// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard
{
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;
  Counters.Counter private _delistedItems;

  address payable owner;
  uint listingPrice = 0.000000025 ether;

  constructor(){
    owner = payable(msg.sender);
  }

  struct MarketItem { 
      uint itemId;
      address nftContract;
      uint tokenId;
      address payable seller;
      address payable owner;
      uint price;
      bool sold;
  }

  mapping(uint => MarketItem) private idToMarketItem;

  event MarketItemCreated(
    uint indexed itemId,
    address indexed nftContract,
    uint indexed tokenId,
    address seller,
    address owner,
    uint price,
    bool sold
  );

  function getListingPrice() public view returns(uint)
  {
    return listingPrice;
  }

  function createMarketItem(
    address nftContract,
    uint tokenId,
    uint price
  )
  public payable nonReentrant{
    require(price > 0, "price must be at least 1 unit");
    require (msg.value == listingPrice, "price must be equal to listing Price");

    _itemIds.increment();
    uint itemId = _itemIds.current();
    idToMarketItem[tokenId] =  MarketItem(
        itemId,
        nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(0)),
        price,
        false
      );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId, 
      nftContract, 
      tokenId, 
      msg.sender,
      address(0), 
      price, 
      false
      );


  }

  function createMarketSale(
    address nftContract,
    uint itemId
  ) public payable {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;

    //checking whether the buyer is paying the full amount 
    require(msg.value == price, "Please submit the required amount");

    //sending the money to the seller
    idToMarketItem[itemId].seller.transfer(msg.value);

    //transfering the ownership of the nft by setting the current paying wallet address to owner
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _itemsSold.increment();
    
    //sending the nft to the buyer
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    
    
    //transfering the listing fee to the owner of the contract (marketplace)
    payable(owner).transfer(listingPrice);

  }

    // A function that would fetch the listed items in the market
    function fetchMarketItems() public view returns (MarketItem[] memory)
    {
      uint itemCount = _itemIds.current();
      uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      //making an array to store and filter those items that haven't been sold yet
      MarketItem[] memory  items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++){
        if (idToMarketItem[i+1].owner == address(0)  ){ //&& idToMarketItem[i+1].seller != address(0)
          //store the id of the current identified unsold item
          uint currentId = idToMarketItem[i+1].itemId;

          //fetching the unsold item and storing in a  temporary MarketItem type object

          MarketItem storage currentItem = idToMarketItem[currentId];
          
          // storing the unsold item in the temporary made items array

          items[currentIndex] = currentItem;
          currentIndex++;

        }
      }
        return items;

    }


    // A Fucntion that would return those nfts that the user has purchased himself
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _itemIds.current();
      uint itemCount = 0 ;
      uint currentIndex = 0;

      //looping through all the items of the marketplace and checking which one is owned by the user
      for (uint i = 0; i < totalItemCount; i++){
        if (idToMarketItem[i+1].owner == (msg.sender)){     //verifying that user is the owner of that nft
          itemCount++;
        }
      }


      //making a temporary array to hold the collection of nfts owned by the user
      MarketItem[] memory  items = new MarketItem[](itemCount);

      for (uint i = 0; i < totalItemCount; i++){
        if (idToMarketItem[i+1].owner == (msg.sender)){


          //store the id of the current identified owned nft
          uint currentId = idToMarketItem[i+1].itemId;

          //fetching the nft item and storing in a  temporary MarketItem type object

          MarketItem storage currentItem = idToMarketItem[currentId];
          
          // storing the nft item in the temporary made items array

          items[currentIndex] = currentItem;
          currentIndex++;

        }
      }
        return items;

    }


    // A Fucntion that would return those nfts that the user has created(sold/unsold) himself
    // 
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
      uint totalItemCount = _itemIds.current();
      uint itemCount = 0 ;
      uint currentIndex = 0;

      //looping through all the items of the marketplace and checking which one is created by the user to get the item count
      for (uint i = 0; i < totalItemCount; i++){
        if (idToMarketItem[i+1].seller == (msg.sender)){     //verifying that user is the seller of that nft
          itemCount++;
        }
      }
      MarketItem[] memory  items = new MarketItem[](itemCount);

      for (uint i = 0; i < totalItemCount; i++){
        if (idToMarketItem[i+1].seller == (msg.sender)){     //verifying that user is the seller of that nft

         //store the id of the current identified owned nft
          uint currentId = idToMarketItem[i+1].itemId;

          //fetching the nft item and storing in a  temporary MarketItem type object

          MarketItem storage currentItem = idToMarketItem[currentId];
          
          // storing the nft item in the temporary made items array

          items[currentIndex] = currentItem;
          currentIndex++;  
        }
      }
      return items;
    }


    // A function to cancel the listed item's listing by changing its owner back to its seller

    function cancelListing(

    uint itemId
  ) public payable {

    //transfering the ownership of the nft by setting the current paying wallet address to owner
    idToMarketItem[itemId].owner = payable(address(this));
   

    _itemsSold.increment();
    

    

  }
    function Relist(

    uint itemId
  ) public payable {

    //transfering the ownership of the nft by setting the current paying wallet address to owner
    idToMarketItem[itemId].owner = payable(address(0));
   

    _itemsSold.decrement();
    

    

  }
  }




