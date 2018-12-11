import utils from './utils';

let check = (module, config) => {
  let map = {
    module: {
      name: 'module',
      data: module
    },
    config: {
      name: 'config',
      data: config
    }
  };
  let tpl = '{name} is invalid.';
  utils.forEach(map, (item) => {
    if(!utils.isObject(item.data)){
      throw new Error(utils.tplEngine(tpl, {
        name: item.name
      }));
    }
  });
};

export default class Observer{
  constructor(callback){
    this.callback = callback || utils.noop;
  }
  observe(module, config){
    check(module, config);
    utils.extend(this, {
      module,
      config
    });
    utils.forEach(config, (observer, action) => {
      let isObserver = utils.isBoolean(observer) && observer;
      if(isObserver){
        module._on && module._on(action, this.callback);
      }
      if(utils.isObject(observer)){
        let tpl = '{action}_{type}';
        utils.forEach(observer, (isObserver, type) => {
          let name = utils.tplEngine(tpl, {
            action,
            type
          });
          if(isObserver){
            module._on && module._on(name, this.callback);
          }
        });
      }
      
    });
  }
  disconnect(){
    let {module, config} = this;
    config = config || {};
    utils.forEach(config, (isObserver, name) => {
      if(isObserver){
        module._off && module._off(name);
      }
    });
  }
}