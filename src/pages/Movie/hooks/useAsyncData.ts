import { useEffect, useState } from 'react'

import { useRequest } from 'ahooks'

export const useAsyncData = () => {
  //模拟异步任务
  function getUsername(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([1, 2, 3, 4, 5])
      }, 2000)
    })
  }
  // List
  const [list, setList] = useState([])
  const [total, setTotal] = useState('')
  //熟悉useRequest获取异步数据
  const { run, loading, error } = useRequest(getUsername, {
    manual: true,
    onSuccess: (res: any) => {
      switch (res[0]) {
        case 1:
          setTotal('991')
          break
        case 2:
          setTotal('992')
          break
        case 3:
          setTotal('993')
          break
      }
      setList(res)
    },
    onBefore: () => {
      // console.log('获取异步数据之前的回调')
    },
    onFinally: () => {
      // console.log('获取异步数据结束的回调')
    }
  })
  //
  useEffect(() => {
    run()
  }, [run])
  //接口兼容
  useEffect(() => {
    if (error) {
      setList([])
    }
  }, [error])
  return {
    loading,
    list,
    total
  }
}
