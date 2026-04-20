import styled from 'styled-components'
import { EnterpriseTypeList } from '../../movie'
import { useCallback, useEffect, useState } from 'react'
import { produce } from 'immer'
import { Button } from 'antd'
export const TestChild = ({ type, index, enterpriseType, setPending }: any) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)

  useEffect(() => {
    setPending(
      produce((old: any) => {
        old[index] = loading
      })
    )
  }, [loading])

  useEffect(() => {
    loading &&
      setTimeout(() => {
        // console.log(`执行异步操作${index}`)
        let randomNumber = Math.floor(Math.random() * 50)
        setData(`获取未筛选数据${index + 1}号--${randomNumber}`)
        setLoading(false)
      }, 3000)
  }, [loading])

  const clickHandle = useCallback(() => {
    // setData(`获取筛选数据${index + 1}号`)
    setLoading(true)
  }, [])
  return (
    <StyleTestChild>
      {index !== 0 && <div className="line" />}
      {!(enterpriseType === EnterpriseTypeList.BRANCH) && <div className="header">{type}</div>}
      <div className="content">
        {index + 1}
        {data}
      </div>
      <div>
        <Button onClick={clickHandle}>筛选数据</Button>
      </div>
    </StyleTestChild>
  )
}

const StyleTestChild: any = styled.div`
  .header {
    background-color: pink;
    font-weight: bold;
    color: green;
  }
  .content {
    height: 100px;
    background-color: pink;
    line-height: 100px;
    text-align: center;
  }
  .line {
    height: 3px;
    background-color: #000;
  }
`
