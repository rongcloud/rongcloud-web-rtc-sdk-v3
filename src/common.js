import utils from './utils';
import { ErrorType } from './error';

/* 
  data： 任意对象
  rules: 校验规则，数组
  let user = {
    id: '',
    stream: {
      type: 1,
      tag: 2
    }
  };
  // 校验必传入参数, 暂时支持 2 级
  check(user, ['id', 'stream.type', 'stream.tag', 'stream.mediaStream']);
*/
export const check = (data, rules) => {
  let isIllegal = false, name = '';
  let getBody = () => {
    return {
      isIllegal,
      name
    };
  };
  if (!utils.isArray(rules)) {
    rules = [rules];
  }
  if (!utils.isObject(data)) {
    throw new Error('check(data, rules): data must be an object');
  }
  utils.forEach(rules, (rule) => {
    let isTier = rule.indexOf('.') > -1;
    if (!isTier) {
      isIllegal = utils.isUndefined(data[rule]);
      if (isIllegal) {
        return name = rule;
      }
    }
    if (isTier) {
      let props = rule.split('.');
      let [parent, child] = props;
      let parentData = data[parent];
      isIllegal = utils.isUndefined(parentData);
      if (isIllegal) {
        return name = parent;
      }
      if (!utils.isArray(parentData)) {
        parentData = [parentData];
      }
      utils.forEach(parentData, (parent) => {
        let childData = parent[child];
        isIllegal = utils.isUndefined(childData);
        if (isIllegal) {
          return name = child;
        }
      });
    }
  });
  return getBody();
};

export const getError = (name) => {
  let { Inner: { PARAMTER_ILLEGAL: error } } = ErrorType;
  let { msg } = error;
  msg = utils.tplEngine(msg, {
    name
  });
  return utils.extend(error, {
    msg
  });
};