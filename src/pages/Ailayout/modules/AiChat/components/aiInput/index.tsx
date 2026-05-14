import { memo, useState, useRef, useEffect } from 'react'

import styled from 'styled-components'
import { Input, Button } from 'antd'
import { ArrowUpOutlined, XFilled } from '@ant-design/icons'
import { useMemoizedFn, useBoolean } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'

const { TextArea } = Input

interface AiInputProps {
  sendMsg2Ai?: (text: string) => void
  isStreaming?: boolean
  abortRequestFun?: () => void
  isDefaultPage?: boolean
  createNewChat?: (id: string, text: string) => void
}

function AiInput({
  sendMsg2Ai,
  isStreaming = false,
  abortRequestFun,
  isDefaultPage = false,
  createNewChat
}: AiInputProps) {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [isShowTip, { toggle: toggleShowTip }] = useBoolean(false)
  const tipTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const sendMessage = useMemoizedFn(() => {
    const text = inputValue.trim()
    if (!text) return
    setInputValue('')
    sendMsg2Ai?.(text)
  })

  const showAbortTip = useMemoizedFn(() => {
    toggleShowTip()
    clearTimeout(tipTimerRef.current)
    tipTimerRef.current = setTimeout(() => toggleShowTip(), 1500)
  })

  const handleKeyDown = useMemoizedFn((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return
    e.preventDefault()
    if (isDefaultPage) {
      setInputValue('')
      const newChatId = nanoid()
      if (!inputValue.trim()) return
      createNewChat?.(newChatId, inputValue.trim())
      return
    }
    if (isStreaming) {
      inputValue.trim() ? showAbortTip() : abortRequestFun?.()
      return
    }
    sendMessage()
  })

  const handleButtonClick = useMemoizedFn(() => {
    if (isDefaultPage) {
      const newChatId = nanoid()
      setInputValue('')
      createNewChat?.(newChatId)
      setTimeout(() => {
        navigate(`/aiChat/${newChatId}`)
      }, 1000)
      return
    }
    if (isStreaming) {
      abortRequestFun?.()
      return
    }
    sendMessage()
  })

  useEffect(() => {
    return () => clearTimeout(tipTimerRef.current)
  }, [])

  return (
    <AiInputWrapper>
      <TextArea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="text-area"
        onPressEnter={handleKeyDown}
        placeholder="ask me any question is ok"
        autoSize={{ minRows: 3, maxRows: 3 }}
      />
      <div className="bottom-btns">
        {isShowTip && <div className="bottom-btns-tip">停止生成</div>}
        <Button
          disabled={!inputValue && !isStreaming}
          type="primary"
          icon={isStreaming ? <XFilled /> : <ArrowUpOutlined />}
          shape="circle"
          size="large"
          onClick={handleButtonClick}
        />
      </div>
    </AiInputWrapper>
  )
}

export default memo(AiInput)

const AiInputWrapper = styled.div`
  width: 800px;
  margin: 0 auto;
  background-color: #fff;
  height: 150px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06);
  .text-area {
    &:focus {
      border: none;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
    border: none;
    outline: none;
    background-color: transparent;
  }
  .bottom-btns {
    position: relative;
    padding-top: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .bottom-btns-tip {
      position: absolute;
      top: -20px;
      right: 0;
      padding: 6px 8px;
      border-radius: 4px;
      overflow: hidden;
      background-color: #000;
      color: #ccc;
      font-size: 12px;
      font-weight: bold;
    }
  }
`
