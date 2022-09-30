const {expect} = require ("chai")
const { ethers } = require("hardhat")

describe("***********IMPROVISED OPENSEA************* ", function () {

  //deploying the nft marketplace contract
  it("should create and execute sales ",  async function () {
    //fetching the contract
    const Market = await ethers.getContractFactory("NFTMarket")
    //deploying the contract
    const market = await Market.deploy()
    await market.deployed();
    //fetching the address of the nft marketplace contract
    const marketAddress = market.address;

    console.log("Market address: " + marketAddress)

    //deploying the nft contract in the same manner

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed();

    const nftContractAddress = nft.address;

    console.log("NFT contract address: " + nftContractAddress)

    //fetching the listing price from the market place contract using the premade getter

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString();

    //setting the min auction price

    const auctionPrice = ethers.utils.parseUnits("1", "ether")

    //deploying the custom tokens for the nft at a random address

    //getting the local account addresses for the testing

    //const [seller, buyer1, buyer2, buyer3, buyer4, buyer5] = await ethers.getSigners()

    //getting the local account addresses for the testing
    
    const [acc1, acc2] = await ethers.getSigners()

    console.log(`Account 1 : ${acc1.address}`)
    console.log(`Account 2 : ${acc2.address}`)
    

    await nft.createToken("ipfs://QmRK1jzVDJyDbMFo7Y1hhQMNM4PgXTLQy6fwGaDyLYyR91")
    await nft.createToken("ipfs://QmcynGm4545JYM7hg75hbz6g3r94iVdsbZTgbqYNysehtP")
    await nft.createToken("ipfs://QmcynGm4545JYM7hg75hbz6g3r94iVdsbZTgbqYNysehtP")


    
    
    
    //fetching the No of items that were created by "seller" before listing
    
    const noOfNfts = await nft.balanceOf(acc1.address)
    console.log("*****************NO OF ITEMS CREATED (By ACC1) ****************")
    console.log("")
    console.log("")
    console.log("")
    console.log("    ",noOfNfts)
    console.log("")
    console.log("")
    console.log("")
    
    //listing one of the nfts created by acc1 to the market place
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value : listingPrice} )
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value : listingPrice} )
    await market.createMarketItem(nftContractAddress, 3, auctionPrice, {value : listingPrice} )
    
    // await nft.safeMint(seller, "https://ipfs.io/ipfs/QmcynGm4545JYM7hg75hbz6g3r94iVdsbZTgbqYNysehtP?filename=0%20(8).png")

    //fetching the items that are unsold and still listed 
    const item2 = await market.fetchMarketItems()
    console.log("*****************ITEMS LISTED TO MARKET(By ACC1) ****************")
    console.log(item2)

    //selling the created market item to the second address of the array that is "buyer1"

    await market.connect(acc2).createMarketSale(nftContractAddress, 1, {value : auctionPrice})


    //checking if the "Buyer1" has actually purchased the item or not 

    console.log("****************************************************")
    console.log("")
    console.log("")
    console.log("Transfering the ownership of NFT 1 to ACC2")
    console.log("")
    console.log("")
    console.log("****************************************************")

    const items3 = await market.connect(acc2).fetchMyNFTs()

    console.log("*****************ITEMS OWNED BY ACC2****************")
    console.log(items3)
    
    console.log("*****************ITEMS LISTED BY ACC1(SOLD/UNSOLD)****************")
    const items4 = await market.connect(acc1).fetchItemsCreated()
    console.log(items4)

    const item6 = await market.fetchMarketItems()
    console.log("*****************ITEMS LISTED TO MARKET(By ACC1) ****************")
    console.log(item6)

    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("*****************CANCELLING THE LISTING OF 1ST ITEM FROM MARKET****************")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    await market.cancelListing(2)


    const item5 = await market.fetchMarketItems()
    console.log("*****************ITEMS LISTED TO MARKET(By ACC1) ****************")
    console.log(item5)

    console.log("*****************ITEMS LISTED BY ACC1(SOLD/UNSOLD)****************")
    const items7 = await market.connect(acc1).fetchItemsCreated()
    console.log(items7)
  



  })
})