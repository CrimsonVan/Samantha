import { Table } from 'antd'
import { memo } from 'react'
const ScrollxTable = ({ dataSource, refDom }: any) => {
  const columns: any = [
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
    },
    {
      title: 'Column 1',
      dataIndex: 'address',
      key: '1',
      width: 150
    },
    {
      title: 'Column 2',
      dataIndex: 'address',
      key: '2',
      width: 150
    },
    {
      title: 'Column 3',
      dataIndex: 'address',
      key: '3',
      width: 150
    },
    {
      title: 'Column 4',
      dataIndex: 'address',
      key: '4',
      width: 150
    },
    {
      title: 'Column 5',
      dataIndex: 'address',
      key: '5',
      width: 150
    },
    {
      title: 'Column 6',
      dataIndex: 'address',
      key: '6',
      width: 150
    },
    {
      title: 'Column 7',
      dataIndex: 'address',
      key: '7',
      width: 150
    },
    { title: 'Column 8', dataIndex: 'address', key: '8' },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>action</a>
    }
  ]
  //1
  //2
  return (
    <Table<any>
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 1800 }}
      sticky={{
        // getContainer: () => document.getElementById('table_box') as HTMLElement
        getContainer: () => refDom.current as HTMLElement
      }}
    />
  )
}

export default memo(ScrollxTable)
