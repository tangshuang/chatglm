const { ChatGLM } = require('./dist/sdk/chatglm');
const { ChatGLMVisual } = require('./dist/sdk/chatglm-visual');
const { CogView } = require('./dist/sdk/cogview');
const { adapt } = require('./dist/sdk/helpers');
const { CharacterGLM } = require('./dist/sdk/character-glm');

module.exports = {
  ChatGLM,
  ChatGLMVisual,
  CogView,
  adapt,
  CharacterGLM,
};
