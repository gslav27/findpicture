const style = (theme) => {
  return {
    appBar: {
      backgroundColor: 'rgb(38,50,56)',
      height: 57,
      padding: '0px 4px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #ddd',
      transition: 'border-bottom 0.2s ease',
    },
    appBarBorder: {
      borderBottom: '1px solid rgb(38, 50, 56)',
      [theme.breakpoints.only('xs')]: {
        borderBottom: '1px solid #ddd',
      },
    },
    appBarInputGroup: {
      marginLeft: 4,
      width: '65%',
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.only('xs')]: {
        width: '100%',
      },
      [theme.breakpoints.only('sm')]: {
        width: '75%',
      },
      [theme.breakpoints.only('md')]: {
        width: '70%',
      },
    },
    appBarLastChildGroup: {
      display: 'inline-flex',
    },
    appBarIcons: {
      color: '#fff',
    },
    appBarIcons_noAuth: {
      color: '#999',
    },
    filtersButton: {
      height: '1.8em',
      width: '1.8em',
      transition: 'visibility 0.2s ease',
      [theme.breakpoints.only('xs')]: {
        width: '2em',
        height: '2em',
      },
      '& svg': {
        transition: 'all 0.2s ease',
      },
    },
    filtersButtonTop: {
      visibility: 'hidden',
      '& svg': {
        color: 'rgb(38, 50, 56)',
      },
      [theme.breakpoints.only('xs')]: {
        visibility: 'visible',
        '& svg': {
          color: '#fff',
        },
      },
    },
    deleteSearchTextButton: {
      height: '1.6em',
      width: '1.6em',
      padding: '0',
      transition: 'visibility 1s ease',
      visibility: 'hidden',
    },
    deleteSearchTextButtonDisplay: {
      visibility: 'visible',
    },
    inputFieldIcons: {
      color: 'rgb(38, 50, 56)',
    },
    hidden: {
      visibility: 'hidden',
    },
    searchTextIconWrap: {
      display: 'flex',
      justifyContent: 'center',
      height: '100%',
      width: '4em',
      backgroundColor: '#ffeb3b',
      borderRadius: '0px 2px 2px 0px',
      borderLeft: '1px solid #aaa',
      [theme.breakpoints.only('xs')]: {
        borderRadius: '0px 10px 0px 0px',
      },
    },
    searchTextButton: {
      height: '1.6em',
      width: '1.6em',
      padding: '0',
    },
    appBarWrapper: {
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 1001,
      transition: 'all 0.1s',
    },
    appBarWrapperHide: {
      transform: 'translate(0px, -57px)',
      [theme.breakpoints.only('xs')]: {
        transform: 'none',
      }
    },
    searchFieldFormControl: {
      width: '100%',
    },
    searchFieldInput: {
      padding: '6px 0px 4px',
      width: '100%',
      // fix .MuiInput-inputType: {height: 1.1875em}
      height: 'initial',
    },
    searchFieldInputRoot: {
      width: '100%',
      paddingLeft: 5,
      fontSize: '1.2em',
      lineHeight: '1.2em',
      height: '2em',
    },
    filtersTop: {
      position: 'relative',
      top: 57,
      [theme.breakpoints.only('xs')]: {
        display: 'none',
      },
    },
    filtersBody: {
      position: 'fixed',
      top: 0,
      height: 57,
      width: '100%',
      display: 'flex',
      alignItems: 'end',
      transition: 'all 0.3s',
      [theme.breakpoints.only('xs')]: {
        top: -200,
      },
    },
    filtersBodyTransform: {
      transform: 'translate(0px, 57px)',
      [theme.breakpoints.only('xs')]: {
        transform: 'translate(0px, 257px)',
      },
    },
    searchFieldWrap: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '2em',
      backgroundColor: '#f5f5f5',
      borderRadius: 1,
    },
    searchFieldWrapMobile: {
      borderRadius: '2px',
      [theme.breakpoints.only('xs')]: {
        borderRadius: '0px 10px 0px 0px',
      },
    },
  }
}

export default style