import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import LinkIcon from '@mui/icons-material/Link';
import Link from '@mui/material/Link';
import PersonIcon from '@mui/icons-material/Person';

const PortfolioGrid = ({ data = [], buttonFunc, buttonName }) => {
  const theme = useTheme();

  return (
    <Box>
      <Grid container spacing={4}>
        {data.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box display={'block'} width={1} height={1}>
              <Box
                key={i}
                component={Card}
                width={1}
                height={1}
                display={'flex'}
                flexDirection={'column'}
              >
                <CardMedia
                  title={item.name}
                  image={item.image}
                  sx={{
                    position: 'relative',
                    height: { xs: 240, sm: 340, md: 280 },
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    position={'absolute'}
                    bottom={0}
                    padding={2}
                    width={1}
                  >
                    <Box
                      padding={1}
                      bgcolor={'background.paper'}
                      boxShadow={1}
                      borderRadius={2}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        Hero No. {item.tokenId}
                      </Typography>
                    </Box>
                    <Box
                      padding={1}
                      bgcolor={'background.paper'}
                      boxShadow={1}
                      borderRadius={2}
                    >
                      <Box
                        component={'svg'}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width={16}
                        height={16}
                        color={'primary.main'}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography
                    variant={'h6'}
                    align={'left'}
                    sx={{ fontWeight: 700 }}
                  >
                    {item.name}
                  </Typography>
                  <Box display={'flex'} alignItems={'center'} marginY={2}>
                    <Typography variant={'subtitle2'} color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box
                      component={'svg'}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width={16}
                      height={16}
                      marginRight={1}
                    >
                      <LinkIcon />
                    </Box>
                    <Typography variant={'subtitle2'} color="text.secondary">
                      <Link
                        href={
                          'https://testnets.opensea.io/assets/goerli/0xba00184dd17576506e28948609b9cc22d753f69e/' +
                          item.tokenId
                        }
                        underline="none"
                      >
                        {item.title}
                      </Link>
                    </Typography>
                  </Box>
                  <Box display={'flex'} alignItems={'right'} marginY={2}>
                    <Box
                      component={'svg'}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width={16}
                      height={16}
                      marginRight={1}
                    >
                      <PersonIcon />
                    </Box>
                    <Typography variant={'subtitle2'} color="text.secondary">
                      <Link
                        href={
                          'https://goerli.etherscan.io/address/' +
                          item.owner
                        }
                        underline="none"
                      >
                        {item.owner.substring(0,8)+'......'+item.owner.substring(36)}
                      </Link>
                    </Typography>
                  </Box>
                </CardContent>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

PortfolioGrid.propTypes = {
  buttonFunc: PropTypes.func,
  data: PropTypes.array,
  buttonName: PropTypes.string,
};

export default PortfolioGrid;
