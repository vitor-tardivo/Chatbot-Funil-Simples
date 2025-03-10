//scriptBot.js frontEnd

let userAgent = null

let wss = null
let setLogError = true

let isDisconected = false

let isFromTerminal = false

let tableReady = false
let isTableHidden = null

let isFunilHidden = null

let isConsoleHidden = null

let isExceeds = true 

let isQrOff = true

let isAlreadyDir = false

let isFromNew = false

let Client_ = null

let Client_NotReady = true 

let ChatDataNotReady = true

let isStartedNew = true

let isHideAP = true

let isStarted = false

let Funil_ = null

let Template_ = null

let nameApp = null
let versionApp = null

async function getDeviceType() {//IDENTIFY IF THE USER IS FROM A PHONE
    try {    
        const userAgent = navigator.userAgent.toLowerCase()
        const devicePatterns = {
            "android": "Android Device",
            "iphone": "iPhone",
            "ipad": "iPad",
            "windows phone": "Windows Phone",
            "windows ce": "Windows Phone",
            "webos": "webOS Device",
            "mobile safari": "Mobile Safari",
            "blackberry": "BlackBerry",
            "tablet": "Tablet Device",
            "mobile": "Other Mobile Device"
        }
        for (const pattern in devicePatterns) {
            if (userAgent.includes(pattern)) {
                return devicePatterns[pattern];
            }
        }
        return "Desktop"
    } catch(error) {
        console.error(`> ⚠️ ERROR getDeviceType: ${error}`)
        displayOnConsole(`> ⚠️ <i><i><strong>ERROR</strong></i></i> getDeviceType: ${error.message}`, setLogError)
    }
}

window.onerror = function(event) {
    console.error(`> ❌ Uncaught Exception: ${event}`)
    displayOnConsole(`> ❌ Uncaught Exception: ${event}`, setLogError)
}
window.onload = function(event) {
    try {
        axios.get('/front/reload')
    } catch(error) {
        console.error(`> ⚠️ ERROR onload: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> onload: ${error.message}`, setLogError)
    }
}
window.onbeforeunload = function(event) {
    try {    
        //event.preventDefault()
    } catch(error) {
        console.error(`> ⚠️ ERROR onbeforeunload: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> onbeforeunload: ${error.message}`, setLogError)
    }
}
document.addEventListener('DOMContentLoaded', async function () {// LOAD MEDIA QUERY PHONE AND ELSE
    try {
        const deviceType = await getDeviceType()
        if (deviceType !== "Desktop") {
            console.log(`User is from a ${deviceType} (${navigator.userAgent}).`)
            
            var link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = '../styles/Bot/mediaQueryBot.css'
            document.head.appendChild(link)
        } else {
            console.log(`User is from a Desktop (${navigator.userAgent}).`)
        }

        const response = await axios.get('/api/data')
        const Bot_Name = response.data.name
        const dataName = document.querySelector('#appName')
        nameApp = `${Bot_Name}`
        document.title = `${nameApp.toUpperCase() || 'BOT'}`
        dataName.textContent = nameApp.toUpperCase() || 'BOT'
        const Version_ = response.data.version
        const dataVersion = document.querySelector('#appVersion')
        versionApp = 'v' +`${Version_ || '?.?.?'}`
        dataVersion.textContent = versionApp

        const response2 = await axios.get('/back/what-stage')
        const stage = response2.data.data
        const QR_Counter = response2.data.data2
        Client_ = response2.data.data3
        Funil_ = response2.data.data4
        Template_ = response2.data.data5
        /*displayOnConsole(Client_)
        displayOnConsole(Funil_)
        displayOnConsole(Template_)
        console.log(Client_)
        console.log(Funil_)
        console.log(Template_)*/

        
        if (stage === 0) {
            
        }
        if (stage === 1) {
            if (!isFromNew) {
                isStarted = true
            }
            isQrOff = false
            await generateQrCode(QR_Counter, Client_)
        }
        if (stage === 2) {
            if (!isFromNew) {
                isStarted = true
            }
            await authsucess(Client_)
            await ready(Client_)
        }
        if (stage === 3) {
            if (!isFromNew) {
                isStarted = true
            }
            await authsucess(Client_)
            await ready(Client_)
            let isFromNew = true
            isQrOff = false
            await generateQrCode(QR_Counter)
        }

        const reloadButton = document.querySelector('#reload')
        let reloadAbbr = document.querySelector('#abbrReload')

        reloadButton.style.cssText =
            'color: var(--colorContrast); background-color: var(--colorYellow); cursor: progress;'
        reloadAbbr.title = `WebSocket STATUS: carregando`
        
        if (wss) wss.close(), wss = null
        wss = new WebSocket(`ws://${window.location.host}`)
        /*wss = new WebSocket(`wss://${window.location.host}`)*/
        await webSocket()

        /*const originalConsoleLog = console.log
        console.log = function (...args) {
            originalConsoleLog.apply(console, args)
            
            displayLogOnSite(args.join(' '))
        
            ws.send(JSON.stringify({ type: 'log', message: args.join(' ') }))
        }*/
        
        const commandInput = document.querySelector('#commandInput')
        commandInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault()
                document.querySelector('#commandSend').click()
            }
        })

        const listInput = document.querySelector('#inputList')
        listInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            document.querySelector('#sendSearchList').click()
        }
        })

        await loadConsoleStyles()
        await loadFunilStyles()
        let dir_Path = null
        let Directories_ = null
        dir_Path = 'Funil'
        const response3 = await axios.get('/functions/dir', { params: { dir_Path } })
        Directories_ = response3.data.dirs
        if (Directories_.length-1 === -1) {
            
        } else {
            let divTemplateFunctions = document.querySelector('#divNewTemplate')

            let Counter_Clients_ = 1
            for (let i = 1; i <= Directories_.length; i++) {
                await insertFunil_Front(Directories_[Counter_Clients_-1], false)
                //await selectFunil_(Directories_[Counter_Clients_-1], false)

                /*divTemplateFunctions.style.cssText =
                    'display: flex; opacity: 0;'
                setTimeout(function() {
                    divTemplateFunctions.style.cssText =
                        'display: flex; opacity: 1;'
                }, 100)*/
                
                Counter_Clients_++
            }
            const Type_Selected = 2
            const response2 = await axios.get('/features/selecteds', { params: { Type_Selected } })
            const Selectedt = response2.data.Selectedt
            if (Selectedt === '') {
                await selectFunil_(Directories_[0], false)
            } else {
                await selectFunil_(Selectedt, false)
            }

            divTemplateFunctions.style.cssText =
                'display: flex; opacity: 0;'
            setTimeout(function() {
                divTemplateFunctions.style.cssText =
                    'display: flex; opacity: 1;'
            }, 100)
        }

        dir_Path = `Funil\\${Funil_}`
        const response4 = await axios.get('/functions/dir', { params: { dir_Path } })
        Directories_ = response4.data.dirs
        if (Directories_.length-1 === -1) {
            
        } else {
            let divTemplateInner = document.querySelector('#divInnerTemplate')

            let Counter_Templates_ = 1
            for (let i = 1; i <= Directories_.length; i++) {
                const match = Directories_[Counter_Templates_-1].match(/=(.+)\.json/)
                const Templatet_ = match ? match[1] : null
                await insertTemplate_Front(Templatet_, Funil_, false)
                //await selectTemplate_(Templatet_)

                /*divTemplateInner.style.cssText =
                    'display: block; opacity: 0;'
                setTimeout(function() {
                    divTemplateInner.style.cssText =
                        'display: block; opacity: 1;'
                }, 100)*/
                
                Counter_Templates_++
            }
            const Type_Selected = 3
            const response2 = await axios.get('/features/selecteds', { params: { Type_Selected } })
            const Selectedt = response2.data.Selectedt
            if (Selectedt === '') {
                const match = Directories_[0].match(/=(.+)\.json/)
                const Templatet_ = match ? match[1] : null
                await selectTemplate_(Templatet_)
            } else {
                await selectTemplate_(Selectedt)
            }

            divTemplateInner.style.cssText =
                'display: block; opacity: 0;'
            setTimeout(function() {
                divTemplateInner.style.cssText =
                    'display: block; opacity: 1;'
            }, 100)
        }
        //await loadSectionsHtml()
    } catch (error) {
        console.error(`> ⚠️ ERROR DOMContentLoaded: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> DOMContentLoaded: ${error.message}`, setLogError)
    }
})

async function reconnectWebSocket() {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        isReconectOn = true
        isDisconected = false

        const reloadButton = document.querySelector('#reload')
        let reloadAbbr = document.querySelector('#abbrReload')

        reloadButton.style.cssText =
            'color: var(--colorContrast); background-color: var(--colorYellow); cursor: progress;'
        reloadAbbr.title = `WebSocket STATUS: carregando...`

        if (wss) wss.close(), wss = null
        wss = new WebSocket(`ws://${window.location.host}`)
        //wss = new WebSocket(`wss://${window.location.host}`)
        await webSocket()

    } catch (error) {
        console.error(`> ⚠️ ERROR reconnectConsole: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> reconnectConsole: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
async function webSocket() {
    try {
        const reloadButton = document.querySelector('#reload')
        let reloadAbbr = document.querySelector('#abbrReload')

        wss.onopen = function(event) {
            console.log(`> ✅ Conectado Usuario ao WebSocket: `, event)
            displayOnConsole(`> ✅ Conectado <strong>Usuario</strong> ao <strong>WebSocket</strong>: ${event}`)
            reloadButton.style.cssText =
                'color: var(--colorContrast); background-color: var(--colorGreen); cursor: not-allowed; pointer-events: none; opacity: 0.5;'
            reloadAbbr.title = `WebSocket STATUS: conectado`
            setTimeout(function() {
                reloadButton.style.cssText =
                    'color: var(--colorContrast); background-color: var(--colorGreen); cursor: pointer; pointer-events: unset; opacity: 1;'
            }, 5 * 1000)

            resetLoadingBar()
        }
        wss.onclose = function(event) {
            console.log(`> ⚠️ Desconectado Usuario do WebSocket: `, event)
            displayOnConsole(`> ⚠️ Desconectado <strong>Usuario</strong> do <strong>WebSocket</strong>: ${event}`, setLogError)
            reloadButton.style.cssText =
                'color: var(--colorContrast); background-color: var(--colorOrange); cursor: not-allowed; pointer-events: none; opacity: 0.5;'
            reloadAbbr.title = `WebSocket STATUS: desconectou`
            setTimeout(function() {
                reloadButton.style.cssText =
                    'color: var(--colorContrast); background-color: var(--colorOrange); cursor: pointer; pointer-events: unset; opacity: 1;'
            }, 5 * 1000)

            isDisconected = true

            resetLoadingBar()
        }
        wss.onerror = function(event) {
            console.error(`> ❌ ERROR ao reconectar Usuario ao WebSocket: `, event)
            displayOnConsole(`> ❌ <i><strong>ERROR</strong></i> ao reconectar <strong>Usuario</strong> ao <strong>WebSocket</strong>: ${event}`, setLogError)
            setTimeout(function() {
                reloadButton.style.cssText =
                    'color: var(--colorContrast); background-color: var(-colorRed); cursor: not-allowed; pointer-events: none; opacity: 0.5;'
                reloadAbbr.title = `WebSocket STATUS: error`
                setTimeout(function() {
                    reloadButton.style.cssText =
                        'color: var(--colorContrast); background-color: var(-colorRed); cursor: pointer; pointer-events: none; opacity: 0.5;'
                }, 5 * 1000)
            }, 100)

            isDisconected = true
            
            resetLoadingBar()
        }

        wss.onmessage = function(event) {
            const dataWebSocket = JSON.parse(event.data)
            handleWebSocketData(dataWebSocket)
        }
        
        resetLoadingBar()
    } catch(error) {
        console.error(`> ⚠️ ERROR webSocket: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> webSocket: ${error.message}`, setLogError)
        reconectAttempts = 0
        resetLoadingBar()
    }
}
async function handleWebSocketData(dataWebSocket) {
    switch (dataWebSocket.type) {
        case 'WS=/back/logs':
            //console.log(logData.message)
            displayOnConsole(dataWebSocket.message)
            /*const logElement = document.createElement('div')
            logElement.textContent = logData.message
            document.querySelector('#log').appendChild(logElement)
            autoScroll()*/
            break
        case 'WS=/websocket/statues-connection':
            const statuses = dataWebSocket.data
            await statusesWs(statuses)
            break
        case 'WS=/chatdata/query-erase':
            const search2 = dataWebSocket.Search.trim()
            const isFromTerminal3 = true
            //ChatDataNotReady = false
            await eraseChatDataByQuery(isFromTerminal3, search2)
            break
        case 'WS=/chatdata/all-erase':
            /*const Sucess2 = dataWebSocket.sucess
            const Is_Empty2 = dataWebSocket.empty
            const isFromTerminal2 = true*/
            //allErase(Sucess2, Is_Empty2, isFromTerminal2)
            //ChatDataNotReady = false
            await allErase()
            break
        case 'WS=/chatdata/search-print':
            //const Parse_Data = dataWebSocket.data
            const Search = dataWebSocket.search.trim()
            const isFromTerminal = true
            //ChatDataNotReady = false
            await searchChatDataBySearch(isFromTerminal, Search)
            //searchChatDataBySearch(isFromTerminal, Parse_Data, Search)
            break
        case 'WS=/chatdata/all-print':
            /*const Sucess = dataWebSocket.sucess
            const Is_Empty = dataWebSocket.empty
            const ChatData = dataWebSocket.chatdata*/
            const isFromButton = false
            //allPrint(Sucess, Is_Empty, ChatData, isFromButton, Is_From_All_Erase)
            await allPrint(isFromButton, false, null)
            break
        case 'WS=/chatdata/all-print-auxiliar':
            /*const Sucess = dataWebSocket.sucess
            const Is_Empty = dataWebSocket.empty
            const ChatData = dataWebSocket.chatdata*/
            const isFromButton2 = false
            const Is_From_All_Erase = dataWebSocket.isallerase
            const Client_ = dataWebSocket.Client_
            //allPrint(Sucess, Is_Empty, ChatData, isFromButton, Is_From_All_Erase)
            ChatDataNotReady = false
            await allPrint(isFromButton2, Is_From_All_Erase, Client_)
            break
        case 'WS=/back/exit':
            isReconectionOff = true
            let exitInten = false
            await exit(exitInten)
            break
        case 'WS=/client/qr-code-exceeds':
            isExceeds = false
            const QR_Counter_Exceeds = dataWebSocket.data
            await counterExceeds(QR_Counter_Exceeds)
            break
        case 'WS=/client/auth-autenticated':
            const Client____ = dataWebSocket.client
            await authsucess(Client____);
            break
        case 'WS=/client/ready':
            const Client_____ = dataWebSocket.client
            const Is_Reinitialize = dataWebSocket.isreinitialize
            if (Is_Reinitialize === true) {
                isAlreadyDir = true
            }
            await ready(Client_____)
            break
        case 'WS=/client/auth-failure':
            isReconectionOff = true
            await authFailure()
            break
        case 'WS=/client/erase':
            const Client______ = dataWebSocket.client
            await eraseClient_(Client______)
            break
        case 'WS=/client/destroy':
            const Client_______ = dataWebSocket.client
            const isRename = dataWebSocket.isRename
            await DestroyClient_(Client_______, isRename)
            
            wss.send(JSON.stringify({
                type: 'WS=/client/return-destroy',
            }))
            break
        case 'WS=/client/reinitialize':
            const Client________ = dataWebSocket.client
            await ReinitializeClient_(Client________)

            wss.send(JSON.stringify({
                type: 'WS=/client/return-reinitialize',
            }))
            break
        case 'WS=/client/select':
            const Client_________ = dataWebSocket.client
            await selectClient_(Client_________)
            break
        case 'WS=/client/new':
            await newClients()
            break
        case 'WS=/client/set-client-name':
            const isNew = dataWebSocket.isnew

            const Namet_ = await setClientName(true)

            wss.send(JSON.stringify({
                type: 'WS=/client/return-set-client-name',
                name: Namet_
            }))
            resetLoadingBar()
            const status = document.querySelector('#status')
            if (isNew) {   
                status.innerHTML = `Iniciando <strong>QR-Code</strong>...`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Iniciando <strong>QR-Code</strong>...`)

                let barL = document.querySelector('#barLoading')
                barL.style.cssText =
                    'width: 100vw; visibility: visible;'
            } else {
                status.innerHTML = `<strong>Renomeando</strong> Client <strong>${Client_.split('_')[2]}</strong> para <strong>${Namet_}</strong>...`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Renomeando</strong> Client <strong>${Client_.split('_')[2]}</strong> para <strong>${Namet_}</strong>...`)
            }
            break
        case 'WS=/funil/set-funil-name':
            const isNew2 = dataWebSocket.isnew

            const Namet_2 = await setFunilName(true)

            wss.send(JSON.stringify({
                type: 'WS=/funil/return-set-funil-name',
                name: Namet_2
            }))
            resetLoadingBar()
            const status2 = document.querySelector('#status')
            if (isNew2) {   
                //status2.innerHTML = `Iniciando <strong>QR-Code</strong>...`
                //displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Iniciando <strong>QR-Code</strong>...`)

                let barL = document.querySelector('#barLoading')
                barL.style.cssText =
                    'width: 100vw; visibility: visible;'
            } else {
                status2.innerHTML = `<strong>Renomeando</strong> Client <strong>${Client_.split('_')[2]}</strong> para <strong>${Namet_}</strong>...`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Renomeando</strong> Client <strong>${Client_.split('_')[2]}</strong> para <strong>${Namet_}</strong>...`)
            }
            break
        case 'WS=/template/set-template-name':
            const isNew3 = dataWebSocket.isnew

            const Namet_3 = await setTemplateName(true)

            wss.send(JSON.stringify({
                type: 'WS=/template/return-set-template-name',
                name: Namet_3
            }))
            resetLoadingBar()
            const status3 = document.querySelector('#status')
            if (isNew3) {   
                //status2.innerHTML = `Iniciando <strong>QR-Code</strong>...`
                //displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Iniciando <strong>QR-Code</strong>...`)

                let barL = document.querySelector('#barLoading')
                barL.style.cssText =
                    'width: 100vw; visibility: visible;'
            } else {
                status3.innerHTML = `<strong>Renomeando</strong> Client <strong>${Client_.split('_')[2]}</strong> para <strong>${Namet_}</strong>...`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Renomeando</strong> Client <strong>${Client_.split('_')[2]}</strong> para <strong>${Namet_}</strong>...`)
            }
            break
        case 'WS=/clients/insert':
            const Client__ = dataWebSocket.client
            isAlreadyDir = true
            Client_NotReady = true
            let isActive = true
            await insertClient_Front(Client__, isActive, true)
            break
        case 'WS=/client/qr-code':
            const QR_Counter = dataWebSocket.data
            const Client___ = dataWebSocket.data2

            isQrOff = false
            setTimeout(async function() {
                await generateQrCode(QR_Counter, Client___)
            }, 100)
            break
        case 'WS=/clients/start':
            await startBot()
            break
        case 'WS=/error':
            console.error(`> ⚠️ ERROR Return WebSocket Conection: ${dataWebSocket.message}`)
            displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> Retorno da Conexão WebSocket: ${dataWebSocket.message}`, setLogError)
            break
    }
}
function statusesWs(statuses) {
    try {
        //const reloadButton = document.querySelector('#reload')
        //let reloadAbbr = document.querySelector('#abbrReload')
        if (statuses) {
            //console.log(`> ✅ Conectado Client ao WebSocket`)
            /*displayOnConsole(`> ✅ Conectado Client ao WebSocket(true)`)
            reloadButton.style.cssText =
                'color: var(--colorContrast); background-color: var(--colorGreen); cursor: not-allowed; pointer-events: none; opacity: 0.5;'
            reloadAbbr.title = `WebSocket STATUS: conectado`
            setTimeout(function() {
                reloadButton.style.cssText =
                    'color: var(--colorContrast); background-color: var(--colorGreen); cursor: pointer; pointer-events: unset; opacity: 1;'
            }, 5 * 1000)

            isDisconected = false

            resetLoadingBar()*/
        } else {
            //console.log(`> ⚠️ Desconectado Client do WebSocket`)
            /*displayOnConsole(`> ⚠️ Desconectado Client do WebSocket(true)`, setLogError)
            reloadButton.style.cssText =
                'color: var(--colorContrast); background-color: var(--colorOrange); cursor: not-allowed; pointer-events: none; opacity: 0.5;'
            reloadAbbr.title = `WebSocket STATUS: desconectou`
            setTimeout(function() {
                reloadButton.style.cssText =
                    'color: var(--colorContrast); background-color: var(--colorOrange); cursor: pointer; pointer-events: unset; opacity: 1;'
            }, 5 * 1000)

            isDisconected = true*/
    
            if (wss) wss.close(), wss = null
            wss = new WebSocket(`ws://${window.location.host}`)
            /*wss = new WebSocket(`wss://${window.location.host}`)*/
            webSocket()

            //resetLoadingBar()
        }
    } catch(error) {
        console.error(`> ⚠️ ERROR statusesWs: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> statusesWs: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}

async function exit(exitInten) {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        ChatDataNotReady = true

        isFromNew = false

        Client_ = null

        ChatDataNotReady = true

        TableReady = false

        isStartedNew = true

        isHideAP = true

        isStarted = false

        if (!exitInten) {
            if (isDisconected) {
                reconnectWebSocket()
            }
        } 

        if (exitInten) {
            const capList = document.querySelector(`caption`)
            capList.innerHTML = `<stronger>CHATDATA</stronger>`
        }
        
        if (exitInten) {
            document.title = 'Reset page'
        } else {
            document.title = 'ERROR'
        }
        
        if (exitInten) {
            displayOnConsole(`> ⚠️ Reset page`)
        } else {
            console.error(`> ❌ ERROR: BackEnd`)
            displayOnConsole(`> ❌ <i><strong>ERROR</strong></i>: BackEnd`, setLogError)
        }

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'

        isConsoleHidden = null

        isTableHidden = null
        let listShow = document.querySelector('#showList')
        let listShowAbbr = document.querySelector('#abbrShowList')
        listShow.style.cssText = 
            'display: inline-block; background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0;'
        setTimeout(function() {
            listShow.style.cssText =
                'display: none; background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0;'
        }, 300)
        listShow.textContent = '-O'
        listShowAbbr.title = `STATUS Lista: null`
        const list = document.querySelector('#listTable')
        list.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            list.style.cssText =
                'display: none; opacity: 0;'
        }, 300)

        const status = document.querySelector('#status')
        if (exitInten) {
            status.innerHTML = `<strong>Reset page</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Reset page</strong>!`)
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> Back End!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> Back End!`)
        }

        let buttonStart = document.querySelector('#start')
        buttonStart.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            buttonStart.style.cssText =
                'display: inline-block; opacity: 1;'
        }, 100)
        
        document.querySelector('#qrCode').innerText = ''
        const codeQr = document.querySelector('#qrCode')
        codeQr.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            codeQr.style.cssText =
                'display: none; opacity: 0;'
        }, 300)

        const newClientDiv = document.querySelector('#divNewClient')
        newClientDiv.style.cssText = 'display: flex; opacity: 0;' 
        setTimeout(() => newClientDiv.style.cssText = 'display: none; opacity: 0;', 100)
        document.querySelector('#Clients_').innerHTML = ''

        resetLoadingBar()
    } catch(error) {
        if (exitInten) {
            console.error(`> ⚠️ ERROR exit(Reset page): ${error}`)
            displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> exit(<strong>Reset page</strong>): ${error.message}`, setLogError)
        } else {
            console.error(`> ⚠️ ERROR exit: ${error}`)
            displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> exit: ${error.message}`, setLogError)
        }
        ChatDataNotReady = true

        isFromNew = false

        Client_ = null

        ChatDataNotReady = true

        isStartedNew = true

        isStarted = false

        isHideAP = true

        isStarted = false
        document.title = 'ERROR'
        resetLoadingBar()
    }
} 
async function authsucess(Client_) {
    try {
        if (!isFromNew) {
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)
            isStarted = true
        }

        const status = document.querySelector('#status')
        status.innerHTML = `Client_ <strong>${Client_}</strong> Realizado com Sucesso <strong>Autenticação</strong> ao WhatsApp Web pelo <strong>Local_Auth</strong>!`
        displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Client_}</strong> Realizado com Sucesso <strong>Autenticação</strong> ao WhatsApp Web pelo <strong>Local_Auth</strong>!`)
        
        document.querySelector('#qrCode').innerText = ''
        const codeQr = document.querySelector('#qrCode')
        codeQr.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            codeQr.style.cssText =
            'display: none; opacity: 0;'
        }, 300)
    } catch(error) {
        console.error(`> ⚠️ ERROR ${Client_} authSucess: ${error}`)
        displayOnConsole(`> ⚠️ <strong>ERROR ${Client_}</strong> authSucess: ${error.message}`, setLogError)
    }
}
async function ready(Client_) {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        ChatDataNotReady = false

        if (isDisconected) {
            reconnectWebSocket()
        }

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'
            
        isStartedNew = false

        if (!isFromNew) {
            isStarted = true
        }

        const newClientDiv = document.querySelector('#divNewClient')
        newClientDiv.style.cssText = 'display: flex; opacity: 0;' 
        setTimeout(() => newClientDiv.style.cssText = 'display: flex; opacity: 1;', 100)
        if (!isAlreadyDir) {
            //o codigo abaixo e possivel botar tudo numa rota e devolver e fazer oq fas aqui que nsei como explica certinho, modelo REST e tals (se for preciso)

            const dir_Path = 'Local_Auth'
            const response = await axios.get('/functions/dir', { params: { dir_Path } })
            const Directories_ = response.data.dirs
            
            if (Directories_.length-1 === -1) {
                displayOnConsole(`> ⚠️ <strong>Dir</strong> Clients_ (<strong>${Directories_.length}</strong>) is <strong>empty</strong>.`)
                
                let exitInten = true
                await exit(exitInten)
            } else {
                displayOnConsole(`> ℹ️  <strong>Dir</strong> Clients_ has (<strong>${Directories_.length}</strong>) loading <strong>ALL</strong>...`)
                
                const response = await axios.get('/clients/active')
                const Actives_ = response.data.actives

                let Counter_Clients_ = 1
                for (let i = 1; i <= Directories_.length; i++) {
                    const key = Actives_[Object.keys(Actives_)[Counter_Clients_-1]].instance
                    let isActive = null
                    if (key) {
                        isActive = false
                    } else {
                        isActive = true
                    }

                    Client_NotReady = true
                    await insertClient_Front(Directories_[Counter_Clients_-1], isActive, false)
                    //await selectClient_(Directories_[Counter_Clients_-1])
                    
                    Counter_Clients_++
                }
                displayOnConsole(`> ✅ <strong>Dir</strong> Clients_ loaded <strong>ALL</strong> (<strong>${Directories_.length}</strong>).`)
            }
        } else {
            isAlreadyDir = false
        }
        const dir_Path = 'Local_Auth'
        const response = await axios.get('/functions/dir', { params: { dir_Path } })
        const Directories_ = response.data.dirs

        if (Directories_.length-1 === -1) {

        } else {
            const Type_Selected = 1
            const response2 = await axios.get('/features/selecteds', { params: { Type_Selected } })
            const Selectedt = response2.data.Selectedt
            if (Selectedt === '') {
                await selectClient_(Directories_[0])
            } else {
                await selectClient_(Selectedt)
            }
        }

        isFromNew = false 

        tableReady = false
        await loadTableStyles()
        
        //document.title = `${nameApp || 'BOT'} ${Client_} pronto`
        document.title = `${Client_} pronto`

        resetLoadingBar()
    } catch(error) {
        document.title = 'ERROR'
        console.error(`> ⚠️ ERROR ${Client_} ready: ${error}`)
        displayOnConsole(`> ⚠️ <strong>ERROR ${Client_}</strong> ready: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
async function authFailure() {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        ChatDataNotReady = true

        if (isDisconected) {
            reconnectWebSocket()
        }
        document.title = 'ERROR'

        console.error(`> ❌ ERROR BackEnd authFailure`)
        displayOnConsole(`> ❌ <i><strong>ERROR</strong></i> BackEnd authFailure`, setLogError)

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'
        
        isConsoleHidden = null

        isTableHidden = null
        let listShow = document.querySelector('#showList')
        let listShowAbbr = document.querySelector('#abbrShowList')
        listShow.style.cssText = 
            'display: inline-block; background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0;'
        setTimeout(function() {
            listShow.style.cssText =
                'display: none; background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0;'
        }, 300)
        listShow.textContent = '-O'
        listShowAbbr.title = `STATUS Lista: null`
        const list = document.querySelector('#listTable')
        list.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            list.style.cssText =
                'display: none; opacity: 0;'
        }, 300)


        if (!isFromNew) {
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            isStarted = false
        }
        
        document.querySelector('#qrCode').innerText = ''
        const codeQr = document.querySelector('#qrCode')
        codeQr.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            codeQr.style.cssText =
                'display: none; opacity: 0;'
        }, 300)

        const newClientDiv = document.querySelector('#divNewClient')
        newClientDiv.style.cssText = 'display: flex; opacity: 0;' 
        setTimeout(() => newClientDiv.style.cssText = 'display: none; opacity: 0;', 100)
        document.querySelector('#Clients_').innerHTML = ''

        resetLoadingBar()
    } catch(error) {
        document.title = 'ERROR'
        console.error(`> ⚠️ ERROR authFailure: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> authFailure: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}

//Patterns for Miliseconds times:
// Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
// Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
// Formated= 1 \ * 60 * 1000 = 1-Minute
// Formated= 1 \ * 1000 = 1-Second

function sleep(time) {
    try {
        return new Promise((resolve) => setTimeout(resolve, time))
    } catch(error) {
        console.error(`> ⚠️ ERROR sleep: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> sleep: ${error.message}`, setLogError)
    }
}

function displayOnConsole(message, setLogError) {
    try {
        const logElement = document.createElement('div')
        logElement.innerHTML = `${message}`
        if (setLogError) {
            logElement.style.cssText =
                'color: var(--colorRed)'
        }
        document.querySelector('#log').appendChild(logElement)
        autoScroll()
    } catch(error) {
        console.error(`> ⚠️ ERROR displayOnConsole: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> displayOnConsole: ${error.message}`, setLogError)
    }
}

async function inputSelectAll(input, is) {
    try {
        if (is === 1) {
            input.select()
        } else {
            return
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR inputSelectAll: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> inputSelectAll: ${error.message}`, setLogError)
    }
}

async function triggerOnKey(event, id, key, functioN,  ...params) {
    try {
        switch (id) {
            case 1:
                switch (event.key.toLowerCase()) {
                    case key.toLowerCase():
                        event.preventDefault()
                        const sendClientName = document.querySelector(`#isendSearchClientName`)
                        sendClientName.dispatchEvent(new Event('click'))
                        functioN.apply(null, params)
                        break
                }       
                break
            case 2:
                switch (event.key.toLowerCase()) {
                    case key.toLowerCase():
                        event.preventDefault()
                        const sendFunilName = document.querySelector(`#isendSearchFunilName`)
                        sendFunilName.dispatchEvent(new Event('click'))
                        functioN.apply(null, params)
                        break
                }       
                break
            case 3:
                switch (event.key.toLowerCase()) {
                    case key.toLowerCase():
                        event.preventDefault()
                        const sendTemplateName = document.querySelector(`#isendSearchTemplateName`)
                        sendTemplateName.dispatchEvent(new Event('click'))
                        functioN.apply(null, params)
                        break
                }       
                break
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR triggerOnKey: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> triggerOnKey: ${error.message}`, setLogError)
    }
}

async function saveTableStyles() {
    try {
        localStorage.setItem('tableStyles', JSON.stringify({
            tableStateHidden: isTableHidden
        }))
    } catch (error) {
        console.error(`> ⚠️ ERROR saveTableStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> saveTableStyles: ${error.message}`, setLogError)
    }
}
async function loadTableStyles() {
    try {
        const savedStylesTable = JSON.parse(localStorage.getItem('tableStyles'))
        if (savedStylesTable) {
            isTableHidden = savedStylesTable.tableStateHidden
        }
        await showTableList()
    } catch (error) {
        console.error(`> ⚠️ ERROR loadTableStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> loadTableStyles: ${error.message}`, setLogError)
    }
}
async function showTableList() {
    if (tableReady) {
        displayOnConsole('> ℹ️ <strong>showTableList</strong> not Ready.', setLogError)
        return
    }
    try {
        const listShow = document.querySelector('#showList')
        const listShowAbbr = document.querySelector('#abbrShowList')
        const list = document.querySelector('#listTable')

        //const sectionActual = list.parentElement.parentElement
        
        if (isTableHidden === null || undefined) {
            isTableHidden = true 
        }

        if (isTableHidden) {
            listShow.style.cssText = 
                'display: inline-block; background-color: var(--colorWhite); color: var(--colorBlack); cursor: pointer; pointer-events: auto; opacity: 1;'
            listShow.textContent = '-'
            listShowAbbr.title = `Lista STATUS: visivel`
            
            list.style.cssText =
                'display: inline-block; opacity: 0;'
            /*sectionActual.style.cssText =
                'display: unset; opacity: 0;'*/
            setTimeout(function() {
                list.style.cssText =
                    'display: inline-block; opacity: 1;'
                /*sectionActual.style.cssText =
                    'display: unset; opacity: 1;'*/
            }, 100)
            
            await saveTableStyles()
            isTableHidden = false
            isHideAP = false
        } else {
            listShow.style.cssText = 
                'display: inline-block; background-color: var(--colorBlack); color: var(--colorWhite); cursor: pointer; pointer-events: auto; opacity: 1;'
            listShow.textContent = 'O'
            listShowAbbr.title = `Lista STATUS: escondido`
            
            list.style.cssText =
                'display: inline-block; opacity: 0;'
            /*sectionActual.style.cssText =
                'display: unset; opacity: 0;'*/
            setTimeout(function() {
                list.style.cssText =
                    'display: none; opacity: 0;'
                /*sectionActual.style.cssText =
                    'display: none; opacity: 0;'*/
            }, 300)

            await saveTableStyles()
            isTableHidden = true
            isHideAP = true
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR showTableList: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> showTableList: ${error.message}`, setLogError)
    }
}

async function saveFunilStyles() {
    try {
        localStorage.setItem('funilStyles', JSON.stringify({
            funilStateHidden: isFunilHidden
        }))
    } catch (error) {
        console.error(`> ⚠️ ERROR saveFunilStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> saveFunilStyles: ${error.message}`, setLogError)
    }
}
async function loadFunilStyles() {
    try {
        const savedStylesFunil = JSON.parse(localStorage.getItem('funilStyles'))
        if (savedStylesFunil) {
            isFunilHidden = savedStylesFunil.funilStateHidden
        }
        await showFunil()
    } catch (error) {
        console.error(`> ⚠️ ERROR loadFunilStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> loadFunilStyles: ${error.message}`, setLogError)
    }
}
async function showFunil() {
    /*if (funilReady) {
        displayOnConsole('> ℹ️ <strong>showFunil</strong> not Ready.', setLogError)
        return
    }*/
    try {
        const funilShow = document.querySelector('#showFunil')
        const funilShowAbbr = document.querySelector('#abbrShowFunil')
        const funil = document.querySelector('#divFunil')

        //const sectionActual = funil.parentElement.parentElement

        if (isFunilHidden === null || undefined) {
            isFunilHidden = true 
        }

        if (isFunilHidden) {
            funilShow.style.cssText = 
                'display: inline-block; background-color: var(--colorWhite); color: var(--colorBlack); cursor: pointer; pointer-events: auto; opacity: 1;'
            funilShow.textContent = '-'
            funilShowAbbr.title = `Funil STATUS: visivel`
            
            funil.style.cssText =
                'display: inline-block; opacity: 0;'
            /*sectionActual.style.cssText =
                'display: unset; opacity: 0;'*/
            setTimeout(function() {
                funil.style.cssText =
                    'display: inline-block; opacity: 1;'
                /*sectionActual.style.cssText =
                    'display: unset; opacity: 1;'*/
            }, 100)

            await saveFunilStyles()
            isFunilHidden = false
        } else {
            funilShow.style.cssText = 
                'display: inline-block; background-color: var(--colorBlack); color: var(--colorWhite); cursor: pointer; pointer-events: auto; opacity: 1;'
            funilShow.textContent = 'O'
            funilShowAbbr.title = `Funil STATUS: escondido`
            
            funil.style.cssText =
                'display: inline-block; opacity: 0;'
            /*sectionActual.style.cssText =
                'display: unset; opacity: 0;'*/
            setTimeout(function() {
                funil.style.cssText =
                    'display: none; opacity: 0;'
                /*sectionActual.style.cssText =
                    'display: none; opacity: 0;'*/
            }, 300)
            
            await saveFunilStyles()
            isFunilHidden = true
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR showFunil: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> showFunil: ${error.message}`, setLogError)
    }
}

async function saveConsoleStyles() {
    try {
        localStorage.setItem('consoleStyles', JSON.stringify({
            consoleStateHidden: isConsoleHidden
        }))
    } catch (error) {
        console.error(`> ⚠️ ERROR saveConsoleStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> saveConsoleStyles: ${error.message}`, setLogError)
    }
}
async function loadConsoleStyles() {
    try {
        const savedStylesConsole = JSON.parse(localStorage.getItem('consoleStyles'))
        if (savedStylesConsole) {
            isConsoleHidden = savedStylesConsole.consoleStateHidden   
        }
        await hideConsole()
    } catch (error) {
        console.error(`> ⚠️ ERROR loadConsoleStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> loadConsoleStyles: ${error.message}`, setLogError)
    }
}
async function hideConsole() {
    try {
        const consoleElement = document.querySelector('#console')
        const buttonHideConsole = document.querySelector('#hideConsole')
        const titleHideConsole = document.querySelector('#titleHide')
    
        if (isConsoleHidden === null || undefined) {
            isConsoleHidden = false
        }
        
        if (isConsoleHidden) {    
            consoleElement.style.cssText =
                'width: 30.62vw;'
            buttonHideConsole.textContent = `◀`
            titleHideConsole.title = `Terminal STATUS: visivel`
        
            await saveConsoleStyles()
            isConsoleHidden = false
        } else {
            consoleElement.style.cssText = 
                'width: 0vw;' 
            buttonHideConsole.textContent = `▶`
            titleHideConsole.title = `Terminal STATUS: escondido`
           
            await saveConsoleStyles()
            isConsoleHidden = true
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR hideConsole: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> hideConsole: ${error.message}`, setLogError)
    }
}

