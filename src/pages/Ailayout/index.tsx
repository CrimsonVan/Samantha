import styled from 'styled-components'
import { Outlet, useNavigate } from 'react-router-dom'
import { useMemoizedFn } from 'ahooks'
import useMenus from './hooks/useMenus'
import { ChatProvider as AiChatProvider } from './context/ChatContext'

import { Button, Menu, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { PlusOutlined } from '@ant-design/icons'

const AiLayout = () => {
  const { menus, selectedKeys, onMenuClick, createNewChat, menusScrollRef, loading } = useMenus()
  const navigate = useNavigate()
  const goDefaultChat = useMemoizedFn(() => {
    navigate(`/`)
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
            {loading ? (
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Spin indicator={<LoadingOutlined />} size="large" />
              </div>
            ) : (
              <Menu selectedKeys={selectedKeys} items={menus} onClick={onMenuClick} />
            )}
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
      height: calc(100% - 60px);
      overflow-y: scroll;
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
      .ant-menu {
        background-color: #f5f5f5;
        border-inline-end: none;
        /* .ant-menu-item {
          transition: none;
        } */
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
