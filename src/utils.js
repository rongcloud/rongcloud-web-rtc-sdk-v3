const extend = (destination, sources) => {
  for(let key in sources){
    let value = sources[key];
    destination[key] = value;
  }
  return destination;
};

export default {
  extend
}