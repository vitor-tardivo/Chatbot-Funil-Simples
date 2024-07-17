// server.js Back_End
const express = require('express')
const cors = require('cors')
const http = require('http')
const WebSocket = require('ws')
const path = require('path')
const axios = require('axios');
const {
    Set_Start_Callback,
    Set_Exit_Callback, 
    Reload_Front, 
    initialize, 
    Input_Command, 
    Set_QrCode_On_Callback, 
    Set_QrCode_Exceeds_Callback, 
    Set_Auth_Autenticated_Callback, 
    Set_Auth_Failure_Callback, 
    Set_Ready_Callback,
    Print_All_Chat_Data,
    Set_Print_Callback,
    Set_List_Callback,
    Search_Chat_Data_By_Name,
    Erase_All_Chat_Data,
    Set_Empty_List_Callback,
    Set_All_Erase_Callback,
    Set_Search_List_Callback,
    Erase_Chat_Data_By_Name,
    Set_Name_Erase_Callback
} = require('./src/app')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

const wsServer = new WebSocket.Server({ server })

global.Qr_String = ''
global.Is_Conected = true

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

wsServer.on('connection', async  function connection(ws) {
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        ws.send(JSON.stringify({ type: 'log', message: args.join(' ') }));
    };
    
    Set_List_Callback(async function() {
        const Parse_Data = await Print_All_Chat_Data()

        if (Parse_Data.length === 0) {
            ws.send(JSON.stringify({ type: 'list', data: [] }));
        }
        
        ws.send(JSON.stringify({ type: 'list', data: Parse_Data }));
    });

    Set_Start_Callback(function() {
        ws.send(JSON.stringify({ type: 'start'}));
    });

    Set_Exit_Callback(function() {
        ws.send(JSON.stringify({ type: 'exit'}));
    });
    
    Set_QrCode_On_Callback(function(isOn) {
        if (isOn) {
            ws.send(JSON.stringify({ type: 'generate_qr_code'}));
        }
    });
    Set_QrCode_Exceeds_Callback(function() {
        ws.send(JSON.stringify({ type: 'qr_exceeds' }));
    });
    
    Set_Auth_Autenticated_Callback(function() {
        ws.send(JSON.stringify({ type: 'auth_autenticated'}));
    });
    Set_Auth_Failure_Callback(function() {
        ws.send(JSON.stringify({ type: 'auth_failure'}));
    });
    Set_Ready_Callback(function() {
        ws.send(JSON.stringify({ type: 'ready'}));
    });
    
    Set_Print_Callback(function() {
        ws.send(JSON.stringify({ type: 'print'}));
    });

    Set_Empty_List_Callback(function() {
        ws.send(JSON.stringify({ type: 'empty-list'}));
    });

    Set_All_Erase_Callback(function() {
        ws.send(JSON.stringify({ type: 'all-erase'}));
    });

    Set_Name_Erase_Callback(function(search) {
        if (!search) {
            ws.send(JSON.stringify({ type: 'error', message: 'status(400) Query parameter is required.' }));
            return
        }
        try {
            ws.send(JSON.stringify({ type: 'name-erase', data: search }));
        } catch (error) {
            console.error(`Error erasing ChatData by name ${search}:`, error);
            ws.send(JSON.stringify({ type: 'error', message: `ERROR erasing ChatData by name ${search}: ${error.message}` }));
        }
    });

    Set_Search_List_Callback(async function(search) {
        if (!search) {
            ws.send(JSON.stringify({ type: 'error', message: 'status(400) Query parameter is required.' }));
            return
        }
        try {
            const Parse_Data = await Search_Chat_Data_By_Name(search)
            
            if (Parse_Data.length === 0) {
                ws.send(JSON.stringify({ type: 'search-list', data: [], data2: search }));
            } else {
                ws.send(JSON.stringify({ type: 'search-list', data: Parse_Data, data2: search }));
            }
        } catch (error) {
            console.error(`Error searching ChatData by name ${search}:`, error);
            ws.send(JSON.stringify({ type: 'error', message: `ERROR searching ChatData by name ${search}: ${error.message}` }));
        }
    });

    console.log('> ✅ Conectado Client ao WebSocket(back).');
    ws.on('close', function() {
        console.log('> ⚠️ Desconectado Client do WebSocket(back).');
        console.log = originalConsoleLog;
    });
});

let Is_From_End = null
app.delete('/erase-name', async (req, res) => {
    const fromTerminal = req.query.fromTerminal
    Is_From_End = false
    if (fromTerminal) {
        const queryFromTerminal = req.query.queryFromTerminal
        if (queryFromTerminal) {
            await Erase_Chat_Data_By_Name(queryFromTerminal, Is_From_End)
            res.status(200).send({ message: `${queryFromTerminal} apagado com sucesso.` });
        } else {
            res.status(400).send({ message: 'Query parameter is required.' });
        }
    } else {
        const query = req.query.query
        if (query) {
            await Erase_Chat_Data_By_Name(query, Is_From_End)
            res.status(200).send({ message: `${query} apagado com sucesso.` });
        } else {
            res.status(400).send({ message: 'Query parameter is required.' });
        }
    }
})
app.delete('/all-erase', async (req, res) => {
    Is_From_End = false
    Erase_All_Chat_Data(Is_From_End, )
})

