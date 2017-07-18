/**
 * Created by Amg on 2016/11/14.
 */

import AppConfig from '../server/app_config';

export default class User {
  static show(src) {
    window.location = `${src}?regFrom=${AppConfig.systemType()}&regURL=${AppConfig.localURL}`;
  }
}
