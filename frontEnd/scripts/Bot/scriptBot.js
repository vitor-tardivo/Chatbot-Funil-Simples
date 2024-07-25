//scriptBot.js frontEnd
let Name_Software = 'bot'
let Version_ = '0.1.0'

function isMobile() {//IDENTIFY IF THE USER IS FROM A PHONE
    try {    
        const userAgent = navigator.userAgent
        return /Mobi|Android|iPhone|iPod|iPad|Windows\sPhone|Windows\sCE|BlackBerry|BB10|IEMobile|Opera\sMini|Mobile\sSafari|webOS|Mobile|Tablet|CriOS/i.test(userAgent)
    } catch(error) {
        console.error(`> ⚠️ ERROR isMobile: ${error}`)
        displayOnConsole(`> ⚠️ ERROR isMobile: ${error.message}`, setLogError)
    }
}

window.onload = function(event) {
    try {
        axios.get('/reload')
    } catch(error) {
        console.error(`> ⚠️ ERROR onload: ${error}`)
        displayOnConsole(`> ⚠️ ERROR onload: ${error.message}`, setLogError)
    }
}
window.onbeforeunload = function(event) {
    try {    
        event.preventDefault()
    } catch(error) {
        console.error(`> ⚠️ ERROR onbeforeunload: ${error}`)
        displayOnConsole(`> ⚠️ ERROR onbeforeunload: ${error.message}`, setLogError)
    }
}
document.addEventListener('DOMContentLoaded', async function () {// LOAD MEDIA QUERY PHONE
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

        const response = await axios.get('/what-stage')
        const stage = response.data.data
        const QR_Counter = response.data.data2
        
        if (stage === 0) {
            
        }
        if (stage === 1) {
            Is_Started = true
            isQrOff = false
            generateQrCode(QR_Counter)
        }
        if (stage === 2) {
            Is_Started = true
            authsucess()
            ready()
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
        displayOnConsole(`> ⚠️ ERROR DOMContentLoaded: ${error.message}`, setLogError)
    }
})

function displayOnConsole(message, setLogError) {
    try {
        const logElement = document.createElement('div')
        logElement.textContent = `${message}`
        if (setLogError) {
            logElement.style.cssText =
                'color: var(--colorRed)'
        }
        document.querySelector('#log').appendChild(logElement)
        autoScroll()
    } catch(error) {
        console.error(`> ⚠️ ERROR displayOnConsole: ${error}`)
        displayOnConsole(`> ⚠️ ERROR displayOnConsole: ${error.message}`, setLogError)
    }
}

let wss = null

let setLogError = true

let isDisconected = false

let isFromTerminal = false

let Is_Not_Ready = true

let isVisibleList = null

let isExceeds = true 

let isQrOff = true

let Is_Started = false

function sleep(time) {
    try {
        return new Promise((resolve) => setTimeout(resolve, time))
    } catch(error) {
        console.error(`> ⚠️ ERROR sleep: ${error}`)
        displayOnConsole(`> ⚠️ ERROR sleep: ${error.message}`, setLogError)
    }
}
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
        displayOnConsole(`> ⚠️ ERROR autoSroll: ${error.message}`, setLogError)
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
        console.error(`> ⚠️ ERRO reconnectConsole: ${error}`)
        displayOnConsole(`> ⚠️ ERROR reconnectConsole: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
async function webSocket() {
    try {
        const reloadButton = document.querySelector('#reload')
        let reloadAbbr = document.querySelector('#abbrReload')

        wss.onopen = function(event) {
            console.log(`> ✅ Conectado Client ao WebSocket: `, event)
            displayOnConsole(`> ✅ Conectado Client ao WebSocket: ${event}`)
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
            console.log(`> ⚠️ Desconectado Client do WebSocket: `, event)
            displayOnConsole(`> ⚠️ Desconectado Client do WebSocket: ${event}`, setLogError)
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
            console.error(`> ❌ ERROR ao reconectar Client ao WebSocket(front): `, event)
            displayOnConsole(`> ❌ ERROR ao reconectar Client ao WebSocket(front): ${event}`, setLogError)
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
        displayOnConsole(`> ⚠️ ERROR webSocket: ${error.message}`, setLogError)
        reconectAttempts = 0
        resetLoadingBar()
    }
}
function handleWebSocketData(dataWebSocket) {
    switch (dataWebSocket.type) {
        case 'exit':
            isReconectionOff = true
            exit()
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
        case 'start':
            startBot();
            break
        case 'generate_qr_code':
            const QR_Counter = dataWebSocket.data
            setTimeout(function() {
                generateQrCode(QR_Counter)
            }, 100)
            break
        case 'qr_exceeds':
            isExceeds = false
            const QR_Counter_Exceeds = dataWebSocket.data
            counterExceeds(QR_Counter_Exceeds)
            break
        case 'auth_autenticated':
            authsucess();
            break
        case 'auth_failure':
            isReconectionOff = true
            authFailure()
            break
        case 'ready':
            ready();
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
        case 'error':
            console.error(`> ⚠️ ERROR Return WebSocket Conection: ${dataWebSocket.message}`)
            displayOnConsole(`> ⚠️ ERROR Retorno da Conexão WebSocket: ${dataWebSocket.message}`, setLogError)
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
        displayOnConsole(`> ⚠️ ERROR statusesWs: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}

