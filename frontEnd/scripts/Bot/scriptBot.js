//scriptBot.js frontEnd
let Name_Software = 'bot'
let Version_ = '0.1.0'

function isMobile() {//IDENTIFY IF THE USER IS FROM A PHONE
    const userAgent = navigator.userAgent
    return /Mobi|Android|iPhone|iPod|iPad|Windows\sPhone|Windows\sCE|BlackBerry|BB10|IEMobile|Opera\sMini|Mobile\sSafari|webOS|Mobile|Tablet|CriOS/i.test(userAgent)
}

window.onload = function(event) {
    axios.get('/reload')
};
window.onbeforeunload = function(event) {
    event.preventDefault();
}

let wss = null
document.addEventListener('DOMContentLoaded', async function () {// LOAD MEDIA QUERY PHONE
    try {
        if (isMobile()) {
            console.log('User is from a Phone.')
            
            var link = document.createElement('link')
            link.rel = 'stylesheet';
            link.href = '../styles/Bot/mediaQueryBot.css'
            document.head.appendChild(link);
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
        
        wss = new WebSocket(`ws://${window.location.host}`)
        /*wss = new WebSocket(`wss://${window.location.host}`)*/
        webSocket()

        /*const originalConsoleLog = console.log;
        console.log = function (...args) {
            originalConsoleLog.apply(console, args);
            
            displayLogOnSite(args.join(' '));
        
            ws.send(JSON.stringify({ type: 'log', message: args.join(' ') }));
        };*/
        
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
        console.error('ERROR: ' + error.message)
        displayLogOnConsole('ERROR: ' + error.message)
    }
})

//Patterns for Miliseconds times:
// Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
// Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
// Formated= 1 \ * 60 * 1000 = 1-Minute
// Formated= 1 \ * 1000 = 1-Second
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function displayLogOnConsole(message) {
    const logElement = document.createElement('div');
    logElement.textContent = `${message}`;
    document.querySelector('#log').appendChild(logElement);
    autoScroll();
}

/*window.onscroll = function() { scrollFunction() }// CALL FUNCTION FOR HEADER AND FOOTER CUSTOMS

function scrollFunction() {// SHOW THE SCROLLS BUTTONS AND FOOTER
    let head = document.querySelector('header')
    
    if (window.scrollY > 35) {
        head.style.cssText =
            'border-radius: 0px 0px 0px 0px;'
    } else {
        head.style.cssText =
            'border-radius: 0px 0px 50px 0px;'
    }

    let foot = document.querySelector('footer')
    let lO = document.querySelector('#linklOuKo')
    
    if (document.body.scrollHeight - (window.scrollY + window.innerHeight) < 27) {
        foot.style.cssText =
            'opacity: 1; visibility: visible; border-radius: 0px 50px 0px 0px;'

        lO.style.cssText =
            'pointer-events: unset;'
    } else {
        foot.style.cssText =
            'opacity: 1; visibility: visible; border-radius: 0px 0px 0px 0px;'

        lO.style.cssText =
            'pointer-events: none;'
    }
}*/
function autoScroll() {
    const consoleLog = document.querySelector('#divLog');
    const currentScroll = consoleLog.scrollTop;
    const targetScroll = consoleLog.scrollHeight - consoleLog.clientHeight;
    const scrollDifference = targetScroll - currentScroll;
    const duration = 300;

    let startTime;

    function scrollStep(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }

        const progress = Math.min((timestamp - startTime) / duration, 1);
        consoleLog.scrollTop = currentScroll + scrollDifference * progress;

        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}

let isDisconected = false
function reconnectConsole() {
    try {
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

        isDisconected = false

        const reloadButton = document.querySelector('#reload')
        let reloadAbbr = document.querySelector('#abbrReload')

        reloadButton.style.cssText =
            'color: var(--colorContrast); background-color: var(--colorYellow); cursor: progress;'
        reloadAbbr.title = `WebSocket STATUS: carregando...`

        wss.close();
        wss = null
        wss = new WebSocket(`ws://${window.location.host}`)
        /*wss = new WebSocket(`wss://${window.location.host}`)*/
        webSocket()

    } catch (error) {
        console.error('Erro ao reconectar WebSocket:', error);
        resetLoadingBar()
    }
}
let isFromTerminal = false
async function webSocket() {
    const reloadButton = document.querySelector('#reload')
    let reloadAbbr = document.querySelector('#abbrReload')

    wss.onopen = function(event) {
        console.log('>  ◌ Conectando Client ao WebSocket(front).', event);
        displayLogOnConsole(`>  ◌ Conectando Client ao WebSocket(front).`, event);
        reloadButton.style.cssText =
            'color: var(--colorContrast); background-color: var(--colorGreen); cursor: pointer;'
        reloadAbbr.title = `WebSocket STATUS: conectado`
    };
    wss.onclose = function(event) {
        console.log('>  ◌ Desconectando Client do WebSocket(front).', event);
        displayLogOnConsole(`>  ◌ Desconectando Client do WebSocket(front).`, event);
        reloadButton.style.cssText =
            'color: var(--colorContrast); background-color: var(--colorOrange); cursor: pointer;'
        reloadAbbr.title = `WebSocket STATUS: desconectou`

        isDisconected = true
    };
    wss.onerror = function(event) {
        console.error('> ❌ ERROR ao conectar Client ao WebSocket(front):', event);
        displayLogOnConsole(`> ❌ ERROR ao reconectar Client ao WebSocket(front).`, event);
        reloadButton.style.cssText =
            'color: var(--colorContrast); background-color: var(-colorRed); cursor: pointer;'
        reloadAbbr.title = `WebSocket STATUS: error`

        isDisconected = true
    };

    wss.onmessage = function(event) {
        const logData = JSON.parse(event.data);
        if (logData.type === 'exit') {
            exit()
        } else if (logData.type === 'log') {
            //console.log(logData.message);
            displayLogOnConsole(logData.message)
            /*const logElement = document.createElement('div');
            logElement.textContent = logData.message;
            document.querySelector('#log').appendChild(logElement);
            autoScroll()*/
        } else if (logData.type === 'command') {
            //console.log(logData.message);
            displayLogOnConsole(logData.message)
            /*const logElement = document.createElement('div');
            logElement.textContent = `> ${logData.command}`;
            document.querySelector('#log').appendChild(logElement);
            autoScroll()*/
        } if (logData.type === 'list') {
            const data = logData.data;
            listData(data)
        } if (logData.type === 'start') {
            startBot()
        } if (logData.type === 'generate_qr_code') {
            const QR_Counter = logData.data;
            setTimeout(function() {
                generateQrCode(QR_Counter)
            }, 100)
        } if (logData.type === 'qr_exceeds') {
            isExceeds = false
            const QR_Counter_Exceeds = logData.data;
            Counter_Exceeds(QR_Counter_Exceeds)
        } if (logData.type === 'auth_autenticated') {
            authsucess()
        } if (logData.type === 'auth_failure') {
            authFailure() 
        } if (logData.type === 'ready') {
            ready()
        } if (logData.type === 'print') {
            listDataButton()
        } if (logData.type === 'empty-list') {
            emptyList()
        } if (logData.type === 'search-list') {
            const Parse_Data = logData.data;
            const search = logData.data2.trim()
            isFromTerminal = true
            searchNameList(isFromTerminal, Parse_Data, search)
        } if (logData.type === 'all-erase') {
            allEraseList()
        } if (logData.type === 'name-erase') {
            const search = logData.data;
            isFromTerminal = true
            eraseDataByName(isFromTerminal, search)
        } if (logData.type === 'error') {
            console.error(logData.message)
            displayLogOnConsole(logData.message)
        } 
    };

    resetLoadingBar()
}

function exit() {
    resetLoadingBar()
    Is_Not_Ready = true

    if (isDisconected) {
        reconnectConsole()

        isDisconected = false
    }

    displayLogOnConsole('> ❌ ERROR Back End')

    const mainContent = document.querySelector('#content')
    mainContent.style.cssText =
        'display: inline-block;'

    const status = document.querySelector('#status')
    status.textContent = `ERROR Back End!`

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
}
function authsucess() {
    let buttonStart = document.querySelector('#start')
    buttonStart.style.cssText =
        'display: display: inline-block; opacity: 0;'
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
}
function authFailure() {
    resetLoadingBar()
    Is_Not_Ready = true

    if (isDisconected) {
        reconnectConsole()

        isDisconected = false
    }

    displayLogOnConsole('> ❌ ERROR Back End Auth Failure')

    const mainContent = document.querySelector('#content')
    mainContent.style.cssText =
        'display: inline-block;'

    const status = document.querySelector('#status')
    status.textContent = `Falhou Autenticação ao WhatsApp Web pelo Local_Auth!`

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
} 
function ready() {
    resetLoadingBar()
    Is_Not_Ready = false

    if (isDisconected) {
        reconnectConsole()

        isDisconected = false
    }

    const mainContent = document.querySelector('#innerContent')
    mainContent.style.cssText =
        'display: inline-block;'

    const status = document.querySelector('#status')
        status.textContent = `Realizado com Sucesso Autenticação ao WhatsApp Web pelo Local_Auth!`

    /*let buttonStart = document.querySelector('#start')
    buttonStart.style.cssText =
        'display: display: inline-block; opacity: 0;'
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
        'background-color: var(--colorWhite); color: var(--colorBlack);'
    listShowAbbr.title = `STATUS Lista: visivel`
}
let Is_Not_Ready = true

function saveConsoleStyles() {
    try {
        const consoleElement = document.querySelector('#console');
        const buttonHideConsole = document.querySelector('#hideConsole');
        const titleHideConsole = document.querySelector('#titleHide');

        localStorage.setItem('consoleStyles', JSON.stringify({
            width: consoleElement.style.width,
            title: titleHideConsole.title,
            textContent: buttonHideConsole.textContent,
            isVisibleHideButton: isVisibleHideButton
        }));
    } catch (error) {
        console.error('Erro ao salvar estilos do console:', error);
        displayLogOnConsole('Erro ao salvar estilos do console:', error.message);
    }
}
function loadConsoleStyles() {
    try {
        const savedStyles = localStorage.getItem('consoleStyles');
        if (savedStyles) {
            const parsedStyles = JSON.parse(savedStyles);
            const consoleElement = document.querySelector('#console');
            const buttonHideConsole = document.querySelector('#hideConsole');
            const titleHideConsole = document.querySelector('#titleHide');

            consoleElement.style.width = parsedStyles.width || '30.439vw';
            titleHideConsole.title = parsedStyles.title || 'Esconder o Terminal';
            buttonHideConsole.textContent = parsedStyles.textContent || '◀';
            isVisibleHideButton = parsedStyles.isVisibleHideButton !== undefined ? parsedStyles.isVisibleHideButton : null;
            
            if (isVisibleHideButton === null) {
                isVisibleHideButton = true;
                hideConsole();
            } else {
                if (isVisibleHideButton) {
                    consoleElement.style.width = '0';
                    titleHideConsole.title = 'Mostrar o Terminal';
                    buttonHideConsole.textContent = '▶';
                } else {
                    consoleElement.style.width = '30.439vw';
                    titleHideConsole.title = 'Esconder o Terminal';
                    buttonHideConsole.textContent = '◀';
                }
            }
        }
    } catch (error) {
        console.error('ERROR ao carregar estilos do console:', error);
        displayLogOnConsole('ERROR ao carregar estilos do console:', error);
    }
}
let isVisibleList = null
function showTableList() {
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
                'background-color: var(--colorWhite); color: var(--colorBlack);'
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
                'background-color: var(--colorBlack); color: var(--colorWhite);'
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
        console.error('ERROR:', error)
        displayLogOnConsole('ERROR:', error)
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
                'transform: rotate(180deg); border-left: 2px solid var(--colorBlack); border-right: 0px solid var(--colorBlack);'*/
            isVisibleHideButton = true
            saveConsoleStyles()
            return
        }
        if (isVisibleHideButton !== true) {    
            consoleElement.style.cssText =
                'width: 30.439vw;'
            
            titleHideConsole.title = `Esconder o Terminal`
            buttonHideConsole.textContent = `◀`
            /*buttonHideConsole.cssText =
                'transform: rotate(0deg); border-left: 0px solid var(--colorBlack); border-right: 2px solid var(--colorBlack);'*/
            isVisibleHideButton = false
            saveConsoleStyles()
            return
        }
    } catch (error) {
        console.error('ERROR:', error)
        displayLogOnConsole('ERROR:', error)
    }
}

