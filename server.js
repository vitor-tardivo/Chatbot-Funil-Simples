// server.js Back_End
const reflect_metadata = require('reflect-metadata')
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const http = require('http')
//const WebSocket = require('ws')
const axios = require('axios')
const path = require('path')
const os = require('os')
const routes = require('./src/routes')
const {
    sleep,
    /*generateUniqueId,
    Set_Statuses_WS_Callback,
    Set_Log_Callback,
    Set_Exit_Callback, 
    Set_Auth_Failure_Callback, 
    Set_QrCode_On_Callback, 
    Set_QrCode_Exceeds_Callback, 
    Set_List_Callback,
    Set_List_Auxiliar_Callback,
    Set_Search_List_Callback,
    Set_All_Erase_Callback,
    Set_Query_Erase_Callback,
    Set_Auth_Autenticated_Callback, 
    Set_Ready_Callback,
    Set_Start_Callback,
    Set_Erase_Client_Callback,
    Set_Destroy_Client_Callback,
    Set_Reinitialize_Client_Callback,
    Set_Select_Client_Callback,
    Set_New_Client_Callback,
    Set_Clients_Callback,*/
} = require('./src/app')
const { setupWebSocket } = require('./src/WebSocket')

process.on('uncaughtException', (error) => {
    console.error(`> ❌ Uncaught Exception: ${error}`)
    if (global.Log_Callback) global.Log_Callback(`> ❌ Uncaught Exception: ${error}`)
})

const app = express()

const port = process.env.PORT || 3000

const server = http.createServer(app)
//const wss_Server = new WebSocket.Server({ server })
//const wss_Connections = new Map()

app.use( 
    cors({
        origin: "*",
        credentials: true,
        allowedHeaders:
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }) 
)

app.use(express.json())

app.use(express.static(path.join(__dirname, 'frontEnd')))

app.use('/', routes)

setupWebSocket(server)

/*
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontEnd', 'index.html'))
        res.status(200).send({ sucess: true, message: `sucessfully get /.` })
    } catch (error) {
        console.error(`> ❌ ERROR /: ${error}`)
        res.status(500).send({ sucess: false, message: 'ERROR Internal server' })
    }
})
*/

