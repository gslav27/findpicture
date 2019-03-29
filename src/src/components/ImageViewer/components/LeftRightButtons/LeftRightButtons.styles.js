import imageViewerStyles from '../../ImageViewer.styles';

const style = {
  viewerAddsNavigation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  viewerIconButtonLR: {
    display: 'block',
    boxSizing: 'border-box',
    width: '45vw',
    height: '40vh',
    padding: 3,
    cursor: 'pointer',
    '&:hover': { backgroundColor: 'rgba(0,0,0,0)' },
    zIndex: 1502,
  },
  viewerIconButtonLabel: { width: '10vw' },
  viewerIconButtonLabelRight: { '& span': { float: 'right' } },
  viewerIconStyleLR: {
    width: '1.3em',
    height: '1.3em',
    maxHeight: 50,
    color: '#ccc',
  },
  ...imageViewerStyles(),
};

export default style;
