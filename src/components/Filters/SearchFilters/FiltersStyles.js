export const filtersStylesPattern = (theme) => {
  return {
    dialogPaperWidthSm: {
      maxHeight: '70vh',
      width: 460,
    },
    rootSelectWrap: {
      width: '100%',
      height: '2em',
      margin: '0px',
      borderRadius: 2,
      fontSize: '1em',
      color: '#777',
      [theme.breakpoints.only('xs')]: {
        display: 'none',
      },
    },
    selectedValue: {
      height: '1em',
      color: '#d50000',
      transition: 'all 0.3s ease',
    },
    rootNativeColorSelect: {
      marginTop: 16,
      width: '100%',
      color: 'rgba(0, 0, 0, 0.87)',
      display: 'inline-flex',
      position: 'relative',
      fontSize: '1em',
      lineHeight: '1em',
      alignItems: 'center',
    },
    rootNativeControl: {
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: '100%',
      [theme.breakpoints.only('xs')]: {
        display: 'none',
      },
    },
    nativeColorInputHTML: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'none',
      border: 'none',
      '&:focus': {
        // Show that it's not an text input
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 0, // Reset Chrome style
        borderColor: 'rgba(0,0,0,0)',
        color: 'transparent',
      },
    },
    rootListWrap: {
      display: 'none',
      padding: 0,
      [theme.breakpoints.only('xs')]: {
        display: 'block',
      },
      borderBottom: '2px solid #ddd',
    },
    rootSelect: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    select: {
      padding: '0 24px 0 12px',
      textAlign: 'center',
      lineHeight: '2em',
      [theme.breakpoints.only('xs')]: {
        padding: '0 24px',
      },
    },
    nativeColorInput: {
      padding: '0 24px 0 12px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    nativeControlInputLabel: {
      marginLeft: 12,
      fontSize: '1em',
    },
    nativeColorInputAdornment: {
      top: 'calc(50 % - 12px)',
      right: '0',
      color: 'rgba(0, 0, 0, 0.54)',
      position: 'absolute',
      pointerEvents: 'none',
    },
    nativeColorDialogTitle: {
      padding: '7px 10px 0 24px',
      display: 'flex',
      alignItems: 'baseline',
      '&>span': {
        fontSize: '1.2em',
        fontWeight: '500',
        width: '100%'
      },
      '&> div': {
        width: 'auto',
        padding: '0 11px 0 0',
      },
    },
    nativeColorDialogContent: {
      padding: '7px 0px 10px',
      display: 'flex',
      justifyContent: 'center',
      '& > div': {
        overflow: 'scroll',
        padding: '0px 5px 0px 15px',
      },
    },
    nativeColorDialogContentList: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > div': {
        width: '50%',
      },
      '& > div > div': {
        padding: '0 15px',
        height: '2.4em',
      },
    },
    nativeControlOption: {
      color: '#000',
    },
    MenuPropsListPadding: {
      padding: '0 0 2px 0',
      boxSizing: 'border-box',
    },
    MenuItemText: {
      padding: '0 6px 0 10px',
      color: '#000',
      width: '100%',
    },
    MenuItemIcon: {
      width: '0.6em',
      height: '0.6em',
      fill: 'rgba(0,0,0,0.8)',
    },
    MenuItemIconMultipleSelection: {
      width: '0.6em',
      height: '0.6em',
      fill: 'rgba(0,0,0,0.8)',
      fontSize: '1.8em',
    },
    MenuItemDisabled: {
      opacity: '1',
      paddingTop: '0.8em',
      color: '#fff',
      backgroundColor: '#666',
    },
    MenuItemDisabledText: {
      textTransform: 'uppercase',
    },
    MenuItemDisabledHook: {
      visibility: 'hidden',
    },
    backDropRoot: {
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    listItemHeader: {
      height: '2em',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff',
    },
    listItemHeaderHidden: {
      '& > div > span > span > span': {
        opacity: '0.5',
      },
    },
    listItemHeaderOpen: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
      },
    },
    listItemTextHeader: {
      fontSize: '1.05em',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    listItemTextNested: {
      fontSize: '1.05em',
      textTransform: 'uppercase',
      color: '#0d47a1',
    },
    listItemNested: {
      height: '2em',
    },
    listCollapsedItems: {
      overflowY: 'scroll',
      maxHeight: '45vh',
      borderTop: '1px solid #d50000',
      borderBottom: '1px solid #d50000',
    },
    selectedMenuPaper: {
      maxWidth: 300,
    },
    overflow: {
      visibility: 'hidden',
      position: 'absolute',
      width: '100%',
      height: '1em',
      transition: 'all 0.25s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      color: '#fff',
    },
    overflowBottom: {
      bottom: 1,
    },
    overflowTop: {
      top: '2em',
      marginTop: 1,
    },
    overflowBottomNative: {
      bottom: 0,
    },
    overflowTopNative: {
      top: 55,
      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    },
  }
}