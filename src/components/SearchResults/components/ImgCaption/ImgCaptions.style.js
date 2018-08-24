const style = (theme) => {
  let barTitleTag = {
    paddingRight: '0.35em',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#eee',
    '&:hover': {
      textDecoration: 'underline',
    },
  };

  return {
    barTitleTag,
    gridListTileBarRoot: {
      height: 54,
      transition: 'all 0.1s ease',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      boxSizing: 'border-box',
      bottom: 0,
      width: '100%',
      display: 'flex',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& .socialDataIconButton': {
        width: '3em',
        height: '3em',
        fontSize: '0.8em',
        paddingRight: 4,
        flexGrow: '0',
        '& svg': {
          fontSize: '2em',
          color: '#fff',
          transition: 'all 0.1s linear',
          '&:hover': {
            fontSize: '3em',
          },
        },
      },
      '& .socialDataQty': {
        color: '#fff',
        fontSize: '1.2em',
        flexGrow: '0',
        marginRight: '-3px',
        float: 'right',
      },
    },
    gridListTileBarText: {
      marginLeft: 12,
      marginRight: 7,
      color: '#fff',
      overflow: 'hidden',
      flexGrow: '0',
      width: '100%',
    },
    gridListTileBarTitle: {
      fontSize: '1em',
      lineHeight: '1.2em',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      '& .barTitleTag': barTitleTag,
    },
    gridListTileBarSubtitle: {
      fontSize: '0.75em',
      lineHeight: '1.2em',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  }
}

export default style