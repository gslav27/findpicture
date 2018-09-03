import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


export const LoadingIcon = () => (
  <div className='loadingBarRoot'>
    <CircularProgress
      className='loadingBarProgress'
      size={50}
    />
  </div>
);


export const WaitResponse = () => (
  <div className='waitApiResponseImages'>
    <LoadingIcon />
  </div>
);


export const NoImages = ({ children }) => (
  <div className='noImagesWrapper'>
    <div className='noImages'>
      {children}
    </div>
  </div>
);