const CHAT_DATA_FILE = path.join(__dirname, 'Chat_Datas', 'Chat_Data.json');
app.get('/search-list', async (req, res) => {
    try { 
        /*const CHAT_DATA_FILE = path.join(__dirname, 'Chat_Datas', 'Chat_Data.json');
        const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8');
        const Parse_Data = JSON.parse(Data_);*/
        const query = req.query.query
        
        if (!query) {
            return res.status(400).send({ error: 'Query parameter is required.' });
        }

        const Parse_Data = await Search_Chat_Data_By_Name(query)
        
        if (Parse_Data.length === 0 || undefined || null) {
            return res.json([]);
        }
        
        res.json(Parse_Data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).send({ error: `${CHAT_DATA_FILE} does not exist.` });
        } else {
            res.status(500).send({ error: `ERROR reading ${CHAT_DATA_FILE}: ${error.message}` });
        }
    }    
})
app.get('/list', async (req, res) => {
    try { 
        /*const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8');
        const Parse_Data = JSON.parse(Data_);*/

        const Parse_Data = await Print_All_Chat_Data()
        
        if (Parse_Data.length === 0 || undefined || null) {
            return res.json([]);
        }
        
        res.json(Parse_Data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).send({ error: `${CHAT_DATA_FILE} does not exist.` });
        } else {
            res.status(500).send({ error: `ERROR reading ${CHAT_DATA_FILE}: ${error.message}` });
        }
    }    
})

app.get('/reload', (req, res) => {
    Reload_Front()
})

app.post('/command', express.json(), (req, res) => {
    const { command } = req.body;
    let Is_Front_Back = false
    Input_Command(command, Is_Front_Back); 
    res.status(200).send('Comando recebido com sucesso.');
});

app.get('/qr', (req, res) => {
    if (Qr_String === null) {
        res.json({ qrString: 'Client já Conectado ao WhatsApp Web!', Is_Conected });
    } else {
        res.json({ qrString: Qr_String, Is_Conected });
    }
});

app.post('/start-bot', async (req, res) => {
    try {
        await initialize()
        res.json({ success: true })
    } catch (error) {
        console.error('> ⚠️  Failed to initialize Bot:', error)
        res.json({ success: false })
    }
})

server.listen(port, () => {
    axios.get('https://api.ipify.org?format=json')
    .then(response => {
        let data = response.data
        console.log(`>  ℹ️ Server running ON: http://${data.ip}:${port}/ || http://localhost:${port}/`)
    })
    .catch(error => {
        console.log('ERROR get IP: ' + error.message)
    })
})
//multi client wesocket
/*
// server.js BackEnd
const express = require('express')
const http = require('http')
const path = require('path')
const WebSocket = require('ws')
const cors = require('cors')
const axios = require('axios');
const { initialize } = require('./app')
const { Input_Command } = require('./app')
const { Set_QrCode_On_Callback } = require('./app')
const { Set_QrCode_Exceeds_Callback } = require('./app')
const { Set_Auth_Autenticated_Callback } = require('./app')
const { Set_Auth_Failure_Callback } = require('./app')
const { Set_Ready_Callback } = require('./app')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

const wsServer = new WebSocket.Server({ server })

const clients = new Map();

global.Qr_String = ''
global.Is_Conected = true

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

wsServer.on('connection', function connection(ws) {
    let clientState = {
        Qr_String: '',
        Is_Conected: true
    };

    clients.set(ws, clientState);

    const originalConsoleLog = console.log;
    console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        sendToClient(ws, { type: 'log', message: args.join(' ') });
    };
    Set_QrCode_On_Callback(function(isOn) {
        if (isOn) {
            sendToClient(ws, { type: 'generate_qr_code'});
        }
    });
    Set_QrCode_Exceeds_Callback(function() {
        sendToClient(ws, { type: 'qr_exceeds' });
    });
    Set_Auth_Autenticated_Callback(function() {
        clientState.Is_Conected = true;
        sendToClient(ws, { type: 'auth_autenticated'});
    });
    Set_Auth_Failure_Callback(function() {
        clientState.Is_Conected = false;
        sendToClient(ws, { type: 'auth_failure'});
    });
    Set_Ready_Callback(function() {
        clientState.Is_Conected = true;
        sendToClient(ws, { type: 'ready'});
    });

    console.log('> ✅ Conectado Client ao WebSocket(back).');
    ws.on('message', function(message) {
        const { command } = JSON.parse(message);
        let Is_Front_Back = false;
        Input_Command(command, Is_Front_Back);
    });
    ws.on('close', function() {
        clients.delete(ws);

        console.log('> ⚠️ Desconectado Client do WebSocket(back).');
        console.log = originalConsoleLog;
    });
    ws.on('error', function(error) {
        console.error('> ❌  ERROR WebSocket:', error);
        ws.close();
    });
    function sendToClient(ws, data) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    app.post('/command', express.json(), (req, res) => {
        const { command } = req.body;
        let Is_Front_Back = false
        Input_Command(command, Is_Front_Back); 
        res.status(200).send('Comando recebido com sucesso.');
    });
    
    app.get('/qr', (req, res) => {
        if (Qr_String === null) {
            res.json({ qrString: 'Client já Conectado ao WhatsApp Web!', Is_Conected });
        } else {
            res.json({ qrString: Qr_String, Is_Conected });
        }
    });
    
    app.get('/start-bot', async (req, res) => {
        try {
            await initialize()
            res.json({ success: true })
        } catch (error) {
            console.error('> ⚠️  Failed to initialize Bot:', error)
            res.json({ success: false })
        }
    })
}); 

server.listen(port, () => {
    console.log(`>  ℹ️ Server running on http://localhost:${port}`)
})*/

//tarefas bot backend 
//em desenvolvimento...

//a desenvolver...
    //tornar possivel varias instancias com websocket