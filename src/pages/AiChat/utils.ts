// import * as base64 from 'base-64'
// import CryptoJs from 'crypto-js'
// export const requestObj = {
//   APPID: '030bc106',
//   APISecret: 'Mjg0MmNiYTExOWQxMzY4OTM5MDE1ZTE2',
//   APIKey: 'dba9b5fea20fd102ec1e854547e56d4f',
//   Uid: 'red润',
//   sparkResult: ''
// }

// export const getWebsocketUrl = () => {
//   let url = 'wss://spark-api.xf-yun.com/v1.1/chat'
//   const host = 'spark-api.xf-yun.com'
//   const apiKeyName = 'api_key'
//   // let date = new Date().toGMTString();
//   const date: string = new Date().toUTCString()
//   const algorithm = 'hmac-sha256'
//   const headers = 'host date request-line'
//   const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
//   const signatureSha = CryptoJs.HmacSHA256(signatureOrigin, requestObj.APISecret)
//   const signature = CryptoJs.enc.Base64.stringify(signatureSha)
//   const authorizationOrigin = `${apiKeyName}="${requestObj.APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
//   const authorization = base64.encode(authorizationOrigin)
//   // 将空格编码
//   const dataRes: any = encodeURI(date)
//   url = `${url}?authorization=${authorization}&date=${dataRes}&host=${host}`
//   return url
// }

// export const getParams = (content: any) => ({
//   header: {
//     app_id: requestObj.APPID,
//     uid: 'redrun'
//   },
//   parameter: {
//     chat: {
//       domain: 'general',
//       temperature: 0.5,
//       max_tokens: 1024
//     }
//   },
//   payload: {
//     message: {
//       // 如果想获取结合上下文的回答，需要开发者每次将历史问答信息一起传给服务端，如下示例
//       // 注意：text里面的所有content内容加一起的tokens需要控制在8192以内，开发者如有较长对话需求，需要适当裁剪历史信息
//       // text: [
//       //   { role: 'user', content: '我叫周丽峰' }, //# 用户的历史问题
//       //   { role: 'assistant', content: '好的' }, //# AI的历史回答结果
//       //   // ....... 省略的历史对话
//       //   { role: 'user', content: content } //# 最新的一条问题，如无需上下文，可只传最新一条问题
//       // ]
//       text: content
//     }
//   }
// })

// import { io } from 'socket.io-client'
// // const socket = io(`http://127.0.0.1:3011`)
// export const socket1 = io(`http://127.0.0.1:3052`)
