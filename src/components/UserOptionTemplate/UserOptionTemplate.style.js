const style = (theme) => {
  return {
    barTitleTag: {
      display: 'inline-block',
      paddingRight: '0.35em',
      textDecoration: 'none',
      color: '#333',
      '&:hover': {
        backgroundColor: '#ddd',
        borderRadius: 2,
      },
    },
    card: {
      padding: '5px 0px',
    },
    cardDivider: {
      display: 'block',
      [theme.breakpoints.only('xs')]: {
        display: 'none',
      },
    },
    cardHeader: {
      paddingTop: '0.5em',
      paddingBottom: '0.5em',
    },
    cardMedia: {
      width: '100%',
      maxHeight: '90vh',
      objectFit: 'scale-down',
    },
    loadingBarRoot: {
      width: '100vw',
      textAlign: 'center',
    },
    loadingBarProgress: {
      margin: '10px 0',
      color: 'rgb(38, 50, 56)',
    },
    waitApiResponseImages: {
      display: 'flex',
      height: '80vh',
      justifyContent: 'center',
      alignItems: 'center',
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
    rootComponent: {
      position: 'relative',
      top: 67,
      display: 'block',
      margin: 'auto',
      color: '#550',
      width: '70%',
      [theme.breakpoints.only('xs')]: {
        top: 57,
        width: '100%',
      },
    },
  }
}

export default style;