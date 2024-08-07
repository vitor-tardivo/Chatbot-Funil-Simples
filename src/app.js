// app.js Back_End
global.Log_Callback = null
function Set_Log_Callback(callback) {
    global.Log_Callback = callback
}
let Name_Software = 'bot'
let Version_ = '0.1.0'
console.log(`>  ℹ️ ${Name_Software} = v${Version_}`)
console.log(`>  ◌ Starting functions...`)
if (global.Log_Callback) global.Log_Callback(`>  ◌ Starting functions...`)

const { Client, LocalAuth, MessageMedia, Buttons } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
const path = require('path')
const fs = require('fs').promises
const fse = require('fs-extra')
const { v4: uuidv4 } = require('uuid')
const readline = require('readline')

function Reload_Front() {
    //console.error(`> ⚠️  Load FrontEnd page`)
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
global.Clients_Callback = null
function Set_Clients_Callback(callback) {
    global.Clients_Callback = callback
}
let Select_Client_Callback = null
function Set_Select_Client_Callback(callback) {
    Select_Client_Callback = callback
}
let New_Client_Callback = null
function Set_New_Client_Callback(callback) {
    New_Client_Callback = callback
}
let Ready_Callback = null
function Set_Ready_Callback(callback) {
    Ready_Callback = callback
}

async function sleep(time) {
    if (Is_Not_Ready) {
        console.log(`>  ℹ️ Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client_ not Ready.`)
        return 
    } else {
        try {
            return new Promise((resolve) => setTimeout(resolve, time))
        } catch (error) {
            console.error(`> ❌ ERROR sleep: ${error}`)
        }
    }
}

function generateUniqueId() {
    return uuidv4();
}

let Client_Is_Not_Ready = true

const Root_Dir = path.resolve(__dirname, '..')

let Is_Not_Ready = true

let timer_Duration_Type_MSG_ = ''
let timer_Duration_MSG_Type = 0
let timer_Duration_ = 0 * timer_Duration_MSG_Type

//Patterns for Miliseconds times:
// Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
// Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
// Formated= 1 \ * 60 * 1000 = 1-Minute
// Formated= 1 \ * 1000 = 1-Second

const rl = readline.createInterface({
    input: process.stdin
})
rl.on('line', async (input) => {
    try {
        input.trim().toLowerCase()
        
        let Is_Front_Back = true
        
        commands(input, Is_Front_Back)
    } catch (error) {
        console.error(`> ❌ ERROR line: ${error}`)
    }
})
async function Input_Command(command, Is_Front_Back) {
    try {
        command.trim().toLowerCase()
        
        commands(command, Is_Front_Back)
    } catch (error) {
        console.error(`> ❌ ERROR Input_Command: ${error}`)
    }   
}
//let Is_Erase = false

// Is_Front_Back - front = false, back = true
async function commands(command, Is_Front_Back) {
    if (Is_Not_Ready) {
        if (!Is_Front_Back) {
            if (command === 'start') {
                if (Start_Callback) Start_Callback()
                return
            }
        }

        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${global.Client_} not Ready.`)
        return
    } else {
        try {
            if (global.Log_Callback) global.Log_Callback(`${command}`)
            
            if (Is_Front_Back) {
                console.log(`> ⚠️  ${command} Can not send commands from the BackEnd.`)
            } else {
                console.log(`${command}`)

                if (command === null) {
                    console.log('>  ℹ️ Command not recognized.')
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Command not recognized.`)
                    return
                } else if (command === 'start') {
                    console.log(`> ⚠️  Bot already Initialized`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ Bot already Initialized`)
                } else if (command.startsWith('erase ')) {
                    const query = command.substring(6).trim()
                    if (query !== null) {
                        if (Query_Erase_Callback) Query_Erase_Callback(query)
                    } else {
                        console.log(`> ⚠️  Specify a ChatData to erase from ${global.File_Data_Chat_Data}, EXEMPLE:\nerase <number/name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${global.File_Data_Chat_Data}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all erase') {
                    if (All_Erase_Callback) All_Erase_Callback()
                } else if (command.startsWith('print ')) {
                    const Search = command.substring(6).trim()
                    if (Search !== null) {
                        if (Search_List_Callback) Search_List_Callback(Search)
                    } else {
                        console.log(`> ⚠️  Specify a ChatData to search from ${global.File_Data_Chat_Data}, EXEMPLE:\nprint <number/name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${global.File_Data_Chat_Data}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all print') {
                    if (List_Callback) List_Callback()
                } else if (command.startsWith('select ')) {
                    const Clientt_ = command.substring(7).trim()
                    if (Select_Client_Callback) Select_Client_Callback(Clientt_)
                } else if (command === 'new client') {
                    if (New_Client_Callback) New_Client_Callback()
                } else {
                    console.log('>  ℹ️ Command not recognized.')
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Command not recognized.`)
                }
            }
        } catch (error) {
            console.error(`> ❌ ERROR commands ${global.Client_}: ${error}`)
        }
    }
}

