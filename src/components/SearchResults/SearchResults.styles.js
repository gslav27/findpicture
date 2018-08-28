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
  }
}

export default style