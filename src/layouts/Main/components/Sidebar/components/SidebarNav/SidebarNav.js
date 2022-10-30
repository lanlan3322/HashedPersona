import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import NavItem from './components/NavItem';
import Login from 'web3/Login';

const SidebarNav = ({ pages }) => {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <Box>
      <Box width={1} paddingX={2} paddingY={1}>
        <Box
          display={'flex'}
          component="a"
          href="/"
          title="Virtualground"
          width={{ xs: 100, md: 120 }}
        >
          <Box
            component={'img'}
            src={
              mode === 'light'
              ? 'https://gateway.pinata.cloud/ipfs/QmSYARfdcTK1xYsGzuN8VQXJif5hZuLD2Tf7jHxH8qowdY'
              : 'https://gateway.pinata.cloud/ipfs/QmeUJDYN6Hx6ebV9j2oYnpqwPiHRLLp5XxZ51gfpYejo6s'
        }
            height={1}
            width={1}
          />
        </Box>
      </Box>
      <Box paddingX={2} paddingY={2}>
        <Box>
          <NavItem items={pages} />
        </Box>
      </Box>
    </Box>
  );
};

SidebarNav.propTypes = {
  pages: PropTypes.array.isRequired,
};

export default SidebarNav;
