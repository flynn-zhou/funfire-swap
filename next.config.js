/** @type {import('next').NextConfig} */
const webpack = require('webpack')
// require('dotenv').config();
const getALlEnv = () => {
      const { 
        __CF_USER_TEXT_ENCODING, 
        __CFBundleIdentifier,
         NODE_ENV,
        NEXT_RUNTIME,
        __NEXT_PROCESSED_ENV,
         ...rest } = process.env;
      return {
          ...rest,
      }
  }


module.exports = {
    webpack: (config) => {
      // config.plugins.push(new webpack.DefinePlugin(process.env))
      config.resolve.fallback = {
        fs: false,
        path: false,
        // Browser: false,
      };
  
      return config;
    },
    env:  getALlEnv()
  //    () => {
  //     const { __CF_USER_TEXT_ENCODING, ...rest } = process.env;
  //     return {
  //         ...rest,
  //     }
  // }
    // env: process.env.filter((item) => item !== '__CF_USER_TEXT_ENCODING')
  };
