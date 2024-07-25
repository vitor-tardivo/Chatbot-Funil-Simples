// app.js Back_End
global.Log_Callback = null
function Set_Log_Callback(callback) {
    global.Log_Callback = callback
}
let Name_Software = 'bot'
let Version_ = '0.1.0'
console.log(`>  ℹ️ ${Name_Software} = v${Version_}`)
console.log(`>  ◌ Starting secundary functions...`)
if (global.Log_Callback) global.Log_Callback(`>  ◌ Starting secundary functions...`)

const { Client, LocalAuth, MessageMedia, Buttons } = require('whatsapp-web.js')
const axios = require('axios')
const qrcode = require('qrcode-terminal')
const fs = require('fs').promises
const path = require('path')
const readline = require('readline')

function Reload_Front() {
    //console.error(`> ⚠️  Reloaded FrontEnd page`)
    //Is_First_Reaload = false
    //process.exit(1)
}
process.on('exit', (code) => {
    /*if (Is_Exceeds) {
        Is_Not_Ready = true
        Is_Exceeds = true
        if (Exit_Callback) Exit_Callback()
    }*/
    Is_Not_Ready = true
    console.error(`> ⚠️  Process exited with code(${code})`)
})
process.on('uncaughtException', (error) => {
    //if (Exit_Callback) Exit_Callback()
    console.error(`> ❌ Uncaught Exception: ${error}`)
    //process.exit(1)
})
process.on('SIGUSR2', () => {// nodemon
    if (Exit_Callback) Exit_Callback()
    console.error('> ❌ Process interrupted: (SIGUSR2)')
    //process.exit(0)
})
process.on('SIGINT', () => {// Ctrl+C
    if (Exit_Callback) Exit_Callback()
    console.error('> ❌ Process interrupted: (SIGINT)')
    //process.exit(0)
})
process.on('SIGTERM', () => {// kill
    if (Exit_Callback) Exit_Callback()
    console.error('> ❌ Process interrupted: (SIGTERM)')
    //process.exit(0)
})
process.on('SIGHUP', () => {// terminal closed
    if (Exit_Callback) Exit_Callback()
    console.error('> ❌ Process interrupted: (SIGHUP)')
    //process.exit(0)
})

let Exit_Callback = null
function Set_Exit_Callback(callback) {
    Exit_Callback = callback
}
let Start_Callback = null
function Set_Start_Callback(callback) {
    Start_Callback = callback
}
let All_Erase_Callback = null
function Set_All_Erase_Callback(callback) {
    All_Erase_Callback = callback
}
let Search_List_Callback = null
function Set_Search_List_Callback(callback) {
    Search_List_Callback = callback
}
let Query_Erase_Callback = null
function Set_Query_Erase_Callback(callback) {
    Query_Erase_Callback = callback
}
let List_Callback = null
function Set_List_Callback(callback) {
    List_Callback = callback
}
let List_Auxiliar_Callback = null
function Set_List_Auxiliar_Callback(callback) {
    List_Auxiliar_Callback = callback
}
let QrCode_On_Callback = null
function Set_QrCode_On_Callback(callback) {
    QrCode_On_Callback = callback
}
let QrCode_Exceeds_Callback = null
function Set_QrCode_Exceeds_Callback(callback) {
    QrCode_Exceeds_Callback = callback
}
let Auth_Autenticated_Callback = null
function Set_Auth_Autenticated_Callback(callback) {
    Auth_Autenticated_Callback = callback
}
let Auth_Failure_Callback = null
function Set_Auth_Failure_Callback(callback) {
    Auth_Failure_Callback = callback
}
let Ready_Callback = null
function Set_Ready_Callback(callback) {
    Ready_Callback = callback
}

const Data_File = 'Chat_Data.json'
const rootDir = path.resolve(__dirname, '..') 
const CHAT_DATA_FILE = path.join(rootDir, 'Chat_Datas', 'Chat_Data.json')
const Chat_Data = new Map()

let Is_Not_Ready = true

let Is_Schedule = false //On/Off = Schedule_Erase_Chat_Data
let Is_New = false/////////////////
let timer_Schedule = {}
let Is_timer_On = false

let timer_Duration_Formated_Schedule = 10
let timer_Duration_Type_Schedule = 'Seconds'
let timer_Duration_Schedule = 1000

let timer_Duration_Type_MSG_ = ''
let timer_Duration_Formated_MSG_ = 0
let timer_Duration_MSG_ = 0
let timer_Duration_ = 0

let QR_Counter_Exceeds = 6

function sleep(time) {
    try {
        return new Promise((resolve) => setTimeout(resolve, time))
    } catch (error) {
        console.error(`> ❌ ERROR sleep: ${error}`)
    }
}

function Actual_Time() {
    const now = new Date()
    
    const hours24 = now.getHours().toString().padStart(2, '0')
    
    //let hours = now.getHours()
    //hours = hours % 12
    //hours = hours ? hours : 12
    //const hours12 = hours.toString().padStart(2, '0')
    
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    
    //const period = hours <= 12 ? 'PM' : 'AM'

    return `${hours24}:${minutes}:${seconds}`
    //return `${hours12}:${minutes}:${seconds} ${period}`
}


//Patterns for Miliseconds times:
// Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
// Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
// Formated= 1 \ * 60 * 1000 = 1-Minute
// Formated= 1 \ * 1000 = 1-Second

