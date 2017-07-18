/**
 * Created by Amg on 2016/10/28.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './msg_input.scss';

class MsgInput extends Component {
  static defaultProps = {
    defaultValue: '',
    readOnly: false,
  };
  static propTypes = {
    defaultValue: PropTypes.any,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.string,
    blurCallBack: PropTypes.func,
    focusCallBack: PropTypes.func,
    readOnly: PropTypes.bool,
  };

  componentDidMount() {
    this.placeholder.addEventListener('click', this.toFocus, false);
    this.load();
  }

  componentWillUnmount() {
    this.placeholder.removeEventListener('click', this.toFocus);
  }

  getValue = () => {
    const msgText = this.input.innerText;
    const msgHtml = this.input.innerHTML;
    return { msgText, msgHtml };
  };

  isFocus = false;

  toFocus = () => {
    this.toggleHolder('hide');
    this.input.focus();
  };

  toBlur = () => {
    const val = this.input.innerText;
    if (!this.noEmpty(val)) this.toggleHolder('show');
    this.input.blur();
  };

  blurCallBack = () => {
    if (this.props.blurCallBack) this.props.blurCallBack();
    this.isFocus = false;
  };

  focusCallBack = () => {
    if (this.props.focusCallBack) this.props.focusCallBack();
    this.isFocus = true;
  };

  load = () => {
    this.input.innerText = this.props.defaultValue;
    if (this.props.autoFocus === 'on') {
      this.toFocus();
    }
  };

  clearValue = () => {
    this.input.innerText = '';
  };

  insertFace = (face) => {
    this.toggleHolder('face');
    const img = document.createElement('img');
    img.setAttribute('src', `${face}`);
    this.input.appendChild(img);
  };

  noEmpty = (str) => (typeof str !== 'undefined' && str.trim() !== '');

  toggleHolder = (type) => {
    if (this.props.readOnly) return;
    const visibility = type === 'show' ? 'visible' : 'hidden';
    if (this.placeholder) {
      this.placeholder.style.visibility = visibility;
    }
  };

  render() {
    const { placeholder = '' } = this.props;
    return (
      <div styleName="wrap">
        <div
          id="input"
          contentEditable={!this.props.readOnly}
          styleName="input"
          ref={(ref) => { this.input = ref; }}
          onBlur={this.blurCallBack}
          onFocus={this.focusCallBack}
        />
        {
          <div
            ref={ref => { this.placeholder = ref; }}
            styleName="holder"
          >
            {placeholder}
          </div>
        }
      </div>
    );
  }
}

export default cssModules(MsgInput, styles, { allowMultiple: true, errorWhenNotFound: false });
