export default theme => ({
  root: {
    '&$withLabel': {
      margin: `${theme.spacing(2)}px 0`
    }
  },
  textarea: {
    '& textarea': {
      height: 'initial'
    }
  },
  description: {
    transform: `translateX(-${theme.spacing(2)}px)`,
    fontSize: '80%',
    color: theme.palette.grey[500]
  },
  withLabel: {},
  label: {
    height: '1rem',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
  // infoButton: {},
  // infoPopover: {}
});
