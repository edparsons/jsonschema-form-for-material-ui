import React from 'react';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import fieldStyles from './field-styles';
// import PopoverInfo from './components/PopoverInfo'; removed for fix animation problems

// for unit testing only
export class RawConfiguredField extends React.Component {
  constructor(props) {
    super(props);
    this.labelRef = React.createRef();
    this.state = {
      labelWidth: 0
    };
  }

  componentDidMount() {
    if (this.labelRef.current) {
      this.setState({ labelWidth: this.labelRef.current.offsetWidth });
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { data, errors } = this.props;
    if (
      data !== nextProps.data ||
      errors !== nextProps.errors ||
      nextState.labelWidth !== this.state.labelWidth
    ) {
      return true;
    }
    return false;
  };

  formatErrorMessages = () => {
    const { errors } = this.props;
    return errors.map(error => error.message).toString();
  };

  render() {
    const {
      classes = {},
      data,
      type,
      descriptionText,
      helpText: helpT,
      showHelperError,
      Component = OutlinedInput,
      LabelComponent,
      labelComponentProps = {},
      title,
      className,
      componentProps = {},
      id,
      errors
    } = this.props;
    const { labelWidth } = this.state;
    const helpText =
      showHelperError && errors && errors.length > 0
        ? this.formatErrorMessages()
        : helpT;
    return (
      <FormControl
        error={errors && errors.length > 0}
        fullWidth
        variant="outlined"
        size="small"
        className={classNames(classes.root, {
          [classes.withLabel]: LabelComponent
        })}
      >
        {LabelComponent && title && (
          <LabelComponent
            ref={this.labelRef}
            className={classes.label}
            {...labelComponentProps}
          >
            {title}
            {descriptionText ? (
              <Tooltip title={descriptionText} placement="top-start">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </LabelComponent>
        )}
        {descriptionText && !(LabelComponent && title) ? (
          <Tooltip title={descriptionText} placement="top-start">
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        <Component
          className={className && classes[className]}
          value={data || ''}
          id={labelComponentProps.htmlFor}
          type={type}
          labelWidth={labelWidth}
          {...componentProps}
        />
        <FormHelperText id={`${id}-help`}>{helpText}</FormHelperText>
      </FormControl>
    );
  }
}
export default withStyles(fieldStyles)(RawConfiguredField);
