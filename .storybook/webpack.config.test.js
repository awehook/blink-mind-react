// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const path = require("path");
const merge = require('webpack-merge');
const base = require("./webpack.config.base");
const custom = require("../webpack.config");
const _ = require("lodash");

function logConfig(config) {
  console.log(JSON.stringify(config,null,2));
  // for(let rule of config.module.rules) {
  //   console.log(rule);
  // }
}

function isRuleEqual(a,b) {
  return a.test.toString() === b.test.toString()
}

module.exports = async ({ config, mode }) => {

  logConfig(config);
  let new_config =  merge({
    customizeArray(a, b, key) {
      if (key === 'module.rules') {
        let rules = [...a,...b];
        let res =  _.uniqWith(rules,isRuleEqual);
        return res;
      }
      // Fall back to default merging
      return undefined;
    },
  })(base,config);
  console.log("new=============================================================================================");
  logConfig(new_config);
  return new_config;
};
