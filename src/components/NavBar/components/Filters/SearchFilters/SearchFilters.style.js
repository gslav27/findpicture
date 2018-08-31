const style = theme => ({
  filtersBarWrap: { width: '100%' },
  filtersBar: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    paddingTop: '3px',
    margin: '0px 2px',
    borderBottom: '2px solid #fff',
    fontSize: '1em',
    [theme.breakpoints.down('md')]: { justifyContent: 'space-around' },
    [theme.breakpoints.only('xs')]: { flexFlow: 'column' },
    '& > div': {
      maxWidth: '20%',
      [theme.breakpoints.only('xs')]: { maxWidth: '100%' },
      '&:hover': { borderRadius: 2 },
    },
  },
});

export default style;
