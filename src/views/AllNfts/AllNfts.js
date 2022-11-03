import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Main from 'layouts/Main';
import Container from 'components/Container';
import Contact from 'components/Contact';
import PortfolioGrid from 'components/PortfolioGrid';
import CollectionGrid from 'components/CollectionGrid';
import Typography from '@mui/material/Typography';

import axios from 'axios';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { marketAddress, herosAddress } from '/Address';
import Marketplace from '/artifacts/contracts/HashedPersona.sol/HashedPersona.json';
import { Network, Alchemy } from 'alchemy-sdk';

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_PRIVATE_KEY,
  network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(settings);
const AllNfts = () => {
  const theme = useTheme();
  const [nfts, setNfts] = useState([]);
  const [nftsOpensea, setOpensea] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const marketContract = new ethers.Contract(
      marketAddress,
      Marketplace.abi,
      provider,
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await marketContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
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
    const nftsForOwner = await alchemy.nft.getNftsForContract(herosAddress);
    console.log(nftsForOwner);
    const collections = await Promise.all(
      nftsForOwner.nfts.map(async (i) => {
        let collection = {
          title: i.title,
          tokenId: i.tokenId,
          type: i.tokenType,
          owner: i.contract.address,
          image: i.rawMetadata.image,
          tokenURI: i.tokenUri,
          timelastupdate: i.timeLastUpdated,
        };
        return collection;
      }),
    );

    console.log('collections: ', collections);
    setOpensea(collections);
    setLoaded(true);
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      marketAddress,
      Marketplace.abi,
      signer,
    );
    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await marketContract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }

  if (loaded && !nfts.length && !nftsOpensea.length)
    return (
      <Main>
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
  return (
    <Main>
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
          Popular Collections
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
          Browse our popular NFT collections
        </Typography>
      </Box>
      <Container>
        <CollectionGrid data={nfts} buttonName={'Mint'} buttonFunc={buyNft} />
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
          Popular Heros
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
          Browse our popular minted Heros
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
};

export default AllNfts;
