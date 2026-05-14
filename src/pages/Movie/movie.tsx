import { useState, useEffect } from 'react'

import { useMemoizedFn } from 'ahooks'
import { KeepAlive } from 'react-activation'

/** 全局变量导致的内存泄漏 */
const LeakyOne = () => {
  const [count, setCount] = useState(0)
  const clickFunc = useMemoizedFn(() => {
    // let leakMem = []
    // for (let i = 0; i < 10000; i++) {
    //   leakMem.push('只'.repeat(6000 * (count + 1)))
    // }
    const hugeArray = new Array(1000000).fill('只因只因只因只因')
    window.winLeakMem = hugeArray
    // if (window.winLeakMem instanceof Array) {
    //   console.log('winLeakMem')
    //   window.winLeakMem.push(leakMem)
    // } else {
    //   window.winLeakMem = [leakMem]
    // }
    setCount((c) => c + 1)
  })

  return (
    <div style={{ backgroundColor: 'pink' }}>
      <h3>计数器: {count}</h3>
      {/* <p>当前泄漏内存: {window.winLeakMem?.length || 0}</p> */}
      <button onClick={clickFunc}>点击增加内存泄漏</button>
    </div>
  )
}

/** 监听事件未移除导致的内存泄漏 */
// const LeakyOne = () => {
//   const [count, setCount] = useState(0)
//   const clickFunc = useCallback(() => {
//     for (let i = 0; i < 10000; i++) {
//       const handleResize = () => {
//         return {}
//       }
//       window.addEventListener('resize', handleResize)
//     }
//     setCount((c) => c + 1)
//   }, [])

//   return (
//     <div style={{ backgroundColor: 'pink' }}>
//       <h3>计数器: {count}</h3>
//       {/* <p>当前泄漏内存: {outLeakMem.current.length}</p> */}
//       <button onClick={clickFunc}>点击增加内存泄漏</button>
//     </div>
//   )
// }

// function MyObject() {
//   this.prop = 'value'
// }

// /** 内存泄漏 */
// const LeakyOne = () => {
//   const [count, setCount] = useState(0)
//   const clickFunc = useCallback(() => {
//     let leakMem = []
//     for (let i = 0; i < 200000; i++) {
//       leakMem.push(new MyObject() as any)
//     }
//     window.winMyObject = leakMem
//     setCount((c) => c + 1)
//   }, [])

//   return (
//     <div style={{ backgroundColor: 'pink' }}>
//       <h3>计数器: {count}</h3>
//       {/* <p>当前泄漏内存: {outLeakMem.current.length}</p> */}
//       <button onClick={clickFunc}>点击增加内存泄漏</button>
//     </div>
//   )
// }

const apiOne = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      let leakMem = []
      for (let i = 0; i < 10000; i++) {
        leakMem.push('只'.repeat(1000))
      }
      resolve(leakMem)
    }, 7000)
  })

/** 用户退出的例子 */
// const LeakyOne = () => {
//   const [count, setCount] = useState(0)
//   const [bigData, setBigData] = useState<any[]>([])

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     const res: any = await apiOne()
//   //     // console.log('res', res.length)
//   //     setCount(res.length)
//   //   }
//   //   fetchData()
//   // }, [])

//   useEffect(() => {
//     // 模拟大数据
//     const hugeArray = new Array(1000000).fill('只因只因只因只因')

//     // 这个 setTimeout 的回调函数会形成闭包
//     const timer = setTimeout(() => {
//       // 闭包捕获了：
//       // 1. setCount - 持有对组件状态的引用
//       // 2. hugeArray - 持有对大数组的引用
//       // 3. 整个组件的词法环境
//       // setCount((prev) => prev + 1)
//       // const hugeArray = new Array(1000000).fill('只因只因只因只因')
//       setBigData(hugeArray)
//     }, 5000) // 10秒后才执行

//     // 如果组件在5秒后卸载，timer还在等待执行
//     // 组件不会被垃圾回收，因为闭包还在引用它
//   }, [])

//   return (
//     <div style={{ backgroundColor: 'pink' }}>
//       <h3>计数器: {count}</h3>
//       <p>当前大数据: {bigData.length}</p>
//       {/* <p>当前泄漏内存: {window.winLeakMem?.length || 0}</p> */}
//       {/* <button onClick={clickFunc}>点击增加内存泄漏</button> */}
//     </div>
//   )
// }

const Entry = () => {
  const [isRender, setIsRender] = useState(true)
  return (
    <div>
      <button onClick={() => setIsRender(!isRender)}>切换渲染</button>
      {isRender && <LeakyOne />}
    </div>
  )
}

export default Entry