//const Root_Dir = path.resolve(__dirname, '..') 
global.Directory_Dir_Clients_ = path.join(Root_Dir, `Clients_`)
global.File_Data_Clients_ = `Client_-.json`
global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client_-.json`)

async function Load_Client_(Clientt_) {
    if (Client_Is_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Clientt_} not Ready.`)
        return //[]
    } else {
        try {
            Client_Is_Not_Ready = true

            global.File_Data_Clients_ = `Client_-${Clientt_}.json`
            global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client_-${Clientt_}.json`)

            console.log(`>  ◌ Loading ChatData ${Clientt_} from ${global.File_Data_Clients_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Loading Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
            
            const Clients_ = await fs.readFile(global.Data_File_Clients_, 'utf8')

            if (Clients_.length === 0) {
                console.log(`> ⚠️  ${global.File_Data_Clients_} off ${Clientt_} is empty.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${global.File_Data_Clients_} off ${Clientt_} is empty.`)
                await fs.writeFile(global.Data_File_Clients_, '[\n\n]', 'utf8')
                return //[]
            }
            
            console.log(`> ✅ Client_ ${Clientt_} loaded from ${global.File_Data_Clients_}.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ Client_ ${Clientt_} loaded from ${global.File_Data_Clients_}.`)
                
            //const Parse_Data = JSON.parse(Clients_)
            //return Parse_Data
        } catch (error) {
            if (error.code === 'ENOENT') {
                global.File_Data_Clients_ = `Client_-${Clientt_}.json`
                global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client_-${Clientt_}.json`)

                console.log(`> ⚠️  ${global.File_Data_Clients_} off ${Clientt_} does not exist: ${error}`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${global.File_Data_Clients_} off ${Clientt_} does not exist: ${error}`)
                
                console.log(`>  ◌ Creating ${global.File_Data_Clients_} off ${Clientt_}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Creating ${global.File_Data_Clients_} off ${Clientt_}...`)

                await fs.mkdir(global.Directory_Dir_Clients_, { recursive: true } )                
                await fs.writeFile(global.Data_File_Clients_, '[\n\n]', 'utf8')
                
                console.log(`> 📄 Created: ${global.File_Data_Clients_} off ${Clientt_}`)
                if (global.Log_Callback) global.Log_Callback(`> 📄 Created: ${global.File_Data_Clients_} off ${Clientt_}`)
                Load_Client_(Clientt_)
            } else {
                console.error(`> ❌ ERROR Load_Client_ ${Clientt_}: ${error}`)
                //return []
            }
        }
    }
}
async function Save_Client_(id, Clientt_) {
    if (Client_Is_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Clientt_} not Ready.`)
        return
    } else {
        try {
            Client_Is_Not_Ready = true

            console.log(`>  ◌ Saving Client_ ${Clientt_} to ${global.File_Data_Clients_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Saving Client_ ${Clientt_} to ${global.File_Data_Clients_}...`)

            const filePath = path.join(global.Directory_Dir_Clients_, `Client_-${Clientt_}.json`)// testa se funfo a mudanca de salva vice versa com 2 whats for
            const Clients_ = JSON.parse(await fs.readFile(filePath, 'utf8'))
            const New_Client_ = [{ id, Clientt_ }, ...Clients_.filter(item => item.Clientt_ !== Clientt_)]
            const jsonString = '[\n' + New_Client_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            
            await fs.writeFile(filePath, jsonString, 'utf8')
            
            console.log(`> 💾 Client_ ${Clientt_} saved to ${global.File_Data_Clients_}.`)
            if (global.Log_Callback) global.Log_Callback(`> 💾 Client_ ${Clientt_} saved to ${global.File_Data_Clients_}.`)
        } catch (error) {
            console.error(`> ❌ ERROR Save_Client_ ${Clientt_}: ${error}`)
        }
    }
}

const Clientts_ = {}
//Counter_Name_Clients_--//arrumar alguma forma de tirar o numero do client aqui, exponencial zas id de banco de dados
//fse.remove(`Local_Auth\\${global.Client_}`)
//fse.remove(`Clients_\\${global.File_Data_Clients_}`)
//Clientts_[global.Client_].instance.destroy()
//delete Clientts_[global.Client_].instance
    // quando for adicionar pra apagar o localauth, tem q apagar do objeto Clients_ tbm, tem que iniciar o client criar no caso ou se n mas estiver la que iniciou ent iniciar pra apagar ou n vai dar, sistema de apagar do json memo ja existe so pegar

global.Directory_Dir_Chat_Data = path.join(Root_Dir, `Chat_Datas`)
global.File_Data_Chat_Data = `Chat_Data-.json`
global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data-.json`)

async function Load_Chat_Data(Clientt_) {
    if (Is_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Clientt_} not Ready.`)
        return //[]
    } else {
        try {
            global.File_Data_Chat_Data = `Chat_Data-${Clientt_}.json`
            global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data-${Clientt_}.json`)

            console.log(`>  ◌ Loading ChatData ${Clientt_} from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Loading ChatData ${Clientt_} from ${global.File_Data_Chat_Data}...`)
            
            const ChatData = await fs.readFile(global.Data_File_Chat_Data, 'utf8')

            if (ChatData.length === 0) {
                console.log(`> ⚠️  ${global.File_Data_Chat_Data} off ${Clientt_} is empty.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${global.File_Data_Chat_Data} off ${Clientt_} is empty.`)
                await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                return //[]
            }

            
            console.log(`> ✅ ChatData ${Clientt_} loaded from ${global.File_Data_Chat_Data}.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ ChatData ${Clientt_} loaded from ${global.File_Data_Chat_Data}.`)
                
            //global.Client_ = Clientt_
            if (Select_Client_Callback) Select_Client_Callback(Clientt_)
                    
            //const Parse_Data = JSON.parse(ChatData)
            //return Parse_Data
        } catch (error) {
            if (error.code === 'ENOENT') {
                global.File_Data_Chat_Data = `Chat_Data-${Clientt_}.json`
                global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data-${Clientt_}.json`)

                console.log(`> ⚠️  ${global.File_Data_Chat_Data} off ${Clientt_} does not exist: ${error}`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${global.File_Data_Chat_Data} off ${Clientt_} does not exist: ${error}`)
                
                console.log(`>  ◌ Creating ${global.File_Data_Chat_Data} off ${Clientt_}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Creating ${global.File_Data_Chat_Data} off ${Clientt_}...`)

                await fs.mkdir(global.Directory_Dir_Chat_Data, { recursive: true } )                
                await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                
                console.log(`> 📄 Created: ${global.File_Data_Chat_Data} off ${Clientt_}`)
                if (global.Log_Callback) global.Log_Callback(`> 📄 Created: ${global.File_Data_Chat_Data} off ${Clientt_}`)
                Load_Chat_Data_Chat_Data(Clientt_)
            } else {
                console.error(`> ❌ ERROR Load_Chat_Data_Chat_Data ${Clientt_}: ${error}`)
                //return []
            }
        }
    }
}
const Is_Schedule = false//true-On/false-Off = Schedule_Erase_Chat_Data
//let Is_New = false/////////////////
let timer_Schedule = {}
let Is_timer_On = false

