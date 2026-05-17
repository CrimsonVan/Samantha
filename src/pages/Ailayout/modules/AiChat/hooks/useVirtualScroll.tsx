import { useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn } from 'ahooks'

const useVirtualScroll = ({
  messages,
  isStreaming,
  id
}: {
  messages: any[]
  isStreaming: boolean
  id: string
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastTotalHeightRef = useRef(0)
  const lastMsgLengthRef = useRef(0)
  const lastScrollTopRef = useRef(0)
  const lastChatIdRef = useRef('')
  const shouldAutoScrollRef = useRef(true)
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isUpScrollLockRef = useRef(false)

  const getScrollContainer = useMemoizedFn(() => scrollContainerRef.current || document.body)
  const getEstimateSize = useMemoizedFn(() => 100)
  const getMeasureElement = useMemoizedFn((el: HTMLElement) => el.getBoundingClientRect().height)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: getScrollContainer,
    estimateSize: getEstimateSize,
    measureElement: getMeasureElement,
    overscan: 5
  })
  virtualizer.shouldAdjustScrollPositionOnItemSizeChange = useMemoizedFn(() => false)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const debounceUpLockTime = isStreaming ? 1000 : 0
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollTop < lastScrollTopRef.current) {
        isUpScrollLockRef.current = true
        shouldAutoScrollRef.current = false
        if (lockTimeoutRef.current) {
          clearTimeout(lockTimeoutRef.current)
        }
        lockTimeoutRef.current = setTimeout(() => {
          isUpScrollLockRef.current = false
        }, debounceUpLockTime)
      } else if (!isUpScrollLockRef.current) {
        const currentIsAtBottom = scrollHeight - scrollTop - clientHeight < 2
        shouldAutoScrollRef.current = currentIsAtBottom
      }
      lastScrollTopRef.current = scrollTop
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current)
    }
  }, [isStreaming])

  const totalHeight = Math.max(virtualizer.getTotalSize(), lastTotalHeightRef.current)
  lastTotalHeightRef.current = totalHeight

  useLayoutEffect(() => {
    if (!scrollContainerRef.current) return
    const currentLength = messages?.length || 0
    if (currentLength !== lastMsgLengthRef.current) {
      shouldAutoScrollRef.current = true
      lastMsgLengthRef.current = currentLength
    }
    if (lastChatIdRef.current !== id) {
      lastChatIdRef.current = id
      shouldAutoScrollRef.current = true
    }
    if (shouldAutoScrollRef.current && !isUpScrollLockRef.current) {
      virtualizer.scrollToIndex(Infinity, {
        align: 'end',
        behavior: 'auto'
      })
    }
  }, [messages, id])

  const scrollToBottom = useMemoizedFn(() => {
    virtualizer.scrollToIndex(Infinity, {
      align: 'end',
      behavior: 'auto'
    })
  })

  const topTitle = useMemo(() => messages?.[0]?.userMsg || 'AI Chat', [messages])
  const items = virtualizer.getVirtualItems()

  return {
    virtualizer,
    scrollContainerRef,
    totalHeight,
    getScrollContainer,
    topTitle,
    items,
    scrollToBottom
  }
}

export default useVirtualScroll
