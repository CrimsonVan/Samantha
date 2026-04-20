import { useState } from 'react'
import { useAsyncData } from './useAsyncData'
export const useRenderAndData = () => {
  /** 默认文本 */
  const [text, setText] = useState('测试文本')

  /** 获取异步数据 */
  const { loading, list, total } = useAsyncData()

  return {
    text,
    setText,
    loading,
    list,
    total
  }
}
