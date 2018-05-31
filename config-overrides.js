module.exports = function override(config, env) {
    config.resolve.alias["react"] = "preact-compat";
    config.resolve.alias["react-dom"] = "preact-compat";
    return config;
  }