function emptyList() {
    if (Is_Not_Ready) {
        displayLogOnConsole('>  ℹ️ Client not Ready.')
        return
    }
    const status = document.querySelector('#status')
    
    setTimeout(function() {
        status.textContent = `Lista de ChatData esta vazia!`
    }, 400)
}
let fromTerminal = null
async function eraseDataByName(isFromTerminal, queryFromTerminal) {
    if (Is_Not_Ready) {
        displayLogOnConsole('>  ℹ️ Client not Ready.')
        return
    }
    let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

    if (isFromTerminal) {
        let sendErase = document.querySelector('#eraseSearchList')
            
        sendErase.style.cssText =
            'background-color: #2b2b2b; color: var(--colorWhite); border: 1px solid var(--colorWhite); transition: var(--configTrasition01s);'

        setTimeout(function() {
            sendErase.style.cssText =
            'background-color: var(--colorInteractionElements); color: var(--colorBlack); border: 1px solid rgba(0, 0, 0, 0); transition: var(--configTrasition03s);'
        }, 100)
        
        const status = document.querySelector('#status')

        try {
            if (queryFromTerminal === undefined || null) {
                status.textContent = `Digite algum nome de contato para apaga-lo!`
                isFromTerminal = false
                resetLoadingBar()
                return 
            } else {
                let userConfirmation = confirm(`Tem certeza de que deseja apagar o ChatData de ${queryFromTerminal} da lista?\nsera apagada para sempre`)
                if (userConfirmation) {
                    fromTerminal = true
                    let query = queryFromTerminal
                    await axios.delete('/erase-name', { params: { query, fromTerminal } });
                    setTimeout(function() {
                        status.textContent = `${queryFromTerminal} de ChatData.json foi Apagado!`
                    }, 300)
                    
                    //document.querySelector('#inputList').value = ''
                    resetLoadingBar()
                    isFromTerminal = false
                } else {
                    resetLoadingBar()
                    isFromTerminal = false
                    return
                }
            }
        } catch (error) {
            status.textContent = `ERROR ao buscar Por: ${queryFromTerminal}`;
            console.error(error);
            resetLoadingBar()
            isFromTerminal = false
        } finally {
            resetLoadingBar()
            isFromTerminal = false
        }
    } else {
        let sendErase = document.querySelector('#eraseSearchList')
            
        sendErase.style.cssText =
            'background-color: #2b2b2b; color: var(--colorWhite); border: 1px solid var(--colorWhite); transition: var(--configTrasition01s);'

        setTimeout(function() {
            sendErase.style.cssText =
            'background-color: var(--colorInteractionElements); color: var(--colorBlack); border: 1px solid rgba(0, 0, 0, 0); transition: var(--configTrasition03s);'
        }, 100)
        
        const status = document.querySelector('#status')
        const query = document.querySelector('#inputList').value.trim();

        try {
            if (query === undefined || null) {
                status.textContent = `Digite algum nome de contato para apaga-lo!`
                resetLoadingBar()
                return 
            } else {
                let userConfirmation = confirm(`Tem certeza de que deseja apagar o ChatData de ${query} da lista?\nsera apagada para sempre`)
                if (userConfirmation) {
                    fromTerminal = false
                    await axios.delete('/erase-name', { params: { query, fromTerminal } });

                    setTimeout(function() {
                        status.textContent = `${query} de ChatData.json foi Apagado!`
                    }, 300)
                    
                    //document.querySelector('#inputList').value = ''
                    resetLoadingBar()
                } else {
                    return
                }
            }
        } catch (error) {
            status.textContent = `ERROR ao buscar Por: ${query}`;
            console.error(error);
            resetLoadingBar()
        } finally {
            resetLoadingBar()
        }
    }
}
function allEraseList() {
    if (Is_Not_Ready) {
        displayLogOnConsole('>  ℹ️ Client not Ready.')
        return
    }
    let barL = document.querySelector('#barLoading')
    
    const status = document.querySelector('#status')
    try {
        let userConfirmation = confirm('Tem certeza de que deseja apagar a lista?\nsera apagada para sempre.')

        if (userConfirmation) {
            barL.style.cssText =
                'width: 100vw; visibility: visible;'

            axios.delete('/all-erase')

            setTimeout(function() {
                status.textContent = `Todo o ChatData foi Apagado!`
            }, 300)
        } else {
            return
        }
        
        resetLoadingBar()
    } catch (error) {
        status.textContent = `ERROR ao apagar Todo o ChatData!`
        displayLogOnConsole('ERROR: ' + error.message);

        resetLoadingBar()
    }
}
async function searchNameList(isFromTerminal, dataFromTerminal, queryFromTerminal) {
    if (Is_Not_Ready) {
        displayLogOnConsole('>  ℹ️ Client not Ready.')
        return
    }
    let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

    if (isFromTerminal) {
        const status = document.querySelector('#status')
        let list = document.querySelector('table tbody')
        let counter = document.querySelector('thead > tr > td ')

        try {
            if (dataFromTerminal === true) {
                emptyList()

                list.innerHTML = ''
                    
                counter.textContent = `0`
                
                let row = list.insertRow(-1)
                
                let cell1 = row.insertCell(0)
                cell1.textContent = 'N/A'
                
                let cell2 = row.insertCell(1)
                cell2.textContent = 'N/A'
                
                resetLoadingBar()
                isFromTerminal = false
                return
            } else {
                if (dataFromTerminal.length === 0) {
                    status.textContent = `${queryFromTerminal} Não econtrado em ChatData.json!`
                    
                    list.innerHTML = ''
                    
                    counter.textContent = `0`
                    
                    let row = list.insertRow(-1)
                    
                    let cell1 = row.insertCell(0)
                    cell1.textContent = 'N/A'
                    
                    let cell2 = row.insertCell(1)
                    cell2.textContent = 'N/A'
                    
                    resetLoadingBar()
                    isFromTerminal = false
                    return
                } else {
                    status.textContent = `Listando ${queryFromTerminal}...`
                    
                    list.innerHTML = ''
                    
                    counter.textContent = `${dataFromTerminal.length}`
                    dataFromTerminal.forEach(entry => {
                        let row = list.insertRow(-1)
                        
                        let cell1 = row.insertCell(0)
                        cell1.textContent = entry.chatId
                        
                        let cell2 = row.insertCell(1)
                        cell2.textContent = entry.name
                        
                    })
                    status.textContent = `${queryFromTerminal} Listado!`
                }   
                isFromTerminal = false
                //document.querySelector('#inputList').value = ''
                resetLoadingBar()
            }
        } catch (error) {
            status.textContent = `ERROR ao buscar Por: ${queryFromTerminal}`;
            console.error(error);
            resetLoadingBar()
            isFromTerminal = false
        } finally {
            resetLoadingBar()
            isFromTerminal = false
        }
    } else {
        let sendSearch = document.querySelector('#sendSearchList')
        
        sendSearch.style.cssText =
            'background-color: #2b2b2b; color: var(--colorWhite); border: 1px solid var(--colorWhite); transition: var(--configTrasition01s);'

        setTimeout(function() {
            sendSearch.style.cssText =
            'background-color: var(--colorInteractionElements); color: var(--colorBlack); border: 1px solid rgba(0, 0, 0, 0); transition: var(--configTrasition03s);'
        }, 100)
        
        const status = document.querySelector('#status')
        let list = document.querySelector('table tbody')
        let counter = document.querySelector('thead > tr > td ')
        const query = document.querySelector('#inputList').value

        try {
            if (query === undefined || null) {
                status.textContent = `Digite algum nome de contato para pesquisa-lo na lista!`
                return
            } else {
                const response = await axios.get('/search-list', { params: { query } });
                const data = response.data;
                if (data === true) {
                    emptyList()
    
                    list.innerHTML = ''
                        
                    counter.textContent = `0`
                    
                    let row = list.insertRow(-1)
                    
                    let cell1 = row.insertCell(0)
                    cell1.textContent = 'N/A'
                    
                    let cell2 = row.insertCell(1)
                    cell2.textContent = 'N/A'
                    
                    resetLoadingBar()
                    return
                } else {
                    if (data.length === 0) {
                        status.textContent = `${query} Não econtrado em ChatData.json!`
                        
                        list.innerHTML = ''
                        
                        counter.textContent = `0`
                        
                        let row = list.insertRow(-1)
                        
                        let cell1 = row.insertCell(0)
                        cell1.textContent = 'N/A'
                        
                        let cell2 = row.insertCell(1)
                        cell2.textContent = 'N/A'
                        
                        resetLoadingBar()
                        return
                    } else {
                        status.textContent = `Listando ${query}...`
                        
                        list.innerHTML = ''
                        
                        counter.textContent = `${data.length}`
                        data.forEach(entry => {
                            let row = list.insertRow(-1)
                            
                            let cell1 = row.insertCell(0)
                            cell1.textContent = entry.chatId
                            
                            let cell2 = row.insertCell(1)
                            cell2.textContent = entry.name
                            
                        })
                        status.textContent = `${query} Listado!`
                    }
                }
                //document.querySelector('#inputList').value = ''
                resetLoadingBar()
            }   
        } catch (error) {
            status.textContent = `ERROR ao buscar Por: ${query}`;
            console.error(error);
            resetLoadingBar()
        } finally {
            resetLoadingBar()
        }
    }
}
async function listData(data) {
    try {
        if (Is_Not_Ready) {
            displayLogOnConsole('>  ℹ️ Client not Ready.')
            return
        }
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'
        /*const response = await axios.get('/list');
        const data = response.data;*/

        const status = document.querySelector('#status')
        let list = document.querySelector('table tbody')
        let counter = document.querySelector('thead > tr > td ')
        
        if (data.length === 0) {
            status.textContent = `ChatData.json esta vazio!`
            
            counter.textContent = `0`
            
            list.innerHTML = ''
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'
            
            resetLoadingBar()
            return
        } else {
            //status.textContent = `Pritando todo ChatData de ChatData.json...`
            
            list.innerHTML = ''
            
            for (let entry of data) {
                counter.textContent = `${data.length}`
                
                let row = list.insertRow(-1)

                let cell1 = row.insertCell(0)
                cell1.textContent = entry.chatId
                
                let cell2 = row.insertCell(1)
                cell2.textContent = entry.name
                
                /*let bList = document.querySelector('#erase')
                
                bList.style.cssText =
                'opacity: 1; pointer-events: unset;'*/
                
            }
            //status.textContent = `Todo ChatData de ChatData.json Printado!`
            
            resetLoadingBar()
        }
    } catch (error) {
        displayLogOnConsole('> ⚠️ ERRORa: ' + error.message);
        resetLoadingBar()
    }
}
async function listDataButton() {
    try {
        if (Is_Not_Ready) {
            displayLogOnConsole('>  ℹ️ Client not Ready.')
            return
        }
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'
        
        let listShow = document.querySelector('#showList')
        let listShowAbbr = document.querySelector('#abbrShowList')
        if (isVisibleList === null) {
            isVisibleList = true
            listShow.style.cssText = 
                'background-color: var(--colorWhite); color: var(--colorBlack);'
            listShowAbbr.title = `STATUS Lista: visivel`
        } else if (isVisibleList = true) {
            isVisibleList = true
            listShow.style.cssText = 
                'background-color: var(--colorWhite); color: var(--colorBlack);'
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
            
        const status = document.querySelector('#status')
        let list = document.querySelector('table tbody')
        let counter = document.querySelector('thead > tr > td ')
        
        const response = await axios.get('/list');
        const data = response.data;
        if (data.length === 0) {
            status.textContent = `ChatData.json esta vazio!`
            
            list.innerHTML = ''
            
            counter.textContent = `0`
            
            let row = list.insertRow(-1)
            
            let cell1 = row.insertCell(0)
            cell1.textContent = 'N/A'
            
            let cell2 = row.insertCell(1)
            cell2.textContent = 'N/A'
            
            resetLoadingBar()
            return
        } else {
            status.textContent = `Pritando todo ChatData de ChatData.json...`
            
            list.innerHTML = ''
            
            for (let entry of data) {
                counter.textContent = `${data.length}`
                
                let row = list.insertRow(-1)

                let cell1 = row.insertCell(0)
                cell1.textContent = entry.chatId
                
                let cell2 = row.insertCell(1)
                cell2.textContent = entry.name
                
                /*let bList = document.querySelector('#erase')
                
                bList.style.cssText =
                'opacity: 1; pointer-events: unset;'*/
                
            }
            status.textContent = `Todo ChatData de ChatData.json Printado!`
            
            resetLoadingBar()
        }
    } catch (error) {
        displayLogOnConsole('> ⚠️ ERROR: ' + error.message);
        resetLoadingBar()
    }
}

async function sendCommand() {
    try {
        let commandInput = document.querySelector('#commandInput').value.trim();
        let commandSend = document.querySelector('#commandSend')

        commandSend.style.cssText =
            'background-color: #2b2b2b; color: var(--colorWhite); border: 1px solid var(--colorWhite); transition: var(--configTrasition01s);'
        
        //console.log(commandInput)
        displayLogOnConsole(commandInput)
        
        await axios.post('/command', { command: commandInput }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        /*await axios.post('/command', { command: commandInput }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });*/
        
        setTimeout(function() {
            commandSend.style.cssText =
                'background-color: var(--colorInteractionElements); color: var(--colorBlack); border: 1px solid rgba(0, 0, 0, 0); transition: var(--configTrasition03s);'
        }, 100)
        
        document.querySelector('#commandInput').value = ''
    } catch (error) {
        console.error('ERROR ao enviar comando:', error);
    }
}
let isExceeds = true 
function Counter_Exceeds(QR_Counter_Exceeds) {
    if (isExceeds) {
        displayLogOnConsole('>  ℹ️ Client not Ready.')
        return
    }
    isExceeds = true

    const mainContent = document.querySelector('#content')
    mainContent.style.cssText =
        'display: inline-block;'

    const status = document.querySelector('#status')
    status.textContent = `❌ Excedido todas as tentativas (${QR_Counter_Exceeds}) de conexão pelo QR_Code ao WhatsApp Web, Tente novamente!.`
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
}
let isQrOff = true
async function generateQrCode(QR_Counter) {
    try {
        if (isQrOff) {
            displayLogOnConsole('>  ℹ️ Client not Ready.')
            return
        }
        let barL = document.querySelector('#barLoading')
        barL.style.cssText =
            'width: 100vw; visibility: visible;'

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
        
        axios.get('/qr')
        .then(response => {
            const { qrString, Is_Conected } = response.data;

            if (Is_Conected) {
                setTimeout(function() {
                    status.textContent = `Client ja conectado!`
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
                setTimeout(function() {
                    status.textContent = `↓↓ 📸 Client tente se Conectar pela ${QR_Counter}º ao WhatsApp Web pelo QR-Code abaixo 📸 ↓↓`
                }, 100)
                
                codeQr.style.cssText =
                    'display: inline-block; opacity: 0;'
                setTimeout(function() {
                    codeQr.style.cssText =
                        'display: inline-block; opacity: 1;'
                }, 100)
                    
                document.querySelector('#qrCode').innerText = qrString
                
                resetLoadingBar()
            }
        })
        .catch(error => {
            console.error('ERROR fetching QR code:', error)
            displayLogOnConsole('ERROR fetching QR code:', error)
            status.textContent = `ERROR Gerando Qr-Code!`
            QR_Counter = 0
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
        displayLogOnConsole('ERROR fetching Qr-Code:', error)
        console.error('ERROR fetching QR code:', error)
        status.textContent = `ERROR Gerando Qr-Code!`
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
let Is_Started = false
async function startBot() {
    if (Is_Started) {
        displayLogOnConsole(`> ⚠️ Bot ja esta Iniciado`)
        return        
    } else {
        try {
            let barL = document.querySelector('#barLoading')
            barL.style.cssText =
                'width: 100vw; visibility: visible;'

            displayLogOnConsole(`>  ℹ️ ${Name_Software} = v${Version_}`)

            if (isDisconected) {
                reconnectConsole()

                isDisconected = false
            }

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
            
            document.querySelector('#qrCode').innerText = ''
            const codeQr = document.querySelector('#qrCode')
            codeQr.style.cssText =
                'display: inline-block; opacity: 0;'
            setTimeout(function() {
                codeQr.style.cssText =
                    'display: none; opacity: 0;'
            }, 300)
            const response = await axios.post('/start-bot')
            const data = response.data
            if (data.success) {
                status.textContent = `Iniciou o Bot Corretamente!`
                displayLogOnConsole(`> ✅ Iniciou o Bot Corretamente`)
                
                Is_Started = true
                isQrOff = false
            } else {
                buttonStart.style.cssText =
                    'display: inline-block; opacity: 0;'
                setTimeout(function() {
                    buttonStart.style.cssText =
                        'display: inline-block; opacity: 1;'
                }, 100)

                status.textContent = `Falhou ao iniciar o Bot!`
                displayLogOnConsole(`> ⚠️ Falhou ao iniciar o Bot`)
                
                Is_Started = false
                isQrOff = true

                resetLoadingBar()
            }
        } catch (error) {
            const status = document.querySelector('#status')
            console.error('ERROR starting Bot:', error)
            displayLogOnConsole('ERROR starting Bot:', error)
            status.textContent = `ERROR iniciando Bot!`
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
    //ajustar o status para guardar sempre no terminal tudo taligado? salvo, que ja esta so fazer certinho as msgs iguais
    //erros e statuses deixar com mais detalhes no terminal do console f12 ai ja tudo do backend e do front end no terminal do site
    //melhoras os logs de conexao do websocket backend e frontend
    //arrumar erro de mandar nada no input da lista e dar msgs de erros n desejados
    //melhorar o display log on console do site para modificar a cor caso seja um log de error
    //melhorar trazer os logs do backend a dedo e trazer o efeito de error tbm caso for um log disso
    //adicionar forma de clear no terminal do site

//a desenvolver...
    //organizar a ordem de como as funcoes sao chamadas pra um melhor desempenho e sentido logico
    //juntar as funcoes listData(data) listDataButton() em uma so na listData(data)
    //melhorar a logica de usar a mesma funcao pra duas coisas
    //melhorar o problema de de vez em quando o a barra de loading do start n funciona direito
    //melhorar o reconhecimento do arquivo json estar vazio e as acoes sobre, status e tals
    //arrumar meios de as coisas serem automaticas funcoes acionarem de acordo com certar coisas inves de prever todo cenario possivel em varias funcoes