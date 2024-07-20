// server.js Back_End
const express = require('express')
const cors = require('cors')
const http = require('http')
const WebSocket = require('ws')
const path = require('path')
const axios = require('axios')
const {
    Set_Log_Callback,
    Set_Exit_Callback, 
    Set_Auth_Failure_Callback, 
    Set_QrCode_On_Callback, 
    Set_QrCode_Exceeds_Callback, 
    Set_Empty_List_Callback,
    Set_List_Callback,
    Print_All_Chat_Data,
    Set_Print_Callback,
    Set_Search_List_Callback,
    Search_Chat_Data_By_Name,
    Set_All_Erase_Callback,
    Set_Name_Erase_Callback,
    Set_Auth_Autenticated_Callback, 
    Set_Ready_Callback,
    Set_Start_Callback,
    Erase_Chat_Data_By_Name,
    Erase_All_Chat_Data,
    Reload_Front, 
    Input_Command, 
    initialize, 
} = require('./src/app')

process.on('uncaughtException', (error) => {
    //if (Exit_Callback) Exit_Callback()
    console.error(`> ❌ Uncaught Exception: ${error}`)
    if (global.Log_Callback) global.Log_Callback(`> ❌ Uncaught Exception: ${error}`)
    //process.exit(1)
})

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

const wssServer = new WebSocket.Server({ server })

global.QR_Counter = 0
global.Qr_String = ''
global.Is_Conected = true
global.Stage_ = 0

app.use( 
    cors({
        origin: "*",
        credentials: true,
        allowedHeaders:
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }) 
)

app.use(express.static(path.join(__dirname, 'frontEnd')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontEnd', 'index.html'))
})

let Statuses_WS_Callback = null
function Set_Statuses_WS_Callback(callback) {
    Statuses_WS_Callback = callback
}
//const connections = new Set();
wssServer.on('connection', async  function connection(wss) {
    if (connection.size > 0) {
        wss.close()
        return
    }
    //connection.add(wss);
    /*const originalConsoleLog = console.log
    console.log = function(...args) {
        originalConsoleLog.apply(console, args)
        wss.send(JSON.stringify({ type: 'log', message: args.join(' ') }))
    }*/
    Set_Log_Callback(function(log) {
        wss.send(JSON.stringify({ type: 'log', message: log}))
    })

    Set_Statuses_WS_Callback(function(status) {
        wss.send(JSON.stringify({ type: 'statues-ws', data: status}))
    })

    console.log(`> ✅ Conectado Client ao WebSocket(back).`)
    if (Statuses_WS_Callback) Statuses_WS_Callback(true)
        //if (global.Log_Callback) global.Log_Callback(`> ✅ Conectado Client ao WebSocket(back).`)
    wss.on('close', function() {
        console.error(`> ⚠️  Desconectado Client do WebSocket(back).`)
        if (Statuses_WS_Callback) Statuses_WS_Callback(false)
        //if (global.Log_Callback) global.Log_Callback(`> ⚠️ Desconectado Client do WebSocket(back).`)
        //console.log = originalConsoleLog
    })
    
    Set_Exit_Callback(function() {
        wss.send(JSON.stringify({ type: 'exit'}))
    })
    Set_Auth_Failure_Callback(function() {
        wss.send(JSON.stringify({ type: 'auth_failure'}))
    })
    
    Set_QrCode_On_Callback(function(isOn, QR_Counter) {
        if (isOn) {
            wss.send(JSON.stringify({ type: 'generate_qr_code', data: QR_Counter}))
        }
    })
    Set_QrCode_Exceeds_Callback(function(QR_Counter_Exceeds) {
        wss.send(JSON.stringify({ type: 'qr_exceeds', data: QR_Counter_Exceeds }))
    })
    
    Set_Empty_List_Callback(function() {
        wss.send(JSON.stringify({ type: 'empty-list'}))
    })
    Set_List_Callback(async function() {
        const Parse_Data = await Print_All_Chat_Data()
        
        if (Parse_Data.length === 0) {
            wss.send(JSON.stringify({ type: 'list', data: [] }))
        }
        
        wss.send(JSON.stringify({ type: 'list', data: Parse_Data }))
    })
    Set_Print_Callback(function() {
        wss.send(JSON.stringify({ type: 'print'}))
    })
    Set_Search_List_Callback(async function(search) {
        if (!search) {
            wss.send(JSON.stringify({ type: 'error', message: 'status(400) Query parameter is required.' }))
            return
        }
        try {
            const Parse_Data = await Search_Chat_Data_By_Name(search)
            
            if (Parse_Data.length === 0) {
                wss.send(JSON.stringify({ type: 'search-list', data: [], data2: search }))
            } else {
                wss.send(JSON.stringify({ type: 'search-list', data: Parse_Data, data2: search }))
            }
        } catch (error) {
            console.error(`Error searching ChatData by name ${search}: ${error}`)
            wss.send(JSON.stringify({ type: 'error', message: `ERROR searching ChatData by name ${search}: ${error}` }))
        }
    })
    Set_All_Erase_Callback(function() {
        wss.send(JSON.stringify({ type: 'all-erase'}))
    })
    Set_Name_Erase_Callback(function(search) {
        if (!search) {
            wss.send(JSON.stringify({ type: 'error', message: 'status(400) Query parameter is required.' }))
            return
        }
        try {
            wss.send(JSON.stringify({ type: 'name-erase', data: search }))
        } catch (error) {
            console.error(`Error erasing ChatData by name ${search}: ${error}`)
            wss.send(JSON.stringify({ type: 'error', message: `ERROR erasing ChatData by name ${search}: ${error}` }))
        }
    })

    Set_Auth_Autenticated_Callback(function() {
        wss.send(JSON.stringify({ type: 'auth_autenticated'}))
    })
    Set_Ready_Callback(function() {
        wss.send(JSON.stringify({ type: 'ready'}))
    })
    Set_Start_Callback(function() {
        wss.send(JSON.stringify({ type: 'start'}))
    })
})

