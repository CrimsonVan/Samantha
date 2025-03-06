import './todolist.scss'
import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { addTodoArr, delTodoArr, editTodoArr } from '../../store/modules/todollist'
function Todolist() {
  const a = 1
  console.log(a)
  const dispatch: AppDispatch = useDispatch()
  // 查询state中的数据
  const todolist = useSelector((state: RootState) => state.todoStore.todoArr)
  //   type Arr = Array<string>;
  //   const [arr, setArr] = useState<Arr>(["1.唱歌", "2.睡觉", "3.吃饭"]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [inpValue, setInpValue] = useState<string>('测试')
  const [editValue, setEditValue] = useState<string>('')
  let domRef = useRef<HTMLInputElement>(null)
  const clickHandle = (index: number, item: string) => {
    setActiveIndex(index)
    setEditValue(item)
    console.log(item)

    setTimeout(() => {
      domRef.current?.focus()
    }, 0)
  }
  const changeItem = (value: string) => {
    // arr[index] = value;
    setEditValue(value)
    // setArr(arr);
    // dispatch(editTodoArr({ index: i, val: value }));
  }
  //删除
  const delHandle = (i: number) => {
    // let newArr: Array<string> = arr.filter(
    //   (item, index) => item && index !== i
    // );
    // setArr(newArr);
    dispatch(delTodoArr(i))
  }
  const changeValue = (val: string) => {
    setInpValue(val)
  }
  //增加
  const addItem = () => {
    // setArr([...arr, inpValue]);
    // setInpValue("");
    dispatch(addTodoArr(inpValue))
  }
  //修改
  const blurHandle = () => {
    setActiveIndex(null)
    dispatch(editTodoArr({ index: activeIndex, val: editValue }))
  }
  return (
    <div className="todolist">
      <div className="inp">
        <input
          value={inpValue}
          onChange={(e) => changeValue(e.target.value)}
          className="input"
          type="text"
          placeholder="请输入想要做的事吧"
        />
        <button className="btn" onClick={() => addItem()}>
          添加
        </button>
      </div>
      <div className="list">
        {todolist.map((item, index) => (
          <div key={index} className="listItem">
            {index === activeIndex ? (
              <input
                className="leftInp"
                ref={domRef}
                value={editValue}
                // value={item}
                onChange={(e) => changeItem(e.target.value)}
                onBlur={() => blurHandle()}
              />
            ) : (
              <div className="left">{item}</div>
            )}

            <div className="right">
              <button onClick={() => clickHandle(index, item)}>编辑</button>
              <button onClick={() => delHandle(index)}>删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Todolist
