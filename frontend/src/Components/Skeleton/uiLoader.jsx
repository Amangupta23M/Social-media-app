import * as React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
export default function UILoader(props) {
  return (
    <Box sx={{ width:props.width,display:'flex',flexDirection:'column',justifyContent:'center' }}>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </Box>
  );
}