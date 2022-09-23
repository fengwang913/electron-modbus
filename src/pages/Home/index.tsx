import { Button, Table } from 'antd';
import React, { useState } from 'react';
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
import {saveAs} from "file-saver";

let columns:any = [];
let outputTemplate:any = []
let SheetNames = ''
let fileName = ''
// rowSelection object indicates the need for row selection

const Search = () => {
    const [dataSource,setDataSource]= useState([]);


    const exportXLS = () =>{
        const allData = [...dataSource]
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(SheetNames);
        
        worksheet.columns = outputTemplate;
        
        // // 添加行
        worksheet.addRows(allData);
         // 给表头添加背景色
        let headerRow = worksheet.getRow(1);
        // 通过 cell 设置背景色，更精准
        headerRow.eachCell((cell:any) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'dde0e7'},
        }
        })
        saveWorkbook(workbook, fileName); 

    }
    const saveWorkbook = (workbook:any, fileName: string) =>{
        workbook.xlsx.writeBuffer().then(((data:any) => {
            const blob = new Blob([data], {type: ''});
            saveAs(blob, fileName);
        }))

    }

    const importXLS = () => {

        let selectName = `importXLS`
        const selectFile:any = document.getElementById(selectName)          
        selectFile.click()
    }

    const importFileInfo = async () => {
        let info = await getXLSInfo()
     
        SheetNames = info.SheetNames[0]
        
        let importData:any = XLSX.utils.sheet_to_json(info.Sheets[info.SheetNames[0]])
       

        let allData:any =[]
        importData?.forEach((item:any,index:number)=>{

          let temp:any = {
            key : index+1
          }

          for(let key in item){

            temp[key] = item[key]
            
          }

          
          allData.push(temp)


        })
        let tempColumn :any= []
        let output:any = []

        
        for(let key in importData[0]){
          let temp:any = {
            title: key,
            dataIndex: key,
          }

          let outTemp = { 
            header: key,
            key: key,
            width: 10 }

          tempColumn.push(temp)
          output.push(outTemp)


          
        }
        columns = tempColumn
        outputTemplate = output

       
        

        setDataSource(allData)
    }

       // 封装一个promise reader.onload
    const  getXLSInfo = async ():Promise<any> =>{
      let selectName = `importXLS`
      let resultFile:any = document.getElementById(selectName)
  
      let info = resultFile.files[0]
      fileName = resultFile.files[0].name

      let reader =  new FileReader()
      reader.readAsBinaryString(info)
      let promise = new Promise<any>(resolve =>{
          reader.onload = function(e:any){
              let data = e.target.result
              let workbook = XLSX.read(data, { type: 'binary' })
              resolve(workbook)
          }
      })
      return promise

    }
  return (
    <>
    <div>
        <div style={{'float':'right',
                    'marginBottom':'10px',
                    }}>
            <Button type="primary" 
                    onClick={importXLS}
                    >
            导入数据
            </Button>
            <Button type="primary" 
                    onClick={exportXLS}
                    style={{'marginLeft':'20px'}}>
            导出数据
            </Button>

        </div>
        <input  type='file' 
                  id={'importXLS'}
                //   ref='importXLSButtom' 
                  onChange={importFileInfo }
                  style={{display:'none'}}/>
       
        <Table
            columns={columns}
            dataSource={dataSource}
            style={{display:`${columns.length > 0 ?'block' : 'none'}`}}
        />
    </div>
    </>
  );
};

export default Search;