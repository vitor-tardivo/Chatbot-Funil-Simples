//scriptBot.js frontEnd

function isMobile() {//IDENTIFY IF THE USER IS FROM A PHONE
    try {    
        const userAgent = navigator.userAgent
        return /Mobi|Android|iPhone|iPod|iPad|Windows\sPhone|Windows\sCE|BlackBerry|BB10|IEMobile|Opera\sMini|Mobile\sSafari|webOS|Mobile|Tablet|CriOS/i.test(userAgent)
    } catch(error) {
        console.error(`> ⚠️ ERROR isMobile: ${error}`)
        displayOnConsole(`> ⚠️ <i><i><strong>ERROR</strong></i></i> isMobile: ${error.message}`, setLogError)
    }
}

window.onload = function(event) {
    try {
        axios.get('/reload')
    } catch(error) {
        console.error(`> ⚠️ ERROR onload: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> onload: ${error.message}`, setLogError)
    }
}
window.onbeforeunload = function(event) {
    try {    
        event.preventDefault()
    } catch(error) {
        console.error(`> ⚠️ ERROR onbeforeunload: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> onbeforeunload: ${error.message}`, setLogError)
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

function sleep(time) {
    try {
        return new Promise((resolve) => setTimeout(resolve, time))
    } catch(error) {
        console.error(`> ⚠️ ERROR sleep: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> sleep: ${error.message}`, setLogError)
    }
}

let wss = null

let setLogError = true

let isDisconected = false

let isFromTerminal = false

let isVisibleList = null

let isExceeds = true 

let isQrOff = true

let isAlreadyDir = false

let Clientt_Temp = null

let Is_From_New = false//

let Clientt_ = null//

let Is_Not_Ready = true//

let Is_Started_New = true//

let Is_Started = false

let nameApp = null
let versionApp = null

document.addEventListener('DOMContentLoaded', async function () {// LOAD MEDIA QUERY PHONE AND ELSE
    try {
        if (isMobile()) {
            console.log('User is from a Phone.')
            
            var link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = '../styles/Bot/mediaQueryBot.css'
            document.head.appendChild(link)
        } else {
            console.log('User is from a Desktop.')
        }

        const response = await axios.get('/app-data')
        const Bot_Name = response.data.name
        const dataName = document.querySelector('#appName')
        nameApp = `${Bot_Name.toUpperCase()}`
        dataName.textContent = nameApp
        const Version_ = response.data.version
        const dataVersion = document.querySelector('#appVersion')
        versionApp = 'v' +`${Version_}`
        dataVersion.textContent = versionApp


        const response2 = await axios.get('/what-stage')
        const stage = response2.data.data
        const QR_Counter = response2.data.data2
        Clientt_ = response2.data.data3
        
        if (stage === 0) {
            
        }
        if (stage === 1) {
            if (!Is_From_New) {
                Is_Started = true
            }
            isQrOff = false
            generateQrCode(QR_Counter, Clientt_)
        }
        if (stage === 2) {
            if (!Is_From_New) {
                Is_Started = true
            }
            await authsucess(Clientt_)
            await ready(Clientt_)
        }
        if (stage === 3) {
            if (!Is_From_New) {
                Is_Started = true
            }
            await authsucess(Clientt_)
            await ready(Clientt_)
            let Is_From_New = true
            isQrOff = false
            generateQrCode(QR_Counter)
        }

        const reloadButton = document.querySelector('#reload')
        let reloadAbbr = document.querySelector('#abbrReload')

        reloadButton.style.cssText =
            'color: var(--colorContrast); background-color: var(--colorYellow); cursor: progress;'
        reloadAbbr.title = `WebSocket STATUS: carregando`
        
        if (wss) wss.close(), wss = null
        wss = new WebSocket(`ws://${window.location.host}`)
        /*wss = new WebSocket(`wss://${window.location.host}`)*/
        webSocket()

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

        loadConsoleStyles()
    } catch (error) {
        console.error(`> ⚠️ ERROR DOMContentLoaded: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> DOMContentLoaded: ${error.message}`, setLogError)
    }
})

//Patterns for Miliseconds times:
// Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
// Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
// Formated= 1 \ * 60 * 1000 = 1-Minute
// Formated= 1 \ * 1000 = 1-Second

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

function reconnectWebSocket() {
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
        webSocket()

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
            console.log(`> ✅ Conectado Usuario ao <strong>WebSocket</strong>: `, event)
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
            console.log(`> ⚠️ Desconectado Usuario do <strong>WebSocket</strong>: `, event)
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
            console.error(`> ❌ ERROR ao reconectar Usuario ao <strong>WebSocket</strong>: `, event)
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
            reconectAttempts = 0
            
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
        case 'exit':
            isReconectionOff = true
            let exitInten = false
            await exit(exitInten)
            break
        case 'log':
            //console.log(logData.message)
            displayOnConsole(dataWebSocket.message)
            /*const logElement = document.createElement('div')
            logElement.textContent = logData.message
            document.querySelector('#log').appendChild(logElement)
            autoScroll()*/
            break
        case 'statues-ws':
            const statuses = dataWebSocket.data
            statusesWs(statuses)
            break
        case 'all-print':
            /*const Sucess = dataWebSocket.sucess
            const Is_Empty = dataWebSocket.empty
            const ChatData = dataWebSocket.chatdata*/
            const isFromButton = false
            //allPrint(Sucess, Is_Empty, ChatData, isFromButton, Is_From_All_Erase)
            allPrint(isFromButton, false)
            break
        case 'all-print-auxiliar':
            /*const Sucess = dataWebSocket.sucess
            const Is_Empty = dataWebSocket.empty
            const ChatData = dataWebSocket.chatdata*/
            const isFromButton2 = false
            const Is_From_All_Erase = dataWebSocket.isallerase
            //allPrint(Sucess, Is_Empty, ChatData, isFromButton, Is_From_All_Erase)
            allPrint(isFromButton2, Is_From_All_Erase)
            break
        case 'clients_':
            const Client_ = dataWebSocket.client
            let isReadyInsert = false
            isAlreadyDir = true
            await insertClient_Front(isReadyInsert, Client_)
            break
        case 'start':
            startBot()
            break
        case 'generate_qr_code':
            const QR_Counter = dataWebSocket.data
            const Client__ = dataWebSocket.data2

            isQrOff = false
            setTimeout(function() {
                generateQrCode(QR_Counter, Client__)
            }, 100)
            break
        case 'qr_exceeds':
            isExceeds = false
            const QR_Counter_Exceeds = dataWebSocket.data
            counterExceeds(QR_Counter_Exceeds)
            break
        case 'auth_autenticated':
            const Client___ = dataWebSocket.client
            await authsucess(Client___);
            break
        case 'auth_failure':
            isReconectionOff = true
            authFailure()
            break
        case 'ready':
            const Client____ = dataWebSocket.client
            ready(Client____);
            break
        case 'search-search':
            //const Parse_Data = dataWebSocket.data
            const Search = dataWebSocket.search.trim()
            const isFromTerminal = true
            searchChatDataBySearch(isFromTerminal, Search)
            //searchChatDataBySearch(isFromTerminal, Parse_Data, Search)
            break
        case 'all-erase':
            /*const Sucess2 = dataWebSocket.sucess
            const Is_Empty2 = dataWebSocket.empty
            const isFromTerminal2 = true*/
            //allErase(Sucess2, Is_Empty2, isFromTerminal2)
            allErase()
            break
        case 'erase-query':
            const search2 = dataWebSocket.Search.trim()
            const isFromTerminal3 = true
            eraseChatDataByQuery(isFromTerminal3, search2)
            break
        case 'erase-client':
            const Client_____ = dataWebSocket.client
            let isReadyErase = false
            let isFromTerminal_ = true
            eraseClient_(isFromTerminal_, isReadyErase, Client_____)
            break
        case 'select':
            const Client______ = dataWebSocket.client
            let isReadySelect = false
            selectClient_(isReadySelect, Client______)
            break
        case 'new':
            newClients()
            break
        case 'error':
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

        Is_Not_Ready = true

        Is_From_New = false

        Clientt_ = null

        Is_Not_Ready = true

        Is_Started_New = true

        Is_Started = false

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

        isVisibleHideButton = null
        let listShow = document.querySelector('#showList')
        let listShowAbbr = document.querySelector('#abbrShowList')
        listShow.style.cssText = 
            'display: inline-block; background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0;'
        setTimeout(function() {
            listShow.style.cssText =
                'display: none; background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0;'
        }, 300)
        listShowAbbr.title = `STATUS Lista: null`

        const status = document.querySelector('#status')
        if (exitInten) {
            status.textContent = `<strong>Reset page</strong>!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Reset page</strong>!`)
        } else {
            status.textContent = `<i><strong>ERROR</strong></i> Back End!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> Back End!`)
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

        isVisibleList = null
        const listButton = document.querySelector('#list')
        listButton.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            listButton.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        let tableList = document.querySelector('#listChatData')
        tableList.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            tableList.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        let eraseButton = document.querySelector('#erase')
        eraseButton.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            eraseButton.style.cssText =
                'display: none; opacity: 0;'
        }, 300)

        resetLoadingBar()
    } catch(error) {
        if (exitInten) {
            console.error(`> ⚠️ ERROR exit(Reset page): ${error}`)
            displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> exit(<strong>Reset page</strong>): ${error.message}`, setLogError)
        } else {
            console.error(`> ⚠️ ERROR exit: ${error}`)
            displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> exit: ${error.message}`, setLogError)
        }
        Is_Not_Ready = true

        Is_From_New = false

        Clientt_ = null

        Is_Not_Ready = true

        Is_Started_New = true

        Is_Started = false
        document.title = 'ERROR'
        resetLoadingBar()
    }
} 
async function authsucess(Client_) {
    try {
        if (!Is_From_New) {
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)
            Is_Started = true
        }

        const status = document.querySelector('#status')
        status.innerHTML = `Client_ <strong>${Client_}</strong> Realizado com Sucesso <strong>Autenticação</strong> ao WhatsApp Web pelo <strong>Local_Auth</strong>!`
        displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Client_}</strong> Realizado com Sucesso <strong>Autenticação</strong> ao WhatsApp Web pelo <strong>Local_Auth</strong>!`)
        
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

        Is_Not_Ready = false

        if (isDisconected) {
            reconnectWebSocket()
        }

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'
            
        Is_Started_New = false

        if (!Is_From_New) {
            Is_Started = true
        }

        const newClientDiv = document.querySelector('#divNewClient')
        newClientDiv.style.cssText = 'display: flex; opacity: 0;' 
        setTimeout(() => newClientDiv.style.cssText = 'display: flex; opacity: 1;', 100)
        if (!isAlreadyDir) {
            const response = await axios.get('/dir-front')
            const Directories_ = response.data.dirs
            
            if (Directories_.length-1 === -1) {
                displayOnConsole(`> ⚠️ <strong>Dir</strong> off Clients_ <strong>(${Directories_.length-1})</strong> is <strong>empty</strong>.`)

                let exitInten = true
                await exit(exitInten)
            } else {
                let Counter_Clients_ = 0
                for (let i = -1; i < Directories_.length-1; i++) {
                    let isReadyInsert = false
                    await insertClient_Front(isReadyInsert, Directories_[Counter_Clients_])
                    let isReadySelect = false
                    await selectClient_(isReadySelect, Directories_[Counter_Clients_])
                    Counter_Clients_++
                }
            }
        } else {
            isAlreadyDir = false
        }


        loadTableStyles()

        Is_From_New = false 
        
        document.title = `${nameApp} ${Client_} pronto`

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

        Is_Not_Ready = true

        if (isDisconected) {
            reconnectWebSocket()
        }
        document.title = 'ERROR'

        console.error(`> ❌ ERROR BackEnd authFailure`)
        displayOnConsole(`> ❌ <i><strong>ERROR</strong></i> BackEnd authFailure`, setLogError)

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'

        let listShow = document.querySelector('#showList')
        let listShowAbbr = document.querySelector('#abbrShowList')
        listShow.style.cssText = 
            'display: inline-block; background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0;'
        setTimeout(function() {
            listShow.style.cssText =
                'display: none; background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0;'
        }, 300)
        listShowAbbr.title = `STATUS Lista: null`

        isVisibleHideButton = null

        if (!Is_From_New) {
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            Is_Started = false
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

        isVisibleList = null
        const listButton = document.querySelector('#list')
        listButton.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            listButton.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        let tableList = document.querySelector('#listChatData')
        tableList.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            tableList.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        let eraseButton = document.querySelector('#erase')
        eraseButton.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            eraseButton.style.cssText =
            'display: none; opacity: 0;'
        }, 300)

        resetLoadingBar()
    } catch(error) {
        document.title = 'ERROR'
        console.error(`> ⚠️ ERROR authFailure: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> authFailure: ${error.message}`, setLogError)
        Is_Not_Ready = true
        resetLoadingBar()
    }
}

function clsConsole() {
    try {
        displayOnConsole(`cls/clear`)
        document.querySelector('#log').innerHTML = ''
        displayOnConsole(`cls/clear`)
    } catch (error) {
        console.error(`> ⚠️ ERROR clsConsole: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> clsConsole: ${error.message}`, setLogError)
    }
}
function saveTableStyles() {
    try {
        /*const consoleElement = document.querySelector('#console')
        const buttonHideConsole = document.querySelector('#hideConsole')
        const titleHideConsole = document.querySelector('#titleHide')*/


        const listButton = document.querySelector('#list')
        const tableList = document.querySelector('#listChatData')
        const eraseButton = document.querySelector('#erase')

        const listShow = document.querySelector('#showList')
        const listShowAbbr = document.querySelector('#abbrShowList')

        localStorage.setItem('tableStyles', JSON.stringify({
            /*width: consoleElement.style.width,
            title: titleHideConsole.title,
            textContent: buttonHideConsole.textContent,
            isVisibleHideButton: isVisibleHideButton*/


            listButtonCssText: listButton.style.cssText,
            tableListCssText: tableList.style.cssText,
            eraseButtonCssText: eraseButton.style.cssText,
            listShowCssText: listShow.style.cssText,
            listShowAbbrTitle: listShowAbbr.title,
            isVisibleList: isVisibleList
        }))
    } catch (error) {
        console.error(`> ⚠️ ERROR saveTableStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> saveTableStyles: ${error.message}`, setLogError)
    }
}
function loadTableStyles() {
    try {
        const savedStyles = localStorage.getItem('tableStyles')
        if (savedStyles) {
            const parsedStyles = JSON.parse(savedStyles)
            /*const consoleElement = document.querySelector('#console')
            const buttonHideConsole = document.querySelector('#hideConsole')
            const titleHideConsole = document.querySelector('#titleHide')*/


            const listButton = document.querySelector('#list')
            const tableList = document.querySelector('#listChatData')
            const eraseButton = document.querySelector('#erase')

            const listShow = document.querySelector('#showList')
            const listShowAbbr = document.querySelector('#abbrShowList')

            /*consoleElement.style.width = parsedStyles.width || '30.62vw'
            titleHideConsole.title = parsedStyles.title || 'Esconder o Terminal'
            buttonHideConsole.textContent = parsedStyles.textContent || '◀'
            isVisibleHideButton = parsedStyles.isVisibleHideButton !== undefined ? parsedStyles.isVisibleHideButton : null*/


            listButton.style.cssText = parsedStyles.listButtonCssText || 'display: inline-block; opacity: 1;' 
            setTimeout(() => listButton.style.cssText = 'display: inline-block; opacity: 1;', 100)
                        
            tableList.style.cssText = parsedStyles.tableListCssText || 'display: inline-block; opacity: 1;'
            setTimeout(() => tableList.style.cssText = 'display: inline-block; opacity: 1;', 100)

            eraseButton.style.cssText = parsedStyles.eraseButtonCssText || 'display: inline-block; opacity: 1;'
            setTimeout(() => eraseButton.style.cssText = 'display: inline-block; opacity: 1;', 100)

            listShow.style.cssText = parsedStyles.listShowCssText || 'display: inline-block; background-color: var(--colorWhite); color: var(--colorBlack); cursor: pointer; pointer-events: auto; opacity: 1;'
            listShowAbbr.title = parsedStyles.listShowAbbrTitle || `STATUS Lista: visivel`

            isVisibleList = parsedStyles.isVisibleList !== undefined ? parsedStyles.isVisibleList : null

            if (isVisibleList === null) {
                isVisibleList = true
                showTableList()
            } else {
                if (isVisibleList) {
                    /*consoleElement.style.width = '0'
                    titleHideConsole.title = 'Mostrar o Terminal'
                    buttonHideConsole.textContent = '▶'*/


                    listButton.style.cssText = 'display: inline-block; opacity: 0;' 
                    setTimeout(() => listButton.style.cssText = 'display: inline-block; opacity: 1;', 100)
                                
                    tableList.style.cssText = 'display: inline-block; opacity: 0;'
                    setTimeout(() => tableList.style.cssText = 'display: inline-block; opacity: 1;', 100)

                    eraseButton.style.cssText = 'display: inline-block; opacity: 0;'
                    setTimeout(() => eraseButton.style.cssText = 'display: inline-block; opacity: 1;', 100)

                    listShow.style.cssText = 'display: inline-block; background-color: var(--colorWhite); color: var(--colorBlack); cursor: pointer; pointer-events: auto; opacity: 1;'
                    listShowAbbr.title = `STATUS Lista: visivel`
                } else {
                    /*consoleElement.style.width = '30.62vw'
                    titleHideConsole.title = 'Esconder o Terminal'
                    buttonHideConsole.textContent = '◀'*/


                    listButton.style.cssText = 'display: inline-block; opacity: 0;' 
                    setTimeout(() => listButton.style.cssText = 'display: none; opacity: 0;', 100)
                                
                    tableList.style.cssText = 'display: inline-block; opacity: 0;'
                    setTimeout(() => tableList.style.cssText = 'display: none; opacity: 0;', 100)

                    eraseButton.style.cssText = 'display: inline-block; opacity: 0;'
                    setTimeout(() => eraseButton.style.cssText = 'display: none; opacity: 0;', 100)

                    listShow.style.cssText = 'display: inline-block; background-color: var(--colorBlack); color: var(--colorWhite); cursor: pointer; pointer-events: auto; opacity: 1;'
                    listShowAbbr.title = `STATUS Lista: escondido`                                                         
                }
            }
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR loadConsoleStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> loadConsoleStyles: ${error.message}`, setLogError)
    }
}
function showTableList() {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️ <strong>Client_</strong> not Ready.', setLogError)
        return
    }
    try {
        const listButton = document.querySelector('#list')
        let tableList = document.querySelector('#listChatData')
        let eraseButton = document.querySelector('#erase')

        let listShow = document.querySelector('#showList')
        let listShowAbbr = document.querySelector('#abbrShowList')
        
        if (isVisibleList === null) {
            isVisibleList = true
        } else if (isVisibleList === true) {
            isVisibleList = false
        } else if (isVisibleList === false) {
            isVisibleList = true
        }
        if (isVisibleList) {
            listShow.style.cssText = 
                'display: inline-block; background-color: var(--colorWhite); color: var(--colorBlack); cursor: pointer; pointer-events: auto; opacity: 1;'
            listShowAbbr.title = `STATUS Lista: visivel`
            
            listButton.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                listButton.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            tableList.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                tableList.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            eraseButton.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                eraseButton.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            
            isVisibleList = true

            saveTableStyles()
            return
        }
        if (isVisibleList !== true) {
            listShow.style.cssText = 
                'display: inline-block; background-color: var(--colorBlack); color: var(--colorWhite); cursor: pointer; pointer-events: auto; opacity: 1;'
            listShowAbbr.title = `STATUS Lista: escondido`
            
            listButton.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                listButton.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)
            tableList.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                tableList.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)
            eraseButton.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                eraseButton.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)

            isVisibleList = false

            saveTableStyles()
            return
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR showTableList: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> showTableList: ${error.message}`, setLogError)
    }
}
function saveConsoleStyles() {
    try {
        const consoleElement = document.querySelector('#console')
        const buttonHideConsole = document.querySelector('#hideConsole')
        const titleHideConsole = document.querySelector('#titleHide')

        localStorage.setItem('consoleStyles', JSON.stringify({
            width: consoleElement.style.width,
            title: titleHideConsole.title,
            textContent: buttonHideConsole.textContent,
            isVisibleHideButton: isVisibleHideButton
        }))
    } catch (error) {
        console.error(`> ⚠️ ERROR saveConsoleStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> saveConsoleStyles: ${error.message}`, setLogError)
    }
}
function loadConsoleStyles() {
    try {
        const savedStyles = localStorage.getItem('consoleStyles')
        if (savedStyles) {
            const parsedStyles = JSON.parse(savedStyles)
            const consoleElement = document.querySelector('#console')
            const buttonHideConsole = document.querySelector('#hideConsole')
            const titleHideConsole = document.querySelector('#titleHide')

            consoleElement.style.width = parsedStyles.width || '30.62vw'
            titleHideConsole.title = parsedStyles.title || 'Esconder o Terminal'
            buttonHideConsole.textContent = parsedStyles.textContent || '◀'
            isVisibleHideButton = parsedStyles.isVisibleHideButton !== undefined ? parsedStyles.isVisibleHideButton : null
            
            if (isVisibleHideButton === null) {
                isVisibleHideButton = true
                hideConsole()
            } else {
                if (isVisibleHideButton) {
                    consoleElement.style.width = '0'
                    titleHideConsole.title = 'Mostrar o Terminal'
                    buttonHideConsole.textContent = '▶'
                } else {
                    consoleElement.style.width = '30.62vw'
                    titleHideConsole.title = 'Esconder o Terminal'
                    buttonHideConsole.textContent = '◀'
                }
            }
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR loadConsoleStyles: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> loadConsoleStyles: ${error.message}`, setLogError)
    }
}
let isVisibleHideButton = null
function hideConsole() {
    try {
        let consoleElement = document.querySelector('#console')
    
        let buttonHideConsole = document.querySelector('#hideConsole')
        let titleHideConsole = document.querySelector('#titleHide')
    
        if (isVisibleHideButton === null) {
            isVisibleHideButton = true
        } else if (isVisibleHideButton === true) {
            isVisibleHideButton = false
        } else if (isVisibleHideButton === false) {
            isVisibleHideButton = true
        }
        
        if (isVisibleHideButton) {
            consoleElement.style.cssText = 
                'width: 0;'
            
            titleHideConsole.title = `Mostrar o Terminal`
            buttonHideConsole.textContent = `▶`
            /*buttonHideConsole.cssText =
                'transform: rotate(180deg) border-left: 2px solid var(--colorBlack) border-right: 0px solid var(--colorBlack)'*/
            isVisibleHideButton = true
            saveConsoleStyles()
            return
        }
        if (isVisibleHideButton !== true) {    
            consoleElement.style.cssText =
                'width: 30.62vw;'
            
            titleHideConsole.title = `Esconder o Terminal`
            buttonHideConsole.textContent = `◀`
            /*buttonHideConsole.cssText =
                'transform: rotate(0deg) border-left: 0px solid var(--colorBlack) border-right: 2px solid var(--colorBlack)'*/
            isVisibleHideButton = false
            saveConsoleStyles()
            return
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR hideConsole: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> hideConsole: ${error.message}`, setLogError)
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
        
        await axios.post('/command', { command: commandInput}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        /*await axios.post('/command', { command: commandInput }, {
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

async function eraseChatDataByQuery(isFromTerminal, queryFromTerminal) {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️ <strong>Client_</strong> not Ready.', setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'
        
        const status = document.querySelector('#status')

        let queryList = null
        let userConfirmation = confirm(`Tem certeza de que deseja apagar o ChatData de ${queryList} da lista?\nsera apagada para sempre.`)
        if (userConfirmation) {
            if (isFromTerminal) {
                queryList = queryFromTerminal
            } else {
                const query = document.querySelector('#inputList').value
                queryList = query
            }
            const response = await axios.delete('/erase-query', { params: { queryList } })
            const Sucess = response.data.sucess
            const Is_Empty = response.data.empty
            const Is_Empty_Input = response.data.empty_input
            const Chat_Data_json = response.data.chatdatajson
            if (Is_Empty) {
                status.innerHTML = `Lista de <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Lista de <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`)

                resetLoadingBar()
                if (isFromTerminal) {
                    isFromTerminal = false
                }
                return
            }
            if (Is_Empty_Input) {
                status.innerHTML = `ChatData <strong>${queryList}</strong> não foi encontrado na lista de <strong>${Chat_Data_json}</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>ChatData <strong>${queryList}</strong> não foi encontrado na lista de <strong>${Chat_Data_json}</strong>!`)

                resetLoadingBar()
                if (isFromTerminal) {
                    isFromTerminal = false
                }
                return  
            } 
            if (Sucess) {
                status.innerHTML = `<strong>${queryList}</strong> de <strong>${Chat_Data_json}</strong> foi <strong>Apagado</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>${queryList}</strong> de <strong>${Chat_Data_json}</strong> foi <strong>Apagado</strong>!`)
            } else {
                status.innerHTML = `<i><strong>ERROR</strong></i> ao <strong>Apagar</strong> ChatData <strong>${queryList}</strong> de <strong>${Chat_Data_json}</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao <strong>Apagar</strong> ChatData <strong>${queryList}</strong> de <strong>${Chat_Data_json}</strong>!`)
            }

            //document.querySelector('#inputList').value = ''
            resetLoadingBar()
            if (isFromTerminal) {
                isFromTerminal = false
            }
        } else {
            resetLoadingBar()
            if (isFromTerminal) {
                isFromTerminal = false
            }
            return
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR eraseChatDataByQuery ${Chat_Data_json}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> eraseChatDataByQuery ${Chat_Data_json}: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
//async function allErase(sucess, empty, isFromTerminal) {
async function allErase() {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️  <strong>Client_</strong> not Ready.', setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'
    
        const status = document.querySelector('#status')

        let userConfirmation = confirm('Tem certeza de que deseja apagar a lista?\nsera apagada para sempre.')
        if (userConfirmation) {
            /*const response = await axios.delete('/all-erase')
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
            const response = await axios.delete('/all-erase')
            const Sucess = response.data.sucess
            const Is_Empty = response.data.empty
            const Chat_Data_json = response.data.chatdatajson
            if (Is_Empty) {
                status.innerHTML = `Lista de <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Lista de <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`)

                resetLoadingBar()
                return
            } 
            if (Sucess) {
                status.innerHTML = `<strong>Todo</strong> o ChatData de <strong>${Chat_Data_json}</strong> foi <strong>Apagado</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Todo</strong> o ChatData de <strong>${Chat_Data_json}</strong> foi <strong>Apagado</strong>!`)
            } else {
                status.innerHTML = `<i><strong>ERROR</strong></i> ao Apagar <strong>todo</strong> ChatData de <strong>${Chat_Data_json}</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao Apagar <strong>todo</strong> ChatData de <strong>${Chat_Data_json}</strong>!`)
            } 
        } else {
            resetLoadingBar()
            return
        }
        
        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR allEraseList ${Chat_Data_json}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> allEraseList <strong>${Chat_Data_json}</strong>: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
//async function searchChatDataBySearch(isFromTerminal, dataFromTerminal, searchFromTerminal) {
async function searchChatDataBySearch(isFromTerminal, searchFromTerminal) {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️ <strong>Client_</strong> not Ready.', setLogError)
        return
    }
    try {
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
            response = await axios.get('/search-search', { params: { Search } })
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
            response = await axios.get('/search-search', { params: { Search } })
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
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Lista de <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`)

            list.innerHTML = ''
            
            counter.textContent = `0`
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'

            resetLoadingBar()
            if (isFromTerminal) {
                isFromTerminal = false
            }
            return
        }
        if (Is_Empty_Input) {
            status.innerHTML = `ChatData <strong>${Search}</strong> não foi encontrado na lista de <strong>${Chat_Data_json}</strong>!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>ChatData <strong>${Search}</strong> não foi encontrado na lista de <strong>${Chat_Data_json}</strong>!`)

            list.innerHTML = ''
            
            counter.textContent = `0`
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'

            resetLoadingBar()
            if (isFromTerminal) {
                isFromTerminal = false
            }
            return  
        } 
        if (Sucess) {
            status.innerHTML = `Listando ChatData <strong>${Search}</strong> de <strong>${Chat_Data_json}</strong>...`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Listando ChatData <strong>${Search}</strong> de <strong>${Chat_Data_json}</strong>...`)
            
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
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Listado ChatData ${Search} de ${Chat_Data_json}!`)
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> ao pesquisar ChatData <strong>${Search}</strong> de <strong>${Chat_Data_json}</strong>!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao pesquisar ChatData <strong>${Search}</strong> de <strong>${Chat_Data_json}</strong>!`)
        }

        //document.querySelector('#inputList').value = ''
        resetLoadingBar()
        if (isFromTerminal) {
            isFromTerminal = false
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR searchChatDataBySearch ${Chat_Data_json}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> searchChatDataBySearch ${Chat_Data_json}: ${error.message}`, setLogError)
        if (isFromTerminal) {
            isFromTerminal = false
        } 
        resetLoadingBar()
    }
}
//async function allPrint(Sucess, Is_Empty, ChatData, isFromButton, isallerase) {
async function allPrint(isFromButton, isallerase) {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️ <strong>Client_</strong> not Ready.', setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')
        let list = document.querySelector('table tbody')
        let counter = document.querySelector('thead > tr > td ')

        if (isallerase) {
            await axios.get('/all-print', { params: { isallerase } })
            counter.textContent = `0`
            
            list.innerHTML = ''
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'
            
            resetLoadingBar()
            return
        }

        /*let Sucess = null
        let Is_Empty = null
        let ChatData = null*/
        const response = await axios.get('/all-print')
        /*if (isFromButton) {
            /*let listShow = document.querySelector('#showList')
            let listShowAbbr = document.querySelector('#abbrShowList')
            if (isVisibleList === null) {
                isVisibleList = true
                listShow.style.cssText = 
                'background-color: var(--colorWhite); color: var(--colorBlack); pointer-events: auto; opacity: 1;'
                listShowAbbr.title = `STATUS Lista: visivel`
            } else if (isVisibleList = true) {
                isVisibleList = true
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
            status.innerHTML = `Lista de <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Lista de <strong>${Chat_Data_json}</strong> esta <strong>vazia</strong>!`)

            counter.textContent = `0`
            
            list.innerHTML = ''
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'
            
            resetLoadingBar()
            return
        } 
        if (Sucess) {
            if (isFromButton) {
                status.innerHTML = `Listando <strong>todo</strong> ChatData de <strong>${Chat_Data_json}</strong>...`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Listando <strong>todo</strong> ChatData de <strong>${Chat_Data_json}</strong>...`)
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
                status.innerHTML = `<strong>Todo</strong> ChatData de <strong>${Chat_Data_json}</strong> Listado!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Todo</strong> ChatData de <strong>${Chat_Data_json}</strong> Listado`)
            }
            
            isFromButton = true
            resetLoadingBar()
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> ao listar <strong>todo</strong> ChatData de <strong>${Chat_Data_json}</strong>!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao listar <strong>todo</strong> ChatData de <strong>${Chat_Data_json}</strong>!`)
            isFromButton = true
            resetLoadingBar()
        } 
    } catch (error) {
        console.error(`> ⚠️ ERROR allPrint ${Chat_Data_json}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> allPrint <strong>${Chat_Data_json}</strong>: ${error.message}`, setLogError)
        isFromButton = true
        resetLoadingBar()
    }
}

async function eraseClient_(isFromTerminal, isReadyErase, Clientt_) {
    if (isReadyErase) {
        displayOnConsole(`>  ℹ️  ${Clientt_} not Ready.`, setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let userConfirmation = confirm(`Tem certeza de que deseja apagar o Client_ ${Clientt_}?\nsera apagada para sempre.`)
        if (userConfirmation) {
            const status = document.querySelector('#status')

            const response = await axios.delete('/client-erase', { params: { Clientt_ } })
            const Sucess = response.data.sucess
            const Is_Empty = response.data.empty
            const Is_Empty_Input = response.data.empty_input
            if (Is_Empty) {
                status.innerHTML = `Dados de <strong>${Clientt_}</strong> esta <strong>vazio</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Dados de <strong>${Clientt_}</strong> esta <strong>vazio</strong>`)

                resetLoadingBar()
                if (isFromTerminal) {
                    isFromTerminal = false
                }
                return
            }
            if (Is_Empty_Input) {
                status.innerHTML = `Client_ <strong>${Clientt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> não foi encontrado em <strong>nenhum</strong> dado!`)

                resetLoadingBar()
                if (isFromTerminal) {
                    isFromTerminal = false
                }
                return  
            } 
            if (Sucess) {
                const response1 = await axios.get('/dir-front')
                const Directories_1 = response1.data.dirs

                const divClientt_ = document.querySelector(`#${Clientt_}`)
                divClientt_.remove()

                status.innerHTML = `Client_ <strong>${Clientt_}</strong> foi <strong>Apagado</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> foi <strong>Apagado</strong>!`)

                await sleep(1.5 * 1000)
                const response2 = await axios.get('/dir-front')
                const Directories_2 = response2.data.dirs

                if (Directories_2.length-1 === -1) {
                    status.innerHTML = `<strong>Dir</strong> off Clients_ (<strong>${Directories_2.length}</strong>) is <strong>empty</strong>!`
                    displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Dir</strong> off Clients_ (<strong>${Directories_2.length}</strong>) is <strong>empty</strong>!`)

                    let exitInten = true
                    await exit(exitInten)
                    await axios.put('/reset-page')
                } else {
                    const clientIdNumber = Clientt_.match(/\d+/g)

                    let Counter_Clients_ = 0
                    for (let i = -1; i < Directories_1.length-1; i++) {
                        const clientDirIdNumber = Directories_2[Counter_Clients_-1].match(/\d+/g)

                        if (clientIdNumber === clientDirIdNumber) {
                            let posArrayClient = Counter_Clients_

                            if (Directories_1[posArrayClient++] === null) {
                                posArrayClient--
                            } else {
                                posArrayClient++
                            }
                        } else {
                            Counter_Clients_++
                        }
                    }
    
                    let isReadySelect = false
                    await selectClient_(isReadySelect, `Client_${posArrayClient}`)
                }
            } else {
                status.innerHTML = `<i><strong>ERROR</strong></i> ao <strong>Apagar</strong> Client_ <strong>${Clientt_}</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao <strong>Apagar</strong> Client_ <strong>${Clientt_}</strong>!`)
            }

            //document.querySelector('#inputList').value = ''
            resetLoadingBar()
            if (isFromTerminal) {
                isFromTerminal = false
            }
        } else {
            resetLoadingBar()
            if (isFromTerminal) {
                isFromTerminal = false
            }
            return
        }

        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR eraseClient_ ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> eraseClient_ <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
async function selectClient_(isReadySelect, Clientt_) {
    if (isReadySelect) {
        displayOnConsole(`>  ℹ️  <strong>${Clientt_}</strong> not Ready.`, setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const status = document.querySelector('#status')

        const divClientt_ = document.querySelector(`#${Clientt_}`)
        const capList = document.querySelector(`caption`)

        const divClientt_Temp = document.querySelector(`#${Clientt_Temp}`)
        if (divClientt_Temp !== null) {
            divClientt_Temp.style.cssText =
                'border-top: 5px solid var(--colorBlack); border-bottom: 5px solid var(--colorBlack); transition: var(--configTrasition03s);'
        }
        if (divClientt_ === null) {
            status.innerHTML = `Client_ <strong>${Clientt_}</strong> <strong>Não</strong> existe!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> <strong>Não</strong> existe!`)
            resetLoadingBar()
            return
        }

        const response = await axios.post('/select', { Client_: Clientt_ })
        let Sucess = response.data.sucess
        if (Sucess) {
            divClientt_.style.cssText =
                'border-top: 5px solid var(--colorBlue); border-bottom: 5px solid var(--colorBlue); transition: var(--configTrasition03s);'

            capList.innerHTML = `<stronger>${Clientt_}</stronger>`

            Clientt_Temp = Clientt_

            status.innerHTML = `Client_ <strong>${Clientt_}</strong> <strong>Selecionado</strong>`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Client_ <strong>${Clientt_}</strong> <strong>Selecionado</strong>.`)
        } else {
            status.innerHTML = `<i><strong>ERROR</strong></i> <strong>selecionando</strong> Client_ <strong>${Clientt_}</strong>!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> <strong>selecionando</strong> Client_ <strong>${Clientt_}</strong>!`)
        }

        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR selectClient_ ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> selectClient_ <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
async function insertClient_Front(isReadyInsert, Clientt_) {
    if (isReadyInsert) {
        displayOnConsole(`>  ℹ️  <strong>${Clientt_}</strong> not Ready.`, setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        const ClientsDiv = document.querySelector('#Clients_')
        let clientHTML = `<div id="${Clientt_}"><abbr title="Client_ ${Clientt_}"><button class="Clients_" onclick="selectClient_(false, '${Clientt_}')">${Clientt_}</button></abbr><abbr title="Erase ${Clientt_}"><button class="Clients_Erase" onclick="eraseClient_(false, false, '${Clientt_}')"><</button></abbr></div>`
        ClientsDiv.innerHTML += clientHTML

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

function counterExceeds(QR_Counter_Exceeds) {
    if (isExceeds) {
        displayOnConsole('>  ℹ️  <strong>Client_</strong> not Ready.', setLogError)
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
        displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>Excedido <strong>todas</strong> as tentativas (<strong>${QR_Counter_Exceeds}</strong>) de conexão pelo <strong>QR_Code</strong> ao <strong>WhatsApp Web</strong>, <strong>Tente novamente</strong>!`)
        
        if (!Is_From_New) {
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            Is_Started = false
        } else {
            Is_Started_New = false
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
//lembra pra deixar false o isQrOff = true pra dar certo o new client
async function generateQrCode(QR_Counter, Clientt_) {
    if (isQrOff) {
        displayOnConsole(`>  ℹ️ <strong>${Clientt_}</strong> not Ready.`, setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        isQrOff = true

        document.title = `QR-Code(${QR_Counter}) ${Clientt_} WhatsApp Web`

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'

        if (!Is_From_New) {
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
        displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>${Clientt_}</strong> Gerando <strong>Qr-Code</strong>...`)
        
        axios.get('/qr')
        .then(response => {
            const { qrString, Is_Conected } = response.data

            if (Is_Conected) {
                setTimeout(function() {
                    status.innerHTML = `<strong>${Clientt_}</strong> ja <strong>conectado</strong>!`
                    displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>${Clientt_}</strong> ja <strong>conectado</strong>!`)
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
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i>↓↓ <strong>${Clientt_}</strong> tente se <strong>Conectar</strong> pela <strong>${QR_Counter}</strong>º ao <strong>WhatsApp Web</strong> pelo <strong>QR-Code</strong> abaixo ↓↓`)
                
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
        })
        .catch(error => {
            console.error(`> ⚠️ ERROR buscando Qr-Code ${Clientt_}: ${error}`)
            displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> buscando <strong>Qr-Code</strong> <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
            document.title = 'ERROR'
            status.innerHTML = `<i><strong>ERROR</strong></i> Buscando <strong>Qr-Code</strong> <strong>${Clientt_}</strong>!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> Buscando <strong>Qr-Code</strong> <strong>${Clientt_}</strong>!`)
            if (!Is_From_New) {
                let buttonStart = document.querySelector('#start')
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 0;'
                setTimeout(function() {
                    buttonStart.style.cssText =
                        'display: inline-block; opacity: 1;'
                }, 100)
                Is_Started = false
            }
            document.querySelector('#qrCode').innerText = ''
            codeQr.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                codeQr.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)
            resetLoadingBar()
        })
    } catch (error) {
        const status = document.querySelector('#status')
        console.error(`> ⚠️ ERROR generateQrCode ${Clientt_}: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> generateQrCode <strong>${Clientt_}</strong>: ${error.message}`, setLogError)
        document.title = 'ERROR'
        status.innerHTML = `<i><strong>ERROR</strong></i> Gerando <strong>Qr-Code</strong> <strong>${Clientt_}</strong>!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> Gerando <strong>Qr-Code</strong> <strong>${Clientt_}</strong>!`)
        if (!Is_From_New) {
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            Is_Started = false
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

async function newClients() {
    if (Is_Started_New) {
        displayOnConsole('>  ℹ️ <strong>Client_</strong> not Ready.', setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        let userConfirmation = confirm('Tem certeza de que deseja criar um novo Client_?')
        if (!userConfirmation) {
            resetLoadingBar()
            return
        }

        Is_Started_New = true
        Is_From_New = true

        document.title = 'Criando novo Client'

        await axios.post('/new-client')

        resetLoadingBar()
    } catch (error) {
        document.title = 'ERROR'
        console.error(`> ⚠️ ERROR newClients: ${error}`)
        displayOnConsole(`> ⚠️ <i><strong>ERROR</strong></i> newClients: ${error.message}`, setLogError)
        Is_Started_New = false
        resetLoadingBar()
    }
}

async function startBot() {
    if (Is_Started) {
        displayOnConsole(`> ⚠️ <strong>${nameApp}</strong> ja esta <strong>Iniciado</strong>.`, setLogError)
        return        
    } else {
        try {
            let barL = document.querySelector('#barLoading')
            barL.style.cssText =
                'width: 100vw; visibility: visible;'

            Is_Started = true

            if (isDisconected) {
                reconnectWebSocket()
            }

            document.title = 'Iniciando ${nameApp}'

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
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Iniciando</strong>...`)
            
            document.querySelector('#qrCode').innerText = ''
            const codeQr = document.querySelector('#qrCode')
            codeQr.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                codeQr.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)
            const response = await axios.get('/start-bot')
            const Sucess = response.data.sucess
            if (Sucess) {
                document.title = 'Iniciou o ${nameApp} Corretamente'
                status.innerHTML = `<strong>Iniciou</strong> o ${nameApp} <strong>Corretamente</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><strong>Iniciou</strong> o ${nameApp} <strong>Corretamente</strong>!`)

                resetLoadingBar()
            } else {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 0;'
                setTimeout(function() {
                    buttonStart.style.cssText =
                        'display: inline-block; opacity: 1;'
                }, 100)

                document.title = 'ERROR'
                status.innerHTML = `<i><strong>ERROR</strong></i> ao iniciar o <strong>${nameApp}</strong>!`
                displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> ao iniciar o <strong>${nameApp}</strong>!`)
                
                Is_Started = false

                resetLoadingBar()
            }
        } catch (error) {
            const status = document.querySelector('#status')
            console.error(`> ⚠️ ERROR startBot: ${error}`)
            displayOnConsole(`> ⚠️ ERROR startBot: ${error.message}`, setLogError)
            document.title = 'ERROR'
            status.innerHTML = `<i><strong>ERROR</strong></i> iniciando <strong>${nameApp}</strong>!`
            displayOnConsole(`>  ℹ️  <i><strong><span class="sobTextColor">(status)</span></strong></i><i><strong>ERROR</strong></i> iniciando <strong>${nameApp}</strong>!`)
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            Is_Started = false
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
}

//tarefas bot frontend 
//em desenvolvimento...
    //mandar certo os nomes certos dos json selecionado e client
    //ao usar qualquer funcao colocar o client no lugar do CHATDATA da lista
    //melhoras o tempo e utilizacao dos staus multi client e mais
    //melhorar o visual do texto no console, adiciona strong italic talves cores a palavras e tals
    //fazer do id do name um array a cada novo adiciona um e se for apagar apaga e se um novo adionar do que tiver vazio na ordem de 1 a 10 e vai indo se tiver o numero que apago mais um ou menos um ent ser ouotro, o contrario no caso se n tiver sla oq
    
//a desenvolver...
    //arrumar meios de as coisas serem automaticas funcoes acionarem de acordo com certar coisas inves de prever todo cenario possivel em varias funcoes
    //talves algum dia fazer ums sistema frontend de commands igual no backend com requesicao http usando as funcoes padrao de funcao do backend e tals
    //?//arrumar meios de n precisar dessas variaveis permanentes, ou pelo menos diminuir muito?
    //?//melhorar o problema de de vez em quando o a barra de loading do start n funciona direito?
    //funcoes multi instancias...
    //coisa de design... o border bottom do #divNewClient n ta aparecendo seila
    //usa websocket pra salvar numa var o client atual do back e os caralho inves de pega por dentro das funcao, fazer algo global sla, mas pode ser incerto ent sla kkk
    //melhora o sistema de local storage dos q tem