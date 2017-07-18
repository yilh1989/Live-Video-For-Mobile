/**
 * Created by dz on 16/10/18.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './loading.scss';
import { insertComponent, removeComponentByRef } from '../../ultils/helper';

@cssModules(styles, { errorWhenNotFound: false })
class LoadingWrap extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    time: PropTypes.number,
    parentRef: PropTypes.any,
    onDisappear: PropTypes.func,
  };

  componentDidMount() {
    setTimeout(() => this.layout(), 0);
    if (this.props.time !== 0) {
      this.timer = setTimeout(() => {
        this.close();
      }, this.props.time || 1500);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  layout() {
    let rect;
    if (this.props.parentRef === undefined) {
      const e = document.documentElement;
      rect = { left: 0, top: 0, width: e.clientWidth, height: e.clientHeight };
    } else {
      rect = this.props.parentRef.getBoundingClientRect();
    }
    const r = this.loading.getBoundingClientRect();
    const left = rect.left + ((rect.width - r.width) / 2);
    const top = rect.top + ((rect.height - r.height) / 2);
    const style = `top: ${top}px; left:${left}px;`;
    this.loading.setAttribute('style', style);
  }

  close() {
    if (this.props.onDisappear) this.props.onDisappear();
    // removeComponentByRef(this.loading);
  }

  render() {
    return (
      <div id="loading" ref={(ref) => { this.loading = ref; }} styleName="loading">
        {this.props.content}
      </div>
    );
  }
}

export default class Loading extends LoadingWrap {
  static show(param, ref = undefined) {
    const oldLoading = document.getElementById('loading');
    if (oldLoading) removeComponentByRef(oldLoading);
    if (typeof param === 'object' && param.length !== 0) {
      insertComponent(<LoadingWrap {...param} parentRef={ref} />);
    } else if (typeof param === 'string') {
      insertComponent(<LoadingWrap content={param} parentRef={ref} />);
    }
  }
}