/*function Command_Confirm(input) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        return
    } else {
        const command = input.trim()

        if (command === null || command === undefined) {
            console.log('>  ℹ️ Command not recognized.')
            return
        } else {
            rl.write(command + '\n')
        }
    }
}*/
const rl = readline.createInterface({
    input: process.stdin
})
rl.on('line', async (input) => {
    const command = input.trim()
    
    let Is_Front_Back = true
    
    commands(command, Is_Front_Back)
})
async function Input_Command(command, Is_Front_Back) {
    try {
        /*if (command === null || command === undefined) {
            console.log('> ℹ️ Command not recognized.')
            return
        }*/
        command = command.trim()
        
        commands(command, Is_Front_Back)
    } catch (error) {
        console.error(`> ❌ ERROR Input_Command: ${error}`)
    }   
}
//let Is_Erase = false

// Is_Front_Back - front = false, back = true
async function commands(command, Is_Front_Back) {
    if (Is_Not_Ready) {
        if (command === 'start') {
            if (Is_Front_Back) {
                initialize()
                return
            } else {
                if (Start_Callback) Start_Callback()
                return
            }
        }

        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return
    } else {
        try {
            if (global.Log_Callback) global.Log_Callback(`${command}`)
            
            if (Is_Front_Back) {
                if (command === null) {
                    console.log('>  ℹ️ Command not recognized.')
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Command not recognized.`)
                    return
                } else if (command === 'start') {
                    console.log(`> ⚠️ Bot already Initialized`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ Bot already Initialized`)
                }
                else if (command.startsWith('erase ')) {
                    const query = command.substring(6).trim()
                    if (query !== null) {
                        let Is_From_End = true
                        await Erase_Chat_Data_By_Query(query, Is_From_End)
                    } else {
                        console.log(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all erase') {
                    let Is_From_End = true
                    await Erase_All_Chat_Data(Is_From_End)
                } else if (command.startsWith('print ')) {
                    const search = command.substring(6).trim()
                    if (search !== null) {
                        await Search_Chat_Data_By_Search(search)
                    } else {
                        console.log(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all print') {
                    let isallerase = false
                    await Print_All_Chat_Data(isallerase)
                } else {
                    console.log('>  ℹ️ Command not recognized.')
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Command not recognized.`)
                }
            } else {
                console.log(`${command}`)
                if (command === null) {
                    console.log('>  ℹ️ Command not recognized.')
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Command not recognized.`)
                    return
                } else if (command === 'start') {
                    console.log(`> ⚠️ Bot already Initialized`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ Bot already Initialized`)
                } else if (command.startsWith('erase ')) {
                    const query = command.substring(6).trim()
                    if (query !== null) {
                        if (Query_Erase_Callback) Query_Erase_Callback(query)
                    } else {
                        console.log(`> ⚠️  Specify a ChatData to erase from ${Data_File}, EXEMPLE:\nerase <number/name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all erase') {
                    if (All_Erase_Callback) All_Erase_Callback()
                } else if (command.startsWith('print ')) {
                    const Search = command.substring(6).trim()
                    if (Search !== null) {
                        if (Search_List_Callback) Search_List_Callback(Search)
                    } else {
                        console.log(`> ⚠️  Specify a ChatData to search from ${Data_File}, EXEMPLE:\nprint <number/name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all print') {
                    if (List_Callback) List_Callback()
                } else {
                    console.log('>  ℹ️ Command not recognized.')
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Command not recognized.`)
                }
            }
        } catch (error) {
            console.error(`> ❌ ERROR commands: ${error}`)
        }
    }
}
function askForConfirmation() {
    try {
        if (Is_Not_Ready) {
            console.log('>  ℹ️ Client not Ready.')
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
            return
        } else {
            return new Promise((resolve) => {
                console.log('>  ℹ️ Confirm(Y/N)')
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Confirm(Y/N)`)
                rl.question('',(answer) => {
                    resolve(answer.trim().toLowerCase())
                })
            })
        }
    } catch (error) {
        console.error(`> ❌ ERROR askForConfirmation: ${error}`)
    }
}

async function Load_Chat_Data() {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return
    } else {
        try {
            console.log(`>  ◌ Loading ChatData from ${Data_File}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌ Loading ChatData from ${Data_File}...`)
            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            if (Data_.length === 0) {
                console.log(`> ⚠️  ${Data_File} is empty.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${Data_File} is empty.`)
                await fs.writeFile(CHAT_DATA_FILE, '[\n\n]', 'utf8')
                return
            }
            const Parse_Data = JSON.parse(Data_)
            Parse_Data.forEach(entry => Chat_Data.set(entry.chatId, entry.name))
            
            const organizedData = Array.from(Chat_Data.entries()).map(([chatId, name]) => ({ chatId, name }))
            const jsonString = '[\n' + organizedData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            
            await fs.writeFile(CHAT_DATA_FILE, jsonString, 'utf8')

            console.log(`> ✅ ChatData loaded from ${Data_File}.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ ChatData loaded from ${Data_File}.`)
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`> ⚠️  ${Data_File} does not exist: ${error}`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${Data_File} does not exist: ${error}`)
                console.log(`>  ◌ Creating ${Data_File}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Creating ${Data_File}...`)
                await fs.writeFile(CHAT_DATA_FILE, '[\n\n]', 'utf8')
                console.log(`> 📄 Created: ${Data_File}`)
                if (global.Log_Callback) global.Log_Callback(`> 📄 Created: ${Data_File}`)
                Is_New = false
                Save_Chat_Data(Is_New, )
                Load_Chat_Data()
            } else {
                console.error(`> ❌ ERROR Load_Chat_Data: ${error}`)
            }
        }
    }
}
async function Save_Chat_Data(Is_New, isallerase) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return
    } else {
        try {
            console.log(`>  ◌ Saving ChatData to ${Data_File}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Saving ChatData to ${Data_File}...`)
            
            const Data_ = Array.from(Chat_Data.entries()).map(([chatId, name]) => ({ chatId, name }))
            const reversedData = Data_.reverse()
            const jsonString = '[\n' + reversedData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            await fs.writeFile(CHAT_DATA_FILE, jsonString, 'utf8')
            
            console.log(`> 💾 ChatData saved to ${Data_File}.`)
            if (global.Log_Callback) global.Log_Callback(`> 💾 ChatData saved to ${Data_File}.`)

            if (Is_Schedule && Is_New) {
                Is_New = false
                for (const { chatId } of Data_) {
                    if (!timer_Schedule[chatId]) {
                        console.log(`> ⏲️  Timer STARTING for ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${Data_File}...`)
                        if (global.Log_Callback) global.Log_Callback(`> ⏲️ Timer STARTING for ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${Data_File}...`)
                        Schedule_Erase_Chat_Data(chatId, timer_Duration_Formated_Schedule * timer_Duration_Schedule)
                    }
                }
            }
            let Is_From_All_Erase = false
            if (isallerase) {    
                Is_From_All_Erase = true
            }
            if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase)
        } catch (error) {
            console.error(`> ❌ ERROR Save_Chat_Data: ${error}`)
        }
    }
}
async function Erase_Chat_Data_By_Query(query, Is_From_End) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null }
    } else {
        try {
            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            const Parse_Data = JSON.parse(Data_)
            if (Parse_Data.length === 0) {
                console.log(`> ⚠️  ${Data_File} is empty, does not contain any chat data.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${Data_File} is empty, does not contain any chat data.`)
                return { Sucess: false, Is_Empty: true, Is_Empty_Input: false }
            }
            const normalizedQuery = query.toLowerCase()
            //const chatEntries = Array.from(Chat_Data.entries()).filter(([chatId, chatName]) => chatName.toLowerCase().includes(normalizedQuery) || chatId.toLowerCase().includes(normalizedQuery))
            //da pra adicionar um negocio loko de identificar se digito alguma coisa e se digito se existe na lista, por enquanto n vai ter ma so modifica um pouco que ja tem
            //if (chatEntries.every(entry => !entry.chatId)) {
            /*if (chatEntries.length === 0) {
                console.log(`> ⚠️  No ChatData found for the query: ${query}.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ No ChatData found for the query: ${query}.`)
                    console.log('coco')
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: true }
            }*/

            let erased = false
            let chatIdToErase = null
            for (const [chatId, name] of Chat_Data.entries()) {
                const normalizedEntryName = name.toLowerCase()
                const normalizedEntryChatId = chatId.toLowerCase()
                if (Is_From_End) {
                    if (normalizedEntryName === normalizedQuery || normalizedEntryChatId === normalizedQuery) {
                        console.log(`> ⚠️  Are you sure that you want to erase ${query} from ${Data_File}?`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️ Are you sure that you want to erase ${query} from ${Data_File}?`)
                        const answer = await askForConfirmation()
                        if (answer.toLowerCase() === 'y') {
                            console.log(`>  ◌ Erasing ${query} ChatData from ${Data_File}...`)
                            if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing ${query} ChatData from ${Data_File}...`)
                            
                            chatIdToErase = chatId
                            Chat_Data.delete(chatId)
                            erased = true
                        } else if (answer.toLowerCase() === 'n') {
                            console.log(`> ⚠️  ChatData for ${query} from ${Data_File}: DECLINED.`)
                            if (global.Log_Callback) global.Log_Callback(`> ⚠️ ChatData for ${query} from ${Data_File}: DECLINED.`)
                            return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                        } else {
                            console.log(`> ⚠️  ChatData for ${query} from ${Data_File}: NOT Answered to erase.`)
                            if (global.Log_Callback) global.Log_Callback(`> ⚠️ ChatData for ${query} from ${Data_File}: NOT Answered to erase.`)
                            return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                        }
                        break
                    } else {
                        console.log(`> ⚠️  ChatData for ${query} from ${Data_File}: NOT Found.`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️ ChatData for ${query} from ${Data_File}: NOT Found.`)
                        return { Sucess: false, Is_Empty: false, Is_Empty_Input: true }
                    }
                } else {
                    if (normalizedEntryName === normalizedQuery || normalizedEntryChatId === normalizedQuery) {
                        console.log(`>  ◌ Erasing ${query} ChatData from ${Data_File}...`)
                        if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing ${query} ChatData from ${Data_File}...`)
                        
                        chatIdToErase = chatId
                        Chat_Data.delete(chatId)
                        erased = true
                    } else {
                        console.log(`> ⚠️  ChatData for ${query} from ${Data_File}: NOT Found.`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️ ChatData for ${query} from ${Data_File}: NOT Found.`)
                        return { Sucess: false, Is_Empty: false, Is_Empty_Input: true }
                    }
                }
            }

            if (erased) {
                clearTimeout(timer_Schedule[chatIdToErase])
                delete timer_Schedule[chatIdToErase]
                if (Is_timer_On) {
                    console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatIdToErase} from ${Data_File}.`)
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatIdToErase} from ${Data_File}.`)
                    Is_timer_On = false
                }
                Is_New = false
                let isallerase = true
                await Save_Chat_Data(Is_New, isallerase)
                console.log(`> ✅ ChatData for ${query} from ${Data_File}: ERASED`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ ChatData for ${query} from ${Data_File}: ERASED`)
                return { Sucess: true, Is_Empty: false, Is_Empty_Input: false }
            }
        } catch (error) {
            console.error(`> ❌ ERROR Erase_Chat_Data_By_Query: ${error}`)
            return { Sucess: false, Is_Empty: null, Is_Empty_Input: null }
        }
    }
}
async function Erase_All_Chat_Data(Is_From_End) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return { Sucess: false, Is_Empty: null }
    } else {
        try {
            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            const Parse_Data = JSON.parse(Data_)
            if (Parse_Data.length === 0) {
                console.log(`> ⚠️  ${Data_File} is empty, does not contain any chat data.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${Data_File} is empty, does not contain any chat data.`)
                return { Sucess: false, Is_Empty: true }
            }

            let erased = false
            if (Is_From_End) {
                console.log(`> ⚠️  Are you sure that you want to erase all ChatData from ${Data_File}?`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ Are you sure that you want to erase all ChatData from ${Data_File}?`)
                const answer = await askForConfirmation()
                if (answer.toLowerCase() === 'y') {
                    console.log(`>  ◌ Erasing all ChatData from ${Data_File}...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing all ChatData from ${Data_File}...`)
                    
                    Chat_Data.clear()
                    erased = true
                } else if (answer.toLowerCase() === 'n') {
                    console.log(`> ⚠️  All ChatData from ${Data_File}: DECLINED.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ All ChatData from ${Data_File}: DECLINED.`)
                    return { Sucess: false, Is_Empty: false }
                } else {
                    console.log(`> ⚠️  All ChatData from ${Data_File}: NOT Answered to erase.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ All ChatData from ${Data_File}: NOT Answered to erase.`)
                    return { Sucess: false, Is_Empty: false }
                }
            } else {
                console.log(`>  ◌ Erasing all ChatData from ${Data_File}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing all ChatData from ${Data_File}...`)
                
                Chat_Data.clear()
                erased = true
            }

            if (erased) {    
                console.log(`> ✅ All ChatData from ${Data_File}: ERASED.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ All ChatData from ${Data_File}: ERASED.`)
                
                for (const chatId in timer_Schedule) {
                    clearTimeout(timer_Schedule[chatId])
                    delete timer_Schedule[chatId]
                    if (Is_timer_On) {
                        console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${Data_File}.`)
                        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${Data_File}.`)
                            Is_timer_On = false
                    }
                }

                Is_New = false
                let isallerase = true
                await Save_Chat_Data(Is_New, isallerase)

                return { Sucess: true, Is_Empty: false }
            }
        } catch (error) {
            console.error(`> ❌ ERROR Erase_All_Chat_Data: ${error}`)
            return { Sucess: false, Is_Empty: null }
        }
    }
}
function Schedule_Erase_Chat_Data(chatId, timeout) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return
    } else {
        try {
            Is_timer_On = true
            timer_Schedule[chatId] = setTimeout(async () => {
                    Chat_Data.delete(chatId)
                    Is_New = false
                    let isallerase = false
                    await Save_Chat_Data(Is_New, isallerase)
                    console.log(`> 🚮 Timer FINALIZED ChatData for ${chatId} ERASED after ${timeout / timer_Duration_Schedule} ${timer_Duration_Type_Schedule} from ${Data_File}.`)
                    if (global.Log_Callback) global.Log_Callback(`> 🚮 Timer FINALIZED ChatData for ${chatId} ERASED after ${timeout / timer_Duration_Schedule} ${timer_Duration_Type_Schedule} from ${Data_File}.`)
                    delete timer_Schedule[chatId]
            }, timeout)
        } catch (error) {
            console.error(`> ❌ ERROR Schedule_Erase_Chat_Data: ${error}`)
        }
    }
}
async function Search_Chat_Data_By_Search(search) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, ChatData: [] }
    } else {
        try {
            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            const Parse_Data = JSON.parse(Data_)
            if (Parse_Data.length === 0) {
                console.log(`> ⚠️  ${Data_File} is empty, does not contain any chat data.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${Data_File} is empty, does not contain any chat data.`)
                return { Sucess: false, Is_Empty: true, Is_Empty_Input: false, ChatData: [] }
            }

            const normalizedSearch = search.toLowerCase()
            const chatEntries = Array.from(Chat_Data.entries()).filter(([chatId, chatName]) => chatName.toLowerCase().includes(normalizedSearch) || chatId.toLowerCase().includes(normalizedSearch))
            if (chatEntries.length === 0) {
                console.log(`> ⚠️  No ChatData found for the search: ${search}.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ No ChatData found for the search: ${search}.`)
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, ChatData: [] }
            }
    
            console.log(`>  ◌ Printing ChatData for ${search} from ${Data_File}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌ Printing ChatData for ${search} from ${Data_File}...`)
            
            console.log(`> ↓↓ 💬${search} (${chatEntries.length}) Printed💬 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓ 💬${search} (${chatEntries.length}) Printed💬 ↓↓`)
            chatEntries.forEach(([chatId, chatName]) => {
                console.log(`- chatId: ${chatId} = name: ${chatName}`)
                if (global.Log_Callback) global.Log_Callback(`- chatId: ${chatId} = name: ${chatName}`)
            })
    
            const formattedData = chatEntries.map(([chatId, chatName]) => ({
                chatId,
                name: chatName
            }))

            return { Sucess: true, Is_Empty: false, Is_Empty_Input: false, ChatData: formattedData }
        } catch (error) {
            console.error(`> ❌ ERROR Search_Chat_Data_By_Search: ${error}`)
            return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, ChatData: [] }
        } 
    }
}
async function Print_All_Chat_Data(isallerase) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return { Sucess: false, Is_Empty: null, ChatData: [], Is_From_All_Erase: null }
    } else {
        try {
            if (isallerase) {
                console.log(`>  ◌ Printing ChatData from ${Data_File}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Printing ChatData from ${Data_File}...`)

                console.log('> ↓↓ 💬ALL ChatData (0) Printed💬 ↓↓')
                if (global.Log_Callback) global.Log_Callback('> ↓↓ 💬ALL ChatData (0) Printed💬 ↓↓')
                console.log(`- chatId: N/A = name: N/A`)
                if (global.Log_Callback) global.Log_Callback(`- chatId: N/A = name: N/A`)
                return { Sucess: true, Is_Empty: false, ChatData: [], Is_From_All_Erase: true }
            }

            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            const Parse_Data = JSON.parse(Data_)
            if (Parse_Data.length === 0) {
                console.log(`> ⚠️  ${Data_File} is empty, does not contain any chat data.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${Data_File} is empty, does not contain any chat data.`)
                return { Sucess: false, Is_Empty: true, ChatData: [], Is_From_All_Erase: false }
            }
            
            console.log(`>  ◌ Printing ChatData from ${Data_File}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌ Printing ChatData from ${Data_File}...`)
            
            console.log(`> ↓↓ 💬ALL ChatData (${Parse_Data.length}) Printed💬 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓ 💬ALL ChatData (${Parse_Data.length}) Printed💬 ↓↓`)
            Parse_Data.forEach(entry => {
                console.log(`- chatId: ${entry.chatId} = name: ${entry.name}`)
                if (global.Log_Callback) global.Log_Callback(`- chatId: ${entry.chatId} = name: ${entry.name}`)
            })
            return { Sucess: true, Is_Empty: false, ChatData: Parse_Data, Is_From_All_Erase: false }
        } catch (error) {
            console.error(`> ❌ ERROR Print_All_Chat_Data: ${error}`)
            return { Sucess: false, Is_Empty: null, ChatData: [], Is_From_All_Erase: null }
        }
    }
}

const client = new Client({
    authStrategy: new LocalAuth(),

    // unused because package.json: "whatsapp-web.js": "github:pedroslopez/whatsapp-web.js#webpack-exodus" solves everything
    //webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2412.54v2.html' }, //for video messages working version
    //webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', } //"normal" version

    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-gpu'],
        headless: true, //debug
    },
})
//let Is_Exceeds = true
client.on('qr', async qr => {
    try {
        global.QR_Counter++
        global.Stage_ = 1

        if (global.QR_Counter <= QR_Counter_Exceeds) { 
            console.log(`> ↓↓ 📸Client try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code below📸 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓ 📸Client try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code below📸 ↓↓`)
            
            qrcode.generate(qr, { small: true })
            
            qrcode.generate(qr, { small: true }, (Qr_String_Ascii) =>{
                global.Is_Conected = false
                global.Qr_String = Qr_String_Ascii
            
                if (global.Log_Callback) global.Log_Callback(global.Qr_String)
                if (QrCode_On_Callback) QrCode_On_Callback(true, global.QR_Counter)
            })

            console.log(`> ↑↑ 📸Client try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code above📸 ↑↑`)
            if (global.Log_Callback) global.Log_Callback(`> ↑↑ 📸Client try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code above📸 ↑↑`)
        } else {
            global.QR_Counter = 0
            global.Stage_ = 0
            
            if (QrCode_Exceeds_Callback) QrCode_Exceeds_Callback(QR_Counter_Exceeds)
            
            console.log(`> ❌ Maximum QR_Code retries Exceeds(${QR_Counter_Exceeds}).`)
            if (global.Log_Callback) global.Log_Callback(`> ❌ Maximum QR_Code retries Exceeds(${QR_Counter_Exceeds}).`)
            
            //console.log(`>  ◌ Exiting...`)
            //Is_Exceeds = false
            //process.exit(1)
            
            client.destroy()
            
            console.log(`>  ℹ️ Retry again.`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Retry again.`)
        }
    } catch (error) {
        console.log(`> ❌ ERROR connecting Client to WhatsApp Web by the QR_Code: ${error}`)
    }
})
client.on('authenticated', async () => {
    try {
        global.Qr_String = ''
        global.QR_Counter = 0
        global.Stage_ = 2
        
        if (Auth_Autenticated_Callback) Auth_Autenticated_Callback()
        
        console.log('> 🔑 SUCESSIFULLY Client Authenticated by the Local_Auth.')
        if (global.Log_Callback) global.Log_Callback(`> 🔑 SUCESSIFULLY Client Authenticated by the Local_Auth.`)
    } catch (error) {
        console.error(`> ❌ ERROR autenticated: ${error}`)
    } 
})
client.on('auth_failure', async error => {
    try {
        global.Qr_String = ''
        global.QR_Counter = 0
        global.Stage_ = 0
        
        if (Auth_Failure_Callback) Auth_Failure_Callback()
        console.error(`> ⚠️  ERROR Authentication Client to WhatsApp Web by the Local_Auth: ${error}`)
    } catch (error) {
        console.error(`> ❌ ERROR auth_failure: ${error}`)
    } 
})
client.on('ready', async () => {
    try {
        global.Qr_String = ''
        global.QR_Counter = 0
        global.Stage_ = 2
        
        if (Ready_Callback) Ready_Callback()
        
        global.Is_QrCode_On = false
        global.QR_Counter = 1
        
        console.log(`> ✅ Client is READY.`)
        if (global.Log_Callback) global.Log_Callback(`> ✅ Client is READY.`)
        
        Is_Not_Ready = false
        
        await Load_Chat_Data()
        
        console.log(`> ✅ FINISHED(Starting primary functions: Bot)`)
        if (global.Log_Callback) global.Log_Callback(`> ✅ FINISHED(Starting primary functions: Bot)`)
    } catch (error) {
        console.error(`> ❌ ERROR ready: ${error}`)
    } 
})

