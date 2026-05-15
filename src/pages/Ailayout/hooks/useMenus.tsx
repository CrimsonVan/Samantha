import { useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { nanoid } from 'nanoid'
import { useImmer } from 'use-immer'
import { useMemoizedFn } from 'ahooks'
import { useNavigate, useParams } from 'react-router-dom'

const FAKE_ITEMS = new Array(23).fill({}).map(() => ({
  label: '你好，Deepseek',
  key: nanoid()
}))

const useMenus = () => {
  const [loading, setLoading] = useState(true)
  const [menus, setMenus] = useImmer<any[]>([])
  const menusScrollRef = useRef<HTMLDivElement>(null)
  const [, startTransition] = useTransition()

  const navigate = useNavigate()
  const { id = '' } = useParams()

  const selectedKeys = useMemo(() => (id ? [id] : []), [id])

  const rafIdRef = useRef<any>(null)

  const onMenuClick = useMemoizedFn(({ key }) => {
    if (key !== id) {
      startTransition(() => {
        navigate(`/aiChat/${key}`)
      })
    }
  })

  // 组件卸载时取消
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  const goDefaultChat = useMemoizedFn(() => {
    navigate(`/`)
  })

  const createNewChat = useMemoizedFn((id: string, text: string) => {
    if (!id || loading) return
    navigate(`/aiChat/${id}`)
    setMenus((d) => {
      d[0].isNew = false
      d.unshift({
        label: text || '新对话',
        key: id,
        isNew: true
      })
    })
    menusScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setMenus(() => FAKE_ITEMS)
    }, 1000)
  }, [])

  return {
    menus,
    selectedKeys,
    menusScrollRef,
    loading,
    createNewChat,
    onMenuClick,
    goDefaultChat
  }
}

export default useMenus