function exit() {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        Is_Not_Ready = true

        if (isDisconected) {
            reconnectWebSocket()
        }
        document.title = 'ERROR'
        
        console.error(`> ❌ ERROR: BackEnd`)
        displayOnConsole(`> ❌ ERROR: BackEnd`, setLogError)

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'

        let listShow = document.querySelector('#showList')
        let listShowAbbr = document.querySelector('#abbrShowList')
        listShow.style.cssText = 
            'background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0.5;'
        listShowAbbr.title = `STATUS Lista: null`
        
        isVisibleHideButton = null

        const status = document.querySelector('#status')
        status.textContent = `ERROR Back End!`
        displayOnConsole(`>  ℹ️ (status)ERROR Back End!`)

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
        isQrOff = true

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
        console.error(`> ⚠️ ERROR exit: ${error}`)
        displayOnConsole(`> ⚠️ ERROR exit: ${error.message}`, setLogError)
        Is_Not_Ready = true
        resetLoadingBar()
    }
}
function authFailure() {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        Is_Not_Ready = true

        if (isDisconected) {
            reconnectWebSocket()
        }
        document.title = 'ERROR'

        console.error(`> ❌ ERROR Back End Auth Failure`)
        displayOnConsole(`> ❌ ERROR Back End Auth Failure`, setLogError)

        const mainContent = document.querySelector('#innerContent')
        mainContent.style.cssText =
            'display: inline-block;'

        let listShow = document.querySelector('#showList')
        let listShowAbbr = document.querySelector('#abbrShowList')
        listShow.style.cssText = 
            'background-color: var(--colorContrast); color: var(--colorInteractionElements); cursor: help; pointer-events: none; opacity: 0.5;'
        listShowAbbr.title = `STATUS Lista: null`

        isVisibleHideButton = null

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
        isQrOff = true

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
        console.error(`> ⚠️ ERROR authFailure: ${error}`)
        displayOnConsole(`> ⚠️ ERROR authFailure: ${error.message}`, setLogError)
        Is_Not_Ready = true
        resetLoadingBar()
    }
} 
function authsucess() {
    try {
        let buttonStart = document.querySelector('#start')
        buttonStart.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            buttonStart.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        
        document.querySelector('#qrCode').innerText = ''
        const codeQr = document.querySelector('#qrCode')
        codeQr.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            codeQr.style.cssText =
            'display: none; opacity: 0;'
        }, 300)
        isQrOff = true
    } catch(error) {
        console.error(`> ⚠️ ERROR authSucess: ${error}`)
        displayOnConsole(`> ⚠️ ERROR authSucess: ${error.message}`, setLogError)
    }
}
function ready() {
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

        const status = document.querySelector('#status')
            status.textContent = `Realizado com Sucesso Autenticação ao WhatsApp Web pelo Local_Auth!`
            displayOnConsole(`>  ℹ️ (status)Realizado com Sucesso Autenticação ao WhatsApp Web pelo Local_Auth!`)
            

        /*let buttonStart = document.querySelector('#start')
        buttonStart.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            buttonStart.style.cssText =
                'display: none; opacity: 0;'
        }, 300)*/

        /*document.querySelector('#qrCode').innerText = ''
        const codeQr = document.querySelector('#qrCode')
        codeQr.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            codeQr.style.cssText =
            'display: none; opacity: 0;'
        }, 300)*/
        isQrOff = true

        isVisibleList = true
        const listButton = document.querySelector('#list')
        listButton.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            listButton.style.cssText =
                'display: inline-block; opacity: 1;'
        }, 100)
        let tableList = document.querySelector('#listChatData')
        tableList.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            tableList.style.cssText =
                'display: inline-block; opacity: 1;'
        }, 100)
        let eraseButton = document.querySelector('#erase')
        eraseButton.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            eraseButton.style.cssText =
                'display: inline-block; opacity: 1;'
        }, 100)
        let listShow = document.querySelector('#showList')
        let listShowAbbr = document.querySelector('#abbrShowList')
        listShow.style.cssText = 
            'background-color: var(--colorWhite); color: var(--colorBlack); cursor: pointer; pointer-events: auto; opacity: 1;'
        listShowAbbr.title = `STATUS Lista: visivel`
        
        document.title = 'Bot ready'

        resetLoadingBar()
    } catch(error) {
        console.error(`> ⚠️ ERROR ready: ${error}`)
        displayOnConsole(`> ⚠️ ERROR ready: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}

function clsConsole() {
    try {
        document.querySelector('#log').innerHTML = ''
    } catch (error) {
        console.error(`> ⚠️ ERROR clsConsole: ${error}`)
        displayOnConsole(`> ⚠️ ERROR clsConsole: ${error.message}`, setLogError)
    }
}
function showTableList() {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️ Client not Ready.', setLogError)
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
                'background-color: var(--colorWhite); color: var(--colorBlack); cursor: pointer; pointer-events: auto; opacity: 1;'
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
            return
        }
        if (isVisibleList !== true) {
            listShow.style.cssText = 
                'background-color: var(--colorBlack); color: var(--colorWhite); cursor: pointer; pointer-events: auto; opacity: 1;'
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
            return
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR showTableList: ${error}`)
        displayOnConsole(`> ⚠️ ERROR showTableList: ${error.message}`, setLogError)
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
        displayOnConsole(`> ⚠️ ERROR saveConsoleStyles: ${error.message}`, setLogError)
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
        displayOnConsole(`> ⚠️ ERROR loadConsoleStyles: ${error.message}`, setLogError)
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
        displayOnConsole(`> ⚠️ ERROR hideConsole: ${error.message}`, setLogError)
    }
}