let Is_MSG_Started = false
let Cancel_Promise = false 
let Promise_ = null
let Timer_Sleep = null
async function Sleep_Timer(time, Cancel_Sleep) {
    try {
        //promise = new Promise((resolve) => timer_sleep = setTimeout(resolve, time))
        
        let i = 0
        while (i <= time / 1000) {
            if (Cancel_Sleep) {
                clearTimeout(Timer_Sleep)
                Cancel_Sleep = null
                Cancel_Promise = false
                Promise_ = null
                Timer_Sleep = null
                Is_MSG_Started = false
                console.log('foi')
                return
            }
            Is_MSG_Started = true
            Promise_ = new Promise((resolve) => Timer_Sleep = setTimeout(resolve, 1000))
            
            console.log(Cancel_Sleep)
            console.log(i)
            Cancel_Sleep = Cancel_Promise
            i++
            
            await sleep(1000)
            
            //return new Promise((resolve) => timer_sleep = setTimeout(resolve, 1000))
        }
        Cancel_Sleep = null
        Cancel_Promise = false
        Promise_ = null
        Timer_Sleep = null
        Is_MSG_Started = false
    } catch (error) {
        console.error(`> ❌ ERROR Sleep_Timer: ${error}`)
    }
}

//message //actual
//message_create //debug
let Count_MSG = 0
let MSG = true
let timer = null
client.on('message', async msg => {
    try {
        const chat = await msg.getChat()
        const chatId = chat.id._serialized
        const contact = await chat.getContact()
        const contactName = chat.name || contact.pushname || contact.verifiedName || 'Unknown'

        /*if (msg.fromMe) {
            console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${contactName} = (FM)`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${contactName} = (FM)`)
            //MSG = true
            //timer = null
            //Count_MSG = 0
            //return
        }*/

        let Accepted_ = false
        
        let Content_ = null

        if (msg.hasMedia) {
            if (msg.type === 'ptt') {
                Content_ = '🖼️📷📹🎵 ' + (msg.body || 'PTT')
            } else if (msg.type === 'image') {
                Content_ = '📷 ' + (msg.body || 'IMAGE')
            } else if (msg.type === 'sticker') {
                Content_ = '🖼️ ' + (msg.body || 'STICKER')
            } else if (msg.isGif) {
                Content_ = '🖼️📹 ' + (msg.body || 'GIF')
            } else if (msg.type === 'video') {
                Content_ = '📹 ' + (msg.body || 'VIDEO')
            } else if (msg.type === 'document') {
                Content_ = '📄 ' + (msg.body || 'FILE')
            } else {
                console.log(`> ⚠️  NEW MEDIA TYPE`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ NEW MEDIA`)
                Content_ = '❓ ' + (msg.body || 'UNKNOWN')
            }
        } else if (msg.type === 'audio') {
            Content_ = '🎵 ' + (msg.body || 'AUDIO')
        } else if (msg.type === 'location') {
            Content_ = '📍 ' + (msg.body || 'LOCATION')
        } else if (msg.type === 'vcard') {
            Content_ =  '📞 ' + (msg.body || 'CONTACT')
        } else if (msg.type === 'multi_vcard') {
            Content_ =  '📞📞 ' + (msg.body || 'CONTACTS')
        } else if (msg.type === 'chat') {
            Content_ = '💬 ' + (msg.body || 'TEXT')
        } else {
            console.log(`> ⚠️  NEW MSG TYPE`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ NEW MSG TYPE`)
            Content_ = '❓ ' + (msg.body || 'UNKNOWN')
        }
        //Content_ === '.' //debug
        //Content_ !== null //actual
        if (msg.body === '.' && Count_MSG === 0) {
            Accepted_ = true
        } else {
            Accepted_ = false
        }

        Count_MSG = 1
        if (Is_MSG_Started) {
            Count_MSG++
            
            if (Count_MSG >= 2) {
                clearTimeout(Timer_Sleep)
                Cancel_Promise = true
                Count_MSG = 1
            }
        }
        
        if (chat.isLoading) {
            console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${contactName} = (LOA)`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${contactName} = (LOA)`)
        }
        if (chat.isPSA) {
            console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${contactName} = (PSA)`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${contactName} = (PSA)`)
        }

        if (chat.isGroup) {
            console.log(`>  ℹ️ ${Actual_Time()} - ${contactName} = (GRO)\n: ${Content_}`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${contactName} = (GRO)\n: ${Content_}`)
            Count_MSG = 0
            MSG = true
            timer = null
            return
        } else if (chat.isStatusV3) {
            console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${contactName} = (STS)\n: ${Content_}`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${contactName} = (STS)\n: ${Content_}`)
            Count_MSG = 0
            MSG = true
            timer = null
            return
        } else if (chat.isGroupCall) {
            console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${contactName} = (GC)\n: ${Content_}`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${contactName} = (GC)\n: ${Content_}`)
            Count_MSG = 0
            MSG = true
            timer = null
            return
        } else if (msg.broadcast) {
            console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${contactName} = (BD)\n: ${Content_}`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${contactName} = (BD)\n: ${Content_}`)
            Count_MSG = 0
            MSG = true
            timer = null
            return
        } else {
            console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${contactName} = (IN/?)\n: ${Content_}`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${contactName} = (IN/?)\n: ${Content_}`)
        }

        if (Chat_Data.has(chatId)) {
            if (Chat_Data.get(chatId) !== contactName) {
                console.log(`> ⚠️  ${Actual_Time()} - ${chatId} - ${contactName} = (IN)(DIFERENT NAME)\n: ${Content_}`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${Actual_Time()} - ${chatId} - ${contactName} = (IN)(DIFERENT NAME)\n: ${Content_}`)
                console.log(`> ${chatId} = Already exists: ${Chat_Data.get(chatId)} - Updating to - ${contactName}...`)
                if (global.Log_Callback) global.Log_Callback(`> ${chatId} = Already exists: ${Chat_Data.get(chatId)} - Updating to - ${contactName}...`)
                
                Chat_Data.set(chatId, contactName)

                console.log(`>  ◌ Saving UPDATED ChatData to ${Data_File}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Saving UPDATED ChatData to ${Data_File}...`)

                const Data_ = Array.from(Chat_Data.entries()).map(([chatId, name]) => ({ chatId, name }))
                const jsonString = '[\n' + Data_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                await fs.writeFile(CHAT_DATA_FILE, jsonString, 'utf8')
                
                console.log(`> 💾 ChatData UPDATE saved to ${Data_File}.`)
                if (global.Log_Callback) global.Log_Callback(`> 💾 ChatData UPDATE saved to ${Data_File}.`)

                let Is_From_All_Erase = false
                if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase)
                
                Count_MSG = 0
                MSG = true
                timer = null
                return
            } else {
                //console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${contactName} = (IN)(ALREADY SAVED)\n: 💬 ${Content_}`)
                //if (global.Log_Callback) global.Log_Callback(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${contactName} = (IN)(ALREADY SAVED)\n: 💬 ${Content_}`)
                
                Count_MSG = 0
                MSG = true
                timer = null
                return
            }
        }
        if (Accepted_) {

            //Patterns for Miliseconds times:
            // Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
            // Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
            // Formated= 1 \ * 60 * 1000 = 1-Minute
            // Formated= 1 \ * 1000 = 1-Second

            let timer_Duration_Type_MSG_debug = timer_Duration_Type_MSG_ 
            let timer_Duration_Formated_MSG_debug = timer_Duration_Formated_MSG_
            let timer_Duration_MSG_debug = timer_Duration_MSG_
            
            timer_Duration_Type_MSG_debug = 'Seconds'
            timer_Duration_Formated_MSG_debug = 20
            timer_Duration_MSG_debug = 1000


            
            console.log(`> ✨ ${Actual_Time()} - ${chatId} - ${contactName} = (IN)(NEW): ${Content_}`)
            if (global.Log_Callback) global.Log_Callback(`> ✨ ${Actual_Time()} - ${chatId} - ${contactName} = (IN)(NEW): ${Content_}`)
            console.log(`>  ◌ ${chatId} - ${contactName} Sending ALL Messages...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  ${chatId} - ${contactName} Sending ALL Messages...`)

            
            //console.log(`>  ◌ ${chatId} - ${contactName} Sending .Message1....`)
            //if (global.Log_Callback) global.Log_Callback(`>  ◌  ${chatId} - ${contactName} Sending .Message1....`)

            await sleep(1.5 * 1000)
            chat.sendStateTyping()
            await sleep(1 * 1000)
            client.sendMessage(msg.from, '1', 'utf8')

            //console.log(`> ✅ ${chatId} - ${contactName} .Message1. Sent.`)
            //if (global.Log_Callback) global.Log_Callback(`> ✅ ${chatId} - ${contactName} .Message1. Sent.`)



            timer_Duration_ = timer_Duration_Formated_MSG_debug * timer_Duration_MSG_debug
            
            console.log(`> ⏲️  Timer STARTING for ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
            if (global.Log_Callback) global.Log_Callback(`> ⏲️ Timer STARTING for ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
            
            timer = setTimeout (async () => {
                console.log(`> ⏰ Timer FINALIZED ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                if (global.Log_Callback) global.Log_Callback(`> ⏰ Timer FINALIZED ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)

                    
                //console.log(`>  ◌ ${chatId} - ${contactName} Sending .Message22....`)
                //if (global.Log_Callback) global.Log_Callback(`> ◌  ${chatId} - ${contactName} Sending .Message22....`)
                
                await sleep(1.5 * 1000)
                chat.sendStateTyping()
                await sleep(1 * 1000)
                await client.sendMessage(msg.from, '22', 'utf8')

                //console.log(`> ✅ ${chatId} - ${contactName} .Message22. Sent.`)
                //if (global.Log_Callback) global.Log_Callback(`> ✅ ${chatId} - ${contactName} .Message22. Sent.`)
                
                timer = null
                MSG = false
            }, timer_Duration_)
            await Sleep_Timer(22.5 * 1000, Cancel_Promise)
            await Promise_
            console.log('teste')
            if (global.Log_Callback) global.Log_Callback('teste')
            

            if (MSG) {
                clearTimeout(timer)
                timer = null

                console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Timer ended BEFORE ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                

                //console.log(`>  ◌ ${chatId} - ${contactName} Sending .Message2....`)
                //if (global.Log_Callback) global.Log_Callback(`>  ◌  ${chatId} - ${contactName} Sending .Message2....`)
                
                await sleep(1.5 * 1000)
                chat.sendStateTyping()
                await sleep(1 * 1000)
                await client.sendMessage(msg.from, '2', 'utf8')
                
                //console.log(`> ✅ ${chatId} - ${contactName} .Message2. Sent.`)
                //if (global.Log_Callback) global.Log_Callback(`> ✅ ${chatId} - ${contactName} .Message2. Sent.`)
            }
            MSG = true
                

            //console.log(`>  ◌ ${chatId} - ${contactName} Sending .Message1....`)
            //if (global.Log_Callback) global.Log_Callback(`>  ◌  ${chatId} - ${contactName} Sending .Message1....`)

            await sleep(1.5 * 1000)
            chat.sendStateTyping()
            await sleep(1 * 1000)
            client.sendMessage(msg.from, '1', 'utf8')

            //console.log(`> ✅ ${chatId} - ${contactName} .Message1. Sent.`)
            //if (global.Log_Callback) global.Log_Callback(`> ✅ ${chatId} - ${contactName} .Message1. Sent.`)



            timer_Duration_ = timer_Duration_Formated_MSG_debug * timer_Duration_MSG_debug
            
            console.log(`> ⏲️  Timer STARTING for ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
            if (global.Log_Callback) global.Log_Callback(`> ⏲️ Timer STARTING for ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
            
            timer = setTimeout (async () => {
                console.log(`> ⏰ Timer FINALIZED ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                if (global.Log_Callback) global.Log_Callback(`> ⏰ Timer FINALIZED ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)

                    
                //console.log(`>  ◌ ${chatId} - ${contactName} Sending .Message22....`)
                //if (global.Log_Callback) global.Log_Callback(`> ◌  ${chatId} - ${contactName} Sending .Message22....`)
                
                await sleep(1.5 * 1000)
                chat.sendStateTyping()
                await sleep(1 * 1000)
                await client.sendMessage(msg.from, '22', 'utf8')

                //console.log(`> ✅ ${chatId} - ${contactName} .Message22. Sent.`)
                //if (global.Log_Callback) global.Log_Callback(`> ✅ ${chatId} - ${contactName} .Message22. Sent.`)
                
                timer = null
                MSG = false
            }, timer_Duration_)
            await Sleep_Timer(22.5 * 1000, Cancel_Promise)
            await Promise_
            console.log('teste')
            if (global.Log_Callback) global.Log_Callback('teste')
            

            if (MSG) {
                clearTimeout(timer)
                timer = null

                console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Timer ended BEFORE ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                

                //console.log(`>  ◌ ${chatId} - ${contactName} Sending .Message2....`)
                //if (global.Log_Callback) global.Log_Callback(`>  ◌  ${chatId} - ${contactName} Sending .Message2....`)
                
                await sleep(1.5 * 1000)
                chat.sendStateTyping()
                await sleep(1 * 1000)
                await client.sendMessage(msg.from, '2', 'utf8')
                
                //console.log(`> ✅ ${chatId} - ${contactName} .Message2. Sent.`)
                //if (global.Log_Callback) global.Log_Callback(`> ✅ ${chatId} - ${contactName} .Message2. Sent.`)
            }
            MSG = true


            console.log(`> ✅ ${chatId} - ${contactName} ALL Messages Sent.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ ${chatId} - ${contactName} ALL Messages Sent.`)

            Count_MSG = 0
                
            Chat_Data.set(chatId, contactName)
            
            Is_New = true
            let isallerase = false
            await Save_Chat_Data(Is_New, isallerase)
        }
    } catch (error) {
        console.error(`> ❌ ERROR sending messages: ${error}`)
    } 
})

