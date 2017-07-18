/**
 * Created by dz on 16/10/10.
 */
/* eslint react/no-danger:off */
import React, { PropTypes } from 'react';

function getGenseePlayerHtml(site, authcode, videoURL) {
  const siteURL = site.replace('http://', '');
  return `<gs:video-live 
            id="videoComponent" 
            ctx="webcast" 
            site="${siteURL}" 
            authcode="${authcode}"
            ownerid="${videoURL}" 
            encodetype="md5"
          />`;
}

export default class GenseePlayer extends React.Component {
  static propTypes = {
    site: PropTypes.string,
    authcode: PropTypes.string,
    videoURL: PropTypes.string,
  };

  componentDidMount() {
    const script = document.createElement('script');
    script.id = 'gssdk';
    script.src = 'http://static.gensee.com/webcast/static/sdk/js/gssdk.js';
    script.onload = () => {
      GS._open_.loadSDKTags(); // eslint-disable-line
    };
    document.body.appendChild(script);
  }

  componentWillUnmount() {
    const s = document.getElementById('gssdk');
    s.parentNode.removeChild(s);
  }

  render() {
    const { site, authcode, videoURL } = this.props;
    return (
      <div
        style={{ width: '100%', height: '100%' }}
        dangerouslySetInnerHTML={{ __html: getGenseePlayerHtml(site, authcode, videoURL) }}
      />
    );
  }
}
