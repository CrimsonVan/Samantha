import styled from 'styled-components'
import { Outlet, useNavigate } from 'react-router-dom'
import { useMemoizedFn } from 'ahooks'
import useMenus from './hooks/useMenus'
import { ChatProvider as AiChatProvider } from './context/ChatContext'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const AiLayout = () => {
  const {
    menus,
    items,
    selectedKeys,
    onMenuClick,
    createNewChat,
    menusScrollRef,
    loading,
    totalHeight
  } = useMenus()
  const navigate = useNavigate()
  const goDefaultChat = useMemoizedFn(() => {
    requestAnimationFrame(() => {
      navigate(`/`)
    })
  })

  return (
    <AiLayoutWrap>
      <AiChatProvider loading={loading} chatList={menus} createNewChat={createNewChat}>
        <div className="side">
          <div className="add-chat">
            <Button
              onClick={goDefaultChat}
              className="add-chat-btn"
              shape="round"
              icon={<PlusOutlined />}
              size="middle"
            >
              添加新对话
            </Button>
          </div>
          <div className="chat-menu" ref={menusScrollRef}>
            {loading && (
              <div className="menu-spin-wrapper">
                <Spin indicator={<LoadingOutlined />} size="large" />
              </div>
            )}
            <div
              style={{
                height: `${totalHeight}px`,
                width: '100%',
                position: 'relative'
              }}
            >
              {items?.map((virtualRow) => {
                const chat: any = menus?.[virtualRow.index]
                return (
                  <div
                    key={chat.key}
                    className="menu-item-wrap"
                    data-index={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: `${virtualRow.start}px`,
                      left: 0,
                      width: '100%'
                    }}
                  >
                    <div
                      className={selectedKeys.includes(chat.key) ? 'menu-item active' : 'menu-item'}
                      onClick={() => onMenuClick(chat)}
                    >
                      {chat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="main">
          <Outlet />
        </div>
      </AiChatProvider>
    </AiLayoutWrap>
  )
}

export default AiLayout

const AiLayoutWrap = styled.div`
  height: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  min-width: 1100px;
  .ka-wrapper,
  .ka-content {
    height: 100%;
  }
  .side {
    width: 250px;
    height: 100%;
    /* overflow-y: scroll; */
    .add-chat {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      .add-chat-btn {
        height: 40px;
        width: 200px;
      }
    }
    .chat-menu {
      width: 100%;
      height: calc(100% - 60px);
      overflow-y: scroll;
      position: relative;
      .menu-spin-wrapper {
        z-index: 999;
        background-color: #fff;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
      }
      &::-webkit-scrollbar-button {
        display: none;
      }
      /* 可选：调整滚动条轨道和滑块的样式 */
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
      }
      .menu-item-wrap {
        width: 100%;
        padding: 4px 8px 0px;
        .menu-item {
          width: 100%;
          padding-left: 8px;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          line-height: 40px;
          height: 40px;
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          &:not(.active):hover {
            background-color: rgba(0, 0, 0, 0.06);
            color: rgba(0, 0, 0, 0.88);
          }
          &.active {
            background-color: #e6f4ff;
            color: #1677ff;
          }
        }
      }
    }
  }
  .main {
    /* flex: 1; */
    width: calc(100% - 250px);
    height: 100%;
    background-color: palegoldenrod;
  }
`
