// import styled from 'styled-components'
// import ReactMarkdown from 'react-markdown'
// import rehypeHighlight from 'rehype-highlight'
// import 'highlight.js/styles/atom-one-dark.css'
// // import { useAiData } from './hooks/useData'
// import { Input, Dropdown } from 'antd'
// import { useRef } from 'react'
// import { LoadingOutlined, DownOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
// function AiChat() {
//   const ChatContainerRef = useRef(null)
//   //处理ai问答所需数据的hooks
//   const {
//     chatList,
//     sendQues,
//     msg,
//     setMsg,
//     aiName,
//     setAiName,
//     isStream,
//     isDark,
//     setIsDark,
//     sendToDeepseek
//   } = useAiData(ChatContainerRef)
//   //AI菜单
//   const items: any = [
//     {
//       label: (
//         <div
//           style={{
//             color: aiName === '讯飞星火大模型' ? '#6e59c6' : '#000',
//             fontWeight: aiName === '讯飞星火大模型' ? 'bolder' : 'normal'
//           }}
//           onClick={() => setAiName('讯飞星火大模型')}
//         >
//           讯飞星火大模型
//         </div>
//       ),
//       key: '0'
//     },
//     {
//       label: (
//         <div
//           style={{
//             color: aiName === 'DeepSeek' ? '#6e59c6' : '#000',
//             fontWeight: aiName === 'DeepSeek' ? 'bolder' : 'normal'
//           }}
//           onClick={() => setAiName('DeepSeek')}
//         >
//           DeepSeek
//         </div>
//       ),
//       key: '1'
//     },
//     {
//       label: (
//         <div
//           style={{
//             color: aiName === '通义千问' ? '#6e59c6' : '#000',
//             fontWeight: aiName === '通义千问' ? 'bolder' : 'normal'
//           }}
//           onClick={() => setAiName('通义千问')}
//         >
//           通义千问
//         </div>
//       ),
//       key: '2'
//     }
//   ]
//   return (
//     <div>
//       <AiHeader $isdark={isDark}>
//         <Dropdown menu={{ items }} trigger={['click']}>
//           <div>
//             <span
//               onClick={() => {
//                 console.log('sendToDeepseek')
//                 sendToDeepseek()
//               }}
//             >
//               🤖{aiName}
//             </span>
//             <DownOutlined style={{ fontSize: '14px', cursor: 'pointer', marginLeft: '2px' }} />
//           </div>
//         </Dropdown>
//         {isDark === 'true' ? (
//           <MoonOutlined
//             onClick={() => {
//               console.log('moon')
//               sendToDeepseek()
//               setIsDark('false')
//               localStorage.setItem('AI_IS_DARK', 'false')
//             }}
//             className="theme-icon"
//           />
//         ) : (
//           <SunOutlined
//             onClick={() => {
//               console.log('sun')
//               sendToDeepseek()
//               setIsDark('true')
//               localStorage.setItem('AI_IS_DARK', 'true')
//             }}
//             className="theme-icon"
//           />
//         )}
//       </AiHeader>
//       <ChatContainer ref={ChatContainerRef} $isdark={isDark}>
//         {chatList.length !== 0 &&
//           chatList.map((item: any, index: any) =>
//             item.role === 'loading' ? (
//               <div key={index} className="chatItemLoading">
//                 <LoadingOutlined />
//               </div>
//             ) : item.role === 'assistant' ? (
//               <div key={index} className="chatItemAi">
//                 <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{item?.content}</ReactMarkdown>
//               </div>
//             ) : (
//               <div key={index} className="chatItemUser">
//                 <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{item?.content}</ReactMarkdown>
//               </div>
//             )
//           )}
//       </ChatContainer>
//       <InputContainer $isdark={isDark}>
//         <Input
//           className="input"
//           placeholder={isStream ? 'AI正在飞速思考中🚀' : '请输入提问内容吧'}
//           onPressEnter={(e: any) => {
//             if (!isStream) {
//               setMsg('')
//               sendQues(e.target.value)
//             }
//           }}
//           onChange={(e: any) => {
//             setMsg(e.target.value)
//           }}
//           value={msg}
//           disabled={isStream}
//         />
//       </InputContainer>
//     </div>
//   )
// }
// const AiHeader: any = styled.div`
//   height: calc(var(--vh) * 7);
//   background-color: #6e59c6;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   font-weight: bolder;
//   color: #fff;
//   font-size: 20px;
//   position: relative;
//   .theme-icon {
//     position: absolute;
//     top: 50%;
//     right: 3%;
//     transform: translateY(-50%);
//     cursor: pointer;
//   }
// `
// const ChatContainer: any = styled.div`
//   @media screen and (min-width: 280px) {
//     background-color: ${(props: any) => (props.$isdark === 'true' ? '#292a2d' : '#ffffff')};
//     height: calc(var(--vh) * 83);
//     overflow: hidden;
//     overflow-y: scroll;
//     padding: 20px 2%;
//     &::-webkit-scrollbar {
//       width: 0;
//       height: 0;
//       display: none;
//     }
//     .chatItemLoading {
//       border-radius: 14px;
//       height: 40px;
//       width: 40px;
//       margin-top: 40px;
//       line-height: 40px;
//       text-align: center;
//       background-color: ${(props: any) => (props.$isdark === 'true' ? '#212327' : '#f6f3ff')};
//       color: ${(props: any) => (props.$isdark === 'true' ? '#ffffff' : '#000')};
//     }
//     .chatItemAi {
//       padding: 0px 15px;
//       overflow: hidden;
//       border-radius: 14px;
//       min-height: 40px;
//       width: fit-content;
//       height: fit-content;
//       min-width: 40px;
//       max-width: 94%;
//       background-color: ${(props: any) => (props.$isdark === 'true' ? '#212327' : '#f6f3ff')};
//       color: ${(props: any) => (props.$isdark === 'true' ? '#ffffff' : '#000')};
//       margin-top: 40px;
//       &:first-child {
//         margin-top: 0;
//       }
//     }
//     .chatItemUser {
//       padding: 0px 15px;
//       overflow: hidden;
//       border-radius: 14px;
//       min-height: 40px;
//       width: fit-content;
//       height: fit-content;
//       min-width: 40px;
//       max-width: 94%;
//       background-color: #6e59c6;
//       color: #ffffff;
//       margin-top: 40px;
//       margin-left: auto;
//       margin-right: 0px;
//     }
//   }
//   @media screen and (min-width: 900px) {
//     background-color: ${(props: any) => (props.$isdark === 'true' ? '#292a2d' : '#ffffff')};
//     height: calc(var(--vh) * 83);
//     overflow: hidden;
//     overflow-y: scroll;
//     padding: 20px calc((100% - 900px) / 2);
//     &::-webkit-scrollbar {
//       width: 0;
//       height: 0;
//       display: none;
//     }
//     .chatItemLoading {
//       border-radius: 14px;
//       height: 40px;
//       width: 40px;
//       margin-top: 40px;
//       line-height: 40px;
//       text-align: center;
//       background-color: ${(props: any) => (props.$isdark === 'true' ? '#212327' : '#f6f3ff')};
//       color: ${(props: any) => (props.$isdark === 'true' ? '#ffffff' : '#000')};
//     }
//     .chatItemAi {
//       padding: 0px 15px;
//       overflow: hidden;
//       border-radius: 14px;
//       min-height: 40px;
//       width: fit-content;
//       height: fit-content;
//       min-width: 40px;
//       max-width: 860px;
//       background-color: ${(props: any) => (props.$isdark === 'true' ? '#212327' : '#f6f3ff')};
//       color: ${(props: any) => (props.$isdark === 'true' ? '#ffffff' : '#000')};
//       margin-top: 40px;
//       &:first-child {
//         margin-top: 0;
//       }
//     }
//     .chatItemUser {
//       padding: 0px 15px;
//       overflow: hidden;
//       border-radius: 14px;
//       min-height: 40px;
//       width: fit-content;
//       height: fit-content;
//       min-width: 40px;
//       max-width: 860px;
//       background-color: #6e59c6;
//       color: #ffffff;
//       margin-top: 40px;
//       margin-left: auto;
//       margin-right: 0px;
//     }
//   }
// `
// const InputContainer: any = styled.div`
//   @media screen and (min-width: 280px) {
//     height: calc(var(--vh) * 10);
//     display: flex;
//     justify-content: center;
//     align-items: start;
//     background-color: ${(props: any) => (props.$isdark === 'true' ? '#292a2d' : '#ffffff')};
//     .input {
//       height: calc(var(--vh) * 8);
//       width: 96%;
//       border: 2px #6e59c6 solid;
//       border-radius: 16px;
//       color: ${(props: any) => (props.$isdark === 'true' ? '#ffffff' : '#000')};
//       background-color: ${(props: any) => (props.$isdark === 'true' ? '#404045' : '#ffffff')};
//     }
//     .input::-webkit-input-placeholder {
//       color: ${(props: any) => (props.$isdark === 'true' ? '#6f707b' : '#6e6e6e')};
//     }
//   }
//   @media screen and (min-width: 900px) {
//     height: calc(var(--vh) * 10);
//     display: flex;
//     justify-content: center;
//     align-items: start;
//     background-color: ${(props: any) => (props.$isdark === 'true' ? '#292a2d' : '#ffffff')};
//     .input {
//       height: calc(var(--vh) * 8);
//       width: 900px;
//       border: 2px #6e59c6 solid;
//       border-radius: 16px;
//       color: ${(props: any) => (props.$isdark === 'true' ? '#ffffff' : '#000')};
//       background-color: ${(props: any) => (props.$isdark === 'true' ? '#404045' : '#ffffff')};
//     }
//     .input::-webkit-input-placeholder {
//       color: ${(props: any) => (props.$isdark === 'true' ? '#6f707b' : '#6e6e6e')};
//     }
//   }
// `
function AiChat() {
  return <>AiChat</>
}
export default AiChat
