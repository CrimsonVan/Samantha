import { useEffect, useMemo, useRef, useState } from 'react'

import { nanoid } from 'nanoid'
import { useImmer } from 'use-immer'
import { useMemoizedFn } from 'ahooks'
import { useNavigate, useParams } from 'react-router-dom'
import { useVirtualizer } from '@tanstack/react-virtual'

const FAKE_ITEMS = new Array(10000).fill({}).map(() => ({
  label: '你好，Deepseek',
  key: nanoid()
}))

const useMenus = () => {
  const [loading, setLoading] = useState(true)
  const [menus, setMenus] = useImmer<any[]>([])
  const menusScrollRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const { id = '' } = useParams()

  const getScrollContainer = useMemoizedFn(() => menusScrollRef.current || document.body)
  const getEstimateSize = useMemoizedFn(() => 44)
  const virtualizer = useVirtualizer({
    count: menus.length,
    getScrollElement: getScrollContainer,
    estimateSize: getEstimateSize,
    overscan: 5
  })
  virtualizer.shouldAdjustScrollPositionOnItemSizeChange = useMemoizedFn(() => false)

  const selectedKeys = useMemo(() => (id ? [id] : []), [id])

  const onMenuClick = useMemoizedFn(({ key }) => {
    if (key !== id) {
      requestAnimationFrame(() => {
        navigate(`/aiChat/${key}`)
      })
    }
  })

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
    virtualizer.scrollToIndex(0, {
      align: 'start',
      behavior: 'smooth'
    })
  })

  const items = virtualizer.getVirtualItems()
  const totalHeight = virtualizer?.getTotalSize() || 0

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setMenus(() => FAKE_ITEMS)
    }, 1000)
  }, [])

  return {
    menus,
    items,
    selectedKeys,
    menusScrollRef,
    loading,
    createNewChat,
    onMenuClick,
    goDefaultChat,
    totalHeight,
    virtualizer
  }
}

export default useMenus
