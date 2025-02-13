import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { marketAddress, herosAddress } from '/Address';
import { Network, Alchemy } from 'alchemy-sdk';


const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [luckynumber, setLuckynumber] = useState(0);
  const [totalnumber, setTotalnumber] = useState(0);
  const [imgLink, setImglink] = useState('');
  const [luckywinner, setLuckyWinner] = useState(0);
  const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_PRIVATE_KEY,
    network: Network.ETH_GOERLI,
  };
  const alchemy = new Alchemy(settings);  
  async function LuckyDraw() {
    try {
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
      const count = collections.length;
      const rand = Math.floor(Math.random() * count);
      setTotalnumber(count);
      setLuckynumber(rand);
      setLuckyWinner(collections[rand-1].owner);
      setImglink(collections[rand-1].image);
    } catch (error) {
      setLoading(false);
      console.log('Error in LuckyDraw!');
    }
    setLoading(false);
  }
  
  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          fontWeight={700}
          variant={'h4'}
          align={'center'}
          gutterBottom
        >
          Draw a lucky winner from Hashed Heros collectors
        </Typography>
        <Typography
          variant={'h6'}
          component={'p'}
          color={'text.secondary'}
          align={'center'}
        >
          Reward NFT collectors from this lucky draw
        </Typography>
      </Box>
      <Box maxWidth={600} margin={'0 auto'}>
        <Box
          component={'form'}
          noValidate
          autoComplete="off"
          sx={{
            '& .MuiInputBase-input.MuiOutlinedInput-input': {
              bgcolor: 'background.paper',
            },
          }}
        >
          <Box
            display="flex"
            justifyContent={{ xs: 'center' }}
          >
            <Box
              component={TextField}
              label="Hashed Persona Heros"
              variant="outlined"
              color="primary"
              fullWidth
              height={54}
              marginRight={{ md: 4 }}
              sx={{
                maxWidth: 442,
              }}
            />
              <LoadingButton
              variant="contained"
              color="primary"
              size="medium"
                endIcon={<SendIcon />}
                type={'Button'}
                onClick={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  LuckyDraw();
                }}
                loading={loading}
                loadingPosition={'end'}
              >
                Luck Draw
              </LoadingButton>
         </Box>
        </Box>
        <Box marginTop={8}>
        <Typography
          variant={'h5'}
          component={'p'}
          color={'text.secondary'}
          align={'center'}
        >
          {totalnumber>0?
          'Hero No. ' + luckynumber + ' is the lucky winner!'
        : 'No lucky draw available now!'}
        </Typography>
      </Box>
        <Box
            component={'img'}
            align={'center'}
            src={luckynumber>0?imgLink:''}
          />
      </Box>
      <Box marginTop={8}>
        <Typography
          variant={'h5'}
          component={'p'}
          color={'text.secondary'}
          align={'center'}
        >
          {totalnumber>0?
          'Owner: ' + luckywinner
        : ''}
        </Typography>
      </Box>
    </Box>
  );
};

export default Contact;