/*
wss_Server.on('connection', async  function connection(wss) {
    try {
        const wss_Connection_Id = generateUniqueId()
        wss_Connections.set(wss_Connection_Id, {
            wss,
            reason: null
        })
        console.log(`> ✅ Connected User (${wss_Connection_Id}) to WebSocket.`)
        if (global.Statuses_WS_Callback) global.Statuses_WS_Callback(true)
        //if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i>Conectado Client ao WebSocket.`)
        wss.on('close', function() {
            console.error(`> ⚠️  Desconected User (${wss_Connection_Id}) of WebSocket.`)
            //if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Desconectado Client do WebSocket.`)    
            if (global.Statuses_WS_Callback) global.Statuses_WS_Callback(false)
        
            setTimeout(function() {
                wss_Connections.delete(wss_Connection_Id)
            }, 1 * 1000)
        })

        Set_Log_Callback(function(log) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id)
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/back/logs', message: log }))
                } catch (error) {
                    console.error(`> ❌ ERROR sending log to WebSocket (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Log_Callback (${wss_Connection_Id}) not found.`)
            }
            //wss_Connection.wss.send(JSON.stringify({ type: 'log', message: log}))
        })
        Set_Statuses_WS_Callback(function(status) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id)
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/websocket/statues-connection', data: status }))
                } catch (error) {
                    console.error(`> ❌ ERROR sending status to WebSocket (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Statuses_WS_Callback (${wss_Connection_Id}) not found.`)
            } 
            //wss_Connection.wss.send(JSON.stringify({ type: 'statues-ws', data: status}))
        })
        
        Set_Query_Erase_Callback(function(query) {
            try {
                const wss_Connection = wss_Connections.get(wss_Connection_Id)
                if (wss_Connection) {
                    try {
                        wss_Connection.wss.send(JSON.stringify({ type: 'WS=/chatdata/query-erase', Search: query }))
                    } catch (error) {
                        console.error(`> ❌ ERROR sending erase-query to WebSocket (${wss_Connection_Id}): ${error}`)
                    }
                } else {
                    console.error(`> ⚠️  WebSocket connection Set_Query_Erase_Callback (${wss_Connection_Id}) not found.`)
                }
                //wss_Connection.wss.send(JSON.stringify({ type: 'erase-query', Search: query }))
            } catch (error) {
                console.error(`ERROR Set erase-query: ${error}`)
            }
        })
        Set_All_Erase_Callback(async function() {
            try { 
                //const Is_From_End = false
                //const { Sucess, Is_Empty } = await Erase_All_Chat_Data(Is_From_End)
                //if (Sucess) {
                    //wss.send(JSON.stringify({ type: 'all-erase', sucess: Sucess, message: `sucessfully erase all ChatData.`, empty: Is_Empty }))
                //} else {
                    //wss.send(JSON.stringify({ type: 'all-erase', sucess: Sucess, message: `ERROR to erase all ChatData.`, empty: Is_Empty }))
                //}
                const wss_Connection = wss_Connections.get(wss_Connection_Id)
                if (wss_Connection) {
                    try {
                        wss_Connection.wss.send(JSON.stringify({ type: 'WS=/chatdata/all-erase'}))
                    } catch (error) {
                        console.error(`> ❌ ERROR sending all erase to WebSocket (${wss_Connection_Id}): ${error}`)
                    }
                } else {
                    console.error(`> ⚠️  WebSocket connection Set_All_Erase_Callback (${wss_Connection_Id}) not found.`)
                }
            } catch (error) {
                console.error(`> ❌ ERROR Set all-erase: ${error}`)
                //wss.send(JSON.stringify({ type: 'all-erase', Sucess: false, message: `ERROR Internal server: ${error}`, empty: null }))
            }
        })
        Set_Search_List_Callback(async function(Search) {
            try {
                //const Parse_Data = await Search_Chat_Data_By_Search(search)
                
                //if (Parse_Data.length === 0) {
                    //wss.send(JSON.stringify({ type: 'search-chatdata', data: [], data2: search }))
                //} else {
                    //wss.send(JSON.stringify({ type: 'search-chatdata', data: Parse_Data, data2: search }))
                //}
                const wss_Connection = wss_Connections.get(wss_Connection_Id)
                if (wss_Connection) {
                    try {
                        wss_Connection.wss.send(JSON.stringify({ type: 'WS=/chatdata/search-print', search: Search }))
                    } catch (error) {
                        console.error(`> ❌ ERROR sending search-search to WebSocket (${wss_Connection_Id}): ${error}`)
                    }
                } else {
                    console.error(`> ⚠️  WebSocket connection Set_Search_List_Callback (${wss_Connection_Id}) not found.`)
                }
                //wss_Connection.wss.send(JSON.stringify({ type: 'search-search', search: Search }))
            } catch (error) {
                console.error(`ERROR Set search-search: ${error}`)
                //wss.send(JSON.stringify({ type: 'error', message: `status(500) ERROR searching ChatData by the search ${search}: ${error}` }))
            }
        })
        Set_List_Callback(async function() {
            try {
                
                //const { Sucess, Is_Empty, ChatData, Is_From_All_Erase } = await Print_All_Chat_Data(isallerase)
                //if (Sucess) {
                    //wss.send(JSON.stringify({ type: 'all-print', sucess: Sucess, message: `Sucessfully send all ChatData.`, chatdata: ChatData, empty: Is_Empty, isallerase: Is_From_All_Erase }))
                //} else {
                    //wss.send(JSON.stringify({ type: 'all-print', sucess: Sucess, message: `ERROR to send all ChatData.`, chatdata: ChatData, empty: Is_Empty, isallerase: Is_From_All_Erase }))
                //}
                //let Is_From_All_Erase = null
                //Is_From_All_Erase = isallerase
                const wss_Connection = wss_Connections.get(wss_Connection_Id)
                if (wss_Connection) {
                    try {
                        wss_Connection.wss.send(JSON.stringify({ type: 'WS=/chatdata/all-print'}))//, isallerase: Is_From_All_Erase}))
                    } catch (error) {
                        console.error(`> ❌ ERROR sending List to WebSocket (${wss_Connection_Id}): ${error}`)
                    }
                } else {
                    console.error(`> ⚠️  WebSocket connection Set_List_Callback (${wss_Connection_Id}) not found.`)
                }
            } catch (error) {
                console.error(`> ❌ ERROR Set all-print: ${error}`)
                //wss.send(JSON.stringify({ type: 'all-print', sucess: false, message: `ERROR Internal server: ${error}`, chatdata: [], empty: null, isallerase: null }))
            }
        })
        Set_List_Auxiliar_Callback(async function(Is_From_All_Erase, Clientt_) {
            try {
                //if (Is_From_All_Erase) {
                    //Print_All_Chat_Data(Is_From_All_Erase)
                //}
                const wss_Connection = wss_Connections.get(wss_Connection_Id) 
                if (wss_Connection) {
                    try {
                        wss_Connection.wss.send(JSON.stringify({ type: 'WS=/chatdata/all-print-auxiliar', isallerase: Is_From_All_Erase, Client_: Clientt_ } ))
                    } catch (error) {
                        console.error(`> ❌ ERROR sending all-print-auxiliar to WebSocket (${wss_Connection_Id}): ${error}`)
                    }
                } else {
                    console.error(`> ⚠️  WebSocket connection Set_List_Auxiliar_Callback (${wss_Connection_Id}) not found.`)
                }
                //wss_Connection.wss.send(JSON.stringify({ type: 'all-print-auxiliar', isallerase: Is_From_All_Erase}))
            } catch (error) {
                console.error(`> ❌ ERROR Set all-print: ${error}`)
            }
        })

        Set_Exit_Callback(function() {
            const wss_Connection = wss_Connections.get(wss_Connection_Id)
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/back/exit' }))
                } catch (error) {
                    console.error(`> ❌ ERROR sending exit to WebSocket (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Exit_Callback (${wss_Connection_Id}) not found.`)
            } 
            //wss_Connection.wss.send(JSON.stringify({ type: 'exit'}))
        })
        Set_QrCode_Exceeds_Callback(function(QR_Counter_Exceeds) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id)
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/qr-code-exceeds', data: QR_Counter_Exceeds }))
                } catch (error) {
                    console.error(`> ❌ ERROR sending qr_exceeds to WebSocket (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_QrCode_Exceeds_Callback (${wss_Connection_Id}) not found.`)
            }
            //wss_Connection.wss.send(JSON.stringify({ type: 'qr_exceeds', data: QR_Counter_Exceeds }))
        })
        Set_Auth_Autenticated_Callback(function(Clientt_) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id)
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/auth-autenticated', client: Clientt_ }))
                } catch (error) {
                    console.error(`> ❌ ERROR sending auth_autenticated to WebSocket ${Clientt_} (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Auth_Autenticated_Callback (${wss_Connection_Id}) not found.`)
            }
            //wss_Connection.wss.send(JSON.stringify({ type: 'auth_autenticated'}))
        })
        Set_Ready_Callback(function(Clientt_, Is_Reinitialize) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id)
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/ready', client: Clientt_, isreinitialize: Is_Reinitialize }))
                } catch (error) {
                    console.error(`> ❌ ERROR Set_Ready_Callback ${Clientt_} (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Ready_Callback (${wss_Connection_Id}) not found.`)
            }
            //wss_Connection.wss.send(JSON.stringify({ type: 'ready'}))
        })
        Set_Auth_Failure_Callback(function() {
            const wss_Connection = wss_Connections.get(wss_Connection_Id)
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/auth-failure' }))
                } catch (error) {
                    console.error(`> ❌ ERROR sending auth_failure to WebSocket (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Auth_Failure_Callback (${wss_Connection_Id}) not found.`)
            }
            //wss_Connection.wss.send(JSON.stringify({ type: 'auth_failure'}))
        })

        Set_Erase_Client_Callback(function(Clientt_) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id) 
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/erase', client: Clientt_ }))
                } catch (error) {
                    console.error(`> ❌ ERROR erasing Client_ ${Clientt_} (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Erase_Client_Callback (${wss_Connection_Id}) not found.`)
            }
        })
        Set_Destroy_Client_Callback(function(Clientt_) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id) 
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/destroy', client: Clientt_ }))
                } catch (error) {
                    console.error(`> ❌ ERROR destroing Client_ ${Clientt_} (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Erase_Client_Callback (${wss_Connection_Id}) not found.`)
            }
        })
        Set_Reinitialize_Client_Callback(function(Clientt_) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id) 
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/reinitialize', client: Clientt_ }))
                } catch (error) {
                    console.error(`> ❌ ERROR reinitializing Client_ ${Clientt_} (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Erase_Client_Callback (${wss_Connection_Id}) not found.`)
            }
        })
        Set_Select_Client_Callback(function(Clientt_) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id) 
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/select', client: Clientt_ }))
                } catch (error) {
                    console.error(`> ❌ ERROR selecting Client_ ${Clientt_} on FrontEnd (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Select_Client_Callback (${wss_Connection_Id}) not found.`)
            }
        })

        Set_Clients_Callback(function(Clientt_) {
            const wss_Connection = wss_Connections.get(wss_Connection_Id) 
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/clients/insert', client: Clientt_ }))
                } catch (error) {
                    console.error(`> ❌ ERROR sending the ${Clientt_} to WebSocket (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Clients_Callback (${wss_Connection_Id}) not found.`)
            }
        })

        Set_QrCode_On_Callback(function(isOn, QR_Counter, Clientt_) {
            if (isOn) {
                const wss_Connection = wss_Connections.get(wss_Connection_Id)
                if (wss_Connection) {
                    try {
                        wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/qr-code', data: QR_Counter, data2: Clientt_ }))
                    } catch (error) {
                        console.error(`> ❌ ERROR sending generate_qr_code to WebSocket (${wss_Connection_Id}): ${error}`)
                    }
                } else {
                    console.error(`> ⚠️  WebSocket connection Set_QrCode_On_Callback (${wss_Connection_Id}) not found.`)
                }
                //wss_Connection.wss.send(JSON.stringify({ type: 'generate_qr_code', data: QR_Counter}))
            }
        })
        Set_New_Client_Callback(function() {
            const wss_Connection = wss_Connections.get(wss_Connection_Id) 
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/client/new' }))
                } catch (error) {
                    console.error(`> ❌ ERROR creating new Client_ (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_New_Client_Callback (${wss_Connection_Id}) not found.`)
            }
        })
        Set_Start_Callback(function() {
            const wss_Connection = wss_Connections.get(wss_Connection_Id) 
            if (wss_Connection) {
                try {
                    wss_Connection.wss.send(JSON.stringify({ type: 'WS=/clients/start' }))
                } catch (error) {
                    console.error(`> ❌ ERROR sending start to WebSocket (${wss_Connection_Id}): ${error}`)
                }
            } else {
                console.error(`> ⚠️  WebSocket connection Set_Start_Callback (${wss_Connection_Id}) not found.`)
            }
        })
    } catch (error) {
        console.error(`> ❌ ERROR WebSocket connection: ${error}`)
    }
})
*/
/*
app.get('/api/data', async (req, res) => {
    try {
        res.status(200).send({ sucess: true, message: `sucessfully sent the app data.`, name: global.Bot_Name || 'BOT', version: global.Bot_Version_ || '?.?.?' })
    } catch (error) {
        console.error(`> ❌ ERROR /api/data: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, data: null, data2: null, data3: null })
    }
})

app.get('/back/what-stage', async (req, res) => {
    try {
        res.status(200).send({ sucess: true, message: `sucessfully get stage.`, data: global.Stage_, data2: global.QR_Counter, data3: global.Client_ })
    } catch (error) {
        console.error(`> ❌ ERROR /back/what-stage: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, data: null, data2: null, data3: null })
    }
})

app.put('/back/reset', async (req, res) => {
    try {
        global.Is_Reset = false
        await Reset_()

        res.status(200).send({ sucess: true, message: `sucessfully code reset.`})
    } catch (error) {
        console.error(`> ❌ ERROR /back/reset: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, data: null, data2: null, data3: null })
    }
})

app.delete('/chatdata/query-erase', async (req, res) => {
    try {
        const query = req.query.queryList
        const Is_From_End = false
        const { Sucess, Is_Empty, Is_Empty_Input } = await Erase_Chat_Data_By_Query(query, Is_From_End)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `sucessfully erased ${query}.`, empty: Is_Empty, empty_input: Is_Empty_Input, chatdatajson: global.File_Data_Chat_Data })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to erase ${query}.`, empty: Is_Empty, empty_input: Is_Empty_Input, chatdatajson: global.File_Data_Chat_Data })
        }
    } catch (error) {
        console.error(`> ❌ ERROR chatdata/query-erase: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, chatdatajson: global.File_Data_Chat_Data })
    }
})
app.delete('/chatdata/all-erase', async (req, res) => {
    try {
        const Is_From_End = false
        const { Sucess, Is_Empty } = await Erase_All_Chat_Data(Is_From_End)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: 'Sucessfully erased all ChatData.', empty: Is_Empty, chatdatajson: global.File_Data_Chat_Data })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to erase all ChatData.`, empty: Is_Empty, chatdatajson: global.File_Data_Chat_Data })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /chatdata/all-erase: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, chatdatajson: global.File_Data_Chat_Data })
    }
})
app.get('/chatdata/search-print', async (req, res) => {
    try {
        const search = req.query.Search
        const { Sucess, Is_Empty, ChatData, Is_Empty_Input } = await Search_Chat_Data_By_Search(search)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully to sent the ChatData ${search}.`, empty: Is_Empty, chatdata: ChatData, empty_input: Is_Empty_Input, chatdatajson: global.File_Data_Chat_Data })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to sent the ChatData ${search}.`, empty: Is_Empty, chatdata: ChatData, empty_input: Is_Empty_Input, chatdatajson: global.File_Data_Chat_Data })
        }         
    } catch (error) {
        console.error(`> ❌ ERROR /chatdata/search-print: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, chatdata: [], empty_input: null, chatdatajson: global.File_Data_Chat_Data })
    }    
})
app.get('/chatdata/all-print', async (req, res) => {
    try {
        const isallerase = req.query.isallerase
        const { Sucess, Is_Empty, ChatData, Is_From_All_Erase } = await Print_All_Chat_Data(isallerase)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully send all ChatData.`, empty: Is_Empty, chatdata: ChatData, isallerase: Is_From_All_Erase, chatdatajson: global.File_Data_Chat_Data })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to send all ChatData.`, empty: Is_Empty, chatdata: ChatData, isallerase: Is_From_All_Erase, chatdatajson: global.File_Data_Chat_Data })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /chatdata/all-print: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, chatdata: [], isallerase: null, chatdatajson: global.File_Data_Chat_Data })
    }
})

app.get('/front/reload', (req, res) => {
    try {
        Reload_Front()
        res.status(200).send({ sucess: true, message: `Sucessfully get reload FrontEnd and send to BackEnd.`})
    } catch (error) {
        console.error(`> ❌ ERROR /front/reload: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

app.post('/features/command', express.json(), (req, res) => {
    try {
        const { command } = req.body
        let Is_Front_Back = false
        Input_Command(command, Is_Front_Back) 
        res.status(200).send({ sucess: true, message: `Sucessfully send command.`})
    } catch (error) {
        console.error(`> ❌ ERROR /features/command: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})


app.delete('/client/erase', async (req, res) => {
    try {
        const Client_ = req.query.Clientt_
        let Is_From_End = false
        const { Sucess, Is_Empty, Is_Empty_Input, Not_Selected } = await Erase_Client_(Is_From_End, Client_)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully erased ${Client_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to erase ${Client_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /client/erase: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, selected: null })
    }
})
app.put('/client/destroy', async (req, res) => {
    try {
        const { Clientt_ } = req.body
        let Is_From_End = false
        const { Sucess, Is_Empty, Is_Empty_Input, Not_Selected } = await Destroy_Client_(Is_From_End, Clientt_)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully detroyed ${Clientt_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to destroy ${Clientt_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /client/destroy: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, selected: null })
    }
})
app.put('/client/reinitialize', async (req, res) => {
    try {
        const { Clientt_ } = req.body
        const { Sucess, Is_Empty, Is_Empty_Input, Not_Selected } = await Reinitialize_Client_(Clientt_)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully reinitialized ${Clientt_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to reinitialize ${Clientt_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /client/destroy: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, selected: null })
    }
})
app.post('/client/select', async (req, res) => {
    try {
        const { Client_ } = req.body
        
        await Select_Client_(Client_)
        
        res.status(200).send({ sucess: true, message: `Client_ ${Client_} selected.`})
    } catch (error) {
        console.error(`> ❌ ERROR /client/select: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`})
    }
})

app.get('/client/qr-code', (req, res) => {
    try {
        if (Qr_String === null) {
            res.status(200).send({ sucess: true, message: `Sucessfully send command.`, qrString: 'Client já Conectado ao WhatsApp Web!', Is_Conected })
        } else {
            res.status(200).send({ sucess: true, message: `Sucessfully send command.`, qrString: Qr_String, Is_Conected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /client/qr: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})
app.post('/client/new', async (req, res) => {
    try {
        global.Is_From_New = true
        await New_Client_()

        res.status(200).send({ sucess: true, message: `New Client ${Clientt_} initialized.` })
    } catch (error) {
        console.error(`> ❌ ERROR /client/new: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

app.get('/clients/dir', async (req, res) => {//REST representacao de recurso
    try {
        const Directories_ = await List_Directories('Local_Auth')
        
        res.status(200).send({ sucess: true, message: `All Clients_ dir sent.`, dirs: Directories_ })
    } catch (error) {
        console.error(`> ❌ ERROR /clients/dir: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, dirs: [] })
    }
})
app.get('/clients/active', async (req, res) => {//REST representacao de recurso
    try {
        const Actives_ = await List_Active_Clients_()
        
        res.status(200).send({ sucess: true, message: `All Actives Clients_ sent.`, actives: Actives_ })
    } catch (error) {
        console.error(`> ❌ ERROR /clients/active: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, actives: [] })
    }
})

app.get('/clients/start', async (req, res) => {
    try {
        const { Sucess } = await initialize()
        
        res.status(200).send({ sucess: Sucess, message: `Sucessfully started ${global.Bot_Name || 'BOT'}.` })
    } catch (error) {
        console.error(`> ❌ ERROR /clients/start: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})
*/

server.listen(port, () => {
    try  {
        const iIp = Object.values(os.networkInterfaces()).flat().filter(details => details.family === 'IPv4' && !details.internal).map(details => details.address)
        console.log(`>  ℹ️ Server running ON: http://${iIp}:${port}/ || http://localhost:${port}/`)
    } catch(error) {
        console.error(`> ❌ ERROR Listen server: ${error}`)
    }
})

module.exports = {
    app,
}

//tarefas bot backend 
//em desenvolvimento...
    

//a desenvolver...
    //da pra melhora os callbeck pra um so e dentro dele seleionar qual vai madar o type e os caralho
    //funcoes multi instancias... coloca um cadastro e no cadastro pra cada cadastro se usa todas as funcoes pra ele so, a assim tudo fica multi instancia facil