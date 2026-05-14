// import React, {
//   memo,
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useReducer,
//   useRef
// } from 'react'

// type Item = {
//   id: string
// }

// type Props<T> = {
//   list: T[]
//   height: number
//   renderItem: (item: T, getContainer: () => HTMLElement) => React.ReactNode

//   estimatedItemHeight?: number
//   overscan?: number

//   // 聊天模式：新消息自动贴底
//   followBottom?: boolean

//   // keepAlive hidden时可暂停measure
//   enabled?: boolean
// }

// type Anchor = {
//   index: number
//   offset: number
// }

// function VirtualList<T extends Item>({
//   list,
//   height,
//   renderItem,
//   estimatedItemHeight = 80,
//   overscan = 6,
//   followBottom = false,
//   enabled = true
// }: Props<T>) {
//   const containerRef = useRef<HTMLDivElement>(null)

//   // 强制刷新
//   const [, forceUpdate] = useReducer((x) => x + 1, 0)

//   // 高度缓存
//   const sizeMapRef = useRef<Record<string, number>>({})

//   // prefix sum
//   const prefixSumRef = useRef<number[]>([])

//   // 当前scrollTop
//   const scrollTopRef = useRef(0)

//   // requestAnimationFrame
//   const rafRef = useRef<number>(0)

//   // ResizeObserver
//   const observerRef = useRef<ResizeObserver | null>(null)

//   // 自动贴底
//   const isAutoScrollRef = useRef(true)

//   // 上一次list长度
//   const lastLengthRef = useRef(list.length)

//   // 锚点
//   const anchorRef = useRef<Anchor>({
//     index: 0,
//     offset: 0
//   })

//   // 当前可视scrollTop（驱动渲染）
//   const visibleScrollTopRef = useRef(0)

//   // =========================
//   // rebuildPrefix
//   // =========================

//   const rebuildPrefix = useCallback(() => {
//     const prefix: number[] = new Array(list.length)

//     let sum = 0

//     for (let i = 0; i < list.length; i++) {
//       const item = list[i]

//       sum += sizeMapRef.current[item.id] ?? estimatedItemHeight

//       prefix[i] = sum
//     }

//     prefixSumRef.current = prefix
//   }, [estimatedItemHeight, list])

//   useEffect(() => {
//     rebuildPrefix()
//   }, [list, rebuildPrefix])

//   // =========================
//   // total height
//   // =========================

//   const totalHeight = prefixSumRef.current[list.length - 1] || 0

//   // =========================
//   // binary search
//   // =========================

//   const findStartIndex = useCallback((scrollTop: number) => {
//     const prefix = prefixSumRef.current

//     let low = 0
//     let high = prefix.length - 1

//     while (low <= high) {
//       const mid = (low + high) >> 1

//       if (prefix[mid] < scrollTop) {
//         low = mid + 1
//       } else {
//         high = mid - 1
//       }
//     }

//     return low
//   }, [])

//   // =========================
//   // visible range
//   // =========================

//   const { from, to, top, bottom } = useMemo(() => {
//     const scrollTop = visibleScrollTopRef.current

//     const startIndex = findStartIndex(scrollTop)

//     let endIndex = startIndex

//     while (
//       endIndex < list.length &&
//       prefixSumRef.current[endIndex] - (prefixSumRef.current[startIndex - 1] || 0) < height
//     ) {
//       endIndex++
//     }

//     const from = Math.max(0, startIndex - overscan)

//     const to = Math.min(list.length, endIndex + overscan)

//     return {
//       from,
//       to,
//       top: prefixSumRef.current[from - 1] || 0,
//       bottom: totalHeight - (prefixSumRef.current[to - 1] || 0)
//     }
//   }, [list.length, height, overscan, totalHeight, findStartIndex])

//   const visibleList = useMemo(() => {
//     return list.slice(from, to)
//   }, [from, to, list])

//   // =========================
//   // raf update
//   // =========================

//   const scheduleUpdate = useCallback(() => {
//     cancelAnimationFrame(rafRef.current)

//     rafRef.current = requestAnimationFrame(() => {
//       visibleScrollTopRef.current = scrollTopRef.current

//       forceUpdate()
//     })
//   }, [])

//   // =========================
//   // scroll
//   // =========================

//   const onScroll = useCallback(
//     (e: React.UIEvent<HTMLDivElement>) => {
//       const el = e.currentTarget

//       const top = el.scrollTop

//       scrollTopRef.current = top

