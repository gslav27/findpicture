const style = {
  loadPreviousImagesRoot: {
    position: 'absolute',
    top: '0.8em',
    left: 0,
    right: 0,
    margin: '0 auto',
    width: '55%',
    maxWidth: 300,
    minWidth: 250,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    transition: 'all 0.5s ease',
    animation: 'loadPreviousImagesButton 0.5s ease-in',
  },
  loadPreviousImagesButton: {
    width: '90%',
    height: '100%',
    transition: 'all 0.25s ease',
    backgroundColor: 'rgba(255,235,59,0.95)',
    borderRadius: 2,
    boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
    fontSize: 19,
    '&:hover': {
      backgroundColor: 'rgba(255,235,59,1)',
      color: 'rgba(0,0,0,0.7)',
    }
  },
  loadPreviousImagesCloseButton: {
    width: '1em',
    height: '1em',
    margin: '-0.5em 0 0 -0.5em',
    alignSelf: 'start',
    '& > span': {
      backgroundColor: 'rgba(38, 50, 56, 0.8)',
      width: '1em',
      height: '1em',
      borderRadius: '50%',
      margin: '0 auto',
    },
    '& > span > svg': {
      fill: '#fff',
      width: '0.7em',
      height: '0.7em',
    },
    '&:hover': {
      '& > span': {
        backgroundColor: 'rgba(38, 50, 56, 1)',
      },
      '& > span > svg': {
        fill: 'rgba(255,235,59,1)',
      },
    }
  },
  loadPreviousImagesCloseButtonMobile: {
    width: '2em',
    height: '2em',
    margin: '-1em 0 0 -1em',
  }
}

export default style