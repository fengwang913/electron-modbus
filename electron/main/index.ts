import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'os'
import { join } from 'path'


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
process.env.DIST = join(__dirname, '../..')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
let selectPort:any = null
async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    // show:false,
    icon: join(process.env.PUBLIC, 'favicon.svg'),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })



  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    console.log('-----url----',url)
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })


  ipcMain.handle("SELECT_POR",(_,port:any)=>{
    selectPort = port
    console.log('----SELECT_POR-port----',port)
  })

  // serial communication
  win.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {
      console.log('---webContents---', webContents)
      console.log('---portList---', portList)

      //Add listeners to handle ports being added or removed before the callback for `select-serial-port`
      //is called.
      win.webContents.session.on('serial-port-added', (event, port) => {
        console.log('serial-port-added FIRED WITH', port)
        //Optionally update portList to add the new port
      })
  
      win.webContents.session.on('serial-port-removed', (event, port) => {
        console.log('serial-port-removed FIRED WITH', port)
        //Optionally update portList to remove the port
      })
  
      event.preventDefault()
      win.webContents.send(
        "GOT_PORT_LIST",
        portList
      )
      if(selectPort !== null){
        callback(selectPort.portId)
      }else{
        if (portList && portList.length > 0) {
          callback(portList[0].portId)
        } else {
         win.webContents.send(
            "GOT_PORT_LIST",
            portList
          )
          callback('') //Could not find any matching devices
        }
      }



    })


  win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
      if (permission === 'serial' && details.securityOrigin === 'file:///') {
        return true
      }
      
      return false
    })

  win.webContents.session.setDevicePermissionHandler((details) => {
      if (details.deviceType === 'serial' && details.origin === 'file://') {
        return true
      }
      
      return false
    })

  if (app.isPackaged) {
      win.loadFile(indexHtml)
    } else {
      win.loadURL(url)
      // win.webContents.openDevTools()
    }
}




app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })
  console.log('----arg---',arg)
  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})


ipcMain.on('asynchronous-message',(event,value)=>{
  
  console.log('----value---',value)
  event.reply('asynchronous-reply', 'pong')
})