async function clsConsole() {
    try {
        displayOnConsole(`cls/clear`)
        document.querySelector('#log').innerHTML = ''
        displayOnConsole(`cls/clear`)
    } catch (error) {
        console.error(`> ⚠️ ERROR clsConsole: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> clsConsole: ${error.message}`, setLogError)
    }
}

/*async function saveSectionsHtml() {
    let sectionIndex = 1
    let isEnded = true
    while (isEnded === true) {
        const sectionDiv = document.querySelector(`#section${sectionIndex}`)
        if (!sectionDiv) {
            isEnded = false
            break
        }

        const conteinerPositionSection = sectionDiv.querySelector(`#idivInnerConteinerSection`)
        const innerHTML = conteinerPositionSection.innerHTML

        const titleSection = sectionDiv.querySelector(`#ititleSection`)
        const titleText = titleSection.textContent

        localStorage.setItem(`sectionInnerHTML_${sectionIndex}`, innerHTML)
        localStorage.setItem(`sectionTitleText_${sectionIndex}`, titleText)

        sectionIndex++
    }
}
async function loadSectionsHtml() {
    let sectionIndex = 1
    let isEnded = true
    while (isEnded === true) {
        const sectionDiv = document.querySelector(`#section${sectionIndex}`)
        if (!sectionDiv) {
            isEnded = false
            break
        }

        // Busca a div com id "idivInnerConteinerSection" dentro da seção atual
        const conteinerPositionSection = sectionDiv.querySelector(`#idivInnerConteinerSection`)
        const savedSectionInnerHTML = localStorage.getItem(`sectionInnerHTML_${sectionIndex}`)
        if (savedSectionInnerHTML) {
            conteinerPositionSection.innerHTML = savedSectionInnerHTML
        }

        const titleSection = sectionDiv.querySelector(`#ititleSection`)
        const savedTitleText = localStorage.getItem(`sectionTitleText_${sectionIndex}`)
        if (savedTitleText) {
            titleSection.textContent = savedTitleText
            displayOnConsole(titleSection.textContent)
            if (titleSection.textContent === 'Tabela') {
                await loadFunilStyles()
            }
        }

        sectionIndex++
    }
}
let positionSelectedSection = null
async function selectionPositionSection(checkElement) {
    try {
        const divPosition = checkElement.parentElement.parentElement.parentElement
        const idNumberPositionSection = divPosition.id.match(/\d+/g)

        if (positionSelectedSection !== null && checkElement.checked === true) {
            checkElement.checked = false
            
            let userConfirmation = confirm(`Tem certeza de que deseja trocar a Seção (${positionSelectedSection}) para a Seção (${idNumberPositionSection})?`)
            if (userConfirmation) {
                const conteinerPositionSectionSelected = document.querySelector(`#section${positionSelectedSection}`)
                const conteinerPositionSectionTochange = document.querySelector(`#section${idNumberPositionSection}`)

                conteinerPositionSectionSelected.querySelector(`#idivInnerConteinerSection`).style.cssText =
                    `display: flex; opacity: 0;`
                conteinerPositionSectionTochange.querySelector(`#idivInnerConteinerSection`).style.cssText =
                    `display: flex; opacity: 0;`

                conteinerPositionSectionSelected.querySelector(`#ititleSection`).style.cssText =
                    `display: flex; opacity: 0;`
                conteinerPositionSectionTochange.querySelector(`#ititleSection`).style.cssText =
                    `display: flex; opacity: 0;`
                setTimeout(function() {
                    conteinerPositionSectionSelected.querySelector(`#idivInnerConteinerSection`).style.cssText =
                        `display: none; opacity: 0;`
                    conteinerPositionSectionTochange.querySelector(`#idivInnerConteinerSection`).style.cssText =
                        `display: none; opacity: 0;`

                    conteinerPositionSectionSelected.querySelector(`#ititleSection`).style.cssText =
                        `display: none; opacity: 0;`
                    conteinerPositionSectionTochange.querySelector(`#ititleSection`).style.cssText =
                        `display: none; opacity: 0;`
                
                    const divInnerPositionSectionSelected = conteinerPositionSectionSelected.querySelector(`#idivInnerConteinerSection`).cloneNode(true)
                    conteinerPositionSectionSelected.querySelector(`#idivInnerConteinerSection`).innerHTML = ''

                    const divInnerPositionSectionTochange = conteinerPositionSectionTochange.querySelector(`#idivInnerConteinerSection`).cloneNode(true)
                    conteinerPositionSectionTochange.querySelector(`#idivInnerConteinerSection`).innerHTML = ''

                    conteinerPositionSectionSelected.querySelector(`#idivInnerConteinerSection`).replaceWith(divInnerPositionSectionTochange)
                    conteinerPositionSectionSelected.querySelector(`#idivInnerConteinerSection`).style.cssText =
                        `display: flex; opacity: 0;`
                    conteinerPositionSectionTochange.querySelector(`#idivInnerConteinerSection`).replaceWith(divInnerPositionSectionSelected)
                    conteinerPositionSectionTochange.querySelector(`#idivInnerConteinerSection`).style.cssText =
                        `display: flex; opacity: 0;`

                    const titleSectionSelected = conteinerPositionSectionSelected.querySelector(`#ititleSection`).textContent
                    conteinerPositionSectionSelected.querySelector(`#ititleSection`).textContent = ''

                    const titleSectionTochange = conteinerPositionSectionTochange.querySelector(`#ititleSection`).textContent
                    conteinerPositionSectionTochange.querySelector(`#ititleSection`).textContent = ''
                    
                    conteinerPositionSectionSelected.querySelector(`#ititleSection`).style.cssText =
                        `display: flex; opacity: 0;`
                    conteinerPositionSectionTochange.querySelector(`#ititleSection`).style.cssText =
                        `display: flex; opacity: 0;`
                    setTimeout(async function() {
                        conteinerPositionSectionSelected.querySelector(`#ititleSection`).textContent = titleSectionTochange
                        conteinerPositionSectionTochange.querySelector(`#ititleSection`).textContent = titleSectionSelected

                        conteinerPositionSectionSelected.querySelector(`#idivInnerConteinerSection`).style.cssText =
                            `display: flex; opacity: 1;`
                        conteinerPositionSectionTochange.querySelector(`#idivInnerConteinerSection`).style.cssText =
                            `display: flex; opacity: 1;`
                        
                        conteinerPositionSectionSelected.querySelector(`#ititleSection`).style.cssText =
                            `display: flex; opacity: 1;`
                        conteinerPositionSectionTochange.querySelector(`#ititleSection`).style.cssText =
                            `display: flex; opacity: 1;`
                        
                        document.querySelector(`#iinputCheckboxSelectionSection${positionSelectedSection}`).checked = false
                        document.querySelector(`#iinputCheckboxSelectionSection${positionSelectedSection}`).dispatchEvent(new Event('change'))

                        await saveSectionsHtml()
                    }, 300)
                }, 100)
            } else {


                return
            }
            return
        }

        if (checkElement.checked) {
            const idNumberPositionSelected = Number(idNumberPositionSection)
            positionSelectedSection = idNumberPositionSelected
            checkElement.parentElement.title = `Selecionado esta posição (${idNumberPositionSection})`
        } else {
            positionSelectedSection = null
            checkElement.parentElement.title = `Selecione esta posição (${idNumberPositionSection})`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR selectionPositionSection: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> selectedPositionSection: ${error.message}`, setLogError)
    }
}*/

/*window.onscroll = function() { scrollFunction() }// CALL FUNCTION FOR HEADER AND FOOTER CUSTOMS

function scrollFunction() {// SHOW THE SCROLLS BUTTONS AND FOOTER
    let head = document.querySelector('header')
    
    if (window.scrollY > 35) {
        head.style.cssText =
            'border-radius: 0px 0px 0px 0px'
    } else {
        head.style.cssText =
            'border-radius: 0px 0px 50px 0px'
    }

    let foot = document.querySelector('footer')
    let lO = document.querySelector('#linklOuKo')
    
    if (document.body.scrollHeight - (window.scrollY + window.innerHeight) < 27) {
        foot.style.cssText =
            'opacity: 1 visibility: visible border-radius: 0px 50px 0px 0px'

        lO.style.cssText =
            'pointer-events: unset'
    } else {
        foot.style.cssText =
            'opacity: 1 visibility: visible border-radius: 0px 0px 0px 0px'

        lO.style.cssText =
            'pointer-events: none'
    }
}*/
function autoScroll() {
    try {
        const consoleLog = document.querySelector('#divLog')
        const currentScroll = consoleLog.scrollTop
        const targetScroll = consoleLog.scrollHeight - consoleLog.clientHeight
        const scrollDifference = targetScroll - currentScroll
        const duration = 300

        let startTime

        function scrollStep(timestamp) {
            if (!startTime) {
                startTime = timestamp
            }

            const progress = Math.min((timestamp - startTime) / duration, 1)
            consoleLog.scrollTop = currentScroll + scrollDifference * progress

            if (progress < 1) {
                requestAnimationFrame(scrollStep)
            }
        }

        requestAnimationFrame(scrollStep)
    } catch(error) {
        console.error(`> ⚠️ ERROR autoScroll: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> autoSroll: ${error.message}`, setLogError)
    }
}

