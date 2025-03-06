import Styles from './movie.module.less'
import styled from 'styled-components'
import cn from 'classnames'
import { useData } from './hooks/useData'
import { useFullscreen } from 'ahooks'
import { useEffect, useRef } from 'react'
import MovieChild from './components/movieChild'
import PaginationComp from '../../global/myAntd/PaginationCom'
import CheckBoxGroup from '../../global/myAntd/CheckboxComp'
import { useClickOutside } from '../../global/myHooks/useClickOutside'
import { Link } from 'react-router-dom'
import { DatePicker, Button } from 'antd'
import { CvButton } from './myAntd/CvButton'
import { cvMessage } from './myAntd/CvMessage'
import dayjs from 'dayjs'
import { message } from 'antd'
import ScrollxTable from './components/table'
const { RangePicker } = DatePicker
// const columns: any = [
//   {
//     title: 'Full Name',
//     width: 100,
//     dataIndex: 'name',
//     key: 'name',
//     fixed: 'left'
//   },
//   {
//     title: 'Age',
//     width: 100,
//     dataIndex: 'age',
//     key: 'age',
//     fixed: 'left'
//   },
//   {
//     title: 'Column 1',
//     dataIndex: 'address',
//     key: '1',
//     width: 150
//   },
//   {
//     title: 'Column 2',
//     dataIndex: 'address',
//     key: '2',
//     width: 150
//   },
//   {
//     title: 'Column 3',
//     dataIndex: 'address',
//     key: '3',
//     width: 150
//   },
//   {
//     title: 'Column 4',
//     dataIndex: 'address',
//     key: '4',
//     width: 150
//   },
//   {
//     title: 'Column 5',
//     dataIndex: 'address',
//     key: '5',
//     width: 150
//   },
//   {
//     title: 'Column 6',
//     dataIndex: 'address',
//     key: '6',
//     width: 150
//   },
//   {
//     title: 'Column 7',
//     dataIndex: 'address',
//     key: '7',
//     width: 150
//   },
//   { title: 'Column 8', dataIndex: 'address', key: '8' },
//   {
//     title: 'Action',
//     key: 'operation',
//     fixed: 'right',
//     width: 100,
//     render: () => <a>action</a>
//   }
// ]

