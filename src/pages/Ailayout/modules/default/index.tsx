import styled from 'styled-components'

import { useChatContext } from '../../context/ChatContext'
import AiInput from '../AiChat/components/aiInput'

const DefaultModule = () => {
  const { createNewChat } = useChatContext()
  return (
    <DefaultModuleWrapper>
      <AiInput createNewChat={createNewChat} isDefaultPage />
    </DefaultModuleWrapper>
  )
}
export default DefaultModule

const DefaultModuleWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
