// app.js Back_End
global.Log_Callback = null
function Set_Log_Callback(callback) {
    global.Log_Callback = callback
}

console.log(`>  ◌ Starting functions...`)
if (global.Log_Callback) global.Log_Callback(`>  ◌ (back)Starting functions...`)

const { Client, LocalAuth, MessageMedia, Buttons } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const path = require('path')
const fs = require('fs').promises
const fss = require('fs')
const fse = require('fs-extra')
const { v4: uuidv4 } = require('uuid')
const readline = require('readline')

const Root_Dir = path.resolve(__dirname, '..')

const { name: Name_Software } = JSON.parse(fss.readFileSync(path.resolve(Root_Dir, 'package.json'), 'utf8'));
const { version: Version_ } = JSON.parse(fss.readFileSync(path.resolve(Root_Dir, 'package.json'), 'utf8'))
console.log(`>  ℹ️ ${Name_Software} = v${Version_}`)
if (global.Log_Callback) global.Log_Callback(`>  ℹ️ (back)${Name_Software} = v${Version_}`)

function Reload_Front() {
    //console.error(`> ⚠️  Load FrontEnd page`)
    //Is_First_Reaload = false
    //process.exit(1)
}
async function Reset_() {
    try {
        global.QR_Counter = 0
        global.Qr_String = ''
        global.Is_Conected = true
        global.Stage_ = 0
        global.Is_From_New = false
        global.Client_ = null

        global.Client_Is_Not_Ready = true

        Is_Not_Ready = true

        global.Directory_Dir_Clients_ = path.join(Root_Dir, `Clients_`)
        global.File_Data_Clients_ = `Client_-.json`
        global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client_-.json`)

        global.Directory_Dir_Chat_Data = path.join(Root_Dir, `Chat_Datas`)
        global.File_Data_Chat_Data = `Chat_Data-.json`
        global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data-.json`)

        //Clientts_ = {}

        //timer_Schedule = {}
        Is_timer_On = false

        //Counter_Id_Clients_ = []
        //Chat_States = {}
    } catch (error) {
        console.error(`> ❌ ERROR Reset_: ${error}`)
    }
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

global.Statuses_WS_Callback = null
function Set_Statuses_WS_Callback(callback) {
    global.Statuses_WS_Callback = callback
}

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
let Erase_Client_Callback = null
function Set_Erase_Client_Callback(callback) {
    Erase_Client_Callback = callback
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
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${global.Client_} not Ready.`)
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

global.QR_Counter = 0
global.Qr_String = ''
global.Is_Conected = true
global.Stage_ = 0
global.Is_From_New = false
global.Client_ = null
global.Client_Name = 'Client'

global.Client_Is_Not_Ready = true

let Is_Not_Ready = true

global.Directory_Dir_Clients_ = path.join(Root_Dir, `Clients_`)
global.File_Data_Clients_ = `Client= .json`
global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client= .json`)