console.log(`> ✅ FINISHED(Starting secundary functions)`)
if (global.Log_Callback) global.Log_Callback(`> ✅ FINISHED(Starting secundary functions)`)

//debug
/*console.log(`>  ℹ️ ${name} = v${version}`)
console.log(`>  ◌ Starting primary functions: Bot...`)
client.initialize()*/

async function initialize() {
    try {
        console.log(`>  ◌ Starting primary functions: Bot...`)
        if (global.Log_Callback) global.Log_Callback(`>  ◌ Starting primary functions: Bot...`)
        await client.initialize()
    } catch (error) {
        console.error(`> ❌ ERROR initialize: ${error}`)
    } 
}

module.exports = {
    Set_Log_Callback,
    Set_Exit_Callback, 
    Set_Auth_Failure_Callback, 
    Set_QrCode_On_Callback, 
    Set_QrCode_Exceeds_Callback, 
    Set_List_Callback,
    Set_List_Auxiliar_Callback,
    Print_All_Chat_Data,
    Set_Search_List_Callback,
    Search_Chat_Data_By_Search,
    Set_All_Erase_Callback,
    Set_Query_Erase_Callback,
    Set_Auth_Autenticated_Callback, 
    Set_Ready_Callback,
    Set_Start_Callback,
    Erase_Chat_Data_By_Query,
    Erase_All_Chat_Data,
    Reload_Front, 
    Input_Command, 
    initialize, 
}

//tarefas bot backend 
//em desenvolvimento...


//a desenvolver...
    //desenvolver o desenvolvimento de funils padroes de msg automaticas para o bot e implantar front end, principalmente front end so vai ser possivel mexer com isso la
    //tornar possivel varias instancias com client do wweb.js possivel varios numeros conectados na mesma conta e diferentes contas ao mesmo tempo
    //arrumar de nao reconhecer direito documentos no chat whatsapp, ta caindo como ?UNKNOWN? NEW MEDIA
    //?//se ainda existe encontrar variaveis Is e resetalas a qualquer erro que tiver que n seja de resetar tudo nos locais de debug de erro, sinca com o front end e tals?
    //adicionar pra nao executar comandos funcoes pra front end caso o front end n esteja conectado no caso quando estiver so rodando o backend as os funils funcionando sem ta no site com requesicao http e de Is e tals
    //da pra adicionar um negocio loko de identificar se digito alguma coisa e se digito se existe na lista, por enquanto n vai ter ma so modifica um pouco que ja tem nos command de pesquisa
    //arrumar meios de n precisar dessas variaveis permanentes, ou pelo menos diminuir muito