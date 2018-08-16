const style = {
  backDrop: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    cursor: 'zoom-out',
  },
  moreImagesLoadingRoot: {
    zIndex: 10000,
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgLoadingRoot: {
    zIndex: 1499,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  moreImagesLoadingProgress: {
    color: '#eee',
  },
  dialogRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.84)',
  },
  dialogImg: {
    maxWidth: '80vw',
    maxHeight: '80vh',
    border: '2px solid #fff',
  },
  dialogPaperWidthSm: {
    maxWidth: '80vw',
  },
  imgCounter: {
    color: '#ccc',
    fontSize: '1em',
    paddingLeft: 12,
  },
  toolBar: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    height: '9vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  toolBarTop: {
    top: 0,
    justifyContent: 'space-between',
  },
  viewerAdds: {
    position: 'fixed',
    zIndex: 1501,
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
  viewerIconButton: {
    maxHeight: '10vh',
    padding: 1,
  },
  buttonsHover: {
    '&:hover svg': {
      maxWidth: '10vw',
      maxHeight: '10vh',
      height: '1.8em',
      width: '1.8em',
      transition: 'all 0.2s ease',
    },
  },
  viewerIconStyle: {
    color: '#ccc',
    height: '1.3em',
    width: '1.3em',
  },  
}

export default style;