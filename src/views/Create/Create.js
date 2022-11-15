import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Main from 'layouts/Main';
import Container from 'components/Container';
import Hero from 'components/Hero';
import Contact from 'components/Contact';
import { Form } from './components';
import Button from '@mui/material/Button';

export default function CreateItem() {
  const theme = useTheme();

  return (
    <Main>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'center', md: 'flex-start' }}
          justifyContent={{ xs: 'center' }}
        >
          <Button 
          variant="contained" 
          color="warning"
          onClick={(e) => {
            e.preventDefault();
            window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x5' }], // chainId must be in hexadecimal numbers
            });
          }}
          >
            Wrong network! Switch to Goerli Testnet
          </Button>
        </Box>
      <Container>
        <Hero title="Next generation NFTs." />
      </Container>
      <Container paddingY={'0 !important'}>
        <Form />
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
