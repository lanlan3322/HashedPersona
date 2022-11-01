import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';

import Main from 'layouts/Main';
import Container from 'components/Container';
import HomeGrid from 'components/HomeGrid';
import Contact from 'components/Contact';
import Hero from './components/Hero';
import FeaturedNfts from './components/FeaturedNfts';
import TextField from '@mui/material/TextField';

import axios from 'axios';
import web3 from 'web3';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { marketAddress } from '/Address';
import Marketplace from '/artifacts/contracts/HashedPersona.sol/HashedPersona.json';

const Home = () => {
  const theme = useTheme();
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click here to mint your hero`);

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
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
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
    {
      console.log('items: ', items);
    }
    setNfts(items);
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

  async function MintHPHeros() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const abi = [
      "function paidMint() payable"
    ];
    const marketContract = new ethers.Contract(
      "0xBA00184dD17576506e28948609b9CC22d753f69e",
      abi,
      signer,
    );
    setClaimingNft(true);
    setFeedback(
      `Please wait ... minting now ... ...`
    );
    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits('0.01', 'ether');
    const transaction = await marketContract.paidMint({
      value: price,
    });
    await transaction.wait();
    setFeedback(
      `Click here to mint your hero`
    );
    setClaimingNft(false);
  }
  
  if (loaded && !nfts.length)
    return (
      <Main>
    <Box
    display="flex"
    flexDirection={{ xs: 'column', md: 'row' }}
    alignItems={{ xs: 'center', md: 'flex-start' }}
    justifyContent={{ xs: 'center' }}
    >
    <Box
      component={'img'}
      src={'https://i.seadn.io/gae/wHDa50QAR3o-hR9JPuQ9z7fUunpgSH-UzdtzBe07hM7jLuOPEYGq7ToLE4e7W1LaQQFcvb9lwfjC6cnXB6deAhc7c2Oe9vTlPLLrWw?auto=format&w=1000'
      }
      height={54}
      sx={{
        maxWidth: 422,
      }}
    />
    <Box
      component={Button}
      variant="contained"
      color="primary"
      size="large"
      height={54}
      marginLeft={{ md: 2 }}
      href="https://testnets.opensea.io/collection/hashed-persona-heros-alpha-v2"
    >
      View Hashed Persona Super Heros
    </Box>
    <Box
      disabled={claimingNft ? true : false}
      component={Button}
      variant="contained"
      color="primary"
      size="large"
      height={54}
      marginLeft={{ md: 2 }}
      onClick={(e) => {
        e.preventDefault();
        MintHPHeros();
      }}
    >
      {feedback}
    </Box>
  </Box>
        <Container>
          <Hero />
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
  return (
    <Main>
    <Box
    display="flex"
    flexDirection={{ xs: 'column', md: 'row' }}
    alignItems={{ xs: 'center', md: 'flex-start' }}
    justifyContent={{ xs: 'center' }}
    >
    <Box
      component={'img'}
      src={'https://i.seadn.io/gae/wHDa50QAR3o-hR9JPuQ9z7fUunpgSH-UzdtzBe07hM7jLuOPEYGq7ToLE4e7W1LaQQFcvb9lwfjC6cnXB6deAhc7c2Oe9vTlPLLrWw?auto=format&w=1000'
      }
      height={54}
      sx={{
        maxWidth: 422,
      }}
    />
    <Box
      component={Button}
      variant="contained"
      color="primary"
      size="large"
      height={54}
      marginLeft={{ md: 2 }}
      href="https://testnets.opensea.io/collection/hashed-persona-heros-alpha-v2"
    >
      View Hashed Persona Super Heros
    </Box>
    <Box
      disabled={claimingNft ? true : false}
      component={Button}
      variant="contained"
      color="primary"
      size="large"
      height={54}
      marginLeft={{ md: 2 }}
      onClick={(e) => {
        e.preventDefault();
        MintHPHeros();
      }}
    >
      {feedback}
    </Box>
  </Box>
      <Container>
        <Hero />
      </Container>
      <Container paddingY={3}>
        <HomeGrid data={nfts} buttonName={'Buy'} buttonFunc={buyNft} />
      </Container>
      <Container>
        <FeaturedNfts data={nfts} buttonFunc={buyNft} />
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

export default Home;