//       isAutoScrollRef.current = el.scrollHeight - (top + el.clientHeight) < 4

//       const index = findStartIndex(top)

//       const prevTop = prefixSumRef.current[index - 1] || 0

//       anchorRef.current = {
//         index,
//         offset: top - prevTop
//       }

//       scheduleUpdate()
//     },
//     [findStartIndex, scheduleUpdate]
//   )

//   // =========================
//   // ResizeObserver
//   // =========================

//   useEffect(() => {
//     if (!enabled) return

//     observerRef.current = new ResizeObserver((entries) => {
//       let changed = false

//       for (const entry of entries) {
//         const el = entry.target as HTMLElement

//         const id = el.dataset.id

//         if (!id) continue

//         const height = Math.ceil(entry.contentRect.height)

//         if (sizeMapRef.current[id] !== height) {
//           sizeMapRef.current[id] = height
//           changed = true
//         }
//       }

//       if (!changed) return

//       rebuildPrefix()

//       const container = containerRef.current

//       if (!container) return

//       // 聊天模式贴底
//       if (followBottom && isAutoScrollRef.current) {
//         requestAnimationFrame(() => {
//           container.scrollTop = container.scrollHeight
//         })

//         return
//       }

//       // 锚点恢复
//       const { index, offset } = anchorRef.current

//       const nextTop = (prefixSumRef.current[index - 1] || 0) + offset

//       requestAnimationFrame(() => {
//         container.scrollTop = nextTop
//       })

//       scheduleUpdate()
//     })

//     return () => {
//       observerRef.current?.disconnect()
//       observerRef.current = null
//     }
//   }, [enabled, followBottom, rebuildPrefix, scheduleUpdate])

//   // =========================
//   // auto bottom
//   // =========================

//   useLayoutEffect(() => {
//     if (!followBottom) return

//     const container = containerRef.current

//     if (!container) return

//     const hasNewMessage = lastLengthRef.current !== list.length

//     lastLengthRef.current = list.length

//     if (isAutoScrollRef.current || hasNewMessage) {
//       requestAnimationFrame(() => {
//         container.scrollTop = container.scrollHeight
//       })
//     }
//   }, [list.length, followBottom])

//   // =========================
//   // visible restore
//   // =========================

//   useEffect(() => {
//     if (!enabled) return

//     requestAnimationFrame(() => {
//       rebuildPrefix()
//       forceUpdate()
//     })
//   }, [enabled, rebuildPrefix])

//   // =========================
//   // getContainer
//   // =========================

//   const getContainer = useCallback(() => {
//     return containerRef.current || document.body
//   }, [])

//   // =========================
//   // row
//   // =========================

//   const renderRows = useMemo(() => {
//     return visibleList.map((item, i) => {
//       const index = from + i

//       return (
//         <Row key={item.id} id={item.id} index={index} observer={observerRef}>
//           {renderItem(item, getContainer)}
//         </Row>
//       )
//     })
//   }, [visibleList, from, renderItem, getContainer])

//   // =========================
//   // render
//   // =========================

//   return (
//     <div
//       ref={containerRef}
//       onScroll={onScroll}
//       style={{
//         height,
//         overflow: 'auto',
//         overflowAnchor: 'none',
//         WebkitOverflowScrolling: 'touch'
//       }}
//     >
//       <div
//         style={{
//           height: totalHeight,
//           position: 'relative'
//         }}
//       >
//         <div style={{ height: top }} />

//         {renderRows}

//         <div style={{ height: bottom }} />
//       </div>
//     </div>
//   )
// }

// // =========================
// // Row
// // =========================

// type RowProps = {
//   id: string
//   index: number
//   children: React.ReactNode
//   observer: React.RefObject<ResizeObserver | null>
// }

// const Row = memo(({ id, index, children, observer }: RowProps) => {
//   const ref = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (!node) return

//       observer.current?.observe(node)
//     },
//     [observer]
//   )

//   return (
//     <div ref={ref} data-id={id} data-index={index}>
//       {children}
//     </div>
//   )
// })

// Row.displayName = 'Row'

// export default memo(VirtualList)

import React, { useRef, useState, useEffect, useLayoutEffect, memo, useMemo } from 'react'
import { useMemoizedFn } from 'ahooks'
import { throttle } from 'lodash'
type Item = { id: string }

type Props<T> = {
  list: T[]
  height: number
  renderItem: (item: T, getContainer: () => HTMLElement) => React.ReactNode
  estimatedItemHeight?: number
  overscan?: number
  followBottom?: boolean // 👈 聊天模式
}

