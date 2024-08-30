//WebSocket.js
const WebSocket = require('ws')
const {
    sleep,
    generateUniqueId,
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
    Set_Clients_Callback,
} = require('./app')

const wss_Connections = new Map()

function setupWebSocket(server) {
    const wss_Server = new WebSocket.Server({ server })

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
                    /*const Is_From_End = false
                    const { Sucess, Is_Empty } = await Erase_All_Chat_Data(Is_From_End)
                    if (Sucess) {
                        wss.send(JSON.stringify({ type: 'all-erase', sucess: Sucess, message: `sucessfully erase all ChatData.`, empty: Is_Empty }))
                    } else {
                        wss.send(JSON.stringify({ type: 'all-erase', sucess: Sucess, message: `ERROR to erase all ChatData.`, empty: Is_Empty }))
                    }*/
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
                    
                    /*if (Parse_Data.length === 0) {
                        wss.send(JSON.stringify({ type: 'search-chatdata', data: [], data2: search }))
                    } else {
                        wss.send(JSON.stringify({ type: 'search-chatdata', data: Parse_Data, data2: search }))
                    }*/
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
                    
                    /*const { Sucess, Is_Empty, ChatData, Is_From_All_Erase } = await Print_All_Chat_Data(isallerase)
                    if (Sucess) {
                        wss.send(JSON.stringify({ type: 'all-print', sucess: Sucess, message: `Sucessfully send all ChatData.`, chatdata: ChatData, empty: Is_Empty, isallerase: Is_From_All_Erase }))
                    } else {
                        wss.send(JSON.stringify({ type: 'all-print', sucess: Sucess, message: `ERROR to send all ChatData.`, chatdata: ChatData, empty: Is_Empty, isallerase: Is_From_All_Erase }))
                    }*/
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
                    /*if (Is_From_All_Erase) {
                        Print_All_Chat_Data(Is_From_All_Erase)
                    }*/
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
}

module.exports = { setupWebSocket }