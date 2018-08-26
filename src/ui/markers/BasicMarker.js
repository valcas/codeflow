import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

export default class BasicMarker extends PureComponent {

  render() {

    const { classes } = this.props;

    return (
        <div className='marker-basic-container'>
          <div>{this.props.size}</div>
        </div>
    );

  }

}
