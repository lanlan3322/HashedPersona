To deploy and verify smart contract:
Add your ethscan api key in hardhat.config.js
      goerli: 'YOUR KEY'
      
Then run the following commands:
```bash
npm install --save-dev @nomiclabs/hardhat-etherscan
npx hardhat run --network goerli scripts/deploy.js
npx hardhat verify --network goerli YOUR-CONTRACT-ADDRESS
```

To set up the repository and run the HashedPersona locally:
```bash
git clone https://github.com/lanlan3322/nft-minting-app
cd nft-minting-app
yarn
yarn run dev
```

Testing:

https://frolicking-lolly-aecefe.netlify.app