async function sendCommand() {
    try {
        let commandInput = document.querySelector('#commandInput').value.trim()
        let commandSend = document.querySelector('#commandSend')

        commandSend.style.cssText =
            'background-color: #2b2b2b; color: var(--colorWhite); border: 1px solid var(--colorWhite); transition: var(--configTrasition01s);'
        
        //console.log(commandInput)
        displayOnConsole(commandInput)
        
        await axios.post('/command', { command: commandInput }, {
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
        displayOnConsole(`> ⚠️ ERROR sendCommand: ${error.message}`, setLogError)
    }
}

async function eraseChatDataByQuery(isFromTerminal, queryFromTerminal) {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️ Client not Ready.', setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'
        
        const status = document.querySelector('#status')

        let queryList = null
        let userConfirmation = confirm(`Tem certeza de que deseja apagar o ChatData de ${queryList} da lista?\nsera apagada para sempre`)
        if (userConfirmation) {
            if (isFromTerminal) {
                queryList = queryFromTerminal
            } else {
                const query = document.querySelector('#inputList').value.trim()
                queryList = query
            }
            const response = await axios.delete('/erase-query', { params: { queryList } })
            const Sucess = response.data.sucess
            const Is_Empty = response.data.empty
            const Is_Empty_Input = response.data.empty_input
            if (Is_Empty) {
                status.textContent = `Lista de Chat_Data.json esta vazia!`
                displayOnConsole(`>  ℹ️ (status)Lista de Chat_Data.json esta vazia!`)

                resetLoadingBar()
                if (isFromTerminal) {
                    isFromTerminal = false
                }
                return
            }
            if (Is_Empty_Input) {
                status.textContent = `ChatData ${queryList} não foi encontrado na lista de Chat_Data.json!`
                displayOnConsole(`>  ℹ️ (status)ChatData ${queryList} não foi encontrado na lista de Chat_Data.json!`)

                resetLoadingBar()
                if (isFromTerminal) {
                    isFromTerminal = false
                }
                return  
            } 
            if (Sucess) {
                status.textContent = `${queryList} de ChatData.json foi Apagado!`
                displayOnConsole(`>  ℹ️ (status)${queryList} de ChatData.json foi Apagado!`)
            } else {
                status.textContent = `ERROR ao Apagar ChatData ${queryList} de ChatData.json!`
                displayOnConsole(`>  ℹ️ (status)ERROR ao Apagar ChatData ${queryList} de ChatData.json!`)
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
        console.error(`> ⚠️ ERROR eraseChatDataByQuery: ${error}`)
        displayOnConsole(`> ⚠️ ERROR eraseChatDataByQuery: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
//async function allErase(sucess, empty, isFromTerminal) {
async function allErase() {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️ Client not Ready.', setLogError)
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
            if (Is_Empty) {
                status.textContent = `Lista de Chat_Data.json esta vazia!`
                displayOnConsole(`>  ℹ️ (status)Lista de Chat_Data.json esta vazia!`)

                resetLoadingBar()
                return
            } 
            if (Sucess) {
                status.textContent = `Todo o ChatData de Chat_Data.json foi Apagado!`
                displayOnConsole(`>  ℹ️ (status)Todo o ChatData de Chat_Data.json foi Apagado!`)
            } else {
                status.textContent = `ERROR ao Apagar todo ChatData de Chat_Data.json!`
                displayOnConsole(`>  ℹ️ (status)ERROR ao Apagar todo ChatData de Chat_Data.json!`)
            } 
        } else {
            resetLoadingBar()
            return
        }
        
        resetLoadingBar()
    } catch (error) {
        console.error(`> ⚠️ ERROR allEraseList: ${error}`)
        displayOnConsole(`> ⚠️ ERROR allEraseList: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
//async function searchChatDataBySearch(isFromTerminal, dataFromTerminal, searchFromTerminal) {
async function searchChatDataBySearch(isFromTerminal, searchFromTerminal) {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️ Client not Ready.', setLogError)
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
            
            const search = document.querySelector('#inputList').value.trim()
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

        if (Is_Empty) {
            status.textContent = `Lista de Chat_Data.json esta vazia!`
            displayOnConsole(`>  ℹ️ (status)Lista de Chat_Data.json esta vazia!`)

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
            status.textContent = `ChatData ${Search} não foi encontrado na lista de Chat_Data.json!`
            displayOnConsole(`>  ℹ️ (status)ChatData ${Search} não foi encontrado na lista de Chat_Data.json!`)

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
            status.textContent = `Listando ChatData ${Search} de ChatData.json...`
            displayOnConsole(`>  ℹ️ (status)Listando ChatData ${Search} de ChatData.json...`)
            
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

            status.textContent = `Listado ChatData ${Search} de Chat_Data.json!`
            displayOnConsole(`>  ℹ️ (status)Listado ChatData ${Search} de Chat_Data.json!`)
        } else {
            status.textContent = `ERROR ao pesquisar ChatData ${Search} de Chat_Data.json!`
            displayOnConsole(`>  ℹ️ (status)ERROR ao pesquisar ChatData${Search} de Chat_Data.json!`)
        }

        //document.querySelector('#inputList').value = ''
        resetLoadingBar()
        if (isFromTerminal) {
            isFromTerminal = false
        }
    } catch (error) {
        console.error(`> ⚠️ ERROR searchChatDataBySearch: ${error}`)
        displayOnConsole(`> ⚠️ ERROR searchChatDataBySearch: ${error.message}`, setLogError)
        if (isFromTerminal) {
            isFromTerminal = false
        } 
        resetLoadingBar()
    }
}
//async function allPrint(Sucess, Is_Empty, ChatData, isFromButton, isallerase) {
async function allPrint(isFromButton, isallerase) {
    if (Is_Not_Ready) {
        displayOnConsole('>  ℹ️ Client not Ready.', setLogError)
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

        let Sucess = null
        let Is_Empty = null
        let ChatData = null
        const response = await axios.get('/all-print')
        if (isFromButton) {
            let listShow = document.querySelector('#showList')
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
        let sucess = response.data.sucess
        let empty = response.data.empty
        let chatdata = response.data.chatdata
        Sucess = sucess
        Is_Empty = empty
        ChatData = chatdata

        if (Is_Empty) {
            status.textContent = `Lista de Chat_Data.json esta vazia!`
            displayOnConsole(`>  ℹ️ (status)Lista de Chat_Data.json esta vazia!`)

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
                status.textContent = `Listando todo ChatData de ChatData.json...`
                displayOnConsole(`>  ℹ️ (status)Listando todo ChatData de ChatData.json...`)
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
                status.textContent = `Todo ChatData de ChatData.json Listado!`
                displayOnConsole(`>  ℹ️ (status)Todo ChatData de ChatData.json Listado!`)
            }
            
            isFromButton = true
            resetLoadingBar()
        } else {
            status.textContent = `ERROR ao listar todo ChatData de ChatData.json!`
            displayOnConsole(`>  ℹ️ (status)ERROR ao listar todo ChatData de ChatData.json!`)
            isFromButton = true
            resetLoadingBar()
        } 
    } catch (error) {
        console.error(`> ⚠️ ERROR  allPrint: ${error}`)
        displayOnConsole(`> ⚠️ ERROR  allPrint: ${error.message}`, setLogError)
        isFromButton = true
        resetLoadingBar()
    }
}

function counterExceeds(QR_Counter_Exceeds) {
    if (isExceeds) {
        displayOnConsole('>  ℹ️ Client not Ready.', setLogError)
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
        status.textContent = `Excedido todas as tentativas (${QR_Counter_Exceeds}) de conexão pelo QR_Code ao WhatsApp Web, Tente novamente!`
        displayOnConsole(`>  ℹ️ (status)Excedido todas as tentativas (${QR_Counter_Exceeds}) de conexão pelo QR_Code ao WhatsApp Web, Tente novamente!`)
        /*setTimeout(function() {
            status.textContent = `Tente novamente!`
        }, 2000)*/
        let buttonStart = document.querySelector('#start')
        buttonStart.style.cssText =
            'display: inline-block; opacity: 0;'
        setTimeout(function() {
            buttonStart.style.cssText =
                'display: inline-block; opacity: 1;'
        }, 100)

        Is_Started = false
        isQrOff = true

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
        displayOnConsole(`> ⚠️ ERROR counterExceeds: ${error.message}`, setLogError)
        resetLoadingBar()
    }
}
async function generateQrCode(QR_Counter) {
    if (isQrOff) {
        displayOnConsole('>  ℹ️ Client not Ready.', setLogError)
        return
    }
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        document.title = `WhatsApp Web QR-Code(${QR_Counter})`

        const mainContent = document.querySelector('#innerContent')
            mainContent.style.cssText =
                'display: inline-block;'

        let buttonStart = document.querySelector('#start')
        buttonStart.style.cssText =
            'display: none; opacity: 0;'
        setTimeout(function() {
            buttonStart.style.cssText =
                'display: none; opacity: 0;'
        }, 300)
        
        const status = document.querySelector('#status')
        const codeQr = document.querySelector('#qrCode')

        status.textContent = `Gerando Qr-Code...`
        displayOnConsole(`>  ℹ️ (status)Gerando Qr-Code...`)
        
        axios.get('/qr')
        .then(response => {
            const { qrString, Is_Conected } = response.data

            if (Is_Conected) {
                setTimeout(function() {
                    status.textContent = `Client ja conectado!`
                    displayOnConsole(`>  ℹ️ (status)Client ja conectado!`)
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
                status.textContent = `↓↓ Client tente se Conectar pela ${QR_Counter}º ao WhatsApp Web pelo QR-Code abaixo ↓↓`
                displayOnConsole(`>  ℹ️ (status)↓↓ Client tente se Conectar pela ${QR_Counter}º ao WhatsApp Web pelo QR-Code abaixo ↓↓`)
                
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
            console.error(`> ⚠️ ERROR buscando Qr-Code: ${error}`)
            displayOnConsole(`> ⚠️ ERROR buscando Qr-Code: ${error.message}`, setLogError)
            document.title = 'ERROR'
            status.textContent = `ERROR buscando Qr-Code!`
            displayOnConsole(`>  ℹ️ (status)ERROR buscando Qr-Code!`)
            let buttonStart = document.querySelector('#start')
            buttonStart.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 1;'
            }, 100)
            Is_Started = false
            document.querySelector('#qrCode').innerText = ''
            codeQr.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                codeQr.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)
            isQrOff = true
            resetLoadingBar()
        })
    } catch (error) {
        const status = document.querySelector('#status')
        console.error(`> ⚠️ ERROR generateQrCode: ${error}`)
        displayOnConsole(`> ⚠️ ERROR generateQrCode: ${error.message}`, setLogError)
        document.title = 'ERROR'
        status.textContent = `ERROR Gerando Qr-Code!`
        displayOnConsole(`>  ℹ️ (status)ERROR Gerando Qr-Code!`)
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
        isQrOff = true
        resetLoadingBar() 
    }
}
async function startBot() {
    if (Is_Started) {
        displayOnConsole(`> ⚠️ Bot ja esta Iniciado`, setLogError)
        return        
    } else {
        try {
            let barL = document.querySelector('#barLoading')
            barL.style.cssText =
                'width: 100vw; visibility: visible;'

            displayOnConsole(`>  ℹ️  ${Name_Software} = v${Version_}`)

            if (isDisconected) {
                reconnectWebSocket()
            }

            document.title = 'Iniciando o Bot'

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
            status.textContent = `Iniciando...`
            displayOnConsole(`>  ℹ️ (status)Iniciando...`)
            
            document.querySelector('#qrCode').innerText = ''
            const codeQr = document.querySelector('#qrCode')
            codeQr.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                codeQr.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)
            const response = await axios.post('/start-bot')
            const data = response.data.sucess
            if (data) {
                document.title = 'Iniciou o Bot Corretamente'
                status.textContent = `Iniciou o Bot Corretamente!`
                displayOnConsole(`> ✅ Iniciou o Bot Corretamente`)
                
                Is_Started = true
                isQrOff = false
            } else {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 0;'
                setTimeout(function() {
                    buttonStart.style.cssText =
                        'display: inline-block; opacity: 1;'
                }, 100)

                document.title = 'ERROR'
                status.textContent = `ERROR ao iniciar o Bot!`
                displayOnConsole(`>  ℹ️ (status)ERROR ao iniciar o Bot!`)
                displayOnConsole(`> ⚠️ ERROR ao iniciar o Bot`, setLogError)
                
                Is_Started = false
                isQrOff = true

                resetLoadingBar()
            }
        } catch (error) {
            const status = document.querySelector('#status')
            console.error(`> ⚠️ ERROR startBot: ${error}`)
            displayOnConsole(`> ⚠️ ERROR startBot: ${error.message}`, setLogError)
            document.title = 'ERROR'
            status.textContent = `ERROR iniciando Bot!`
            displayOnConsole(`>  ℹ️ (status)ERROR iniciando Bot!`)
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
            isQrOff = true
            resetLoadingBar()
        }
    }
}

//tarefas bot frontend 
//em desenvolvimento...
    //organizar a ordem de como as funcoes sao chamadas pra um melhor desempenho e sentido logico
    
    
//a desenvolver...
    //?//melhorar o problema de de vez em quando o a barra de loading do start n funciona direito/
    //arrumar meios de as coisas serem automaticas funcoes acionarem de acordo com certar coisas inves de prever todo cenario possivel em varias funcoes
    //talves algum dia fazer ums sistema frontend de commands igual no backend com requesicao http usando as funcoes padrao de funcao do backend e tals
    //arrumar meios de n precisar dessas variaveis permanentes, ou pelo menos diminuir muito