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
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const CollectionGrid = ({ data = [], buttonFunc, buttonName }) => {
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
                        No. {item.tokenId}
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
                  <Box>
                    <Typography
                      color={'primary'}
                      fontWeight={700}
                      variant={'caption'}
                      sx={{ textTransform: 'uppercase' }}
                    >
                      Free
                    </Typography>
                    <Typography variant={'h5'} fontWeight={700} marginY={1}>
                      {item.name}
                    </Typography>
                    <Typography color={'text.secondary'}>
                      {item.description}
                    </Typography>
                    <TwitterIcon
                      onClick={() => {
                        alert('Go to Twitter!');
                      }}
                      sx={{
                        cursor: 'pointer',
                        mt: { xs: 2, sm: 4 },
                        mr: { xs: 1, sm: 2 },
                      }}
                    />
                    <LinkedInIcon
                      onClick={() => {
                        alert('Go to LinkedIn!');
                      }}
                      sx={{
                        cursor: 'pointer',
                        mt: { xs: 2, sm: 4 },
                        mr: { xs: 1, sm: 2 },
                      }}
                    />
                    <LinkIcon
                      onClick={() => {
                        alert('Go to Website!');
                      }}
                      sx={{
                        cursor: 'pointer',
                        mt: { xs: 2, sm: 4 },
                        mr: { xs: 1, sm: 2 },
                      }}
                    />
                    <Link
                      onClick={() => {
                        buttonFunc(item);
                      }}
                      variant={'subtitle2'}
                      color={'primary'}
                      fontWeight={700}
                      underline={'hover'}
                      sx={{
                        textTransform: 'uppercase',
                        display: 'block',
                        cursor: 'pointer',
                        mt: { xs: 2, sm: 4 },
                      }}
                    >
                      {item.title}
                    </Link>
                  </Box>
                  <Box>
                    <Typography
                      color={'primary'}
                      variant={'subtitle2'}
                      fontWeight={600}
                      sx={{ textTransform: 'uppercase' }}
                    >
                      Level
                    </Typography>
                    <StarIcon
                      onClick={() => {
                        alert('Your level is 4.5');
                      }}
                      sx={{
                        cursor: 'pointer',
                      }}
                    />
                    <StarIcon
                      onClick={() => {
                        alert('Your level is 3.5');
                      }}
                      sx={{
                        cursor: 'pointer',
                      }}
                    />
                    <StarIcon
                      onClick={() => {
                        alert('Your level is 3.5');
                      }}
                      sx={{
                        cursor: 'pointer',
                      }}
                    />
                    <StarHalfIcon
                      onClick={() => {
                        alert('Your level is 3.5');
                      }}
                      sx={{
                        cursor: 'pointer',
                      }}
                    />
                    <StarOutlineIcon
                      onClick={() => {
                        alert('Your level is 3.5');
                      }}
                      sx={{
                        cursor: 'pointer',
                      }}
                    />
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

CollectionGrid.propTypes = {
  buttonFunc: PropTypes.func,
  data: PropTypes.array,
  buttonName: PropTypes.string,
};

export default CollectionGrid;
