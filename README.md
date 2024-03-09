# ChatGLM

ChatGLM NodeJS SDK。
支持chatglm-4, chatglm-4v, chatglm-3-turbo, cogview。
官方API接口文档： https://open.bigmodel.cn/dev/api#glm-4v

## 安装

```
npm i chatglm
```

## 使用

首先，你需要[在官方开放平台获取 Api Key](https://open.bigmodel.cn/usercenter/apikeys)，接下来，在nodejs代码中如下使用：

```js
const { ChatGLM, adapt } = require('chatglm');

// 实例化对象
const chat = new ChatGLM(apiKey);

// 发起请求
const { data } = await chat.completions.careate({
  model: 'chatglm-4',
  stream: true,
  messages: [
    {
      role: 'user',
      content: '中国2023年农业数据简要报告',
    },
  ],
});

// 使用返回的data
// 此时需要注意，stream参数对返回的data影响较大，具体可以参考官方API接口“内容生成流式响应块内容”部分
const stream = adapt(data); // 通过adapt方法让数据抛出的更好用
stream.on('data', (chunk) => {
  console.log(chunk);
});
```

使用时的套路很简单，你需要将apiKey传入到类进行实例化，然后调用实例对象上的方法，调用时传入的参数非常关键，具体可以[参考官方API接口传参的要求](https://open.bigmodel.cn/dev/api#glm-4v)，也可以阅读本项目下源码中的ts类型声明。

## 接口

目前仅支持像chatglm, cogview, characterglm接口发起请求，官方的其他接口暂未实现，欢迎开源共建。你可以require后读取下面接口：

- ChatGLM: 支持 chatglm-4, chatglm-3-turbo 两个模型
- ChatGLMVisual: 支持 chatglm-4v 模型
- CogView: 支持 cogview-3 模型
- CharacterGLM: 支持 charglm-3 模型

在使用时基本上都有编辑器类型提示，你可以轻松的实现接口调用，如果编辑器不支持，看一下本项目下源码的ts类型声明即可。
