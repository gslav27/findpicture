const style = (theme) => {
  return {
    rootComponent: {
      position: 'relative',
      top: 57,
      display: 'block',
      margin: '0px 1px',
      overflow: 'hidden',
    },
    exceededLimitMessage: {
      margin: '10px 0',
      color: '#d50000',
      fontSize: '2em',
      width: '100%',
      textAlign: 'center',
    },
    gridList: {
      justifyContent: 'space-around',
      margin: '0px !important',
    },
    gridListTile: {
      padding: '0px !important',
      border: '2px solid rgba(0, 0, 0, 0)',
      borderRadius: '2px',
      transition: 'all 0.1s ease',
      '&:hover': {
        border: '2px solid rgba(0, 0, 0, 0.75)',
      },
      '&:hover .gridListTileBar': {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      },
    },
    gridImg: {
      cursor: 'zoom-in',
    },
    loadingBarRoot: {
      width: '100vw',
      textAlign: 'center',
    },
    loadingBarProgress: {
      margin: '10px 0',
      color: 'rgb(38, 50, 56)',
    },
    noMatchesWrapper: {
      display: 'flex',
      posititon: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '80vh',
      alignItems: 'center',
      justifyContent: 'center',
    },
    noMatches: {
      width: '90vw',
      textAlign: 'center',
      fontSize: '2.5em',
      fontWeight: 'bold',
      color: '#aaa',
    },
    waitApiResponseImages: {
      display: 'flex',
      height: '80vh',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }
}

export default style