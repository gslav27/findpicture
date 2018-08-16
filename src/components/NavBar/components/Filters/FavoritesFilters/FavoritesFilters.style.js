const style = (theme) => {
  return {
    filtersBarWrap: {
      width: '100%',
    },
    filtersBar: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-evenly',
      backgroundColor: '#fff',
      paddingTop: '3px',
      margin: '0px 2px',
      borderBottom: '2px solid #fff',
      fontSize: '1em',
      [theme.breakpoints.down('md')]: {
        justifyContent: 'space-around',
      },
      [theme.breakpoints.only('xs')]: {
        flexFlow: 'column',
        margin: '0px',
      },
      '& > div': {
        [theme.breakpoints.only('xs')]: {
          maxWidth: '100%',
        },
        '&:hover': {
          borderRadius: 2,
        },
      }
    },
    filtersBarBackdrop: {
      display: 'none',
      height: '100vh',
      width: '100vw',
      bottom: 0,
      zIndex: -1,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      transition: 'all 0.3s ease',
      [theme.breakpoints.only('xs')]: {
        display: 'block',
      },
    },
    filtersLabel: {
      color: '#777',
      height: '2em',
      margin: 0,
      fontSize: '1em',
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 5,
      [theme.breakpoints.only('xs')]: {
        borderBottom: '2px solid #ddd',
        marginLeft: 0,
      },
    },
    mobileFont: {
      [theme.breakpoints.only('xs')]: {
        fontSize: '1.05em',
      },
    },
    orderLabel: {
      textAlign: 'right',
      [theme.breakpoints.only('xs')]: {
        flex: 1,
      },
    },
    orderButtonWrap: {
      display: 'inherit',
      [theme.breakpoints.only('xs')]: {
        flex: 1,
      },
    },
    orderButton: {
      width: '1.3em',
      height: '1.3em',
      margin: '3px 0px 0px 0px',
    },
    orderButtonFirst: {
      marginLeft: -3,
      marginRight: -3,
      [theme.breakpoints.only('xs')]: {
        marginLeft: 5,
      },
    },
    orderButtonSelected: {
      transition: 'all 0.3s ease',
      position: 'absolute',
      bottom: 5,
      left: 0,
      width: '100%',
      '& > div': {
        width: '0.5em',
        margin: '0 auto',
        borderBottom: '1px solid #d50000',
      },
    },
    selected: {
      color: '#d50000',
    },
  }
}

export default style