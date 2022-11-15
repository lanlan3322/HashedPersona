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

import axios from 'axios';
import web3 from 'web3';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { marketAddress, herosAddress } from '/Address';
import Marketplace from '/artifacts/contracts/HashedPersona.sol/HashedPersona.json';

const Home = () => {
  const theme = useTheme();
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Mint your hero (0.01 GoerliETH)`);

  useEffect(() => {
    loadNFTs();
    window.ethereum &&
          window.ethereum.on("accountsChanged", () => window.location.reload());
  }, []);

  async function loadNFTs() {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
          window.location.reload();
      }
    });

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      marketAddress,
      Marketplace.abi,
      provider,
    );
    try {
      const data = await marketContract.fetchMarketItems();

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await marketContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          //let price = ethers.utils.formatUnits('0.001', 'ether');
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
      console.log('items: ', items);
      setNfts(items);
      setLoaded(true);
    } catch (error) {
      console.log('Error in fetchMarketItems!');
    }
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
    //const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await marketContract.collect(nft.tokenId);
    await transaction.wait();
    if (transaction) {
      alert('You have mint the token for this collection successfully.');
    } else {
      alert('Error in creating NFT! Please try again.');
    }
    loadNFTs();
  }

  async function MintHPHeros() {
    if (!window.ethereum) {
      alert("💡 Please connect your Metamask wallet!")
      setFeedback(`Mint your hero (0.01 GoerliETH)`);
      setClaimingNft(false);
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    if (chainId !== 5) {
      alert("💡 Please switch to Goerli Testnet!")
      setFeedback(`Mint your hero (0.01 GoerliETH)`);
      setClaimingNft(false);
      return;
    }

    const signer = provider.getSigner();
    const abi = ['function paidMint() payable'];
    const marketContract = new ethers.Contract(herosAddress, abi, signer);
    console.log('Connected Account:', await signer.getAddress());
    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits('0.01', 'ether');
    try {
      const transaction = await marketContract.paidMint({
      value: price,
      });
      await transaction.wait();
    } catch (error) {
      if (error.code === "ACTION_REJECTED") {
        alert('User rejected request!');
      }
      else if (error.code === "INSUFFICIENT_FUNDS") {
        alert('Not enough ETH to mint!');
      }
      else{
        alert('Error in creating NFT! Please try again.');
      }
      setFeedback(`Mint your hero (0.01 GoerliETH)`);
      setClaimingNft(false);
    }
    setFeedback(`Mint your hero (0.01 GoerliETH)`);
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
            src={
              'https://i.seadn.io/gae/wHDa50QAR3o-hR9JPuQ9z7fUunpgSH-UzdtzBe07hM7jLuOPEYGq7ToLE4e7W1LaQQFcvb9lwfjC6cnXB6deAhc7c2Oe9vTlPLLrWw?auto=format&w=1000'
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
              setFeedback(`Please wait ... minting now ... ...`);
              setClaimingNft(true);
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
          src={
            'https://i.seadn.io/gae/wHDa50QAR3o-hR9JPuQ9z7fUunpgSH-UzdtzBe07hM7jLuOPEYGq7ToLE4e7W1LaQQFcvb9lwfjC6cnXB6deAhc7c2Oe9vTlPLLrWw?auto=format&w=1000'
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
        <HomeGrid data={nfts} buttonName={'Mint'} buttonFunc={buyNft} />
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
