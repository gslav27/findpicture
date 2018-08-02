import { createMuiTheme } from '@material-ui/core/styles';

const themeDef = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1600,
    },
  },
  overrides: {
    MuiMenuItem: {
      root: {
        fontSize: '1em',
        '&$selected': {
          backgroundColor: 'rgba(0,0,0,0)',
        },
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.10)',
        },
      }
    }
  },
});

export default themeDef;