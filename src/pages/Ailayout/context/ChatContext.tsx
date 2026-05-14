import { createContext, useContext, type ReactNode } from 'react'

interface ChatContextType {
  createNewChat: (id: string, text: string) => void
  chatList: any[]
  loading: boolean
}

const ChatContext = createContext<ChatContextType | null>(null)

export const ChatProvider = ({
  createNewChat,
  chatList,
  loading,
  children
}: {
  createNewChat: (id: string, text: string) => void
  children: ReactNode
  chatList: any[]
  loading: boolean
}) => {
  return (
    <ChatContext.Provider value={{ createNewChat, chatList, loading }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