// const dataSource = Array.from({ length: 100 }).map<any>((_, i) => ({
//   key: i,
//   name: `Edward ${i}`,
//   age: 32,
//   address: `London Park no. ${i}`
// }))
function Movie() {
  const dataSource = Array.from({ length: 100 }).map<any>((_, i) => ({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`
  }))
  // 限制日期函数
  const disabledDate = (current: any) => {
    const dateFormat = 'YYYY-MM-DD'
    return (
      current &&
      (current > dayjs('2020-12-01', dateFormat) || current < dayjs('2020-01-01', dateFormat))
    )
  }
  //需要全屏的Dom
  const fullScreenDom = useRef<any>(null)
  //熟悉useFullscreen
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(fullScreenDom, {
    pageFullscreen: true
  })
  //测试自定义hooks
  const {
    allOptions,
    defaultCheckedList,
    userInfo,
    useMemoArr,
    setStatus,
    movie,
    setMovie,
    runAsync,
    testUseCallback,
    testUseMemoizedFn,
    open,
    setOpen,
    loading
  } = useData()
  //dom
  const table_box_dom = useRef(null)
  //获取dom
  useEffect(() => {
    console.log('table_dom', table_box_dom.current)
  }, [])
  //二次封装的antd的回调
  function onChange(page_num: number) {
    console.log('测试二次封装antd回调', page_num)
  }
  //dom
  const btnDom = useRef(null)
  //winDom
  const winDom = useRef(null)
  //点击dom外触发事件得到钩子
  useClickOutside(btnDom, winDom, () => {
    setOpen(false)
  })
  //日期选择
  const change = (e: any) => {
    console.log(
      '打印所选择的日期',
      e.map((item: any) => dayjs(item).format('YYYY-MM-DD'))
    )
  }
  return (
    <>
      <div style={{ height: '20vh', backgroundColor: 'green' }}></div>
      <div
        ref={table_box_dom}
        style={{ height: '80vh', backgroundColor: '#fff', overflowY: 'scroll' }}
      >
        <ScrollxTable
          refDom={table_box_dom}
          dataSource={dataSource}
          style={{ width: '800px' }}
        ></ScrollxTable>
        <div className={Styles.btnContainer} style={{ marginLeft: '50px', marginTop: '30px' }}>
          <Button
            type="primary"
            onClick={() => {
              message.success('成功')
            }}
          >
            按钮
          </Button>
        </div>
        <div>
          <p>antd版:</p>
          <Button
            onClick={() => {
              message.info('手写版button回调', 300)
            }}
          >
            按钮
          </Button>
          <span className={Styles.btnSpan}>
            <Button type="primary">按钮</Button>
          </span>
          <Button danger className={Styles.antdBtnClass}>
            按钮
          </Button>
          <Button type="primary" danger>
            按钮
          </Button>
          <Button danger size="large">
            按钮
          </Button>
          <Button type="primary" danger size="large">
            按钮
          </Button>
          <Button danger size="small">
            按钮
          </Button>
          <Button type="primary" danger size="small" style={{ marginLeft: '10px' }}>
            按钮
          </Button>
        </div>
        <div>
          <p>手写版：</p>
          <CvButton
            onClick={() => {
              // message.info('手写版button回调', 300)
              cvMessage.info('手写版全局提示')
            }}
          >
            按 钮
          </CvButton>
          <span className={Styles.myBtnSpan}>
            <CvButton type="primary">按 钮</CvButton>
          </span>
          <CvButton danger className={Styles.newBtnClass}>
            按 钮
          </CvButton>
          <CvButton type="primary" danger>
            按 钮
          </CvButton>
          <CvButton danger size="large">
            按 钮
          </CvButton>
          <CvButton type="primary" danger size="large">
            按 钮
          </CvButton>
          <CvButton danger size="small">
            按 钮
          </CvButton>
          <CvButton type="primary" danger size="small" style={{ marginLeft: '10px' }}>
            按 钮
          </CvButton>
        </div>
        <div className={Styles.movie}>
          <div className={cn(Styles['movie-item'], { [Styles.active]: true })}></div>
        </div>

        <div className={Styles.movie2} ref={fullScreenDom}>
          {isFullscreen ? '全屏中' : '不在全屏中'}
          <button onClick={toggleFullscreen}>切换全屏</button>
        </div>
        <div>
          <Link to="/test">state</Link>
        </div>
        <CheckBoxGroup
          type="button"
          boxOptions={allOptions}
          defaultCheckedList={defaultCheckedList}
          isTitle={false}
          onFinished={(e: any) => {
            console.log('确认后的回调', e)
          }}
        />
        <StyleComp>
          <div className="sc-item">{userInfo.id}</div>
          <MovieChild
            testUseCallback={testUseCallback}
            testUseMemoizedFn={testUseMemoizedFn}
          ></MovieChild>
        </StyleComp>
        <div>{loading ? 'loading中' : 'loading结束'}</div>
        <div>
          <button onClick={() => testUseCallback()}>useCallback</button>
        </div>
        <div>
          <button onClick={() => runAsync()}>runAsync</button>
        </div>
        <div>
          <button onClick={() => setMovie()}>切换</button>
        </div>
        <p>{movie}</p>
        <div>
          <button onClick={() => setStatus()}>筛选</button>
        </div>
        {useMemoArr.map((item, index) => (
          <div key={index} className={Styles['list-item']}>
            {item}
          </div>
        ))}

        <PaginationComp pageSize={8} total={99} onChange={onChange}></PaginationComp>
        <button ref={btnDom} onClick={() => setOpen(true)}>
          open
        </button>
        {open && (
          <PopComp ref={winDom} width="400px">
            弹窗
          </PopComp>
        )}
        <div>
          <RangePicker onChange={change} disabledDate={disabledDate} />
        </div>
      </div>
    </>
  )
}

const StyleComp: any = styled.div`
  height: 100px;
  background-color: green;
  position: sticky;
  display: flex;
  overflow: hidden;
  .sc-item {
    width: 40px;
    background-color: yellowgreen;
  }
`
const PopComp: any = styled.div`
  height: 100px;
  width: ${(props: any) => props.width || '150px'};
  background-color: palegoldenrod;
  box-sizing: border-box;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
`
export default Movie