global.Directory_Dir_Chat_Data = path.join(Root_Dir, `Chat_Datas`)
global.File_Data_Chat_Data = `Chat_Data= .json`
global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data= .json`)

const Clientts_ = {}

const Is_Schedule = false//true-On/false-Off = Schedule_Erase_Chat_Data
const timer_Schedule = {}
let Is_timer_On = false

const timer_Duration_Type_Schedule = 'Seconds'
const timer_Duration_Schedule_Type = 1000
const timer_Duration_Schedule = 10 * timer_Duration_Schedule_Type

let Counter_Id_Clients_ = []
const Chat_States = {}

//let timer_Duration_Type_MSG_ = ''
//let timer_Duration_MSG_Type = 0
//let timer_Duration_ = 0 * timer_Duration_MSG_Type

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
async function commands(command, Is_Front_Back) {
    if (Is_Not_Ready) {
        if (!Is_Front_Back) {
            if (command === 'start') {
                if (Start_Callback) Start_Callback()
                return
            }
        }

        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${global.Client_} not Ready.`)
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
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Command not recognized.`)
                    return
                } else if (command === 'start') {
                    console.log(`> ⚠️  Bot already Initialized`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)Bot already Initialized`)
                } else if (command.startsWith('erase ')) {
                    const query = command.substring(6).trim()
                    if (query !== null) {
                        if (Query_Erase_Callback) Query_Erase_Callback(query)
                    } else {
                        console.log(`> ⚠️  Specify a ChatData to erase from ${global.File_Data_Chat_Data}, EXEMPLE:\nerase <number/name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  (back)Specify a ChatName to erase ChatData from ${global.File_Data_Chat_Data}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all erase') {
                    if (All_Erase_Callback) All_Erase_Callback()
                } else if (command.startsWith('print ')) {
                    const Search = command.substring(6).trim()
                    if (Search !== null) {
                        if (Search_List_Callback) Search_List_Callback(Search)
                    } else {
                        console.log(`> ⚠️  Specify a ChatData to search from ${global.File_Data_Chat_Data}, EXEMPLE:\nprint <number/name>`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️  (back)Specify a ChatName to erase ChatData from ${global.File_Data_Chat_Data}, EXEMPLE:\nerase <contact-name>`)
                    }
                } else if (command === 'all print') {
                    if (List_Callback) List_Callback()
                } else if (command.startsWith('client erase ')) {
                    const Clientt_ = command.substring(13).trim()
                    if (Erase_Client_Callback) Erase_Client_Callback(Clientt_)
                } else if (command.startsWith('select ')) {
                    const Clientt_ = command.substring(7).trim()
                    if (Select_Client_Callback) Select_Client_Callback(Clientt_)
                } else if (command === 'new client') {
                    if (New_Client_Callback) New_Client_Callback()
                } else {
                    console.log('>  ℹ️ Command not recognized.')
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Command not recognized.`)
                }
            }
        } catch (error) {
            console.error(`> ❌ ERROR commands ${global.Client_}: ${error}`)
        }
    }
}

async function Load_Client_(Clientt_) {
    if (global.Client_Is_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Clientt_} not Ready.`)
        return //[]
    } else {
        try {
            global.Client_Is_Not_Ready = true

            global.File_Data_Clients_ = `Client=${Clientt_}.json`
            global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client=${Clientt_}.json`)

            console.log(`>  ◌ Loading ChatData ${Clientt_} from ${global.File_Data_Clients_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌ (back)Loading Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
            
            const Clients_ = await fs.readFile(global.Data_File_Clients_, 'utf8')

            if (Clients_.length === 0) {
                console.log(`> ⚠️  ${global.File_Data_Clients_} off ${Clientt_} is empty.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)${global.File_Data_Clients_} off ${Clientt_} is empty.`)
                await fs.writeFile(global.Data_File_Clients_, '[\n\n]', 'utf8')
                return //[]
            }
            
            console.log(`> ✅ Client_ ${Clientt_} loaded from ${global.File_Data_Clients_}.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ (back)Client_ ${Clientt_} loaded from ${global.File_Data_Clients_}.`)
                
            //const Parse_Data = JSON.parse(Clients_)
            //return Parse_Data
        } catch (error) {
            if (error.code === 'ENOENT') {
                global.File_Data_Clients_ = `Client=${Clientt_}.json`
                global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client=${Clientt_}.json`)

                console.log(`> ⚠️  ${global.File_Data_Clients_} off ${Clientt_} does not exist: ${error}`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)${global.File_Data_Clients_} off ${Clientt_} does not exist: ${error}`)
                
                console.log(`>  ◌ Creating ${global.File_Data_Clients_} off ${Clientt_}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ (back)Creating ${global.File_Data_Clients_} off ${Clientt_}...`)

                await fs.mkdir(global.Directory_Dir_Clients_, { recursive: true } )                
                await fs.writeFile(global.Data_File_Clients_, '[\n\n]', 'utf8')
                
                console.log(`> 📄 Created: ${global.File_Data_Clients_} off ${Clientt_}`)
                if (global.Log_Callback) global.Log_Callback(`> 📄 (back)Created: ${global.File_Data_Clients_} off ${Clientt_}`)

                global.Client_Is_Not_Ready = false
                Load_Client_(Clientt_)
            } else {
                console.error(`> ❌ ERROR Load_Client_ ${Clientt_}: ${error}`)
                //return []
            }
        }
    }
}
async function Save_Client_(id, Clientt_) {
    if (global.Client_Is_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Clientt_} not Ready.`)
        return
    } else {
        try {
            global.Client_Is_Not_Ready = true

            console.log(`>  ◌ Saving Client_ ${Clientt_} to ${global.File_Data_Clients_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Saving Client_ ${Clientt_} to ${global.File_Data_Clients_}...`)

            const filePath = path.join(global.Directory_Dir_Clients_, `Client=${Clientt_}.json`)// testa se funfo a mudanca de salva vice versa com 2 whats for
            const Clients_ = JSON.parse(await fs.readFile(filePath, 'utf8'))
            const New_Client_ = [{ id, Clientt_ }, ...Clients_.filter(item => item.Clientt_ !== Clientt_)]
            const jsonString = '[\n' + New_Client_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            
            await fs.writeFile(filePath, jsonString, 'utf8')
            
            console.log(`> 💾 Client_ ${Clientt_} saved to ${global.File_Data_Clients_}.`)
            if (global.Log_Callback) global.Log_Callback(`> 💾 (back)Client_ ${Clientt_} saved to ${global.File_Data_Clients_}.`)
        } catch (error) {
            console.error(`> ❌ ERROR Save_Client_ ${Clientt_}: ${error}`)
        }
    }
}
async function Erase_Client_(Is_From_End, Clientt_) { // quando for adicionar pra apagar o localauth, tem q apagar do objeto Clients_ tbm, tem que iniciar o client criar no caso ou se n mas estiver la que iniciou ent iniciar pra apagar ou n vai dar, sistema de apagar do json memo ja existe so pegar
    if (global.Client_Is_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Clientt_} not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null }
    } else {
        try {
            global.Client_Is_Not_Ready = true

            const Clients_ = JSON.parse(await fs.readFile(global.Data_File_Clients_, 'utf8'))   
            const Local_Auth = (await fs.access(`Local_Auth\\${Clientt_}`, fs.constants.F_OK).then(() => true).catch(() => false))
        
            if (Clients_.length === 0 || null & Local_Auth === false & Clientts_[Clientt_] === 0 || null ) {
                console.log(`> ⚠️  ${global.Data_File_Clients_}, Local_Auth(${Clientt_}), array(Clientts_[${Clientt_}]) is ALL empty, does not contain any data.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)${global.Data_File_Clients_}, Local_Auth(dir), array(Clientts_) is ALL empty, does not contain any data.`)
                return { Sucess: false, Is_Empty: true, Is_Empty_Input: false }
            }
            if (Clientt_.length === 0 || null) {
                console.log(`> ⚠️  No Client_ found by the valor received: ${Clientt_}.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)No Client_ found by the valor received: ${Clientt_}.`)
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: true}
            }

            let Erased_ = false
            if (Is_From_End) {
                console.log(`> ⚠️  Are you sure that you want to erase Client ${Clientt_} from ${global.File_Data_Clients_}?`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)Are you sure that you want to erase Client_ ${Clientt_} from ${global.File_Data_Clients_}?`)
                const answer = await askForConfirmation()
                if (answer.toLowerCase() === 'y') {
                    console.log(`>  ◌ Erasing Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Erasing Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
                    
                    fse.remove(`Clients_\\${global.File_Data_Clients_}`)
                    Clientts_[Clientt_].instance.destroy()
                    delete Clientts_[Clientt_].instance
                    await sleep(1 * 1000)
                    fse.remove(`Local_Auth\\${Clientt_}`)
                    const clientIdNumber = Clientt_.match(/\d+/g)
                    Counter_Id_Clients_.splice(clientIdNumber-1, 1)
                    
                    Erased_ = true
                } else if (answer.toLowerCase() === 'n') {
                    console.log(`> ⚠️  Client_ ${Clientt_} from ${global.File_Data_Clients_}: DECLINED.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)Client_ ${Clientt_} from ${global.File_Data_Clients_}: DECLINED.`)
                    return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                } else {
                    console.log(`> ⚠️  Client_ ${Clientt_} from ${global.File_Data_Clients_}: NOT Answered to erase.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)Client_ ${Clientt_} from ${global.File_Data_Clients_}: NOT Answered to erase.`)
                    return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                }
                
            } else {
                console.log(`>  ◌ Erasing Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Erasing Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
                
                fse.remove(`Clients_\\${global.File_Data_Clients_}`)
                Clientts_[Clientt_].instance.destroy()
                delete Clientts_[Clientt_].instance
                await sleep(1 * 1000)
                fse.remove(`Local_Auth\\${Clientt_}`)
                const clientIdNumber = Clientt_.match(/\d+/g)
                Counter_Id_Clients_.splice(clientIdNumber-1, 1)
                
                Erased_ = true
            }
            

            if (Erased_) {
                console.log(`> ✅ Client_ ${Clientt_} from ${global.File_Data_Clients_}: ERASED`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ (back)Client_ ${Clientt_} from ${global.File_Data_Clients_}: ERASED`)
                
                return { Sucess: true, Is_Empty: false, Is_Empty_Input: false }
            }
        } catch (error) {
            console.error(`> ❌ ERROR Erase_Client_ ${Clientt_}: ${error}`)
            return { Sucess: false, Is_Empty: null, Is_Empty_Input: null }
        }
    }
}
async function Select_Client_(Clientt_) {
    if (Client_Is_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Clientt_} not Ready.`)
        return
    } else {
        try {
            global.Client_Is_Not_Ready = true

            global.Client_ = Clientt_

            global.File_Data_Chat_Data = `Chat_Data=${Clientt_}.json`
            global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Clientt_}.json`)

            global.File_Data_Clients_ = `Client=${Clientt_}.json`
            global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client=${Clientt_}.json`)

            console.log(`>  ℹ️ Client_ ${Clientt_} selected.`)
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Client_ ${Clientt_} selected.`)
        } catch (error) {
            console.error(`> ❌ Select_Client_ ${Clientt_}: ${error}`)
        }
    }
}

async function Load_Chat_Data(Clientt_) {
    if (Is_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Clientt_} not Ready.`)
        return //[]
    } else {
        try {
            global.File_Data_Chat_Data = `Chat_Data=${Clientt_}.json`
            global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Clientt_}.json`)

            console.log(`>  ◌ Loading ChatData ${Clientt_} from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Loading ChatData ${Clientt_} from ${global.File_Data_Chat_Data}...`)
            
            const ChatData = await fs.readFile(global.Data_File_Chat_Data, 'utf8')

            if (ChatData.length === 0) {
                console.log(`> ⚠️  ${global.File_Data_Chat_Data} off ${Clientt_} is empty.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)${global.File_Data_Chat_Data} off ${Clientt_} is empty.`)
                await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                return //[]
            }

            
            console.log(`> ✅ ChatData ${Clientt_} loaded from ${global.File_Data_Chat_Data}.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ (back)ChatData ${Clientt_} loaded from ${global.File_Data_Chat_Data}.`)
                
            //global.Client_ = Clientt_
            if (Select_Client_Callback) Select_Client_Callback(Clientt_)
                    
            //const Parse_Data = JSON.parse(ChatData)
            //return Parse_Data
        } catch (error) {
            if (error.code === 'ENOENT') {
                global.File_Data_Chat_Data = `Chat_Data=${Clientt_}.json`
                global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Clientt_}.json`)

                console.log(`> ⚠️  ${global.File_Data_Chat_Data} off ${Clientt_} does not exist: ${error}`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)${global.File_Data_Chat_Data} off ${Clientt_} does not exist: ${error}`)
                
                console.log(`>  ◌ Creating ${global.File_Data_Chat_Data} off ${Clientt_}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ (back)Creating ${global.File_Data_Chat_Data} off ${Clientt_}...`)

                await fs.mkdir(global.Directory_Dir_Chat_Data, { recursive: true } )                
                await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                
                console.log(`> 📄 Created: ${global.File_Data_Chat_Data} off ${Clientt_}`)
                if (global.Log_Callback) global.Log_Callback(`> 📄 (back)Created: ${global.File_Data_Chat_Data} off ${Clientt_}`)
                await Load_Chat_Data(Clientt_)
            } else {
                console.error(`> ❌ ERROR Load_Chat_Data ${Clientt_}: ${error}`)
                //return []
            }
        }
    }
}
async function Save_Chat_Data(chatId, name, isallerase) {
    if (Is_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${global.Client_} not Ready.`)
        return
    } else {
        try {
            console.log(`>  ◌ Saving ChatData ${global.Client_} to ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Saving ChatData ${global.Client_} to ${global.File_Data_Chat_Data}...`)

            const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
            const New_ChatData = [{ chatId, name }, ...ChatData.filter(item => item.chatId !== chatId)]
            const jsonString = '[\n' + New_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            
            await fs.writeFile(global.Data_File_Chat_Data, jsonString, 'utf8')
            
            console.log(`> 💾 ChatData ${global.Client_} saved to ${global.File_Data_Chat_Data}.`)
            if (global.Log_Callback) global.Log_Callback(`> 💾 (back)ChatData ${global.Client_} saved to ${global.File_Data_Chat_Data}.`)

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
            if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${global.Client_} not Ready.`)
            return
        } else {
            return new Promise((resolve) => {
                console.log('>  ℹ️ Confirm(Y/N)')
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Confirm(Y/N)`)
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
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Client not Ready.`)
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
                if (global.Log_Callback) global.Log_Callback(`> ⚠️  (back)${global.File_Data_Chat_Data} is empty, does not contain any chat data.`)
                return { Sucess: false, Is_Empty: true, Is_Empty_Input: false }
            }
            if (Query_Entries.length === 0) {
                console.log(`> ⚠️  No ChatData found for the search: ${query}.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️  (back)No ChatData found for the search: ${query}.`)
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: true }
            }

            let Erased_ = false
            let chatIds_To_Erase = []
            if (Is_From_End) {
                console.log(`> ⚠️  Are you sure that you want to erase ${query} from ${global.File_Data_Chat_Data}?`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️  (back)Are you sure that you want to erase ${query} from ${global.File_Data_Chat_Data}?`)
                const answer = await askForConfirmation()
                if (answer.toLowerCase() === 'y') {
                    console.log(`>  ◌ Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
                    
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
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  (back)ChatData for ${query} from ${global.File_Data_Chat_Data}: DECLINED.`)
                    return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                } else {
                    console.log(`> ⚠️  ChatData for ${query} from ${global.File_Data_Chat_Data}: NOT Answered to erase.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  (back)ChatData for ${query} from ${global.File_Data_Chat_Data}: NOT Answered to erase.`)
                    return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
                }
                
            } else {
                console.log(`>  ◌ Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
            
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
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatIds_To_Erase} from ${global.File_Data_Chat_Data}.`)
                    Is_timer_On = false
                }
                console.log(`> ✅ ChatData for ${query} from ${global.File_Data_Chat_Data}: ERASED`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ (back)ChatData for ${query} from ${global.File_Data_Chat_Data}: ERASED`)
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
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)${global.File_Data_Chat_Data} is empty, does not contain any chat data.`)
                return { Sucess: false, Is_Empty: true }
            }

            let Erased_ = false
            if (Is_From_End) {
                console.log(`> ⚠️  Are you sure that you want to erase all ChatData from ${global.File_Data_Chat_Data}?`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)Are you sure that you want to erase all ChatData from ${global.File_Data_Chat_Data}?`)
                const answer = await askForConfirmation()
                if (answer.toLowerCase() === 'y') {
                    console.log(`>  ◌ Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌ (back)Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
                    
                    await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                    Erased_ = true
                } else if (answer.toLowerCase() === 'n') {
                    console.log(`> ⚠️  All ChatData from ${global.File_Data_Chat_Data}: DECLINED.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)All ChatData from ${global.File_Data_Chat_Data}: DECLINED.`)
                    return { Sucess: false, Is_Empty: false }
                } else {
                    console.log(`> ⚠️  All ChatData from ${global.File_Data_Chat_Data}: NOT Answered to erase.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)All ChatData from ${global.File_Data_Chat_Data}: NOT Answered to erase.`)
                    return { Sucess: false, Is_Empty: false }
                }
            } else {
                console.log(`>  ◌ Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
                
                await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                Erased_ = true
            }

            if (Erased_) {    
                console.log(`> ✅ All ChatData from ${global.File_Data_Chat_Data}: ERASED.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ (back)All ChatData from ${global.File_Data_Chat_Data}: ERASED.`)
                
                for (const chatId in timer_Schedule) {
                    clearTimeout(timer_Schedule[chatId])
                    delete timer_Schedule[chatId]
                    if (Is_timer_On) {
                        console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}.`)
                        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}.`)
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
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Client not Ready.`)
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
                if (global.Log_Callback) global.Log_Callback(`> ↓↓ (back)📄${global.File_Data_Chat_Data} is empty, does not contain any chat data📄 ↓↓`)
                console.log(`- Length: (0)`)
                if (global.Log_Callback) global.Log_Callback(`- (back)Length: (0)`)
                console.log(`- chatId: N/A = name: N/A`)
                if (global.Log_Callback) global.Log_Callback(`- (back)chatId: N/A = name: N/A`)

                return { Sucess: false, Is_Empty: true, Is_Empty_Input: false, ChatData: [] }
            }
            if (Search_Entries.length === 0) {
                console.log(`> ⚠️  No ChatData found for the search: ${search}.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️  (back)No ChatData found for the search: ${search}.`)
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, ChatData: [] }
            }
    
            console.log(`>  ◌ Printing ChatData for ${search} from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Printing ChatData for ${search} from ${global.File_Data_Chat_Data}...`)
            
            console.log(`> ↓↓ 📄${search} ChatData Printed📄 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓ (back)📄${search} ChatData Printed📄 ↓↓`)
            console.log(`- Length: (${Search_Entries.length})`)
            if (global.Log_Callback) global.Log_Callback(`- (back)Length: (${Search_Entries.length})`)
            Search_Entries.forEach(({chatId, name}) => {
                console.log(`- chatId: ${chatId} = name: ${name}`)
                if (global.Log_Callback) global.Log_Callback(`- (back)chatId: ${chatId} = name: ${name}`)
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
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Client not Ready.`)
        return { Sucess: false, Is_Empty: null, ChatData: [], Is_From_All_Erase: null }
    } else {
        try {
            const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))

            if (isallerase) {
                console.log(`> ↓↓ 📄ALL ChatData Erased📄 ↓↓`)
                if (global.Log_Callback) global.Log_Callback(`> ↓↓ (back)📄ALL ChatData Erased📄 ↓↓`)
                console.log(`- Length: (0)`)
                if (global.Log_Callback) global.Log_Callback(`- (back)Length: (0)`)
                console.log(`- chatId: N/A = name: N/A`)
                if (global.Log_Callback) global.Log_Callback(`- (back)chatId: N/A = name: N/A`)
                    
                return { Sucess: true, Is_Empty: false, ChatData: [], Is_From_All_Erase: true }
            }
            if (ChatData.length === 0) {
                console.log(`> ↓↓ 📄${global.File_Data_Chat_Data} is empty, does not contain any chat data📄 ↓↓`)
                if (global.Log_Callback) global.Log_Callback(`> ↓↓ (back)📄${global.File_Data_Chat_Data} is empty, does not contain any chat data📄 ↓↓`)
                console.log(`- Length: (0)`)
                if (global.Log_Callback) global.Log_Callback(`- (back)Length: (0)`)
                console.log(`- chatId: N/A = name: N/A`)
                if (global.Log_Callback) global.Log_Callback(`- (back)chatId: N/A = name: N/A`)

                return { Sucess: false, Is_Empty: true, ChatData: [], Is_From_All_Erase: false }
            }
            
            console.log(`>  ◌ Printing ChatData from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Printing ChatData from ${global.File_Data_Chat_Data}...`)
            
            console.log(`> ↓↓ 📄ALL ChatData Printed📄 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓ (back)📄ALL ChatData Printed📄 ↓↓`)
            console.log(`- Length: (${ChatData.length})`)
            if (global.Log_Callback) global.Log_Callback(`- (back)Length: (${ChatData.length})`)
            ChatData.forEach(entry => {
                console.log(`- chatId: ${entry.chatId} = name: ${entry.name}`)
                if (global.Log_Callback) global.Log_Callback(`- (back)chatId: ${entry.chatId} = name: ${entry.name}`)
            })
            return { Sucess: true, Is_Empty: false, ChatData: ChatData, Is_From_All_Erase: false }
        } catch (error) {
            console.error(`> ❌ ERROR Print_All_Chat_Data: ${error}`)
            return { Sucess: false, Is_Empty: null, ChatData: [], Is_From_All_Erase: null }
        }
    }
}

async function Schedule_Erase_Chat_Data(chatId, time) {
    if (Is_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${global.Client_} not Ready.`)
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
                    if (global.Log_Callback) global.Log_Callback(`> 🚮 (back)Timer FINALIZED ChatData for ${chatId} ERASED after ${time / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} from ${global.File_Data_Chat_Data}.`)

                    let Is_From_All_Erase = false
                    if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase)
                    
                    delete timer_Schedule[chatId]
            }, time)
        } catch (error) {
            console.error(`> ❌ ERROR Schedule_Erase_Chat_Data ${global.Client_}: ${error}`)
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
async function Generate_Client_Id(Is_Client_Ready) {
    if (Is_Client_Ready) {
        console.log('>  ℹ️ Client_ not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Client_ not Ready.`)
        return null
    } else {
        try {
            let Id_Client_ = null
            let Counter_Clients_ = 1
            let i = false
            while (!i) {
                if (Counter_Id_Clients_[Counter_Clients_-1] === undefined) {
                    Id_Client_ = Counter_Clients_
                    Counter_Id_Clients_.push(Id_Client_)

                    i = true
                } else {
                    if (Counter_Clients_ !== Counter_Id_Clients_[Counter_Clients_-1]) {
                        Id_Client_ = Counter_Clients_
                        Counter_Id_Clients_.splice(Counter_Clients_-1, 0, Id_Client_)
                        
                        i = true
                    } else {
                        Counter_Clients_++
                    }
                }
            }
           
            return Id_Client_
        } catch (error) {
            console.error(`> ❌ ERROR Generate_Client_Id: ${error}`)
            return null
        }
    }
}
async function Initialize_Client_(Clientt_) {
    try {
        global.Client_Is_Not_Ready = false
        await Load_Client_(Clientt_)
        //const Clients_ = JSON.parse(await fs.readFile(global.Data_File_Clients_, 'utf8'))
        const MAX_Clients_ = 3
        if (Counter_Id_Clients_ > MAX_Clients_) {
            console.log(`> ⚠️  Max instances off Clients_ reached (${Counter_Id_Clients_}): MAX(${MAX_Clients_})`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)Máx instances off Clients_ reached (${Counter_Id_Clients_}): MAX(${MAX_Clients_})`)
            fse.remove(`Clients_\\${global.File_Data_Clients_}`)
            const clientIdNumber = Clientt_.match(/\d+/g)
            Counter_Id_Clients_.splice(clientIdNumber-1, 1)
            //if (_Callback) _Callback() // reagir ao front end caso
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
        const QR_Counter_Exceeds = 5 //5
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
                    if (global.Log_Callback) global.Log_Callback(`> ↓↓ (back)📸${Clientt_} try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code below📸 ↓↓`, Client_)
                    
                    qrcode.generate(qr, { small: true })
                    
                    qrcode.generate(qr, { small: true }, (Qr_String_Ascii) =>{
                        global.Is_Conected = false
                        global.Qr_String = Qr_String_Ascii
                    
                        if (global.Log_Callback) global.Log_Callback(global.Qr_String)
                        if (QrCode_On_Callback) QrCode_On_Callback(true, global.QR_Counter, Clientt_)
                    })

                    console.log(`> ↑↑ 📸${Clientt_} try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code above📸 ↑↑`)
                    if (global.Log_Callback) global.Log_Callback(`> ↑↑ (back)📸${Clientt_} try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code above📸 ↑↑`)
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
                    if (global.Log_Callback) global.Log_Callback(`> ❌ (back)${Clientt_} Maximum QR_Code retries Exceeds(${QR_Counter_Exceeds}).`)
                        
                    fse.remove(`Clients_\\${global.File_Data_Clients_}`)
                    if (Client_) Client_.destroy()
                    await sleep(1 * 1000)
                    fse.remove(`Local_Auth\\${Clientt_}`)
                    const clientIdNumber = Clientt_.match(/\d+/g)
                    Counter_Id_Clients_.splice(clientIdNumber-1, 1)

                    console.log(`>  ℹ️ Retry again.`)
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Retry again.`)
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
                
                console.log(`> 🔑 SUCESSIFULLY Client_ ${Clientt_} Authenticated by the Local_Auth.`)
                if (global.Log_Callback) global.Log_Callback(`> 🔑 (back)SUCESSIFULLY Client_ ${Clientt_} Authenticated by the Local_Auth.`)
            } catch (error) {
                console.error(`> ❌ ERROR autenticated ${Clientt_}: ${error}`)
            } 
        })
        Client_.on('ready', async () => {
            try {
                Clientts_[Clientt_] = {
                    instance: Client_,
                }
                global.Client_Is_Not_Ready = false
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
                if (global.Log_Callback) global.Log_Callback(`> ✅ (back)${Clientt_} is READY.`)
                
                Is_Not_Ready = false
                
                await Load_Chat_Data(Clientt_)
            } catch (error) {
                console.error(`> ❌ ERROR ready ${Clientt_}: ${error}`)
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

                fse.remove(`Clients_\\${global.File_Data_Clients_}`)
                if (Client_) Client_.destroy()
                await sleep(1 * 1000)
                fse.remove(`Local_Auth\\${Clientt_}`)
                const clientIdNumber = Clientt_.match(/\d+/g)
                Counter_Id_Clients_.splice(clientIdNumber-1, 1)
                
                if (Auth_Failure_Callback) Auth_Failure_Callback()
                console.error(`> ⚠️  ERROR Authentication ${Clientt_} to WhatsApp Web by the Local_Auth: ${error}`)
            } catch (error) {
                console.error(`> ❌ ERROR auth_failure ${Clientt_}: ${error}`)
            } 
        })

        function Actual_Time() {
            if (Is_Not_Ready) {
                console.log(`>  ℹ️ ${Client_} not Ready.`)
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Client_} not Ready.`)
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
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Clientt_} not Ready.`)
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
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                    console.log(`>  ◌ Sending ALL Messages...`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Sending ALL Messages...`)

                    

                    console.log(`>  ◌ Sending .Message_debug....`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Sending .Message_debug....`)

                    await sleep(1.5 * 1000)
                    chat.sendStateTyping()
                    await sleep(1 * 1000)
                    Client_.sendMessage(msg.from, 'debug1', 'utf8')

                    console.log(`> ✅ .Message_debug. Sent.`)
                    if (global.Log_Callback) global.Log_Callback(`> ✅ (back).Message_debug. Sent.`)

                    
                    console.log(`> ⏲️  Timer STARTING for ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
                    if (global.Log_Callback) global.Log_Callback(`> ⏲️ (back)Timer STARTING for ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
                    
                    timer = setTimeout (async () => {
                        await sleep(1 * 1000)
                        console.log(`> ⏰ Timer FINALIZED ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                        if (global.Log_Callback) global.Log_Callback(`> ⏰ (back)Timer FINALIZED ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                
                            
                        console.log(`>  ◌ Sending .Message_debug....`)
                        if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Sending .Message_debug....`)
            
                        await sleep(1.5 * 1000)
                        chat.sendStateTyping()
                        await sleep(1 * 1000)
                        Client_.sendMessage(msg.from, 'debug2', 'utf8')
            
                        console.log(`> ✅ .Message_debug. Sent.`)
                        if (global.Log_Callback) global.Log_Callback(`> ✅ (back).Message_debug. Sent.`)

                        MSG = false
                    }, timer_Duration_debug)
                    await Sleep_Timer(12.5 * 1000, Chat_States[chatId].Cancel_Promise, chatId)
                    await Chat_States[chatId].Promise_
                    

                    await sleep(1 * 1000)
                    if (MSG) {
                        clearTimeout(timer)
                
                        console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Timer ended BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                        

                        console.log(`>  ◌ Sending .Message_debug....`)
                        if (global.Log_Callback) global.Log_Callback(`>  ◌  (back)Sending .Message_debug....`)
            
                        await sleep(1.5 * 1000)
                        chat.sendStateTyping()
                        await sleep(1 * 1000)
                        Client_.sendMessage(msg.from, 'debug22', 'utf8')
            
                        console.log(`> ✅ .Message_debug. Sent.`)
                        if (global.Log_Callback) global.Log_Callback(`> ✅ (back).Message_debug. Sent.`)
                    }
                    MSG = true 



                    console.log(`> ✅ ALL Messages Sent.`)
                    if (global.Log_Callback) global.Log_Callback(`> ✅ ALL (back)Messages Sent.`)



                    Chat_States[chatId].Is_MSG_Initiate = true

                    if (Is_Schedule) { //&& Is_New) {
                        //Is_New = false  
                        console.log(`> ⏲️  Timer STARTING for ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}...`)
                        if (global.Log_Callback) global.Log_Callback(`> ⏲️ (back)Timer STARTING for ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}...`)
                        
                        await Schedule_Erase_Chat_Data(chatId, timer_Duration_Schedule)
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
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)NEW MEDIA`)
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
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ (back)NEW MSG TYPE`)
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
                    if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)

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
                        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                        
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

        await Client_.initialize()
    } catch (error) {
        if (error.name === 'ProtocolError') {
            //quando nao da certo a criacao ou conexao do client pode dar aqui
            //console.error(`> ❌ ERROR Initialize_Client_ ${Clientt_} ProtocolError: ${error}`)
        } else {
            console.error(`> ❌ ERROR Initialize_Client_ ${Clientt_}: ${error}`)
            const clientIdNumber = Clientt_.match(/\d+/g)
            Counter_Id_Clients_.splice(clientIdNumber-1, 1)
        }
    }
}    
async function initialize() {
    if (!Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️  (back)Client not Ready.`)
        return { Sucess: false }
    } else {
        try {
            let Is_Client_Ready = false
            const Directories_ = await List_Directories('Local_Auth', Is_Client_Ready)

            let Counter_Clients_ = 0
            if (Directories_.length-1 === -1) {
                const NameClient_ = global.Client_Name
                let Is_Client_Ready = false
                const Id_Client_ = await Generate_Client_Id(Is_Client_Ready)
                await Initialize_Client_(`_${Id_Client_}_${NameClient_}_`)
            } else {
                for (let i = -1; i < Directories_.length-1; i++) {
                    await Initialize_Client_(Directories_[Counter_Clients_])
                    Counter_Clients_++
                }
            }
            return { Sucess: true }
        } catch (error) {
            console.error(`> ❌ ERROR initialize: ${error}`)
            const clientIdNumber = Clientt_.match(/\d+/g)
            Counter_Id_Clients_.splice(clientIdNumber-1, 1)
            return { Sucess: false }
        }
    } 
}

