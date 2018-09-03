const style = (theme) => {
  const barTitleTag = {
    display: 'inline-block',
    paddingRight: '0.35em',
    textDecoration: 'none',
    color: '#333',
    '&:hover': {
      backgroundColor: '#ddd',
      borderRadius: 2,
    },
  };

  return {
    barTitleTag,
    card: { padding: '5px 0px' },
    cardDivider: {
      display: 'block',
      [theme.breakpoints.only('xs')]: { display: 'none' },
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
    cardContent: {
      padding: '0.8em 16px 0 16px',
      '& .barTitleTag': barTitleTag,
    },
    cardActions: {
      '& .socialDataIconButton': {
        maxHeight: '10vh',
        '& svg': {
          color: '#333',
          height: '1.3em',
          width: '1.3em',
        },
      },
      '& .socialDataQty': {
        color: '#333',
        fontSize: '0.95em',
        marginLeft: '-7px',
      },
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
  };
};

export default style;
