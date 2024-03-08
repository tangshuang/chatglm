const { ChatGLM } = require('./dist/sdk/chatglm');
const { ChatGLMVisual } = require('./dist/sdk/chatglm-visual');
const { CogView } = require('./dist/sdk/cogview');
const { adapt } = require('./dist/sdk/helpers');

module.exports = {
  ChatGLM,
  ChatGLMVisual,
  CogView,
  adapt,
};