async function sendCommand() {
    try {
        let commandInput = document.querySelector('#commandInput').value
        let commandSend = document.querySelector('#commandSend')

        commandSend.style.cssText =
            'background-color: #2b2b2b; color: var(--colorWhite); border: 1px solid var(--colorWhite); transition: var(--configTrasition01s);'
        
        //console.log(commandInput)
        //displayOnConsole(commandInput)
        
        await axios.post('/features/command', { command: commandInput}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        /*await axios.post('/features/command', { command: commandInput }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })*/
        
        setTimeout(function() {
            commandSend.style.cssText =
                'background-color: var(--colorInteractionElements); color: var(--colorBlack); border: 1px solid rgba(0, 0, 0, 0); transition: var(--configTrasition03s);'
        }, 100)
        
        document.querySelector('#commandInput').value = ''
    } catch (error) {
        console.error(`> ⚠️ ERROR sendCommand: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> sendCommand: ${error.message}`, setLogError)
    }
}

async function eraseTemplate_(Templatet_, Funilt_) {
    /*if (Client_NotReady) {
        displayOnConsole(`> ℹ️  ${Funilt_} not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let userConfirmation = confirm(`Tem certeza de que deseja apagar o Template_ ${Templatet_}?\nsera apagada para sempre.`)
        if (userConfirmation) {
            const status = document.querySelector('#status')

            const dir_Path = `Funil\\${Funil_}`
            const response = await axios.get('/functions/dir', { params: { dir_Path } })
            const Directories = response.data.dirs

            const response1 = await axios.delete('/template/erase', { params: { Templatet_, Funilt_ } })
            const Sucess = response1.data.sucess
            const Is_Empty = response1.data.empty
            const Is_Empty_Input = response1.data.empty_input
            const Not_Selected = response1.nselected
            if (Not_Selected) {
                status.innerHTML = `O Template_ <strong>${Templatet_}</strong> esta para ser <strong>apagado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Template_ <strong>selecionado</strong> é <strong>${Template_}</strong> então <strong>selecione</strong> <strong>${Templatet_}</strong> para poder <strong>apaga-lo</strong>!`
                displayOnConsole(`> ℹ️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>O Template_ <strong>${Templatet_}</strong> esta para ser <strong>apagado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Template_ <strong>selecionado</strong> é <strong>${Template_}</strong> então <strong>selecione</strong> <strong>${Templatet_}</strong> para poder <strong>apaga-lo</strong>!`)
                
                resetLoadingBar()
                
                //Client_NotReady = false

                return
            }
            if (Is_Empty) {
                status.innerHTML = `Dados de <strong>${Templatet_}</strong> esta <strong>vazio</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Dados de <strong>${Templatet_}</strong> esta <strong>vazio</strong>`)

                resetLoadingBar()
                
                //Client_NotReady = false
                
                return
            }
            if (Is_Empty_Input) {
                status.innerHTML = `Template_ <strong>${Templatet_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Template_ <strong>${Templatet_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`)

                resetLoadingBar()
                
                //Client_NotReady = false
                
                return  
            } 
            if (Sucess) {
                const divTemplatet_ = document.querySelector(`#${Templatet_}`)
                divTemplatet_.remove()
                
                status.innerHTML = `Template_ <strong>${Templatet_}</strong> foi <strong>Apagado</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Template_ <strong>${Templatet_}</strong> foi <strong>Apagado</strong>!`)

                await sleep(100)
                
                const dir_Path = `Funil\\${Funil_}`
                const response = await axios.get('/functions/dir', { params: { dir_Path } })
                const Directories2 = response.data.dirs
                
                //o codigo abaixo e possivel botar tudo numa rota e devolver o porArrayClient e se tiver vazio nada e reset e tals, modelo REST e tals (se for preciso)
                let divTemplateInner = document.querySelector('#divInnerTemplate')

                if (Directories2.length === 0) {
                    divTemplateInner.style.cssText =
                        'display: block; opacity: 0;'
                    setTimeout(function() {
                        divTemplateInner.style.cssText =
                            'display: none; opacity: 0;'
                    }, 300)

                    status.innerHTML = `<strong>Dir</strong> off Templates_ (<strong>${Directories.length}</strong>) is <strong>empty</strong>!`
                    displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Dir</strong> off Templates_ (<strong>${Directories.length}</strong>) is <strong>empty</strong>!`)
                } else {
                    const templateIdNumber = Number(Templatet_.split('_')[1])

                    let Counter_Templates_ = 0
                    let posArrayTemplateId = null
                    let posArrayTemplateName = null

                    if (Directories[templateIdNumber-2] === undefined) {
                        posArrayTemplateId = Directories[templateIdNumber].split('_')[1]
                        posArrayTemplateName = Directories[templateIdNumber].split('_')[2]
                    } else {
                        posArrayTemplateId = Directories[templateIdNumber-2].split('_')[1]
                        posArrayTemplateName = Directories[templateIdNumber-2].split('_')[2]
                    }

                    /*for (let i = 0; i < Directories.length; i++) {//deprecated not funil's same
                        const templateDirIdNumber = Number(Directories[Counter_Templates_].match(/_.*?_.*?_/)[0].match(/\d+/g))

                        if (templateIdNumber === templateDirIdNumber) {
                            posArrayTemplateId = Counter_Templates_

                            if (Directories[posArrayTemplateId+1] === undefined) {//esse erro arumando sla se arrumo mesmo ou se crio outro, se tiver esse mesmo pobema em outros sistemas iguais a esse so fazer isso sla... nhe
                                //posArrayTemplateId--
                                //posArrayTemplateName = Directories[posArrayTemplateId--].match(/_.*?_.*?_/)[0].split('_').slice(2, -1).join('_')
                                posArrayTemplateName = Directories[posArrayTemplateId].match(/_.*?_.*?_/)[0].split('_').slice(2, -1).join('_')
                            } else {
                                posArrayTemplateId++
                                posArrayTemplateName = Directories[posArrayTemplateId++].match(/_.*?_.*?_/)[0].split('_').slice(2, -1).join('_')
                            }
                        } else {
                            posArrayTemplateId = Number(Directories[Counter_Templates_].match(/_.*?_.*?_/)[0].match(/\d+/g))
                            posArrayTemplateName = Directories[Counter_Templates_].match(/_.*?_.*?_/)[0].split('_').slice(2, -1).join('_')
                            Counter_Templates_++
                        }
                    }*/

                    //displayOnConsole(`_${posArrayTemplateId}_${posArrayTemplateName}_`)
                    await selectTemplate_(`_${posArrayTemplateId}_${posArrayTemplateName}_`)
                }
            } else {
                status.innerHTML = `<i><strong>ERROR</strong></i> ao <strong>Apagar</strong> Template_ <strong>${Templatet_}</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao <strong>Apagar</strong> Template_ <strong>${Templatet_}</strong>!`)
            }
        } else {
            resetLoadingBar()
            //Client_NotReady = false
            return
        }

        resetLoadingBar()
        //Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR eraseTemplate_ ${Templatet_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> eraseTemplate_ <strong>${Templatet_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function selectTemplate_(Templatet_) {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const divTemplatet_ = document.querySelector(`#${Templatet_}`)
        const capList = document.querySelector(`caption`)

        const divTemplatet_Temp = document.querySelector(`#${Template_}`)
        if (divTemplatet_Temp !== null) {
            divTemplatet_Temp.style.cssText =
                'border-top: 5px solid var(--colorBlack); border-bottom: 5px solid var(--colorBlack); transition: var(--configTrasition03s);'
        }
        if (divTemplatet_ === null) {
            status.innerHTML = `Template_ <strong>${Templatet_}</strong> <strong>Não</strong> existe!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Template_ <strong>${Templatet_}</strong> <strong>Não</strong> existe!`)
            resetLoadingBar()

            //Funil_NotReady = false
            
            return
        }

        const response = await axios.post('/template/select', { Template_: Templatet_ })
        let Sucess = response.data.sucess
        if (Sucess) {
            divTemplatet_.style.cssText =
                'border-top: 5px solid var(--colorBlue); border-bottom: 5px solid var(--colorBlue); transition: var(--configTrasition03s);'

            //capList.innerHTML = `<stronger>${Templatet_}</stronger>`

            Template_ = Templatet_

            const abbrShowSelected = document.querySelector(`#iabbrshowselected-${Client_}`)
            const showSelectedFunil = document.querySelector(`#ishowSelectedFunil-${Client_}`)
            const showSelectedTemplate = document.querySelector(`#ishowSelectedTemplate-${Client_}`)

            if (showSelectedTemplate) {
                const Type_Selected = 4
                const response = await axios.get('/features/selecteds', { params: { Type_Selected, Client_ } }) 
                const F_Client_ = response.data.F_Client_
                const T_Client_ = response.data.T_Client_
                
                abbrShowSelected.title = `Selecionado - Funil: ${F_Client_} Template: ${T_Client_}`
                showSelectedFunil.textContent = `SF: ${F_Client_}`
                showSelectedTemplate.textContent = `ST: ${T_Client_}`
            }

            status.innerHTML = `Template_ <strong>${Templatet_}</strong> <strong>Selecionado</strong>`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Template_ <strong>${Templatet_}</strong> <strong>Selecionado</strong>.`)

            const titleTemplate = document.querySelector(`#SelectedTemplate`)
            titleTemplate.textContent = `${Templatet_}`

            const response1 = await axios.get('/template/status-erase-schedule', { Template_: Templatet_ })
            const eraseScheduleIs = response1.data.erasescheduleis
            const iabbrEraseSchedule = document.querySelector(`#iabbrScheduleErase`)
            const buttonEraseSchedule = document.querySelector(`#iOnOffScheduleErase`)

            const divDelayEraseSchedule = document.querySelector(`#idivDelayEraseSchedule`)
            const delayEraseScheduleSelect = document.querySelector(`#idelayEraseScheduleSelect`)
            const delayEraseScheduleTime = document.querySelector(`#idelayEraseScheduleTime`)
            if (eraseScheduleIs) {
                iabbrEraseSchedule.title = `Schedule Erase STATUS: on`
                buttonEraseSchedule.textContent = '-'
                buttonEraseSchedule.style.cssText =
                    `background-color: var(--colorGreen); color: var(--colorBlack); cursor: pointer;`

                const response = await axios.get('/template/delay-info-erase-schedule')
                const delayType = response.data.delaytype
                switch (delayType) {
                    case 'none':
                        delayEraseScheduleSelect.selectedIndex = 0
                        break;
                    case 'seconds':
                        delayEraseScheduleSelect.selectedIndex = 1
                        break;
                    case 'minutes':
                        delayEraseScheduleSelect.selectedIndex = 2
                        break;
                    case 'hours':
                        delayEraseScheduleSelect.selectedIndex = 3
                        break;
                    case 'days':
                        delayEraseScheduleSelect.selectedIndex = 4
                        break;
                }
                const delayData = response.data.delaydata
                delayEraseScheduleTime.value = delayData

                divDelayEraseSchedule.style.cssText =
                    'display: flex; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
                setTimeout(function() {
                    divDelayEraseSchedule.style.cssText =
                        'display: flex; height: 0vh; outline: 2px solid rgba(0, 0, 0, 0); border: 2px solid var(--colorBlack); padding: 5px 5px 10px 5px;'
                }, -1)
                setTimeout(function() {
                    divDelayEraseSchedule.style.cssText =
                        'display: flex; height: 6vh; outline: 2px solid rgba(0, 0, 0, 0); border: 2px solid var(--colorBlack); padding: 5px 5px 10px 5px;'
                }, 100)
            } else {
                iabbrEraseSchedule.title = `Schedule Erase STATUS: off`
                buttonEraseSchedule.textContent = 'o'
                buttonEraseSchedule.style.cssText =
                    `background-color: var(--colorRed); color: var(--colorBlack); cursor: pointer;`

                const response = await axios.get('/template/delay-info-erase-schedule')
                const delayType = response.data.delaytype
                switch (delayType) {
                    case 'none':
                        delayEraseScheduleSelect.selectedIndex = 0
                        break;
                    case 'seconds':
                        delayEraseScheduleSelect.selectedIndex = 1
                        break;
                    case 'minutes':
                        delayEraseScheduleSelect.selectedIndex = 2
                        break;
                    case 'hours':
                        delayEraseScheduleSelect.selectedIndex = 3
                        break;
                    case 'days':
                        delayEraseScheduleSelect.selectedIndex = 4
                        break;
                }
                const delayData = response.data.delaydata
                delayEraseScheduleTime.value = delayData

                divDelayEraseSchedule.style.cssText =
                    'display: flex; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
                setTimeout(function() {
                    divDelayEraseSchedule.style.cssText =
                        'display: none; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
                }, 300)
            }

            const response3 = await axios.get('/template/status-test-mode', { Template_: Templatet_ })
            const testModeIs = response3.data.testmodeis
            const ReceiveMSG = response3.data.receivemsg
            const iabbrTestMode = document.querySelector(`#iabbrTestMode`)
            const buttonTestMode = document.querySelector(`#iOnOffTestMode`)
            const iabbrTestModeRMSG = document.querySelector(`#iabbrTestModeRMSG`)
            const buttonTestModeRMSG = document.querySelector(`#iOnOffTestModeRMSG`)

            const divInputTestMode = document.querySelector(`#isendInputTestMode`)
            const inputTestMode = document.querySelector(`#iinputTestMode`)
            const sendTestMode = document.querySelector(`#isendSearchTestMode`)
            if (testModeIs) {
                iabbrTestMode.title = `Test Mode STATUS: on`
                buttonTestMode.textContent = '-'
                buttonTestMode.style.cssText =
                    `background-color: var(--colorGreen); color: var(--colorBlack); cursor: pointer;`

                const response = await axios.get('/template/contact-info-test-mode')
                const testContact = response.data.testcontact
                if (testContact > 0) {
                    inputTestMode.value = testContact
                }
                
                divInputTestMode.style.cssText =
                    'display: flex; height: 0; border-top: 3px solid var(--colorBlack);'
                setTimeout(function() {
                    divInputTestMode.style.cssText =
                        'display: flex; height: 37px; border-top: 3px solid var(--colorBlack);'
                }, -1)
                setTimeout(function() {
                    inputTestMode.style.cssText =
                        'display: inline; opacity: 0;'
                    sendTestMode.style.cssText =
                        'display: flex; opacity: 0;'
                        setTimeout(function() {
                            inputTestMode.style.cssText =
                                'display: inline; opacity: 1;'
                            sendTestMode.style.cssText =
                                'display: flex; opacity: 1;'
                        }, 100)
                }, 100)

                /*buttonTestModeRMSG.style.cssText =
                    'display: inline; opacity: 0;'
                setTimeout(function() {
                    buttonTestModeRMSG.style.cssText =
                        'display: inline; opacity: 1;'
                }, 100)*/
                buttonTestModeRMSG.style.display = 'inline'
                buttonTestModeRMSG.style.opacity = '0'
                setTimeout(function() {
                    buttonTestModeRMSG.style.display = 'inline'
                    buttonTestModeRMSG.style.opacity = '1'
                }, 100)
            } else {
                iabbrTestMode.title = `Test Mode STATUS: off`
                buttonTestMode.textContent = 'o'
                buttonTestMode.style.cssText =
                    `background-color: var(--colorRed); color: var(--colorBlack); cursor: pointer;`

                const response = await axios.get('/template/contact-info-test-mode')
                const testContact = response.data.testcontact
                if (testContact > 0) {
                    inputTestMode.value = testContact
                }

                inputTestMode.style.cssText =
                    'display: inline; opacity: 0;'
                sendTestMode.style.cssText =
                    'display: flex; opacity: 0;'
                setTimeout(function() {
                    inputTestMode.style.cssText =
                        'display: none; opacity: 0;'
                    sendTestMode.style.cssText =
                        'display: none; opacity: 0;'
                    divInputTestMode.style.cssText =
                        'display: flex; height: 0; border-top: 0px solid var(--colorBlack);'
                        setTimeout(function() {
                            divInputTestMode.style.cssText =
                                'display: none; height: 0; border-top: 0px solid var(--colorBlack);'
                        }, 300)
                }, 100)

                /*buttonTestModeRMSG.style.cssText =
                    'display: inline; opacity: 0;'
                setTimeout(function() {
                    buttonTestModeRMSG.style.cssText =
                        'display: none; opacity: 0;'
                }, 300)*/
                buttonTestModeRMSG.style.display = 'inline'
                buttonTestModeRMSG.style.opacity = '0'
                setTimeout(function() {
                    buttonTestModeRMSG.style.display = 'none'
                    buttonTestModeRMSG.style.opacity = '0'
                }, 300)
            }

            if (ReceiveMSG) {
                iabbrTestModeRMSG.title = `(TM) Receive STATUS: on`
                buttonTestModeRMSG.textContent = '-'
                buttonTestModeRMSG.style.cssText =
                    `background-color: var(--colorGreen); color: var(--colorBlack); cursor: pointer;`
            } else {
                iabbrTestModeRMSG.title = `(TM) Receive MSG STATUS: off`
                buttonTestModeRMSG.textContent = 'o'
                buttonTestModeRMSG.style.cssText =
                    `background-color: var(--colorRed); color: var(--colorBlack); cursor: pointer;`
            }
            
            const divsConteiner = document.querySelector('.conteinerFunilMSG')
            if (divsConteiner) {
                divsConteiner.style.cssText =
                    `display: flex; opacity: 0;`
                setTimeout(function() {
                    divsConteiner.style.cssText =
                        `display: none; opacity: 0;`

                    document.querySelector(`#funilArea`).innerHTML = ''

                    divsConteiner.style.cssText =
                        `display: flex; opacity: 0;`
                    setTimeout(function() {
                        divsConteiner.style.cssText =
                            `display: flex; opacity: 1;`
                    }, 300)
                }, 100)
            }
            await sleep(400)

            const response2 = await axios.get('/template/insert-front')
            let Sucess = response2.data.sucess
            let jsonTemplate = response2.data.jsontemplate
            if (Sucess) {
                const positions = jsonTemplate.filter(item => item.positionId)
                
                const divFunil = document.querySelector('#funilArea')
                
                //console.log(positions.length)
                for (let i = 0; i < positions.length; i++) {
                    const item = positions[i]
                    //console.log(`${i}: `, item)

                    switch (item.typeMSG) {
                        case 1:
                            const MSGHTMlDelay = `<div class="conteinerFunilMSG" id="conteinerFunilMSG${item.positionId}">

                                            <div class="divInfoPositionMSG" id="idivInfoPositionMSG${item.positionId}">
                                                <label title="Selecione esta posição (${item.positionId})" class="divSelectionPositionMSG">
                                                    <input type="checkbox" class="inputCheckboxSelectionMSG" id="iinputCheckboxSelectionMSG${item.positionId}" onchange="selectionPositionMSG(this, 1)">
                                                    <span class="checkSelectionMSG" id="icheckSelectionMSG"></span>
                                                </label>
                                                <h3 class="titlePositionMSG" id="ititlePositionMSG">Posicao MSG</h3>
                                                <p class="positionMSG" id="ipositionMSG">(${item.positionId})</p>

                                                <button title="Deletar posição MSG (${item.positionId})" class="erasePositionMSG" id="ierasePositionMSG" onclick="erasePosition(this.parentElement.parentElement, 1)">D</button>
                                            </div>

                                            <div class="divInnerConteinerFunilMSG" id="idivInnerConteinerFunilMSG">

                                                <div class="divDelayTypeMSG" id="idivDelayTypeMSG">
                                                    <abbr title="Determine um valor para o tempo de Delay"><span class="delayMSGTitle"><strong>ATRASO-MSG:</strong></span><label for="idelayMSGTime" class="delayMSGLabelTime">Tempo-<input type="number" class="delayMSGTime" id="idelayMSGTime" min="1" max="9999" step="1" oninput="delayLimitLength(this), sendToFunil(this, 1, 'input', null)" placeholder="00000"></label></abbr> 
                                                
                                                    <select title="Selecione um tipo de duração" class="delayMSGSelect" id="idelayMSGSelect" oninput="sendToFunil(this, 1, this, null)">
                                                        <option value="none" selected>Nenhum</option>
                                                        <option value="seconds">Segundos</option>
                                                        <option value="minutes">Minutos</option>
                                                        <option value="hours">Horas</option>
                                                        <option value="days">Dias</option>
                                                    </select>
                                                </div>

                                            </div>

                                        </div>`

                            divFunil.insertAdjacentHTML('beforeend', MSGHTMlDelay)

                            const selectDelayMSG = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#idelayMSGSelect`)
                            switch (item.delayType) {
                                case 'none':
                                    selectDelayMSG.selectedIndex = 0
                                    break;
                                case 'seconds':
                                    selectDelayMSG.selectedIndex = 1
                                    break;
                                case 'minutes':
                                    selectDelayMSG.selectedIndex = 2
                                    break;
                                case 'hours':
                                    selectDelayMSG.selectedIndex = 3
                                    break;
                                case 'days':
                                    selectDelayMSG.selectedIndex = 4
                                    break;
                            }

                            const inputDelayMSG = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#idelayMSGTime`)
                            inputDelayMSG.value = item.delayData
                            break;
                        case 2:
                            const MSGHTMlText = `<div class="conteinerFunilMSG" id="conteinerFunilMSG${item.positionId}">

                                        <div class="divInfoPositionMSG" id="idivInfoPositionMSG${item.positionId}">
                                            <label title="Selecione esta posição (${item.positionId})" class="divSelectionPositionMSG">
                                                <input type="checkbox" class="inputCheckboxSelectionMSG" id="iinputCheckboxSelectionMSG${item.positionId}" onchange="selectionPositionMSG(this, 2)">
                                                <span class="checkSelectionMSG" id="icheckSelectionMSG"></span>
                                            </label>
                                            <h3 class="titlePositionMSG" id="ititlePositionMSG">Posicao MSG</h3>
                                            <p class="positionMSG" id="ipositionMSG">(${item.positionId})</p>

                                            <button title="Deletar posição MSG (${item.positionId})" class="erasePositionMSG" id="ierasePositionMSG" onclick="erasePosition(this.parentElement.parentElement, 2)">D</button>
                                        </div>

                                        <div class="divInnerConteinerFunilMSG" id="idivInnerConteinerFunilMSG">

                                            <div class="divTextarea" id="idivTextarea">
                                                <div class="divTextareaFunctions" id="idivTextareaFunctions">
                                                    <abbr title="StateTyping STATUS: off" id="iabbrOnOffStateTypingMSG"><button class="functionsDivStart OnOffStateTypingMSG" id="iOnOffStateTypingMSG" onclick="StateTypingMSG(this, true)">O</button></abbr>
                                                    
                                                    <abbr title="Modo Claro/Escuro STATUS: escuro" id="iabbrOnOffLightDarkMSG"><button class="functionsDivStart OnOffLightDarkMSG" id="iOnOffLightDarkMSG" onclick="LightDarkMSG(this, true)">O</button></abbr>
                                                    <abbr title="Modo Cliente/Usuario STATUS: cliente" id="iabbrOnOffLightDarkColorMSG"><button class="functionsDivStart OnOffLightDarkColorMSG" id="iOnOffLightDarkColorMSG" onclick="LightDarkColorMSG(this, true)">O</button></abbr>
                                                    
                                                    <abbr title="Reset"><button class="functionsDivStart OnOffResetScreenSetupText" id="iOnOffResetScreenSetupText1" onclick="resetScreenSetup(this, true)">R</button></abbr>
                                                    <abbr title="VLock Tela STATUS: off" id="iabbrOnOffVLockScreenSetupText2"><button class="functionsDivStart OnOffVLockScreenSetupText" id="iOnOffVLockScreenSetupText2" onclick="VLockScreenSetup(this, true)">O</button></abbr>
                                                    <abbr title="PC Tela STATUS: off" id="iabbrOnOffDesktopScreenSetupText3"><button class="functionsDivStart OnOffDesktopScreenSetupText" id="iOnOffDesktopScreenSetupText3" onclick="desktopScreenSetup(this, true)">O</button></abbr>
                                                    <abbr title="Celular Tela STATUS: off" id="iabbrOnOffPhoneScreenSetupText4"><button class="functionsDivStart OnOffPhoneScreenSetupText" id="iOnOffPhoneScreenSetupText4" onclick="phoneScreenSetup(this, true)">O</button></abbr>
                                                </div>
                                            
                                                <div class="divDelayText" id="idivDelayText">
                                                    <abbr title="Determine um valor para o tempo de Delay"><span class="delayTextTitle"><strong>ATRASO-StateTyping:</strong></span><label for="idelayTextTime" class="delayTextLabelTime">Tempo-<input type="number" class="delayTextTime" id="idelayTextTime" min="1" max="9999" step="1" oninput="delayLimitLength(this), sendToFunil(this, 2, 'input', null)" placeholder="00000"></label></abbr> 
                                                    
                                                    <select title="Selecione um tipo de duração" class="delayTextSelect" id="idelayTextSelect" oninput="sendToFunil(this, 2, this, null)">
                                                        <option value="none" selected>Nenhum</option>
                                                        <option value="seconds">Segundos</option>
                                                        <option value="minutes">Minutos</option>
                                                        <option value="hours">Horas</option>
                                                        <option value="days">Dias</option>
                                                    </select>
                                                </div>
                                                
                                                <abbr title="Digite a MSG"><textarea class="textAreaTypeMSG" id="itextAreaTypeMSG" placeholder="TEXTO-MSG: >..." oninput="sendToFunil(this, 2, 'textarea', this)"></textarea></abbr>
                                            </div>

                                        </div>

                                    </div>`

                            divFunil.insertAdjacentHTML('beforeend', MSGHTMlText)

                            const selectDelayText = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#idelayTextSelect`)
                            switch (item.delayType) {
                                case 'none':
                                    selectDelayText.selectedIndex = 0
                                    break;
                                case 'seconds':
                                    selectDelayText.selectedIndex = 1
                                    break;
                                case 'minutes':
                                    selectDelayText.selectedIndex = 2
                                    break;
                                case 'hours':
                                    selectDelayText.selectedIndex = 3
                                    break;
                                case 'days':
                                    selectDelayText.selectedIndex = 4
                                    break;
                            }

                            const inputDelayText = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#idelayTextTime`)
                            inputDelayText.value = item.delayData
                            if (item.delayType !== 'none') {
                                await StateTypingMSG(document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#iOnOffStateTypingMSG`), true)
                            }

                            const textareaMSG = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#itextAreaTypeMSG`)
                            textareaMSG.value = item.textareaData
                            break;
                        case 3:
                            const MSGHTMlFile = `<div class="conteinerFunilMSG" id="conteinerFunilMSG${item.positionId}">

                                        <div class="divInfoPositionMSG" id="idivInfoPositionMSG${item.positionId}">
                                            <label title="Selecione esta posição (${item.positionId})" class="divSelectionPositionMSG">
                                                <input type="checkbox" class="inputCheckboxSelectionMSG" id="iinputCheckboxSelectionMSG${item.positionId}" onchange="selectionPositionMSG(this, 3)">
                                                <span class="checkSelectionMSG" id="icheckSelectionMSG"></span>
                                            </label>
                                            <h3 class="titlePositionMSG" id="ititlePositionMSG">Posicao MSG</h3>
                                            <p class="positionMSG" id="ipositionMSG">(${item.positionId})</p>

                                            <button title="Deletar posição MSG (${item.positionId})" class="erasePositionMSG" id="ierasePositionMSG" onclick="erasePosition(this.parentElement.parentElement, 3)">D</button>
                                        </div>

                                        <div class="divInnerConteinerFunilMSG" id="idivInnerConteinerFunilMSG">

                                            <div class="fileTypeMSG" id="ifileTypeMSG">
                                                <div class="divFileFunctions" id="idivFileFunctions">
                                                    <abbr title="StateTyping STATUS: off" id="iabbrOnOffStateTypingFile"><button class="functionsDivStart OnOffStateTypingFile" id="iOnOffStateTypingFile" onclick="StateTypingMSG(this, false)">O</button></abbr>
                                                    <abbr title="StateRecording STATUS: off" id="iabbrOnOffStateRecordingFile"><button class="functionsDivStart OnOffStateRecordingFile" id="iOnOffStateRecordingFile" onclick="StateRecordingMSG(this)">O</button></abbr>
                                                    <abbr title="Area de texto STATUS: off" id="iabbrOnOffCaption"><button class="functionsDivStart OnOffCaption" id="iOnOffCaption" onclick="CaptionFileMSG(this)">O</button></abbr>
                                                    
                                                    <abbr title="Modo Claro/Escuro STATUS: escuro" id="iabbrOnOffLightDarkCaption"><button class="functionsDivStart OnOffLightDarkCaption" id="iOnOffLightDarkCaption" onclick="LightDarkMSG(this, false)">O</button></abbr>
                                                    <abbr title="Modo Cliente/Usuario STATUS: cliente" id="iabbrOnOffLightDarkColorCaption"><button class="functionsDivStart OnOffLightDarkColorCaption" id="iOnOffLightDarkColorCaption" onclick="LightDarkColorMSG(this, false)">O</button></abbr>
                                                    
                                                    <abbr title="Reset"><button class="functionsDivStart OnOffResetScreenSetupCaption" id="iOnOffResetScreenSetupCaption1" onclick="resetScreenSetup(this, false)">R</button></abbr>
                                                    <abbr title="VLock Tela STATUS: off" id="iabbrOnOffVLockScreenSetupCaption2"><button class="functionsDivStart OnOffVLockScreenSetupCaption" id="iOnOffVLockScreenSetupCaption2" onclick="VLockScreenSetup(this, false)">O</button></abbr>
                                                    <abbr title="PC Tela STATUS: off" id="iabbrOnOffDesktopScreenSetupCaption3"><button class="functionsDivStart OnOffDesktopScreenSetupCaption" id="iOnOffDesktopScreenSetupCaption3" onclick="desktopScreenSetup(this, false)">O</button></abbr>
                                                    <abbr title="Celular Tela STATUS: off" id="iabbrOnOffPhoneScreenSetupCaption4"><button class="functionsDivStart OnOffPhoneScreenSetupCaption" id="iOnOffPhoneScreenSetupCaption4" onclick="phoneScreenSetup(this, false)">O</button></abbr>
                                                </div>
                                                
                                                <div class="divDelayTextAudio" id="idivDelayTextAudio">
                                                    <abbr title="Determine um valor para o tempo de Delay"><strong><span class="delayTextAudioTitle" id="idelayTextAudioTitle">ATRASO-State=Typing&Recording:</span></strong><label for="idelayTexAudioTime" class="delayTextAudioLabelTime">Tempo-<input type="number" class="delayTextAudioTime" id="idelayTexAudioTime" min="1" max="9999" step="1" oninput="delayLimitLength(this), sendToFunil(this, 3, 'input', null)" placeholder="00000"></label></abbr> 
                                                    
                                                    <select title="Selecione um tipo de duração" class="delayTextAudioSelect" id="idelayTextAudioSelect" oninput="sendToFunil(this, 3, this, null)">
                                                        <option value="none" selected>Nenhum</option>
                                                        <option value="seconds">Segundos</option>
                                                        <option value="minutes">Minutos</option>
                                                        <option value="hours">Horas</option>
                                                        <option value="days">Dias</option>
                                                    </select>
                                                </div>
                                                
                                                <div class="divFileSelectMSG">
                                                    <abbr title="Clique e selecione ou arraste um arquivo aqui para poder enviar"><div class="fileTypeSelectMSG" id="ifileTypeSelectMSG" ondragover="fileHandleDragEnter(event, this)" ondragleave="fileHandleDragLeave(event, this)" onmouseenter="fileHoverEnter(this)" onmouseleave="fileHoverLeave(this)" ondrop="fileTypeAction(event, false, this)" onclick="fileAuxAction(this)">
                                                        <p class="fileTitleTypeMSG"><strong>ARQUIVO-MSG</strong></p>
                                                        <p class="fileStatus"><span id="ifileStatus">Clique ou arraste um arquivo</span></p>
                                                        <p class="fileTypeSelected">(<span id="ifileTypeSelected">...</span>)</p>
                                                        <p class="fileNameSelected"><span id="ifileNameSelected">...</span></p>
                                                        
                                                        <input type="file" class="fileTypeMSGAux" id="ifileTypeMSGAux" placeholder="..." onchange="fileTypeAction(null, true, this.parentElement)">
                                                    </div></abbr>
                                                </div>

                                                <abbr title="Digite a legenda do (...)" id="iabbrtextAreaCaption"><textarea class="textAreaCaption" id="itextAreaCaption" placeholder="Legenda do (...): >..." oninput="sendToFunil(this, 3, 'textarea', this)"></textarea></abbr>
                                            </div>
                                            
                                        </div>

                                    </div>`

                            divFunil.insertAdjacentHTML('beforeend', MSGHTMlFile)

                            if (item.fileData.buffer.data) {
                                const byteArray = new Uint8Array(item.fileData.buffer.data)
                                const blob = new Blob([byteArray], { type: item.fileData.mimetype })
                        
                                const file = new File([blob], item.fileData.originalname, { type: item.fileData.mimetype })
                                const fileInput = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector('input#ifileTypeMSGAux[type="file"]')
                                const dataTransfer = new DataTransfer()
                                dataTransfer.items.add(file)
                                fileInput.files = dataTransfer.files
                                //console.log(fileInput.files[0])
                                fileInput.dispatchEvent(new Event('change'))
                            }

                            const selectDelayTextAudio = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#idelayTextAudioSelect`)
                            switch (item.delayType) {
                                case 'none':
                                    selectDelayTextAudio.selectedIndex = 0
                                    break;
                                case 'seconds':
                                    selectDelayTextAudio.selectedIndex = 1
                                    break;
                                case 'minutes':
                                    selectDelayTextAudio.selectedIndex = 2
                                    break;
                                case 'hours':
                                    selectDelayTextAudio.selectedIndex = 3
                                    break;
                                case 'days':
                                    selectDelayTextAudio.selectedIndex = 4
                                    break;
                            }

                            if (item.delayType !== 'none') {
                                if (item.fileType == 'audio') {
                                    const inputDelayTextAudio = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#idelayTexAudioTime`)
                                    inputDelayTextAudio.value = item.delayData
                                    await StateRecordingMSG(document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#iOnOffStateRecordingFile`))
                                } else if (item.fileType == 'text') {
                                    const inputDelayTextAudio = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#idelayTexAudioTime`)
                                    inputDelayTextAudio.value = item.delayData
                                    await StateTypingMSG(document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#iOnOffStateTypingFile`), false)
                                }
                            }
                            
                            if (item.textareaData.length !== 0) {
                                if (item.fileType == 'image' || item.fileType == 'video' || item.fileType == 'document') {
                                    const textareaFile = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#itextAreaCaption`)
                                    textareaFile.value = item.textareaData
                                    await CaptionFileMSG(document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#iOnOffCaption`))
                                }
                            }
                            break;
                        case 4:
                            const MSGHTMlRebate = `<div class="conteinerFunilMSG" id="conteinerFunilMSG${item.positionId}">

                                        <div class="divInfoPositionMSG" id="idivInfoPositionMSG${item.positionId}">
                                            <label title="Selecione esta posição (${item.positionId})" class="divSelectionPositionMSG">
                                                <input type="checkbox" class="inputCheckboxSelectionMSG" id="iinputCheckboxSelectionMSG${item.positionId}" onchange="selectionPositionMSG(this, 4)">
                                                <span class="checkSelectionMSG" id="icheckSelectionMSG"></span>
                                            </label>
                                            <h3 class="titlePositionMSG" id="ititlePositionMSG">Posicao MSG</h3>
                                            <p class="positionMSG" id="ipositionMSG">(${item.positionId})</p>

                                            <button title="Deletar posição MSG (${item.positionId})" class="erasePositionMSG" id="ierasePositionMSG" onclick="erasePosition(this.parentElement.parentElement, 4)">D</button>
                                        </div>

                                        <div class="divInnerConteinerFunilMSG" id="idivInnerConteinerFunilMSG">

                                            <div class="rebateTypeMSG" id="irebateTypeMSG">
                                                
                                                <div class="divRebateFunctions" id="idivRebateFunctions">
                                                    <abbr title="StateContinue STATUS: null" id="iabbrOnOffStateContinue"><button class="functionsDivStart OnOffStateContinue" id="iOnOffStateContinue" onclick="sendToFunil(this, 4, 'continue', this)">-O</button></abbr>
                                                </div>
                                                
                                                <div class="divDelayRebate" id="idivDelayRebate">

                                                    <abbr title="Determine um valor para o tempo de Delay do Timer"><span class="delayRebateTitle"><strong>TIMER-Rebate:</strong></span><label for="idelayRebateTime" class="delayRebateLabelTime">Tempo-<input type="number" class="delayRebateTime" id="idelayRebateTime" min="1" max="9999" step="1" oninput="delayLimitLength(this), sendToFunil(this, 4, 'input', null)" placeholder="00000"></label></abbr> 
                                                
                                                    <select title="Selecione um tipo de duração do Timer" class="delayRebateSelect" id="idelayRebateSelect" oninput="sendToFunil(this, 4, this, null)">
                                                        <option value="none">Nenhum</option>
                                                        <option value="seconds">Segundos</option>
                                                        <option value="minutes">Minutos</option>
                                                        <option value="hours">Horas</option>
                                                        <option value="days">Dias</option>
                                                    </select>

                                                    <select title="Selecione um Funil para o Rebate" class="funilRebateSelect" id="ifunilRebateSelect" oninput="sendToFunil(this, 4, 'rebateFunil', this)">
                                                        <option value="none" selected>Nenhum</option>

                                                    </select>

                                                    <select title="Selecione um Template para o Rebate" class="templateRebateSelect" id="itemplateRebateSelect" oninput="sendToFunil(this, 4, 'rebateTemplate', this)">
                                                        <option value="none" selected>Nenhum</option>

                                                    </select>
                                                </div>

                                            </div>
                                            
                                        </div>

                                    </div>`

                            divFunil.insertAdjacentHTML('beforeend', MSGHTMlRebate)

                            const buttonStateContinue = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#iOnOffStateContinue`)
                            const abbrButtonStateContinue = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#iabbrOnOffStateContinue`)
                            if (item.stateContinue) {
                                abbrButtonStateContinue.title = 'StateContinue STATUS: on'
                                buttonStateContinue.textContent = '-'
                                buttonStateContinue.style.cssText =
                                `background-color: var(--colorGreen); color: var(--colorBlack); cursor: pointer;`
                            } else {
                                abbrButtonStateContinue.title = 'StateContinue STATUS: off'
                                buttonStateContinue.textContent = 'o'
                                buttonStateContinue.style.cssText =
                                    `background-color: var(--colorRed); color: var(--colorBlack); cursor: pointer;`
                            }


                            const selectDelayRebate = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#idelayRebateSelect`)
                            switch (item.delayType) {
                                case 'none':
                                    selectDelayRebate.selectedIndex = 0
                                    break;
                                case 'seconds':
                                    selectDelayRebate.selectedIndex = 1
                                    break;
                                case 'minutes':
                                    selectDelayRebate.selectedIndex = 2
                                    break;
                                case 'hours':
                                    selectDelayRebate.selectedIndex = 3
                                    break;
                                case 'days':
                                    selectDelayRebate.selectedIndex = 4
                                    break;
                            }

                            const inputDelayRebate = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#idelayRebateTime`)
                            inputDelayRebate.value = item.delayData

                            const dir_Path = `Funil`
                            const response = await axios.get('/functions/dir', { params: { dir_Path } })
                            const Directories = response.data.dirs
                            //displayOnConsole(Directories)
                            let Funilts_ = []
                            for (let i = 0; i < Directories.length; i++) {
                                Funilts_.push(Directories[i])
                            }
                            //displayOnConsole(Funilts_)

                            const funilDelayRebate = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#ifunilRebateSelect`)

                            //templateDelayRebate.innerHTML = `<option value="none" selected>Nenhum</option>`;
                            
                            Funilts_.forEach(template => {
                                let option = document.createElement("option")
                                option.value = template 
                                option.textContent = template
                                funilDelayRebate.appendChild(option)
                            })

                            //displayOnConsole(item.funiltRebate)
                            funilDelayRebate.value = item.funiltRebate//

                            const templateDelayRebate = document.querySelector(`#conteinerFunilMSG${item.positionId}`).querySelector(`#itemplateRebateSelect`)
                            if (item.funiltRebate !== 'none') {
                                const dir_Path = `Funil\\${item.funiltRebate}`
                                //displayOnConsole(dir_Path)
                                const response = await axios.get('/functions/dir', { params: { dir_Path } })
                                const Directories = response.data.dirs
                                //displayOnConsole(Directories)
                                let Templatets_ = []
                                for (let i = 0; i < Directories.length; i++) {
                                    const match = Directories[i].match(/_(\d+_[^_]+)_/)
                                    Templatets_.push(match[0])
                                }
                                //displayOnConsole(Templatets_)
                                Templatets_.forEach(template => {
                                    let option = document.createElement("option")
                                    option.value = template 
                                    option.textContent = template
                                    templateDelayRebate.appendChild(option)
                                })
                                //displayOnConsole(item.templatetRebate)
                                templateDelayRebate.value = item.templatetRebate//assim e melhor que a porra do index ali em zima
                            } else {
                                templateDelayRebate.value = item.templatetRebate
                            }
                            break;
                    }

                    const divConteinerFunilMSG = document.querySelector(`#conteinerFunilMSG${item.positionId}`)
                    if (divConteinerFunilMSG) {
                        divConteinerFunilMSG.style.cssText =
                            `display: flex; opacity: 0;`
                        /*await sleep(300)
                        divConteinerFunilMSG.style.cssText =
                            `display: flex; opacity: 1;`*/
                        setTimeout(function() {
                            divConteinerFunilMSG.style.cssText =
                                `display: flex; opacity: 1;`
                        }, 300)
                    }
                }
            } else {

            }
            //resetLoadingBar()
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> <strong>selecionando</strong> Template_ <strong>${Templatet_}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <strong>selecionando</strong> Template_ <strong>${Templatet_}</strong>!`)
        }

        resetLoadingBar()
        //Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR selectTemplate_ ${Templatet_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> selectTemplate_ <strong>${Templatet_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}

async function setEraseSchedule() {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const buttonScheduleErase = document.querySelector(`#iOnOffScheduleErase`)
        const currentButtonEraseScheduleBackground_Color = buttonScheduleErase.style.backgroundColor
        let Sucess = null
        let eraseScheduleIs = null
        if (currentButtonEraseScheduleBackground_Color === 'var(--colorRed)') {
            eraseScheduleIs = true
            const response = await axios.put('/template/set-erase-schedule', { eraseScheduleIs })
            Sucess = response.data.sucess
        } else {
            eraseScheduleIs = false
            const response = await axios.put('/template/set-erase-schedule', { eraseScheduleIs })
            Sucess = response.data.sucess
        }
        if (Sucess) {
            const abbrScheduleErase = document.querySelector(`#iabbrScheduleErase`)

            const divDelayEraseSchedule = document.querySelector(`#idivDelayEraseSchedule`)
            if (currentButtonEraseScheduleBackground_Color === 'var(--colorRed)') {
                abbrScheduleErase.title = `Schedule Erase STATUS: on`
                buttonScheduleErase.textContent = '-'
                buttonScheduleErase.style.cssText =
                    `background-color: var(--colorGreen); color: var(--colorBlack); cursor: pointer;`
                
                divDelayEraseSchedule.style.cssText =
                    'display: flex; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
                setTimeout(function() {
                    divDelayEraseSchedule.style.cssText =
                        'display: flex; height: 0vh; outline: 2px solid rgba(0, 0, 0, 0); border: 2px solid var(--colorBlack); padding: 5px 5px 10px 5px;'
                }, -1)
                setTimeout(function() {
                    divDelayEraseSchedule.style.cssText =
                        'display: flex; height: 6vh; outline: 2px solid rgba(0, 0, 0, 0); border: 2px solid var(--colorBlack); padding: 5px 5px 10px 5px;'
                }, 100)
            } else {
                abbrScheduleErase.title = `Schedule Erase STATUS: off`
                buttonScheduleErase.textContent = 'o'
                buttonScheduleErase.style.cssText =
                    `background-color: var(--colorRed); color: var(--colorBlack); cursor: pointer;`

                divDelayEraseSchedule.style.cssText =
                    'display: flex; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
                setTimeout(function() {
                    divDelayEraseSchedule.style.cssText =
                        'display: none; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
                }, 300)
            }
            status.innerHTML = `<stronge>Definido</stronge> (<strong>${eraseScheduleIs}</strong>) apagamento agendado do Template_ <strong>${Template_}</strong>`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <stronge>Definido</stronge> (<strong>${eraseScheduleIs}</strong>) apagamento agendado do Template_ <strong>${Template_}</strong>.`)
            resetLoadingBar()
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> <strong>definindo</strong> (<strong>${eraseScheduleIs}</strong>) apagamendo agendado do Template_ <strong>${Template_}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <strong>definindo</strong> (<strong>${eraseScheduleIs}</strong>) apagamendo agendado do Template_ <strong>${Template_}</strong>!`)
            resetLoadingBar()
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR setEraseSchedule ${Template_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> setEraseSchedule <strong>${Template_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function sendToTemplateEraseSchedule(typeDelay) {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        const delayEraseScheduleSelect = document.querySelector(`#idelayEraseScheduleSelect`)
        const delayEraseScheduleTime = document.querySelector(`#idelayEraseScheduleTime`)
        let delayType = null
        let delayData = null
        switch (typeDelay) {
            case 'input':
                delayData = delayEraseScheduleTime.value
                await axios.put('/template/delay-update-erase-schedule', { typeDelay, delayType, delayData })
                if (delayEraseScheduleTime.value >= 1) {
                    if (delayEraseScheduleSelect.selectedIndex === 0) {
                        delayEraseScheduleSelect.selectedIndex = 1
                        delayEraseScheduleSelect.dispatchEvent(new Event('input'))
                    }
                } else {
                    if (delayEraseScheduleSelect.selectedIndex !== 0) {
                        delayEraseScheduleSelect.selectedIndex = 0
                        delayEraseScheduleSelect.dispatchEvent(new Event('input'))
                    }
                }       
                break;
            case 'select':
                delayType = delayEraseScheduleSelect.selectedIndex
                await axios.put('/template/delay-update-erase-schedule', { typeDelay, delayType, delayData })
                switch (delayEraseScheduleSelect.selectedIndex) {
                    case 1:
                        if (!delayEraseScheduleTime.value || delayEraseScheduleTime.value === 0) {
                            delayEraseScheduleTime.value = 1
                            delayEraseScheduleTime.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 2:
                        if (!delayEraseScheduleTime.value || delayEraseScheduleTime.value === 0) {
                            delayEraseScheduleTime.value = 1
                            delayEraseScheduleTime.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 3:
                        if (!delayEraseScheduleTime.value || delayEraseScheduleTime.value === 0) {
                            delayEraseScheduleTime.value = 1
                            delayEraseScheduleTime.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 4:
                        if (!delayEraseScheduleTime.value || delayEraseScheduleTime.value === 0) {
                            delayEraseScheduleTime.value = 1
                            delayEraseScheduleTime.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 0:
                        if (delayEraseScheduleTime.value !== '') {
                            delayEraseScheduleTime.value = ''
                            delayEraseScheduleTime.dispatchEvent(new Event('input'))
                        }
                        break;
                }
                break;
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR sendToTemplateEraseSchedule ${Template_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> sendToTemplateEraseSchedule <strong>${Template_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
    }
}

async function setTestMode() {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const buttonTestMode = document.querySelector(`#iOnOffTestMode`)
        const currentButtonTestModeBackground_Color = buttonTestMode.style.backgroundColor
        let Sucess = null
        let testModeIs = null
        if (currentButtonTestModeBackground_Color === 'var(--colorRed)') {
            testModeIs = true
            const response = await axios.put('/template/set-test-mode', { testModeIs })
            Sucess = response.data.sucess
        } else {
            testModeIs = false
            const response = await axios.put('/template/set-test-mode', { testModeIs })
            Sucess = response.data.sucess
        }
        if (Sucess) {
            const abbrTestMode = document.querySelector(`#iabbrTestMode`)
            const buttonTestModeRMSG = document.querySelector(`#iOnOffTestModeRMSG`)

            const divInputTestMode = document.querySelector(`#isendInputTestMode`)
            const inputTestMode = document.querySelector(`#iinputTestMode`)
            const sendTestMode = document.querySelector(`#isendSearchTestMode`)
            if (currentButtonTestModeBackground_Color === 'var(--colorRed)') {
                abbrTestMode.title = `Test Mode STATUS: on`
                buttonTestMode.textContent = '-'
                buttonTestMode.style.cssText =
                    `background-color: var(--colorGreen); color: var(--colorBlack); cursor: pointer;`
                
                divInputTestMode.style.cssText =
                    'display: flex; height: 0px; border-top: 3px solid var(--colorBlack);'
                setTimeout(function() {
                    divInputTestMode.style.cssText =
                        'display: flex; height: 37px; border-top: 3px solid var(--colorBlack);'
                }, -1)
                setTimeout(function() {
                    inputTestMode.style.cssText =
                        'display: inline; opacity: 0;'
                    sendTestMode.style.cssText =
                        'display: flex; opacity: 0;'
                        setTimeout(function() {
                            inputTestMode.style.cssText =
                                'display: inline; opacity: 1;'
                            sendTestMode.style.cssText =
                                'display: flex; opacity: 1;'
                        }, 100)
                }, 100)

                /*buttonTestModeRMSG.style.cssText =
                    'display: inline; opacity: 0;'
                setTimeout(function() {
                    buttonTestModeRMSG.style.cssText =
                        'display: inline; opacity: 1;'
                }, 100)*/
                buttonTestModeRMSG.style.display = 'inline'
                buttonTestModeRMSG.style.opacity = '0'
                setTimeout(function() {
                    buttonTestModeRMSG.style.display = 'inline'
                    buttonTestModeRMSG.style.opacity = '1'
                }, 100)
            } else {
                abbrTestMode.title = `Test Mode STATUS: off`
                buttonTestMode.textContent = 'o'
                buttonTestMode.style.cssText =
                    `background-color: var(--colorRed); color: var(--colorBlack); cursor: pointer;`

                inputTestMode.style.cssText =
                    'display: inline; opacity: 0;'
                sendTestMode.style.cssText =
                    'display: flex; opacity: 0;'
                setTimeout(function() {
                    inputTestMode.style.cssText =
                        'display: none; opacity: 0;'
                    sendTestMode.style.cssText =
                        'display: none; opacity: 0;'
                    divInputTestMode.style.cssText =
                        'display: flex; height: 0px; border-top: 0px solid var(--colorBlack);'
                        setTimeout(function() {
                            divInputTestMode.style.cssText =
                                'display: none; height: 0px; border-top: 0px solid var(--colorBlack);'
                        }, 300)
                }, 100)

                /*buttonTestModeRMSG.style.cssText =
                    'display: inline; opacity: 0;'
                setTimeout(function() {
                    buttonTestModeRMSG.style.cssText =
                        'display: none; opacity: 0;'
                }, 300)*/
                buttonTestModeRMSG.style.display = 'inline'
                buttonTestModeRMSG.style.opacity = '0'
                setTimeout(function() {
                    buttonTestModeRMSG.style.display = 'none'
                    buttonTestModeRMSG.style.opacity = '0'
                }, 300)
            }
            status.innerHTML = `<stronge>Definido</stronge> (<strong>${testModeIs}</strong>) teste mode do Template_ <strong>${Template_}</strong>`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <stronge>Definido</stronge> (<strong>${testModeIs}</strong>) teste mode do Template_ <strong>${Template_}</strong>.`)
            resetLoadingBar()
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> <strong>definindo</strong> (<strong>${testModeIs}</strong>) teste mode do Template_ <strong>${Template_}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <strong>definindo</strong> (<strong>${testModeIs}</strong>) teste mode do Template_ <strong>${Template_}</strong>!`)
            resetLoadingBar()
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR setTestMode ${Template_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> setTestMode <strong>${Template_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function setReceiveMSG() {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const buttonTestModeRMSG = document.querySelector(`#iOnOffTestModeRMSG`)
        const currentButtonTestModeRMSGBackground_Color = buttonTestModeRMSG.style.backgroundColor
        let Sucess = null
        let ReceiveMSG = null
        if (currentButtonTestModeRMSGBackground_Color === 'var(--colorRed)') {
            ReceiveMSG = true
            const response = await axios.put('/template/set-test-mode-receivemsg', { ReceiveMSG })
            Sucess = response.data.sucess
        } else {
            ReceiveMSG = false
            const response = await axios.put('/template/set-test-mode-receivemsg', { ReceiveMSG })
            Sucess = response.data.sucess
        }
        if (Sucess) {
            const iabbrTestModeRMSG = document.querySelector(`#iabbrTestModeRMSG`)
            if (currentButtonTestModeRMSGBackground_Color === 'var(--colorRed)') {
                iabbrTestModeRMSG.title = `(TM) Receive STATUS: on`
                buttonTestModeRMSG.textContent = '-'
                buttonTestModeRMSG.style.cssText =
                    `background-color: var(--colorGreen); color: var(--colorBlack); cursor: pointer; display: inline; opacity: 1;`
            } else {
                iabbrTestModeRMSG.title = `(TM) Receive MSG STATUS: off`
                buttonTestModeRMSG.textContent = 'o'
                buttonTestModeRMSG.style.cssText =
                    `background-color: var(--colorRed); color: var(--colorBlack); cursor: pointer; display: inline; opacity: 1;`
            }
            status.innerHTML = `<stronge>Definido</stronge> (<strong>${ReceiveMSG}</strong>) receber MSG do Template_ <strong>${Template_}</strong>`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <stronge>Definido</stronge> (<strong>${ReceiveMSG}</strong>) receber MSG do Template_ <strong>${Template_}</strong>.`)
            resetLoadingBar()
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> <strong>definindo</strong> (<strong>${ReceiveMSG}</strong>) receber MSG do Template_ <strong>${Template_}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <strong>definindo</strong> (<strong>${ReceiveMSG}</strong>) receber MSG do Template_ <strong>${Template_}</strong>!`)
            resetLoadingBar()
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR setReceiveMSG ${Template_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> setReceiveMSG <strong>${Template_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function sendToTemplateTestMode() {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        const inputTestMode = document.querySelector(`#iinputTestMode`)
        testContact = inputTestMode.value
        await axios.put('/template/contact-update-test-mode', { testContact })
    } catch (error) {
        console.error(`> ⚠️ ERROR sendToTemplateTestMode ${Template_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> sendToTemplateTestMode <strong>${Template_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
    }
}
async function initiateTestMode() {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        await axios.post('/template/initiate-test-mode')
    } catch (error) {
        console.error(`> ⚠️ ERROR initiateTestMode ${Template_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> sendToTemplateTestMode <strong>${Template_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
    }
}

async function insertTemplate_Front(Templatet_, Funilt_, isNew) {
    /*if (!Client_NotReady) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = false

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const TemplatesDiv = document.querySelector('#Templates_')
        const allConteinerTemplates_ = TemplatesDiv.querySelectorAll('.divTemplates_')
        let arrayIdNameTemplates_ = []
        allConteinerTemplates_.forEach((divElement) => {
            const Template_Id = divElement.id.split('_')[1]
            const Template_Name = divElement.id.split('_')[2]
            arrayIdNameTemplates_.push({ Template_Id, Template_Name })
        })
        let idNumberTemplate_DivAdjacent = null
        let isFirstUndefined = null
        if (arrayIdNameTemplates_.length > 0) {
            const response = await axios.get('/template/insert_exponecial_position_Template_', { params: { arrayIdNameTemplates_, isNew } })
            idNumberTemplate_DivAdjacent = response.data.idnumbertemplate_divadjacent
            isFirstUndefined = response.data.isfirstundefined
        }
    
        const divAdjacent = document.querySelector(`#${idNumberTemplate_DivAdjacent}`)

        const templateHTMlDestroy = `\n<div class="divTemplates_" id="${Templatet_}">\n<abbr title="Template_ ${Templatet_}" id="abbrselect-${Templatet_}"><button class="Templates_" id="select-${Templatet_}" onclick="selectTemplate_('${Templatet_}')">${Templatet_}</button></abbr><abbr title="Renomear ${Templatet_}" id="abbrRename-${Templatet_}"><button class="Templates_Rename" id="Rename-${Templatet_}" onclick="RenameTemplate_('${Templatet_}')"><</button></abbr><abbr title="Apagar ${Templatet_}" id="abbrerase-${Templatet_}"><button class="Templates_Erase" id="erase-${Templatet_}" onclick="eraseTemplate_('${Templatet_}', '${Funilt_}')"><</button></abbr>\n</div>\n`
        if (divAdjacent) {
            if (isFirstUndefined) {
                divAdjacent.insertAdjacentHTML('beforebegin', templateHTMlDestroy)
            } else {
                divAdjacent.insertAdjacentHTML('afterend', templateHTMlDestroy)
            }
        } else {
            TemplatesDiv.innerHTML += templateHTMlDestroy
        }

        const divTemplatet_ = document.querySelector(`#${Templatet_}`)
        divTemplatet_.style.cssText =
            'border-top: 5px solid var(--colorBlack); border-bottom: 5px solid var(--colorBlack); transition: var(--configTrasition03s);'

        //console.log(document.documentElement.outerHTML)
        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR insertTemplate_Front ${Templatet_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> insertTemplate_Front <strong>${Templatet_}</strong>: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
async function newTemplates() {
    /*if (isStartedNew) {
        displayOnConsole('> ℹ️ <strong>newClients</strong> not Ready.', setLogError)
        return
    }*/
    try {
        //isStartedNew = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let userConfirmation = confirm('Tem certeza de que deseja criar um novo Template_?')
        if (!userConfirmation) {
            resetLoadingBar()

            //isStartedNew = false

            return
        }
        let divTemplateInner = document.querySelector('#divInnerTemplate')

        //isFromNew = true

        const response = await axios.post('/template/new')
        const Sucess = response.data.sucess
        const Template_ = response.data.Templatet_
        if (Sucess) {
            await insertTemplate_Front(Template_, Funil_, true)
            //await selectTemplate_(Template_)

            divTemplateInner.style.cssText =
                'display: block; opacity: 0;'
            setTimeout(function() {
                divTemplateInner.style.cssText =
                    'display: block; opacity: 1;'
            }, 100)

            resetLoadingBar()
        } else {


            resetLoadingBar()
            return
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR newTemplates: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> newTemplates: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
let externalPromiseResolve3
let Namet_3 = null
async function setTemplateName(isInitiated) {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const divInputTemplateName = document.querySelector(`#isendInputTemplateName`)
        const inputTemplateName = document.querySelector(`#iinputTemplateName`)
        const sendTemplateName = document.querySelector(`#isendSearchTemplateName`)
        if (isInitiated) {
            divInputTemplateName.style.cssText =
                'display: flex; height: 0px; solid var(--colorBlack);'
            setTimeout(function() {
                divInputTemplateName.style.cssText =
                    'display: flex; height: 37px; solid var(--colorBlack);'
            }, -1)
            setTimeout(function() {
                inputTemplateName.style.cssText =
                    'display: inline; opacity: 0;'
                sendTemplateName.style.cssText =
                    'display: flex; opacity: 0;'
                    setTimeout(function() {
                        inputTemplateName.style.cssText =
                            'display: inline; opacity: 1;'
                        sendTemplateName.style.cssText =
                            'display: flex; opacity: 1;'
                    }, 100)
            }, 100)
            await sleep(100)
            inputTemplateName.focus()
            const promise = new Promise((resolve, reject) => {
                externalPromiseResolve3 = resolve
            })
            status.innerHTML = `Digite um <strong>nome</strong> para a <strong>instancia</strong> Template_`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Digite um <strong>nome</strong> para a <strong>instancia</strong> Template_.`)
            document.title = `Digite um nome...`
            resetLoadingBar()
            await promise
            let barL = document.querySelector('#barLoading')
            barL.style.cssText =
                'width: 100vw; visibility: visible;'
            status.innerHTML = `Nome <strong>${Namet_3}</strong> <strong>aceito</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Nome <strong>${Namet_3}</strong> <strong>aceito</strong>!`)
            inputTemplateName.value = ''
            return Namet_3
        } else {
            if (inputTemplateName.value.includes('_') || /\d/.test(inputTemplateName.value)) {
                status.innerHTML = `<i><strong>ERROR</strong></i> Caracteres <strong>'_'</strong> ou numeros <strong>não</strong> são aceitos!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> Caracteres <strong>'_'</strong> ou numeros <strong>não</strong> são aceitos!`)
                resetLoadingBar()
                return
            } else if (inputTemplateName.value.length === 0) {
                Namet_3 = 'Template'
                inputTemplateName.style.cssText =
                    'display: inline; opacity: 0;'
                sendTemplateName.style.cssText =
                    'display: flex; opacity: 0;'
                setTimeout(function() {
                    inputTemplateName.style.cssText =
                        'display: none; opacity: 0;'
                    sendTemplateName.style.cssText =
                        'display: none; opacity: 0;'
                    divInputTemplateName.style.cssText =
                        'display: flex; height: 0px; solid var(--colorBlack);'
                        setTimeout(function() {
                            divInputTemplateName.style.cssText =
                                'display: none; height: 0px; solid var(--colorBlack);'
                        }, 300)
                }, 100)
                if (externalPromiseResolve3) {
                    externalPromiseResolve3()
                }
                resetLoadingBar()
            } else {
                Namet_3 = inputTemplateName.value
                inputTemplateName.style.cssText =
                    'display: inline; opacity: 0;'
                sendTemplateName.style.cssText =
                    'display: flex; opacity: 0;'
                setTimeout(function() {
                    inputTemplateName.style.cssText =
                        'display: none; opacity: 0;'
                    sendTemplateName.style.cssText =
                        'display: none; opacity: 0;'
                    divInputTemplateName.style.cssText =
                        'display: flex; height: 0px; solid var(--colorBlack);'
                        setTimeout(function() {
                            divInputTemplateName.style.cssText =
                                'display: none; height: 0px; solid var(--colorBlack);'
                        }, 300)
                }, 100)
                if (externalPromiseResolve3) {
                    externalPromiseResolve3()
                }
                resetLoadingBar()
            }
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR setTemplateName: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> setTemplateName: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function RenameTemplate_(Templatet_) {
    /*if (Client_NotReady) {
        displayOnConsole(`> ℹ️  ${Clientt_} not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const response = await axios.put('/template/rename-template-name', { Templatet_ })
        const Sucess = response.data.sucess
        const templatet_ = response.data.Templatet_

        if (Sucess) {
            const divTemplates_ = document.querySelector('#Templates_')
            divTemplates_.innerHTML = ''

            const newTemplateDiv = document.querySelector('#divNewTemplate')
            newTemplateDiv.style.cssText = 'display: flex; opacity: 0;' 
            setTimeout(() => newTemplateDiv.style.cssText = 'display: flex; opacity: 1;', 100)
            //o codigo abaixo e possivel botar tudo numa rota e devolver e fazer oq fas aqui que nsei como explica certinho, modelo REST e tals (se for preciso)

            const dir_Path = `Funil\\${Funil_}`
            const response = await axios.get('/functions/dir', { params: { dir_Path } })
            const Directories_ = response.data.dirs
            
            if (Directories_.length-1 === -1) {
                displayOnConsole(`> ⚠️ <strong>Dir</strong> Templates_ (<strong>${Directories_.length}</strong>) is <strong>empty</strong>.`)
            } else {
                displayOnConsole(`> ℹ️  <strong>Dir</strong> Templates_ has (<strong>${Directories_.length}</strong>) loading <strong>ALL</strong>...`)
                
                let divTemplateInner = document.querySelector('#divInnerTemplate')

                let Counter_ = 1
                for (let i = 1; i <= Directories_.length; i++) {
                    const match = Directories_[Counter_-1].match(/=(.+)\.json/)
                    const Templatet_ = match ? match[1] : null
                    await insertTemplate_Front(Templatet_, Funil_, false)
                    //await selectTemplate_(Templatet_)

                    divTemplateInner.style.cssText =
                        'display: block; opacity: 0;'
                    setTimeout(function() {
                        divTemplateInner.style.cssText =
                            'display: block; opacity: 1;'
                    }, 100)
                    
                    Counter_++
                }
                displayOnConsole(`> ✅ <strong>Dir</strong> Templates_ loaded <strong>ALL</strong> (<strong>${Directories_.length}</strong>).`)
            }

            await selectTemplate_(templatet_)
            resetLoadingBar()
        } else {
            
            resetLoadingBar()
        }

        //Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR RenameTemplate_ ${Templatet_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> RenameTemplate_ <strong>${Templatet_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}

async function eraseFunil_(Funilt_) {
    /*if (Client_NotReady) {
        displayOnConsole(`> ℹ️  ${Funilt_} not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let userConfirmation = confirm(`Tem certeza de que deseja apagar o Funil_ ${Funilt_}?\nsera apagada para sempre.`)
        if (userConfirmation) {
            const status = document.querySelector('#status')

            const dir_Path = 'Funil'
            const response = await axios.get('/functions/dir', { params: { dir_Path } })
            const Directories = response.data.dirs

            const response1 = await axios.delete('/funil/erase', { params: { Funilt_ } })
            const Sucess = response1.data.sucess
            const Is_Empty = response1.data.empty
            const Is_Empty_Input = response1.data.empty_input
            const Not_Selected = response1.nselected
            if (Not_Selected) {
                status.innerHTML = `O Funil_ <strong>${Funilt_}</strong> esta para ser <strong>apagado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Funil_ <strong>selecionado</strong> é <strong>${Funil_}</strong> então <strong>selecione</strong> <strong>${Funilt_}</strong> para poder <strong>apaga-lo</strong>!`
                displayOnConsole(`> ℹ️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>O Funil_ <strong>${Funilt_}</strong> esta para ser <strong>apagado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Funil_ <strong>selecionado</strong> é <strong>${Funil_}</strong> então <strong>selecione</strong> <strong>${Funilt_}</strong> para poder <strong>apaga-lo</strong>!`)
                
                resetLoadingBar()
                
                //Client_NotReady = false

                return
            }
            if (Is_Empty) {
                status.innerHTML = `Dados de <strong>${Funilt_}</strong> esta <strong>vazio</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Dados de <strong>${Funilt_}</strong> esta <strong>vazio</strong>`)

                resetLoadingBar()
                
                //Client_NotReady = false
                
                return
            }
            if (Is_Empty_Input) {
                status.innerHTML = `Funil_ <strong>${Funilt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Funil_ <strong>${Funilt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`)

                resetLoadingBar()
                
                //Client_NotReady = false
                
                return  
            } 
            if (Sucess) {
                const divFunilt_ = document.querySelector(`#${Funilt_}`)
                divFunilt_.remove()
                
                status.innerHTML = `Funil_ <strong>${Funilt_}</strong> foi <strong>Apagado</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Funil_ <strong>${Funilt_}</strong> foi <strong>Apagado</strong>!`)

                const dir_Path = 'Funil'
                const response = await axios.get('/functions/dir', { params: { dir_Path } })
                const Directories2 = response.data.dirs

                //o codigo abaixo e possivel botar tudo numa rota e devolver o porArrayClient e se tiver vazio nada e reset e tals, modelo REST e tals (se for preciso)
                let divTemplateFunctions = document.querySelector('#divNewTemplate')

                if (Directories2.length === 0) {
                    divTemplateFunctions.style.cssText =
                        'display: flex; opacity: 0;'
                    setTimeout(function() {
                        divTemplateFunctions.style.cssText =
                            'display: none; opacity: 0;'
                    }, 300)

                    status.innerHTML = `<strong>Dir</strong> off Funils_ (<strong>${Directories.length}</strong>) is <strong>empty</strong>!`
                    displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Dir</strong> off Funils_ (<strong>${Directories.length}</strong>) is <strong>empty</strong>!`)
                } else {//esse sistemas de seleciona outro apos apagar ou algo do tipo esse aqui pode ser o melhor de todos pq pelo jeito tem uns 3 4 diferentes alguns com o mesmo codigo pra jeito diferetne e isso aconteceu pq n foi planejado mas quando resfase tudo ent fazer certinho//
                    const funilIdNumber = Number(Funilt_.split('_')[1])
                    
                    let Counter_Funils_ = 0
                    let posArrayFunilId = null
                    let posArrayFunilName = null
                    
                    if (Directories[funilIdNumber-2] === undefined) {
                        posArrayFunilId = Directories[funilIdNumber].split('_')[1]
                        posArrayFunilName = Directories[funilIdNumber].split('_')[2]
                    } else {
                        posArrayFunilId = Directories[funilIdNumber-2].split('_')[1]
                        posArrayFunilName = Directories[funilIdNumber-2].split('_')[2]
                    }

                    /*for (let i = 0; i < Directories.length; i++) {
                        const funilDirIdNumber = Number(Directories[Counter_Funils_].split('_')[1])

                        if (funilIdNumber === funilDirIdNumber) {
                            posArrayFunilId = Counter_Funils_+1

                            if (Directories[posArrayFunilId] === undefined) {
                                posArrayFunilId-1
                                posArrayFunilName = Directories[posArrayFunilId-1].split('_')[2]
                            } else {
                                posArrayFunilId+1
                                posArrayFunilName = Directories[posArrayFunilId+1].split('_')[2]
                            }
                        } else {
                            posArrayFunilId = Directories[Counter_Funils_].split('_')[1]
                            posArrayFunilName = Directories[Counter_Funils_].split('_')[2]
                            Counter_Funils_+1
                        }
                    }*/

                    //displayOnConsole(`_${posArrayFunilId}_${posArrayFunilName}_`)
                    await selectFunil_(`_${posArrayFunilId}_${posArrayFunilName}_`, true)
                }
            } else {
                status.innerHTML = `<i><strong>ERROR</strong></i> ao <strong>Apagar</strong> Funil_ <strong>${Funilt_}</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao <strong>Apagar</strong> Funil_ <strong>${Funilt_}</strong>!`)
            }
        } else {
            resetLoadingBar()
            //Client_NotReady = false
            return
        }

        resetLoadingBar()
        //Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR eraseFunil_ ${Funilt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> eraseFunil_ <strong>${Funilt_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function selectFunil_(Funilt_, isFromButton) {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const divFunilt_ = document.querySelector(`#${Funilt_}`)
        const capList = document.querySelector(`caption`)

        const divFunilt_Temp = document.querySelector(`#${Funil_}`)
        if (divFunilt_Temp !== null) {
            divFunilt_Temp.style.cssText =
                'border-top: 5px solid var(--colorBlack); border-bottom: 5px solid var(--colorBlack); transition: var(--configTrasition03s);'
        }
        if (divFunilt_ === null) {
            status.innerHTML = `Funil_ <strong>${Funilt_}</strong> <strong>Não</strong> existe!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Funil_ <strong>${Funilt_}</strong> <strong>Não</strong> existe!`)
            resetLoadingBar()

            //Funil_NotReady = false
            
            return
        }

        const response = await axios.post('/funil/select', { Funil_: Funilt_ })
        let Sucess = response.data.sucess
        if (Sucess) {
            divFunilt_.style.cssText =
                'border-top: 5px solid var(--colorBlue); border-bottom: 5px solid var(--colorBlue); transition: var(--configTrasition03s);'

            //capList.innerHTML = `<stronger>${Funilt_}</stronger>`
            
            Funil_ = Funilt_

            const abbrShowSelected = document.querySelector(`#iabbrshowselected-${Client_}`)
            const showSelectedFunil = document.querySelector(`#ishowSelectedFunil-${Client_}`)
            const showSelectedTemplate = document.querySelector(`#ishowSelectedTemplate-${Client_}`)

            if (showSelectedFunil) {   
                const Type_Selected = 4
                const response = await axios.get('/features/selecteds', { params: { Type_Selected, Client_ } }) 
                const F_Client_ = response.data.F_Client_
                const T_Client_ = response.data.T_Client_

                abbrShowSelected.title = `Selecionado - Funil: ${F_Client_} Template: ${T_Client_}`
                showSelectedFunil.textContent = `SF: ${F_Client_}`
                showSelectedTemplate.textContent = `ST: ${T_Client_}`
            }

            status.innerHTML = `Funil_ <strong>${Funilt_}</strong> <strong>Selecionado</strong>`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Funil_ <strong>${Funilt_}</strong> <strong>Selecionado</strong>.`)

            const titleFunil = document.querySelector(`#SelectedFunil`)
            titleFunil.textContent = `${Funilt_}`

            if (isFromButton) {
                document.querySelector('#Templates_').innerHTML = ''
                let dir_Path = `Funil\\${Funil_}`
                const response4 = await axios.get('/functions/dir', { params: { dir_Path } })
                let Directories_ = response4.data.dirs
                let divTemplateInner = document.querySelector('#divInnerTemplate')
                if (Directories_.length-1 === -1) {
                    document.querySelector(`#funilArea`).innerHTML = ''

                    divTemplateInner.style.cssText =
                        'display: block; opacity: 0;'
                    setTimeout(function() {
                        divTemplateInner.style.cssText =
                            'display: none; opacity: 0;'
                    }, 300)
                } else {
                    let Counter_Templates_ = 1
                    for (let i = 1; i <= Directories_.length; i++) {
                        const match = Directories_[Counter_Templates_-1].match(/=(.+)\.json/)
                        const Templatet_ = match ? match[1] : null
                        await insertTemplate_Front(Templatet_, Funil_, false)
                        //await selectTemplate_(Templatet_)

                        divTemplateInner.style.cssText =
                            'display: block; opacity: 0;'
                        setTimeout(function() {
                            divTemplateInner.style.cssText =
                                'display: block; opacity: 1;'
                        }, 100)
                        
                        Counter_Templates_++
                    }
                }
            }
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> <strong>selecionando</strong> Funil_ <strong>${Funilt_}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <strong>selecionando</strong> Funil_ <strong>${Funilt_}</strong>!`)
        }

        resetLoadingBar()
        //Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR selectFunil_ ${Funilt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> selectFunil_ <strong>${Funilt_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function insertFunil_Front(Funilt_, isNew) {// ta tendo alguma coisa que se n tem a primeira posicao numero 1 ele ta revertendo de crecente pra decrecente ent inves de ficar 2 3 4 ele fica 4 3 2, ent resolver isso
    /*if (!Client_NotReady) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = false

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const FunilsDiv = document.querySelector('#Funils_')
        const allConteinerFunils_ = FunilsDiv.querySelectorAll('.divFunils_')
        let arrayIdNameFunils_ = []
        allConteinerFunils_.forEach((divElement) => {
            const Funil_Id = divElement.id.split('_')[1]
            const Funil_Name = divElement.id.split('_')[2]
            arrayIdNameFunils_.push({ Funil_Id, Funil_Name })
        })
        let idNumberFunil_DivAdjacent = null
        let isFirstUndefined = null
        if (arrayIdNameFunils_.length > 0) {
            const response = await axios.get('/funil/insert_exponecial_position_Funil_', { params: { arrayIdNameFunils_, isNew } })
            idNumberFunil_DivAdjacent = response.data.idnumberfunil_divadjacent
            isFirstUndefined = response.data.isfirstundefined
        }
    
        const divAdjacent = document.querySelector(`#${idNumberFunil_DivAdjacent}`)

        const funilHTMlDestroy = `\n<div class="divFunils_" id="${Funilt_}">\n<abbr title="Funil_ ${Funilt_}" id="abbrselect-${Funilt_}"><button class="Funils_" id="select-${Funilt_}" onclick="selectFunil_('${Funilt_}', true)">${Funilt_}</button></abbr><abbr title="Renomear ${Funilt_}" id="abbrRename-${Funilt_}"><button class="Funils_Rename" id="Rename-${Funilt_}" onclick="RenameFunil_('${Funilt_}')"><</button></abbr><abbr title="Apagar ${Funilt_}" id="abbrerase-${Funilt_}"><button class="Funils_Erase" id="erase-${Funilt_}" onclick="eraseFunil_('${Funilt_}')"><</button></abbr>\n</div>\n`
        if (divAdjacent) {
            if (isFirstUndefined) {
                divAdjacent.insertAdjacentHTML('beforebegin', funilHTMlDestroy)
            } else {
                divAdjacent.insertAdjacentHTML('afterend', funilHTMlDestroy)
            }
        } else {
            FunilsDiv.innerHTML += funilHTMlDestroy
        }

        const divFunilt_ = document.querySelector(`#${Funilt_}`)
        divFunilt_.style.cssText =
            'border-top: 5px solid var(--colorBlack); border-bottom: 5px solid var(--colorBlack); transition: var(--configTrasition03s);'

        //console.log(document.documentElement.outerHTML)
        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR insertFunil_Front ${Funilt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> insertFunil_Front <strong>${Funilt_}</strong>: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
async function newFunils() {
    /*if (isStartedNew) {
        displayOnConsole('> ℹ️ <strong>newClients</strong> not Ready.', setLogError)
        return
    }*/
    try {
        //isStartedNew = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let userConfirmation = confirm('Tem certeza de que deseja criar um novo Funil_?')
        if (!userConfirmation) {
            resetLoadingBar()

            //isStartedNew = false

            return
        }
        let divTemplateFunctions = document.querySelector('#divNewTemplate')

        //isFromNew = true

        const response = await axios.post('/funil/new')
        const Sucess = response.data.sucess
        const Funil_ = response.data.Funilt_
        if (Sucess) {
            await insertFunil_Front(Funil_, true)
            //await selectFunil_(Funil_, true)

            divTemplateFunctions.style.cssText =
                'display: flex; opacity: 0;'
            setTimeout(function() {
                divTemplateFunctions.style.cssText =
                    'display: flex; opacity: 1;'
            }, 100)

            resetLoadingBar()
        } else {


            resetLoadingBar()
            return
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR newFunils: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> newFunils: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
let externalPromiseResolve2
let Namet_2 = null
async function setFunilName(isInitiated) {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const divInputFunilName = document.querySelector(`#isendInputFunilName`)
        const inputFunilName = document.querySelector(`#iinputFunilName`)
        const sendFunilName = document.querySelector(`#isendSearchFunilName`)
        if (isInitiated) {
            divInputFunilName.style.cssText =
                'display: flex; height: 0px; solid var(--colorBlack);'
            setTimeout(function() {
                divInputFunilName.style.cssText =
                    'display: flex; height: 37px; solid var(--colorBlack);'
            }, -1)
            setTimeout(function() {
                inputFunilName.style.cssText =
                    'display: inline; opacity: 0;'
                sendFunilName.style.cssText =
                    'display: flex; opacity: 0;'
                    setTimeout(function() {
                        inputFunilName.style.cssText =
                            'display: inline; opacity: 1;'
                        sendFunilName.style.cssText =
                            'display: flex; opacity: 1;'
                    }, 100)
            }, 100)
            await sleep(100)
            inputFunilName.focus()
            const promise = new Promise((resolve, reject) => {
                externalPromiseResolve2 = resolve
            })
            status.innerHTML = `Digite um <strong>nome</strong> para a <strong>instancia</strong> Funil_`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Digite um <strong>nome</strong> para a <strong>instancia</strong> Funil_.`)
            document.title = `Digite um nome...`
            resetLoadingBar()
            await promise
            let barL = document.querySelector('#barLoading')
            barL.style.cssText =
                'width: 100vw; visibility: visible;'
            status.innerHTML = `Nome <strong>${Namet_2}</strong> <strong>aceito</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Nome <strong>${Namet_2}</strong> <strong>aceito</strong>!`)
            inputFunilName.value = ''
            return Namet_2
        } else {
            if (inputFunilName.value.includes('_') || /\d/.test(inputFunilName.value)) {
                status.innerHTML = `<i><strong>ERROR</strong></i> Caracteres <strong>'_'</strong> ou numeros <strong>não</strong> são aceitos!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> Caracteres <strong>'_'</strong> ou numeros <strong>não</strong> são aceitos!`)
                resetLoadingBar()
                return
            } else if (inputFunilName.value.length === 0) {
                Namet_2 = 'Funil'
                inputFunilName.style.cssText =
                    'display: inline; opacity: 0;'
                sendFunilName.style.cssText =
                    'display: flex; opacity: 0;'
                setTimeout(function() {
                    inputFunilName.style.cssText =
                        'display: none; opacity: 0;'
                    sendFunilName.style.cssText =
                        'display: none; opacity: 0;'
                    divInputFunilName.style.cssText =
                        'display: flex; height: 0px; solid var(--colorBlack);'
                        setTimeout(function() {
                            divInputFunilName.style.cssText =
                                'display: none; height: 0px; solid var(--colorBlack);'
                        }, 300)
                }, 100)
                if (externalPromiseResolve2) {
                    externalPromiseResolve2()
                }
                resetLoadingBar()
            } else {
                Namet_2 = inputFunilName.value
                inputFunilName.style.cssText =
                    'display: inline; opacity: 0;'
                sendFunilName.style.cssText =
                    'display: flex; opacity: 0;'
                setTimeout(function() {
                    inputFunilName.style.cssText =
                        'display: none; opacity: 0;'
                    sendFunilName.style.cssText =
                        'display: none; opacity: 0;'
                    divInputFunilName.style.cssText =
                        'display: flex; height: 0px; solid var(--colorBlack);'
                        setTimeout(function() {
                            divInputFunilName.style.cssText =
                                'display: none; height: 0px; solid var(--colorBlack);'
                        }, 300)
                }, 100)
                if (externalPromiseResolve2) {
                    externalPromiseResolve2()
                }
                resetLoadingBar()
            }
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR setFunilName: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> setFunilName: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function RenameFunil_(Funilt_) {
    /*if (Client_NotReady) {
        displayOnConsole(`> ℹ️  ${Clientt_} not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const response = await axios.put('/funil/rename-funil-name', { Funilt_ })
        const Sucess = response.data.sucess
        const funilt_ = response.data.Funilt_

        if (Sucess) {
            const divFunils_ = document.querySelector('#Funils_')
            divFunils_.innerHTML = ''

            const newFunilDiv = document.querySelector('#divNewFunil')
            newFunilDiv.style.cssText = 'display: flex; opacity: 0;' 
            setTimeout(() => newFunilDiv.style.cssText = 'display: flex; opacity: 1;', 100)
            //o codigo abaixo e possivel botar tudo numa rota e devolver e fazer oq fas aqui que nsei como explica certinho, modelo REST e tals (se for preciso)

            const dir_Path = 'Funil'
            const response = await axios.get('/functions/dir', { params: { dir_Path } })
            const Directories_ = response.data.dirs
            
            if (Directories_.length-1 === -1) {
                displayOnConsole(`> ⚠️ <strong>Dir</strong> Funils_ (<strong>${Directories_.length}</strong>) is <strong>empty</strong>.`)
            } else {
                displayOnConsole(`> ℹ️  <strong>Dir</strong> Funils_ has (<strong>${Directories_.length}</strong>) loading <strong>ALL</strong>...`)
                
                let divTemplateFunctions = document.querySelector('#divNewTemplate')

                let Counter_ = 1
                for (let i = 1; i <= Directories_.length; i++) {
                    await insertFunil_Front(Directories_[Counter_-1], false)
                    //await selectFunil_(Directories_[Counter_-1], false)

                    divTemplateFunctions.style.cssText =
                        'display: flex; opacity: 0;'
                    setTimeout(function() {
                        divTemplateFunctions.style.cssText =
                            'display: flex; opacity: 1;'
                    }, 100)
                    
                    Counter_++
                }
                displayOnConsole(`> ✅ <strong>Dir</strong> Funils_ loaded <strong>ALL</strong> (<strong>${Directories_.length}</strong>).`)
            }
            await selectFunil_(funilt_)
            resetLoadingBar()
        } else {
            
            resetLoadingBar()
        }

        //Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR RenameFunil_ ${Funilt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> RenameFunil_ <strong>${Funilt_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}

let positionSelectedMSG = null
async function selectionPositionMSG(checkElement, typeMSG) {
    try {
        const divPosition = checkElement.parentElement.parentElement.parentElement
        const idNumberPositionMSG = divPosition.id.match(/\d+/g)

        if (positionSelectedMSG !== null && checkElement.checked === true) {
            let barL = document.querySelector('#barLoading')
            barL.style.cssText =
                'width: 100vw; visibility: visible;'

            checkElement.checked = false
            
            let userConfirmation = confirm(`Tem certeza de que deseja trocar a Posição MSG (${positionSelectedMSG.idNumberPositionSelected}) para a Posição MSG (${idNumberPositionMSG})?`)
            if (userConfirmation) {
                const response = await axios.put('/funil/position-change', { selectedId:Number(positionSelectedMSG.idNumberPositionSelected), toChangeFor:Number(idNumberPositionMSG) })
                const Sucess = response.data.sucess
                if (Sucess) {//talves deixar desse jeito ou fazer ser bunitinho sumindo apenas o MSG type e aparecendo o outro, sla, talves algo parecido coma logica do selectTemplate mas so pro MSG type hmmmmmm
                    document.querySelector(`#iinputCheckboxSelectionMSG${positionSelectedMSG.idNumberPositionSelected}`).checked = false
                    document.querySelector(`#iinputCheckboxSelectionMSG${positionSelectedMSG.idNumberPositionSelected}`).dispatchEvent(new Event('change'))

                    document.querySelector(`#funilArea`).innerHTML = ''
                    await selectTemplate_(Template_)//

                    resetLoadingBar()

                    /*const conteinerPositionMSGSelected = document.querySelector(`#conteinerFunilMSG${positionSelectedMSG.idNumberPositionSelected}`)
                    conteinerPositionMSGSelected.querySelector(`#idivInnerConteinerFunilMSG`).style.cssText =
                        `display: flex; opacity: 0;`
                    const conteinerPositionMSGTochange = document.querySelector(`#conteinerFunilMSG${idNumberPositionMSG}`)
                    conteinerPositionMSGTochange.querySelector(`#idivInnerConteinerFunilMSG`).style.cssText =
                        `display: flex; opacity: 0;`
                    setTimeout(function() {
                        conteinerPositionMSGSelected.querySelector(`#idivInnerConteinerFunilMSG`).style.cssText =
                            `display: none; opacity: 0;`
                        conteinerPositionMSGTochange.querySelector(`#idivInnerConteinerFunilMSG`).style.cssText =
                                `display: none; opacity: 0;`
                    
                        const divInnerPositionMSGSelected = conteinerPositionMSGSelected.querySelector(`#idivInnerConteinerFunilMSG`).cloneNode(true)
                        console.log(divInnerPositionMSGSelected)
                        conteinerPositionMSGSelected.querySelector(`#idivInnerConteinerFunilMSG`).innerHTML = ''
                        
                        const divInnerPositionMSGTochange = conteinerPositionMSGTochange.querySelector(`#idivInnerConteinerFunilMSG`).cloneNode(true)
                        console.log(divInnerPositionMSGTochange)
                        conteinerPositionMSGTochange.querySelector(`#idivInnerConteinerFunilMSG`).innerHTML = ''

                        conteinerPositionMSGSelected.querySelector(`#idivInnerConteinerFunilMSG`).replaceWith(divInnerPositionMSGTochange)
                        conteinerPositionMSGSelected.querySelector(`#idivInnerConteinerFunilMSG`).style.cssText =
                            `display: flex; opacity: 0;`
                        conteinerPositionMSGTochange.querySelector(`#idivInnerConteinerFunilMSG`).replaceWith(divInnerPositionMSGSelected)
                        conteinerPositionMSGTochange.querySelector(`#idivInnerConteinerFunilMSG`).style.cssText =
                            `display: flex; opacity: 0;`
                        setTimeout(function() {
                            conteinerPositionMSGSelected.querySelector(`#idivInnerConteinerFunilMSG`).style.cssText =
                                `display: flex; opacity: 1;`
                            conteinerPositionMSGTochange.querySelector(`#idivInnerConteinerFunilMSG`).style.cssText =
                                `display: flex; opacity: 1;`

                            //ja com valor no input delay ele roda o select duas vezes

                            /*displayOnConsole(positionSelectedMSG.typeMSGSelected)
                            switch (positionSelectedMSG.typeMSGSelected) {
                                case 1:
                                    divPosition.querySelector(`#idelayMSGTime`).dispatchEvent(new Event('input'))
                                    divPosition.querySelector(`#idelayMSGSelect`).dispatchEvent(new Event('input'))
                                    break;
                                case 2:
                                    divPosition.querySelector(`#idelayTextTime`).dispatchEvent(new Event('input'))
                                    divPosition.querySelector(`#idelayTextSelect`).dispatchEvent(new Event('input'))
                                    divPosition.querySelector(`#itextAreaTypeMSG`).dispatchEvent(new Event('input'))
                                    break;
                                case 3:
                                    divPosition.querySelector(`#idelayTexAudioTime`).dispatchEvent(new Event('input'))
                                    divPosition.querySelector(`#idelayTextAudioSelect`).dispatchEvent(new Event('input'))
                                    divPosition.querySelector(`#itextAreaCaption`).dispatchEvent(new Event('input'))
                                    //divPosition.querySelector('input#ifileTypeMSGAux[type="file"]').dispatchEvent(new Event('change'))//deprecated
                                    break;
                            }

                            const divPositionTochange = document.querySelector(`#conteinerFunilMSG${positionSelectedMSG.idNumberPositionSelected}`)//caso n esteja entendo como ja mudo a posicao ent é isso... da certo tendeu?
                            console.log(divPositionTochange)
                            displayOnConsole(typeMSG)
                            switch (typeMSG) {
                                case 1:
                                    divPositionTochange.querySelector(`#idelayMSGTime`).dispatchEvent(new Event('input'))
                                    divPositionTochange.querySelector(`#idelayMSGSelect`).dispatchEvent(new Event('input'))
                                    break;
                                case 2:
                                    divPositionTochange.querySelector(`#idelayTextTime`).dispatchEvent(new Event('input'))
                                    divPositionTochange.querySelector(`#idelayTextSelect`).dispatchEvent(new Event('input'))
                                    divPositionTochange.querySelector(`#itextAreaTypeMSG`).dispatchEvent(new Event('input'))
                                    break;
                                case 3:
                                    divPositionTochange.querySelector(`#idelayTexAudioTime`).dispatchEvent(new Event('input'))
                                    divPositionTochange.querySelector(`#idelayTextAudioSelect`).dispatchEvent(new Event('input'))
                                    divPositionTochange.querySelector(`#itextAreaCaption`).dispatchEvent(new Event('input'))
                                    //divPositionTochange.querySelector('input#ifileTypeMSGAux[type="file"]').dispatchEvent(new Event('change'))//deprecated
                                    break;
                            }*/

                            /*document.querySelector(`#iinputCheckboxSelectionMSG${positionSelectedMSG.idNumberPositionSelected}`).checked = false
                            document.querySelector(`#iinputCheckboxSelectionMSG${positionSelectedMSG.idNumberPositionSelected}`).dispatchEvent(new Event('change'))
                            
                            resetLoadingBar()
                        }, 300)
                    }, 100)*/
                } else {
                    
                }
            } else {

                resetLoadingBar()
                return
            }
            return
        }
        
        if (checkElement.checked) {
            const idNumberPositionSelected = Number(idNumberPositionMSG)
            const typeMSGSelected = typeMSG
            positionSelectedMSG = { idNumberPositionSelected, typeMSGSelected }
            checkElement.parentElement.title = `Selecionado (${idNumberPositionMSG})`
        } else {
            positionSelectedMSG = null
            checkElement.parentElement.title = `Selecione (${idNumberPositionMSG})`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR selectedPositionMSG: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> selectedPositionMSG: ${error.message}`, setLogError)
    }
}

async function erasePosition(divPosition, typeMSG) {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const IdDivPosition = divPosition.id
        const IdNumberPosition = IdDivPosition.match(/\d+/g)

        let userConfirmation = null
        switch (typeMSG) {
            case 1:
            case 2:
            case 4:
                userConfirmation = confirm(`Tem certeza de que deseja deletar o template da posição (${IdNumberPosition})?\nsera apagado tudo para sempre.`)
                break;
            case 3:
                const fileInput = divPosition.querySelector('input#ifileTypeMSGAux[type="file"]')
                if (fileInput.files[0] === undefined) {
                    userConfirmation = confirm(`Tem certeza de que deseja deletar o template da posição (${IdNumberPosition})?\nsera apagado tudo para sempre.`)
                } else {
                    userConfirmation = confirm(`Tem certeza de que deseja deselecionar o arquivo (${fileInput.files[0].name})?\nsera apagado para sempre.`)
                }
                break;
        }
        if (userConfirmation) {
            let response = null
            let Sucess = null
            switch (typeMSG) {
                case 1:
                    response = await axios.delete('/funil/erase-position-MSG', { params: { IdNumberPosition } })
                    Sucess = response.data.sucess
                    if (Sucess) {
                        /*const inputDelayMSG = divPosition.querySelector(`#idelayMSGTime`)
                        if (inputDelayMSG.value !== '') {
                            inputDelayMSG.value = ''
                            inputDelayMSG.dispatchEvent(new Event('input'))
                        }*/

                        const conteinerMSG = document.querySelector(`#${IdDivPosition}`)
                        conteinerMSG.style.cssText =
                            `display: flex; opacity: 0;`
                        setTimeout(async function() {
                            conteinerMSG.style.cssText =
                                `display: none; opacity: 0;`
                            
                            divPosition.remove()
                        }, 100)
                    } else {

                    }
                    break;
                case 2:
                    response = await axios.delete('/funil/erase-position-MSG', { params: { IdNumberPosition } })
                    Sucess = response.data.sucess
                    if (Sucess) {
                        /*const inputDelayText = divPosition.querySelector(`#idelayTextTime`)                        
                        if (inputDelayText.value !== '') {
                            inputDelayText.value = ''
                            inputDelayText.dispatchEvent(new Event('input'))
                        }*/
                        /*await StateTypingMSG(divPosition, true)

                        const divTextAreaMSG = divPosition.querySelector(`#itextAreaTypeMSG`)
                        if (divTextAreaMSG.value !== '') {
                            divTextAreaMSG.value = ''
                            divTextAreaMSG.dispatchEvent(new Event('input'))
                        }*/

                        const conteinerMSG = document.querySelector(`#${IdDivPosition}`)
                        conteinerMSG.style.cssText =
                            `display: flex; opacity: 0;`
                        setTimeout(async function() {
                            conteinerMSG.style.cssText =
                                `display: none; opacity: 0;`

                            divPosition.remove()
                        }, 100)
                    } else {

                    }
                    break;
                case 3:
                    const fileInput = divPosition.querySelector('input#ifileTypeMSGAux[type="file"]')
                    if (fileInput.files[0] === undefined) {
                        response = await axios.delete('/funil/erase-position-MSG', { params: { IdNumberPosition } })
                        Sucess = response.data.sucess
                        if (Sucess) {
                            const conteinerMSG = document.querySelector(`#${IdDivPosition}`)
                            conteinerMSG.style.cssText =
                                `display: flex; opacity: 0;`
                            setTimeout(async function() {
                                conteinerMSG.style.cssText =
                                    `display: none; opacity: 0;`

                                divPosition.remove()
                            }, 100)
                        } else {

                        }
                    } else {
                        fileInput.value = ''
                        fileInput.dispatchEvent(new Event('change'))
                    }
                    break;
                case 4:
                    response = await axios.delete('/funil/erase-position-MSG', { params: { IdNumberPosition } })
                    Sucess = response.data.sucess
                    if (Sucess) {
                        /*const inputDelayMSG = divPosition.querySelector(`#idelayMSGTime`)
                        if (inputDelayMSG.value !== '') {
                            inputDelayMSG.value = ''
                            inputDelayMSG.dispatchEvent(new Event('input'))
                        }*/

                        const conteinerMSG = document.querySelector(`#${IdDivPosition}`)
                        conteinerMSG.style.cssText =
                            `display: flex; opacity: 0;`
                        setTimeout(async function() {
                            conteinerMSG.style.cssText =
                                `display: none; opacity: 0;`
                            
                            divPosition.remove()
                        }, 100)
                    } else {

                    }
                    break;
            }

            resetLoadingBar()
        } else {
            resetLoadingBar()
            return
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR erasePosition: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> erasePosition: ${error.message}`, setLogError)
    }
}

async function sendToFunil(bridgeElement, typeMSG, typeTypeMSG, data) {//peda o id do position aqui e manda tbm vai precisar obiviu
    try {
        let divElement = null

        let MSGType = null
        let positionId = null
        let delayType = null
        let delayData = null
        let stateContinue = null
        let funiltRebate = null
        let templatetRebate = null
        let textareaData = null
        let fileType = null
        let fileData = null

        switch (typeMSG) {
            case 1:
                divElement = bridgeElement.closest(`#idivDelayTypeMSG`)
                
                const inputDelayMSG = divElement.querySelector(`#idelayMSGTime`)

                positionId = Number(divElement.parentElement.parentElement.id.match(/\d+/g))

                switch (typeTypeMSG.value || typeTypeMSG) {
                    case 'input':
                        //displayOnConsole(`1=${typeTypeMSG}:`)
                        //displayOnConsole(inputDelayMSG.value)
                        MSGType = 'delay'
                        delayType = typeTypeMSG
                        delayData = inputDelayMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        const selectDelayMSG = divElement.querySelector(`#idelayMSGSelect`)
                        if (inputDelayMSG.value >= 1) {
                            if (selectDelayMSG.selectedIndex === 0) {
                                selectDelayMSG.selectedIndex = 1
                                selectDelayMSG.dispatchEvent(new Event('input'))
                            }
                        } else {
                            if (selectDelayMSG.selectedIndex !== 0) {
                                selectDelayMSG.selectedIndex = 0
                                selectDelayMSG.dispatchEvent(new Event('input'))
                            }
                        }
                        break;
                    case 'seconds':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        
                        if (!inputDelayMSG.value || inputDelayMSG.value === 0) {
                            inputDelayMSG.value = 1
                            inputDelayMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'minutes':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        
                        if (!inputDelayMSG.value || inputDelayMSG.value === 0) {
                            inputDelayMSG.value = 1
                            inputDelayMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'hours':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        
                        if (!inputDelayMSG.value || inputDelayMSG.value === 0) {
                            inputDelayMSG.value = 1
                            inputDelayMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'days':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        
                        if (!inputDelayMSG.value || inputDelayMSG.value === 0) {
                            inputDelayMSG.value = 1
                            inputDelayMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'none':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        if (inputDelayMSG.value !== '') {
                            inputDelayMSG.value = ''
                            inputDelayMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                }
                break;
            case 2:
                divElement = bridgeElement.closest(`#idivTextarea`)

                const inputDelayText = divElement.querySelector(`#idelayTextTime`)

                positionId = Number(divElement.parentElement.parentElement.id.match(/\d+/g))

                if (typeTypeMSG) {
                    switch (typeTypeMSG.value || typeTypeMSG) {
                        case 'input':
                            //displayOnConsole(`2=${typeTypeMSG}:`)
                            //displayOnConsole(inputDelayText.value)
                            MSGType = 'delay'
                            delayType = typeTypeMSG
                            delayData = inputDelayText.value
                            await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                            const selectDelayText = divElement.querySelector(`#idelayTextSelect`)
                            if (inputDelayText.value >= 1) {
                                if (selectDelayText.selectedIndex === 0) {
                                    selectDelayText.selectedIndex = 1
                                    selectDelayText.dispatchEvent(new Event('input'))
                                }
                            } else {
                                if (selectDelayText.selectedIndex !== 0) {
                                    selectDelayText.selectedIndex = 0
                                    selectDelayText.dispatchEvent(new Event('input'))
                                }
                            }
                            break;
                        case 'seconds':
                            //displayOnConsole(`2=${typeTypeMSG.value}`)
                            MSGType = 'delay'
                            delayType = typeTypeMSG.value
                            await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                            if (!inputDelayText.value || inputDelayText.value === 0) {
                                inputDelayText.value = 1
                                inputDelayText.dispatchEvent(new Event('input'))
                            }
                            break;
                        case 'minutes':
                            //displayOnConsole(`2=${typeTypeMSG.value}`)
                            MSGType = 'delay'
                            delayType = typeTypeMSG.value
                            await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                            if (!inputDelayText.value || inputDelayText.value === 0) {
                                inputDelayText.value = 1
                                inputDelayText.dispatchEvent(new Event('input'))
                            }
                            break;
                        case 'hours':
                            //displayOnConsole(`2=${typeTypeMSG.value}`)
                            MSGType = 'delay'
                            delayType = typeTypeMSG.value
                            await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                            if (!inputDelayText.value || inputDelayText.value === 0) {
                                inputDelayText.value = 1
                                inputDelayText.dispatchEvent(new Event('input'))
                            }

                            
                            break;
                        case 'days':
                            //displayOnConsole(`2=${typeTypeMSG.value}`)
                            MSGType = 'delay'
                            delayType = typeTypeMSG.value
                            await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                            if (!inputDelayText.value || inputDelayText.value === 0) {
                                inputDelayText.value = 1
                                inputDelayText.dispatchEvent(new Event('input'))
                            }
                            break;
                        case 'none':
                            //displayOnConsole(`2=${typeTypeMSG.value}`)
                            MSGType = 'delay'
                            delayType = typeTypeMSG.value
                            await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                            if (inputDelayText.value !== '') {
                                inputDelayText.value = ''
                                inputDelayText.dispatchEvent(new Event('input'))
                            }
                            break;
                        case 'textarea':
                                //const divTextAreaMSG = divElement.querySelector(`#itextAreaTypeMSG`)
                                if (data) {
                                    //displayOnConsole(`2=${typeTypeMSG}:`) 
                                    //displayOnConsole(data.value)
                                    MSGType = 'textarea'
                                    textareaData = data.value
                                    await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                                }
                            break;
                    }
                }
                break;
            case 3:
                divElement = bridgeElement.closest(`#ifileTypeMSG`)
                
                const inputDelayTextAudio = divElement.querySelector(`#idelayTexAudioTime`)

                positionId = Number(divElement.parentElement.parentElement.id.match(/\d+/g))

                switch (typeTypeMSG.value || typeTypeMSG) {
                    case 'input':
                        //displayOnConsole(`3=${typeTypeMSG}:`)
                        //displayOnConsole(inputDelayTextAudio.value)
                        MSGType = 'delay'
                        delayType = typeTypeMSG
                        delayData = inputDelayTextAudio.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        const selectDelayTextAudio = divElement.querySelector(`#idelayTextAudioSelect`)
                        if (inputDelayTextAudio.value >= 1) {
                            if (selectDelayTextAudio.selectedIndex === 0) {
                                selectDelayTextAudio.selectedIndex = 1
                                selectDelayTextAudio.dispatchEvent(new Event('input'))
                            }
                        } else {
                            if (selectDelayTextAudio.selectedIndex !== 0) {
                                selectDelayTextAudio.selectedIndex = 0
                                selectDelayTextAudio.dispatchEvent(new Event('input'))
                            }
                        }
                        break;
                    case 'seconds':
                        //displayOnConsole(`3=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        if (!inputDelayTextAudio.value || inputDelayTextAudio.value === 0) {
                            inputDelayTextAudio.value = 1
                            inputDelayTextAudio.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'minutes':
                        //displayOnConsole(`3=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        if (!inputDelayTextAudio.value || inputDelayTextAudio.value === 0) {
                            inputDelayTextAudio.value = 1
                            inputDelayTextAudio.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'hours':
                        //displayOnConsole(`3=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        if (!inputDelayTextAudio.value || inputDelayTextAudio.value === 0) {
                            inputDelayTextAudio.value = 1
                            inputDelayTextAudio.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'days':
                        //displayOnConsole(`3=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        if (!inputDelayTextAudio.value || inputDelayTextAudio.value === 0) {
                            inputDelayTextAudio.value = 1
                            inputDelayTextAudio.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'none':
                        //displayOnConsole(`3=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        if (inputDelayTextAudio.value !== '') {
                            inputDelayTextAudio.value = ''
                            inputDelayTextAudio.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'textarea':
                        //const divTextAreaMSG = divElement.querySelector(`#itextAreaTypeMSG`)
                        if (data) {
                            //displayOnConsole(`3=${typeTypeMSG}:`) 
                            //displayOnConsole(data.value || '')
                            MSGType = 'textarea'
                            textareaData = data.value
                            await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        }
                        break;
                    default:
                        if (data) {
                            //displayOnConsole(`3=file:`)   
                            //displayOnConsole(`3=fileType:`)   
                            //displayOnConsole(typeTypeMSG)   
                            //displayOnConsole(data.name)   
                            //console.log(data || '')
                            MSGType = 'file'
                            fileType = typeTypeMSG
                            fileData = data
                            //await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, textareaData, fileType })
                            const formData = new FormData()
                            formData.append('typeMSG', typeMSG)
                            formData.append('MSGType', MSGType)
                            formData.append('positionId', positionId)
                            formData.append('delayType', delayType)
                            formData.append('delayData', delayData)
                            formData.append('templatetRebate', templatetRebate)
                            formData.append('textareaData', textareaData)
                            formData.append('fileType', fileType)
                            formData.append('fileData', fileData)
                            await axios.put('/funil/send-data', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                        } 
                }
                break;
            case 4:
                divElement = bridgeElement.closest(`#irebateTypeMSG`)
                
                const inputRebateMSG = divElement.querySelector(`#idelayRebateTime`)

                positionId = Number(divElement.parentElement.parentElement.id.match(/\d+/g))

                switch (typeTypeMSG.value || typeTypeMSG) {
                    case 'continue':
                        //displayOnConsole(`1=${typeTypeMSG}:`)
                        //displayOnConsole(inputDelayMSG.value)
                        MSGType = 'functions'

                        const buttonStateContinue = divElement.querySelector(`#iOnOffStateContinue`)
                        const abbrButtonStateContinue = divElement.querySelector(`#iabbrOnOffStateContinue`)
                        if (getComputedStyle(data).backgroundColor === 'rgb(66, 209, 66)') {
                            stateContinue = false
                            
                            abbrButtonStateContinue.title = 'StateContinue STATUS: off'
                            buttonStateContinue.textContent = 'o'
                            buttonStateContinue.style.cssText =
                            `background-color: var(--colorRed); color: var(--colorBlack); cursor: pointer;`
                        } else if (getComputedStyle(data).backgroundColor === 'rgb(207, 44, 44)') {
                            stateContinue = true
                            
                            abbrButtonStateContinue.title = 'StateContinue STATUS: on'
                            buttonStateContinue.textContent = '-'
                            buttonStateContinue.style.cssText =
                                `background-color: var(--colorGreen); color: var(--colorBlack); cursor: pointer;`
                        }
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        break;
                    case 'input':
                        //displayOnConsole(`1=${typeTypeMSG}:`)
                        //displayOnConsole(inputDelayMSG.value)
                        MSGType = 'delay'
                        delayType = typeTypeMSG
                        delayData = inputRebateMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        break;
                    case 'seconds':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        
                        if (!inputRebateMSG.value || inputRebateMSG.value === 0) {
                            inputRebateMSG.value = 1
                            inputRebateMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'minutes':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        
                        if (!inputRebateMSG.value || inputRebateMSG.value === 0) {
                            inputRebateMSG.value = 1
                            inputRebateMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'hours':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        
                        if (!inputRebateMSG.value || inputRebateMSG.value === 0) {
                            inputRebateMSG.value = 1
                            inputRebateMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'days':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        
                        if (!inputRebateMSG.value || inputRebateMSG.value === 0) {
                            inputRebateMSG.value = 1
                            inputRebateMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'none':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'delay'
                        delayType = typeTypeMSG.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        if (inputRebateMSG.value !== '') {
                            inputRebateMSG.value = ''
                            inputRebateMSG.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'rebateFunil':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'rebateFunil'
                        funiltRebate = data.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                        const templateDelayRebate = divElement.querySelector(`#itemplateRebateSelect`)
                        if (data.value !== 'none') {
                            const dir_Path = `Funil\\${data.value}`
                            const response = await axios.get('/functions/dir', { params: { dir_Path } })
                            const Directories = response.data.dirs
                            //displayOnConsole(Directories)
                            let Templatets_ = []
                            for (let i = 0; i < Directories.length; i++) {
                                const match = Directories[i].match(/_(\d+_[^_]+)_/)
                                Templatets_.push(match[0])
                            }
                            //displayOnConsole(Templatets_)
                            Templatets_.forEach(template => {
                                let option = document.createElement("option")
                                option.value = template 
                                option.textContent = template
                                templateDelayRebate.appendChild(option)
                            })
                            //displayOnConsole(data.value)
                            //templateDelayRebate.value = data.value
                        } else {
                            templateDelayRebate.innerHTML = ''
                            let option = document.createElement("option")
                            option.value = 'none' 
                            option.textContent = 'Nenhum'
                            templateDelayRebate.appendChild(option)

                            templateDelayRebate.value = 'none'
                            templateDelayRebate.dispatchEvent(new Event('input'))
                        }
                        break;
                    case 'rebateTemplate':
                        //displayOnConsole(`1=${typeTypeMSG.value}`)
                        MSGType = 'rebateTemplate'
                        templatetRebate = data.value
                        await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                        break;
                }
                break;
        }
    //console.log('no front: ', { typeMSG, MSGType, positionId, delayType, delayData, textareaData, fileType, fileData })
    } catch (error) {
        console.error(`> ⚠️ ERROR sendToFunil: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> sendToFunil: ${error.message}`, setLogError)
    }
}

async function StateTypingMSG(buttonElement, IsWType) {
    try {
        let type = null
        let button = null
        let abbr = null
        let input = null
        let delay = null
        if (IsWType) {
            type = 'idivTextarea'
            button = 'iOnOffStateTypingMSG'
            abbr = 'iabbrOnOffStateTypingMSG'
            input = 'idelayTextTime'
            delay = 'idivDelayText'
        } else {
            type = 'ifileTypeMSG'
            button = 'iOnOffStateTypingFile'
            abbr = 'iabbrOnOffStateTypingFile'
            input = 'idelayTexAudioTime'
            delay = 'idivDelayTextAudio'
        }

        const typeElement = buttonElement.closest(`#${type}`)
        const divElement = typeElement || buttonElement
        const buttonStateTyping = divElement.querySelector(`#${button}`)
        const abbrStateTyping = divElement.querySelector(`#${abbr}`)
        
        const inputDelayText = divElement.querySelector(`#${input}`)
        const divDelayStateTyping = divElement.querySelector(`#${delay}`)

        const computedSyle2 = window.getComputedStyle(buttonStateTyping)
        const currentButtonStateTypingDisplay = computedSyle2.display
        const currentButtonStateTypingOpacity = computedSyle2.opacity

        const isShown_divDelayTextStateRecording = window.getComputedStyle(divDelayStateTyping).height
        
        if (isShown_divDelayTextStateRecording === '0px') {
            buttonStateTyping.style.cssText =
                `display: ${currentButtonStateTypingDisplay}; opacity: ${currentButtonStateTypingOpacity}; background-color: var(--colorWhite); color: var(--colorBlack);`
            buttonStateTyping.textContent = `-`
            
            abbrStateTyping.title = `StateTyping STATUS: on`

            divDelayStateTyping.style.cssText =
                'display: flex; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
            setTimeout(function() {
                divDelayStateTyping.style.cssText =
                    'display: flex; height: 0vh; outline: 2px solid rgba(0, 0, 0, 0); border: 2px solid var(--colorBlack); padding: 5px 5px 10px 5px;'
            }, -1)
            setTimeout(function() {
                divDelayStateTyping.style.cssText =
                    'display: flex; height: 6vh; outline: 2px solid rgba(0, 0, 0, 0); border: 2px solid var(--colorBlack); padding: 5px 5px 10px 5px;'
            }, 100)
        } else {
            /*if (inputDelayText.value !== '') {
                inputDelayText.value = ''
                inputDelayText.dispatchEvent(new Event('input'))
            }*/

            buttonStateTyping.style.cssText =
                `display: ${currentButtonStateTypingDisplay}; opacity: ${currentButtonStateTypingOpacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonStateTyping.textContent = `O`

            abbrStateTyping.title = `StateTyping STATUS: off`

            divDelayStateTyping.style.cssText =
                'display: flex; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
            setTimeout(function() {
                divDelayStateTyping.style.cssText =
                    'display: none; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
            }, 300)
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR StateTypingMSG: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> StateTypingMSG: ${error.message}`, setLogError)
    }
}
async function StateRecordingMSG(buttonElement) {
    try {
        const divElement = buttonElement.closest('#ifileTypeMSG')

        const buttonStateRecording = divElement.querySelector(`#iOnOffStateRecordingFile`)
        const abbrStateRecording = divElement.querySelector(`#iabbrOnOffStateRecordingFile`)
        
        const inputDelayTextAudio = divElement.querySelector(`#idelayTexAudioTime`)
        const divDelayStateRecording = divElement.querySelector(`#idivDelayTextAudio`)

        const computedSyle2 = window.getComputedStyle(buttonStateRecording)
        const currentButtonStateRecordingDisplay = computedSyle2.display
        const currentButtonStateRecordingOpacity = computedSyle2.opacity
        
        const isShown_divDelayTextStateRecording = window.getComputedStyle(divDelayStateRecording).height
        
        if (isShown_divDelayTextStateRecording === '0px') {
            buttonStateRecording.style.cssText =
                `display: ${currentButtonStateRecordingDisplay}; opacity: ${currentButtonStateRecordingOpacity}; background-color: var(--colorWhite); color: var(--colorBlack);`
            buttonStateRecording.textContent = `-`
            
            abbrStateRecording.title = `StateTyping STATUS: on`

            divDelayStateRecording.style.cssText =
                'display: flex; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
            setTimeout(function() {
                divDelayStateRecording.style.cssText =
                    'display: flex; height: 0vh; outline: 2px solid rgba(0, 0, 0, 0); border: 2px solid var(--colorBlack); padding: 5px 5px 10px 5px;'
            }, -1)
            setTimeout(function() {
                divDelayStateRecording.style.cssText =
                    'display: flex; height: 6vh; outline: 2px solid rgba(0, 0, 0, 0); border: 2px solid var(--colorBlack); padding: 5px 5px 10px 5px;'
            }, 100)
        } else {
            /*if (inputDelayTextAudio.value >= 1) {
                inputDelayTextAudio.value = ''
                inputDelayTextAudio.dispatchEvent(new Event('input'))
            }*/

            buttonStateRecording.style.cssText =
                `display: ${currentButtonStateRecordingDisplay}; opacity: ${currentButtonStateRecordingOpacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonStateRecording.textContent = `O`

            abbrStateRecording.title = `StateTyping STATUS: off`

            divDelayStateRecording.style.cssText =
                'display: flex; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
            setTimeout(function() {
                divDelayStateRecording.style.cssText =
                    'display: none; height: 0vh; outline: 0px solid rgba(0, 0, 0, 0); border: 0px solid var(--colorBlack); padding: 0px 0px 0px 0px;'
            }, 300)
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR StateRecordingMSG: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> StateRecordingMSG: ${error.message}`, setLogError)
    }
}
async function CaptionFileMSG(buttonElement) {
    try {
        const divElement = buttonElement.closest('#ifileTypeMSG')
        
        const buttonCaption = divElement.querySelector(`#iOnOffCaption`)
        buttonCaption.style.cssText =
            `display: inline; opacity: 1;`
        const abbrCaption = divElement.querySelector(`#iabbrOnOffCaption`)
        const divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)

        const buttonLigtDark = divElement.querySelector(`#iOnOffLightDarkCaption`)
        const currentLightDarkBackground_Color = buttonLigtDark.style.backgroundColor
        const currentLightDarkColor = buttonLigtDark.style.color
        const buttonLightDarkColor = divElement.querySelector(`#iOnOffLightDarkColorCaption`)
        const currentLightDarkColorBackground_Color = buttonLightDarkColor.style.backgroundColor
        const currentLightDarkColorColor = buttonLightDarkColor.style.color
        
        const buttonDesktopScreen1 = divElement.querySelector(`#iOnOffResetScreenSetupCaption1`)
        const buttonDesktopScreen2 = divElement.querySelector(`#iOnOffVLockScreenSetupCaption2`)
        const currentButtonDesktopScreen2Background_Color = buttonDesktopScreen2.style.backgroundColor
        const currentButtonDesktopScreen2Color = buttonDesktopScreen2.style.color
        const buttonDesktopScreen3 = divElement.querySelector(`#iOnOffDesktopScreenSetupCaption3`)
        const currentButtonDesktopScreen3Background_Color = buttonDesktopScreen3.style.backgroundColor
        const currentButtonDesktopScreen3Color = buttonDesktopScreen3.style.color
        const buttonDesktopScreen4 = divElement.querySelector(`#iOnOffPhoneScreenSetupCaption4`)
        const currentButtonDesktopScreen4Background_Color = buttonDesktopScreen4.style.backgroundColor
        const currentButtonDesktopScreen4Color = buttonDesktopScreen4.style.color

        const buttonComputedStyle = window.getComputedStyle(buttonCaption)
        const buttonDisplay = buttonComputedStyle.display
        const buttonOpacity = buttonComputedStyle.opacity

        const isShown_divTextAreaCaption = window.getComputedStyle(divTextAreaCaption).display
        const currentTextAreaBackground_Color = divTextAreaCaption.style.backgroundColor
        const currentTextAreaColor = divTextAreaCaption.style.color
        const currentTextAreaWidth = divTextAreaCaption.style.width
        const currentTextAreaResize = divTextAreaCaption.style.resize

        if (isShown_divTextAreaCaption === 'none') {
            buttonCaption.style.backgroundColor = 'var(--colorWhite)'
            buttonCaption.style.color = 'var(--colorBlack)'
            /*buttonCaption.style.cssText =
                `background-color: var(--colorWhite); color: var(--colorBlack);` //display: ${buttonDisplay}; opacity: ${buttonOpacity};`*/
            buttonCaption.textContent = `-`
            
            abbrCaption.title = `Area de texto STATUS: on`
            
            divTextAreaCaption.style.cssText =
                `display: block; height: 0em; width: ${currentTextAreaWidth}; padding: 0px;  background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; resize: ${currentTextAreaResize};`
            setTimeout(function() {
                divTextAreaCaption.style.cssText =
                    `display: block; height: 0em; width: ${currentTextAreaWidth}; padding: 6px; background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; resize: ${currentTextAreaResize};`
            }, -1)
            setTimeout(function() {
                divTextAreaCaption.style.cssText =
                    `display: block; height: 13em; width: ${currentTextAreaWidth}; padding: 6px;  background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; resize: ${currentTextAreaResize};`
            }, 100)

            buttonLigtDark.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentLightDarkBackground_Color}; color: ${currentLightDarkColor};`
            buttonLightDarkColor.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentLightDarkColorBackground_Color}; color: ${currentLightDarkColorColor};`

            buttonDesktopScreen1.style.cssText =
                `display: inline; opacity: 0;`
            buttonDesktopScreen2.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentButtonDesktopScreen2Background_Color}; color: ${currentButtonDesktopScreen2Color};`
            buttonDesktopScreen3.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentButtonDesktopScreen3Background_Color}; color: ${currentButtonDesktopScreen3Color};`
            buttonDesktopScreen4.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentButtonDesktopScreen4Background_Color}; color: ${currentButtonDesktopScreen4Color};`
            setTimeout(function() {
                buttonLigtDark.style.cssText =
                    `display: inline; opacity: 1; background-color: ${currentLightDarkBackground_Color}; color: ${currentLightDarkColor};`
                buttonLightDarkColor.style.cssText =
                    `display: inline; opacity: 1; background-color: ${currentLightDarkColorBackground_Color}; color: ${currentLightDarkColorColor};`

                buttonDesktopScreen1.style.cssText =
                    `display: inline; opacity: 1;`
                buttonDesktopScreen2.style.cssText =
                    `display: inline; opacity: 1; background-color: ${currentButtonDesktopScreen2Background_Color}; color: ${currentButtonDesktopScreen2Color};`
                buttonDesktopScreen3.style.cssText =
                    `display: inline; opacity: 1; background-color: ${currentButtonDesktopScreen3Background_Color}; color: ${currentButtonDesktopScreen3Color};`
                buttonDesktopScreen4.style.cssText =
                    `display: inline; opacity: 1; background-color: ${currentButtonDesktopScreen4Background_Color}; color: ${currentButtonDesktopScreen4Color};`
            }, 100)
        } else {
            /*if (divTextAreaCaption.value !== '') {
                divTextAreaCaption.value = ''
                divTextAreaCaption.dispatchEvent(new Event('input'))
            }*/

            buttonLigtDark.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentLightDarkBackground_Color}; color: ${currentLightDarkColor};`
            buttonLightDarkColor.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentLightDarkColorBackground_Color}; color: ${currentLightDarkColorColor};`

            buttonDesktopScreen1.style.cssText =
                `display: inline; opacity: 0;`
            buttonDesktopScreen2.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentButtonDesktopScreen2Background_Color}; color: ${currentButtonDesktopScreen2Color};`
            buttonDesktopScreen3.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentButtonDesktopScreen3Background_Color}; color: ${currentButtonDesktopScreen3Color};`
            buttonDesktopScreen4.style.cssText =
                `display: inline; opacity: 0; background-color: ${currentButtonDesktopScreen4Background_Color}; color: ${currentButtonDesktopScreen4Color};`
            setTimeout(function() {
                buttonLigtDark.style.cssText =
                    `display: none; opacity: 0; background-color: ${currentLightDarkBackground_Color}; color: ${currentLightDarkColor};`
                buttonLightDarkColor.style.cssText =
                    `display: none; opacity: 0; background-color: ${currentLightDarkColorBackground_Color}; color: ${currentLightDarkColorColor};`

                buttonDesktopScreen1.style.cssText =
                    `display: none; opacity: 0;`
                buttonDesktopScreen2.style.cssText =
                    `display: none; opacity: 0; background-color: ${currentButtonDesktopScreen2Background_Color}; color: ${currentButtonDesktopScreen2Color};`
                buttonDesktopScreen3.style.cssText =
                    `display: none; opacity: 0; background-color: ${currentButtonDesktopScreen3Background_Color}; color: ${currentButtonDesktopScreen3Color};`
                buttonDesktopScreen4.style.cssText =
                    `display: none; opacity: 0; background-color: ${currentButtonDesktopScreen4Background_Color}; color: ${currentButtonDesktopScreen4Color};`
            }, 300)

            buttonCaption.style.backgroundColor = 'var(--colorBlack)'
            buttonCaption.style.color = 'var(--colorWhite)'
            /*buttonCaption.style.cssText =
                `background-color: var(--colorBlack); color: var(--colorWhite);` //${buttonDisplay}; opacity: ${buttonOpacity};`*/
            buttonCaption.textContent = `O`
            
            abbrCaption.title = `Area de texto STATUS: off`
            
            divTextAreaCaption.style.cssText =
                `display: block; height: 0em; width: ${currentTextAreaWidth}; padding: 0px;  background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; resize: ${currentTextAreaResize};`
            setTimeout(function() {
                divTextAreaCaption.style.cssText =
                    `display: none; height: 0em; width: ${currentTextAreaWidth}; padding: 0px;  background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; resize: ${currentTextAreaResize};`
            }, 300)
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR CaptionFileMSG: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> CaptionFileMSG: ${error.message}`, setLogError)
    }
}

async function LightDarkMSG(buttonElement, IsWType) {
    try {
        let type = null
        let button = null
        let abbrButton = null
        let colorButton = null
        let textarea = null
        if (IsWType) {
            type = 'idivTextarea'
            button = 'iOnOffLightDarkMSG'
            abbrButton = 'iabbrOnOffLightDarkMSG'
            colorButton = 'iOnOffLightDarkColorMSG'
            textarea = 'itextAreaTypeMSG'
        } else {
            type = 'ifileTypeMSG'
            button = 'iOnOffLightDarkCaption'
            abbrButton = 'iabbrOnOffLightDarkCaption'
            colorButton = 'iOnOffLightDarkColorCaption'
            textarea = 'itextAreaCaption'
        }
        const divElement = buttonElement.closest(`#${type}`)
        
        const buttonLightDark = divElement.querySelector(`#${button}`)
        const abbrLightDark = divElement.querySelector(`#${abbrButton}`)
        const buttonLightDarkColor = divElement.querySelector(`#${colorButton}`)
        const textAreaDiv = divElement.querySelector(`#${textarea}`)

        const computedSyle = window.getComputedStyle(textAreaDiv)
        const currentTextAreaWidth = computedSyle.width
        const currentTextAreaHeight = computedSyle.height
        const currentTextAreaDisplay = computedSyle.display
        const currentTextAreaPadding = computedSyle.padding
        
        const computedSyle2 = window.getComputedStyle(buttonLightDark)
        const currentButtonLightDarkDisplay = computedSyle2.display
        const currentButtonLightDarkOpacity = computedSyle2.opacity
        const computedSyle3 = window.getComputedStyle(buttonLightDarkColor)
        const currentButtonLightDarkColorDisplay = computedSyle3.display
        const currentButtonLightDarkColorOpacity = computedSyle3.opacity

        const isWMode_textAreaMSG = computedSyle.backgroundColor

        const black = 'rgb(27, 27, 27)'
        const white = 'rgb(240, 240, 240)'
        const modeDark = 'rgb(33, 33, 33)'
        const modeLight = 'rgb(240, 240, 240)'
        const greenDark = 'rgb(0, 64, 52)'
        const greenLight = 'rgb(215, 241, 178)'
        if (isWMode_textAreaMSG === modeDark || isWMode_textAreaMSG === greenDark) {
            if (isWMode_textAreaMSG === modeDark) {
                buttonLightDarkColor.style.cssText =
                    `display: ${currentButtonLightDarkColorDisplay}; opacity: ${currentButtonLightDarkColorOpacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
                textAreaDiv.style.cssText =
                    `background-color: ${modeLight}; color: ${black}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; display: ${currentTextAreaDisplay}; padding: ${currentTextAreaPadding};`
            } else if (isWMode_textAreaMSG === greenDark) {
                buttonLightDarkColor.style.cssText =
                    `display: ${currentButtonLightDarkColorDisplay}; opacity: ${currentButtonLightDarkColorOpacity}; background-color: ${greenLight}; color: ${black};`
                textAreaDiv.style.cssText =
                    `background-color: ${greenLight}; color: ${black}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; display: ${currentTextAreaDisplay}; padding: ${currentTextAreaPadding};`
            }
            
            buttonLightDark.style.cssText =
                `display: ${currentButtonLightDarkDisplay}; opacity: ${currentButtonLightDarkOpacity}; background-color: ${modeLight}; color: ${black}`
            buttonLightDark.textContent = `-`
            abbrLightDark.title = `Modo Claro/Escuro STATUS: claro`
        } else if (isWMode_textAreaMSG === modeLight || isWMode_textAreaMSG === greenLight) {
            if (isWMode_textAreaMSG === modeLight) {
                buttonLightDarkColor.style.cssText =
                    `display: ${currentButtonLightDarkColorDisplay}; opacity: ${currentButtonLightDarkColorOpacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
                textAreaDiv.style.cssText =
                    `background-color: ${modeDark}; color: ${white}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; display: ${currentTextAreaDisplay}; padding: ${currentTextAreaPadding};`
            } else if (isWMode_textAreaMSG === greenLight) {
                buttonLightDarkColor.style.cssText =
                    `display: ${currentButtonLightDarkColorDisplay}; opacity: ${currentButtonLightDarkColorOpacity}; background-color: ${greenDark}; color: ${white};`
                textAreaDiv.style.cssText =
                    `background-color: ${greenDark}; color: ${white}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; display: ${currentTextAreaDisplay}; padding: ${currentTextAreaPadding};`
            }
            
            buttonLightDark.style.cssText =
                `display: ${currentButtonLightDarkDisplay}; opacity: ${currentButtonLightDarkOpacity}; background-color: ${modeDark}; color: ${white}`
            buttonLightDark.textContent = `O`
            abbrLightDark.title = `Modo Claro/Escuro STATUS: escuro`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR LightDarkMSG: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> LightDarkMSG: ${error.message}`, setLogError)
    }
}
async function LightDarkColorMSG(buttonElement, IsWType) {
    try {
        let type = null
        let abbrButton = null
        let colorButton = null
        let textarea = null
        if (IsWType) {
            type = 'idivTextarea'
            abbrButton = 'iabbrOnOffLightDarkColorMSG'
            colorButton = 'iOnOffLightDarkColorMSG'
            textarea = 'itextAreaTypeMSG'
        } else {
            type = 'ifileTypeMSG'
            abbrButton = 'iabbrOnOffLightDarkColorCaption'
            colorButton = 'iOnOffLightDarkColorCaption'
            textarea = 'itextAreaCaption'
        }
        const divElement = buttonElement.closest(`#${type}`)
        
        const abbrColor = divElement.querySelector(`#${abbrButton}`)
        const buttonLightDarkColor = divElement.querySelector(`#${colorButton}`)
        const textAreaDiv = divElement.querySelector(`#${textarea}`)

        const computedSyle = window.getComputedStyle(textAreaDiv)
        const currentTextAreaWidth = computedSyle.width
        const currentTextAreaHeight = computedSyle.height
        const currentTextAreaDisplay = computedSyle.display
        const currentTextAreaPadding = computedSyle.padding
        
        const computedSyle2 = window.getComputedStyle(buttonLightDarkColor)
        const currentButtonLightDarkColorDisplay = computedSyle2.display
        const currentButtonLightDarkColorOpacity = computedSyle2.opacity

        const isWMode_textAreaMSG = computedSyle.backgroundColor
        
        
        const black = 'rgb(27, 27, 27)'
        const white = 'rgb(240, 240, 240)'
        const modeDark = 'rgb(33, 33, 33)'
        const modeLight = 'rgb(240, 240, 240)'
        const greenDark = 'rgb(0, 64, 52)'
        const greenLight = 'rgb(215, 241, 178)'
        if (isWMode_textAreaMSG === modeDark || isWMode_textAreaMSG === modeLight) {
            if (isWMode_textAreaMSG === modeDark) {
                buttonLightDarkColor.style.cssText =
                    `display: ${currentButtonLightDarkColorDisplay}; opacity: ${currentButtonLightDarkColorOpacity}; background-color: ${greenDark}; color: ${white};`
                textAreaDiv.style.cssText =
                    `background-color: ${greenDark}; color: ${white}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; display: ${currentTextAreaDisplay}; padding: ${currentTextAreaPadding};`
            } else if (isWMode_textAreaMSG === modeLight){
                buttonLightDarkColor.style.cssText =
                    `display: ${currentButtonLightDarkColorDisplay}; opacity: ${currentButtonLightDarkColorOpacity}; background-color: ${greenLight}; color: ${black};`
                textAreaDiv.style.cssText =
                    `background-color: ${greenLight}; color: ${black}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; display: ${currentTextAreaDisplay}; padding: ${currentTextAreaPadding};`
            }
                
            buttonLightDarkColor.textContent = `-`
            abbrColor.title = `Modo Cliente/Usuario STATUS: usuario`
        } else if (isWMode_textAreaMSG === greenDark || isWMode_textAreaMSG === greenLight) {
            if (isWMode_textAreaMSG === greenDark) {
                textAreaDiv.style.cssText =
                    `background-color: ${modeDark}; color: ${white}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; display: ${currentTextAreaDisplay}; padding: ${currentTextAreaPadding};`
            } else if (isWMode_textAreaMSG === greenLight){
                textAreaDiv.style.cssText =
                    `background-color: ${modeLight}; color: ${black}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; display: ${currentTextAreaDisplay}; padding: ${currentTextAreaPadding};`
            }
                    
            buttonLightDarkColor.style.cssText =
                `display: ${currentButtonLightDarkColorDisplay}; opacity: ${currentButtonLightDarkColorOpacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonLightDarkColor.textContent = `O`
            abbrColor.title = `Modo Cliente/Usuario STATUS: cliente`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR LightDarkColorMSG: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> LightDarkColorMSG: ${error.message}`, setLogError)
    }
}

async function resetScreenSetup(buttonElement, IsWType) {
    try {
        let type = null
        let button2 = null
        let abbr2 = null
        let button3 = null
        let abbr3 = null
        let button4 = null
        let abbr4 = null
        let textarea = null
        if (IsWType) {
            type = 'idivTextarea'
            button2 = 'iOnOffVLockScreenSetupText2'
            abbr2 = 'iabbrOnOffVLockScreenSetupText2'
            button3 = 'iOnOffDesktopScreenSetupText3'
            abbr3 = 'iabbrOnOffDesktopScreenSetupText3'
            button4 = 'iOnOffPhoneScreenSetupText4'
            abbr4 = 'iabbrOnOffPhoneScreenSetupText4'
            textarea = 'itextAreaTypeMSG'
        } else {
            type = 'ifileTypeMSG'
            button2 = 'iOnOffVLockScreenSetupCaption2'
            abbr2 = 'iabbrOnOffVLockScreenSetupCaption2'
            button3 = 'iOnOffDesktopScreenSetupCaption3'
            abbr3 = 'iabbrOnOffDesktopScreenSetupCaption3'
            button4 = 'iOnOffPhoneScreenSetupCaption4'
            abbr4 = 'iabbrOnOffPhoneScreenSetupCaption4'
            textarea = 'itextAreaCaption'
        }
        const divElement = buttonElement.closest(`#${type}`)
        
        const buttonDesktopScreen2 = divElement.querySelector(`#${button2}`)
        const abbrDesktopScreen2 = divElement.querySelector(`#${abbr2}`)
        const buttonDesktopScreen3 = divElement.querySelector(`#${button3}`)
        const abbrDesktopScreen3 = divElement.querySelector(`#${abbr3}`)
        const buttonDesktopScreen4 = divElement.querySelector(`#${button4}`)
        const abbrDesktopScreen4 = divElement.querySelector(`#${abbr4}`)
        const textAreaMSG = divElement.querySelector(`#${textarea}`)
        
        const computedSyle = window.getComputedStyle(textAreaMSG)
        const currentTextAreaBackground_Color = computedSyle.backgroundColor
        const currentTextAreaColor = computedSyle.color
        const currentTextAreaDisplay = computedSyle.display
        
        let buttonDesktopScreen1 = null
        let computedSyle2 = null
        let currentButtonDesktopScreen1Display = null
        let currentButtonDesktopScreen1Opacity = null
        let computedSyle3 = null
        let currentButtonDesktopScreen2Display = null
        let currentButtonDesktopScreen2Opacity = null
        let computedSyle4 = null
        let currentButtonDesktopScreen3Display = null
        let currentButtonDesktopScreen3Opacity = null
        let computedSyle5 = null
        let currentButtonDesktopScreen4Display = null
        let currentButtonDesktopScreen4Opacity = null

        if (IsWType) {
            buttonDesktopScreen2.style.cssText =
                `background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen2.textContent = `O`
            abbrDesktopScreen2.title = `VLock Tela STATUS: off`
            buttonDesktopScreen3.style.cssText =
                `background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen3.textContent = `O`
            abbrDesktopScreen3.title = `PC Tela STATUS: off`
            buttonDesktopScreen4.style.cssText =
                `background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen4.textContent = `O`
            abbrDesktopScreen4.title = `Celular Tela STATUS: off`
        } else {
            buttonDesktopScreen1 = divElement.querySelector(`#iOnOffResetScreenSetupCaption1`)
            computedSyle2 = window.getComputedStyle(buttonDesktopScreen1)
            currentButtonDesktopScreen1Display = computedSyle2.display
            currentButtonDesktopScreen1Opacity = computedSyle2.opacity
            computedSyle3 = window.getComputedStyle(buttonDesktopScreen2)
            currentButtonDesktopScreen2Display = computedSyle3.display
            currentButtonDesktopScreen2Opacity = computedSyle3.opacity
            computedSyle4 = window.getComputedStyle(buttonDesktopScreen3)
            currentButtonDesktopScreen3Display = computedSyle4.display
            currentButtonDesktopScreen3Opacity = computedSyle4.opacity
            computedSyle5 = window.getComputedStyle(buttonDesktopScreen4)
            currentButtonDesktopScreen4Display = computedSyle5.display
            currentButtonDesktopScreen4Opacity = computedSyle5.opacity
            
            buttonDesktopScreen1.style.cssText =
                `display: ${currentButtonDesktopScreen1Display}; opacity: ${currentButtonDesktopScreen1Opacity};`

            buttonDesktopScreen2.style.cssText =
                `display: ${currentButtonDesktopScreen2Display}; opacity: ${currentButtonDesktopScreen2Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen2.textContent = `O`
            abbrDesktopScreen2.title = `VLock Tela STATUS: off`
            buttonDesktopScreen3.style.cssText =
                `display: ${currentButtonDesktopScreen3Display}; opacity: ${currentButtonDesktopScreen3Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen3.textContent = `O`
            abbrDesktopScreen3.title = `PC Tela STATUS: off`
            buttonDesktopScreen4.style.cssText =
                `display: ${currentButtonDesktopScreen4Display}; opacity: ${currentButtonDesktopScreen4Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen4.textContent = `O`
            abbrDesktopScreen4.title = `Celular Tela STATUS: off`
        }

        textAreaMSG.style.cssText =
            `display: ${currentTextAreaDisplay}; background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; width: 100%; height: 13em; resize: both;`
    } catch (error) {
        console.error(`> ⚠️ ERROR resetScreenSetup: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> resetScreenSetup: ${error.message}`, setLogError)
    }
}
async function VLockScreenSetup(buttonElement, IsWType) {
    try {
        let type = null
        let button2 = null
        let abbr2 = null
        let button3 = null
        let abbr3 = null
        let button4 = null
        let abbr4 = null
        let textarea = null
        if (IsWType) {
            type = 'idivTextarea'
            button2 = 'iOnOffVLockScreenSetupText2'
            abbr2 = 'iabbrOnOffVLockScreenSetupText2'
            button3 = 'iOnOffDesktopScreenSetupText3'
            abbr3 = 'iabbrOnOffDesktopScreenSetupText3'
            button4 = 'iOnOffPhoneScreenSetupText4'
            abbr4 = 'iabbrOnOffPhoneScreenSetupText4'
            textarea = 'itextAreaTypeMSG'
        } else {
            type = 'ifileTypeMSG'
            button2 = 'iOnOffVLockScreenSetupCaption2'
            abbr2 = 'iabbrOnOffVLockScreenSetupCaption2'
            button3 = 'iOnOffDesktopScreenSetupCaption3'
            abbr3 = 'iabbrOnOffDesktopScreenSetupCaption3'
            button4 = 'iOnOffPhoneScreenSetupCaption4'
            abbr4 = 'iabbrOnOffPhoneScreenSetupCaption4'
            textarea = 'itextAreaCaption'
        }
        const divElement = buttonElement.closest(`#${type}`)
        
        const buttonDesktopScreen2 = divElement.querySelector(`#${button2}`)
        const abbrDesktopScreen2 = divElement.querySelector(`#${abbr2}`)
        const buttonDesktopScreen3 = divElement.querySelector(`#${button3}`)
        const abbrDesktopScreen3 = divElement.querySelector(`#${abbr3}`)
        const buttonDesktopScreen4 = divElement.querySelector(`#${button4}`)
        const abbrDesktopScreen4 = divElement.querySelector(`#${abbr4}`)
        const textAreaMSG = divElement.querySelector(`#${textarea}`)
        const computedSyle = window.getComputedStyle(textAreaMSG)
        const currentTextAreaWidth = computedSyle.width
        const currentTextAreaHeight = computedSyle.height
        const currentTextAreaBackground_Color = computedSyle.backgroundColor
        const currentTextAreaColor = computedSyle.color
        const currentTextAreaDisplay = computedSyle.display
        
        let buttonDesktopScreen1 = null
        let computedSyle2 = null
        let currentButtonDesktopScreen1Display = null
        let currentButtonDesktopScreen1Opacity = null
        let computedSyle3 = null
        let currentButtonDesktopScreen2Display = null
        let currentButtonDesktopScreen2Opacity = null
        let computedSyle4 = null
        let currentButtonDesktopScreen3Display = null
        let currentButtonDesktopScreen3Opacity = null
        let computedSyle5 = null
        let currentButtonDesktopScreen4Display = null
        let currentButtonDesktopScreen4Opacity = null

        if (IsWType) {
            buttonDesktopScreen3.style.cssText =
                `background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen3.textContent = `O`
            abbrDesktopScreen3.title = `PC Tela STATUS: off`
            buttonDesktopScreen4.style.cssText =
                `background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen4.textContent = `O`
            abbrDesktopScreen4.title = `Celular Tela STATUS: off`
        } else {
            buttonDesktopScreen1 = divElement.querySelector(`#iOnOffResetScreenSetupCaption1`)
            computedSyle2 = window.getComputedStyle(buttonDesktopScreen1)
            currentButtonDesktopScreen1Display = computedSyle2.display
            currentButtonDesktopScreen1Opacity = computedSyle2.opacity
            computedSyle3 = window.getComputedStyle(buttonDesktopScreen2)
            currentButtonDesktopScreen2Display = computedSyle3.display
            currentButtonDesktopScreen2Opacity = computedSyle3.opacity
            computedSyle4 = window.getComputedStyle(buttonDesktopScreen3)
            currentButtonDesktopScreen3Display = computedSyle4.display
            currentButtonDesktopScreen3Opacity = computedSyle4.opacity
            computedSyle5 = window.getComputedStyle(buttonDesktopScreen4)
            currentButtonDesktopScreen4Display = computedSyle5.display
            currentButtonDesktopScreen4Opacity = computedSyle5.opacity
            
            buttonDesktopScreen1.style.cssText =
                `display: ${currentButtonDesktopScreen1Display}; opacity: ${currentButtonDesktopScreen1Opacity};`

            buttonDesktopScreen3.style.cssText =
                `display: ${currentButtonDesktopScreen3Display}; opacity: ${currentButtonDesktopScreen3Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen3.textContent = `O`
            abbrDesktopScreen3.title = `PC Tela STATUS: off`
            buttonDesktopScreen4.style.cssText =
                `display: ${currentButtonDesktopScreen4Display}; opacity: ${currentButtonDesktopScreen4Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen4.textContent = `O`
            abbrDesktopScreen4.title = `Celular Tela STATUS: off`
        }
            
        const isWMode_abbrDesktopScreen2 = abbrDesktopScreen2.title

        if (isWMode_abbrDesktopScreen2 === 'VLock Tela STATUS: off') {
            buttonDesktopScreen2.style.cssText =
                `display: ${currentButtonDesktopScreen2Display}; opacity: ${currentButtonDesktopScreen2Opacity}; background-color: var(--colorWhite); color: var(--colorBlack);`
            buttonDesktopScreen2.textContent = `-`
            abbrDesktopScreen2.title = `VLock Tela STATUS: on`
        
            textAreaMSG.style.cssText =
                `display: ${currentTextAreaDisplay}; background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; resize: vertical;`
        } else {
            buttonDesktopScreen2.style.cssText =
                `display: ${currentButtonDesktopScreen2Display}; opacity: ${currentButtonDesktopScreen2Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen2.textContent = `O`
        
            abbrDesktopScreen2.title = `VLock Tela STATUS: off`
            
            textAreaMSG.style.cssText =
                `display: ${currentTextAreaDisplay}; background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; width: ${currentTextAreaWidth}; height: ${currentTextAreaHeight}; resize: both;`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR VlockScreenSetup: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> VlockScreenSetup: ${error.message}`, setLogError)
    }
}
async function desktopScreenSetup(buttonElement, IsWType) {
    try {
        let type = null
        let button2 = null
        let abbr2 = null
        let button3 = null
        let abbr3 = null
        let button4 = null
        let abbr4 = null
        let textarea = null
        if (IsWType) {
            type = 'idivTextarea'
            button2 = 'iOnOffVLockScreenSetupText2'
            abbr2 = 'iabbrOnOffVLockScreenSetupText2'
            button3 = 'iOnOffDesktopScreenSetupText3'
            abbr3 = 'iabbrOnOffDesktopScreenSetupText3'
            button4 = 'iOnOffPhoneScreenSetupText4'
            abbr4 = 'iabbrOnOffPhoneScreenSetupText4'
            textarea = 'itextAreaTypeMSG'
        } else {
            type = 'ifileTypeMSG'
            button2 = 'iOnOffVLockScreenSetupCaption2'
            abbr2 = 'iabbrOnOffVLockScreenSetupCaption2'
            button3 = 'iOnOffDesktopScreenSetupCaption3'
            abbr3 = 'iabbrOnOffDesktopScreenSetupCaption3'
            button4 = 'iOnOffPhoneScreenSetupCaption4'
            abbr4 = 'iabbrOnOffPhoneScreenSetupCaption4'
            textarea = 'itextAreaCaption'
        }
        const divElement = buttonElement.closest(`#${type}`)
        
        const buttonDesktopScreen2 = divElement.querySelector(`#${button2}`)
        const abbrDesktopScreen2 = divElement.querySelector(`#${abbr2}`)
        const buttonDesktopScreen3 = divElement.querySelector(`#${button3}`)
        const abbrDesktopScreen3 = divElement.querySelector(`#${abbr3}`)
        const buttonDesktopScreen4 = divElement.querySelector(`#${button4}`)
        const abbrDesktopScreen4 = divElement.querySelector(`#${abbr4}`)
        const textAreaMSG = divElement.querySelector(`#${textarea}`)
        const computedSyle = window.getComputedStyle(textAreaMSG)
        const currentTextAreaHeight = computedSyle.height
        const currentTextAreaBackground_Color = computedSyle.backgroundColor
        const currentTextAreaColor = computedSyle.color
        const currentTextAreaDisplay = computedSyle.display

        let buttonDesktopScreen1 = null
        let computedSyle2 = null
        let currentButtonDesktopScreen1Display = null
        let currentButtonDesktopScreen1Opacity = null
        let computedSyle3 = null
        let currentButtonDesktopScreen2Display = null
        let currentButtonDesktopScreen2Opacity = null
        let computedSyle4 = null
        let currentButtonDesktopScreen3Display = null
        let currentButtonDesktopScreen3Opacity = null
        let computedSyle5 = null
        let currentButtonDesktopScreen4Display = null
        let currentButtonDesktopScreen4Opacity = null

        if (IsWType) {
            buttonDesktopScreen2.style.cssText =
                `background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen2.textContent = `O`
            abbrDesktopScreen2.title = `VLock Tela STATUS: off`
            buttonDesktopScreen4.style.cssText =
                `background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen4.textContent = `O`
            abbrDesktopScreen4.title = `Celular Tela STATUS: off`
        } else {
            buttonDesktopScreen1 = divElement.querySelector(`#iOnOffResetScreenSetupCaption1`)
            computedSyle2 = window.getComputedStyle(buttonDesktopScreen1)
            currentButtonDesktopScreen1Display = computedSyle2.display
            currentButtonDesktopScreen1Opacity = computedSyle2.opacity
            computedSyle3 = window.getComputedStyle(buttonDesktopScreen2)
            currentButtonDesktopScreen2Display = computedSyle3.display
            currentButtonDesktopScreen2Opacity = computedSyle3.opacity
            computedSyle4 = window.getComputedStyle(buttonDesktopScreen3)
            currentButtonDesktopScreen3Display = computedSyle4.display
            currentButtonDesktopScreen3Opacity = computedSyle4.opacity
            computedSyle5 = window.getComputedStyle(buttonDesktopScreen4)
            currentButtonDesktopScreen4Display = computedSyle5.display
            currentButtonDesktopScreen4Opacity = computedSyle5.opacity
            
            buttonDesktopScreen1.style.cssText =
                `display: ${currentButtonDesktopScreen1Display}; opacity: ${currentButtonDesktopScreen1Opacity};`

            buttonDesktopScreen2.style.cssText =
                `display: ${currentButtonDesktopScreen2Display}; opacity: ${currentButtonDesktopScreen2Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen2.textContent = `O`
            abbrDesktopScreen2.title = `VLock Tela STATUS: off`
            buttonDesktopScreen4.style.cssText =
                `display: ${currentButtonDesktopScreen4Display}; opacity: ${currentButtonDesktopScreen4Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen4.textContent = `O`
            abbrDesktopScreen4.title = `Celular Tela STATUS: off`
        }

        const isWMode_abbrDesktopScreen3 = abbrDesktopScreen3.title

        if (isWMode_abbrDesktopScreen3 === 'PC Tela STATUS: off') {
            buttonDesktopScreen3.style.cssText =
                `display: ${currentButtonDesktopScreen3Display}; opacity: ${currentButtonDesktopScreen3Opacity}; background-color: var(--colorWhite); color: var(--colorBlack);`
            buttonDesktopScreen3.textContent = `-`
            abbrDesktopScreen3.title = `PC Tela STATUS: on`
        
            textAreaMSG.style.cssText =
                `display: ${currentTextAreaDisplay}; background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; width: 44.35em; height: ${currentTextAreaHeight}; resize: vertical;`
        } else {
            buttonDesktopScreen3.style.cssText =
                `display: ${currentButtonDesktopScreen3Display}; opacity: ${currentButtonDesktopScreen3Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen3.textContent = `O`
        
            abbrDesktopScreen3.title = `PC Tela STATUS: off`
            
            textAreaMSG.style.cssText =
                `display: ${currentTextAreaDisplay}; background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; width: 100%; height: ${currentTextAreaHeight}; resize: both;`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR desktopScreenSetup: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> desktopScreenSetup: ${error.message}`, setLogError)
    }
}
async function phoneScreenSetup(buttonElement, IsWType) {
    try {
        let type = null
        let button2 = null
        let abbr2 = null
        let button3 = null
        let abbr3 = null
        let button4 = null
        let abbr4 = null
        let textarea = null
        if (IsWType) {
            type = 'idivTextarea'
            button2 = 'iOnOffVLockScreenSetupText2'
            abbr2 = 'iabbrOnOffVLockScreenSetupText2'
            button3 = 'iOnOffDesktopScreenSetupText3'
            abbr3 = 'iabbrOnOffDesktopScreenSetupText3'
            button4 = 'iOnOffPhoneScreenSetupText4'
            abbr4 = 'iabbrOnOffPhoneScreenSetupText4'
            textarea = 'itextAreaTypeMSG'
        } else {
            type = 'ifileTypeMSG'
            button2 = 'iOnOffVLockScreenSetupCaption2'
            abbr2 = 'iabbrOnOffVLockScreenSetupCaption2'
            button3 = 'iOnOffDesktopScreenSetupCaption3'
            abbr3 = 'iabbrOnOffDesktopScreenSetupCaption3'
            button4 = 'iOnOffPhoneScreenSetupCaption4'
            abbr4 = 'iabbrOnOffPhoneScreenSetupCaption4'
            textarea = 'itextAreaCaption'
        }
        const divElement = buttonElement.closest(`#${type}`)
        
        const buttonDesktopScreen2 = divElement.querySelector(`#${button2}`)
        const abbrDesktopScreen2 = divElement.querySelector(`#${abbr2}`)
        const buttonDesktopScreen3 = divElement.querySelector(`#${button3}`)
        const abbrDesktopScreen3 = divElement.querySelector(`#${abbr3}`)
        const buttonDesktopScreen4 = divElement.querySelector(`#${button4}`)
        const abbrDesktopScreen4 = divElement.querySelector(`#${abbr4}`)
        const textAreaMSG = divElement.querySelector(`#${textarea}`)
        const computedSyle = window.getComputedStyle(textAreaMSG)
        const currentTextAreaHeight = computedSyle.height
        const currentTextAreaBackground_Color = computedSyle.backgroundColor
        const currentTextAreaColor = computedSyle.color
        const currentTextAreaDisplay = computedSyle.display

        let buttonDesktopScreen1 = null
        let computedSyle2 = null
        let currentButtonDesktopScreen1Display = null
        let currentButtonDesktopScreen1Opacity = null
        let computedSyle3 = null
        let currentButtonDesktopScreen2Display = null
        let currentButtonDesktopScreen2Opacity = null
        let computedSyle4 = null
        let currentButtonDesktopScreen3Display = null
        let currentButtonDesktopScreen3Opacity = null
        let computedSyle5 = null
        let currentButtonDesktopScreen4Display = null
        let currentButtonDesktopScreen4Opacity = null

        if (IsWType) {
            buttonDesktopScreen2.style.cssText =
                'background-color: var(--colorBlack); color: var(--colorWhite);'
            buttonDesktopScreen2.textContent = `O`
            abbrDesktopScreen2.title = `VLock Tela STATUS: off`
            buttonDesktopScreen3.style.cssText =
                'background-color: var(--colorBlack); color: var(--colorWhite);'
            buttonDesktopScreen3.textContent = `O`
            abbrDesktopScreen3.title = `PC Tela STATUS: off`
        } else {
            buttonDesktopScreen1 = divElement.querySelector(`#iOnOffResetScreenSetupCaption1`)
            computedSyle2 = window.getComputedStyle(buttonDesktopScreen1)
            currentButtonDesktopScreen1Display = computedSyle2.display
            currentButtonDesktopScreen1Opacity = computedSyle2.opacity
            computedSyle3 = window.getComputedStyle(buttonDesktopScreen2)
            currentButtonDesktopScreen2Display = computedSyle3.display
            currentButtonDesktopScreen2Opacity = computedSyle3.opacity
            computedSyle4 = window.getComputedStyle(buttonDesktopScreen3)
            currentButtonDesktopScreen3Display = computedSyle4.display
            currentButtonDesktopScreen3Opacity = computedSyle4.opacity
            computedSyle5 = window.getComputedStyle(buttonDesktopScreen4)
            currentButtonDesktopScreen4Display = computedSyle5.display
            currentButtonDesktopScreen4Opacity = computedSyle5.opacity
            
            buttonDesktopScreen1.style.cssText =
                `display: ${currentButtonDesktopScreen1Display}; opacity: ${currentButtonDesktopScreen1Opacity};`

            buttonDesktopScreen2.style.cssText =
                `display: ${currentButtonDesktopScreen2Display}; opacity: ${currentButtonDesktopScreen2Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen2.textContent = `O`
            abbrDesktopScreen2.title = `VLock Tela STATUS: off`
            buttonDesktopScreen3.style.cssText =
                `display: ${currentButtonDesktopScreen3Display}; opacity: ${currentButtonDesktopScreen3Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen3.textContent = `O`
            abbrDesktopScreen3.title = `PC Tela STATUS: off`
        }

        const isWMode_abbrDesktopScreen4 = abbrDesktopScreen4.title

        if (isWMode_abbrDesktopScreen4 === 'Celular Tela STATUS: off') {
            buttonDesktopScreen4.style.cssText =
                `display: ${currentButtonDesktopScreen4Display}; opacity: ${currentButtonDesktopScreen4Opacity}; background-color: var(--colorWhite); color: var(--colorBlack);`
            buttonDesktopScreen4.textContent = `-`
            abbrDesktopScreen4.title = `Celular Tela STATUS: on`
        
            textAreaMSG.style.cssText =
                `display: ${currentTextAreaDisplay}; background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; width: 23.35em; height: ${currentTextAreaHeight}; resize: vertical;`
        } else {
            buttonDesktopScreen4.style.cssText =
                `display: ${currentButtonDesktopScreen4Display}; opacity: ${currentButtonDesktopScreen4Opacity}; background-color: var(--colorBlack); color: var(--colorWhite);`
            buttonDesktopScreen4.textContent = `O`
        
            abbrDesktopScreen4.title = `Celular Tela STATUS: off`
            
            textAreaMSG.style.cssText =
                `display: ${currentTextAreaDisplay}; background-color: ${currentTextAreaBackground_Color}; color: ${currentTextAreaColor}; width: 100%; height: ${currentTextAreaHeight}; resize: both;`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR phoneScreenSetup: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> phoneScreenSetup: ${error.message}`, setLogError)
    }
}

//pro sistemas de mandar arquivo, as funcoes a adicionar... um botao que deseleciona o arquivo e um pra apagar do funil o card(isso de apagar o card vai ter em todos os tipos de cards do funil) e pra poder apagar o card tera que deseleciona primeiro entao faze um esquema de desgin que no lugar do botao pra deseleciona dps de clical muda pro apagar, e tbm algum esqueme de dps de selecionar mandar enviar ele retrai o tamanho pra n ficar mt grande na tela ne e talves tirar a funcao de arrasta pra mandar ou sla, e claro em todos os card tem do lado um lugar que vc pega seleciona segurando e deixa onde na posica odo funil ele vai ficar e tals personalizavel
async function getFileData(divElementBridge, file) {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const divElement = divElementBridge.closest('.fileTypeMSG')
        const divFunctions = divElement.querySelector('#idivFileFunctions')
        const typeFile = divElement.querySelector('#ifileTypeSelected')
        
        const buttonStateTyping = divElement.querySelector('#iOnOffStateTypingFile')
        const buttonStateRecording = divElement.querySelector('#iOnOffStateRecordingFile')

        const buttonCaption = divElement.querySelector('#iOnOffCaption')

        let buttonErasePositionMSG = null

        let divDelayStateTypingRecording = null
        let computedSyle = null
        let currentDivDelayStateTypingDisplay = null
        let computedSyle2 = null
        let currentButtonStateTypingDisplay = null
        let computedSyle3 = null
        let currentButtonStateRecordingDisplay = null

        let divTextAreaCaption = null
        let abbrDivTextAreaCaption = null
        let computedSyle4 = null
        let currentDivTextAreaCaptionDisplay = null

        let divDelayTextAudioTitle = null
        
        console.log(file)
        if (file === null || file === undefined || file === '...') {
            await sendToFunil(divElementBridge, 3, '', file)
            
            typeFile.textContent = `...`
            
            divFunctions.style.cssText =
                'display: flex; border: 0px solid var(--colorBlack); border-bottom: 0px solid var(--colorBlack); height: 0;'
            setTimeout(function() {
                divFunctions.style.cssText =
                    'display: none; border: 0px solid var(--colorBlack); border-bottom: 0px solid var(--colorBlack); height: 0;' 
            }, 100)


            const divPosition = divElement.parentElement.parentElement
            buttonErasePositionMSG = divPosition.querySelector(`#ierasePositionMSG`)
            const IdDivPosition = divPosition.id
            const IdNumberPosition = IdDivPosition.match(/\d+/g)
            buttonErasePositionMSG.title = `Deletar posição MSG (${IdNumberPosition})`

            await resetScreenSetup(divElementBridge, false)
            divDelayStateTypingRecording = divElement.querySelector('#idivDelayTextAudio')
            computedSyle = window.getComputedStyle(divDelayStateTypingRecording)
            currentDivDelayStateTypingDisplay = computedSyle.display
            computedSyle2 = window.getComputedStyle(buttonStateTyping)
            currentButtonStateTypingDisplay = computedSyle2.display
            computedSyle3 = window.getComputedStyle(buttonStateRecording)
            currentButtonStateRecordingDisplay = computedSyle3.display
            if (currentButtonStateTypingDisplay === 'inline-block') {
                if (currentDivDelayStateTypingDisplay === 'flex') {
                    await StateTypingMSG(divElementBridge, false)
                }
            } else if (currentButtonStateRecordingDisplay === 'inline-block') {
                if (currentDivDelayStateTypingDisplay === 'flex') {
                    await StateRecordingMSG(divElementBridge)
                }
            }
            buttonStateTyping.style.cssText =
                `display: none; opacity: 0;`
            buttonStateRecording.style.cssText =
                `display: none; opacity: 0;`
            buttonCaption.style.cssText =
                `display: none; opacity: 0;`
            divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
            computedSyle4 = window.getComputedStyle(divTextAreaCaption)
            currentDivTextAreaCaptionDisplay = computedSyle4.display
            if (currentDivTextAreaCaptionDisplay === 'block') {
                await CaptionFileMSG(divElementBridge)
            }
            divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
            abbrDivTextAreaCaption = divElement.querySelector(`#iabbrtextAreaCaption`)
            divTextAreaCaption.placeholder = `Legenda do (...): >...`
            abbrDivTextAreaCaption.title = `Digite a legenda do (...)`
            divDelayTextAudioTitle = divElement.querySelector(`#idelayTextAudioTitle`) 
            divDelayTextAudioTitle.textContent = 'ATRASO-State=Typing&Recording:'

            resetLoadingBar()
            return
        } else {
            /*if (divElement.querySelector('input#ifileTypeMSGAux[type="file"]').files[0] ) {   
                if (file === divElement.querySelector('input#ifileTypeMSGAux[type="file"]').files[0]) {
                    displayOnConsole('cuuuuuuuuuuu')
                    await sendToFunil(divElementBridge, 3, null, file)
                    return
                }
            }*/
            divFunctions.style.cssText =
                'display: flex; border: 0px solid var(--colorBlack); border-bottom: 0px solid var(--colorBlack); height: 0;'
            setTimeout(function() {
                divFunctions.style.cssText =
                    'display: flex; border: 2px solid var(--colorBlack); border-bottom: 3.5px solid var(--colorBlack); height: 5vh;'//mudar o 5vh n fica bom pra diferentes telas
            }, 300)

            const divPosition = divElement.parentElement.parentElement
            buttonErasePositionMSG = divPosition.querySelector(`#ierasePositionMSG`)
            buttonErasePositionMSG.title = `Deselecionar arquivo (${file.name})`

            //melhora esse de reseta o style de tudo tbm pra cada file novo ou igual, talves verificar ser o file é igual ou novo se n ele fas nada sla
            //displayOnConsole(file.type)
            const fileType = file.type
            switch (fileType) {//conforme vai indo adicionar o maximo possivel de tipos de arquivos para cada e assim ser mais completo e preciso
                case 'video/mp4':
                case 'video/avi':
                case 'video/mov':
                case 'video/mkv':
                    typeFile.textContent = `video`
                    
                    await resetScreenSetup(divElementBridge, false)
                    divDelayStateTypingRecording = divElement.querySelector('#idivDelayTextAudio')
                    computedSyle = window.getComputedStyle(divDelayStateTypingRecording)
                    currentDivDelayStateTypingDisplay = computedSyle.display
                    computedSyle2 = window.getComputedStyle(buttonStateTyping)
                    currentButtonStateTypingDisplay = computedSyle2.display
                    computedSyle3 = window.getComputedStyle(buttonStateRecording)
                    currentButtonStateRecordingDisplay = computedSyle3.display
                    if (currentButtonStateTypingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateTypingMSG(divElementBridge, false)
                        }
                    } else if (currentButtonStateRecordingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateRecordingMSG(divElementBridge)
                        }
                    }
                    buttonStateTyping.style.cssText =
                        `display: none; opacity: 0;`
                    buttonStateRecording.style.cssText =
                        `display: none; opacity: 0;`
                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    computedSyle4 = window.getComputedStyle(divTextAreaCaption)
                    currentDivTextAreaCaptionDisplay = computedSyle4.display
                    if (currentDivTextAreaCaptionDisplay === 'block') {
                        await CaptionFileMSG(divElementBridge)
                    }

                    buttonCaption.style.cssText =
                        `display: inline; opacity: 0;`
                    setTimeout(function() {
                        buttonCaption.style.cssText =
                            `display: inline; opacity: 1;`
                    }, 300)

                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    abbrDivTextAreaCaption = divElement.querySelector(`#iabbrtextAreaCaption`)
                    divTextAreaCaption.placeholder = `Legenda do (${file.name || 'arquivo'}): >...`
                    abbrDivTextAreaCaption.title = `Digite a legenda do (${file.name || 'arquivo'})`
                    divDelayTextAudioTitle = divElement.querySelector(`#idelayTextAudioTitle`) 
                    divDelayTextAudioTitle.textContent = 'ATRASO-State=Typing&Recording:'

                    await sendToFunil(divElementBridge, 3, 'video', file)//

                    break;
                case 'audio/x-m4a':
                case 'audio/wav':
                case 'audio/mp3':
                case 'audio/gif':
                    typeFile.textContent = `audio`

                    await resetScreenSetup(divElementBridge, false)
                    divDelayStateTypingRecording = divElement.querySelector('#idivDelayTextAudio')
                    computedSyle = window.getComputedStyle(divDelayStateTypingRecording)
                    currentDivDelayStateTypingDisplay = computedSyle.display
                    computedSyle2 = window.getComputedStyle(buttonStateTyping)
                    currentButtonStateTypingDisplay = computedSyle2.display
                    computedSyle3 = window.getComputedStyle(buttonStateRecording)
                    currentButtonStateRecordingDisplay = computedSyle3.display
                    if (currentButtonStateTypingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateTypingMSG(divElementBridge, false)
                        }
                    } else if (currentButtonStateRecordingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateRecordingMSG(divElementBridge)
                        }
                    }
                    buttonStateTyping.style.cssText =
                        `display: none; opacity: 0;`
                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    computedSyle4 = window.getComputedStyle(divTextAreaCaption)
                    currentDivTextAreaCaptionDisplay = computedSyle4.display
                    if (currentDivTextAreaCaptionDisplay === 'block') {
                        await CaptionFileMSG(divElementBridge)
                    }
                    buttonCaption.style.cssText =
                        `display: none; opacity: 0;`
                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    abbrDivTextAreaCaption = divElement.querySelector(`#iabbrtextAreaCaption`)
                    divTextAreaCaption.placeholder = `Legenda do (${file.name || 'arquivo'}): >...`
                    abbrDivTextAreaCaption.title = `Digite a legenda do (${file.name || 'arquivo'})`

                    buttonStateRecording.style.display = 'inline'
                    buttonStateRecording.style.opacity = '0'
                    /*buttonStateRecording.style.cssText =
                        `display: inline; opacity: 0;`*/
                    setTimeout(function() {
                        buttonStateRecording.style.opacity = '1'
                        /*buttonStateRecording.style.cssText =
                            `display: inline; opacity: 1;`*/
                    }, 300)

                    divDelayTextAudioTitle = divElement.querySelector(`#idelayTextAudioTitle`) 
                    divDelayTextAudioTitle.textContent = 'ATRASO-State=Recording:'
                    
                    await sendToFunil(divElementBridge, 3, 'audio', file)

                    break;
                case 'image/jpg':
                case 'image/png':
                    typeFile.textContent = `imagem`
                    
                    await resetScreenSetup(divElementBridge, false)
                    divDelayStateTypingRecording = divElement.querySelector('#idivDelayTextAudio')
                    computedSyle = window.getComputedStyle(divDelayStateTypingRecording)
                    currentDivDelayStateTypingDisplay = computedSyle.display
                    computedSyle2 = window.getComputedStyle(buttonStateTyping)
                    currentButtonStateTypingDisplay = computedSyle2.display
                    computedSyle3 = window.getComputedStyle(buttonStateRecording)
                    currentButtonStateRecordingDisplay = computedSyle3.display
                    if (currentButtonStateTypingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateTypingMSG(divElementBridge, false)
                        }
                    } else if (currentButtonStateRecordingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateRecordingMSG(divElementBridge)
                        }
                    }
                    buttonStateTyping.style.cssText =
                        `display: none; opacity: 0;`
                    buttonStateRecording.style.cssText =
                        `display: none; opacity: 0;`
                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    computedSyle4 = window.getComputedStyle(divTextAreaCaption)
                    currentDivTextAreaCaptionDisplay = computedSyle4.display
                    if (currentDivTextAreaCaptionDisplay === 'block') {///////////////////////////////////////////////////////////
                        //await CaptionFileMSG(divElementBridge)/////////aaaaaaaaaa resolveir
                    }

                    buttonCaption.style.display = 'inline'
                    buttonCaption.style.opacity = '0'
                    /*buttonCaption.style.cssText =
                        `display: inline; opacity: 0;`*/
                    setTimeout(function() {
                        buttonCaption.style.opacity = '1'
                        /*buttonCaption.style.cssText =
                            `display: inline; opacity: 1;`*/
                    }, 300)

                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    abbrDivTextAreaCaption = divElement.querySelector(`#iabbrtextAreaCaption`)
                    divTextAreaCaption.placeholder = `Legenda do (${file.name || 'arquivo'}): >...`
                    abbrDivTextAreaCaption.title = `Digite a legenda do (${file.name || 'arquivo'})`
                    divDelayTextAudioTitle = divElement.querySelector(`#idelayTextAudioTitle`) 
                    divDelayTextAudioTitle.textContent = 'ATRASO-State=Typing&Recording:'

                    await sendToFunil(divElementBridge, 3, 'image', file)

                    break;
                case 'text/plain':
                case 'application/pdf':
                case 'application/msword':
                    typeFile.textContent = `texto`
                    
                    await resetScreenSetup(divElementBridge, false)
                    divDelayStateTypingRecording = divElement.querySelector('#idivDelayTextAudio')
                    computedSyle = window.getComputedStyle(divDelayStateTypingRecording)
                    currentDivDelayStateTypingDisplay = computedSyle.display
                    computedSyle2 = window.getComputedStyle(buttonStateTyping)
                    currentButtonStateTypingDisplay = computedSyle2.display
                    computedSyle3 = window.getComputedStyle(buttonStateRecording)
                    currentButtonStateRecordingDisplay = computedSyle3.display
                    if (currentButtonStateTypingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateTypingMSG(divElementBridge, false)
                        }
                    } else if (currentButtonStateRecordingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateRecordingMSG(divElementBridge)
                        }
                    }
                    buttonStateRecording.style.cssText =
                        `display: none; opacity: 0;`
                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    computedSyle4 = window.getComputedStyle(divTextAreaCaption)
                    currentDivTextAreaCaptionDisplay = computedSyle4.display
                    if (currentDivTextAreaCaptionDisplay === 'block') {
                        await CaptionFileMSG(divElementBridge)
                    }
                    buttonCaption.style.cssText =
                        `display: none; opacity: 0;`

                    buttonStateTyping.style.display = 'inline'
                    buttonStateTyping.style.opacity = '0'
                    /*buttonStateTyping.style.cssText =
                        `display: inline; opacity: 0;`*/
                    setTimeout(function() {
                        buttonStateTyping.style.opacity = '1'
                        /*buttonStateTyping.style.cssText =
                            `display: inline; opacity: 1;`*/
                    }, 300)

                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    abbrDivTextAreaCaption = divElement.querySelector(`#iabbrtextAreaCaption`)
                    divTextAreaCaption.placeholder = 'TEXTO-MSG: >...'
                    abbrDivTextAreaCaption.title = 'Digite a MSG'
                    
                    divDelayTextAudioTitle = divElement.querySelector(`#idelayTextAudioTitle`) 
                    divDelayTextAudioTitle.textContent = 'ATRASO-State=Typing:'

                    await sendToFunil(divElementBridge, 3, 'text', file)

                    break;
                default:
                    typeFile.textContent = `documento`
                    
                    await resetScreenSetup(divElementBridge, false)
                    divDelayStateTypingRecording = divElement.querySelector('#idivDelayTextAudio')
                    computedSyle = window.getComputedStyle(divDelayStateTypingRecording)
                    currentDivDelayStateTypingDisplay = computedSyle.display
                    computedSyle2 = window.getComputedStyle(buttonStateTyping)
                    currentButtonStateTypingDisplay = computedSyle2.display
                    computedSyle3 = window.getComputedStyle(buttonStateRecording)
                    currentButtonStateRecordingDisplay = computedSyle3.display
                    if (currentButtonStateTypingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateTypingMSG(divElementBridge, false)
                        }
                    } else if (currentButtonStateRecordingDisplay === 'inline-block') {
                        if (currentDivDelayStateTypingDisplay === 'flex') {
                            await StateRecordingMSG(divElementBridge)
                        }
                    }
                    buttonStateTyping.style.cssText =
                        `display: none; opacity: 0;`
                    buttonStateRecording.style.cssText =
                        `display: none; opacity: 0;`
                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    computedSyle4 = window.getComputedStyle(divTextAreaCaption)
                    currentDivTextAreaCaptionDisplay = computedSyle4.display
                    if (currentDivTextAreaCaptionDisplay === 'block') {
                        await CaptionFileMSG(divElementBridge)
                    }

                    buttonCaption.style.cssText =
                        `display: inline; opacity: 0;`
                    setTimeout(function() {
                        buttonCaption.style.cssText =
                            `display: inline; opacity: 1;`
                    }, 300)

                    divTextAreaCaption = divElement.querySelector(`#itextAreaCaption`)
                    abbrDivTextAreaCaption = divElement.querySelector(`#iabbrtextAreaCaption`)
                    divTextAreaCaption.placeholder = `Legenda do (${file.name || 'arquivo'}): >...`
                    abbrDivTextAreaCaption.title = `Digite a legenda do (${file.name || 'arquivo'})`
                    divDelayTextAudioTitle = divElement.querySelector(`#idelayTextAudioTitle`) 
                    divDelayTextAudioTitle.textContent = 'ATRASO-State=Typing&Recording:'

                    await sendToFunil(divElementBridge, 3, 'document', file)

                    break;
            }

            resetLoadingBar()
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR getFileData: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> getFileData: ${error.message}`, setLogError)
    }
}
async function fileTypeAction(event, isClick, divElement) {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        divElement.classList.remove('enter')

        const fileInput = divElement.querySelector('input#ifileTypeMSGAux[type="file"]')
        
        let file = null
        if (isClick) {
            file = fileInput.files[0]
        } else {
            event.preventDefault()
            event.stopPropagation()
            
            
            file = event.dataTransfer.files[0]
        }
        
        const nameFile = divElement.querySelector('#ifileNameSelected')
        const statusFile = divElement.querySelector('#ifileStatus')
        const abbrFileZone = divElement.closest('abbr')
        
        if (file === null || file === undefined) {
            nameFile.textContent = `...`
            statusFile.textContent = `Clique ou arraste um arquivo`
            abbrFileZone.title = `Clique e selecione ou arraste um arquivo aqui para poder enviar`
            
            file = '...'
            await getFileData(divElement, file)

            resetLoadingBar()
        } else {
            /*if () {
                return
            }*/
            if (!isClick) {
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                fileInput.files = dataTransfer.files
            }
            
            nameFile.textContent = file.name
            statusFile.textContent = `Arquivo selecionado`
            abbrFileZone.title = `Arquivo: ${file.name}`

            await getFileData(divElement, file)

            resetLoadingBar()
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR fileTypeAction: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> fileTypeAction: ${error.message}`, setLogError)
    }
}

async function fileHandleDragLeave(event, divElement) {//fica ativando quando mexe rapido dentro inves de quando sai mesmo da area
    try {
        event.preventDefault()
        event.stopPropagation()

        divElement.classList.remove('enter')

        const statusFile = divElement.querySelector('#ifileStatus')
        
        const fileInput = divElement.querySelector('input#ifileTypeMSGAux[type="file"]')
        if (fileInput.files.length >= 1) {
            statusFile.textContent = `Arquivo selecionado`
        } else {
            statusFile.textContent = `Clique ou arraste um arquivo`

            const abbrFileZone = divElement.closest('abbr')
            abbrFileZone.title = `Clique e selecione ou arraste um arquivo aqui para poder enviar`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR fileHandDragLeave: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> fileHandDragLeave: ${error.message}`, setLogError)
    }
}
async function fileHandleDragEnter(event, divElement) {
    try {
        event.preventDefault()
        event.stopPropagation()

        divElement.classList.add('enter')

        const fileInput = divElement.querySelector('input#ifileTypeMSGAux[type="file"]')
        if (fileInput.files.length === 0) {
            const abbrFileZone = divElement.closest('abbr')
            abbrFileZone.title = `Solte para enviar o arquivo`
        }
        const statusFile = divElement.querySelector('#ifileStatus')
        statusFile.textContent = `Solte`
    } catch (error) {
        console.error(`> ⚠️ ERROR fileHandDragEnter: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> fileHandDragLeave: ${error.message}`, setLogError)
    }
}
async function fileHoverLeave(divElement) {
    try {
        const statusFile = divElement.querySelector('#ifileStatus')
        
        const fileInput = divElement.querySelector('input#ifileTypeMSGAux[type="file"]')
        if (fileInput.files.length >= 1) {
            statusFile.textContent = `Arquivo selecionado`
        } else {
            statusFile.textContent = `Clique ou arraste um arquivo`

            const abbrFileZone = divElement.closest('abbr')
            abbrFileZone.title = `Clique e selecione ou arraste um arquivo aqui para poder enviar`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR fileHoverLeave: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> fileHoverLeave: ${error.message}`, setLogError)
    }
}
async function fileHoverEnter(divElement) {
    try {
        const statusFile = divElement.querySelector('#ifileStatus')
        statusFile.textContent = `Clique`

        const fileInput = divElement.querySelector('input#ifileTypeMSGAux[type="file"]')
        if (fileInput.files.length === 0) {
            const abbrFileZone = divElement.closest('abbr')
            abbrFileZone.title = `Clique e selecione um arquivo para enviar o arquivo`
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR fileHoverEnter: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> fileHoverEnter: ${error.message}`, setLogError)
    }
}
async function fileAuxAction(divElement) {
    try {
        const fileInput = divElement.querySelector('input#ifileTypeMSGAux[type="file"]')

        const statusFile = divElement.querySelector('#ifileStatus')
        const abbrFileZone = divElement.closest('abbr')
        
        if (fileInput.files.length === 0) {
            abbrFileZone.title = `Selecione um arquivo para enviar o arquivo`
        }
        statusFile.textContent = `Selecione`
        
        await fileInput.click()
    } catch (error) {
        console.error(`> ⚠️ ERROR fileAuxAction: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> fileAuxAction: ${error.message}`, setLogError)
    }
}

async function delayLimitLength(input) {
    try {
        if (input.value.length > 5) {
            const newValue = input.value.slice(0, 5)
            input.value = newValue
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR delayLimitLength: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> delayLimitLength: ${error.message}`, setLogError)
    }
}

async function newTypeMSG(type) {//fazer aparecer invisivel e usar o id criado na hora pra modificar unicamente por MSG para aparecer bunitin opacity e tals
    try {  
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let typeMSG = null
        let MSGType = null
        let positionId = null
        let delayType = null
        let delayData = null
        let textareaData = null
        let fileType = null
        let fileData = null
        let stateContinue = null
        let funiltRebate = null
        let templatetRebate = null

        await newTypeMSGShown()
        
        const divFunil = document.querySelector('#funilArea')
        const allConteinerFunilMSG = divFunil.querySelectorAll('.conteinerFunilMSG')
        let arrayIdNumberPosition = []
        allConteinerFunilMSG.forEach((divElement) => { 
            arrayIdNumberPosition.push(Number(divElement.id.match(/\d+/g)))  
        })
        let idNumberPositionDivAdjacent = null
        let isFirstUndefined = null 
        if (arrayIdNumberPosition.length > 0) {   
            const response = await axios.get('/funil/insert_exponecial_position_MSG', { params: { arrayIdNumberPosition } })
            idNumberPositionDivAdjacent = response.data.idnumberpositiondivadjacent
            isFirstUndefined = response.data.isfirstundefined 
        }

        const response2 = await axios.post('/funil/new-MSG')
        const Id_Position_MSG = response2.data.idpositionmsg

        const divAdjacent = document.querySelector(`#${idNumberPositionDivAdjacent}`)
        let conteinerMSG = null
        switch (type) {
            case 1:
                const MSGHTMlDelay = `<div class="conteinerFunilMSG" id="conteinerFunilMSG${Id_Position_MSG}">

                                        <div class="divInfoPositionMSG" id="idivInfoPositionMSG${Id_Position_MSG}">
                                            <label title="Selecione esta posição (${Id_Position_MSG})" class="divSelectionPositionMSG">
                                                <input type="checkbox" class="inputCheckboxSelectionMSG" id="iinputCheckboxSelectionMSG${Id_Position_MSG}" onchange="selectionPositionMSG(this, 1)">
                                                <span class="checkSelectionMSG" id="icheckSelectionMSG"></span>
                                            </label>
                                            <h3 class="titlePositionMSG" id="ititlePositionMSG">Posicao MSG</h3>
                                            <p class="positionMSG" id="ipositionMSG">(${Id_Position_MSG})</p>

                                            <button title="Deletar posição MSG (${Id_Position_MSG})" class="erasePositionMSG" id="ierasePositionMSG" onclick="erasePosition(this.parentElement.parentElement, 1)">D</button>
                                        </div>

                                        <div class="divInnerConteinerFunilMSG" id="idivInnerConteinerFunilMSG">

                                            <div class="divDelayTypeMSG" id="idivDelayTypeMSG">
                                                <abbr title="Determine um valor para o tempo de Delay"><span class="delayMSGTitle"><strong>ATRASO-MSG:</strong></span><label for="idelayMSGTime" class="delayMSGLabelTime">Tempo-<input type="number" class="delayMSGTime" id="idelayMSGTime" min="1" max="9999" step="1" oninput="delayLimitLength(this), sendToFunil(this, 1, 'input', null)" placeholder="00000"></label></abbr> 
                                            
                                                <select title="Selecione um tipo de duração" class="delayMSGSelect" id="idelayMSGSelect" oninput="sendToFunil(this, 1, this, null)">
                                                    <option value="none" selected>Nenhum</option>
                                                    <option value="seconds">Segundos</option>
                                                    <option value="minutes">Minutos</option>
                                                    <option value="hours">Horas</option>
                                                    <option value="days">Dias</option>
                                                </select>
                                            </div>

                                        </div>

                                    </div>`
                if (divAdjacent) {
                    if (isFirstUndefined) {
                        divAdjacent.insertAdjacentHTML('beforebegin', MSGHTMlDelay)
                    } else {
                        divAdjacent.insertAdjacentHTML('afterend', MSGHTMlDelay)
                    }
                } else {
                    divFunil.innerHTML += MSGHTMlDelay
                }

                typeMSG = type
                MSGType = 'delay'
                positionId = Id_Position_MSG
                delayType = 'none'
                delayData = ''
                await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                conteinerMSG = document.querySelector(`#conteinerFunilMSG${Id_Position_MSG}`)
                conteinerMSG.style.cssText =
                    `display: flex; opacity: 0;`
                setTimeout(function() {
                    conteinerMSG.style.cssText =
                        `display: flex; opacity: 1;`
                }, 300)

                resetLoadingBar()
                break
            case 2:
                const MSGHTMlText = `<div class="conteinerFunilMSG" id="conteinerFunilMSG${Id_Position_MSG}">

                                        <div class="divInfoPositionMSG" id="idivInfoPositionMSG${Id_Position_MSG}">
                                            <label title="Selecione esta posição (${Id_Position_MSG})" class="divSelectionPositionMSG">
                                                <input type="checkbox" class="inputCheckboxSelectionMSG" id="iinputCheckboxSelectionMSG${Id_Position_MSG}" onchange="selectionPositionMSG(this, 2)">
                                                <span class="checkSelectionMSG" id="icheckSelectionMSG"></span>
                                            </label>
                                            <h3 class="titlePositionMSG" id="ititlePositionMSG">Posicao MSG</h3>
                                            <p class="positionMSG" id="ipositionMSG">(${Id_Position_MSG})</p>

                                            <button title="Deletar posição MSG (${Id_Position_MSG})" class="erasePositionMSG" id="ierasePositionMSG" onclick="erasePosition(this.parentElement.parentElement, 2)">D</button>
                                        </div>

                                        <div class="divInnerConteinerFunilMSG" id="idivInnerConteinerFunilMSG">

                                            <div class="divTextarea" id="idivTextarea">
                                                <div class="divTextareaFunctions" id="idivTextareaFunctions">
                                                    <abbr title="StateTyping STATUS: off" id="iabbrOnOffStateTypingMSG"><button class="functionsDivStart OnOffStateTypingMSG" id="iOnOffStateTypingMSG" onclick="StateTypingMSG(this, true)">O</button></abbr>
                                                    
                                                    <abbr title="Modo Claro/Escuro STATUS: escuro" id="iabbrOnOffLightDarkMSG"><button class="functionsDivStart OnOffLightDarkMSG" id="iOnOffLightDarkMSG" onclick="LightDarkMSG(this, true)">O</button></abbr>
                                                    <abbr title="Modo Cliente/Usuario STATUS: cliente" id="iabbrOnOffLightDarkColorMSG"><button class="functionsDivStart OnOffLightDarkColorMSG" id="iOnOffLightDarkColorMSG" onclick="LightDarkColorMSG(this, true)">O</button></abbr>
                                                    
                                                    <abbr title="Reset"><button class="functionsDivStart OnOffResetScreenSetupText" id="iOnOffResetScreenSetupText1" onclick="resetScreenSetup(this, true)">R</button></abbr>
                                                    <abbr title="VLock Tela STATUS: off" id="iabbrOnOffVLockScreenSetupText2"><button class="functionsDivStart OnOffVLockScreenSetupText" id="iOnOffVLockScreenSetupText2" onclick="VLockScreenSetup(this, true)">O</button></abbr>
                                                    <abbr title="PC Tela STATUS: off" id="iabbrOnOffDesktopScreenSetupText3"><button class="functionsDivStart OnOffDesktopScreenSetupText" id="iOnOffDesktopScreenSetupText3" onclick="desktopScreenSetup(this, true)">O</button></abbr>
                                                    <abbr title="Celular Tela STATUS: off" id="iabbrOnOffPhoneScreenSetupText4"><button class="functionsDivStart OnOffPhoneScreenSetupText" id="iOnOffPhoneScreenSetupText4" onclick="phoneScreenSetup(this, true)">O</button></abbr>
                                                </div>
                                            
                                                <div class="divDelayText" id="idivDelayText">
                                                    <abbr title="Determine um valor para o tempo de Delay"><span class="delayTextTitle"><strong>ATRASO-StateTyping:</strong></span><label for="idelayTextTime" class="delayTextLabelTime">Tempo-<input type="number" class="delayTextTime" id="idelayTextTime" min="1" max="9999" step="1" oninput="delayLimitLength(this), sendToFunil(this, 2, 'input', null)" placeholder="00000"></label></abbr> 
                                                    
                                                    <select title="Selecione um tipo de duração" class="delayTextSelect" id="idelayTextSelect" oninput="sendToFunil(this, 2, this, null)">
                                                        <option value="none" selected>Nenhum</option>
                                                        <option value="seconds">Segundos</option>
                                                        <option value="minutes">Minutos</option>
                                                        <option value="hours">Horas</option>
                                                        <option value="days">Dias</option>
                                                    </select>
                                                </div>
                                                
                                                <abbr title="Digite a MSG"><textarea class="textAreaTypeMSG" id="itextAreaTypeMSG" placeholder="TEXTO-MSG: >..." oninput="sendToFunil(this, 2, 'textarea', this)"></textarea></abbr>
                                            </div>

                                        </div>

                                    </div>`
                if (divAdjacent) {
                    if (isFirstUndefined) {
                        divAdjacent.insertAdjacentHTML('beforebegin', MSGHTMlText)
                    } else {
                        divAdjacent.insertAdjacentHTML('afterend', MSGHTMlText)
                    }
                } else {
                    divFunil.innerHTML += MSGHTMlText
                }

                typeMSG = type
                MSGType = 'textarea'
                positionId = Id_Position_MSG
                delayType = 'none'
                delayData = ''
                textareaData = ''
                await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })
                
                conteinerMSG = document.querySelector(`#conteinerFunilMSG${Id_Position_MSG}`)
                conteinerMSG.style.cssText =
                    `display: flex; opacity: 0;`
                setTimeout(function() {
                    conteinerMSG.style.cssText =
                        `display: flex; opacity: 1;`
                }, 300)

                resetLoadingBar()
                break
            case 3:
                const MSGHTMlFile = `<div class="conteinerFunilMSG" id="conteinerFunilMSG${Id_Position_MSG}">

                                        <div class="divInfoPositionMSG" id="idivInfoPositionMSG${Id_Position_MSG}">
                                            <label title="Selecione esta posição (${Id_Position_MSG})" class="divSelectionPositionMSG">
                                                <input type="checkbox" class="inputCheckboxSelectionMSG" id="iinputCheckboxSelectionMSG${Id_Position_MSG}" onchange="selectionPositionMSG(this, 3)">
                                                <span class="checkSelectionMSG" id="icheckSelectionMSG"></span>
                                            </label>
                                            <h3 class="titlePositionMSG" id="ititlePositionMSG">Posicao MSG</h3>
                                            <p class="positionMSG" id="ipositionMSG">(${Id_Position_MSG})</p>

                                            <button title="Deletar posição MSG (${Id_Position_MSG})" class="erasePositionMSG" id="ierasePositionMSG" onclick="erasePosition(this.parentElement.parentElement, 3)">D</button>
                                        </div>

                                        <div class="divInnerConteinerFunilMSG" id="idivInnerConteinerFunilMSG">

                                            <div class="fileTypeMSG" id="ifileTypeMSG">
                                                <div class="divFileFunctions" id="idivFileFunctions">
                                                    <abbr title="StateTyping STATUS: off" id="iabbrOnOffStateTypingFile"><button class="functionsDivStart OnOffStateTypingFile" id="iOnOffStateTypingFile" onclick="StateTypingMSG(this, false)">O</button></abbr>
                                                    <abbr title="StateRecording STATUS: off" id="iabbrOnOffStateRecordingFile"><button class="functionsDivStart OnOffStateRecordingFile" id="iOnOffStateRecordingFile" onclick="StateRecordingMSG(this)">O</button></abbr>
                                                    <abbr title="Area de texto STATUS: off" id="iabbrOnOffCaption"><button class="functionsDivStart OnOffCaption" id="iOnOffCaption" onclick="CaptionFileMSG(this)">O</button></abbr>
                                                    
                                                    <abbr title="Modo Claro/Escuro STATUS: escuro" id="iabbrOnOffLightDarkCaption"><button class="functionsDivStart OnOffLightDarkCaption" id="iOnOffLightDarkCaption" onclick="LightDarkMSG(this, false)">O</button></abbr>
                                                    <abbr title="Modo Cliente/Usuario STATUS: cliente" id="iabbrOnOffLightDarkColorCaption"><button class="functionsDivStart OnOffLightDarkColorCaption" id="iOnOffLightDarkColorCaption" onclick="LightDarkColorMSG(this, false)">O</button></abbr>
                                                    
                                                    <abbr title="Reset"><button class="functionsDivStart OnOffResetScreenSetupCaption" id="iOnOffResetScreenSetupCaption1" onclick="resetScreenSetup(this, false)">R</button></abbr>
                                                    <abbr title="VLock Tela STATUS: off" id="iabbrOnOffVLockScreenSetupCaption2"><button class="functionsDivStart OnOffVLockScreenSetupCaption" id="iOnOffVLockScreenSetupCaption2" onclick="VLockScreenSetup(this, false)">O</button></abbr>
                                                    <abbr title="PC Tela STATUS: off" id="iabbrOnOffDesktopScreenSetupCaption3"><button class="functionsDivStart OnOffDesktopScreenSetupCaption" id="iOnOffDesktopScreenSetupCaption3" onclick="desktopScreenSetup(this, false)">O</button></abbr>
                                                    <abbr title="Celular Tela STATUS: off" id="iabbrOnOffPhoneScreenSetupCaption4"><button class="functionsDivStart OnOffPhoneScreenSetupCaption" id="iOnOffPhoneScreenSetupCaption4" onclick="phoneScreenSetup(this, false)">O</button></abbr>
                                                </div>
                                                
                                                <div class="divDelayTextAudio" id="idivDelayTextAudio">
                                                    <abbr title="Determine um valor para o tempo de Delay"><strong><span class="delayTextAudioTitle" id="idelayTextAudioTitle">ATRASO-State=Typing&Recording:</span></strong><label for="idelayTexAudioTime" class="delayTextAudioLabelTime">Tempo-<input type="number" class="delayTextAudioTime" id="idelayTexAudioTime" min="1" max="9999" step="1" oninput="delayLimitLength(this), sendToFunil(this, 3, 'input', null)" placeholder="00000"></label></abbr> 
                                                    
                                                    <select title="Selecione um tipo de duração" class="delayTextAudioSelect" id="idelayTextAudioSelect" oninput="sendToFunil(this, 3, this, null)">
                                                        <option value="none" selected>Nenhum</option>
                                                        <option value="seconds">Segundos</option>
                                                        <option value="minutes">Minutos</option>
                                                        <option value="hours">Horas</option>
                                                        <option value="days">Dias</option>
                                                    </select>
                                                </div>
                                                
                                                <div class="divFileSelectMSG">
                                                    <abbr title="Clique e selecione ou arraste um arquivo aqui para poder enviar"><div class="fileTypeSelectMSG" id="ifileTypeSelectMSG" ondragover="fileHandleDragEnter(event, this)" ondragleave="fileHandleDragLeave(event, this)" onmouseenter="fileHoverEnter(this)" onmouseleave="fileHoverLeave(this)" ondrop="fileTypeAction(event, false, this)" onclick="fileAuxAction(this)">
                                                        <p class="fileTitleTypeMSG"><strong>ARQUIVO-MSG</strong></p>
                                                        <p class="fileStatus"><span id="ifileStatus">Clique ou arraste um arquivo</span></p>
                                                        <p class="fileTypeSelected">(<span id="ifileTypeSelected">...</span>)</p>
                                                        <p class="fileNameSelected"><span id="ifileNameSelected">...</span></p>
                                                        
                                                        <input type="file" class="fileTypeMSGAux" id="ifileTypeMSGAux" placeholder="..." onchange="fileTypeAction(null, true, this.parentElement)">
                                                    </div></abbr>
                                                </div>

                                                <abbr title="Digite a legenda do (...)" id="iabbrtextAreaCaption"><textarea class="textAreaCaption" id="itextAreaCaption" placeholder="Legenda do (...): >..." oninput="sendToFunil(this, 3, 'textarea', this)"></textarea></abbr>
                                            </div>
                                            
                                        </div>

                                    </div>`
                if (divAdjacent) {
                    if (isFirstUndefined) {
                        divAdjacent.insertAdjacentHTML('beforebegin', MSGHTMlFile)
                    } else {
                        divAdjacent.insertAdjacentHTML('afterend', MSGHTMlFile)
                    }
                } else {
                    divFunil.innerHTML += MSGHTMlFile
                }

                typeMSG = type
                MSGType = 'file'
                positionId = Id_Position_MSG
                delayType = 'none'
                delayData = ''
                textareaData = ''
                fileType = ''
                fileData = ''
                await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                conteinerMSG = document.querySelector(`#conteinerFunilMSG${Id_Position_MSG}`)
                conteinerMSG.style.cssText =
                    `display: flex; opacity: 0;`
                setTimeout(function() {
                    conteinerMSG.style.cssText =
                        `display: flex; opacity: 1;`
                }, 300)

                resetLoadingBar()
                break
            case 4:
                const MSGHTMlRebate = `<div class="conteinerFunilMSG" id="conteinerFunilMSG${Id_Position_MSG}">

                                        <div class="divInfoPositionMSG" id="idivInfoPositionMSG${Id_Position_MSG}">
                                            <label title="Selecione esta posição (${Id_Position_MSG})" class="divSelectionPositionMSG">
                                                <input type="checkbox" class="inputCheckboxSelectionMSG" id="iinputCheckboxSelectionMSG${Id_Position_MSG}" onchange="selectionPositionMSG(this, 4)">
                                                <span class="checkSelectionMSG" id="icheckSelectionMSG"></span>
                                            </label>
                                            <h3 class="titlePositionMSG" id="ititlePositionMSG">Posicao MSG</h3>
                                            <p class="positionMSG" id="ipositionMSG">(${Id_Position_MSG})</p>

                                            <button title="Deletar posição MSG (${Id_Position_MSG})" class="erasePositionMSG" id="ierasePositionMSG" onclick="erasePosition(this.parentElement.parentElement, 4)">D</button>
                                        </div>

                                        <div class="divInnerConteinerFunilMSG" id="idivInnerConteinerFunilMSG">

                                            <div class="rebateTypeMSG" id="irebateTypeMSG">

                                                <div class="divRebateFunctions" id="idivRebateFunctions">
                                                    <abbr title="StateContinue STATUS: null" id="iabbrOnOffStateContinue"><button class="functionsDivStart OnOffStateContinue" id="iOnOffStateContinue" onclick="sendToFunil(this, 4, 'continue', this)">-O</button></abbr>
                                                </div>

                                                <div class="divDelayRebate" id="idivDelayRebate">
                                                    <abbr title="Determine um valor para o tempo de Delay do Timer"><span class="delayRebateTitle"><strong>TIMER-Rebate:</strong></span><label for="idelayRebateTime" class="delayRebateLabelTime">Tempo-<input type="number" class="delayRebateTime" id="idelayRebateTime" min="1" max="9999" step="1" oninput="delayLimitLength(this), sendToFunil(this, 4, 'input', null)" placeholder="00000" value="10"></label></abbr> 
                                                
                                                    <select title="Selecione um tipo de duração do Timer" class="delayRebateSelect" id="idelayRebateSelect" oninput="sendToFunil(this, 4, this, null)">
                                                        <option value="none">Nenhum</option>
                                                        <option value="seconds" selected>Segundos</option>
                                                        <option value="minutes">Minutos</option>
                                                        <option value="hours">Horas</option>
                                                        <option value="days">Dias</option>
                                                    </select>

                                                    <select title="Selecione um Funil para o Rebate" class="funilRebateSelect" id="ifunilRebateSelect" oninput="sendToFunil(this, 4, 'rebateFunil', this)">
                                                        <option value="none" selected>Nenhum</option>

                                                    </select>

                                                    <select title="Selecione um Template para o Rebate" class="templateRebateSelect" id="itemplateRebateSelect" oninput="sendToFunil(this, 4, 'rebateTemplate', this)">
                                                        <option value="none" selected>Nenhum</option>

                                                    </select>
                                                </div>

                                            </div>
                                            
                                        </div>

                                    </div>`
                if (divAdjacent) {
                    if (isFirstUndefined) {
                        divAdjacent.insertAdjacentHTML('beforebegin', MSGHTMlRebate)
                    } else {
                        divAdjacent.insertAdjacentHTML('afterend', MSGHTMlRebate)
                    }
                } else {
                    divFunil.innerHTML += MSGHTMlRebate
                }

                /*const dir_Path = `Funil\\${Funil_}`
                const response = await axios.get('/functions/dir', { params: { dir_Path } })
                const Directories = response.data.dirs
                let Templatets_ = []
                for (let i = 0; i < Directories.length; i++) {
                    const match = Directories[i].match(/_(\d+_[^_]+)_/)
                    Templatets_.push(match[0])
                }
                const templateDelayRebate = document.querySelector(`#conteinerFunilMSG${Id_Position_MSG}`).querySelector(`#itemplateRebateSelect`)
                Templatets_.forEach(template => {
                    let option = document.createElement("option")
                    option.value = template 
                    option.textContent = template
                    templateDelayRebate.appendChild(option)
                })*/

                const dir_Path = `Funil`
                const response = await axios.get('/functions/dir', { params: { dir_Path } })
                const Directories = response.data.dirs
                let Funilts_ = []
                for (let i = 0; i < Directories.length; i++) {
                    Funilts_.push(Directories[i])
                }
                const funilDelayRebate = document.querySelector(`#conteinerFunilMSG${Id_Position_MSG}`).querySelector(`#ifunilRebateSelect`)
                Funilts_.forEach(template => {
                    let option = document.createElement("option")
                    option.value = template 
                    option.textContent = template
                    funilDelayRebate.appendChild(option)
                })
                const buttonStateContinue = document.querySelector(`#conteinerFunilMSG${Id_Position_MSG}`).querySelector(`#iOnOffStateContinue`)
                buttonStateContinue.textContent = '-'
                buttonStateContinue.style.cssText =
                    `background-color: var(--colorGreen); color: var(--colorBlack); cursor: pointer;`

                typeMSG = type
                MSGType = 'rebateFunil'
                positionId = Id_Position_MSG
                delayType = 'seconds'
                delayData = '10'
                funiltRebate = 'none'
                templatetRebate = 'none'
                stateContinue = true
                await axios.put('/funil/send-data', { typeMSG, MSGType, positionId, delayType, delayData, stateContinue, funiltRebate, templatetRebate, textareaData, fileType, fileData })

                conteinerMSG = document.querySelector(`#conteinerFunilMSG${Id_Position_MSG}`)
                conteinerMSG.style.cssText =
                    `display: flex; opacity: 0;`
                setTimeout(function() {
                    conteinerMSG.style.cssText =
                        `display: flex; opacity: 1;`
                }, 300)

                resetLoadingBar()
                break
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR newTypeMSG: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> newTypeMSG: ${error.message}`, setLogError)
    }
}

async function newTypeMSGShown() {
    try {
        const divAddNewTypeMSG = document.querySelector('#addTypeMSG')
        const typeSelect = document.querySelector('#typeSelectMSG')
        const typeDelay = document.querySelector('#typeDelayMSG')
        const typeText = document.querySelector('#typeTextMSG')
        const typeFile = document.querySelector('#typeFileMSG')
        const typeRebate = document.querySelector('#typeRebateMSG')
        const isShown_typeSelect = window.getComputedStyle(typeSelect).display

        if (isShown_typeSelect === 'block') {
            typeDelay.style.cssText =
                'display: block; opacity: 0;'
            typeText.style.cssText =
                'display: block; opacity: 0;'
            typeFile.style.cssText =
                'display: block; opacity: 0;'
                typeRebate.style.cssText =
                'display: block; opacity: 0;'

            setTimeout(function() {
                typeDelay.style.cssText =
                    'display: none; opacity: 0;'
                typeText.style.cssText =
                    'display: none; opacity: 0;'
                typeFile.style.cssText =
                    'display: none; opacity: 0;'
                typeRebate.style.cssText =
                    'display: none; opacity: 0;'

                typeSelect.style.cssText =
                    'display: block; height: 0vh; padding: 0px 10px 0px 10px;'
                setTimeout(function() {
                    typeSelect.style.cssText =
                        'display: none; height: 0vh; padding: 0px 10px 0px 10px;'
                    
                    divAddNewTypeMSG.style.cssText = 
                        'border-radius: 50px 50px 50px 50px;' 
                }, 300)
            }, 300)
        } else {
            divAddNewTypeMSG.style.cssText = 
                'border-radius: 0px 0px 50px 50px;'

            setTimeout(function() {
                typeSelect.style.cssText =
                    'display: block; height: 0vh; padding: 0px 10px 0px 10px;'
                setTimeout(function() {
                    typeSelect.style.cssText =
                        'display: block; height: 35vh; padding: 7px 10px 0px 10px;'
                }, 100)

                setTimeout(function() {
                    typeDelay.style.cssText =
                        'display: block; opacity: 0;'
                    typeText.style.cssText =
                        'display: block; opacity: 0;'
                    typeFile.style.cssText =
                        'display: block; opacity: 0;'
                    typeRebate.style.cssText =
                        'display: block; opacity: 0;'
                    setTimeout(function() {
                        typeDelay.style.cssText =
                            'display: block; opacity: 1;'
                        typeText.style.cssText =
                            'display: block; opacity: 1;'
                        typeFile.style.cssText =
                            'display: block; opacity: 1;'
                        typeRebate.style.cssText =
                            'display: block; opacity: 1;'
                    }, 100)
                }, 300)
            }, 300)
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR newTypeMSGShown: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> newTypeMSGShown: ${error.message}`, setLogError)
    }
}

async function eraseClient_(Clientt_) {
    if (Client_NotReady) {
        displayOnConsole(`> ℹ️  ${Clientt_} not Ready.`, setLogError)
        return
    }
    try {
        Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let userConfirmation = confirm(`Tem certeza de que deseja apagar o Client_ ${Clientt_}?\nsera apagada para sempre.`)
        if (userConfirmation) {
            const status = document.querySelector('#status')

            const dir_Path = 'Local_Auth'
            const response = await axios.get('/functions/dir', { params: { dir_Path } })
            const Directories = response.data.dirs

            const response1 = await axios.delete('/client/erase', { params: { Clientt_ } })
            const Sucess = response1.data.sucess
            const Is_Empty = response1.data.empty
            const Is_Empty_Input = response1.data.empty_input
            const Not_Selected = response1.nselected
            if (Not_Selected) {
                status.innerHTML = `O Client_ <strong>${Clientt_}</strong> esta para ser <strong>apagado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Client_ <strong>selecionado</strong> é <strong>${Client_}</strong> então <strong>selecione</strong> <strong>${Clientt_}</strong> para poder <strong>apaga-lo</strong>!`
                displayOnConsole(`> ℹ️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>O Client_ <strong>${Clientt_}</strong> esta para ser <strong>apagado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Client_ <strong>selecionado</strong> é <strong>${Client_}</strong> então <strong>selecione</strong> <strong>${Clientt_}</strong> para poder <strong>apaga-lo</strong>!`)
                
                resetLoadingBar()
                
                Client_NotReady = false

                return
            }
            if (Is_Empty) {
                status.innerHTML = `Dados de <strong>${Clientt_}</strong> esta <strong>vazio</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Dados de <strong>${Clientt_}</strong> esta <strong>vazio</strong>`)

                resetLoadingBar()
                
                Client_NotReady = false
                
                return
            }
            if (Is_Empty_Input) {
                status.innerHTML = `Client_ <strong>${Clientt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`)

                resetLoadingBar()
                
                Client_NotReady = false
                
                return  
            } 
            if (Sucess) {
                const divClientt_ = document.querySelector(`#${Clientt_}`)
                divClientt_.remove()

                status.innerHTML = `Client_ <strong>${Clientt_}</strong> foi <strong>Apagado</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> foi <strong>Apagado</strong>!`)

                //o codigo abaixo e possivel botar tudo numa rota e devolver o porArrayClient e se tiver vazio nada e reset e tals, modelo REST e tals (se for preciso)

                await sleep(5 * 1000)
                const dir_Path = 'Local_Auth'
                const response = await axios.get('/functions/dir', { params: { dir_Path } })
                const Directories2 = response.data.dirs
                console.log(Directories2)

                if (Directories2.length === 0) {
                    status.innerHTML = `<strong>Dir</strong> off Clients_ (<strong>${Directories.length}</strong>) is <strong>empty</strong>!`
                    displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Dir</strong> off Clients_ (<strong>${Directories.length}</strong>) is <strong>empty</strong>!`)

                    let exitInten = true
                    stage = 0
                    await exit(exitInten)
                    await axios.put('/back/reset')
                } else {
                    const clientIdNumber = Number(Clientt_.split('_')[1])

                    let Counter_Clients_ = 0
                    let posArrayClientId = null
                    let posArrayClientName = null
                    for (let i = 0; i < Directories.length; i++) {
                        const clientDirIdNumber = Number(Directories[Counter_Clients_].split('_')[1])

                        if (clientIdNumber === clientDirIdNumber) {
                            posArrayClientId = Counter_Clients_+1

                            if (Directories[posArrayClientId] === undefined) {
                                posArrayClientId-1
                                posArrayClientName = Directories[posArrayClientId-1].split('_')[2]
                            } else {
                                posArrayClientId+1
                                posArrayClientName = Directories[posArrayClientId+1].split('_')[2]
                            }
                        } else {
                            posArrayClientId = Directories[Counter_Clients_].split('_')[1]
                            posArrayClientName = Directories[Counter_Clients_].split('_')[2]
                            Counter_Clients_+1
                        }
                    }
                    
                    await selectClient_(`_${posArrayClientId}_${posArrayClientName}_`)
                }
            } else {
                status.innerHTML = `<i><strong>ERROR</strong></i> ao <strong>Apagar</strong> Client_ <strong>${Clientt_}</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao <strong>Apagar</strong> Client_ <strong>${Clientt_}</strong>!`)
            }
        } else {
            resetLoadingBar()
            Client_NotReady = false
            return
        }

        resetLoadingBar()
        Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR eraseClient_ ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> eraseClient_ <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        Client_NotReady = false
        resetLoadingBar()
    }
}
async function DestroyClient_(Clientt_, isButton) {
    /*if (Client_NotReady) {
        displayOnConsole(`> ℹ️  ${Clientt_} not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let userConfirmation = true
        if (isButton) {   
            userConfirmation = confirm(`Tem certeza de que deseja desligar o Client_ ${Clientt_}?`)
        }
        if (userConfirmation) {
            const status = document.querySelector('#status')

            const response = await axios.put('/client/destroy', { Clientt_ })
            const Sucess = response.data.sucess
            const Is_Empty = response.data.empty
            const Is_Empty_Input = response.data.empty_input
            const Not_Selected = response.nselected
            if (Not_Selected) {
                status.innerHTML = `O Client_ <strong>${Clientt_}</strong> esta para ser <strong>desligado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Client_ <strong>selecionado</strong> é <strong>${Client_}</strong> então <strong>selecione</strong> <strong>${Clientt_}</strong> para poder <strong>desliga-lo</strong>!`
                displayOnConsole(`> ℹ️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>O Client_ <strong>${Clientt_}</strong> esta para ser <strong>desligado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Client_ <strong>selecionado</strong> é <strong>${Client_}</strong> então <strong>selecione</strong> <strong>${Clientt_}</strong> para poder <strong>desliga-lo</strong>!`)
                
                resetLoadingBar()
                
                //Client_NotReady = false

                return
            }
            if (Is_Empty) {
                status.innerHTML = `Dados de <strong>${Clientt_}</strong> esta <strong>vazio</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Dados de <strong>${Clientt_}</strong> esta <strong>vazio</strong>`)

                resetLoadingBar()
                
                //Client_NotReady = false
                
                return
            }
            if (Is_Empty_Input) {
                status.innerHTML = `Client_ <strong>${Clientt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`)

                resetLoadingBar()
                
                //Client_NotReady = false
                
                return  
            } 
            if (Sucess) {
                const Type_Selected = 4
                const response = await axios.get('/features/selecteds', { params: { Type_Selected, Clientt_ } }) 
                const F_Client_ = response.data.F_Client_
                const T_Client_ = response.data.T_Client_

                const clientHTMLReinitialize = `\n<div class="divClients_" id="${Clientt_}">
                                             <div>
                                                 \n<abbr title="Client_ ${Clientt_}" id="abbrselect-${Clientt_}"><button class="Clients_" id="select-${Clientt_}" onclick="selectClient_('${Clientt_}')">${Clientt_}</button></abbr><abbr title="Renomear ${Clientt_}" id="abbrRename-${Clientt_}"><button class="Clients_Rename" id="Rename-${Clientt_}" onclick="RenameClient_('${Clientt_}')"><</button></abbr><abbr title="Ligar ${Clientt_}" id="abbrReinitialize-${Clientt_}"><button class="Clients_Reinitialize" id="Reinitialize-${Clientt_}" onclick="ReinitializeClient_('${Clientt_}')"><</button></abbr><abbr title="Apagar ${Clientt_}" id="abbrerase-${Clientt_}"><button class="Clients_Erase" id="erase-${Clientt_}" onclick="eraseClient_('${Clientt_}')"><</button></abbr>\n
                                             </div>
                                             <div class="showSelected">
                                                 <abbr title="Selecionado - Funil: ${F_Client_} Template: ${T_Client_}" id="iabbrshowselected-${Clientt_}"><span class="showSelectedFunil" id="ishowSelectedFunil-${Clientt_}">SF: ${F_Client_}</span><span class="showSelectedTemplate" id="ishowSelectedTemplate-${Clientt_}">ST: ${T_Client_}</span></abbr>
                                             </div>
                                           </div>\n`
                document.querySelector(`#${Clientt_}`).innerHTML = clientHTMLReinitialize

                status.innerHTML = `Client_ <strong>${Clientt_}</strong> foi <strong>Desligado</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> foi <strong>Desligado</strong>!`)
    
                //o codigo abaixo e possivel botar tudo numa rota e devolver o porArrayClient, modelo REST e tals (se for preciso)

                /*const dir_Path = 'Local_Auth'
                const response = await axios.get('/functions/dir', { params: { dir_Path } })
                const Directories_ = response.data.dirs
                displayOnConsole(Directories_)*/

                /*if (Directories_.length-1 > 0) {
                    const clientIdNumber = Clientt_.match(/\d+/g) 

                    if (Directories_[clientIdNumber++] !== null) {
                        clientIdNumber++
                        
                        await selectClient_(`Client_${posArrayClient}`)
                    } else if (Directories_[clientIdNumber--] !== null) {
                        clientIdNumber--

                        await selectClient_(`Client_${posArrayClient}`)
                    }
                }*/
            } else {
                status.innerHTML = `<i><strong>ERROR</strong></i> ao <strong>Desligar</strong> Client_ <strong>${Clientt_}</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao <strong>Desligar</strong> Client_ <strong>${Clientt_}</strong>!`)
            }
        } else {
            resetLoadingBar()
            //Client_NotReady = false
            return
        }

        resetLoadingBar()
        //Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR DestroyClient_ ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> DestroyClient_ <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
} 
async function ReinitializeClient_(Clientt_) {
    /*if (Client_NotReady) {
        displayOnConsole(`> ℹ️  ${Clientt_} not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const response = await axios.put('/client/reinitialize', { Clientt_ })
        const Sucess = response.data.sucess
        const Is_Empty = response.data.empty
        const Is_Empty_Input = response.data.empty_input
        const Not_Selected = response.nselected
        if (Not_Selected) {
            status.innerHTML = `O Client_ <strong>${Clientt_}</strong> esta para ser <strong>ligado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Client_ <strong>selecionado</strong> é <strong>${Client_}</strong> então <strong>selecione</strong> <strong>${Clientt_}</strong> para poder <strong>liga-lo</strong>!`
            displayOnConsole(`> ℹ️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>O Client_ <strong>${Clientt_}</strong> esta para ser <strong>ligado</strong> mas <strong>não</strong> esta <strong>selecionado</strong>, o Client_ <strong>selecionado</strong> é <strong>${Client_}</strong> então <strong>selecione</strong> <strong>${Clientt_}</strong> para poder <strong>liga-lo</strong>!`)
            
            resetLoadingBar()
            
            //Client_NotReady = false

            return
        }
        if (Is_Empty) {
            status.innerHTML = `Dados de <strong>${Clientt_}</strong> esta <strong>vazio</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Dados de <strong>${Clientt_}</strong> esta <strong>vazio</strong>`)

            resetLoadingBar()
            
           //Client_NotReady = false
            
            return
        }
        if (Is_Empty_Input) {
            status.innerHTML = `Client_ <strong>${Clientt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`)

            resetLoadingBar()
            
            //Client_NotReady = false
            
            return  
        } 
        if (Sucess) {
            const Type_Selected = 4
            const response = await axios.get('/features/selecteds', { params: { Type_Selected, Clientt_ } }) 
            const F_Client_ = response.data.F_Client_
            const T_Client_ = response.data.T_Client_

            const clientHTMLDestroy = `\n<div class="divClients_" id="${Clientt_}">
                                        <div>
                                            \n<abbr title="Client_ ${Clientt_}" id="abbrselect-${Clientt_}"><button class="Clients_" id="select-${Clientt_}" onclick="selectClient_('${Clientt_}')">${Clientt_}</button></abbr><abbr title="Renomear ${Clientt_}" id="abbrRename-${Clientt_}"><button class="Clients_Rename" id="Rename-${Clientt_}" onclick="RenameClient_('${Clientt_}')"><</button></abbr><abbr title="Desligar ${Clientt_}" id="abbrDestroy-${Clientt_}"><button class="Clients_Destroy" id="Destroy-${Clientt_}" onclick="DestroyClient_('${Clientt_}', true)"><</button></abbr><abbr title="Apagar ${Clientt_}" id="abbrerase-${Clientt_}"><button class="Clients_Erase" id="erase-${Clientt_}" onclick="eraseClient_('${Clientt_}')"><</button></abbr>\n
                                        </div>
                                        <div class="showSelected">
                                            <abbr title="Selecionado - Funil: ${F_Client_} Template: ${T_Client_}" id="iabbrshowselected-${Clientt_}"><span class="showSelectedFunil" id="ishowSelectedFunil">SF: ${F_Client_}</span><span class="showSelectedTemplate-${Clientt_}" id="ishowSelectedTemplate-${Clientt_}">ST: ${T_Client_}</span></abbr>
                                        </div>
                                      </div>\n`
            document.querySelector(`#${Clientt_}`).innerHTML = clientHTMLDestroy

            status.innerHTML = `Client_ <strong>${Clientt_}</strong> foi <strong>Ligado</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> foi <strong>Ligado</strong>!`)
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> ao <strong>Ligar</strong> Client_ <strong>${Clientt_}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao <strong>Ligar</strong> Client_ <strong>${Clientt_}</strong>!`)
        }

        resetLoadingBar()
        //Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR ReinitializeClient_ ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> ReinitializeClient_ <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function selectClient_(Clientt_) {
    if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Clientt_}</strong> not Ready.`, setLogError)
        return
    }
    try {
        Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const abbrShowSelected = document.querySelector(`#iabbrshowselected-${Clientt_}`)
        //console.log(abbrShowSelected)
        const showSelectedFunil = document.querySelector(`#ishowSelectedFunil-${Clientt_}`)
        const showSelectedTemplate = document.querySelector(`#ishowSelectedTemplate-${Clientt_}`)
        //console.log(showSelectedFunil)
        //console.log(showSelectedTemplate)

        const divClientt_ = document.querySelector(`#${Clientt_}`)
        const capList = document.querySelector(`caption`)

        if (Client_ !== '') {   
            const divClientt_Temp = document.querySelector(`#${Client_}`)
            if (divClientt_Temp !== null) {
                divClientt_Temp.style.cssText =
                'border-top: 5px solid var(--colorBlack); border-bottom: 5px solid var(--colorBlack); transition: var(--configTrasition03s);'
            }
        }
        if (divClientt_ === null) {
            status.innerHTML = `Client_ <strong>${Clientt_}</strong> <strong>Não</strong> existe!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> <strong>Não</strong> existe!`)
            resetLoadingBar()

            Client_NotReady = false
            
            return
        }

        const response = await axios.post('/client/select', { Client_: Clientt_ })
        let Sucess = response.data.sucess
        if (Sucess) {
            divClientt_.style.cssText =
                'border-top: 5px solid var(--colorBlue); border-bottom: 5px solid var(--colorBlue); transition: var(--configTrasition03s);'

            capList.innerHTML = `<stronger>${Clientt_}</stronger>`
            
            Client_ = Clientt_

            const Type_Selected = 4
            const response2 = await axios.get('/features/selecteds', { params: { Type_Selected } }) 
            const F_Client_ = response2.data.F_Client_
            const T_Client_ = response2.data.T_Client_

            abbrShowSelected.title = `Selecionado - Funil: ${F_Client_} Template: ${T_Client_}`
            showSelectedFunil.textContent = `SF: ${F_Client_}`
            showSelectedTemplate.textContent = `ST: ${T_Client_}`

            if (F_Client_ === '') {
                await selectFunil_(Funil_, false)
            } else {
                await selectFunil_(F_Client_, false)
            }

            if (T_Client_ === '') {
                await selectTemplate_(Template_)
            } else {
                await selectTemplate_(T_Client_)
            }

            document.title = `${Clientt_}`
            status.innerHTML = `Client_ <strong>${Clientt_}</strong> <strong>Selecionado</strong>`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> <strong>Selecionado</strong>.`)
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> <strong>selecionando</strong> Client_ <strong>${Clientt_}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <strong>selecionando</strong> Client_ <strong>${Clientt_}</strong>!`)
        }

        resetLoadingBar()
        Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR selectClient_ ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> selectClient_ <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        Client_NotReady = false
        resetLoadingBar()
    }
}

async function eraseChatDataByQuery(isFromTerminal, queryFromTerminal) {
    if (ChatDataNotReady) {
        displayOnConsole(`> ℹ️ <strong>${Client_}</strong> not Ready.`, setLogError)
        return
    }
    if (isHideAP) {
        return
    }
    try {
        ChatDataNotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'
        
        const status = document.querySelector('#status')

        let queryList = null
        let userConfirmation = confirm(`Tem certeza de que deseja apagar o ChatData <strong>${Client_}</strong> de ${queryList} da lista?\nsera apagado para sempre.`)
        if (userConfirmation) {
            if (isFromTerminal) {
                queryList = queryFromTerminal
            } else {
                const query = document.querySelector('#inputList').value
                queryList = query
            }
            const response = await axios.delete('/chatdata/query-erase', { params: { queryList } })
            const Sucess = response.data.sucess
            const Is_Empty = response.data.empty
            const Is_Empty_Input = response.data.empty_input
            const Chat_Data_json = response.data.chatdatajson
            if (Is_Empty) {
                status.innerHTML = `Lista de <strong>${Chat_Data_json}</strong> <strong>${Client_}</strong> esta <strong>vazia</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Lista de <strong>${Chat_Data_json}</strong> <strong>${Client_}</strong> esta <strong>vazia</strong>!`)

                resetLoadingBar()
                if (isFromTerminal) isFromTerminal = false
                ChatDataNotReady = false
                return
            }
            if (Is_Empty_Input) {
                status.innerHTML = `ChatData <strong>${queryList}</strong> <strong>não</strong> foi <strong>encontrado</strong> na lista de <strong>${Chat_Data_json}</strong> <strong>${Client_}</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>ChatData <strong>${queryList}</strong> <strong>não</strong> foi <strong>encontrado</strong> na lista de <strong>${Chat_Data_json}</strong> <strong>${Client_}</strong>!`)

                resetLoadingBar()
                if (isFromTerminal) isFromTerminal = false
                ChatDataNotReady = false
                return  
            } 
            if (Sucess) {
                status.innerHTML = `<strong>${queryList}</strong> de <strong>${Chat_Data_json}</strong> <strong>${Client_}</strong> foi <strong>Apagado</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>${queryList}</strong> de <strong>${Chat_Data_json}</strong> <strong>${Client_}</strong> foi <strong>Apagado</strong>!`)
            } else {
                status.innerHTML = `<i><strong>ERROR</strong></i> ao <strong>Apagar</strong> ChatData <strong>${Client_}</strong> <strong>${queryList}</strong> de <strong>${Chat_Data_json}</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao <strong>Apagar</strong> ChatData <strong>${Client_}</strong> <strong>${queryList}</strong> de <strong>${Chat_Data_json}</strong>!`)
            }
        } else {
            resetLoadingBar()
            if (isFromTerminal) isFromTerminal = false
            
            ChatDataNotReady = false
            
            return
        }
        
        //document.querySelector('#inputList').value = ''
        resetLoadingBar()
        if (isFromTerminal) isFromTerminal = false

        ChatDataNotReady = false

        return
    } catch (error) {
        console.error(`> ⚠️ ERROR eraseChatDataByQuery ${Client_} ${Chat_Data_json}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> eraseChatDataByQuery ${Client_} ${Chat_Data_json}: ${error.message}`, setLogError)
        ChatDataNotReady = false
        resetLoadingBar()
    }
}
//async function allErase(sucess, empty, isFromTerminal) {
async function allErase() {
    if (ChatDataNotReady) {
        displayOnConsole(`> ℹ️  <strong>${Client_}</strong> not Ready.`, setLogError)
        return
    }
    if (isHideAP) {
        return
    }
    try {
        ChatDataNotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'
    
        const status = document.querySelector('#status')

        let userConfirmation = confirm(`Tem certeza de que deseja apagar todo o ChatData de ${Client_}?\nsera apagado para sempre.`)
        if (userConfirmation) {
            /*const response = await axios.delete('/chatdata/all-erase')
            let Sucess = null
            let Is_Empty = null
            if (isFromTerminal) {
                Sucess = sucess 
                Is_Empty = empty
            } else {
                let sucess = response.data.sucess
                let empty = response.data.empty
                Sucess = sucess
                Is_Empty = empty
            }*/
            const response = await axios.delete('/chatdata/all-erase')
            const Sucess = response.data.sucess
            const Is_Empty = response.data.empty
            const Chat_Data_json = response.data.chatdatajson
            if (Is_Empty) {
                status.innerHTML = `ChatData de <strong>${Chat_Data_json}</strong> <strong>${Client_}</strong> esta <strong>vazia</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>ChatData de <strong>${Chat_Data_json}</strong> <strong>${Client_}</strong> esta <strong>vazia</strong>!`)

                resetLoadingBar()

                ChatDataNotReady = false

                return
            } 
            if (Sucess) {
                status.innerHTML = `<strong>Todo</strong> o ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong> foi <strong>Apagado</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Todo</strong> o ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong> foi <strong>Apagado</strong>!`)
            } else {
                status.innerHTML = `<i><strong>ERROR</strong></i> ao Apagar <strong>todo</strong> ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao Apagar <strong>todo</strong> ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong>!`)
            } 
        } else {
            resetLoadingBar()

            ChatDataNotReady = false

            return
        }
        
        ChatDataNotReady = false
        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR allEraseList <strong>${Client_}</strong> ${Chat_Data_json}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> allEraseList <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong>: ${error.message}`, setLogError)
        ChatDataNotReady = false
        resetLoadingBar()
    }
}
//async function searchChatDataBySearch(isFromTerminal, dataFromTerminal, searchFromTerminal) {
async function searchChatDataBySearch(isFromTerminal, searchFromTerminal) {
    if (ChatDataNotReady) {
        displayOnConsole(`> ℹ️ <strong>${Client_}</strong> not Ready.`, setLogError)
        return
    }
    if (isHideAP) {
        return
    }
    try {
        ChatDataNotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')
        let list = document.querySelector('table tbody')
        let counter = document.querySelector('thead > tr > td ')
        
        let response = null
        let Search = null
        //let ChatData = null
        if (isFromTerminal) {
            Search = searchFromTerminal
            response = await axios.get('/chatdata/search-print', { params: { Search } })
            //ChatData = dataFromTerminal
        } else {
            let sendSearch = document.querySelector('#sendSearchList')
            sendSearch.style.cssText =
            'background-color: #2b2b2b; color: var(--colorWhite); border: 1px solid var(--colorWhite); transition: var(--configTrasition01s);'
            setTimeout(function() {
                sendSearch.style.cssText =
                'background-color: var(--colorInteractionElements); color: var(--colorBlack); border: 1px solid rgba(0, 0, 0, 0); transition: var(--configTrasition03s);'
            }, 100)
            
            const search = document.querySelector('#inputList').value
            Search = search
            response = await axios.get('/chatdata/search-print', { params: { Search } })
            //const chatdata = response.data.chatdata
            //ChatData = chatdata
            //displayOnConsole(ChatData)
        }
        const Sucess = response.data.sucess
        const Is_Empty = response.data.empty
        const Is_Empty_Input = response.data.empty_input
        const ChatData = response.data.chatdata
        const Chat_Data_json = response.data.chatdatajson

        if (Is_Empty) {
            status.innerHTML = `Lista de <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Lista de <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`)

            list.innerHTML = ''
            
            counter.textContent = `0`
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'

            resetLoadingBar()
            if (isFromTerminal) isFromTerminal = false

            ChatDataNotReady = false

            return
        }
        if (Is_Empty_Input) {
            status.innerHTML = `ChatData <strong>${Search}</strong> não foi encontrado na lista de <strong>${Chat_Data_json}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>ChatData <strong>${Search}</strong> não foi encontrado na lista de <strong>${Chat_Data_json}</strong>!`)

            list.innerHTML = ''
            
            counter.textContent = `0`
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'

            resetLoadingBar()
            if (isFromTerminal) isFromTerminal = false

            ChatDataNotReady = false

            return  
        } 
        if (Sucess) {
            status.innerHTML = `Listando ChatData <strong>${Search}</strong> de <strong>${Chat_Data_json}</strong>...`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Listando ChatData <strong>${Search}</strong> de <strong>${Chat_Data_json}</strong>...`)
            
            list.innerHTML = ''
            
            ChatData.forEach(entry => {
                counter.textContent = `${ChatData.length}`

                let row = list.insertRow(-1)
                
                let cell1 = row.insertCell(0)
                cell1.textContent = entry.chatId
                
                let cell2 = row.insertCell(1)
                cell2.textContent = entry.name
                
            })
            /*let bList = document.querySelector('#erase')
            
            bList.style.cssText =
                'opacity: 1 pointer-events: unset;'*/

            status.innerHTML = `Listado ChatData ${Search} de ${Chat_Data_json}!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Listado ChatData ${Search} de ${Chat_Data_json}!`)
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> ao pesquisar ChatData <strong>${Search}</strong> de <strong>${Chat_Data_json}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao pesquisar ChatData <strong>${Search}</strong> de <strong>${Chat_Data_json}</strong>!`)
        }

        //document.querySelector('#inputList').value = ''
        if (isFromTerminal) isFromTerminal = false
        ChatDataNotReady = false
        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR searchChatDataBySearch ${Chat_Data_json}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> searchChatDataBySearch ${Chat_Data_json}: ${error.message}`, setLogError)
        if (isFromTerminal) isFromTerminal = false
        ChatDataNotReady = false
        resetLoadingBar()
    }
}
//async function allPrint(Sucess, Is_Empty, ChatData, isFromButton, isallerase) {
async function allPrint(isFromButton, isallerase, Clientt_) {
    if (ChatDataNotReady) {
        displayOnConsole(`> ℹ️ <strong>${Client_}</strong> not Ready.`, setLogError)
        return
    }
    if (isHideAP) {
        return
    }
    try {
        if (!isallerase) {  
            if (Clientt_ !== null) {   
                if (Client_ !== Clientt_) {
                    return
                }
            }
        }

        ChatDataNotReady = true


        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')
        let list = document.querySelector('table tbody')
        let counter = document.querySelector('thead > tr > td ')

        if (isallerase) {
            await axios.get('/chatdata/all-print', { params: { isallerase } })
            counter.textContent = `0`
            
            list.innerHTML = ''
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'
            
            resetLoadingBar()

            ChatDataNotReady = false

            return
        }

        /*let Sucess = null
        let Is_Empty = null
        let ChatData = null*/
        const response = await axios.get('/chatdata/all-print')
        /*if (isFromButton) {
            /*let listShow = document.querySelector('#showList')
            let listShowAbbr = document.querySelector('#abbrShowList')
            if (isTableHidden === null) {
                isTableHidden = true
                listShow.style.cssText = 
                'background-color: var(--colorWhite); color: var(--colorBlack); pointer-events: auto; opacity: 1;'
                listShowAbbr.title = `STATUS Lista: visivel`
            } else if (isTableHidden = true) {
                isTableHidden = true
                listShow.style.cssText = 
                'background-color: var(--colorWhite); color: var(--colorBlack); pointer-events: auto; opacity: 1;'
                listShowAbbr.title = `STATUS Lista: visivel`
            }
            
            let tableList = document.querySelector('#listChatData')
            tableList.style.cssText =
            'display: inline-block; opacity: 1;'
            setTimeout(function() {
                tableList.style.cssText =
                'display: inline-block; opacity: 1;'
            }, 100)
            let eraseButton = document.querySelector('#erase')
            eraseButton.style.cssText =
            'display: inline-block; opacity: 1;'
            setTimeout(function() {
                eraseButton.style.cssText =
                'display: inline-block; opacity: 1;'
            }, 100)
            let sucess = response.data.sucess
            let empty = response.data.empty
            let chatdata = response.data.chatdata
            Sucess = sucess
            Is_Empty = empty
            ChatData = chatdata
        } /*else {
            Sucess = sucess 
            Is_Empty = empty
            ChatData = chatdata
        }*/
        const Sucess = response.data.sucess
        const Is_Empty = response.data.empty
        const ChatData = response.data.chatdata
        const Chat_Data_json = response.data.chatdatajson
        /*Sucess = sucess
        Is_Empty = empty
        ChatData = chatdata*/

        if (Is_Empty) {
            status.innerHTML = `ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`)

            counter.textContent = `0`
            
            list.innerHTML = ''
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'
            
            resetLoadingBar()

            ChatDataNotReady = false
            
            return
        } 
        if (Sucess) {
            if (isFromButton) {
                status.innerHTML = `Listando <strong>todo</strong> ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong>...`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Listando <strong>todo</strong> ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong>...`)
            }

            list.innerHTML = ''
            
            for (let entry of ChatData) {
                counter.textContent = `${ChatData.length}`
                
                let row = list.insertRow(-1)

                let cell1 = row.insertCell(0)
                cell1.textContent = entry.chatId
                
                let cell2 = row.insertCell(1)
                cell2.textContent = entry.name    
            }
            /*let bList = document.querySelector('#erase')
            
            bList.style.cssText =
                'opacity: 1 pointer-events: unset;'*/
            if (isFromButton) {
                status.innerHTML = `<strong>Todo</strong> ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong> Listado!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Todo</strong> ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong> Listado`)
            }
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> ao listar <strong>todo</strong> ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao listar <strong>todo</strong> ChatData de <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong>!`)
        } 

        isFromButton = true
        ChatDataNotReady = false
        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR allPrint <strong>${Client_}</strong> ${Chat_Data_json}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> allPrint <strong>${Client_}</strong> <strong>${Chat_Data_json}</strong>: ${error.message}`, setLogError)
        isFromButton = true
        ChatDataNotReady = false
        resetLoadingBar()
    }
}

async function counterExceeds(QR_Counter_Exceeds) {
    if (isExceeds) {
        displayOnConsole('> ℹ️  <strong>Client_</strong> not Ready.', setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        isExceeds = true

        const mainContent = document.querySelector('#content')
        mainContent.style.cssText =
            'display: inline-block;'

        const status = document.querySelector('#status')
        status.innerHTML = `Excedido <strong>todas</strong> as tentativas (<strong>${QR_Counter_Exceeds}</strong>) de conexão pelo <strong>QR_Code</strong> ao <strong>WhatsApp Web</strong>, <strong>Tente novamente</strong>!`
        displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Excedido <strong>todas</strong> as tentativas (<strong>${QR_Counter_Exceeds}</strong>) de conexão pelo <strong>QR_Code</strong> ao <strong>WhatsApp Web</strong>, <strong>Tente novamente</strong>!`)
        
        if (!isFromNew) {
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            isStarted = false
        } else {
            isStartedNew = false
        }

        document.querySelector('#qrCode').innerText = ''
        const codeQr = document.querySelector('#qrCode')
        codeQr.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            codeQr.style.cssText =
            'display: none; opacity: 0;'
        }, 300)

        document.title = 'Tente iniciar novamente'

        resetLoadingBar()
    } catch (error) {
        document.title = 'ERROR'
        console.error(`> ⚠️ ERROR counterExceeds: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> counterExceeds: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}

async function generateQrCode(QR_Counter, Clientt_) {
    if (isQrOff) {
        displayOnConsole(`> ℹ️ <strong>${Clientt_}</strong> not Ready.`, setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        isQrOff = true

        document.title = `QR-Code(${QR_Counter}) ${Clientt_}`

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'

        if (!isFromNew) {
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: none; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                'display: none; opacity: 0;'
            }, 300)
        }
        
        const status = document.querySelector('#status')
        const codeQr = document.querySelector('#qrCode')

        status.innerHTML = `<strong>${Clientt_}</strong> Gerando <strong>Qr-Code</strong>...`
        displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>${Clientt_}</strong> Gerando <strong>Qr-Code</strong>...`)
        
        const response = await axios.get('/client/qr-code')
        const { qrString, Is_Conected } = response.data
        if (Is_Conected) {
            setTimeout(function() {
                status.innerHTML = `<strong>${Clientt_}</strong> ja <strong>conectado</strong>!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>${Clientt_}</strong> ja <strong>conectado</strong>!`)
            }, 100)
            
            document.querySelector('#qrCode').innerText = ''

            codeQr.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                codeQr.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)

            resetLoadingBar()
        } else {
            status.innerHTML = `↓↓ <strong>${Clientt_}</strong> tente se <strong>Conectar</strong> pela <strong>${QR_Counter}</strong>º ao <strong>WhatsApp Web</strong> pelo <strong>QR-Code</strong> abaixo ↓↓`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>↓↓ <strong>${Clientt_}</strong> tente se <strong>Conectar</strong> pela <strong>${QR_Counter}</strong>º ao <strong>WhatsApp Web</strong> pelo <strong>QR-Code</strong> abaixo ↓↓`)
            
            codeQr.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                codeQr.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
                
            document.querySelector('#qrCode').innerText = qrString
            //displayOnConsole(qrString)
            
            resetLoadingBar()
        }
    } catch (error) {
        const status = document.querySelector('#status')
        console.error(`> ⚠️ ERROR generateQrCode ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> generateQrCode <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        document.title = 'ERROR'
        status.innerHTML = `<i><strong>ERROR</strong></i> Gerando <strong>Qr-Code</strong> <strong>${Clientt_}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> Gerando <strong>Qr-Code</strong> <strong>${Clientt_}</strong>!`)
        if (!isFromNew) {
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            isStarted = false
        }
        document.querySelector('#qrCode').innerText = ''
        const codeQr = document.querySelector('#qrCode')
        codeQr.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            codeQr.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        resetLoadingBar() 
    }
}

async function insertClient_Front(Clientt_, isActive, isNew) {
    if (!Client_NotReady) {
        displayOnConsole(`> ℹ️  <strong>${Clientt_}</strong> not Ready.`, setLogError)
        return
    }
    try {
        Client_NotReady = false

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        //ainda a testar o insert de posicao dinamica exponencial
        const ClientsDiv = document.querySelector('#Clients_')
        const allConteinerClients_ = ClientsDiv.querySelectorAll('.divClients_')
        let arrayIdNameClients_ = []
        allConteinerClients_.forEach((divElement) => {
            const Client_Id = divElement.id.split('_')[1]
            const Client_Name = divElement.id.split('_')[2]
            arrayIdNameClients_.push({ Client_Id, Client_Name })
        })
        let idNumberClient_DivAdjacent = null
        let isFirstUndefined = null
        if (arrayIdNameClients_.length > 0) {
            const response = await axios.get('/client/insert_exponecial_position_Client_', { params: { arrayIdNameClients_, isNew } })
            idNumberClient_DivAdjacent = response.data.idnumberclient_divadjacent
            isFirstUndefined = response.data.isfirstundefined
        }

        const Type_Selected = 4
        const response = await axios.get('/features/selecteds', { params: { Type_Selected, Clientt_ } }) 
        const F_Client_ = response.data.F_Client_
        const T_Client_ = response.data.T_Client_
    
        const divAdjacent = document.querySelector(`#${idNumberClient_DivAdjacent}`)
        if (isActive) {
            const clientHTMlDestroy = `\n<div class="divClients_" id="${Clientt_}">
                                        <div>
                                            \n<abbr title="Client_ ${Clientt_}" id="abbrselect-${Clientt_}"><button class="Clients_" id="select-${Clientt_}" onclick="selectClient_('${Clientt_}')">${Clientt_}</button></abbr><abbr title="Renomear ${Clientt_}" id="abbrRename-${Clientt_}"><button class="Clients_Rename" id="Rename-${Clientt_}" onclick="RenameClient_('${Clientt_}')"><</button></abbr><abbr title="Desligar ${Clientt_}" id="abbrDestroy-${Clientt_}"><button class="Clients_Destroy" id="Destroy-${Clientt_}" onclick="DestroyClient_('${Clientt_}', true)"><</button></abbr><abbr title="Apagar ${Clientt_}" id="abbrerase-${Clientt_}"><button class="Clients_Erase" id="erase-${Clientt_}" onclick="eraseClient_('${Clientt_}')"><</button></abbr>\n
                                        </div>
                                        <div class="showSelected">
                                            <abbr title="Selecionado - Funil: ${F_Client_} Template: ${T_Client_}" id="iabbrshowselected-${Clientt_}"><span class="showSelectedFunil" id="ishowSelectedFunil-${Clientt_}">SF: ${F_Client_}</span><span class="showSelectedTemplate" id="ishowSelectedTemplate-${Clientt_}">ST: ${T_Client_}</span></abbr>
                                        </div>
                                      </div>\n`
            if (divAdjacent) {
                if (isFirstUndefined) {
                    divAdjacent.insertAdjacentHTML('beforebegin', clientHTMlDestroy)
                } else {
                    divAdjacent.insertAdjacentHTML('afterend', clientHTMlDestroy)
                }
            } else {
                ClientsDiv.innerHTML += clientHTMlDestroy
            }
        } else {
            const clientHTMLReinitialize = `\n<div class="divClients_" id="${Clientt_}">
                                             <div>
                                                 \n<abbr title="Client_ ${Clientt_}" id="abbrselect-${Clientt_}"><button class="Clients_" id="select-${Clientt_}" onclick="selectClient_('${Clientt_}')">${Clientt_}</button></abbr><abbr title="Renomear ${Clientt_}" id="abbrRename-${Clientt_}"><button class="Clients_Rename" id="Rename-${Clientt_}" onclick="RenameClient_('${Clientt_}')"><</button></abbr><abbr title="Ligar ${Clientt_}" id="abbrReinitialize-${Clientt_}"><button class="Clients_Reinitialize" id="Reinitialize-${Clientt_}" onclick="ReinitializeClient_('${Clientt_}')"><</button></abbr><abbr title="Apagar ${Clientt_}" id="abbrerase-${Clientt_}"><button class="Clients_Erase" id="erase-${Clientt_}" onclick="eraseClient_('${Clientt_}')"><</button></abbr>\n
                                             </div>
                                             <div class="showSelected">
                                                 <abbr title="Selecionado - Funil: ${F_Client_} Template: ${T_Client_}" id="iabbrshowselected-${Clientt_}"><span class="showSelectedFunil" id="ishowSelectedFunil-${Clientt_}">SF: ${F_Client_}</span><span class="showSelectedTemplate" id="ishowSelectedTemplate-${Clientt_}">ST: ${T_Client_}</span></abbr>
                                             </div>
                                           </div>\n`
            if (divAdjacent) {
                if (isFirstUndefined) {
                    divAdjacent.insertAdjacentHTML('beforebegin', clientHTMLReinitialize)
                } else {
                    divAdjacent.insertAdjacentHTML('afterend', clientHTMLReinitialize)
                }
            } else {
                ClientsDiv.innerHTML += clientHTMLReinitialize
            }
        }

        const divClientt_ = document.querySelector(`#${Clientt_}`)
        divClientt_.style.cssText =
            'border-top: 5px solid var(--colorBlack); border-bottom: 5px solid var(--colorBlack); transition: var(--configTrasition03s);'

        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR insertClient_Front ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> insertClient_Front <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
async function newClients() {
    if (isStartedNew) {
        displayOnConsole('> ℹ️ <strong>newClients</strong> not Ready.', setLogError)
        return
    }
    try {
        isStartedNew = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let userConfirmation = confirm('Tem certeza de que deseja criar um novo Client_?')
        if (!userConfirmation) {
            resetLoadingBar()

            isStartedNew = false

            return
        }

        isFromNew = true

        document.title = 'Criando novo Client'

        await axios.post('/client/new')

        resetLoadingBar()
    } catch (error) {
        document.title = 'ERROR'
        console.error(`> ⚠️ ERROR newClients: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> newClients: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}

let externalPromiseResolve
let Namet_ = null
async function setClientName(isInitiated) {
    /*if (Client_NotReady = false) {
        displayOnConsole(`> ℹ️  <strong>${Funilt_}</strong> not Ready.`, setLogError)
        return
    }*/
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const divInputClientName = document.querySelector(`#isendInputClientName`)
        const inputClientName = document.querySelector(`#iinputClientName`)
        const sendClientName = document.querySelector(`#isendSearchClientName`)
        if (isInitiated) {
            divInputClientName.style.cssText =
                'display: flex; height: 0px; border-top: 3px solid var(--colorBlack);'
            setTimeout(function() {
                divInputClientName.style.cssText =
                    'display: flex; height: 37px; border-top: 3px solid var(--colorBlack);'
            }, -1)
            setTimeout(function() {
                inputClientName.style.cssText =
                    'display: inline; opacity: 0;'
                sendClientName.style.cssText =
                    'display: flex; opacity: 0;'
                    setTimeout(function() {
                        inputClientName.style.cssText =
                            'display: inline; opacity: 1;'
                        sendClientName.style.cssText =
                            'display: flex; opacity: 1;'
                    }, 100)
            }, 100)
            await sleep(100)
            inputClientName.focus()
            const promise = new Promise((resolve, reject) => {
                externalPromiseResolve = resolve
            })
            status.innerHTML = `Digite um <strong>nome</strong> para a <strong>instancia</strong> Client_`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Digite um <strong>nome</strong> para a <strong>instancia</strong> Client_.`)
            document.title = `Digite um nome...`
            resetLoadingBar()
            await promise
            let barL = document.querySelector('#barLoading')
            barL.style.cssText =
                'width: 100vw; visibility: visible;'
            status.innerHTML = `Nome <strong>${Namet_}</strong> <strong>aceito</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i>Nome <strong>${Namet_}</strong> <strong>aceito</strong>!`)
            inputClientName.value = ''
            return Namet_
        } else {
            if (inputClientName.value.includes('_') || /\d/.test(inputClientName.value)) {
                status.innerHTML = `<i><strong>ERROR</strong></i> Caracteres <strong>'_'</strong> ou numeros <strong>não</strong> são aceitos!`
                displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> Caracteres <strong>'_'</strong> ou numeros <strong>não</strong> são aceitos!`)
                resetLoadingBar()
                return
            } else if (inputClientName.value.length === 0) {
                Namet_ = 'Client'
                inputClientName.style.cssText =
                    'display: inline; opacity: 0;'
                sendClientName.style.cssText =
                    'display: flex; opacity: 0;'
                setTimeout(function() {
                    inputClientName.style.cssText =
                        'display: none; opacity: 0;'
                    sendClientName.style.cssText =
                        'display: none; opacity: 0;'
                    divInputClientName.style.cssText =
                        'display: flex; height: 0px; border-top: 0px solid var(--colorBlack);'
                        setTimeout(function() {
                            divInputClientName.style.cssText =
                                'display: none; height: 0px; border-top: 0px solid var(--colorBlack);'
                        }, 300)
                }, 100)
                if (externalPromiseResolve) {
                    externalPromiseResolve()
                }
                resetLoadingBar()
            } else {
                Namet_ = inputClientName.value
                inputClientName.style.cssText =
                    'display: inline; opacity: 0;'
                sendClientName.style.cssText =
                    'display: flex; opacity: 0;'
                setTimeout(function() {
                    inputClientName.style.cssText =
                        'display: none; opacity: 0;'
                    sendClientName.style.cssText =
                        'display: none; opacity: 0;'
                    divInputClientName.style.cssText =
                        'display: flex; height: 0px; border-top: 0px solid var(--colorBlack);'
                        setTimeout(function() {
                            divInputClientName.style.cssText =
                                'display: none; height: 0px; border-top: 0px solid var(--colorBlack);'
                        }, 300)
                }, 100)
                if (externalPromiseResolve) {
                    externalPromiseResolve()
                }
                resetLoadingBar()
            }
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR setClientName: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> setClientName: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function RenameClient_(Clientt_) {
    /*if (Client_NotReady) {
        displayOnConsole(`> ℹ️  ${Clientt_} not Ready.`, setLogError)
        return
    }*/
    try {
        //Client_NotReady = true

        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const response = await axios.put('/client/rename-client-name', { Clientt_ })
        const Sucess = response.data.sucess
        const clientt_ = response.data.Clientt_

        if (Sucess) {
            const divClients_ = document.querySelector('#Clients_')
            divClients_.innerHTML = ''

            const newClientDiv = document.querySelector('#divNewClient')
            newClientDiv.style.cssText = 'display: flex; opacity: 0;' 
            setTimeout(() => newClientDiv.style.cssText = 'display: flex; opacity: 1;', 100)
            //o codigo abaixo e possivel botar tudo numa rota e devolver e fazer oq fas aqui que nsei como explica certinho, modelo REST e tals (se for preciso)

            const dir_Path = 'Local_Auth'
            const response = await axios.get('/functions/dir', { params: { dir_Path } })
            const Directories_ = response.data.dirs
            
            if (Directories_.length-1 === -1) {
                displayOnConsole(`> ⚠️ <strong>Dir</strong> Clients_ (<strong>${Directories_.length}</strong>) is <strong>empty</strong>.`)
                
                let exitInten = true
                await exit(exitInten)
            } else {
                displayOnConsole(`> ℹ️  <strong>Dir</strong> Clients_ has (<strong>${Directories_.length}</strong>) loading <strong>ALL</strong>...`)
                
                const response = await axios.get('/clients/active')
                const Actives_ = response.data.actives

                let Counter_Clients_ = 1
                for (let i = 1; i <= Directories_.length; i++) {
                const key = Actives_[Object.keys(Actives_)[Counter_Clients_-1]].instance
                    let isActive = null
                    if (key) {
                        isActive = false
                    } else {
                        isActive = true
                    }

                    Client_NotReady = true
                    await insertClient_Front(Directories_[Counter_Clients_-1], isActive, false)
                    //await selectClient_(Directories_[Counter_Clients_-1])
                    
                    Counter_Clients_++
                }
                displayOnConsole(`> ✅ <strong>Dir</strong> Clients_ loaded <strong>ALL</strong> (<strong>${Directories_.length}</strong>).`)
            }
            await selectClient_(clientt_)
            await ReinitializeClient_(clientt_)
            resetLoadingBar()
        } else {
            
            resetLoadingBar()
        }

        //Client_NotReady = false
    } catch (error) {
        console.error(`> ⚠️ ERROR RenameClient_ ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> RenameClient_ <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        //Client_NotReady = false
        resetLoadingBar()
    }
}
async function startBot() {
    if (isStarted) {
        displayOnConsole(`> ⚠️ <strong>${nameApp}</strong> ja esta <strong>Iniciado</strong>.`, setLogError)
        return        
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        isStarted = true

        if (isDisconected) {
            reconnectWebSocket()
        }

        document.title = `Iniciando ${nameApp}...`

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'

        let buttonStart = document.querySelector('#start')
        buttonStart.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            buttonStart.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        
        const status = document.querySelector('#status')
        status.innerHTML = `<strong>Iniciando</strong>...`
        displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Iniciando</strong>...`)
        
        document.querySelector('#qrCode').innerText = ''
        const codeQr = document.querySelector('#qrCode')
        codeQr.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            codeQr.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        const response = await axios.get('/clients/start')
        const Sucess = response.data.sucess
        if (Sucess) {
            document.title = `Iniciou o ${nameApp || 'BOT'} Corretamente`
            status.innerHTML = `<strong>Iniciou</strong> o ${nameApp || 'BOT'} <strong>Corretamente</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Iniciou</strong> o ${nameApp || 'BOT'} <strong>Corretamente</strong>!`)

            resetLoadingBar()
        } else {
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)

            document.title = 'ERROR'
            status.innerHTML = `<i><strong>ERROR</strong></i> ao iniciar o <strong>${nameApp || 'BOT'}</strong>!`
            displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao iniciar o <strong>${nameApp || 'BOT'}</strong>!`)
            
            isStarted = false

            resetLoadingBar()
        }
    } catch (error) {
        const status = document.querySelector('#status')
        console.error(`> ⚠️ ERROR startBot: ${error}`)
        displayOnConsole(`> ⚠️ ERROR startBot: ${error.message}`, setLogError)
        document.title = 'ERROR'
        status.innerHTML = `<i><strong>ERROR</strong></i> iniciando <strong>${nameApp || 'BOT'}</strong>!`
        displayOnConsole(`> ℹ️ <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> iniciando <strong>${nameApp || 'BOT'}</strong>!`)
        let buttonStart = document.querySelector('#start')
        buttonStart.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            buttonStart.style.cssText =
                'display: inline-block; opacity: 1;'
        }, 100)
        isStarted = false
        document.querySelector('#qrCode').innerText = ''
        const codeQr = document.querySelector('#qrCode')
        codeQr.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            codeQr.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        
        resetLoadingBar()
    }
}

//tarefas bot frontend 
//em desenvolvimento...
    //na pagina separar por secoes, secao do qr code do start da lista e do funil e ser possivel mover entre elas mudar as posicao as ordem, e fazer algo igual ao funil ne, por mouse mesmo selecionando e segurnado, e a ordem que ficar ser salvo e quando voltar da load em tudo, talves pra fazer isso implementar um sistema que inves de display e opacity que seja automatico com javacript colado as funcoes na pagina, pode melhora a seguranca e tals ne
    //desenvolver o desenvolvimento de funils padroes de msg automaticas para o bot e implantar front end, principalmente front end so vai ser possivel mexer com isso la
        //filetypes, dps que for selecionado ele muda o design pra outro, e se for um audio ele da opcao e o tempo de delay e tals usa a mesma logica do delay padrao por MSG pro staterecording, e para apagar tem que deselecionar o arquivo ent fazer um esquema de design que o botao que apagar primeiro deseleciona e dps libera pra apagar, ma so substitui por outro botao n preccisa criar uma loucura na funcao de apagar so pra isso, e em questao de legendas pra documentos fotos videos ter tipo um textarea imbutido ali pra isso
        //texareas, tem uma opcao pro typing la e usa o delay padrao MSG e tals logica, e ter modos de tamanhos especificos selecionaveis da area de texto iguais do chat do whatsapp balao e tals, 
        //delay, meio que ja ta feito sla
        //counter, um sistemas semelhante ao delay pra pegar as info valor, e um sistemas de da pra selecionar outros card pra entra dentro do type counter ne pra ambos os caminhos e os que n tiver dps de acabar tudo vai continuar rodar normal, agora um sistemas de couter dentro do outro ja n sei como fazeria talves um igual? ai teria q ter um sistema de acumulo e ordem de selecoes counter kakakakaak meu deus du ceu
        //em cada card ter um botao pra apagar o proprio
        //implementar toda a logica tudo e tals disso tudo quando acabar o design e planejamento da logica do funil
        //arrumar a barra horizontal dos atraso-...
        //adicionar modo escuro e claro e cor do balao verde o whatsapp nos textarea funcoes opcoes
        //arrumar meio de onoff pq com uma varavel true false n vai dar pra todos tem comflito usando
        //alguma forma de junta o type file selected com o select dinamicamente num so inves de separado por display none iiii foda com as permisao tbm
        //atribuir o sistema do newTypeMSGShown() pra todos os toggle de tudo mui mior nue alem de que vai fazer ser possivel tudo as funcoes dos types e zas, alem de que agora pode ser possivel a questao que deixar tudo automatico questao de cenarios e tals sem precisar se preocupar com todos ai com isso seria automatico as reacoes a os cenarios e zas
    //faze o REST se der o ful mas n da ne, ver as funcoes do front e ver se precisa de uma rota so pra aquilo, padroniza os nomes dos callback websocket igual as rota, separa as rota e websocket do server, e os models client chatdada wweb.jss do app sla ainda como vai ser o app, ver os sistemas de camadas de tudo como fazer o certo ou se o gabiarra que e o jeito que ta ja serve sla 

//a desenvolver...
    //?//melhoras o tempo e utilizacao dos status multi client e mais?
    //arrumar meios de as coisas serem automaticas funcoes acionarem de acordo com certar coisas inves de prever todo cenario possivel em varias funcoes
    //talves algum dia fazer ums sistema frontend de commands igual no backend com requesicao http usando as funcoes padrao de funcao do backend e tals
    //?//arrumar meios de n precisar dessas variaveis permanentes, ou pelo menos diminuir muito?
    //?//melhorar o problema de de vez em quando o a barra de loading do start n funciona direito?
    //coisa de design... o border bottom do #divNewClient n ta aparecendo seila
    //quando ta fechado o server ao reconectar o estilo do botao WS some, arruma pra n sumir e so fazer oq tem que fazer que e deixa vermelhor ou laranja sla pisca e tals ne po
    //se tiver algum pau com estilos ver getComputedStyle computedStyle.(propriedade) trocar pra esse modo modelo sla inves de (nome).style.(propriedade)