app.get('/what-stage', async (req, res) => {
    res.json({ data: global.Stage_, data2: global.QR_Counter  })
})

let Is_From_End = null
app.delete('/erase-name', async (req, res) => {
    const fromTerminal = req.query.fromTerminal
    Is_From_End = false
    if (fromTerminal) {
        const query = req.query.query
        if (query) {
            await Erase_Chat_Data_By_Name(query, Is_From_End)
            res.status(200).send({ message: `${query} apagado com sucesso.` })
        } else {
            res.status(400).send({ message: 'Query parameter is required.' })
        }
    } else {
        const query = req.query.query
        if (query) {
            await Erase_Chat_Data_By_Name(query, Is_From_End)
            res.status(200).send({ message: `${query} apagado com sucesso.` })
        } else {
            res.status(400).send({ message: 'Query parameter is required.' })
        }
    }
})
app.delete('/all-erase', async (req, res) => {
    Is_From_End = false
    Erase_All_Chat_Data(Is_From_End, )
})
const CHAT_DATA_FILE = path.join(__dirname, 'Chat_Datas', 'Chat_Data.json')
app.get('/search-list', async (req, res) => {
    try { 
        /*const CHAT_DATA_FILE = path.join(__dirname, 'Chat_Datas', 'Chat_Data.json')
        const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
        const Parse_Data = JSON.parse(Data_)*/
        const query = req.query.query
        
        if (!query) {
            return res.status(400).send({ error: 'Query parameter is required.' })
        }

        const Parse_Data = await Search_Chat_Data_By_Name(query)
        
        if (Parse_Data.length === 0 || undefined || null) {
            return res.json([])
        }
        
        res.json(Parse_Data)
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).send({ error: `${CHAT_DATA_FILE} does not exist.` })
        } else {
            res.status(500).send({ error: `ERROR reading ${CHAT_DATA_FILE}: ${error.message}` })
        }
    }    
})
app.get('/list', async (req, res) => {
    try { 
        /*const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
        const Parse_Data = JSON.parse(Data_)*/

        const Parse_Data = await Print_All_Chat_Data()
        
        if (Parse_Data.length === 0 || undefined || null) {
            return res.json([])
        }
        
        res.json(Parse_Data)
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).send({ error: `${CHAT_DATA_FILE} does not exist.` })
        } else {
            res.status(500).send({ error: `ERROR reading ${CHAT_DATA_FILE}: ${error.message}` })
        }
    }    
})

app.get('/reload', (req, res) => {
    Reload_Front()
})

app.post('/command', express.json(), (req, res) => {
    const { command } = req.body
    let Is_Front_Back = false
    Input_Command(command, Is_Front_Back) 
    res.status(200).send('Comando recebido com sucesso.')
})

app.get('/qr', (req, res) => {
    if (Qr_String === null) {
        res.json({ qrString: 'Client já Conectado ao WhatsApp Web!', Is_Conected })
    } else {
        res.json({ qrString: Qr_String, Is_Conected })
    }
})

app.post('/start-bot', async (req, res) => {
    try {
        await initialize()
        res.json({ success: true })
    } catch (error) {
        console.error(`> ⚠️  Failed to initialize Bot: ${error}`)
        res.json({ success: false })
    }
})

server.listen(port, () => {
    axios.get('https://api.ipify.org?format=json')
    .then(response => {
        let data = response.data
        console.log(`>  ℹ️ (debug)Server running ON: http://${data.ip}:${port}/ || http://localhost:${port}/`)
    })
    .catch(error => {
        console.error(`ERROR get IP: ${error}`)
    })
})