module.exports = {
    sleep,
    generateUniqueId,
    Set_Statuses_WS_Callback,
    Set_Log_Callback,
    Set_Exit_Callback,
    Reset_,
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
    Generate_Client_Id,
    Erase_Client_,
    Set_Erase_Client_Callback,
    Select_Client_,
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
        //quand for apagar outro client que n estiver selecionado ele bloqueia
        //o funil ser de uma fila e oq tiver programado ali ele bate no codigo e executa na hora com oq tiver mandado e tals, sendo midias msg sleep contrapropostas e vai indo, um json programavel, ai ja as midias msg... como faco pra ta no json e rodas no zap assim?
        //sucess false do star n ta funfando aparece o botao start dinovo

//a desenvolver...
    //ver como bota num server finalmente frontend githubpages e back em algum canto ai google drive sla como e ver como junta os 2
    //tornar possivel varias instancias com client do wweb.js possivel varios numeros conectados na mesma conta e diferentes contas ao mesmo tempo
    //adicionar pra nao executar comandos funcoes pra front end caso o front end n esteja conectado no caso quando estiver so rodando o backend as os funils funcionando sem ta no site com requesicao http e de Is e tals
    //da pra adicionar um negocio loko de identificar se digito alguma coisa e se digito se existe na lista, por enquanto n vai ter ma so modifica um pouco que ja tem nos command de pesquisa
    //?//se ainda existe encontrar variaveis Is e resetalas a qualquer erro que tiver que n seja de resetar tudo nos locais de debug de erro, sinca com o front end e tals?
    //?//arrumar meios de n precisar dessas variaveis permanentes, ou pelo menos diminuir muito?
    //funcoes multi instancias...
    //fazer com que n de pra chamar a mesma funcao se ela ta sendo executada ainda talves uma variavel pra cada funcao? role ver prioridades escadinha qual depende de qual e cancelar o uso e vai inu
    //da pra fazer de a cada usuario do websocket e todas as funcoes unicas dele igual e os callback, bota tudo dentro de uma funcao e roda a cada usuario pra pensa melhor se vai ser tudo dentro de uma funcao sla pq se desconectar fudeo sai da funcao e para tudo talves salva na memoria(talves ja esteja salvo ne) e n apagar a conexao o id e tals, criar formas de apagar o usuario prorio a conexao e criar uma talves atraves de um cadastro ne pai kkkk daora tudo isso ai separa por pasta de usuario e coloca tudo os json dentro de um so