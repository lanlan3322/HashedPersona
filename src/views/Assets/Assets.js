import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Main from 'layouts/Main';
import Container from 'components/Container';
import Hero from 'components/Hero';
import PortfolioGrid from 'components/PortfolioGrid';
import CollectionGrid from 'components/CollectionGrid';
import Contact from 'components/Contact';
import Typography from '@mui/material/Typography';

import axios from 'axios';
import Web3Modal from 'web3modal';
import { marketAddress } from '/Address';
import Marketplace from '/artifacts/contracts/HashedPersona.sol/HashedPersona.json';
import { ethers } from 'ethers';
import { Network, Alchemy } from 'alchemy-sdk';

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_PRIVATE_KEY,
  network: Network.ETH_GOERLI,
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
        //let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price: '0.001',
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          address: meta.data.address,
        };
        return item;
      }),
    );
    setNfts(items);

    //fetch all NFTs from opensea
    const nftsForOwner = await alchemy.nft.getNftsForOwner(addr);
    console.log(nftsForOwner);
    const collections = await Promise.all(
      nftsForOwner.ownedNfts.map(async (i) => {
        let collection = {
          title: i.title,
          tokenId: i.tokenId,
          type: i.tokenType,
          owner: addr,
          image: i.rawMetadata.image,
          tokenURI: i.tokenUri,
          timelastupdate: i.timeLastUpdated,
        };
        return collection;
      }),
    );

    setOpensea(collections);

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
        <Hero title="Create and share NFTs." />
      </Container>
      <Box marginBottom={4}>
        <Typography
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'medium',
          }}
          gutterBottom
          color={'secondary'}
          align={'center'}
        >
          Collection details
        </Typography>
        <Typography
          variant="h4"
          align={'center'}
          data-aos={'fade-up'}
          gutterBottom
          sx={{
            fontWeight: 700,
          }}
        >
          Browse my collections
        </Typography>
      </Box>
      <Container paddingY={'0 !important'} marginBottom={6}>
        <CollectionGrid data={nfts} buttonName="My collections" />
      </Container>
      <Box marginBottom={4}>
        <Typography
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'medium',
          }}
          gutterBottom
          color={'secondary'}
          align={'center'}
        >
          Heros
        </Typography>
        <Typography
          variant="h4"
          align={'center'}
          data-aos={'fade-up'}
          gutterBottom
          sx={{
            fontWeight: 700,
          }}
        >
          Browse my minted Heros
        </Typography>
      </Box>
      <Container paddingY={'0 !important'}>
        <PortfolioGrid
          data={nftsOpensea}
          buttonName="My Hashed Persona Heros"
        />
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
