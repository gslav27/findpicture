const style = {
  dialog: { zIndex: 1503 },
  dialogContent: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  loginButton: {
    backgroundColor: '#ffeb3b',
    minWidth: 150,
    marginBottom: 10,
    '&:hover ': { backgroundColor: '#efdb2b' },
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: {
    width: '2.5em',
    height: '2.5em',
    color: '#ffeb3b',
  },
};

export default style;
