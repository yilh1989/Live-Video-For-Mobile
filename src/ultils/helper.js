/**
 * Created by Amg on 2016/11/12.
 */
import ReactDOM from 'react-dom';
import { NEED_AUDIT } from '../server/define';

// 插入组件到body
export function insertComponent(component) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  ReactDOM.render(component, el);
  return el;
}

// 移除指定组件
export function removeComponentByRef(ref) {
  if (ref) {
    const p = ref.parentNode;
    ReactDOM.unmountComponentAtNode(p);
    p.parentNode.removeChild(p);
  }
}

// 合并数组成对象
export function combineArray(keys, values) {
  if (!keys || !values) return [];
  return keys.map((key, idx) => ({ name: key, value: values[idx] }));
}

// 数组排序后，转换对象
export function arrayToObject(arr, key) {
  // TODO:后台返回的本身已经是排序后的数据
  // const sortData = [...data].sort((a, b) => a.id - b.id);
  const sortData = arr;
  return sortData.reduce((obj, product) => {
    const o = obj;
    o[product[key]] = {
      ...product,
    };
    return obj;
  }, {});
}

export function addIsAudit(record) {
  const o = record;
  Object.keys(record).forEach(item => {
    o[item].isAudit = record[item].isaudit ? record[item].isaudit === NEED_AUDIT : false;
  });
  return o;
}

export function formatRoomStatus(data) {
  const o = {};
  Object.keys(data).forEach(item => {
    const isPlaying = parseInt(data[item].status, 10) === 1;
    o[item] = { isPlaying, roomid: data[item].roomid };
  });
  return o;
}
