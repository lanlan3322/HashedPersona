import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

import web3 from 'web3';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { marketAddress } from '/Address';
import Marketplace from '/artifacts/contracts/HashedPersona.sol/HashedPersona.json';

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name too short')
    .max(100, 'Name too long')
    .required('Please specify the name'),
  description: yup
    .string()
    .trim()
    .max(1000, 'Should be less than 1000 chars')
    .required('Please write description'),
  amount: yup
    .string()
    .min(1, 'Minimum 1 in the collection')
    .required('Please specify how many NFTs in this collection'),
  price: yup.string().min(0, 'Price should be minimum 0'),
  address: yup
    .string()
    .min(0, 'Price should be minimum 3')
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!',
    ),
});

const Form = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      amount: '',
      twitter: '',
      linkedin: '',
      website: '',
      price: '0',
      address: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setLoading(true);
      createMarket();
    },
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const projectId = process.env.INFURA_IPFS_ID;
  const projectSecret = process.env.INFURA_IPFS_SECRET;

  const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  async function createSale(url) {
    if (fileUrl) {
      const web3Modal = new Web3Modal({
        network: 'goerli',
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const price = web3.utils.toWei(formik.values.price, 'ether');
      let contract = new ethers.Contract(
        marketAddress,
        Marketplace.abi,
        signer,
      );
      let transaction = await contract.createTokenCollection(
        url,
        formik.values.amount,
      );

      try {
        await transaction.wait();
        //console.log('10.1 transaction.wait------success')
      } catch (error) {
        //console.log('10.2 transaction.wait------error', error)
        alert('Error in creating NFT! Please try again.');
        setLoading(false);
      }
      alert('NFT created successfully');
      setLoading(false);
    }

    if (!fileUrl) return setAlertOpen(true);
  }

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
      console.log('----------------', fileUrl);
    } catch (error) {
      console.log('Error uploading file: ', error);
      setLoading(false);
    }
  }

  async function createMarket() {
    const {
      name,
      description,
      amount,
      twitter,
      linkedin,
      website,
      price,
      address,
    } = formik.values;
    if (
      !name ||
      !description ||
      !amount ||
      !twitter ||
      !linkedin ||
      !website ||
      !fileUrl
    )
      return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      amount,
      twitter,
      linkedin,
      website,
      price,
      address,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      createSale(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}
              fontWeight={700}
            >
              <AttachFileIcon fontSize="medium" />
              Upload file *
            </Typography>
            <input type="file" name={'file'} onChange={onChange} />
            {fileUrl && (
              <Alert
                severity="success"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setAlertOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mt: 1 }}
              >
                File uploaded successfully!
              </Alert>
            )}
            <Box sx={{ width: '100%' }}>
              <Collapse in={alertOpen}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlertOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  Please upload a file!
                </Alert>
              </Collapse>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Hashed Persona Collection Name
            </Typography>
            <TextField
              label="Name of your NFT *"
              variant="outlined"
              name={'name'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Description of this collection
            </Typography>
            <TextField
              label="Description *"
              variant="outlined"
              name={'description'}
              multiline
              rows={3}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.description}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              NFT Quantity in this collection
            </Typography>
            <TextField
              label="How many NFTs in this collection"
              variant="outlined"
              name={'amount'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.amount}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Twitter
            </Typography>
            <TextField
              label="Twitter"
              variant="outlined"
              name={'twitter'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.twitter}
              error={formik.touched.twitter && Boolean(formik.errors.twitter)}
              helperText={formik.touched.twitter && formik.errors.twitter}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              LinkedIn
            </Typography>
            <TextField
              label="LinkedIn"
              variant="outlined"
              name={'linkedin'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.linkedin}
              error={formik.touched.linkedin && Boolean(formik.errors.linkedin)}
              helperText={formik.touched.linkedin && formik.errors.linkedin}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Website
            </Typography>
            <TextField
              label="Website address"
              variant="outlined"
              name={'website'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.website}
              error={formik.touched.website && Boolean(formik.errors.website)}
              helperText={formik.touched.website && formik.errors.website}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Link to this collection
            </Typography>
            <TextField
              label="Link to your NFT"
              variant="outlined"
              name={'address'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.address}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>
          <Grid item container xs={12}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretched', sm: 'center' }}
              justifyContent={'space-between'}
              width={1}
              margin={'0 auto'}
            >
              <LoadingButton
                endIcon={<SendIcon />}
                size={'large'}
                variant={'contained'}
                type={'submit'}
                loading={loading}
                loadingPosition={'end'}
              >
                Create
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Form;
