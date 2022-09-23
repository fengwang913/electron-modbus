import { FC, useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import type { TableRowSelection } from 'antd/lib/table/interface';
import axios from 'axios';


const { ipcRenderer } = require('electron')
// import { store } from '@/utils/store';
// import TableColumns, { DataType } from './columns';


const rowSelection: TableRowSelection<any> = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

const Send: FC = () => {
  const [data, setData] = useState([]);
  const getBookData = async () => {
    // const bookList = await store.get('books');
    // console.log('bookList', bookList);
    const mergeArray: any = [];
    // Object.values(bookList).forEach((value: any) => {
    //   mergeArray.push(...(value.filter((item: Record<string, any>) => !!!item.sendStatus)));
    // });
    setData(mergeArray);
  }


  useEffect(() => {
    getBookData();
  }, []);

    // 封装一个promise reader.onload
    const  testCommunication = () =>{

      console.log('-----send---')
      let value = 1
      ipcRenderer.on('asynchronous-reply', (_event, arg) => {
        console.log('---------arg',arg) // 在 DevTools 控制台中打印“pong”
      })
      ipcRenderer.send('asynchronous-message', 'ping')

          
    
    }

    const testAxios = () =>{

      let test = `http://127.0.0.1:3500/config/var_comm_read`
      axios.post(test).then((res:any)=>{

        console.log('----varCommRead ---data--->>',res.data)
        
      })
      .catch((err)=>{
  
        console.log('连接失败',err)

      })

    }

    const testPost = () => {
      let test = `http://127.0.0.1:3500/config/electron_write`
      axios.post(test,'hello world!').then((res:any)=>{

        console.log('----electron_write ---data--->>',res.data)
        
      })
      .catch((err)=>{
  
        console.log('连接失败',err)

      })
    }

  return (
    <>
    <Button type="primary" 
            onClick={testCommunication}
            style={{'marginLeft':'20px'}}>
      通信测试
    </Button>
    <Button type="primary" 
            onClick={testAxios}
            style={{'marginLeft':'20px'}}>
        访问axios
    </Button>
    <Button type="primary" 
            onClick={testPost}
            style={{'marginLeft':'20px'}}>
        写值axios
    </Button>
    <Table
      rowKey={"uuid"}
    //   columns={TableColumns({ handleSend, handleDelete })}
      rowSelection={{ ...rowSelection, checkStrictly: false }}
      dataSource={data}
      size="small"
    />
    </>
  )
};

export default Send;