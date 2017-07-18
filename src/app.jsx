/** Created by kiny on 16/9/7. */
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './css/main.scss'; // 导入全局样式文件
import MainBox from './views/mainBox';

injectTapEventPlugin();

// const App = () => <MainBox />;
class App extends React.Component {
  componentDidMount() {
    this.isFirst = false;
  }

  isFirst = true;

  render() {
    return <MainBox />;
  }
}
export default App;
