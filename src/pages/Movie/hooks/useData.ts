import { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { produce } from 'immer'
import { useRequest, useToggle, useMemoizedFn } from 'ahooks'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
// import { omit } from 'lodash'
// import { useMyCallBack } from '../../../utils/ahooks/myUseCallback'

export function useData() {
  console.log('测试双感叹号语法', !!0, !!1)
  const [movie, { toggle: setMovie }] = useToggle('超人', '蝙蝠侠')
  const [status, { toggle: setStatus }] = useToggle('是', '否') //筛选条件
  const [open, setOpen] = useState(false)
  // const { path } = useParams()
  const userInfo = useSelector((state: any) => state.todoStore.userInfo) //状态管理仓库获取状态
  const testRef = useRef('1')
  const { state } = useLocation()
  const params = useParams()
  useEffect(() => {
    console.log('测试useEffect的回调是异步操作2')
  }, [])
  console.log('测试useEffect的回调是异步操作1')
  //模拟异步任务
  function getUsername(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('jackMa')
      }, 3000)
    })
  }
  // List
  const [list, setList] = useState([])
  //熟悉useRequest获取异步数据
  const { run: runAsync, loading } = useRequest(getUsername, {
    manual: true,
    onSuccess: (res) => {
      console.log('获取异步数据成功', res)
    },
    onBefore: () => {
      console.log('获取异步数据之前的回调')
    },
    onFinally: () => {
      console.log('获取异步数据结束的回调')
    }
  })

  useEffect(() => {
    console.log('打印location里的state', state, params.id)
    //slice
    const arr: any[] = [1, 2, 3, 4]
    let lastOne = arr[arr.length - 1]
    arr.splice(arr.length - 1, 1)
    arr.splice(2, 0, lastOne)
    console.log('slice只传一个参数', arr)

    // console.log('测试lodash的omit', omit(obj, 'a'), obj)
    const columns: any[] = [
      {
        title: 'Full Name',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left'
      },
      {
        title: 'Age',
        width: 100,
        dataIndex: 'age',
        key: 'age',
        fixed: 'left'
      }
      // {
      //   title: 'Column 1',
      //   dataIndex: 'address',
      //   key: '1',
      //   width: 150
      // },
      // {
      //   title: 'Column 2',
      //   dataIndex: 'address',
      //   key: '2',
      //   width: 150
      // },
      // {
      //   title: 'Column 3',
      //   dataIndex: 'address',
      //   key: '3',
      //   width: 150
      // },
      // {
      //   title: 'Column 4',
      //   dataIndex: 'address',
      //   key: '4',
      //   width: 150
      // },
      // {
      //   title: 'Column 5',
      //   dataIndex: 'address',
      //   key: '5',
      //   width: 150
      // },
      // {
      //   title: 'Column 6',
      //   dataIndex: 'address',
      //   key: '6',
      //   width: 150
      // },
      // {
      //   title: 'Column 7',
      //   dataIndex: 'address',
      //   key: '7',
      //   width: 150
      // },
      // { title: 'Column 8', dataIndex: 'address', key: '8' },
      // {
      //   title: 'Action',
      //   key: 'operation',
      //   fixed: 'right',
      //   width: 100
      // }
    ]

    let scroll = columns.reduce(
      (pre: any, cur: any) => {
        if (cur.width) return { x: pre.x + Number(cur.width) }
        else return pre
      },
      { x: 0 }
    )

    //!!
    const isTrue = false
    console.log('reduce', scroll, testRef.current, !!isTrue)

    //熟悉immer拷贝
    const data1 = {
      done: false,
      val: 'string',
      child: {
        name: 'lilei'
      }
    }

    const newData = produce(data1, (draft) => {
      Object.assign(draft, {
        child: {
          name: 'jack'
        }
      })
    })

    console.log('测试immer的深拷贝前', data1)
    console.log('测试immer的深拷贝后', newData)
  }, [])

  //熟悉useMemo
  //useMemo可以缓存计算结果，重新渲染时不再计算，减少性能损耗
  const useMemoArr = useMemo(() => {
    console.log('开始状态的计算')
    const arr = ['是', '否', '是', '否']
    return arr.filter((item) => item === status)
  }, [status])

  //不使用useMemo时
  // function test1() {
  //   console.log('开始状态的计算')
  //   const arr = ['是', '否', '是', '否']
  //   return arr.filter((item) => item === status)
  // }
  // const useMemoArr = test1()

  //熟悉useCallback
  //根据依赖项，缓存代码执行后生成的函数，减少性能损耗
  const testUseCallback = useCallback(() => {
    let startTime = performance.now()
    while (performance.now() - startTime < 500) {
      // 在 500 毫秒内不执行任何操作以模拟极慢的代码
    }
    console.log(`测试useCallBack成功`)
  }, [status])

  // 不用useCallback时
  // const testUseCallback = () => {
  //   let startTime = performance.now()
  //   while (performance.now() - startTime < 500) {
  //     // 在 500 毫秒内不执行任何操作以模拟极慢的代码
  //   }
  //   console.log(`测试useCallBack成功`)
  // }

  //熟悉useMemoizedFn
  //缓存代码执行后生成的函数，减少性能损耗
  const testUseMemoizedFn = useMemoizedFn(() => {
    let startTime = performance.now()
    while (performance.now() - startTime < 500) {
      // 在 500 毫秒内不执行任何操作以模拟极慢的代码
    }
    console.log(`测试useMemoizedFn成功`)
  })

  //测试二次封装的useCallback，模拟useMemoizedFn
  // const testUseMemoizedFn = useMyCallBack(() => {
  //   let startTime = performance.now()
  //   while (performance.now() - startTime < 500) {
  //     // 在 500 毫秒内不执行任何操作以模拟极慢的代码
  //   }
  //   console.log(`测试useMemoizedFn成功`)
  // })

  //所有选项
  const allOptions = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
    { label: 'E', value: 'E' },
    { label: 'F', value: 'F' }
  ]
  //默认选项
  const defaultCheckedList = ['A', 'B', 'C']

  return {
    allOptions,
    defaultCheckedList,
    useMemoArr,
    setStatus,
    movie,
    setMovie,
    runAsync,
    testUseCallback,
    testUseMemoizedFn,
    userInfo,
    open,
    setOpen,
    loading
  }
}
