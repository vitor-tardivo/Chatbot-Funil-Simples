// server.js Back_End
const reflect_metadata = require('reflect-metadata')
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const axios = require('axios')
const path = require('path')
const os = require('os')
const Router = require('./src/routes')
const {
    sleep,
} = require('./src/app')
const { setupWebSocket } = require('./src/WebSocket')

process.on('uncaughtException', (error) => {
    console.error(`> ❌ Uncaught Exception: ${error}`)
})

const app = express()

const port = process.env.PORT || 3000

const server = http.createServer(app)

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

app.use('/', Router)

setupWebSocket(server)

server.listen(port, () => {
    try  {
        //const iIp = Object.values(os.networkInterfaces()).flat().filter(details => details.family === 'IPv4' && !details.internal).map(details => details.address)
        //console.log(`>  ℹ️ Server running ON: http://${iIp}:${port}/ || http://localhost:${port}/`)
        const networkInterfaces = os.networkInterfaces()
        let deviceIp

        for (const interfaceName of Object.keys(networkInterfaces)) {
            const interfaceInfo = networkInterfaces[interfaceName]
            for (const details of interfaceInfo) {
                if (details.family === 'IPv4' && !details.internal) {
                    deviceIp = details.address
                    break
                }
            }
            if (deviceIp) break
        }
        console.log(`> ℹ️  Server running ON: http://${deviceIp}:${port}/ || http://localhost:${port}/`)
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