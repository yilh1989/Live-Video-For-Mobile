/**
 * Created by Amg on 2016/11/9.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './chat_face.scss';
import { insertComponent, removeComponentByRef } from '../../../ultils/helper';

@cssModules(styles, { allowMultiple: true, errorWhenNotFound: false })
class ChatFaceWrap extends Component {
  static defaultProps = {
    footHeight: 200,
  };

  static propTypes = {
    footHeight: PropTypes.number,
    insertFace: PropTypes.func.isRequired,
    showCallBack: PropTypes.func,
    hideCallBack: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      faces: this.initFaceImg(),
    };
  }

  componentDidMount() {
    this.layout();
    if (this.props.showCallBack) this.props.showCallBack();
  }

  componentWillUnmount() {
    if (this.props.hideCallBack) this.props.hideCallBack();
  }

  close = () => {
    removeComponentByRef(this.box);
    document.getElementById('contentBox').removeAttribute('style');
  };

  layout = () => {
    const h = this.props.footHeight;
    this.box.style.height = `${h}px`;
    document.getElementById('mainBox').addEventListener('click', this.close, false);
  };

  initFaceImg = () => {
    const faces = [];
    for (let i = 1; i <= 75; i += 1) {
      const tips = `em_${i}`;
      faces.push({
        tip: tips,
        path: require(`../../../images/face/${i}.ico`),
        hover: false,
        id: i,
      });
    }
    return faces;
  };

  choose = (tip) => () => {
    const icon = tip.split('_')[1];
    const face = require(`../../../images/face/${icon}.ico`);
    if (this.props.insertFace) this.props.insertFace(face);
  };

  render() {
    return (
      <div
        ref={(ref) => { this.box = ref; }}
        styleName="face-box"
        id="face-box"
      >
        {
          this.state.faces.map(face =>
            <span
              key={face.tip}
              onTouchTap={this.choose(face.tip)}
              styleName="icon"
            ><img
              role="presentation"
              draggable="false"
              src={face.path}
            />
            </span>
          )
        }
      </div>
    );
  }
}

export default class ChatFace extends ChatFaceWrap {
  static show(param) {
    if (typeof param === 'object' && param.length !== 0) {
      insertComponent(<ChatFaceWrap ref={(ref) => { this.chatFaceWrap = ref; }} {...param} />);
    } else if (typeof param === 'string') {
      insertComponent(
        <ChatFaceWrap ref={(ref) => { this.chatFaceWrap = ref; }} footHeight={param} />
      );
    }
  }

  static close() {
    if (this.chatFaceWrap) {
      this.chatFaceWrap.close();
    }
  }
}

