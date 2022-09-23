import { FC, useEffect, useState } from 'react';
import { Form, Button, Table ,Select,message,Input} from 'antd';
import type { TableRowSelection } from 'antd/lib/table/interface';
const { Option } = Select;
const { ipcRenderer } = require('electron')
let columns:any = [
                    {
                      title: "portName",
                      dataIndex: "portName",
                      key: 'portName',
                    },
                    {
                      title: "vendorId",
                      dataIndex: "vendorId",
                      key: 'vendorId',
                  },
                  {
                    title: "productId",
                    dataIndex: "productId",
                    key: 'productId',
                  },
                  {
                    title: "portId",
                    dataIndex: "portId",
                    key: 'portId',
                    },
                    {
                      title: "displayName",
                      dataIndex: "displayName",
                      key: 'displayName',
                    },
                    
                    
                  ];
// 要打开的串口信息
let dataPortInfo = {
                        name: '',
                        dataBits: 8,
                        stopBits: 1,
                        parity: 'none',
                        baudRate: 9600
                      }
let reader:any
let writer:any
let port:any
let key:any
type LayoutType = Parameters<typeof Form>[0]['layout'];
const children: React.ReactNode[] = [];



const Send: FC = () => {
  const [data, setData]:any = useState([]);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('inline');
  const [allProductId, setAllProductId] = useState([]);
  const [showClose, setShowClose] = useState(true);
  const [isPortOpened,setIsPortOpened] = useState(false)
 
  // 发送文件到邮

  useEffect(() => {
    testTcpSend();
  }, []);


  const testTcpSend = async () =>{

    try {
      const nowport = await (navigator as any).serial.requestPort();
      const portInfo = nowport.getInfo();
      console.log('------portInfo---',portInfo)
      console.log('------nowport---',nowport)
      try{
        await nowport.open({ baudRate: 9600 })
      }
      catch(e){
        console.log('-----e----',e)
      }
       

      
      
    } catch (ex) {
      if (ex) {
        console.log('------ex---',ex)
        
      } else {
        console.log('------ex 222---',ex)
      }
    }
    
    




  }


  // tcpClient
  const testTcpRead = () =>{
    console.log('-----testTcpRead---')
  }

  // 从串口接受到数据
ipcRenderer.on("GOT_PORT_LIST", (_: Event, portList: any) => {
  console.log('----GOT_PORT_LIST----')
  console.log('----portList---->><<<<<>>>',portList)
  let allId:any = []
  portList?.forEach((item:any)=>{
    if(item.displayName){
      allId.push(item.displayName)
      
      children.push(<Option key={item.displayName} children={item.displayName}></Option>);
     
    }

  })
  setData(portList)
  setAllProductId(allId)

})

const haveIdchange = (value: any) =>{
  // console.log('----value---->><<<<<>>>',value)
}

const onFinish = (values: any) =>{
  // console.log('----value---->><<<<<>>>',values);
  // values.name = '29987'
  if(values.name){
    dataPortInfo = values
    openPort()

  }
  setShowClose(false)
}

const openPort = () =>{
  ipcRenderer.invoke("SELECT_POR", { ...data?.find((e:any) => e.portName === dataPortInfo.name ) }).then(() => {

    (navigator as any).serial
      .requestPort()
      .then((_port: any) => {
        port = _port
        port
          .open({ baudRate: 9600 /* pick your baud rate */ })
          .then(async () => {
            message.success('操作成功')
            // isPortOpened.value = true
            setIsPortOpened(true)
            reader = port.readable.getReader()
            writer = port.writable.getWriter()
            if (port && port.readable) {
              while (isPortOpened) {
                let { value } = await reader.read()
                value = String.fromCharCode(value)
                key.value = value
                if (!isPortOpened) {
                  await Promise.all([reader.releaseLock(), writer.releaseLock()])
                  await reader.close()
                  await port.close()
                }
              }
            }
          })
          .catch((e:any) => {
            setIsPortOpened(false)
            message.success('串口开启失败')

      
          })
      })
      .catch(()=>{
        console.log('-----开启失败-----')
      })
  })
}


const closePort = () =>{
  setIsPortOpened(false)
}

const sendData = () => {
  writer.write(new Uint8Array([0x0]))
}



  return (
    <>
    <Button type="primary" 
            onClick={testTcpSend}
            style={{'marginLeft':'20px',float:'right'}}>
       刷新串口列表
    </Button>
    <Table
      // rowKey={"uuid"}
      columns={columns}
      dataSource={data}
      size="small"
    />

    <Form
      layout={formLayout}
      form={form}
      initialValues={{ layout: formLayout ,
                        "baudRate":dataPortInfo.baudRate,
                        'dataBits':dataPortInfo.dataBits,
                        "stopBits":dataPortInfo.stopBits,
                        'parity':dataPortInfo.parity,
                        "name":allProductId[0]
                      }}
      onFinish={onFinish}
      style = {{marginTop:'40px'}}
    >
      <div style={{display:'flex',flexDirection: 'column' }}>
        <div style={{display:'flex'}}>
          <Form.Item label="串口"  name="name">
              <Input style={{ width: 120 }} ></Input>
          </Form.Item>
          <Form.Item label="波特率"  name="baudRate">
              <Select style={{ width: 120 }}> 
                  <Option values={9600} key = '9600'  children={9600}></Option>
              </Select>
          </Form.Item>
          <Form.Item label="数据位"  name="dataBits">
              <Select style={{ width: 120 }}> 
                  <Option values={8} key = '8' children={8}></Option>
                  <Option values={7} key = '7' children={7}></Option>
                  <Option values={6} key = '6' children={6}></Option>
                  <Option values={5} key = '5' children={5}></Option>
              </Select>
          </Form.Item>
          <Form.Item label="停止位"  name="stopBits">
              <Select style={{ width: 120 }}> 
                  <Option values={1} key = '1' children={1}></Option>
                  <Option values={2} key = '2' children={2}></Option>
              </Select>
          </Form.Item>
          <Form.Item label="奇偶校验"  name="parity">
              <Select  style={{ width: 120 }}> 
                  <Option values="none" key='none' children="none"></Option>
                  <Option values="even"  key='even' children="even"></Option>
                  <Option values="mark" key='mark' children="mark"></Option>
                  <Option values="odd"   key='odd' children="odd"></Option>
                  <Option values="space"  key='space' children="space"></Option>
              </Select>
          </Form.Item>
        </div>
        <div style={{ marginTop:'40px',display:'flex',justifyContent:'center' }}>
          <Form.Item>
            <Button type="primary" 
                    htmlType="submit" 
                    // disabled={allProductId.length === 0}
                    >打开串口</Button>
          </Form.Item>
          <Button type="primary" 
                 
                  onClick={sendData}
                  >发个消息试试</Button>
          <Button type="primary" 
                  disabled={!isPortOpened}
                  onClick={closePort}
                  >关闭串口</Button>
        </div>
      </div>
    </Form>
   
    </>
  )
};

export default Send;