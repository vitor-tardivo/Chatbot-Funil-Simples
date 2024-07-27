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
let Ready_Callback = null
function Set_Ready_Callback(callback) {
    Ready_Callback = callback
}

let Is_Not_Ready = true

//Patterns for Miliseconds times:
// Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
// Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
// Formated= 1 \ * 60 * 1000 = 1-Minute
// Formated= 1 \ * 1000 = 1-Second

const rl = readline.createInterface({
    input: process.stdin
})
rl.on('line', async (input) => {
    input.trim().toLowerCase()
    
    let Is_Front_Back = true
    
    commands(input, Is_Front_Back)
})
async function Input_Command(command, Is_Front_Back) {
    try {
        /*if (command === null || command === undefined) {
            console.log('> ℹ️ Command not recognized.')
            return
        }*/
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
                        console.log(`> ⚠️  Specify a ChatName to erase ChatData from ${File_Data}, EXEMPLE:\nerase <contact-name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${File_Data}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all erase') {
                    let Is_From_End = true
                    await Erase_All_Chat_Data(Is_From_End)
                } else if (command.startsWith('print ')) {
                    const search = command.substring(6).trim()
                    if (search !== null) {
                        await Search_Chat_Data_By_Search(search)
                    } else {
                        console.log(`> ⚠️  Specify a ChatName to erase ChatData from ${File_Data}, EXEMPLE:\nerase <contact-name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${File_Data}, EXEMPLE:\nerase <contact-name>`)
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
                        console.log(`> ⚠️  Specify a ChatData to erase from ${File_Data}, EXEMPLE:\nerase <number/name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${File_Data}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all erase') {
                    if (All_Erase_Callback) All_Erase_Callback()
                } else if (command.startsWith('print ')) {
                    const Search = command.substring(6).trim()
                    if (Search !== null) {
                        if (Search_List_Callback) Search_List_Callback(Search)
                    } else {
                        console.log(`> ⚠️  Specify a ChatData to search from ${File_Data}, EXEMPLE:\nprint <number/name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  Specify a ChatName to erase ChatData from ${File_Data}, EXEMPLE:\nerase <contact-name>`)
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

const File_Data = 'Chat_Data.json'
const Root_Dir = path.resolve(__dirname, '..') 
const Directory_Dir = path.join(Root_Dir, 'Chat_Datas')
const Data_File = path.join(Directory_Dir, 'Chat_Data.json')

async function Load_Chat_Data() {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return []
    } else {
        try {
            console.log(`>  ◌ Loading ChatData from ${File_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌ Loading ChatData from ${File_Data}...`)
            
            const ChatData = await fs.readFile(Data_File, 'utf8')

            if (ChatData.length === 0) {
                console.log(`> ⚠️  ${File_Data} is empty.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${File_Data} is empty.`)
                await fs.writeFile(Data_File, '[\n\n]', 'utf8')
                return []
            }

            const Parse_Data = JSON.parse(ChatData)

            console.log(`> ✅ ChatData loaded from ${File_Data}.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ ChatData loaded from ${File_Data}.`)
            
            return Parse_Data
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`> ⚠️  ${File_Data} does not exist: ${error}`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${File_Data} does not exist: ${error}`)
                
                console.log(`>  ◌ Creating ${File_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Creating ${File_Data}...`)

                await fs.mkdir(Directory_Dir)                
                await fs.writeFile(Data_File, '[\n\n]', 'utf8')
                
                console.log(`> 📄 Created: ${File_Data}`)
                if (global.Log_Callback) global.Log_Callback(`> 📄 Created: ${File_Data}`)
                Load_Chat_Data()
            } else {
                console.error(`> ❌ ERROR Load_Chat_Data: ${error}`)
            }
        }
    }
}
const Is_Schedule = false//true-On/false-Off = Schedule_Erase_Chat_Data
let Is_New = false/////////////////
let timer_Schedule = {}
let Is_timer_On = false

const timer_Duration_Type_Schedule = 'Seconds'
const timer_Duration_Schedule_Type = 1000
const timer_Duration_Schedule = 10 * timer_Duration_Schedule_Type
function Schedule_Erase_Chat_Data(chatId, time) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return
    } else {
        try {
            Is_timer_On = true
            timer_Schedule[chatId] = setTimeout(async () => {
                    //let Is_From_End = false
                    //Erase_Chat_Data_By_Query(chatId, Is_From_End)
        
                    const ChatData = JSON.parse(await fs.readFile(Data_File, 'utf8'))
            
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
                    await fs.writeFile(Data_File, jsonString, 'utf8')

                    console.log(`> 🚮 Timer FINALIZED ChatData for ${chatId} ERASED after ${time / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} from ${File_Data}.`)
                    if (global.Log_Callback) global.Log_Callback(`> 🚮 Timer FINALIZED ChatData for ${chatId} ERASED after ${time / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} from ${File_Data}.`)

                    let Is_From_All_Erase = false
                    if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase)
                    
                    delete timer_Schedule[chatId]
            }, time)
        } catch (error) {
            console.error(`> ❌ ERROR Schedule_Erase_Chat_Data: ${error}`)
        }
    }
}
async function Save_Chat_Data(chatId, name, Is_New, isallerase) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return
    } else {
        try {
            console.log(`>  ◌ Saving ChatData to ${File_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Saving ChatData to ${File_Data}...`)

            const ChatData = JSON.parse(await fs.readFile(Data_File, 'utf8'))
            const New_ChatData = [{ chatId, name }, ...ChatData.filter(item => item.chatId !== chatId)]
            const jsonString = '[\n' + New_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            
            await fs.writeFile(Data_File, jsonString, 'utf8')
            
            console.log(`> 💾 ChatData saved to ${File_Data}.`)
            if (global.Log_Callback) global.Log_Callback(`> 💾 ChatData saved to ${File_Data}.`)

            if (Is_Schedule && Is_New) {
                Is_New = false  
                console.log(`> ⏲️  Timer STARTING for ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${File_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`> ⏲️ Timer STARTING for ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${File_Data}...`)
                
                Schedule_Erase_Chat_Data(chatId, timer_Duration_Schedule)
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
async function Erase_Chat_Data_By_Query(query, Is_From_End) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null }
    } else {
        try {
            const ChatData = JSON.parse(await fs.readFile(Data_File, 'utf8'))
            
            const Normalized_Query = query.trim().toLowerCase()
            const Query_Entries = ChatData.filter(({chatId, name}) => 
                chatId.trim().toLowerCase() === (Normalized_Query) ||
                name.trim().toLowerCase() === (Normalized_Query)  
            )
        
            if (ChatData.length === 0) {
                console.log(`> ⚠️  ${File_Data} is empty, does not contain any chat data.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${File_Data} is empty, does not contain any chat data.`)
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
                console.log(`> ⚠️  Are you sure that you want to erase ${query} from ${File_Data}?`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ Are you sure that you want to erase ${query} from ${File_Data}?`)
                const answer = await askForConfirmation()
                if (answer.toLowerCase() === 'y') {
                    console.log(`>  ◌ Erasing ${query} ChatData from ${File_Data}...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing ${query} ChatData from ${File_Data}...`)
                    
                    chatIds_To_Erase = Query_Entries.map(entry => entry.chatId)
                    
                    const Updated_ChatData = ChatData.filter(item =>
                        !Query_Entries.some(Query_Entry =>
                            Query_Entry.chatId === item.chatId && Query_Entry.name === item.name
                        )
                    )

                    const jsonString = '[\n' + Updated_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                    await fs.writeFile(Data_File, jsonString, 'utf8')
                    
                    Erased_ = true
                } else if (answer.toLowerCase() === 'n') {
                    console.log(`> ⚠️  ChatData for ${query} from ${File_Data}: DECLINED.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ ChatData for ${query} from ${File_Data}: DECLINED.`)
                    return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                } else {
                    console.log(`> ⚠️  ChatData for ${query} from ${File_Data}: NOT Answered to erase.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ ChatData for ${query} from ${File_Data}: NOT Answered to erase.`)
                    return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                }
                
            } else {
                console.log(`>  ◌ Erasing ${query} ChatData from ${File_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing ${query} ChatData from ${File_Data}...`)
            
                chatIds_To_Erase = Query_Entries.map(entry => entry.chatId)
                    
                const Updated_ChatData = ChatData.filter(item =>
                    !Query_Entries.some(Query_Entry =>
                        Query_Entry.chatId === item.chatId && Query_Entry.name === item.name
                    )
                )
            
                const jsonString = '[\n' + Updated_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                await fs.writeFile(Data_File, jsonString, 'utf8')
                
                Erased_ = true
            }
            

            if (Erased_) {
                chatIds_To_Erase.forEach(chatId => {
                    clearTimeout(timer_Schedule[chatId])
                    delete timer_Schedule[chatId]
                })
                if (Is_timer_On) {
                    console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatIds_To_Erase} from ${File_Data}.`)
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatIds_To_Erase} from ${File_Data}.`)
                    Is_timer_On = false
                }
                console.log(`> ✅ ChatData for ${query} from ${File_Data}: ERASED`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ ChatData for ${query} from ${File_Data}: ERASED`)
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
            const ChatData = JSON.parse(await fs.readFile(Data_File, 'utf8'))
            if (ChatData.length === 0) {
                console.log(`> ⚠️  ${File_Data} is empty, does not contain any chat data.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ ${File_Data} is empty, does not contain any chat data.`)
                return { Sucess: false, Is_Empty: true }
            }

            let Erased_ = false
            if (Is_From_End) {
                console.log(`> ⚠️  Are you sure that you want to erase all ChatData from ${File_Data}?`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ Are you sure that you want to erase all ChatData from ${File_Data}?`)
                const answer = await askForConfirmation()
                if (answer.toLowerCase() === 'y') {
                    console.log(`>  ◌ Erasing all ChatData from ${File_Data}...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing all ChatData from ${File_Data}...`)
                    
                    await fs.writeFile(Data_File, '[\n\n]', 'utf8')
                    Erased_ = true
                } else if (answer.toLowerCase() === 'n') {
                    console.log(`> ⚠️  All ChatData from ${File_Data}: DECLINED.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ All ChatData from ${File_Data}: DECLINED.`)
                    return { Sucess: false, Is_Empty: false }
                } else {
                    console.log(`> ⚠️  All ChatData from ${File_Data}: NOT Answered to erase.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ All ChatData from ${File_Data}: NOT Answered to erase.`)
                    return { Sucess: false, Is_Empty: false }
                }
            } else {
                console.log(`>  ◌ Erasing all ChatData from ${File_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ Erasing all ChatData from ${File_Data}...`)
                
                await fs.writeFile(Data_File, '[\n\n]', 'utf8')
                Erased_ = true
            }

            if (Erased_) {    
                console.log(`> ✅ All ChatData from ${File_Data}: ERASED.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ All ChatData from ${File_Data}: ERASED.`)
                
                for (const chatId in timer_Schedule) {
                    clearTimeout(timer_Schedule[chatId])
                    delete timer_Schedule[chatId]
                    if (Is_timer_On) {
                        console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${File_Data}.`)
                        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${File_Data}.`)
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
            const ChatData = JSON.parse(await fs.readFile(Data_File, 'utf8'))
            
            const Normalized_Search = search.trim().toLowerCase()
            const Search_Entries = ChatData.filter(({chatId, name}) => 
                chatId.trim().toLowerCase().includes(Normalized_Search) ||
                name.trim().toLowerCase().includes(Normalized_Search)
            )

            if (ChatData.length === 0) {
                console.log(`> ↓↓ 📄${File_Data} is empty, does not contain any chat data📄 ↓↓`)
                if (global.Log_Callback) global.Log_Callback(`> ↓↓ 📄${File_Data} is empty, does not contain any chat data📄 ↓↓`)
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
    
            console.log(`>  ◌ Printing ChatData for ${search} from ${File_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Printing ChatData for ${search} from ${File_Data}...`)
            
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
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ Client not Ready.`)
        return { Sucess: false, Is_Empty: null, ChatData: [], Is_From_All_Erase: null }
    } else {
        try {
            const ChatData = JSON.parse(await fs.readFile(Data_File, 'utf8'))

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
                console.log(`> ↓↓ 📄${File_Data} is empty, does not contain any chat data📄 ↓↓`)
                if (global.Log_Callback) global.Log_Callback(`> ↓↓ 📄${File_Data} is empty, does not contain any chat data📄 ↓↓`)
                console.log(`- Length: (0)`)
                if (global.Log_Callback) global.Log_Callback(`- Length: (0)`)
                console.log(`- chatId: N/A = name: N/A`)
                if (global.Log_Callback) global.Log_Callback(`- chatId: N/A = name: N/A`)

                return { Sucess: false, Is_Empty: true, ChatData: [], Is_From_All_Erase: false }
            }
            
            console.log(`>  ◌ Printing ChatData from ${File_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Printing ChatData from ${File_Data}...`)
            
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
let QR_Counter_Exceeds = 5
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

let timer_Duration_Type_MSG_ = ''
let timer_Duration_MSG_Type = 0
let timer_Duration_ = 0 * timer_Duration_MSG_Type

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
                return
            }
            Is_MSG_Started = true

            Promise_ = new Promise((resolve) => Timer_Sleep = setTimeout(resolve, 1000))
            
            //console.log(Cancel_Sleep)
            //console.log(i)
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

let Is_MSG_Initiate = true
//message //actual
//message_create //debug
client.on('message_create', async msg => {
    try {
        const chat = await msg.getChat()
        const chatId = chat.id._serialized.slice(0, -5)
        const contact = await chat.getContact()
        const name = chat.name || contact.pushname || contact.verifiedName || 'Unknown'
           
        let Accepted_ = false
        let MSG = true
        let timer = null
        let Content_ = null
        let Chat_Type = null
        let Chat_Action = null

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
            return
        } else {
            //console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
            //if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
        }

        const jsonString = await fs.readFile(Data_File, 'utf8');
        let ChatData = JSON.parse(jsonString);
        const existingEntry = ChatData.find(item => item.chatId === chatId);
    
        if (existingEntry) {
            if (existingEntry.name !== name) {
                Chat_Action = '(DFN)'
                console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                
                Is_New = false
                let isallerase = false
                await Save_Chat_Data(chatId, name, Is_New, isallerase)
                
                return
            } else {
                console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️  ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                
                return
            }
        }

        //msg.body === '.' //debug
        //msg.body !== null //actual
        if (msg.body === '.') {
            if (Is_MSG_Initiate) {   
                Accepted_ = true
                Is_MSG_Initiate = false
            }
            if (Is_MSG_Started) {
                clearTimeout(Timer_Sleep)
                Cancel_Promise = true
            }
        }

        if (Accepted_) {

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

            
            console.log(`>  ◌ Sending .Message1....`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  Sending .Message_debug....`)

            client.sendMessage(msg.from, 'debug', 'utf8')

            console.log(`> ✅ .Message1. Sent.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ .Message_debug. Sent.`)


            console.log(`> ✅ ALL Messages Sent.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ ALL Messages Sent.`)


            Is_MSG_Initiate = true
            
            Is_New = true
            let isallerase = false
            await Save_Chat_Data(chatId, name, Is_New, isallerase)
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
        return { Sucess: true }
    } catch (error) {
        console.error(`> ❌ ERROR initialize: ${error}`)
        return { Sucess: false }
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
    //desenvolver o desenvolvimento de funils padroes de msg automaticas para o bot e implantar front end, principalmente front end so vai ser possivel mexer com isso la
        //verificar como o funil funciona varios chats ao mesmo tempo mandando msg, se precisar de variaveis globais de array do funil msgs 

//a desenvolver...
    //tornar possivel varias instancias com client do wweb.js possivel varios numeros conectados na mesma conta e diferentes contas ao mesmo tempo
    //adicionar pra nao executar comandos funcoes pra front end caso o front end n esteja conectado no caso quando estiver so rodando o backend as os funils funcionando sem ta no site com requesicao http e de Is e tals
    //da pra adicionar um negocio loko de identificar se digito alguma coisa e se digito se existe na lista, por enquanto n vai ter ma so modifica um pouco que ja tem nos command de pesquisa
    //?//se ainda existe encontrar variaveis Is e resetalas a qualquer erro que tiver que n seja de resetar tudo nos locais de debug de erro, sinca com o front end e tals?
    //?//arrumar meios de n precisar dessas variaveis permanentes, ou pelo menos diminuir muito?
    //funcoes multi instancias...