function VirtualList<T extends Item>({
  list,
  height,
  renderItem,
  estimatedItemHeight = 60,
  overscan = 5,
  followBottom = false
}: Props<T>) {
  const lastListCountRef = useRef(list.length)
  const isAutoScrollRef = useRef(true)
  const containerRef = useRef<HTMLDivElement>(null)
  // 每项高度
  const sizeMap = useRef<Record<number, number>>({})

  // 前缀和缓存
  const prefixSum = useRef<number[]>([])

  const [scrollTop, setScrollTop] = useState(0)

  // 🔁 更新前缀和
  const rebuildPrefix = () => {
    const arr: number[] = []
    let sum = 0
    for (let i = 0; i < list.length; i++) {
      const h = sizeMap.current[i] ?? estimatedItemHeight
      sum += h
      arr[i] = sum
    }
    prefixSum.current = arr
  }

  useEffect(() => {
    rebuildPrefix()
  }, [list.length])

  // 📏 获取总高度
  const totalHeight = prefixSum.current[list.length - 1] || 0

  // 🔍 二分找 startIndex
  const findStartIndex = (scrollTop: number) => {
    let low = 0
    let high = prefixSum.current.length - 1

    while (low <= high) {
      const mid = (low + high) >> 1
      if (prefixSum.current[mid] < scrollTop) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    return low
  }

  const startIndex = findStartIndex(scrollTop)

  // 👀 计算可视区
  let endIndex = startIndex
  while (
    endIndex < list.length &&
    prefixSum.current[endIndex] - (prefixSum.current[startIndex - 1] || 0) < height
  ) {
    endIndex++
  }

  const from = Math.max(0, startIndex - overscan)
  const to = Math.min(list.length, endIndex + overscan)

  const top = prefixSum.current[from - 1] || 0

  const bottom = totalHeight - (prefixSum.current[to - 1] || 0)

  // 🧠 锚点（防止跳动）
  const anchorRef = useRef({
    index: 0,
    offset: 0
  })

  const onScroll = useMemoizedFn((e: React.UIEvent) => {
    const el = e.currentTarget
    if (!el) return
    // ⭐ 如果是程序触发（贴底过程），忽略
    const top = el.scrollTop
    setScrollTop(top)
    // if (isStickToBottomRef.current) return
    isAutoScrollRef.current = el.scrollHeight - (el.scrollTop + el.clientHeight) < 4

    const index = findStartIndex(top)
    const prevTop = prefixSum.current[index - 1] || 0

    anchorRef.current = {
      index,
      offset: top - prevTop
    }
    // ⭐ 用户控制自动滚动
    // setScrollTop(top)
  })

  // 📏 ResizeObserver 动态测量
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      let changed = false

      for (const entry of entries) {
        const el = entry.target as HTMLElement
        const index = Number(el.dataset.index)
        const h = entry.contentRect.height

        if (sizeMap.current[index] !== h) {
          sizeMap.current[index] = h
          changed = true
        }
      }

      if (changed) {
        rebuildPrefix()
        // ⭐ 如果在底部，直接贴底，不走锚点

        const el = containerRef.current
        if (!el) return
        // 🔧 锚点修正
        const { index, offset } = anchorRef.current
        const newTop = (prefixSum.current[index - 1] || 0) + offset

        if (el) {
          el.scrollTop = el.scrollHeight > newTop ? el.scrollHeight : newTop
        }
      }
    })

    const nodes = containerRef.current?.querySelectorAll('[data-index]') || []

    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  })

  const visibleList = list.slice(from, to)

  // 📌 自动贴底（聊天）
  useLayoutEffect(() => {
    if (!followBottom) return
    const el = containerRef.current
    if (!el) return
    if (isAutoScrollRef.current || lastListCountRef.current !== list.length) {
      lastListCountRef.current = list.length
      el.scrollTop = el.scrollHeight
    }
  }, [visibleList, followBottom])

  const getContainer = useMemoizedFn(() => containerRef.current || document.body)

  return (
    <div ref={containerRef} style={{ height, overflow: 'auto' }} onScroll={onScroll}>
      <div style={{ height: totalHeight }}>
        <div style={{ height: top }} />
        {list.slice(from, to).map((item, i) => {
          const index = from + i
          return (
            <div key={item.id} data-index={index}>
              {renderItem(item, getContainer)}
            </div>
          )
        })}
        <div style={{ height: bottom }} />
      </div>
    </div>
  )
}

export default memo(VirtualList)
