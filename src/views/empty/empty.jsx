/**
 * Created by Amg on 2016/11/15.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './empty.scss';

const Empty = (props) => (
  <div styleName={`${typeof props.style === 'undefined' ? 'empty' : ''}`}>
    <div style={props.style}>{props.content}</div>
  </div>
);

Empty.propTypes = {
  content: PropTypes.string,
  style: PropTypes.object,
};

export default cssModules(Empty, styles, { allowMultiple: true, errorWhenNotFound: false });

