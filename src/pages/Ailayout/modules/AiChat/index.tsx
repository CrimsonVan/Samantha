import { memo, useMemo } from 'react'

import { useParams } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import useList from './hooks/useList'
import AiReplyContent from './components/aiReplyContent'
import { LayoutWrapper } from './style'
import useVirtualScroll from './hooks/useVirtualScroll'
import AiInput from './components/aiInput'
import KeepAlive, { useActivate, useUnactivate } from 'react-activation'
import { Spin } from 'antd'
import { useChatContext } from '../../context/ChatContext'

interface AiChatProps {
  id: string
  chatList: any[]
}

const AiChat = memo(({ id = '', chatList }: AiChatProps) => {
  const { msgList, text2TextFunc, isStreaming, abortRequestFun, isFirstLoading, isNewChat } =
    useList({
      chatList,
      id
    })

  const {
    virtualizer,
    scrollContainerRef,
    getScrollContainer,
    totalHeight,
    topTitle,
    items,
    scrollToBottom
  } = useVirtualScroll({
    messages: msgList,
    isStreaming,
    id
  })

  useActivate(() => {
    scrollToBottom()
  })

  useUnactivate(() => {
    scrollToBottom()
  })

  return (
    <LayoutWrapper>
      <div className="top">{topTitle}</div>
      {isFirstLoading && !isNewChat ? (
        <div className="spin-wrapper">
          <Spin indicator={<LoadingOutlined />} size="large" />
        </div>
      ) : (
        <>
          <div className="content" ref={scrollContainerRef}>
            <div
              style={{
                height: `${totalHeight}px`,
                width: '100%',
                position: 'relative'
              }}
            >
              {items.map((virtualRow) => {
                const message = msgList[virtualRow.index]
                return (
                  <div
                    key={message.id}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: `${virtualRow.start}px`,
                      left: 0,
                      width: '100%'
                    }}
                  >
                    <div className="msg-item" key={message.id}>
                      <div className="user-msg">
                        <div className="user-content">{message.userMsg}</div>
                      </div>
                      <AiReplyContent content={message.aiMsg} getContainer={getScrollContainer} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <AiInput
            sendMsg2Ai={text2TextFunc}
            isStreaming={isStreaming}
            abortRequestFun={abortRequestFun}
          />
          <div className="tip-row">ai信息需要鉴别</div>
        </>
      )}
    </LayoutWrapper>
  )
})

const Entry = () => {
  const { id = '' } = useParams()
  const { chatList } = useChatContext()
  const isNewChat = useMemo(
    () => chatList?.some((item) => item?.key === id && item?.isNew),
    [chatList, id]
  )
  return (
    <KeepAlive id={id}>
      <AiChat id={id} chatList={chatList} />
    </KeepAlive>
  )
}

export default Entry

// const Test = () => {
//   const [num, setNum] = useState(0)
//   return (
//     <div style={{ height: '100%', width: '100%', backgroundColor: 'pink' }}>
//       <button onClick={() => setNum((prev) => prev + 1)}>click</button>
//       <div>{num}</div>
//       <div>
//         <input type="text" />
//       </div>
//     </div>
//   )
// }
