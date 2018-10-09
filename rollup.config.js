import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import utils from './src/utils';

const {version} = require('./package.json');

const banner =
  '/*\n' +
  ' * RongCloudRTC.js v' + version + '\n' +
  ' * Copyright ' + new Date().getFullYear() + ' RongCloud\n' +
  ' * Released under the MIT License.\n' +
  ' */';

const getTarget = function(type){
  type = type || '';
  return `dist/RongCloudRTC.${version}${type}.js`;
};

const genConfig = function(type){
  return {
    input: 'src/index.js',
    output: {
      file: getTarget(type),
      format: 'umd',
      name: 'RongCloudRTC',
    }
  }
};

const configs = {
  min: () => {
    let config = genConfig('.min');
    return utils.extend(config, {
      plugins: [ 
        minify({
          banner
        }),
        babel({
          exclude: 'node_modules/**'
        })
      ]
    })
  },
  dev: () => {
    let config = genConfig();
    utils.extend(config.output, {
      banner
    });
    return utils.extend(config, {
      plugins: [ 
        babel({
          exclude: 'node_modules/**'
        })
      ]
    })
  }
};

module.exports = configs[process.env.TARGET]()