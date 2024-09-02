/** @type {import('next').NextConfig} */


module.exports = {
    webpack: (config) => {
      config.resolve.fallback = {
        fs: false,
        path: false,
        // Browser: false,
      };
  
      return config;
    },
  };
