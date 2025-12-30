const { createApp } = require('../dist/main');

let app;

module.exports = async (req, res) => {
  if (!app) {
    app = await createApp();
  }
  return app(req, res);
};

