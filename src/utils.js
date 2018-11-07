const extend = (destination, sources) => {
  for(let key in sources){
    let value = sources[key];
    destination[key] = value;
  }
  return destination;
};

const tplEngine = () => {

};

export default {
  extend,
  getInstance
}