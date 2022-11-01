import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Main from 'layouts/Main';
import Container from 'components/Container';
import Hero from 'components/Hero';
import PortfolioGrid from 'components/PortfolioGrid';
import Contact from 'components/Contact';

import axios from 'axios';
import Web3Modal from 'web3modal';
import { marketAddress } from '/Address';
import Marketplace from '/artifacts/contracts/HashedPersona.sol/HashedPersona.json';
import { ethers } from 'ethers';

const { Network, Alchemy } = require("alchemy-sdk");

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.REACT_APP_PRIVATE_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_GOERLI, // Replace with your network.
  maxRetries: 10,
};
const alchemy = new Alchemy(settings);

export default function CreateItem() {
  const theme = useTheme();
  const [nfts, setNfts] = useState([]);
  const [nftsOpensea, setOpensea] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);
  
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();

    const marketContract = new ethers.Contract(
      marketAddress,
      Marketplace.abi,
      signer,
    );
    const data = await marketContract.fetchMyNFTs(addr);

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      }),
    );
    setNfts(items);

    //fetch all NFTs from opensea
    const nftsForOwner = await getNftsForOwner(alchemy, addr);
    const collections = await Promise.all(
      nftsForOwner.ownedNfts.map(async (i) => {
        const response = await getNftMetadata(
          alchemy,
          i.contract.address,
          i.nft.tokenId
        );  
        let collection = {
          title: response.title,
          tokenId: i.nft.tokenId.toNumber(),
          type: response.tokenType,
          owner: addr,
          image: response.rawMetadata.image,
          tokenURI: response.tokenUri.gateway,
          timelastupdate: response.timeLastUpdated,
        };
        return collection;
      }),
    );

    setOpensea(collection);

    setLoaded(true);
  }

  if (loaded && !nfts.length && !nftsOpensea.length) {
    return (
      <Main>
        <Container>
          <Hero title="No Assets Owned" />
        </Container>
        <Box
          position={'relative'}
          marginTop={{ xs: 4, md: 6 }}
          sx={{
            backgroundColor: theme.palette.alternate.main,
          }}
        >
          <Box
            component={'svg'}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 1920 100.1"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
              zIndex: 2,
              width: 1,
            }}
          >
            <path
              fill={theme.palette.alternate.main}
              d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
            ></path>
          </Box>
        </Box>
        <Container>
          <Contact />
        </Container>
      </Main>
    );
  }

  return (
    <Main>
      <Container>
        <Hero title="A platform to create and trade NFTs." />
      </Container>
      <Container paddingY={'0 !important'}>
        <PortfolioGrid data={nfts} buttonName="List For Sale" />
      </Container>
      <Container paddingY={'0 !important'}>
        <PortfolioGrid data={nftsOpensea} buttonName="My Hashed Persona Heros" />
      </Container>
      <Box
        position={'relative'}
        marginTop={{ xs: 4, md: 6 }}
        sx={{
          backgroundColor: theme.palette.alternate.main,
        }}
      >
        <Box
          component={'svg'}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: 1,
          }}
        >
          <path
            fill={theme.palette.alternate.main}
            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
          ></path>
        </Box>
        <Container>
          <Contact />
        </Container>
      </Box>
    </Main>
  );
}
