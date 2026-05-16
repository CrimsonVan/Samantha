import { useState, useRef, useEffect, useMemo } from 'react'
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
  const isLockFirstRequest = useRef(false)
  const [isFirstLoading, setIsFirstLoading] = useState(true)
  const [msgList, setMsgList] = useImmer<Message[]>([])
  const isUiUpdate = useRef(true)
  const isUnFinishRender = useRef(false)
  const fullContent = useRef('')
  const [isLoading, setIsLoading] = useState(false)
  // 用于标识当前正在进行的请求
  const currentRequestId = useRef<string | null>(null)
  // 保存 AbortController 以便取消
  const abortControllerRef = useRef<AbortController | null>(null)

  const controlUiUpdate = useMemoizedFn((flag: boolean) => {
    isUiUpdate.current = flag
    if (isUnFinishRender.current && flag) {
      setMsgList((draft) => {
        const target = draft.find((m) => m.id === currentRequestId.current)
        if (target) target.aiMsg = fullContent.current
      })
      isUnFinishRender.current = false
      currentRequestId.current = null
      setIsLoading(false)
    }
  })

  const isNewChat = useMemo(
    () => chatList?.some((item) => item?.key === id && item?.isNew),
    [chatList, id]
  )

  const text2TextFunc = useMemoizedFn(async (inpTxt: string) => {
    // 取消之前的请求
    fullContent.current = ''
    abortControllerRef.current?.abort()
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const requestId = nanoid()
    currentRequestId.current = requestId

    const currentMsg: Message = {
      id: requestId,
      aiMsg: LOADING_TIP,
      userMsg: inpTxt
    }

    setIsLoading(true)
    // 新增一条用户消息
    isUiUpdate.current &&
      setMsgList((draft) => {
        draft.push(currentMsg)
      })

    try {
      const res = await chatToDeepseekApi({ prompt: inpTxt, signal: abortController.signal })
      const reader = res?.body?.getReader?.()
      const decoder = new TextDecoder()
      // let fullContent = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) {
          if (!isUiUpdate.current) {
            isUnFinishRender.current = true
          }
          break
        }

        const lines = decoder
          .decode(value, { stream: true })
          .split('\n')
          .filter((line) => line.startsWith('data:'))

        for (const line of lines) {
          const payload = line.slice(6).trim()
          if (!payload || payload === '[DONE]') continue

          try {
            const msg = JSON.parse(payload)?.choices?.[0]?.delta?.content ?? ''
            if (msg) {
              fullContent.current += msg
              // 只有当前请求是最新请求时才更新
              if (requestId === currentRequestId.current) {
                isUiUpdate.current &&
                  setMsgList((draft) => {
                    const target = draft.find((m) => m.id === requestId)
                    if (target) target.aiMsg = fullContent.current
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
        setMsgList((draft) => {
          const target = draft.find((m) => m.id === requestId)
          if (target) target.aiMsg = '请求失败，请重试'
        })
      }
    } finally {
      // 只有当前请求结束时才重置 loading
      if (requestId === currentRequestId.current && !isUnFinishRender.current) {
        currentRequestId.current = null
        setIsLoading(false)
      }
    }
  })

  const abortRequestFun = useMemoizedFn(() => {
    abortControllerRef.current?.abort()
  })

  useEffect(() => {
    if (!isLockFirstRequest.current) {
      const newChatMessage = chatList?.[0]?.label
      if (isNewChat && newChatMessage) {
        setIsFirstLoading(false)
        text2TextFunc(newChatMessage)
      } else {
        setTimeout(() => {
          setIsFirstLoading(false)
          setMsgList(() => FAKE_MSG_LIST)
        }, 1000)
      }
    }
    isLockFirstRequest.current = true
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
    isNewChat,
    controlUiUpdate
  }
}

export default useList
