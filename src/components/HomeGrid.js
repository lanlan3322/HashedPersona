import React from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const HomeGrid = ({ data = [], buttonFunc, buttonName }) => {
  const theme = useTheme();
  return (
    <Box>
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
          Popular NFTs
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
          Browse our popular NFTs
        </Typography>
      </Box>
      <Grid container spacing={{ xs: 2, sm: 4 }}>
        <Grid item xs={12} md={5}>
          {
            data.map((item, i) => (
              <Card
                key={i}
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 4 },
                  height: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ p: 4, mb: 2 }}>
                  <Box
                    component={LazyLoadImage}
                    effect="blur"
                    src={item.image}
                    width={1}
                    maxWidth={1}
                    sx={{
                      filter:
                        theme.palette.mode === 'dark'
                          ? 'brightness(0.5)'
                          : 'none',
                    }}
                  />
                </Box>
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
                      <Box marginY={2}>
                        <Typography
                          color={'primary'}
                          variant={'subtitle1'}
                          fontWeight={600}
                          sx={{ textTransform: 'uppercase' }}
                        >
                          Features
                        </Typography>
                  <Link
                    onClick={() => {
                      alert('Luck draw is enabled!');
                    }}
                    variant={'subtitle2'}
                    fontWeight={700}
                    underline={'hover'}
                    sx={{
                      textTransform: 'uppercase',
                      display: 'block',
                      cursor: 'pointer',
                      ml: { xs: 1, sm: 3 },
                      mt: { xs: 2, sm: 1 },
                    }}
                  >
                         Luck draw
                        <CheckCircleIcon
                        />
                  </Link>
                  <Link
                    onClick={() => {
                      alert('Physical meetup is enabled!');
                    }}
                    variant={'subtitle2'}
                    fontWeight={700}
                    underline={'hover'}
                    sx={{
                      textTransform: 'uppercase',
                      display: 'block',
                      cursor: 'pointer',
                      ml: { xs: 1, sm: 3 },
                      mt: { xs: 2, sm: 1 },
                    }}
                  >
                         Physical meetup
                        <CheckCircleIcon
                        />
                  </Link>
                  <Link
                    onClick={() => {
                      alert('Profit sharing is disabled!');
                    }}
                    variant={'subtitle2'}
                    fontWeight={700}
                    underline={'hover'}
                    sx={{
                      textTransform: 'uppercase',
                      display: 'block',
                      cursor: 'pointer',
                      ml: { xs: 1, sm: 3 },
                      mt: { xs: 2, sm: 1 },
                    }}
                  >
                         Profit sharing
                        <CancelIcon
                        />
                  </Link>
                      </Box>
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
                    {buttonName}
                  </Link>
                </Box>
              </Card>
            ))[0]
          }
        </Grid>

        <Grid item xs={12} md={7}>
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            <Grid item xs={12}>
              {
                data.map((item, i) => (
                  <Card
                    key={i}
                    elevation={3}
                    sx={{
                      p: { xs: 2, sm: 4 },
                      maxHeight: 1,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row-reverse' },
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ p: 4, mb: 2 }}>
                      <Box
                        component={LazyLoadImage}
                        effect="blur"
                        src={item.image}
                        width={1}
                        maxWidth={1}
                        sx={{
                          filter:
                            theme.palette.mode === 'dark'
                              ? 'brightness(0.5)'
                              : 'none',
                        }}
                      />
                    </Box>
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
                        fontSize="medium"
                        sx={{
                          mt: { xs: 2, sm: 4 },
                          mr: { xs: 1, sm: 2 },
                        }}
                      />
                      <LinkedInIcon
                        fontSize="medium"
                        sx={{
                          mt: { xs: 2, sm: 4 },
                          mr: { xs: 1, sm: 2 },
                        }}
                      />
                      <LinkIcon
                        sx={{
                          mt: { xs: 2, sm: 4 },
                          mr: { xs: 1, sm: 2 },
                        }}
                        fontSize="medium"
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
                        {buttonName}
                      </Link>
                    </Box>
                  </Card>
                ))[3]
              }
            </Grid>

            <Grid item xs={12}>
              {
                data.map((item, i) => (
                  <Card
                    elevation={3}
                    sx={{
                      p: { xs: 2, sm: 4 },
                      maxHeight: 1,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ p: 4, mb: 2 }}>
                      <Box
                        component={LazyLoadImage}
                        effect="blur"
                        src={item.image}
                        width={1}
                        maxWidth={1}
                        sx={{
                          filter:
                            theme.palette.mode === 'dark'
                              ? 'brightness(0.5)'
                              : 'none',
                        }}
                      />
                    </Box>
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
                        fontSize="medium"
                        sx={{
                          mt: { xs: 2, sm: 4 },
                          mr: { xs: 1, sm: 2 },
                        }}
                      />
                      <LinkedInIcon
                        fontSize="medium"
                        sx={{
                          mt: { xs: 2, sm: 4 },
                          mr: { xs: 1, sm: 2 },
                        }}
                      />
                      <LinkIcon
                        sx={{
                          mt: { xs: 2, sm: 4 },
                          mr: { xs: 1, sm: 2 },
                        }}
                        fontSize="medium"
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
                        {buttonName}
                      </Link>
                    </Box>
                  </Card>
                ))[2]
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

HomeGrid.propTypes = {
  buttonFunc: PropTypes.func,
  data: PropTypes.array,
  buttonName: PropTypes.string,
};

export default HomeGrid;