const timer_Duration_Type_Schedule = 'Seconds'
const timer_Duration_Schedule_Type = 1000
const timer_Duration_Schedule = 10 * timer_Duration_Schedule_Type
function Schedule_Erase_Chat_Data(chatId, time) {
    if (Is_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${global.Client_} not Ready.`)
        return
    } else {
        try {
            Is_timer_On = true
            timer_Schedule[chatId] = setTimeout(async () => {
                    //let Is_From_End = false
                    //Erase_Chat_Data_By_Query(chatId, Is_From_End)
        
                    const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
            
                    const Normalized_chatId = chatId.trim().toLowerCase()
                    const chatId_Entries = ChatData.filter(({chatId, name}) => 
                        chatId.trim().toLowerCase() === (Normalized_chatId) ||
                        name.trim().toLowerCase() === (Normalized_chatId)  
                    )

                    const Updated_ChatData = ChatData.filter(item =>
                        !chatId_Entries.some(Query_Entry =>
                            Query_Entry.chatId === item.chatId && Query_Entry.name === item.name
                        )
                    )

                    const jsonString = '[\n' + Updated_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                    await fs.writeFile(global.Data_File_Chat_Data, jsonString, 'utf8')

                    console.log(`> 🚮 Timer FINALIZED ChatData for ${chatId} ERASED after ${time / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} from ${global.File_Data_Chat_Data}.`)
                    if (global.Log_Callback) global.Log_Callback(`> 🚮 Timer FINALIZED ChatData for ${chatId} ERASED after ${time / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} from ${global.File_Data_Chat_Data}.`)

                    let Is_From_All_Erase = false
                    if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase)
                    
                    delete timer_Schedule[chatId]
            }, time)
        } catch (error) {
            console.error(`> ❌ ERROR Schedule_Erase_Chat_Data ${global.Client_}: ${error}`)
        }
    }
}
async function Save_Chat_Data(chatId, name, isallerase) {
    if (Is_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ ${global.Client_} not Ready.`)
        return
    } else {
        try {
            console.log(`>  ◌ Saving ChatData ${global.Client_} to ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Saving ChatData ${global.Client_} to ${global.File_Data_Chat_Data}...`)

            const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
            const New_ChatData = [{ chatId, name }, ...ChatData.filter(item => item.chatId !== chatId)]
            const jsonString = '[\n' + New_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            
            await fs.writeFile(global.Data_File_Chat_Data, jsonString, 'utf8')
            
            console.log(`> 💾 ChatData ${global.Client_} saved to ${global.File_Data_Chat_Data}.`)
            if (global.Log_Callback) global.Log_Callback(`> 💾 ChatData ${global.Client_} saved to ${global.File_Data_Chat_Data}.`)

            let Is_From_All_Erase = false
            if (isallerase) {    
                Is_From_All_Erase = true
            }
            if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase)
        } catch (error) {
            console.error(`> ❌ ERROR Save_Chat_Data ${global.Client_}: ${error}`)
        }
    }
}
function askForConfirmation() {
    try {
        if (Is_Not_Ready) {
            console.log(`>  ℹ️ ${global.Client_} not Ready.`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${global.Client_} not Ready.`)
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
        console.error(`> ❌ ERROR askForConfirmation ${global.Client_}: ${error}`)
    }
}
async function Erase_Chat_Data_By_Query(query, Is_From_End) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null }
    } else {
        try {
            const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
            
            const Normalized_Query = query.trim().toLowerCase()
            const Query_Entries = ChatData.filter(({chatId, name}) => 
                chatId.trim().toLowerCase() === (Normalized_Query) ||
                name.trim().toLowerCase() === (Normalized_Query)  
            )
        
            if (ChatData.length === 0) {
                console.log(`> ⚠️  ${global.File_Data_Chat_Data} is empty, does not contain any chat data.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${global.File_Data_Chat_Data} is empty, does not contain any chat data.`)
                return { Sucess: false, Is_Empty: true, Is_Empty_Input: false }
            }
            if (Query_Entries.length === 0) {
                console.log(`> ⚠️  No ChatData found for the search: ${query}.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ No ChatData found for the search: ${query}.`)
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, ChatData: [] }
            }

            let Erased_ = false
            let chatIds_To_Erase = []
            if (Is_From_End) {
                console.log(`> ⚠️  Are you sure that you want to erase ${query} from ${global.File_Data_Chat_Data}?`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ Are you sure that you want to erase ${query} from ${global.File_Data_Chat_Data}?`)
                const answer = await askForConfirmation()
                if (answer.toLowerCase() === 'y') {
                    console.log(`>  ◌ Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
                    
                    chatIds_To_Erase = Query_Entries.map(entry => entry.chatId)
                    
                    const Updated_ChatData = ChatData.filter(item =>
                        !Query_Entries.some(Query_Entry =>
                            Query_Entry.chatId === item.chatId && Query_Entry.name === item.name
                        )
                    )

                    const jsonString = '[\n' + Updated_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                    await fs.writeFile(global.Data_File_Chat_Data, jsonString, 'utf8')
                    
                    Erased_ = true
                } else if (answer.toLowerCase() === 'n') {
                    console.log(`> ⚠️  ChatData for ${query} from ${global.File_Data_Chat_Data}: DECLINED.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ ChatData for ${query} from ${global.File_Data_Chat_Data}: DECLINED.`)
                    return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                } else {
                    console.log(`> ⚠️  ChatData for ${query} from ${global.File_Data_Chat_Data}: NOT Answered to erase.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ ChatData for ${query} from ${global.File_Data_Chat_Data}: NOT Answered to erase.`)
                    return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                }
                
            } else {
                console.log(`>  ◌ Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
            
                chatIds_To_Erase = Query_Entries.map(entry => entry.chatId)
                    
                const Updated_ChatData = ChatData.filter(item =>
                    !Query_Entries.some(Query_Entry =>
                        Query_Entry.chatId === item.chatId && Query_Entry.name === item.name
                    )
                )
            
                const jsonString = '[\n' + Updated_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                await fs.writeFile(global.Data_File_Chat_Data, jsonString, 'utf8')
                
                Erased_ = true
            }
            

            if (Erased_) {
                chatIds_To_Erase.forEach(chatId => {
                    clearTimeout(timer_Schedule[chatId])
                    delete timer_Schedule[chatId]
                })
                if (Is_timer_On) {
                    console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatIds_To_Erase} from ${global.File_Data_Chat_Data}.`)
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatIds_To_Erase} from ${global.File_Data_Chat_Data}.`)
                    Is_timer_On = false
                }
                console.log(`> ✅ ChatData for ${query} from ${global.File_Data_Chat_Data}: ERASED`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ ChatData for ${query} from ${global.File_Data_Chat_Data}: ERASED`)
                let Is_From_All_Erase = false
                if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase)
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
            const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
            if (ChatData.length === 0) {
                console.log(`> ⚠️  ${global.File_Data_Chat_Data} is empty, does not contain any chat data.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${global.File_Data_Chat_Data} is empty, does not contain any chat data.`)
                return { Sucess: false, Is_Empty: true }
            }

            let Erased_ = false
            if (Is_From_End) {
                console.log(`> ⚠️  Are you sure that you want to erase all ChatData from ${global.File_Data_Chat_Data}?`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ Are you sure that you want to erase all ChatData from ${global.File_Data_Chat_Data}?`)
                const answer = await askForConfirmation()
                if (answer.toLowerCase() === 'y') {
                    console.log(`>  ◌ Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
                    
                    await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                    Erased_ = true
                } else if (answer.toLowerCase() === 'n') {
                    console.log(`> ⚠️  All ChatData from ${global.File_Data_Chat_Data}: DECLINED.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ All ChatData from ${global.File_Data_Chat_Data}: DECLINED.`)
                    return { Sucess: false, Is_Empty: false }
                } else {
                    console.log(`> ⚠️  All ChatData from ${global.File_Data_Chat_Data}: NOT Answered to erase.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ All ChatData from ${global.File_Data_Chat_Data}: NOT Answered to erase.`)
                    return { Sucess: false, Is_Empty: false }
                }
            } else {
                console.log(`>  ◌ Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
                
                await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                Erased_ = true
            }

            if (Erased_) {    
                console.log(`> ✅ All ChatData from ${global.File_Data_Chat_Data}: ERASED.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ All ChatData from ${global.File_Data_Chat_Data}: ERASED.`)
                
                for (const chatId in timer_Schedule) {
                    clearTimeout(timer_Schedule[chatId])
                    delete timer_Schedule[chatId]
                    if (Is_timer_On) {
                        console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}.`)
                        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}.`)
                    }
                    Is_timer_On = false
                }

                let Is_From_All_Erase = true
                if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase)

                return { Sucess: true, Is_Empty: false }
            }
        } catch (error) {
            console.error(`> ❌ ERROR Erase_All_Chat_Data: ${error}`)
            return { Sucess: false, Is_Empty: null }
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
            const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
            
            const Normalized_Search = search.trim().toLowerCase()
            const Search_Entries = ChatData.filter(({chatId, name}) => 
                chatId.trim().toLowerCase().includes(Normalized_Search) ||
                name.trim().toLowerCase().includes(Normalized_Search)
            )

            if (ChatData.length === 0) {
                console.log(`> ↓↓ 📄${global.File_Data_Chat_Data} is empty, does not contain any chat data📄 ↓↓`)
                if (global.Log_Callback) global.Log_Callback(`> ↓↓ 📄${global.File_Data_Chat_Data} is empty, does not contain any chat data📄 ↓↓`)
                console.log(`- Length: (0)`)
                if (global.Log_Callback) global.Log_Callback(`- Length: (0)`)
                console.log(`- chatId: N/A = name: N/A`)
                if (global.Log_Callback) global.Log_Callback(`- chatId: N/A = name: N/A`)

                return { Sucess: false, Is_Empty: true, Is_Empty_Input: false, ChatData: [] }
            }
            if (Search_Entries.length === 0) {
                console.log(`> ⚠️  No ChatData found for the search: ${search}.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ No ChatData found for the search: ${search}.`)
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, ChatData: [] }
            }
    
            console.log(`>  ◌ Printing ChatData for ${search} from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Printing ChatData for ${search} from ${global.File_Data_Chat_Data}...`)
            
            console.log(`> ↓↓ 📄${search} ChatData Printed📄 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓ 📄${search} ChatData Printed📄 ↓↓`)
            console.log(`- Length: (${Search_Entries.length})`)
            if (global.Log_Callback) global.Log_Callback(`- Length: (${Search_Entries.length})`)
            Search_Entries.forEach(({chatId, name}) => {
                console.log(`- chatId: ${chatId} = name: ${name}`)
                if (global.Log_Callback) global.Log_Callback(`- chatId: ${chatId} = name: ${name}`)
            })

            return { Sucess: true, Is_Empty: false, Is_Empty_Input: false, ChatData: Search_Entries }
        } catch (error) {
            console.error(`> ❌ ERROR Search_Chat_Data_By_Search: ${error}`)
            return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, ChatData: [] }
        } 
    }
}
async function Print_All_Chat_Data(isallerase) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Client not Ready.`)
        return { Sucess: false, Is_Empty: null, ChatData: [], Is_From_All_Erase: null }
    } else {
        try {
            const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))

            if (isallerase) {
                console.log(`> ↓↓ 📄ALL ChatData Erased📄 ↓↓`)
                if (global.Log_Callback) global.Log_Callback(`> ↓↓ 📄ALL ChatData Erased📄 ↓↓`)
                console.log(`- Length: (0)`)
                if (global.Log_Callback) global.Log_Callback(`- Length: (0)`)
                console.log(`- chatId: N/A = name: N/A`)
                if (global.Log_Callback) global.Log_Callback(`- chatId: N/A = name: N/A`)
                    
                return { Sucess: true, Is_Empty: false, ChatData: [], Is_From_All_Erase: true }
            }
            if (ChatData.length === 0) {
                console.log(`> ↓↓ 📄${global.File_Data_Chat_Data} is empty, does not contain any chat data📄 ↓↓`)
                if (global.Log_Callback) global.Log_Callback(`> ↓↓ 📄${global.File_Data_Chat_Data} is empty, does not contain any chat data📄 ↓↓`)
                console.log(`- Length: (0)`)
                if (global.Log_Callback) global.Log_Callback(`- Length: (0)`)
                console.log(`- chatId: N/A = name: N/A`)
                if (global.Log_Callback) global.Log_Callback(`- chatId: N/A = name: N/A`)

                return { Sucess: false, Is_Empty: true, ChatData: [], Is_From_All_Erase: false }
            }
            
            console.log(`>  ◌ Printing ChatData from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Printing ChatData from ${global.File_Data_Chat_Data}...`)
            
            console.log(`> ↓↓ 📄ALL ChatData Printed📄 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓ 📄ALL ChatData Printed📄 ↓↓`)
            console.log(`- Length: (${ChatData.length})`)
            if (global.Log_Callback) global.Log_Callback(`- Length: (${ChatData.length})`)
            ChatData.forEach(entry => {
                console.log(`- chatId: ${entry.chatId} = name: ${entry.name}`)
                if (global.Log_Callback) global.Log_Callback(`- chatId: ${entry.chatId} = name: ${entry.name}`)
            })
            return { Sucess: true, Is_Empty: false, ChatData: ChatData, Is_From_All_Erase: false }
        } catch (error) {
            console.error(`> ❌ ERROR Print_All_Chat_Data: ${error}`)
            return { Sucess: false, Is_Empty: null, ChatData: [], Is_From_All_Erase: null }
        }
    }
}

async function List_Directories(dir_Path, Is_Client_Ready) {
    if (Is_Client_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Client not Ready.`)
        return []
    } else {
        try {
            const Files_ = await fs.readdir(dir_Path, { withFileTypes: true })
            const Directories_ = Files_.filter(file => file.isDirectory()).map(dir => dir.name)

            return Directories_
        } catch (error) {
            console.error(`> ❌ ERROR List_Directories: ${error}`)
            return []
        }
    }
}
let Counter_Name_Clients_ = 0 //quando apagar tirar desse 1 desse tbm
async function Generate_Client_Name(Is_Client_Ready) { //talves criar um meio de o usuario colocar um nome frontend, resolveria problemas talves
    if (Is_Client_Ready) {
        console.log('>  ℹ️ Client_ not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Client_ not Ready.`)
        return null
    } else {
        try {
            Counter_Name_Clients_++
            const Client_ = `Client_${Counter_Name_Clients_}`
            return Client_
        } catch (error) {
            console.error(`> ❌ ERROR Generate_Client_Name: ${error}`)
            return null
        }
    }
}
const MAX_Clients_ = 3
const Chat_States = {}
async function Initialize_Client_(Clientt_) {
    try {
        Client_Is_Not_Ready = false
        await Load_Client_(Clientt_)
        //const Clients_ = JSON.parse(await fs.readFile(global.Data_File_Clients_, 'utf8'))
        if (Counter_Name_Clients_ > MAX_Clients_) {
            console.log(`> ⚠️  Max instances off Clients_ reached (${Counter_Name_Clients_}): MAX(${MAX_Clients_})`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ Máx instances off Clients_ reached (${Counter_Name_Clients_}): MAX(${MAX_Clients_})`)
            //if (_Callback) _Callback() // reagir ao front end caso
            fse.remove(`Clients_\\${global.File_Data_Clients_}`)
            return
        }
        let Client_ = Clientt_
        Client_ = new Client({
            authStrategy: new LocalAuth({
                dataPath: `Local_Auth\\${Clientt_}`,
                //clientId: Client_,
            }),

            //clientId: Client_,

            // unused because package.json: "whatsapp-web.js": "github:pedroslopez/whatsapp-web.js#webpack-exodus" solves everything
            //webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2412.54v2.html' }, //for video messages working version
            //webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', } //"normal" version

            puppeteer: {
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                args: ['--no-sandbox', '--disable-gpu'],
                headless: true, //debug
            },
        })
        await Client_.initialize()
        //console.log(Client_)
        //let Is_Exceeds = true
        let QR_Counter_Exceeds = 5 //5
        Client_.on('qr', async qr => {
            try {
                global.QR_Counter++
                global.Client_ = Clientt_
                if (global.Is_From_New) {
                    global.Stage_ = 3
                } else {
                    global.Stage_ = 1
                }

                if (global.QR_Counter <= QR_Counter_Exceeds) { 
                    console.log(`> ↓↓ 📸${Clientt_} try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code below📸 ↓↓`)
                    if (global.Log_Callback) global.Log_Callback(`> ↓↓ 📸${Clientt_} try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code below📸 ↓↓`, Client_)
                    
                    qrcode.generate(qr, { small: true })
                    
                    qrcode.generate(qr, { small: true }, (Qr_String_Ascii) =>{
                        global.Is_Conected = false
                        global.Qr_String = Qr_String_Ascii
                    
                        if (global.Log_Callback) global.Log_Callback(global.Qr_String)
                        if (QrCode_On_Callback) QrCode_On_Callback(true, global.QR_Counter, Clientt_)
                    })

                    console.log(`> ↑↑ 📸${Clientt_} try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code above📸 ↑↑`)
                    if (global.Log_Callback) global.Log_Callback(`> ↑↑ 📸${Clientt_} try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code above📸 ↑↑`)
                } else {
                    global.QR_Counter = 0
                    if (global.Is_From_New) {
                        global.Stage_ = 2
                    } else {
                        global.Stage_ = 0
                    }
                    global.Is_From_New = false 
                    
                    if (QrCode_Exceeds_Callback) QrCode_Exceeds_Callback(QR_Counter_Exceeds)
                    
                    console.log(`> ❌ ${Clientt_} Maximum QR_Code retries Exceeds(${QR_Counter_Exceeds}).`)
                    if (global.Log_Callback) global.Log_Callback(`> ❌ ${Clientt_} Maximum QR_Code retries Exceeds(${QR_Counter_Exceeds}).`)
                    
                    if (Client_) Client_.destroy()
                    Counter_Name_Clients_--
                    await sleep(1 * 1000)
                    fse.remove(`Local_Auth\\${Clientt_}`)
                    await sleep(1 * 1000)
                    
                    console.log(`>  ℹ️ Retry again.`)
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Retry again.`)
                }
            } catch (error) {
                console.log(`> ❌ ERROR connecting ${Clientt_} to WhatsApp Web by the QR_Code LocalAuth: ${error}`)
            }
        })
        Client_.on('authenticated', async () => {
            try {
                global.Qr_String = ''
                global.QR_Counter = 0
                global.Stage_ = 2
                global.Is_From_New = false 
                
                if (Auth_Autenticated_Callback) Auth_Autenticated_Callback(Clientt_)
                
                console.log(`> 🔑 SUCESSIFULLY ${Clientt_} Authenticated by the Local_Auth.`)
                if (global.Log_Callback) global.Log_Callback(`> 🔑 SUCESSIFULLY ${Clientt_} Authenticated by the Local_Auth.`)
            } catch (error) {
                console.error(`> ❌ ERROR autenticated ${Clientt_}: ${error}`)
            } 
        })
        Client_.on('auth_failure', async error => {
            try {
                global.Qr_String = ''
                global.QR_Counter = 0
                if (global.Is_From_New) {
                    global.Stage_ = 2
                } else {
                    global.Stage_ = 0
                }
                global.Is_From_New = false 

                if (Client_) Client_.destroy()
                Counter_Name_Clients_--
                await sleep(1 * 1000)
                fse.remove(`Local_Auth\\${Clientt_}`)
                await sleep(1 * 1000)
                fse.remove(`Clients_\\${Clientt_}`)
                
                if (Auth_Failure_Callback) Auth_Failure_Callback()
                console.error(`> ⚠️  ERROR Authentication ${Clientt_} to WhatsApp Web by the Local_Auth: ${error}`)
            } catch (error) {
                console.error(`> ❌ ERROR auth_failure ${Clientt_}: ${error}`)
            } 
        })
        Client_.on('ready', async () => {
            try {
                Clientts_[Clientt_] = {
                    instance: Client_,
                }
                Client_Is_Not_Ready = false
                const id = generateUniqueId()
                await Save_Client_(id, Clientt_)

                global.Qr_String = ''
                global.QR_Counter = 0
                global.Stage_ = 2
                global.Is_From_New = false 

                if (global.Clients_Callback) global.Clients_Callback(Clientt_)
                if (Ready_Callback) Ready_Callback(Clientt_)
                
                global.Is_QrCode_On = false
                global.QR_Counter = 1
                
                console.log(`> ✅ ${Clientt_} is READY.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ ${Clientt_} is READY.`)
                
                Is_Not_Ready = false
                
                await Load_Chat_Data(Clientt_)
            } catch (error) {
                console.error(`> ❌ ERROR ready ${Clientt_}: ${error}`)
            } 
        })

        function Actual_Time() {
            if (Is_Not_Ready) {
                console.log(`>  ℹ️ ${Client_} not Ready.`)
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️ ${Client_} not Ready.`)
                return '??:??:??'
            } else {
                try {
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
                } catch(error) {
                    console.error(`> ❌ ERROR Actual_Timer ${Client_}: ${error}`)
                }
            }
        }

        async function Sleep_Timer(time, Cancel_Sleep, chatId) {
            if (Is_Not_Ready) {
                console.log(`>  ℹ️ ${Clientt_} not Ready.`)
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️ ${Clientt_} not Ready.`)
                return 
            } else {
                try {
                    //promise = new Promise((resolve) => timer_sleep = setTimeout(resolve, time))
                    
                    let i = 0
                    while (i <= time / 1000) {
                        if (Cancel_Sleep) {
                            clearTimeout(Chat_States[chatId].Timer_Sleep)
                            Cancel_Sleep = null
                            Chat_States[chatId].Cancel_Promise = false
                            Chat_States[chatId].Promise_ = null
                            Chat_States[chatId].Timer_Sleep = null
                            Chat_States[chatId].Is_MSG_Started = false
                            return
                        }
                        Chat_States[chatId].Is_MSG_Started = true

                        Chat_States[chatId].Promise_ = new Promise((resolve) => Chat_States[chatId].Timer_Sleep = setTimeout(resolve, 1000))
                        
                        //console.log(Cancel_Sleep)
                        //console.log(i)
                        Cancel_Sleep = Chat_States[chatId].Cancel_Promise
                        i++
                        
                        await sleep(1000)
                        
                        //return new Promise((resolve) => timer_sleep = setTimeout(resolve, 1000))
                    }
                    Cancel_Sleep = null
                    Chat_States[chatId].Cancel_Promise = false
                    Chat_States[chatId].Promise_ = null
                    Chat_States[chatId].Timer_Sleep = null
                    Chat_States[chatId].Is_MSG_Started = false
                } catch (error) {
                    console.error(`> ❌ ERROR Sleep_Timer ${Client_}: ${error}`)
                }
            }
        }
        async function Funil_(msg, chat, chatId, name, Chat_Type, Chat_Action, Content_) {
            if (Is_Not_Ready) {
                console.log(`>  ℹ️ ${Clientt_} not Ready.`)
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️ ${Clientt_} not Ready.`)
                return 
            } else {
                try {
                    let MSG = true
                    let timer = null

                    //Patterns for Miliseconds times:
                    // Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
                    // Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
                    // Formated= 1 \ * 60 * 1000 = 1-Minute
                    // Formated= 1 \ * 1000 = 1-Second

                    let timer_Duration_Type_MSG_debug = 'Seconds' 
                    let timer_Duration_MSG_Type_debug = 1000 
                    let timer_Duration_debug = 10 * timer_Duration_MSG_Type_debug

                    
                    Chat_Action = '(NEW)'
                    console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                    console.log(`>  ◌ Sending ALL Messages...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌  Sending ALL Messages...`)

                    

                    console.log(`>  ◌ Sending .Message_debug....`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌  Sending .Message_debug....`)

                    await sleep(1.5 * 1000)
                    chat.sendStateTyping()
                    await sleep(1 * 1000)
                    Client_.sendMessage(msg.from, 'debug1', 'utf8')

                    console.log(`> ✅ .Message_debug. Sent.`)
                    if (global.Log_Callback) global.Log_Callback(`> ✅ .Message_debug. Sent.`)

                    
                    console.log(`> ⏲️  Timer STARTING for ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
                    if (global.Log_Callback) global.Log_Callback(`> ⏲️ Timer STARTING for ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
                    
                    timer = setTimeout (async () => {
                        await sleep(1 * 1000)
                        console.log(`> ⏰ Timer FINALIZED ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                        if (global.Log_Callback) global.Log_Callback(`> ⏰ Timer FINALIZED ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                
                            
                        console.log(`>  ◌ Sending .Message_debug....`)
                        if (global.Log_Callback) global.Log_Callback(`>  ◌  Sending .Message_debug....`)
            
                        await sleep(1.5 * 1000)
                        chat.sendStateTyping()
                        await sleep(1 * 1000)
                        Client_.sendMessage(msg.from, 'debug2', 'utf8')
            
                        console.log(`> ✅ .Message_debug. Sent.`)
                        if (global.Log_Callback) global.Log_Callback(`> ✅ .Message_debug. Sent.`)

                        MSG = false
                    }, timer_Duration_debug)
                    await Sleep_Timer(12.5 * 1000, Chat_States[chatId].Cancel_Promise, chatId)
                    await Chat_States[chatId].Promise_
                    

                    await sleep(1 * 1000)
                    if (MSG) {
                        clearTimeout(timer)
                
                        console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Timer ended BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                        

                        console.log(`>  ◌ Sending .Message_debug....`)
                        if (global.Log_Callback) global.Log_Callback(`>  ◌  Sending .Message_debug....`)
            
                        await sleep(1.5 * 1000)
                        chat.sendStateTyping()
                        await sleep(1 * 1000)
                        Client_.sendMessage(msg.from, 'debug22', 'utf8')
            
                        console.log(`> ✅ .Message_debug. Sent.`)
                        if (global.Log_Callback) global.Log_Callback(`> ✅ .Message_debug. Sent.`)
                    }
                    MSG = true 



                    console.log(`> ✅ ALL Messages Sent.`)
                    if (global.Log_Callback) global.Log_Callback(`> ✅ ALL Messages Sent.`)



                    Chat_States[chatId].Is_MSG_Initiate = true

                    if (Is_Schedule) { //&& Is_New) {
                        //Is_New = false  
                        console.log(`> ⏲️  Timer STARTING for ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}...`)
                        if (global.Log_Callback) global.Log_Callback(`> ⏲️ Timer STARTING for ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}...`)
                        
                        Schedule_Erase_Chat_Data(chatId, timer_Duration_Schedule)
                    }

                    delete Chat_States[chatId]
                } catch (error) {
                    console.error(`> ❌ ERROR Funil_ ${Clientt_}: ${error}`)
                }
            }
        }
        //message //actual
        //message_create //debug
        Client_.on('message_create', async msg => {
            try {
                const chat = await msg.getChat()
                const chatId = chat.id._serialized.slice(0, -5)
                const contact = await chat.getContact()
                const name = chat.name || contact.pushname || contact.verifiedName || 'Unknown'

                let Content_ = '❓ ' + 'NULL'
                let Chat_Type = '(NULL)'
                let Chat_Action = '(NULL)'

                //msg.body === '.' //debug
                //msg.body !== null //actual
                if (msg.body === '.') {
                    if (!Chat_States[chatId]) {
                        Chat_States[chatId] = {
                            Is_MSG_Initiate: true,
                            Is_MSG_Started: false,
                            Cancel_Promise: false, 
                            Promise_: null,
                            Timer_Sleep: null,
                        }
                    }
                } else {
                    //console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                    //if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                    return
                }

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
                
                if (chat.isLoading) {
                    Chat_Action = '(LOA)'
                } else {
                    Chat_Action = '(?)'
                }

                if (chat.isPSA) {
                    Chat_Action = '(PSA)'
                } else {
                    Chat_Action = '(IN/?)'
                }

                if (chat.isGroup) {
                    Chat_Type = '(GRO)'
                } else if (chat.isStatusV3) {
                    Chat_Type = '(STS)'
                } else if (chat.isGroupCall) {
                    Chat_Type = '(GROC)'
                } else if (msg.broadcast) {
                    Chat_Type = '(BD)'
                } else {
                    Chat_Type = '(IN/?)'
                }

                if (msg.fromMe) {
                    Chat_Type = '(FM)'
                }

                if (chat.isGroup || chat.isGroupCall || chat.isStatusV3 || msg.broadcast) {
                    console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)

                    delete Chat_States[chatId]
                    return
                }

                const jsonString = await fs.readFile(global.Data_File_Chat_Data, 'utf8');
                let ChatData = JSON.parse(jsonString);
                const existingEntry = ChatData.find(item => item.chatId === chatId);
            
                if (existingEntry) {
                    if (existingEntry.name !== name) {
                        Chat_Action = '(DFN)'
                        console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                        
                        let isallerase = false
                        await Save_Chat_Data(chatId, name, isallerase)

                        /*if (Chat_States[chatId].Is_MSG_Initiate) {   
                            delete Chat_States[chatId]
                        }*/
                        delete Chat_States[chatId]
                        return
                    } else {
                        //console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                        //if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                        
                        if (Chat_States[chatId].Is_MSG_Started) {
                            clearTimeout(Chat_States[chatId].Timer_Sleep)
                            Chat_States[chatId].Cancel_Promise = true
                        }
                        
                        if (Chat_States[chatId].Is_MSG_Initiate) {   
                            delete Chat_States[chatId]
                        }
                        return
                    }
                }

                if (Chat_States[chatId].Is_MSG_Initiate) {
                    let isallerase = false
                    await Save_Chat_Data(chatId, name, isallerase)

                
                    Chat_States[chatId].Is_MSG_Initiate = false
                    
                    await Funil_(msg, chat, chatId, name, Chat_Type, Chat_Action, Content_)
                }
            } catch (error) {
                console.error(`> ❌ ERROR sending messages ${Clientt_}: ${error}`)
            } 
        })
        Client_.on('message_revoke_everyone', async (msg) => {
            try {
                console.log(`> 📝 Message revoked: ${msg.body}`);
            } catch (error) {
                console.error(`> ❌ ERROR message_revoke_everyone ${Clientt_}: ${error}`);
            }
        })
        Client_.on('message_revoke_me', async (msg) => {
            try {
                console.log(`> 📝 Message revoked for me: ${msg.body}`);
            } catch (error) {
                console.error(`> ❌ ERROR message_revoke_me ${Clientt_}: ${error}`);
            }
        })
    } catch (error) {
        if (error.name === 'ProtocolError') {
            //quando nao da certo a criacao ou conexao do client pode dar aqui
            //console.error(`> ❌ ERROR Initialize_Client_ ${Clientt_} ProtocolError: ${error}`)
        } else {
            console.error(`> ❌ ERROR Initialize_Client_ ${Clientt_}: ${error}`)
        }
    }
}    
async function initialize() {
    if (!Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  Client not Ready.`)
        return { Sucess: false }
    } else {
        try {
            let Is_Client_Ready = false
            const Directories_ = await List_Directories('Local_Auth', Is_Client_Ready)
            
            let Counter_Clients_ = 0
            if (Directories_.length-1 === -1) {
                let Is_Client_Ready = false
                const Clientt_ = await Generate_Client_Name(Is_Client_Ready)
                console.log(Clientt_)
                await Initialize_Client_(Clientt_)
            } else {
                for (let i = -1; i < Directories_.length-1; i++) {
                    await Initialize_Client_(Directories_[Counter_Clients_])
                    Counter_Clients_++
                    Counter_Name_Clients_++
                }
            }
            return { Sucess: true }
        } catch (error) {
            console.error(`> ❌ ERROR initialize Client_-?: ${error}`)
            return { Sucess: false }
        }
    } 
}

module.exports = {
    sleep,
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
    List_Directories, 
    Set_Ready_Callback,
    Set_Start_Callback,
    Erase_Chat_Data_By_Query,
    Erase_All_Chat_Data,
    Reload_Front, 
    Input_Command, 
    Generate_Client_Name,
    Set_Select_Client_Callback,
    Set_New_Client_Callback,
    Initialize_Client_,
    initialize,
    Set_Clients_Callback,
}

console.log(`> ✅ FINISHED(Starting functions)`)
if (global.Log_Callback) global.Log_Callback(`> ✅ FINISHED(Starting functions)`)

//tarefas bot backend 
//em desenvolvimento...
    //desenvolver o desenvolvimento de funils padroes de msg automaticas para o bot e implantar front end, principalmente front end so vai ser possivel mexer com isso la
        //talves um sistema de for repeticao e vai mandando oq tiver na fila pra manda sla estando em uma funcao ou sla json
        //criar varis instancias de Clients_ varios numeros e funcinando ao mesmo tempo instancias de modo dinamico
        //////varios problemas no multi clients instance ao testar realmente 2 whats ao mesmo tempo e tals, salvando o client dos 2 no outro e vice versa talves seja a variaveis globais talves fazer array pra cada client dos caminhos de diretorio mai e mt role ein, equanto ta criando um client novo ta mostra o 2 mas ta rodando o 1 as funcao ent arruma isso questao da variavel global caso da incerteza e tals, ta pegando os 2 numero oq ta mandando e oq ta recebendo pro chatdata com o message_create talves seja normal ou n mas ruim pra debug ne os 2 tao linkado or isso ta assim, logica do funil o esquema de mandar msg e n responde e mandar outra msg n ta funfando, erro burro cometido so vai salvar ou ent funfa certo o q tiver selecionado e tem que ta com o front aberto ent ne burro n vai dar certo resolver isso logo, pode ta salvando chatdata no outro se selecionado outro
        
//a desenvolver...
    //ver como bota num server finalmente frontend githubpages e back em algum canto ai google drive sla como e ver como junta os 2
    //tornar possivel varias instancias com client do wweb.js possivel varios numeros conectados na mesma conta e diferentes contas ao mesmo tempo
    //adicionar pra nao executar comandos funcoes pra front end caso o front end n esteja conectado no caso quando estiver so rodando o backend as os funils funcionando sem ta no site com requesicao http e de Is e tals
    //da pra adicionar um negocio loko de identificar se digito alguma coisa e se digito se existe na lista, por enquanto n vai ter ma so modifica um pouco que ja tem nos command de pesquisa
    //?//se ainda existe encontrar variaveis Is e resetalas a qualquer erro que tiver que n seja de resetar tudo nos locais de debug de erro, sinca com o front end e tals?
    //?//arrumar meios de n precisar dessas variaveis permanentes, ou pelo menos diminuir muito?
    //funcoes multi instancias...