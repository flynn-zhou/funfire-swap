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
        NODE_OPTIONS,
        __VERCEL_BUILD_RUNNING,
         ...rest } = process.env;
      return {
          ...rest,
      }
  }




module.exports = {
    webpack: (config) => {
      let modularizeImports = null;
      config.module.rules.some((rule) =>
        rule.oneOf?.some((oneOf) => {
          modularizeImports =
            oneOf?.use?.options?.nextConfig?.modularizeImports;
          return modularizeImports;
        }),
      );
      // config.plugins.push(new webpack.DefinePlugin(process.env))
      config.resolve.fallback = {
        fs: false,
        path: false,
        // Browser: false,
      };
      if (modularizeImports?.["@headlessui/react"])
        delete modularizeImports["@headlessui/react"];
  
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
