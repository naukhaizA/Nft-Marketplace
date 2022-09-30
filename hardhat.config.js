require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers")
const fs = require("fs");
const { local } = require("web3modal");
const privateKey = fs.readFileSync(`.secret`).toString();
const projectID = "a6d6901188c14155ba0b7165bd21c54a"


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks:{
    hardhat: {
      chainId:1337
    },
    
    rinkeby:{
      url: `https://rinkeby.infura.io/v3/${projectID}`,
      accounts : [privateKey]
      
    },
    mainnet:{
      url : `https://mainnet.infura.io/v3/${projectID}`,
      accounts : [privateKey]
      
    }, 

    goerli:{
      url : `https://goerli.infura.io/v3/${projectID}`, //9aa3d95b3bc440fa88ea12eaa4456161
      accounts : [privateKey]
      
    }, 

    mumbai:{
      url : ` https://rpc-mumbai.maticvigil.com/`,
      accounts : [privateKey]
      
    },

    ropsten:{
      url : `https://ropsten.infura.io/v3/${projectID}`,
      accounts : [privateKey]
      
    } 
    
   
    
    
    
  },
  // API: {
  //   HTTPHeaders: {
  //     "Access-Control-Allow-Origin": [
  //       "*"
  //     ]
  //   }
  // },
  
  solidity: "0.8.9",
};
