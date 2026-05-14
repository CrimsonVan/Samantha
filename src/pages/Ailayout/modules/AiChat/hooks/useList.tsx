import { useState, useRef, useEffect, useTransition, useMemo } from 'react'
import { useMemoizedFn } from 'ahooks'
import { nanoid } from 'nanoid'
import { chatToDeepseekApi } from '../api'
import { useImmer } from 'use-immer'
// import { useUnactivate } from 'react-activation'

export const LOADING_TIP = 'thinking...'

interface Message {
  id: string
  aiMsg: string
  userMsg: string
}

const FAKE_MSG_LIST = Array.from({ length: 10000 }, (_, i) => ({
  id: nanoid(),
  aiMsg: `${i} 呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃`,
  userMsg: '你好'
}))

function useList({ chatList, id }: { chatList: any[]; id: string }) {
  const [isFirstLoading, setIsFirstLoading] = useState(true)
  const [msgList, setMsgList] = useImmer<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [, startTransition] = useTransition()
  // 用于标识当前正在进行的请求
  const currentRequestId = useRef<string | null>(null)
  // 保存 AbortController 以便取消
  const abortControllerRef = useRef<AbortController | null>(null)

  const isNewChat = useMemo(
    () => chatList?.some((item) => item?.key === id && item?.isNew),
    [chatList, id]
  )

  const text2TextFunc = useMemoizedFn(async (inpTxt: string) => {
    // 取消之前的请求
    abortControllerRef.current?.abort()
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const requestId = nanoid()
    currentRequestId.current = requestId

    const currentMsg: Message = {
      id: nanoid(),
      aiMsg: LOADING_TIP,
      userMsg: inpTxt
    }

    setIsLoading(true)
    // 新增一条用户消息
    startTransition(() => {
      setMsgList((draft) => {
        draft.push(currentMsg)
      })
    })

    try {
      const res = await chatToDeepseekApi({ prompt: inpTxt, signal: abortController.signal })
      const reader = res?.body?.getReader?.()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const lines = decoder
          .decode(value, { stream: true })
          .split('\n')
          .filter((line) => line.startsWith('data:'))

        for (const line of lines) {
          const payload = line.slice(6).trim()
          if (!payload || payload === '[DONE]') continue

          try {
            const msg = JSON.parse(payload)?.choices?.[0]?.delta?.content ?? ''
            await new Promise((resolve) => setTimeout(resolve, 32))

            if (msg) {
              fullContent += msg
              // 只有当前请求是最新请求时才更新
              if (requestId === currentRequestId.current) {
                startTransition(() => {
                  setMsgList((draft) => {
                    const target = draft.find((m) => m.id === currentMsg.id)
                    if (target) target.aiMsg = fullContent
                  })
                })
              }
            }
          } catch (err) {
            // 单条数据解析失败不影响整体流
            // console.warn('Parse error:', parseError)
          }
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // 主动取消，不做处理
        return
      }
      // 网络错误时更新状态
      if (requestId === currentRequestId.current) {
        startTransition(() => {
          setMsgList((draft) => {
            const target = draft.find((m) => m.id === currentMsg.id)
            if (target) target.aiMsg = '请求失败，请重试'
          })
        })
      }
    } finally {
      // 只有当前请求结束时才重置 loading
      if (requestId === currentRequestId.current) {
        currentRequestId.current = null
        setIsLoading(false)
      }
    }
  })

  const abortRequestFun = useMemoizedFn(() => {
    abortControllerRef.current?.abort()
  })

  useEffect(() => {
    const newChatMessage = chatList?.[0]?.label
    if (isNewChat && newChatMessage) {
      text2TextFunc(newChatMessage)
    } else {
      setTimeout(() => {
        setIsFirstLoading(false)
        startTransition(() => {
          setMsgList(() => FAKE_MSG_LIST)
        })
      }, 1000)
    }
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [isNewChat, chatList?.[0]?.label])

  return {
    msgList, // 直接返回实时数据，可外部包裹 useDeferredValue 按需使用
    text2TextFunc,
    isStreaming: isLoading,
    abortRequestFun,
    isFirstLoading,
    isNewChat
  }
}

export default useList

// import { useState, useRef, useDeferredValue } from 'react'
// import { useMemoizedFn } from 'ahooks'
// import { nanoid } from 'nanoid'
// import { chatToDeepseekApi } from '../api'
// import { useImmer } from 'use-immer'
// import { MsgItem } from '../type/type'

// export const LOADING_TIP = 'thinking...'
// const FAKE_MSG_LIST = Array.from({ length: 500 }, (_, i) => ({
//   id: nanoid(),
//   aiMsg: `${i} 呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃`,
//   userMsg: '你好'
// }))

// function useList() {
//   const [msgList, setMsgList] = useImmer<MsgItem[]>(FAKE_MSG_LIST)
//   const deferredMsgList = useDeferredValue(msgList)
//   const [isLoading, setIsLoading] = useState(false)
//   const inpKeyRef = useRef(nanoid())

//   const text2TextFunc = useMemoizedFn(async (e) => {
//     const inpTxt = e?.target?.value?.trim() || ''
//     if (!inpTxt) return
//     inpKeyRef.current = nanoid()
//     setIsLoading(true)
//     setMsgList((d) => {
//       d.push({
//         id: nanoid(),
//         aiMsg: LOADING_TIP,
//         userMsg: inpTxt
//       })
//     })
//     const res = await chatToDeepseekApi(inpTxt)
//     const decoder = new TextDecoder()
//     const reader = res?.body?.getReader?.()
//     let fullContent = ''
//     while (reader) {
//       const curPromise = reader.read()
//       const { done, value } = await curPromise
//       if (done) {
//         setIsLoading(false)
//         break
//       }
//       const lines = decoder
//         ?.decode(value)
//         ?.split('\n')
//         ?.filter((line) => line.startsWith('data:'))
//       for (const line of lines) {
//         const formatLine = line.slice(6)
//         if (formatLine === '[DONE]') break
//         try {
//           const msg = JSON.parse(formatLine)?.choices[0]?.delta?.content || ''
//           if (msg) {
//             fullContent += msg
//             await new Promise((r) => setTimeout(r, 30))
//             setMsgList((d) => {
//               d[d.length - 1].aiMsg = fullContent
//             })
//           }
//         } catch {
//           setIsLoading(false)
//           // 忽略解析错误
//         }
//       }
//     }
//   })

//   // const text2ImageFunc = useMemoizedFn(async (e: any) => {
//   //   const inpTxt = e?.target?.value?.trim() || ''
//   //   if (!inpTxt) return
//   //   inpKeyRef.current = nanoid()
//   //   setContent(LOADING_TIP)
//   //   try {
//   //     // 1. 创建任务ID
//   //     const response = await getQianWenImageTaskIdApi(inpTxt)
//   //     const data = await response.json()
//   //     const taskId = data?.output?.task_id // 返回任务ID

//   //     // 2. 轮询获取结果
//   //     const maxAttempts = 60 // 最多轮询60次
//   //     const interval = 3000 // 每3秒查一次

//   //     for (let i = 0; i < maxAttempts; i++) {
//   //       const response = await getQianWenPollImageApi(taskId)
//   //       const data = await response.json()
//   //       if (data?.output?.task_status === 'SUCCEEDED') {
//   //         const imageUrl = data?.output?.results?.[0]?.url // 获取图片URL
//   //         setContent('')
//   //         scrollToBottom()
//   //         setImageUrl(imageUrl)
//   //         break
//   //       }
//   //       if (data?.output?.task_status === 'FAILED') {
//   //         throw new Error('任务失败')
//   //       }
//   //       await new Promise((resolve) => setTimeout(resolve, interval))
//   //     }
//   //   } catch (error) {
//   //     console.error('生成失败:', error)
//   //     throw error
//   //   }
//   // })

//   // const textEditImageFunc = useMemoizedFn(async (e) => {
//   //   const inpTxt = e?.target?.value?.trim() || ''
//   //   if (!inpTxt) return
//   //   inpKeyRef.current = nanoid()
//   //   setContent(LOADING_TIP)
//   //   const originalImageUrl =
//   //     'https://himg2.huanqiucdn.cn/attachment2010/2020/0531/20200531081222501.jpg'
//   //   const response = await editQianWenImageApi(inpTxt, originalImageUrl)
//   //   const data = await response.json()
//   //   const imageUrl = data?.output?.choices?.[0]?.message?.content?.[0]?.image
//   //   setImageUrl(imageUrl)
//   //   setContent('')
//   //   scrollToBottom()
//   // })

//   return {
//     msgList: deferredMsgList,
//     inpKey: inpKeyRef.current,
//     text2TextFunc,
//     isStreaming: isLoading
//   }
// }

// export default useList
