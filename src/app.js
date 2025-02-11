// app.js Back_End
global.Log_Callback = null
function Set_Log_Callback(callback) {
    global.Log_Callback = callback
}

console.log(`>  ◌ Starting functions...`)
if (global.Log_Callback) global.Log_Callback(`>  ◌ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Starting functions</strong>...`)

const dotenv = require('dotenv')
dotenv.config()
const { Client, LocalAuth, MessageMedia, Buttons } = require('whatsapp-web.js')
//const puppeteer = require('puppeteer')
const qrcode = require('qrcode-terminal')
const path = require('path')
const fs = require('fs').promises
const fss = require('fs')
const fse = require('fs-extra')
const { v4: uuidv4 } = require('uuid')
const readline = require('readline')
const _ = require('lodash')
const Root_Dir = path.resolve(__dirname, '..')

function Reload_Front() {
    //console.error(`> ⚠️  Load FrontEnd page`)
    //Is_First_Reaload = false
    //process.exit(1)
}
async function Reset_() {
    if (global.Is_Reset) {
        console.log(`>  ℹ️ Reset_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Reset_</strong> not Ready.`)
        return 
    }
    try {
        global.Is_Reset = true

        initialize_Not_Ready = false
        initialize_Client_Not_Ready = true

        global.QR_Counter = 0
        global.Qr_String = ''
        global.Is_Conected = true
        global.Stage_ = 0
        global.Is_From_New = false
        global.Client_ = null

        global.Is_Schedule = null

        Client_Not_Ready = null

        ChatData_Not_Ready = true

        Generate_Id_Not_Ready = true

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
    console.error(`> ⚠️  Process exited with code(${code})`)
    global.Is_Reset = false
    Reset_()
})
process.on('uncaughtException', (error) => {
    console.error(`> ❌ Uncaught Exception: ${error}`)
})
process.on('SIGUSR2', () => {// nodemon
    if (Exit_Callback) Exit_Callback()
    console.error('> ❌ Process interrupted: (SIGUSR2)')
})
process.on('SIGINT', () => {// Ctrl+C
    if (Exit_Callback) Exit_Callback()
    console.error('> ❌ Process interrupted: (SIGINT)')
})
process.on('SIGTERM', () => {// kill
    if (Exit_Callback) Exit_Callback()
    console.error('> ❌ Process interrupted: (SIGTERM)')
})
process.on('SIGHUP', () => {// terminal closed
    if (Exit_Callback) Exit_Callback()
    console.error('> ❌ Process interrupted: (SIGHUP)')
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
let Set_Client_Name_Callback = null
async function Set_Set_Client_Name_Callback(callback) {
    Set_Client_Name_Callback = callback
}
let Set_Funil_Name_Callback = null
async function Set_Set_Funil_Name_Callback(callback) {
    Set_Funil_Name_Callback = callback
}
let Set_Template_Name_Callback = null
async function Set_Set_Template_Name_Callback(callback) {
    Set_Template_Name_Callback = callback
}
let Clients_Callback = null
function Set_Clients_Callback(callback) {
    Clients_Callback = callback
}
let Select_Client_Callback = null
function Set_Select_Client_Callback(callback) {
    Select_Client_Callback = callback
}
let Erase_Client_Callback = null
function Set_Erase_Client_Callback(callback) {
    Erase_Client_Callback = callback
}
let Destroy_Client_Callback = null
async function Set_Destroy_Client_Callback(callback) {
    Destroy_Client_Callback = callback
}
let Reinitialize_Client_Callback = null
async function Set_Reinitialize_Client_Callback(callback) {
    Reinitialize_Client_Callback = callback
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
    try {
        return new Promise((resolve) => setTimeout(resolve, time))
    } catch (error) {
        console.error(`> ❌ ERROR sleep: ${error}`)
    }
}

async function generateUniqueId() {
    return uuidv4()
}

async function askForConfirmation(Clientt_) {
    try {
        if (ChatData_Not_Ready) {
            console.log(`>  ℹ️ ${Clientt_} not Ready.`)
            if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
            return
        } else {
            return new Promise((resolve) => {
                console.log('>  ℹ️ Confirm(Y/N)')
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Confirm(Y/N)</strong>`)
                rl.question('',(answer) => {
                    resolve(answer.trim().toLowerCase())
                })
            })
        }
    } catch (error) {
        console.error(`> ❌ ERROR askForConfirmation ${Clientt_}: ${error}`)
    }
}

async function List_Directories(dir_Path) {
    try {
        //console.log(dir_Path)
        //await fs.mkdir(path.join(Root_Dir, dir_Path), { recursive: true } )

        let Files_ = null
        let Directories_ = null
        let Usorted_Directories_ = null
        if (dir_Path === 'Funil') {
            Files_ = await fs.readdir(dir_Path)
            Directories_ = Files_
        } else if (dir_Path.startsWith('Funil') && dir_Path.length > 'Funil'.length) {
            if (dir_Path.split('\\')[1] === 'null') {
                return []
            }

            Files_ = await fs.readdir(dir_Path)
            Directories_ = Files_.filter(file => file.endsWith('.json'))
        } else if (dir_Path === 'Local_Auth') {
            Files_ = await fs.readdir(dir_Path, { withFileTypes: true })
            Usorted_Directories_ = Files_.filter(file => file.isDirectory()).map(dir => dir.name)
            Directories_ = [...Usorted_Directories_].sort((a, b) => {//mt trabalho e possivel mas mt trabalho ent fz isso mesmo que e a mesma coisa ne, so lembra se for mexe com algo aver
                const numA = parseInt(a.split('_')[1], 10)
                const numB = parseInt(b.split('_')[1], 10)
                return numA - numB
            })
        } else if (dir_Path === 'Clients_') {
            Files_ = await fs.readdir('Clients_', { withFileTypes: true })
            //console.log(Files_)
            Directories_ = Files_.map(file => file.name)
            //console.log(Directories_)
        }
        //console.log(Directories_)
        return Directories_
    } catch (error) {
        console.error(`> ❌ ERROR List_Directories: ${error}`)
        return []
    }
}

let initialize_Not_Ready = false
let initialize_Client_Not_Ready = true

global.Is_Reset = true

global.QR_Counter = 0
global.Qr_String = ''
global.Is_Conected = true
global.Stage_ = 0
global.Is_From_New = false
global.Client_ = null
global.MAX_Clients_ = 3//actual null, vai ser atrubuido o valor na funcao de pegar o quantos o usuario tem direito
global.Namet_Client_ = null

global.Funil_ = null
global.Namet_Funil_ = null

global.Template_ = null
global.Namet_Template_ = null

let Client_Not_Ready = null
const Client_Not_Ready_Aux = false

let ChatData_Not_Ready = true
const ChatData_Not_Ready_Aux = false
let Generate_Id_Not_Ready = true

global.Directory_Dir_Clients_ = path.join(Root_Dir, `Clients_`)
global.File_Data_Clients_ = `Client= .json`
global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client= .json`)

global.Directory_Dir_Chat_Data = path.join(Root_Dir, `Chat_Datas`)
global.File_Data_Chat_Data = `Chat_Data= .json`
global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data= .json`)

let Clientts_ = {}

// Erase_Schedule
global.Is_Schedule = null
let Is_Schedule = global.Is_Schedule
const timer_Schedule = {}
let Is_timer_On = false
let timer_Duration_Type_Schedule = 'null'
let timer_Duration_Schedule_Type = 0
let Previous_Math_Delay_Time_Erase_Schedule = 0
let timer_Duration_Schedule = Previous_Math_Delay_Time_Erase_Schedule * timer_Duration_Schedule_Type

// Test_Mode
global.Is_Test = null
let Is_Test = global.Is_Test
global.Is_Mode_Test = null
let Is_Mode_Test = global.Is_Mode_Test
let TestContact = null

let Counter_Id_Clients_ = []
let Chat_States = {}

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
async function commands(command, Is_Front_Back) {//muda pra na funcao de comando ter o is front back tendeu? e talves mudar pra switch case inves de if, talves n por causa dos start with mais ai mua a logica de reconhecer o comando talves sla hehe
    if (ChatData_Not_Ready) {
        if (!Is_Front_Back) {
            if (command === 'start') {
                if (Start_Callback) Start_Callback()
                return
            }
        }

        console.log(`>  ℹ️ commands not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>commands</strong> not Ready.`)
        return
    }
    try {
        if (global.Log_Callback) global.Log_Callback(`<strong>${command}</strong>`)
        
        if (Is_Front_Back) {
            /*if (command.length === 0) {
                console.log('>  ℹ️ Command not recognized.')
                if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Command</strong> <strong>not</strong> recognized.`)
                return
            } else if (command === 'start') {
                console.log(`> ⚠️  Bot already Initialized.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Bot</strong> already <strong>Initialized</strong>.`)
            }
            else if (command.startsWith('erase ')) {
                const query = command.substring(6).trim()
                if (query.length === 0) {
                    console.log(`> ⚠️  Specify a ChatName or ChatId to erase from ${global.File_Data_Chat_Data}, EXEMPLE:\nerase "number||name"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>ChatName or ChatId</strong> to <strong>erase</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>, <strong>EXEMPLE:\nerase "contact||name"</strong>`)
                } else {
                    let Is_From_End = true
                    await Erase_Chat_Data_By_Query(query, Is_From_End)
                }
            } else if (command === 'all erase') {
                let Is_From_End = true
                await Erase_All_Chat_Data(Is_From_End)
            } else if (command.startsWith('print ')) {
                const search = command.substring(6).trim()
                if (search.length === 0) {
                    console.log(`> ⚠️  Specify a ChatName or ChatId to search from ${global.File_Data_Chat_Data}, EXEMPLE:\nprint "number||name"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>ChatName or ChatId</strong> to <strong>erase</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>, <strong>EXEMPLE:\nprint "contact||name"</strong>`)
                } else {
                    await Search_Chat_Data_By_Search(search)
                }
            } else if (command === 'all print') {
                let isallerase = false
                await Print_All_Chat_Data(isallerase)
            } else if (command.startsWith('client erase ')) {
                const Clientt_ = command.substring(13).trim()
                if (Clientt_.length === 0) {
                    console.log(`> ⚠️  Specify a Client_ name to erase from ${global.Data_File_Clients_}, EXEMPLE:\nclient erase "client"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>Client_ name</strong> to <strong>erase</strong> ChatData from <strong>${global.Data_File_Clients_}</strong>, <strong>EXEMPLE:\nclient erase "client"</strong>`)
                } else {
                    let Is_From_End = true
                    await Erase_Client_(Is_From_End, Clientt_)
                }
            } else if (command.startsWith('destroy ')) {
                const Clientt_ = command.substring(8).trim()
                if (Clientt_.length === 0) {
                    console.log(`> ⚠️  Specify a Client_ name to destroy from ${global.Data_File_Clients_}, EXEMPLE:\ndestroy "client"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>Client_ name</strong> to <strong>destroy</strong> ChatData from <strong>${global.Data_File_Clients_}</strong>, <strong>EXEMPLE:\ndestroy "client"</strong>`)
                } else {
                    let Is_From_End = true
                    await Destroy_Client_(Is_From_End, Clientt_)
                }
            } else if (command.startsWith('reinitialize ')) {
                const Clientt_ = command.substring(13).trim()
                if (Clientt_.length === 0) {
                    console.log(`> ⚠️  Specify a Client_ name to reinitialize from ${global.Data_File_Clients_}, EXEMPLE:\nreinitialize "client"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>Client_ name</strong> to <strong>reinitialize</strong> ChatData from <strong>${global.Data_File_Clients_}</strong>, <strong>EXEMPLE:\nreinitialize "client"</strong>`)
                } else {
                    await Reinitialize_Client_(Clientt_)
                }
            } else if (command.startsWith('select ')) {
                const Clientt_ = command.substring(7).trim()
                if (Clientt_.length === 0) {
                    console.log(`> ⚠️  Specify a Client_ name to select from ${global.Data_File_Clients_}, EXEMPLE:\nselect "client"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>Client_ name</strong> to <strong>select</strong> ChatData from <strong>${global.Data_File_Clients_}</strong>, <strong>EXEMPLE:\nselect "client"</strong>`)
                } else {
                    await Select_Client_(Clientt_)
                }
            } else if (command === 'new client') {
                await New_Client_()
            } else {
                console.log('>  ℹ️ Command not recognized.')
                if (global.Log_Callback) global.Log_Callback(`>  ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Command</strong> <strong>not</strong> recognized.`)
            }*/

            console.log(`> ⚠️  ${command} Can not send commands from the BackEnd.`)
        } else {
            console.log(`${command}`)

            if (command.length === 0) {
                console.log('>  ℹ️ Command is empty.')
                if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Command</strong> is <strong>empty</strong>.`)
                return
            } else if (command === 'start') {
                console.log(`> ⚠️  ${global.Bot_Name || 'BOT'} already Initialized`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Bot_Name || 'BOT'}</strong> <strong>already</strong> Initialized`)
            } else if (command.startsWith('erase ')) {
                const query = command.substring(6).trim()
                if (query.length === 0) {
                    console.log(`> ⚠️  Specify a ChatName or ChatId to erase from ${global.File_Data_Chat_Data}, EXEMPLE:\nerase "number||name"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>ChatName of ChatId</strong> to <strong>erase</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>, <strong>EXEMPLE:\nerase "contact||name"</strong>`)
                } else {
                    if (Query_Erase_Callback) Query_Erase_Callback(query)
                }
            } else if (command === 'all erase') {
                if (All_Erase_Callback) All_Erase_Callback()
            } else if (command.startsWith('print ')) {
                const Search = command.substring(6).trim()
                if (Search.length === 0) {
                    console.log(`> ⚠️  Specify a ChatName or ChatId to search from ${global.File_Data_Chat_Data}, EXEMPLE:\nprint "number||name"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>ChatName of ChatId</strong> to <strong>erase</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>, <strong>EXEMPLE:\nprint "contact||name"</strong>`)
                } else {
                    if (Search_List_Callback) Search_List_Callback(Search)
                }
            } else if (command === 'all print') {
                if (List_Callback) List_Callback()
            } else if (command.startsWith('client erase ')) {
                const Clientt_ = command.substring(13).trim()
                if (Clientt_.length === 0) {
                    console.log(`> ⚠️  Specify a Client_ name to erase from ${global.Data_File_Clients_}, EXEMPLE:\nclient erase "client"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>Client_ name</strong> to <strong>erase</strong> ChatData from <strong>${global.Data_File_Clients_}</strong>, <strong>EXEMPLE:\nclient erase "client"</strong>`)
                } else {
                    if (Erase_Client_Callback) Erase_Client_Callback(Clientt_)
                }
            } else if (command.startsWith('destroy ')) {
                const Clientt_ = command.substring(8).trim()
                if (Clientt_.length === 0) {
                    console.log(`> ⚠️  Specify a Client_ name to destroy from ${global.Data_File_Clients_}, EXEMPLE:\ndestroy "client"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>Client_ name</strong> to <strong>destroy</strong> ChatData from <strong>${global.Data_File_Clients_}</strong>, <strong>EXEMPLE:\ndestroy "client"</strong>`)
                } else {
                    if (Destroy_Client_Callback) await Destroy_Client_Callback(Clientt_, true)
                }
            } else if (command.startsWith('reinitialize ')) {
                const Clientt_ = command.substring(13).trim()
                if (Clientt_.length === 0) {
                    console.log(`> ⚠️  Specify a Client_ name to reinitialize from ${global.Data_File_Clients_}, EXEMPLE:\nreinitialize "client"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>Client_ name</strong> to <strong>reinitialize</strong> ChatData from <strong>${global.Data_File_Clients_}</strong>, <strong>EXEMPLE:\nreinitialize "client"</strong>`)
                } else {
                    if (Reinitialize_Client_Callback) await Reinitialize_Client_Callback(Clientt_)
                }
            } else if (command.startsWith('select ')) {
                const Clientt_ = command.substring(7).trim()
                if (Clientt_.length === 0) {
                    console.log(`> ⚠️  Specify a Client_ name to select from ${global.Data_File_Clients_}, EXEMPLE:\nselect "client"`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Specify</strong> a <strong>Client_ name</strong> to <strong>select</strong> ChatData from <strong>${global.Data_File_Clients_}</strong>, <strong>EXEMPLE:\nselect "client"</strong>`)
                } else {
                    if (Select_Client_Callback) Select_Client_Callback(Clientt_)
                } 
            } else if (command === 'new client') {
                if (New_Client_Callback) New_Client_Callback()
            } else {
                console.log('>  ℹ️ Command not recognized.')
                if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Command</strong> <strong>not</strong> recognized.`)
            }
        }
    } catch (error) {
        console.error(`> ❌ ERROR commands: ${error}`)
    }
}

async function Change_Position_MSG(selectedId, toChangeFor) {
    try {
        const data = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const jsonData = JSON.parse(data)
        
        const selectedIndex = jsonData.findIndex(item => item.positionId === selectedId)
        const toChangeIndex = jsonData.findIndex(item => item.positionId === toChangeFor)

        const tempDataSelected = { ...jsonData[selectedIndex] }
        const tempDataToChange = { ...jsonData[toChangeIndex] }
        
        delete tempDataSelected.positionId
        delete tempDataToChange.positionId

        jsonData[selectedIndex] = {
            positionId: selectedId,
            ...tempDataToChange
        }

        jsonData[toChangeIndex] = {
            positionId: toChangeFor,
            ...tempDataSelected
        }

        await fs.writeFile(global.Data_File_Templates_, JSON.stringify(jsonData, null, 2), 'utf8')

        return { Sucess: true }
    } catch (error) {
        console.error(`> ❌ ERROR Change_Position_MSG: ${error}`)
        return { Sucess: false }
    }
}

async function Insert_Template_Front() {
    try {
        Counter_Id_Position_MSG = []
        const Template_Data = JSON.parse(fss.readFileSync(global.Data_File_Templates_, 'utf8'))
        Template_Data.forEach(Template => {
            if (Template.positionId !== undefined) {
                Counter_Id_Position_MSG.push(Template.positionId)
            }
        })
        //console.log(Counter_Id_Position_MSG)
        return { Sucess: true, jsonTemplate: Template_Data }
    } catch (error) {
        console.error(`> ❌ ERROR Insert_Template_Front: ${error}`)
        return { Sucess: false }
    }
}

async function Send_To_Funil(typeMSG, MSGType, positionId, delayType, delayData, templatetRebate, textareaData, fileType, fileData) {
    try {
        //console.log('na funcao: ', { typeMSG, MSGType, positionId, delayType, delayData, templatetRebate, textareaData, fileType })
        //console.log('arquivo na funcao: ', fileData)

        //let Data_ = [{  }]

        let existingData = [{  }]
        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        //console.log(fileContent)
        if (fileContent.trim() !== '') {
            try {
                existingData = JSON.parse(fileContent)
            } catch (jsonError) {
                console.error('Conteúdo malformado. Tentando normalizar...')
                const normalizedContent = fileContent
                    .replace(/,\s*]$/, ']')  // Remove vírgulas erradas no final
                    .replace(/,\s*}/g, '}')  // Remove vírgulas extras antes de chaves fechadas
                    .replace(/\n\s+/g, ' ')  // Remove quebras de linha e espaços extras
                    .slice(0, -1) 
                    .trim()

                try {
                    existingData = JSON.parse(normalizedContent)
                } catch (secondError) {
                    console.error('Falha ao normalizar o JSON: ', secondError)
                }
            }
        }

        let existingItem = existingData.find(item => item.positionId === positionId)
        let isDifferent = false
        if (existingItem) {
            switch (typeMSG) {
                case 1:
                    if (delayType === 'input') {
                        if (existingItem.delayData !== delayData) {
                            existingItem.typeMSG = typeMSG
                            existingItem.delayData = delayData
                            isDifferent = true
                        }
                    } else {
                        if (existingItem.delayType !== delayType) {
                            existingItem.typeMSG = typeMSG
                            existingItem.delayType = delayType
                            isDifferent = true
                        }
                    }
                    break;
                case 2:
                    switch (MSGType) {
                        case 'delay':
                            if (delayType === 'input') {
                                if (existingItem.delayData !== delayData) {
                                    existingItem.typeMSG = typeMSG
                                    existingItem.delayData = delayData
                                    isDifferent = true
                                }
                            } else {
                                if (existingItem.delayType !== delayType) {
                                    existingItem.typeMSG = typeMSG
                                    existingItem.delayType = delayType
                                    isDifferent = true
                                }
                            }       
                            break;
                        case 'textarea':
                            if (existingItem.textareaData !== textareaData) {
                                existingItem.typeMSG = typeMSG 
                                existingItem.textareaData = textareaData
                                isDifferent = true
                            }
                        break;
                    }
                    break;
                case 3:
                    switch (MSGType) {
                        case 'delay':
                            if (delayType === 'input') {
                                if (existingItem.delayData !== delayData) {
                                    existingItem.typeMSG = typeMSG
                                    existingItem.delayData = delayData
                                    isDifferent = true
                                }
                            } else {
                                if (existingItem.delayType !== delayType) {
                                    existingItem.typeMSG = typeMSG
                                    existingItem.delayType = delayType
                                    isDifferent = true
                                }
                            }       
                            break;
                        case 'textarea':
                            if (existingItem.textareaData !== textareaData) {
                                existingItem.typeMSG = typeMSG 
                                existingItem.textareaData = textareaData
                                isDifferent = true
                            }
                            break;
                        case 'file':
                            existingItem.typeMSG = typeMSG
                            //existingItem.delayType = 'none'
                            //existingItem.delayData = ''
                            switch (fileType) {
                                case 'audio':
                                    //existingItem.textareaData = null
                                    break;
                                default:
                                    //existingItem.textareaData = ''
                                    break;
                            }
                            if (existingItem.fileType !== fileType) {
                                existingItem.fileType = fileType
                                isDifferent = true
                            }
                            if (fileData) {
                                if (existingItem.fileData.originalname !== fileData.originalname || existingItem.fileData.mimetype !== fileData.mimetype || existingItem.fileData.buffer !== fileData.buffer || existingItem.fileData.size !== fileData.size) {
                                    existingItem.fileData = fileData = {
                                        originalname: fileData.originalname,
                                        mimetype: fileData.mimetype,
                                        buffer: fileData.buffer,
                                        size: fileData.size
                                    }
                                    isDifferent = true
                                }
                            } else {
                                existingItem.fileData = fileData = {
                                    originalname: '',
                                    mimetype: '',
                                    buffer: '',
                                    size: ''
                                }
                                isDifferent = true
                            }
                            
                            break;
                    }
                    break;
                case 4:
                    switch (MSGType) {
                        case 'delay':
                            if (delayType === 'input') {
                                if (existingItem.delayData !== delayData) {
                                    existingItem.typeMSG = typeMSG
                                    existingItem.delayData = delayData
                                    isDifferent = true
                                }
                            } else {
                                if (existingItem.delayType !== delayType) {
                                    existingItem.typeMSG = typeMSG
                                    existingItem.delayType = delayType
                                    isDifferent = true
                                }
                            }       
                            break;
                        case 'rebate':
                            existingItem.typeMSG = typeMSG
                            existingItem.templatetRebate = templatetRebate
                            isDifferent = true
                            break;
                    }
                    break;
            }
        } else {
            let newItem = { positionId }
            switch (typeMSG) {
                case 1:
                    if (delayType === 'input') {
                        newItem.typeMSG = typeMSG
                        newItem.delayType = delayType
                        newItem.delayData = delayData
                    } else {
                        newItem.typeMSG = typeMSG
                        newItem.delayType = delayType
                        newItem.delayData = delayData
                    }
                    break;
                case 2:
                    switch (MSGType) {
                        case 'delay':
                            if (delayType === 'input') {
                                newItem.typeMSG = typeMSG
                                newItem.delayType = delayType
                                newItem.delayData = delayData
                                newItem.textareaData = ''
                            } else {
                                newItem.typeMSG = typeMSG
                                newItem.delayType = delayType
                                newItem.delayData = delayData
                                newItem.textareaData = ''
                            }       
                            break;
                        case 'textarea':
                            newItem.typeMSG = typeMSG
                            newItem.delayType = 'none'
                            newItem.delayData = ''
                            newItem.textareaData = textareaData
                        break;
                    }
                    break;
                case 3:
                    switch (MSGType) {
                        case 'delay':
                            if (delayType === 'input') {
                                newItem.typeMSG = typeMSG
                                newItem.delayType = delayType
                                newItem.delayData = delayData
                            } else {
                                newItem.typeMSG = typeMSG
                                newItem.delayType = delayType
                                newItem.delayData = delayData
                            }       
                            break;
                        case 'textarea':
                            newItem.typeMSG = typeMSG
                            newItem.textareaData = textareaData
                            break;
                        case 'file':
                            newItem.typeMSG = typeMSG
                            newItem.delayType = 'none'
                            newItem.delayData = ''
                            switch (fileType) {
                                case 'audio':
                                    newItem.textareaData = null
                                    break;
                                default:
                                    newItem.textareaData = ''
                                    break;
                            }
                            newItem.fileType = fileType
                            newItem.fileData = {
                                originalname: '',
                                mimetype: '',
                                buffer: '',
                                size: ''
                            }
                            break;
                    }
                    break;
                case 4:
                    switch (MSGType) {
                        case 'delay':
                            if (delayType === 'input') {
                                newItem.typeMSG = typeMSG
                                newItem.delayType = delayType
                                newItem.delayData = delayData
                            } else {
                                newItem.typeMSG = typeMSG
                                newItem.delayType = delayType
                                newItem.delayData = delayData
                            }       
                            break;
                        case 'rebate':
                            newItem.typeMSG = typeMSG
                            newItem.delayType = delayType
                            newItem.delayData = delayData
                            newItem.templatetRebate = templatetRebate
                            break;
                    }
                    break;
            }

            isDifferent = true
            existingData.push(newItem)
            existingData.sort((a, b) => a.positionId - b.positionId)
        }
        
        if (isDifferent) {
            const jsonString = '[\n' + existingData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            await fs.writeFile(global.Data_File_Templates_, jsonString, 'utf8')
        }
    } catch (error) {
        console.error(`> ❌ ERROR Send_To_Funil: ${error}`)
    }
}

global.Directory_Dir_Funil = path.join(Root_Dir, `Funil`)
global.Directory_Dir_Funils_ = path.join(global.Directory_Dir_Funil, ``)
global.File_Data_Funils_ = ``

global.File_Data_Templates_ = `Template= .json`
global.Data_File_Templates_ = path.join(global.Directory_Dir_Funils_, `Template= .json`)

async function Erase_Template_(Is_From_End, Templatet_, Funilt_) { // quando for adicionar pra apagar o localauth, tem q apagar do objeto Clients_ tbm, tem que iniciar o client criar no caso ou se n mas estiver la que iniciou ent iniciar pra apagar ou n vai dar, sistema de apagar do json memo ja existe so pegar
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    }*/ 
    try {
        //Client_Not_Ready = true

        const Templates_ = JSON.parse(await fs.readFile(global.Data_File_Templates_, 'utf8'))
        const Dir_Templates_ = (await fs.access(`Funil\\${Funilt_}\\Template=${Templatet_}.json`, fs.constants.F_OK).then(() => true).catch(() => false))
        if (Templates_.length === 0 || null && Dir_Templates_ === false) {
            console.log(`> ⚠️  ${global.Data_File_Templates_}, Templates_(${Templatet_}), array(Templatets_[${Templatet_}]) is ALL empty, does not contain any data.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Data_File_Templates_}, Templates_(${Templatet_}), array(Templatets_[${Templatet_}])</strong> is <strong>ALL</strong> empty, does <strong>not</strong> <strong>contain</strong> any <strong>data</strong>.`)
            
            //Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: true, Is_Empty_Input: false, Not_Selected: false }
        }
        if (global.Template_ !== Templatet_) {
            console.log(`> ⚠️  The Template_ ${Templatet_} is to be erase it is not selected, the Template_ selected is ${global.Template_} so select ${Templatet_} to erase it.}`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>The Template_ <strong>${Templatet_}</strong> is to be <strong>erase</strong> it is <strong>not</strong> <strong>selected</strong>, the Template_ <strong>selected</strong> is <strong>${global.Template_}</strong> so <strong>select</strong> <strong>${Templatet_}</strong> to <strong>erase</strong> it.`)

            //Client_Not_Ready = false

            return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: true }
        }
        if (Templatet_.length === 0 || null) {
            console.log(`> ⚠️  No Template_ found by the valor received: ${Templatet_}.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>No</strong> Template_ <strong>found</strong> by the valor <strong>received: ${Templatet_}</strong>.`)
            
            //Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, Not_Selected: false }
        }

        let Erased_ = false
        if (Is_From_End) {
            console.log(`> ⚠️  Are you sure that you want to erase Template_ ${Templatet_} from ${global.File_Data_Templates_}?`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Are you <strong>sure</strong> that you <strong>want</strong> to <strong>erase</strong> Template_ <strong>${Templatet_}</strong> from <strong>${global.File_Data_Templates_}</strong>?`)
            const answer = await askForConfirmation(Templatet_)
            if (answer.toLowerCase() === 'y') {
                console.log(`>  ◌ Erasing Funil_ ${Templatet_} from ${global.File_Data_Templates_}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i>Erasing Funil_ <strong>${Templatet_}</strong> from <strong>${global.File_Data_Templates_}</strong>...`)
                
                fse.remove(`Funil\\${global.File_Data_Funils_}\\${global.File_Data_Templates_}`)
                await sleep(100)
            
                Erased_ = true
            } else if (answer.toLowerCase() === 'n') {
                console.log(`> ⚠️  Template_ ${Templatet_} from ${global.File_Data_Templates_}: DECLINED`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Funil_ <strong>${Templatet_}</strong> from <strong>${global.File_Data_Templates_}: DECLINED</strong>`)
                
                //Client_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
            } else {
                console.log(`> ⚠️  Template_ ${Templatet_} from ${global.File_Data_Templates_}: NOT Answered to erase`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Template_ <strong>${Templatet_}</strong> from <strong>${global.File_Data_Templates_}: NOT Answered to erase</strong>`)
                
                //Client_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
            }
            
        } else {
            console.log(`>  ◌ Erasing Template_ ${Templatet_} from ${global.File_Data_Templates_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Erasing</strong> Template_ <strong>${Templatet_}</strong> from <strong>${global.File_Data_Templates_}</strong>...`)
            
            fse.remove(`Funil\\${global.File_Data_Funils_}\\${global.File_Data_Templates_}`)
            await sleep(100)
            
            Erased_ = true
        }
        

        if (Erased_) {
            console.log(`> ✅ Template_ ${Templatet_} from ${global.File_Data_Templates_}: ERASED`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i>Template_ <strong>${Templatet_}</strong> from <strong>${global.File_Data_Templates_}: ERASED</strong>`)
            
            //Client_Not_Ready = false

            return { Sucess: true, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
        }
    } catch (error) {
        console.error(`> ❌ ERROR Erase_Template_ ${Templatet_}: ${error}`)
        
        //Client_Not_Ready = false
        
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    }
}
async function Select_Template_(Templatet_) {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        global.Template_ = Templatet_
        global.File_Data_Templates_ = `Template=${Templatet_}.json`
        global.Data_File_Templates_ = path.join(global.Directory_Dir_Funils_, `Template=${Templatet_}.json`)

        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)
        
        global.Is_Schedule = templateData[0].EraseSchedule
        Is_Schedule = global.Is_Schedule

        let traslatedDelayTypeEraseSchedule = 'null'
        let formatedDelayTypeDurarationEraseSchedule = 0
        switch (templateData[0].delayType) {
            case 'days':
                    traslatedDelayTypeEraseSchedule = 'Dias'
                    formatedDelayTypeDurarationEraseSchedule = 24 * 60 * 60 * 1000
                break;
            case 'hours':
                    traslatedDelayTypeEraseSchedule = 'Horas'
                    formatedDelayTypeDurarationEraseSchedule = 60 * 60 * 1000
                break;
            case 'minutes':
                    traslatedDelayTypeEraseSchedule = 'Minutos'
                    formatedDelayTypeDurarationEraseSchedule = 60 * 1000
                break;
            case 'seconds':
                    traslatedDelayTypeEraseSchedule = 'Segundos'
                    formatedDelayTypeDurarationEraseSchedule = 1000
                break;
        }
        timer_Duration_Type_Schedule = traslatedDelayTypeEraseSchedule
        timer_Duration_Schedule_Type = formatedDelayTypeDurarationEraseSchedule
        timer_Duration_Schedule = Number(templateData[0].delayData) * timer_Duration_Schedule_Type

        global.Is_Test = templateData[0].TestMode
        Is_Test = global.Is_Test
        global.Is_Mode_Test = templateData[0].ReceiveMSG
        Is_Mode_Test = global.Is_Mode_Test

        TestContact = templateData[0].TestContact

        //global.File_Data_Chat_Data = `Chat_Data=${Funilt_}.json`
        //global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Funilt_}.json`)

        //global.File_Data_Clients_ = `Client=${Funilt_}.json`
        //global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client=${Funilt_}.json`)

        console.log(`>  ℹ️ Template_ ${Templatet_} selected.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Template_ <strong>${Templatet_}</strong> <strong>selected</strong>.`)
            
        //Client_Not_Ready = false
    } catch (error) {
        console.error(`> ❌ Select_Template_ ${Templatet_}: ${error}`)
        //Client_Not_Ready = false
    }
}

async function Schedule_Erase_Chat_Data(chatId, time, Clientt_) {
    if (ChatData_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return
    } 
    try {
        Is_timer_On = true
        timer_Schedule[chatId] = setTimeout(async () => {
                //let Is_From_End = false
                //Erase_Chat_Data_By_Query(chatId, Is_From_End)
    
                /*const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
        
                //const Normalized_chatId = chatId.trim().toLowerCase()
                const Normalized_chatId = chatId
                const chatId_Entries = ChatData.filter(({chatId, name}) => 
                    //chatId.trim().toLowerCase() === (Normalized_chatId) ||
                    chatId === (Normalized_chatId) ||
                    name.trim().toLowerCase() === (Normalized_chatId)  
                )

                const Updated_ChatData = ChatData.filter(item =>
                    !chatId_Entries.some(Query_Entry =>
                        Query_Entry.chatId === item.chatId && Query_Entry.name === item.name
                    )
                )

                const jsonString = '[\n' + Updated_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                await fs.writeFile(`Chat_Data=${Clientt_}.json`, jsonString, 'utf8')*/

                
                let Is_From_End = false
                await Erase_Chat_Data_By_Query(String(chatId), Is_From_End)
                let Is_From_All_Erase = false
                if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase, null)
                await sleep(100)
                console.log(`> 🚮 Timer FINALIZED ChatData for ${chatId} ERASED after ${time / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} from ${global.File_Data_Chat_Data}.`)
                if (global.Log_Callback) global.Log_Callback(`> 🚮 <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>FINALIZED</strong> ChatData for <strong>${chatId}</strong> <strong>ERASED</strong> <strong>after ${time / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule}</strong> from <strong>${global.File_Data_Chat_Data}</strong>.`)
                    
                delete timer_Schedule[chatId]
        }, time)
    } catch (error) {
        console.error(`> ❌ ERROR Schedule_Erase_Chat_Data ${Clientt_}: ${error}`)
        ChatData_Not_Ready = false
    }
}
async function Status_Erase_Schedule(Templatet_) {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)
        const eraseScheduleIs = templateData[0]?.EraseSchedule;

        //Client_Not_Ready = false
        return eraseScheduleIs
    } catch (error) {
        console.error(`> ❌ Status_Erase_Schedule ${Templatet_}: ${error}`)
        return eraseScheduleIs 
        //Client_Not_Ready = false
    }
}
async function Set_Erase_Schedule(eraseScheduleIs) {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)
        templateData[0].EraseSchedule = eraseScheduleIs
        const jsonString = '[\n' + templateData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        await fs.writeFile(global.Data_File_Templates_, jsonString, 'utf8')
        
        global.Is_Schedule = eraseScheduleIs
        Is_Schedule = global.Is_Schedule

        console.log(`>  ℹ️ Set (${eraseScheduleIs}) Erase Schedule off Template_ ${global.Template_}.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><stronge>Definido</stronge> (<strong>${eraseScheduleIs}</strong>) apagamento agendado do Template_ <strong>${global.Template_}</strong>.`)

        //Client_Not_Ready = false
        return { Sucess: true }
    } catch (error) {
        console.error(`> ❌ Set_Erase_Schedule: ${error}`)
        return { Sucess: false } 
        //Client_Not_Ready = false
    }
}
async function Delay_Info_Erase_Schedule() {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)

        //Client_Not_Ready = false
        return { delayType: templateData[0].delayType, delayData: templateData[0].delayData }
    } catch (error) {
        console.error(`> ❌ Delay_Info_Erase_Schedule: ${error}`)
        return { delayType: null, delayData: null } 
        //Client_Not_Ready = false
    }
}
async function Send_To_Template_Erase_Schedule(typeDelay, delayType, delayData) {
    try {
        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)

        let To_String_DelayType = null
        let formatedDelayTypeDurarationEraseSchedule = null
        switch (typeDelay) {
            case 'input':
                templateData[0].delayData = delayData

                Previous_Math_Delay_Time_Erase_Schedule = Number(delayData)
                timer_Duration_Schedule = Number(delayData) * timer_Duration_Schedule_Type
                break;
            case 'select':
                switch (delayType) {
                    case 0:
                        To_String_DelayType = 'none'
                        formatedDelayTypeDurarationEraseSchedule = ''
                        break;
                    case 1:
                        To_String_DelayType = 'seconds'
                        formatedDelayTypeDurarationEraseSchedule = 1000
                        break;
                    case 2:
                        To_String_DelayType = 'minutes'
                        formatedDelayTypeDurarationEraseSchedule = 60 * 1000
                        break;
                    case 3:
                        To_String_DelayType = 'hours'
                        formatedDelayTypeDurarationEraseSchedule = 60 * 60 * 1000
                        break;
                    case 4:
                        To_String_DelayType = 'days'
                        formatedDelayTypeDurarationEraseSchedule = 24 * 60 * 60 * 1000
                        break;
                }
                templateData[0].delayType = To_String_DelayType

                timer_Duration_Type_Schedule = To_String_DelayType
                timer_Duration_Schedule_Type = formatedDelayTypeDurarationEraseSchedule
                timer_Duration_Schedule = Previous_Math_Delay_Time_Erase_Schedule * timer_Duration_Schedule_Type
                break;
        }
        const jsonString = '[\n' + templateData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        await fs.writeFile(global.Data_File_Templates_, jsonString, 'utf8')
    } catch (error) {
        console.error(`> ❌ ERROR Send_To_Template_Erase_Schedule: ${error}`)
    }
}

async function Status_Test_Mode(Templatet_) {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)
        const testModeIs = templateData[0]?.TestMode
        const ReceiveMSG = templateData[0]?.ReceiveMSG

        //Client_Not_Ready = false
        return { testModeIs, ReceiveMSG }
    } catch (error) {
        console.error(`> ❌ Status_Test_Mode ${Templatet_}: ${error}`)
        return eraseScheduleIs 
        //Client_Not_Ready = false
    }
}
async function Set_Test_Mode(testModeIs) {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)
        templateData[0].TestMode = testModeIs
        const jsonString = '[\n' + templateData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        await fs.writeFile(global.Data_File_Templates_, jsonString, 'utf8')
        
        global.Is_Test = testModeIs
        Is_Test = global.Is_Test

        console.log(`>  ℹ️ Set (${testModeIs}) Test mode off Template_ ${global.Template_}.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><stronge>Definido</stronge> (<strong>${testModeIs}</strong>) modo teste do Template_ <strong>${global.Template_}</strong>.`)

        //Client_Not_Ready = false
        return { Sucess: true }
    } catch (error) {
        console.error(`> ❌ Set_Test_Mode: ${error}`)
        return { Sucess: false } 
        //Client_Not_Ready = false
    }
}
async function Set_Receive_MSG(ReceiveMSG) {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)
        templateData[0].ReceiveMSG = ReceiveMSG
        const jsonString = '[\n' + templateData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        await fs.writeFile(global.Data_File_Templates_, jsonString, 'utf8')
        
        global.Is_Mode_Test = ReceiveMSG
        Is_Mode_Test = global.Is_Mode_Test

        console.log(`>  ℹ️ Set (${ReceiveMSG}) Receive MSG off Template_ ${global.Template_}.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><stronge>Definido</stronge> (<strong>${ReceiveMSG}</strong>) receber MSG do Template_ <strong>${global.Template_}</strong>.`)

        //Client_Not_Ready = false
        return { Sucess: true }
    } catch (error) {
        console.error(`> ❌ Set_Receive_MSG: ${error}`)
        return { Sucess: false } 
        //Client_Not_Ready = false
    }
}
async function Send_To_Template_Test_Mode(testContact) {
    try {
        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)

        templateData[0].TestContact = Number(testContact)
        TestContact = Number(testContact)
        
        const jsonString = '[\n' + templateData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        await fs.writeFile(global.Data_File_Templates_, jsonString, 'utf8')
    } catch (error) {
        console.error(`> ❌ ERROR Send_To_Template_Test_Mode: ${error}`)
    }
}
async function Contact_Info_Test_Mode() {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)

        //Client_Not_Ready = false
        return { testContact: templateData[0].TestContact }
    } catch (error) {
        console.error(`> ❌ Contact_Info_Test_Mode: ${error}`)
        return { testContact: null } 
        //Client_Not_Ready = false
    }
}
async function Initiate_Test_Mode() {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        const Client_ = Clientts_[global.Client_]?.instance
        //Client_.sendMessage('5517991696389@s.whatsapp.net', 'oi', 'utf8')

        const fileContent = await fs.readFile(global.Data_File_Templates_, 'utf8')
        const templateData = JSON.parse(fileContent)

        const msg = String(templateData[0].TestContact) + '@s.whatsapp.net'
        const chat = await Client_.getChatById(String(templateData[0].TestContact) + '@s.whatsapp.net')
        const contact = await chat.getContact()
        const chatId = templateData[0].TestContact
        const name = chat.name || contact.pushname || contact.verifiedName || 'Unknown'
        const Chat_Type = '(TM)'
        const Chat_Action = '(AN)'
        const Content_ = '💬❓ ' + '(AN)'
        /*console.log(msg)
        console.log(chat)
        console.log(contact)
        console.log(chatId)
        console.log(name)
        console.log(Chat_Type)
        console.log(Chat_Action)
        console.log(Content_)*/

        if (!Chat_States[chatId]) {
            Chat_States[chatId] = {
                Is_MSG_Initiate: true,
                Is_MSG_Started: false,
                Cancel_Promise: false, 
                Promise_: null,
                Timer_Sleep: null,
            }
        }

        const jsonString = await fs.readFile(global.Data_File_Chat_Data, 'utf8')
        let ChatData = JSON.parse(jsonString)
        const existingEntry = ChatData.find(item => item.chatId === chatId)
    
        if (existingEntry) {
            if (existingEntry.name !== name) {
                let isallerase = false
                await Save_Chat_Data(chatId, name, global.Client_, isallerase)

                delete Chat_States[chatId]
                return
            } else {
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
            await Save_Chat_Data(chatId, name, global.Client_, isallerase)
        
            Chat_States[chatId].Is_MSG_Initiate = false
            let Mode_ = 1
            await Funil_(msg, chat, chatId, name, Chat_Type, Chat_Action, Content_, Mode_)
        }

    } catch (error) {
        console.error(`> ❌ Initiate_Test_Mode: ${error}`) 
        //Client_Not_Ready = false
    }
}

async function Insert_Exponecial_Position_Template_(arrayIdNameTemplates_, isNew) {
    try {
        let isFirstUndefined = false
        let idNumberTemplate_DivAdjacent = null
        for (let i = 0; i < arrayIdNameTemplates_.length; i++) {
            if (Number(arrayIdNameTemplates_[0].Template_Id) !== 1) {
                isFirstUndefined = true
                idNumberTemplate_DivAdjacent = `_${Number(arrayIdNameTemplates_[0].Template_Id)}_${arrayIdNameTemplates_[0].Template_Name}_`
                break
            } 
            const currentNumber = Number(arrayIdNameTemplates_[i].Template_Id)
            let nextNumber = null
            if (i+1 < arrayIdNameTemplates_.length) {
                nextNumber = Number(arrayIdNameTemplates_[i+1].Template_Id)
            } else {
                nextNumber = undefined
            }
            if (isNew) {//essa solucao pode ser preguicosa sla mas funciona
                if (nextNumber !== undefined) {
                    if (currentNumber !== nextNumber-1) {
                        idNumberTemplate_DivAdjacent = `_${Number(arrayIdNameTemplates_[currentNumber-1].Template_Id)}_${arrayIdNameTemplates_[currentNumber-1].Template_Name}_`
                        break
                    }
                } 
            }
            idNumberFunil_DivAdjacent = `_${currentNumber}_${arrayIdNameTemplates_[i].Template_Name}_`
        }

        return { idNumberTemplate_DivAdjacent: idNumberTemplate_DivAdjacent, isFirstUndefined: isFirstUndefined }
    } catch (error) {
        console.error(`> ❌ ERROR Insert_Exponecial_Position_Template_: ${error}`)
        return { idNumberTemplate_DivAdjacent: null, isFirstUndefined: null }
    }
}
async function Dir_Templates_() {
    try {
        const jsons = await fs.readdir(global.Directory_Dir_Funils_)
        let Counter_Id_Templates_ = []

        for (const file of jsons) {
            if (path.extname(file) === '.json') {
                const filePath = path.join(global.Directory_Dir_Funils_, file)
                const data = await fs.readFile(filePath, 'utf8')
                const json = JSON.parse(data)

                json.forEach(item => {
                    if (item.Templatet_) {
                        const match = Number(item.Templatet_.split('_')[1])
                        if (match) {
                            Counter_Id_Templates_.push(Number(match))
                        }
                    }
                })
            }
        }
        return Counter_Id_Templates_
    } catch (error) {
        console.error(`> ❌ ERROR Dir_Templates_: ${error}`)
        return []
    }
}
async function Generate_Template_Id() {
    /*if (Generate_Id_Not_Ready) {
        console.log('>  ℹ️ Generate_Client_Id not Ready.')
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Generate_Client_Id</strong> not Ready.`)
        return null
    }*/
       try {
        //Generate_Id_Not_Ready = true
        const Counter_Id_Templates_ = await Dir_Templates_()

        let Id_Template_ = null
        let Counter_Templates_ = 1
        let i = false
        while (!i) {
            if (Counter_Id_Templates_[Counter_Templates_-1] === undefined) {
                Id_Template_ = Counter_Templates_
                Counter_Id_Templates_.push(Id_Template_)

                i = true
            } else {
                if (Counter_Templates_ !== Counter_Id_Templates_[Counter_Templates_-1]) {
                    Id_Template_ = Counter_Templates_
                    Counter_Id_Templates_.splice(Counter_Templates_-1, 0, Id_Template_)
                    
                    i = true
                } else {
                    Counter_Templates_++
                }
            }
        }
        return Id_Template_
    } catch (error) {
        console.error(`> ❌ ERROR Generate_Template_Id: ${error}`)
        return null
    }
}
async function New_Template_() {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ New_Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>New_Client_</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const Template_Name = await Set_Template_Name(true)
        const Id_Template_ = await Generate_Template_Id()
        const Templatet_ = `_${Id_Template_}_${Template_Name}_`

        global.File_Data_Templates_ = `Template=${Templatet_}.json`
        global.Data_File_Templates_ = path.join(global.Directory_Dir_Funils_, `Template=${Templatet_}.json`)
        //const filesDir = path.join(global.Directory_Dir_Funils_, 'files')
        
        const New_Template_ = [{ Templatet_, EraseSchedule: false, delayType: 'days', delayData: '7', TestMode: false, ReceiveMSG: true, TestContact: null }]
        const jsonString = '[\n' + New_Template_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        await fs.writeFile(global.Data_File_Templates_, jsonString, 'utf8')
        //await fs.mkdir(filesDir, { recursive: true })

        const Directories_ = await List_Directories(`Funil\\${global.Funil_}`)//adiciona essa logica de organizar a ordem das dir pro dir do client e chat data tbm e tals nhe

        const Sorted_Directories_ = [...Directories_].sort((a, b) => {
            const numA = parseInt(a.split('_')[1], 10)
            const numB = parseInt(b.split('_')[1], 10)
            return numA - numB
        })

        const isEqual = JSON.stringify(Directories_) === JSON.stringify(Sorted_Directories_)
        if (!isEqual) {
            let Temp_Directories_ = []

            for (let i = 0; i < Sorted_Directories_.length; i++) {
                const sortedPath = path.join(global.Directory_Dir_Funils_, `Template=_${Sorted_Directories_[i].split('_')[1]}_${Sorted_Directories_[i].split('_')[2]}_temp_.json`)
            
                await fs.writeFile(sortedPath, '[\n\n]')
                Temp_Directories_.push(`Template=_${Directories_[i].split('_')[1]}_${Directories_[i].split('_')[2]}_temp_.json`)
            }

            for (let i = 0; i < Directories_.length; i++) {
                const originalPath = path.join(global.Directory_Dir_Funils_, Directories_[i])
                const tempPath = path.join(global.Directory_Dir_Funils_, Temp_Directories_[i])
            
                const fileContent = await fs.readFile(originalPath, 'utf8')
                const templateData = JSON.parse(fileContent)

                const New_Template_ = templateData
                const jsonString = '[\n' + New_Template_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                await fs.writeFile(tempPath, jsonString, 'utf8')
            }
            
            for (let i = 0; i < Directories_.length; i++) {
                const originalPath = path.join(global.Directory_Dir_Funils_, Directories_[i])
            
                await fse.rm(originalPath, { recursive: true, force: true })
            }
            
            for (let i = 0; i < Temp_Directories_.length; i++) {
                const tempPath = path.join(global.Directory_Dir_Funils_, Temp_Directories_[i])
                const newPath = path.join(global.Directory_Dir_Funils_, `Template=_${Temp_Directories_[i].split('_')[1]}_${Temp_Directories_[i].split('_')[2]}_.json`)
            
                await fse.rename(tempPath, newPath)
            }
        }

        //const Directories_2 = await List_Directories(`Funil\\${global.Funil_}`)

        return { Sucess: true, Template_: Templatet_ }
    } catch (error) {
        console.error(`> ❌ New_Template_: ${error}`)
        return { Sucess: false, Template_: Templatet_ }
        //Client_Not_Ready = false
    }
}
async function Set_Template_Name(isNew) {
    //console.log(Client_Not_Ready)
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ New_Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>New_Client_</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true
        if (Set_Template_Name_Callback) await Set_Template_Name_Callback(isNew)

        return global.Namet_Template_
    } catch (error) {
        console.error(`> ❌ Set_Template_Name: ${error}`)
        //Client_Not_Ready = false
    }
}
async function Rename_Template_(Templatet_) {
    //console.log(Client_Not_Ready)
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ New_Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>New_Client_</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const Template_Id_ = Templatet_.split('_')[1]
        
        const Template_Name = await Set_Template_Name(false)

        global.Template_ = Templatet_
        global.Data_File_Templates_ = path.join(global.Directory_Dir_Funils_, `Template=${Templatet_}.json`)
        global.File_Data_Templates_ = `Template=${Templatet_}.json`

        await fse.rename(global.Data_File_Templates_, path.join(global.Directory_Dir_Funils_, `Template=_${Template_Id_}_${Template_Name}_.json`))

        return { Sucess: true, templatet_: `_${Template_Id_}_${Template_Name}_` }
    } catch (error) {
        console.error(`> ❌ Rename_Template_: ${error}`)
        //Client_Not_Ready = false
    }
}

async function Erase_Funil_(Is_From_End, Funilt_) { // quando for adicionar pra apagar o localauth, tem q apagar do objeto Clients_ tbm, tem que iniciar o client criar no caso ou se n mas estiver la que iniciou ent iniciar pra apagar ou n vai dar, sistema de apagar do json memo ja existe so pegar
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    }*/ 
    try {
        //Client_Not_Ready = true

        const Funils_ = await fs.readdir(global.Directory_Dir_Funil)
        //const Dir_Funils_ = (await fs.access(`Funils_\\Funil=${Funilt_}.json`, fs.constants.F_OK).then(() => true).catch(() => false))
        if (Funils_.length === 0 || null) {//&& Dir_Funils_ === false) {
            console.log(`> ⚠️  ${global.Directory_Dir_Funils_}, Funils_(${Funilt_}), array(Funilts_[${Funilt_}]) is ALL empty, does not contain any data.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Directory_Dir_Funils_}, Funils_(${Funilt_}), array(Funilts_[${Funilt_}])</strong> is <strong>ALL</strong> empty, does <strong>not</strong> <strong>contain</strong> any <strong>data</strong>.`)
            
            //Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: true, Is_Empty_Input: false, Not_Selected: false }
        }
        if (global.Funil_ !== Funilt_) {
            console.log(`> ⚠️  The Funil_ ${Funilt_} is to be erase it is not selected, the Funil_ selected is ${global.Funil_} so select ${Funilt_} to erase it.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>The Funil_ <strong>${Funilt_}</strong> is to be <strong>erase</strong> it is <strong>not</strong> <strong>selected</strong>, the Funil_ <strong>selected</strong> is <strong>${global.Funil_}</strong> so <strong>select</strong> <strong>${Funilt_}</strong> to <strong>erase</strong> it.`)

            //Client_Not_Ready = false

            return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: true }
        }
        if (Funilt_.length === 0 || null) {
            console.log(`> ⚠️  No Funil_ found by the valor received: ${Funilt_}.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>No</strong> Funil_ <strong>found</strong> by the valor <strong>received: ${Funilt_}</strong>.`)
            
            //Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, Not_Selected: false }
        }

        let Erased_ = false
        if (Is_From_End) {
            console.log(`> ⚠️  Are you sure that you want to erase Funil ${Funilt_} from ${global.File_Data_Funils_}?`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Are you <strong>sure</strong> that you <strong>want</strong> to <strong>erase</strong> Funil_ <strong>${Funilt_}</strong> from <strong>${global.File_Data_Funils_}</strong>?`)
            const answer = await askForConfirmation(Funilt_)
            if (answer.toLowerCase() === 'y') {
                console.log(`>  ◌ Erasing Funil_ ${Funilt_} from ${global.File_Data_Funils_}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i>Erasing Funil_ <strong>${Funilt_}</strong> from <strong>${global.File_Data_Funils_}</strong>...`)
                
                fse.remove(`Funil\\${global.File_Data_Funils_}`)
                await sleep(100)
                
                Erased_ = true
            } else if (answer.toLowerCase() === 'n') {
                console.log(`> ⚠️  Funil_ ${Funilt_} from ${global.File_Data_Funils_}: DECLINED`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Funil_ <strong>${Funilt_}</strong> from <strong>${global.File_Data_Funils_}: DECLINED</strong>`)
                
                //Client_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
            } else {
                console.log(`> ⚠️  Funil_ ${Funilt_} from ${global.File_Data_Funils_}: NOT Answered to erase`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Funil_ <strong>${Funilt_}</strong> from <strong>${global.File_Data_Funils_}: NOT Answered to erase</strong>`)
                
                //Client_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
            }
            
        } else {
            console.log(`>  ◌ Erasing Funil_ ${Funilt_} from ${global.File_Data_Funils_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Erasing</strong> Funil_ <strong>${Funilt_}</strong> from <strong>${global.File_Data_Funils_}</strong>...`)
            
            fse.remove(`Funil\\${global.File_Data_Funils_}`)
            await sleep(100)
            
            Erased_ = true
        }
        

        if (Erased_) {
            console.log(`> ✅ Funil_ ${Funilt_} from ${global.File_Data_Funils_}: ERASED`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i>Funil_ <strong>${Funilt_}</strong> from <strong>${global.File_Data_Funils_}: ERASED</strong>`)
            
            //Client_Not_Ready = false

            return { Sucess: true, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
        }
    } catch (error) {
        console.error(`> ❌ ERROR Erase_Funil_ ${Funilt_}: ${error}`)
        
        //Client_Not_Ready = false
        
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    }
}
async function Select_Funil_(Funilt_) {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Funilt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Funilt_}</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        global.Funil_ = Funilt_
        global.Directory_Dir_Funils_ = path.join(global.Directory_Dir_Funil, `${Funilt_}`)
        global.File_Data_Funils_ = `${Funilt_}`

        //global.File_Data_Chat_Data = `Chat_Data=${Funilt_}.json`
        //global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Funilt_}.json`)

        //global.File_Data_Clients_ = `Client=${Funilt_}.json`
        //global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client=${Funilt_}.json`)

        console.log(`>  ℹ️ Funil_ ${Funilt_} selected.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Funil_ <strong>${Funilt_}</strong> <strong>selected</strong>.`)
            
        //Client_Not_Ready = false
    } catch (error) {
        console.error(`> ❌ Select_Funil_ ${Funilt_}: ${error}`)
        //Client_Not_Ready = false
    }
}
async function Insert_Exponecial_Position_Funil_(arrayIdNameFunils_, isNew) {
    try {
        let isFirstUndefined = false
        let idNumberFunil_DivAdjacent = null
        for (let i = 0; i < arrayIdNameFunils_.length; i++) {
            if (Number(arrayIdNameFunils_[0].Funil_Id) !== 1) {
                isFirstUndefined = true
                idNumberFunil_DivAdjacent = `_${Number(arrayIdNameFunils_[0].Funil_Id)}_${arrayIdNameFunils_[0].Funil_Name}_`
                break
            } 
            const currentNumber = Number(arrayIdNameFunils_[i].Funil_Id)
            let nextNumber = null
            if (i+1 < arrayIdNameFunils_.length) {
                nextNumber = Number(arrayIdNameFunils_[i+1].Funil_Id)
            } else {
                nextNumber = undefined
            }

            if (isNew) {//essa solucao pode ser preguicosa sla mas funciona
                if (nextNumber !== undefined) {
                    if (currentNumber !== nextNumber-1) {
                        idNumberFunil_DivAdjacent = `_${Number(arrayIdNameFunils_[currentNumber-1].Funil_Id)}_${arrayIdNameFunils_[currentNumber-1].Funil_Name}_`
                        break
                    }
                }
            }

            idNumberFunil_DivAdjacent = `_${currentNumber}_${arrayIdNameFunils_[i].Funil_Name}_`
        }

        return { idNumberFunil_DivAdjacent: idNumberFunil_DivAdjacent, isFirstUndefined: isFirstUndefined }
    } catch (error) {
        console.error(`> ❌ ERROR Insert_Exponecial_Position_Funil_: ${error}`)
        return { idNumberFunil_DivAdjacent: null, isFirstUndefined: null }
    }
}
async function Dir_Funils_() {
    try {
        const jsons = await fs.readdir(global.Directory_Dir_Funil)
        let Counter_Id_Funils_ = []

        jsons.forEach(item => {
            if (item) {
                const match = Number(item.split('_')[1])
                if (match) {
                    Counter_Id_Funils_.push(Number(match))
                }
            }
        })
        return Counter_Id_Funils_
    } catch (error) {
        console.error(`> ❌ ERROR Dir_Funils_: ${error}`)
        return []
    }
}
async function Generate_Funil_Id() {
    /*if (Generate_Id_Not_Ready) {
        console.log('>  ℹ️ Generate_Client_Id not Ready.')
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Generate_Client_Id</strong> not Ready.`)
        return null
    }*/
       try {
        //Generate_Id_Not_Ready = true
        const Counter_Id_Funils_ = await Dir_Funils_()

        let Id_Funil_ = null
        let Counter_Funils_ = 1
        let i = false
        while (!i) {
            if (Counter_Id_Funils_[Counter_Funils_-1] === undefined) {
                Id_Funil_ = Counter_Funils_
                Counter_Id_Funils_.push(Id_Funil_)

                i = true
            } else {
                if (Counter_Funils_ !== Counter_Id_Funils_[Counter_Funils_-1]) {
                    Id_Funil_ = Counter_Funils_
                    Counter_Id_Funils_.splice(Counter_Funils_-1, 0, Id_Funil_)
                    
                    i = true
                } else {
                    Counter_Funils_++
                }
            }
        }
        return Id_Funil_
    } catch (error) {
        console.error(`> ❌ ERROR Generate_Funil_Id: ${error}`)
        return null
    }
}
async function New_Funil_() {
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ New_Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>New_Client_</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const Funil_Name = await Set_Funil_Name(true)
        const Id_Funil_ = await Generate_Funil_Id()
        const Funilt_ = `_${Id_Funil_}_${Funil_Name}_`

        global.Directory_Dir_Funils_ = path.join(global.Directory_Dir_Funil, `${Funilt_}`)
        
        global.File_Data_Funils_ = `${Funilt_}`

        //console.log(path.join(global.Directory_Dir_Funil, `${Funilt_}`), 'pica')

        await fs.mkdir(global.Directory_Dir_Funils_, { recursive: true } )
        
        const Directories_ = await List_Directories('Funil')

        const Sorted_Directories_ = [...Directories_].sort((a, b) => {
            const numA = parseInt(a.split('_')[1], 10)
            const numB = parseInt(b.split('_')[1], 10)
            return numA - numB
        })

        const isEqual = JSON.stringify(Directories_) === JSON.stringify(Sorted_Directories_)
        if (!isEqual) {
            let Temp_Directories_ = []

            for (let i = 0; i < Sorted_Directories_.length; i++) {
                const sortedPath = path.join(global.Directory_Dir_Funil, `_${Sorted_Directories_[i].split('_')[1]}_${Sorted_Directories_[i].split('_')[2]}_temp_`)
            
                await fse.mkdir(sortedPath)
                Temp_Directories_.push(`_${Directories_[i].split('_')[1]}_${Directories_[i].split('_')[2]}_temp_`)
            }

            for (let i = 0; i < Directories_.length; i++) {
                const originalPath = path.join(global.Directory_Dir_Funil, Directories_[i])
                const tempPath = path.join(global.Directory_Dir_Funil, Temp_Directories_[i])
            
                const files = await fse.readdir(originalPath)
        
                for (const file of files) {
                    const originalFilePath = path.join(originalPath, file)
                    const tempFilePath = path.join(tempPath, file)
        
                    await fse.move(originalFilePath, tempFilePath)
                }
            }

            for (let i = 0; i < Directories_.length; i++) {
                const originalPath = path.join(global.Directory_Dir_Funil, Directories_[i])
            
                await fse.rm(originalPath, { recursive: true, force: true })
            }

            for (let i = 0; i < Temp_Directories_.length; i++) {
                const tempPath = path.join(global.Directory_Dir_Funil, Temp_Directories_[i])
                const newPath = path.join(global.Directory_Dir_Funil, `_${Temp_Directories_[i].split('_')[1]}_${Temp_Directories_[i].split('_')[2]}_`)
            
                await fse.rename(tempPath, newPath)
            }
        }

        return { Sucess: true, Funil_: Funilt_ }
    } catch (error) {
        console.error(`> ❌ New_Funil: ${error}`)
        return { Sucess: false, Funil_: Funilt_ }
        //Client_Not_Ready = false
    }
}
async function Set_Funil_Name(isNew) {
    //console.log(Client_Not_Ready)
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ New_Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>New_Client_</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true
        if (Set_Funil_Name_Callback) await Set_Funil_Name_Callback(isNew)

        return global.Namet_Funil_
    } catch (error) {
        console.error(`> ❌ Set_Funil_Name: ${error}`)
        //Client_Not_Ready = false
    }
}
async function Rename_Funil_(Funilt_) {
    //console.log(Client_Not_Ready)
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ New_Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>New_Client_</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        const Funil_Id_ = Funilt_.split('_')[1]
        
        const Funil_Name = await Set_Funil_Name(false)

        global.Funil_ = Funilt_
        global.Directory_Dir_Funils_ = path.join(global.Directory_Dir_Funil, `${Funilt_}`)
        global.File_Data_Funils_ = `${Funilt_}`

        await fse.rename(global.Directory_Dir_Funils_, path.join(global.Directory_Dir_Funil, `_${Funil_Id_}_${Funil_Name}_`))

        return { Sucess: true, funilt_: `_${Funil_Id_}_${Funil_Name}_` }
    } catch (error) {
        console.error(`> ❌ Rename_Funil_: ${error}`)
        //Client_Not_Ready = false
    }
}

async function Insert_Exponecial_Position_MSG(arrayIdNumberPosition) {
    try {
        let isFirstUndefined = false
        let idNumberPositionDivAdjacent = null
        for (let i = 0; i < arrayIdNumberPosition.length; i++) {
            if (arrayIdNumberPosition[0] !== 1) {
                isFirstUndefined = true
                idNumberPositionDivAdjacent = `conteinerFunilMSG${arrayIdNumberPosition[0]}`
                break
            } 
            const currentNumber = arrayIdNumberPosition[i]
            let nextNumber = null
            if (i+1 < arrayIdNumberPosition.length) {
                    nextNumber = arrayIdNumberPosition[i+1]
                } else {
                    nextNumber = undefined
                }
            if (nextNumber !== undefined) {
                if (currentNumber !== nextNumber-1) {
                    idNumberPositionDivAdjacent = `conteinerFunilMSG${arrayIdNumberPosition[currentNumber-1]}`
                    break
                }
            } 
            idNumberPositionDivAdjacent = `conteinerFunilMSG${currentNumber}`
        }

        return { idNumberPositionDivAdjacent, isFirstUndefined }
    } catch (error) {
        console.error(`> ❌ ERROR Insert_Exponecial_Position_MSG: ${error}`)
        return null
    }
}
async function Position_MSG_Erase(IdNumberPosition) {
    try {
        IdNumberPosition = Number(IdNumberPosition)
        const data = await fs.readFile(global.Data_File_Templates_, 'utf8')

        const jsonData = JSON.parse(data)

        const index = jsonData.findIndex(item => item.positionId === IdNumberPosition)
        
        jsonData.splice(index, 1)

        const jsonString = '[\n' + jsonData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        await fs.writeFile(global.Data_File_Templates_, jsonString, 'utf8')

        Counter_Id_Position_MSG.splice(IdNumberPosition-1, 1)

        return true
    } catch (error) {
        console.error(`> ❌ ERROR Position_MSG_Erase: ${error}`)
        return false
    }
}
let Counter_Id_Position_MSG = [] //[1, 2, 3]/////////////coisa pra pegar dos json certo
async function Generate_MSG_Position_Id() {
    /*if (Generate_Id_Not_Ready) {
        console.log('>  ℹ️ Generate_Client_Id not Ready.')
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Generate_Client_Id</strong> not Ready.`)
        return null
    }*/
    try {
        //Generate_Id_Not_Ready = true

        let Id_Position_MSG = null
        let Counter_Position_MSG = 1
        let i = false
        while (!i) {
            if (Counter_Id_Position_MSG[Counter_Position_MSG-1] === undefined) {
                Id_Position_MSG = Counter_Position_MSG
                Counter_Id_Position_MSG.push(Id_Position_MSG)

                i = true
            } else {
                if (Counter_Position_MSG !== Counter_Id_Position_MSG[Counter_Position_MSG-1]) {
                    Id_Position_MSG = Counter_Position_MSG
                    Counter_Id_Position_MSG.splice(Counter_Position_MSG-1, 0, Id_Position_MSG)
                    
                    i = true
                } else {
                    Counter_Position_MSG++
                }
            }
        }
        return Id_Position_MSG
    } catch (error) {
        console.error(`> ❌ ERROR Generate_MSG_Position_Id: ${error}`)
        return null
    }
}

async function Load_Client_(Client_Not_Ready_Aux, Clientt_) {
    if (Client_Not_Ready_Aux) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return //[]
    }
    try {
        Client_Not_Ready = null

        global.File_Data_Clients_ = `Client=${Clientt_}.json`
        global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client=${Clientt_}.json`)

        console.log(`>  ◌ Loading ChatData ${Clientt_} from ${global.File_Data_Clients_}...`)
        if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Loading</strong> Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}</strong>...`)
        
        const Clients_ = await fs.readFile(global.Data_File_Clients_, 'utf8')

        if (Clients_.length === 0) {
            console.log(`> ⚠️  ${global.File_Data_Clients_} off ${Clientt_} is empty.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.File_Data_Clients_}</strong> off <strong>${Clientt_}</strong> is <strong>empty</strong>.`)
            await fs.writeFile(global.Data_File_Clients_, '[\n\n]', 'utf8')
            return //[]
        }
        
        console.log(`> ✅ Client_ ${Clientt_} loaded from ${global.File_Data_Clients_}.`)
        if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> <strong>loaded</strong> from <strong>${global.File_Data_Clients_}</strong>.`)
            
        //const Parse_Data = JSON.parse(Clients_)
        //return Parse_Data
    } catch (error) {
        if (error.code === 'ENOENT') {
            global.File_Data_Clients_ = `Client=${Clientt_}.json`
            global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client=${Clientt_}.json`)

            console.log(`> ⚠️  ${global.File_Data_Clients_} off ${Clientt_} does not exist: ${error}`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.File_Data_Clients_}</strong> off <strong>${Clientt_}</strong> does <strong>not</strong> exist: ${error}`)
            
            console.log(`>  ◌ Creating ${global.File_Data_Clients_} off ${Clientt_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Creating</strong> <strong>${global.File_Data_Clients_}</strong> off <strong>${Clientt_}</strong>...`)

            await fs.mkdir(global.Directory_Dir_Clients_, { recursive: true } )                
            await fs.writeFile(global.Data_File_Clients_, '[\n\n]', 'utf8')
            
            console.log(`> 📄 Created: ${global.File_Data_Clients_} off ${Clientt_}.`)
            if (global.Log_Callback) global.Log_Callback(`> 📄 <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Created:</strong> <strong>${global.File_Data_Clients_}</strong> off <strong>${Clientt_}</strong>.`)

            await Load_Client_(Client_Not_Ready_Aux, Clientt_)
        } else {
            console.error(`> ❌ ERROR Load_Client_ ${Clientt_}: ${error}`)
            //return []
        }
    }
}
async function Save_Client_(id, Clientt_) {
    if (!Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return 
    }
    try {
        //Client_Not_Ready = true

        console.log(`>  ◌ Saving Client_ ${Clientt_} to ${global.File_Data_Clients_}...`)
        if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i>Saving Client_ <strong>${Clientt_}</strong> to <strong>${global.File_Data_Clients_}</strong>...`)
        
        global.File_Data_Chat_Data = `Chat_Data=${Clientt_}.json`
        global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Clientt_}.json`)

        global.File_Data_Clients_ = `Client=${Clientt_}.json`
        global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client=${Clientt_}.json`)
        
        const Clients_ = JSON.parse(await fs.readFile(global.Data_File_Clients_, 'utf8'))//
        let New_Client_
        if (Clients_.length === 0) {
            New_Client_ = [{ id, Clientt_ }]
        } else {
            New_Client_ = Clients_.map(item => ({ id, Clientt_ }))
        }
        const jsonString = '[\n' + New_Client_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        
        await fs.writeFile(global.Data_File_Clients_, jsonString, 'utf8')
        
        console.log(`> 💾 Client_ ${Clientt_} saved to ${global.File_Data_Clients_}.`)
        if (global.Log_Callback) global.Log_Callback(`> 💾 <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> <strong>saved</strong> to <strong>${global.File_Data_Clients_}</strong>.`)
    } catch (error) {
        console.error(`> ❌ ERROR Save_Client_ ${Clientt_}: ${error}`)
    }
}
async function Erase_Client_(Is_From_End, Clientt_) { // quando for adicionar pra apagar o localauth, tem q apagar do objeto Clients_ tbm, tem que iniciar o client criar no caso ou se n mas estiver la que iniciou ent iniciar pra apagar ou n vai dar, sistema de apagar do json memo ja existe so pegar
    if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    } 
    try {
        Client_Not_Ready = true

        const Clients_ = JSON.parse(await fs.readFile(global.Data_File_Clients_, 'utf8'))   
        const Dir_Local_Auth = (await fs.access(`Local_Auth\\${Clientt_}`, fs.constants.F_OK).then(() => true).catch(() => false))
        if (Clients_.length === 0 || null && Dir_Local_Auth === false && Clientts_[Clientt_] === 0 || null ) {
            console.log(`> ⚠️  ${global.Data_File_Clients_}, Local_Auth(${Clientt_}), array(Clientts_[${Clientt_}]) is ALL empty, does not contain any data.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Data_File_Clients_}, Local_Auth(dir), array(Clientts_)</strong> is <strong>ALL</strong> empty, does <strong>not</strong> <strong>contain</strong> any <strong>data</strong>.`)
            
            Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: true, Is_Empty_Input: false, Not_Selected: false }
        }
        if (global.Client_ !== Clientt_) {
            console.log(`> ⚠️  The Client_ ${Clientt_} is to be erase it is not selected, the Client_ selected is ${global.Client_} so select ${Clientt_} to erase it.}`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>The Client_ <strong>${Clientt_}</strong> is to be <strong>erase</strong> it is <strong>not</strong> <strong>selected</strong>, the Client_ <strong>selected</strong> is <strong>${global.Client_}</strong> so <strong>select</strong> <strong>${Clientt_}</strong> to <strong>erase</strong> it.`)

            Client_Not_Ready = false

            return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: true }
        }
        if (Clientt_.length === 0 || null) {
            console.log(`> ⚠️  No Client_ found by the valor received: ${Clientt_}.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>No</strong> Client_ <strong>found</strong> by the valor <strong>received: ${Clientt_}</strong>.`)
            
            Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, Not_Selected: false }
        }

        let Erased_ = false
        if (Is_From_End) {
            console.log(`> ⚠️  Are you sure that you want to erase Client ${Clientt_} from ${global.File_Data_Clients_}?`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Are you <strong>sure</strong> that you <strong>want</strong> to <strong>erase</strong> Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}</strong>?`)
            const answer = await askForConfirmation(Clientt_)
            if (answer.toLowerCase() === 'y') {
                console.log(`>  ◌ Erasing Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i>Erasing Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}</strong>...`)
            
                fse.remove(`Clients_\\${global.File_Data_Clients_}`)
                Clientts_[Clientt_].instance.destroy()
                delete Clientts_[Clientt_]
                await sleep(2 * 1000)
                fse.remove(path.join(Root_Dir, `Local_Auth\\${Clientt_}`))
                const clientIdNumber = Clientt_.split('_')[1]
                Counter_Id_Clients_.splice(clientIdNumber-1, 1)
                
                Erased_ = true
            } else if (answer.toLowerCase() === 'n') {
                console.log(`> ⚠️  Client_ ${Clientt_} from ${global.File_Data_Clients_}: DECLINED`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}: DECLINED</strong>`)
                
                Client_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
            } else {
                console.log(`> ⚠️  Client_ ${Clientt_} from ${global.File_Data_Clients_}: NOT Answered to erase`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}: NOT Answered to erase</strong>`)
                
                Client_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
            }
            
        } else {
            console.log(`>  ◌ Erasing Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Erasing</strong> Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}</strong>...`)
            
            fse.remove(`Clients_\\${global.File_Data_Clients_}`)
            Clientts_[Clientt_].instance.destroy()
            delete Clientts_[Clientt_]
            await sleep(2 * 1000)
            fse.remove(path.join(Root_Dir, `Local_Auth\\${Clientt_}`))
            const clientIdNumber = Clientt_.split('_')[1]
            Counter_Id_Clients_.splice(clientIdNumber-1, 1)
            
            Erased_ = true
        }
        

        if (Erased_) {
            console.log(`> ✅ Client_ ${Clientt_} from ${global.File_Data_Clients_}: ERASED`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}: ERASED</strong>`)
            
            Client_Not_Ready = false

            return { Sucess: true, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
        }
    } catch (error) {
        console.error(`> ❌ ERROR Erase_Client_ ${Clientt_}: ${error}`)
        
        Client_Not_Ready = false
        
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    }
}
async function Destroy_Client_(Is_From_End, Clientt_) { // quando for adicionar pra apagar o localauth, tem q apagar do objeto Clients_ tbm, tem que iniciar o client criar no caso ou se n mas estiver la que iniciou ent iniciar pra apagar ou n vai dar, sistema de apagar do json memo ja existe so pegar
    if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    } 
    try {
        Client_Not_Ready = true

        const Clients_ = JSON.parse(await fs.readFile(global.Data_File_Clients_, 'utf8'))   
        const Local_Auth = (await fs.access(`Local_Auth\\${Clientt_}`, fs.constants.F_OK).then(() => true).catch(() => false))
        if (Clients_.length === 0 || null & Local_Auth === false & Clientts_[Clientt_] === 0 || null ) {
            console.log(`> ⚠️  ${global.Data_File_Clients_}, Local_Auth(${Clientt_}), array(Clientts_[${Clientt_}]) is ALL empty, does not contain any data.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Data_File_Clients_}, Local_Auth(dir), array(Clientts_)</strong> is <strong>ALL</strong> empty, does <strong>not</strong> <strong>contain</strong> any <strong>data</strong>.`)
            
            Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: true, Is_Empty_Input: false, Not_Selected: false }
        }
        if (global.Client_ !== Clientt_) {
            console.log(`> ⚠️  The Client_ ${Clientt_} is to be destroyed it is not selected, the Client_ selected is ${global.Client_} so select ${Clientt_} to destroy it.}`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>The Client_ <strong>${Clientt_}</strong> is to be <strong>destroyed</strong> it is <strong>not</strong> <strong>selected</strong>, the Client_ <strong>selected</strong> is <strong>${global.Client_}</strong> so <strong>select</strong> <strong>${Clientt_}</strong> to <strong>destroy</strong> it.`)

            Client_Not_Ready = false

            return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: true }
        }
        if (Clientt_.length === 0 || null) {
            console.log(`> ⚠️  No Client_ found by the valor received: ${Clientt_}.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>No</strong> Client_ <strong>found</strong> by the valor <strong>received: ${Clientt_}</strong>.`)
            
            Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, Not_Selected: false }
        }

        let Destroyed_ = false
        if (Is_From_End) {
            console.log(`> ⚠️  Are you sure that you want to destroy Client ${Clientt_} from ${global.File_Data_Clients_}?`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Are you <strong>sure</strong> that you <strong>want</strong> to <strong>destroy</strong> Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}</strong>?`)
            const answer = await askForConfirmation(Clientt_)
            if (answer.toLowerCase() === 'y') {
                console.log(`>  ◌ Destroing Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i>Destroing Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}</strong>...`)
                
                Clientts_[Clientt_].instance.destroy()
                Clientts_[Clientt_] = {
                    instance: null,
                }
                
                Destroyed_ = true
            } else if (answer.toLowerCase() === 'n') {
                console.log(`> ⚠️  Client_ ${Clientt_} from ${global.File_Data_Clients_}: DECLINED`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}: DECLINED</strong>`)
                
                Client_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
            } else {
                console.log(`> ⚠️  Client_ ${Clientt_} from ${global.File_Data_Clients_}: NOT Answered to erase`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}: NOT Answered to erase</strong>`)
                
                Client_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
            }
            
        } else {
            console.log(`>  ◌ Destroing Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i>Destroing Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}</strong>...`)
            
            Clientts_[Clientt_].instance.destroy()
            Clientts_[Clientt_] = {
                instance: null,
            }
            
            Destroyed_ = true
        }
        
        if (Destroyed_) {
            console.log(`> ✅ Client_ ${Clientt_} from ${global.File_Data_Clients_}: DESTROYED`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}: DESTROYED</strong>`)
            
            Client_Not_Ready = false

            return { Sucess: true, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
        }
    } catch (error) {
        console.error(`> ❌ ERROR Destroy_Client_ ${Clientt_}: ${error}`)
        
        Client_Not_Ready = false
        
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    }
}
async function Reinitialize_Client_(Clientt_) { // quando for adicionar pra apagar o localauth, tem q apagar do objeto Clients_ tbm, tem que iniciar o client criar no caso ou se n mas estiver la que iniciou ent iniciar pra apagar ou n vai dar, sistema de apagar do json memo ja existe so pegar
    if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    } 
    try {
        Client_Not_Ready = true

        const Clients_ = JSON.parse(await fs.readFile(global.Data_File_Clients_, 'utf8'))   
        const Local_Auth = (await fs.access(`Local_Auth\\${Clientt_}`, fs.constants.F_OK).then(() => true).catch(() => false))
        if (Clients_.length === 0 || null & Local_Auth === false & Clientts_[Clientt_] === 0 || null ) {
            console.log(`> ⚠️  ${global.Data_File_Clients_}, Local_Auth(${Clientt_}), array(Clientts_[${Clientt_}]) is ALL empty, does not contain any data.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Data_File_Clients_}, Local_Auth(dir), array(Clientts_)</strong> is <strong>ALL</strong> empty, does <strong>not</strong> <strong>contain</strong> any <strong>data</strong>.`)
            
            Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: true, Is_Empty_Input: false, Not_Selected: false }
        }
        if (global.Client_ !== Clientt_) {
            console.log(`> ⚠️  The Client_ ${Clientt_} is to be destroyed it is not selected, the Client_ selected is ${global.Client_} so select ${Clientt_} to destroy it.}`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>The Client_ <strong>${Clientt_}</strong> is to be <strong>destroyed</strong> it is <strong>not</strong> <strong>selected</strong>, the Client_ <strong>selected</strong> is <strong>${global.Client_}</strong> so <strong>select</strong> <strong>${Clientt_}</strong> to <strong>destroy</strong> it.`)

            Client_Not_Ready = false

            return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, Not_Selected: true }
        }
        if (Clientt_.length === 0 || null) {
            console.log(`> ⚠️  No Client_ found by the valor received: ${Clientt_}.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>No</strong> Client_ <strong>found</strong> by the valor <strong>received: ${Clientt_}</strong>.`)
            
            Client_Not_Ready = false
            
            return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, Not_Selected: false }
        }

        let Destroyed_ = false

        console.log(`>  ◌ Reinitializing Client_ ${Clientt_} from ${global.File_Data_Clients_}...`)
        if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i>Reinitializing Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}</strong>...`)
        
        initialize_Client_Not_Ready = false
        let Is_New_Client_ = false
        let Is_Initialize_Clients_ = false
        await Initialize_Client_(Clientt_, Is_New_Client_, Is_Initialize_Clients_)
        
        Destroyed_ = true

        if (Destroyed_) {
            console.log(`> ✅ Client_ ${Clientt_} from ${global.File_Data_Clients_}: REINITIALIZED`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> from <strong>${global.File_Data_Clients_}: REINITIALIZED</strong>`)
            
            Client_Not_Ready = false

            return { Sucess: true, Is_Empty: false, Is_Empty_Input: false, Not_Selected: false }
        }
    } catch (error) {
        console.error(`> ❌ ERROR Reinitialized_Client_ ${Clientt_}: ${error}`)
        
        Client_Not_Ready = false
        
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, Not_Selected: null }
    }
}
async function Insert_Exponecial_Position_Client_(arrayIdNameClients_, isNew) {
    try {
        let isFirstUndefined = false
        let idNumberClient_DivAdjacent = null
        for (let i = 0; i < arrayIdNameClients_.length; i++) {
            if (Number(arrayIdNameClients_[0].Client_Id) !== 1) {
                isFirstUndefined = true
                idNumberClient_DivAdjacent = `_${Number(arrayIdNameClients_[0].Client_Id)}_${arrayIdNameClients_[0].Client_Name}_`
                break
            } 
            const currentNumber = Number(arrayIdNameClients_[i].Client_Id)
            let nextNumber = null
            if (i+1 < arrayIdNameClients_.length) {
                nextNumber = Number(arrayIdNameClients_[i+1].Client_Id)
            } else {
                nextNumber = undefined
            }
            if (isNew) {//essa solucao pode ser preguicosa sla mas funciona
                if (nextNumber !== undefined) {
                    if (currentNumber !== nextNumber-1) {
                        idNumberClient_DivAdjacent = `_${Number(arrayIdNameClients_[currentNumber-1].Client_Id)}_${arrayIdNameClients_[currentNumber-1].Client_Name}_`
                        break
                    }
                } 
            }
            idNumberClient_DivAdjacent = `_${currentNumber}_${arrayIdNameClients_[i].Client_Name}_`
        }

        return { idNumberClient_DivAdjacent: idNumberClient_DivAdjacent, isFirstUndefined: isFirstUndefined }
    } catch (error) {
        console.error(`> ❌ ERROR Insert_Exponecial_Position_Client_: ${error}`)
        return { idNumberClient_DivAdjacent: null, isFirstUndefined: null }
    }
}
async function Select_Client_(Clientt_) {
    if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return 
    }
    try {
        Client_Not_Ready = true
        global.Client_ = Clientt_

        global.File_Data_Chat_Data = `Chat_Data=${Clientt_}.json`
        global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Clientt_}.json`)

        global.File_Data_Clients_ = `Client=${Clientt_}.json`
        global.Data_File_Clients_ = path.join(global.Directory_Dir_Clients_, `Client=${Clientt_}.json`)

        console.log(`>  ℹ️ Client_ ${Clientt_} selected.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Client_ <strong>${Clientt_}</strong> <strong>selected</strong>.`)
            
        Client_Not_Ready = false
    } catch (error) {
        console.error(`> ❌ Select_Client_ ${Clientt_}: ${error}`)
        Client_Not_Ready = false
    }
}
async function New_Client_(Client_Name) {
    //console.log(Client_Not_Ready)
    if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ New_Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>New_Client_</strong> not Ready.`)
        return 
    }
    try {
        Client_Not_Ready = true

        const NameClient_ = Client_Name
        Generate_Id_Not_Ready = false
        const Id_Client_ = await Generate_Client_Id()
        initialize_Client_Not_Ready = false
        let Is_New_Client_ = true
        let Is_Initialize_Clients_ = false
        console.log(`>  ℹ️ Initializing Client_ ${`_${Id_Client_}_${NameClient_}_`}...`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Iniciando</strong> Client_ <strong>${`_${Id_Client_}_${NameClient_}_`}</strong>...`)
        await Initialize_Client_(`_${Id_Client_}_${NameClient_}_`, Is_New_Client_, Is_Initialize_Clients_)

        /*const Directories_ = await List_Directories(`Clients_`)
        console.log(Directories_)

        const Sorted_Directories_ = [...Directories_].sort((a, b) => {
            const numA = parseInt(a.split('_')[1], 10)
            const numB = parseInt(b.split('_')[1], 10)
            return numA - numB
        })
        console.log(Sorted_Directories_)

        const isEqual = JSON.stringify(Directories_) === JSON.stringify(Sorted_Directories_)
        if (!isEqual) {
            let Temp_Directories_ = []

            for (let i = 0; i < Sorted_Directories_.length; i++) {
                const sortedPath = path.join(global.Directory_Dir_Clients_, `Client=_${Sorted_Directories_[i].split('_')[1]}_${Sorted_Directories_[i].split('_')[2]}_temp_.json`)
            
                await fs.writeFile(sortedPath, '[\n\n]')
                Temp_Directories_.push(`Client=_${Directories_[i].split('_')[1]}_${Directories_[i].split('_')[2]}_temp_.json`)
            }
            
            for (let i = 0; i < Directories_.length; i++) {
                const originalPath = path.join(global.Directory_Dir_Clients_, Directories_[i])
                const tempPath = path.join(global.Directory_Dir_Clients_, Temp_Directories_[i])
            
                const fileContent = await fs.readFile(originalPath, 'utf8')
                const templateData = JSON.parse(fileContent)

                const New_Template_ = templateData
                const jsonString = '[\n' + New_Template_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                await fs.writeFile(tempPath, jsonString, 'utf8')
            }
            
            for (let i = 0; i < Directories_.length; i++) {
                const originalPath = path.join(global.Directory_Dir_Clients_, Directories_[i])
            
                await fse.rm(originalPath, { recursive: true, force: true })
            }
            
            for (let i = 0; i < Temp_Directories_.length; i++) {
                const tempPath = path.join(global.Directory_Dir_Clients_, Temp_Directories_[i])
                const newPath = path.join(global.Directory_Dir_Clients_, `Client=_${Temp_Directories_[i].split('_')[1]}_${Temp_Directories_[i].split('_')[2]}_.json`)
            
                await fse.rename(tempPath, newPath)
            }
        }

        const Directories_2 = await List_Directories(`Clients_`)
        console.log(Directories_2, 'saco')*/
    } catch (error) {
        console.error(`> ❌ New_Client_: ${error}`)
        Client_Not_Ready = false
    }
}
async function Set_Client_Name(isNew) {
    //console.log(Client_Not_Ready)
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ New_Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>New_Client_</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true
        if (Set_Client_Name_Callback) await Set_Client_Name_Callback(isNew)

        return global.Namet_Client_
    } catch (error) {
        console.error(`> ❌ Set_Client_Name: ${error}`)
        //Client_Not_Ready = false
    }
}
async function Rename_Client_(Clientt_) {
    //console.log(Client_Not_Ready)
    /*if (Client_Not_Ready || Client_Not_Ready === null) {
        console.log(`>  ℹ️ New_Client_ not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>New_Client_</strong> not Ready.`)
        return 
    }*/
    try {
        //Client_Not_Ready = true

        //console.log(Clientt_)

        const Client_Id_ = Clientt_.split('_')[1]
        //console.log(Client_Id_)
        
        const Client_Name = await Set_Client_Name(false)
        //console.log(Client_Name)
       
        //console.log(Clientts_)
        //console.log(Clientts_[Clientt_])
        if (Destroy_Client_Callback) await Destroy_Client_Callback(Clientt_, false)
        await sleep(1 * 1000)
        //console.log(Clientts_)

        if (Clientts_[Clientt_]) {
            let entries = Object.entries(Clientts_)

            entries = entries.map(([key, value]) => {
                if (key === Clientt_) {
                    key = `_${Client_Id_}_${Client_Name}_`
                }
                return [key, value]
            })

            Clientts_ = Object.fromEntries(entries)

            //Clientts_[`_${Client_Id_}_${Client_Name}_`] = Clientts_[Clientt_]
            //delete Clientts_[Clientt_]
            
            //Clientts_[Clientt_] = Clientts_[`_${Client_Id_}_${Client_Name}_`]
            /*Clientts_[`_${Client_Id_}_${Client_Name}_`] = {
                instance: null,
            }*/

            //Clientts_[Clientt_].instance.authStrategy.dataPath = Clientts_[Clientt_].instance.authStrategy.dataPath.replace(Clientt_, `_${Client_Id_}_${Client_Name}_`)
            //Clientts_[Clientt_].instance.authStrategy.userDataDir = Clientts_[Clientt_].instance.authStrategy.userDataDir.replace(Clientt_, `_${Client_Id_}_${Client_Name}_`)
        }

        const Local_Auth = path.join(Root_Dir, `Local_Auth\\${Clientt_}`)
        await fse.rename(Local_Auth, path.join(Root_Dir, `Local_Auth\\_${Client_Id_}_${Client_Name}_`))
        
        //if (Reinitialize_Client_Callback) await Reinitialize_Client_Callback(`${Client_Id_}_${Client_Name}_`)

        //console.log(Clientts_[Clientt_])
        //console.log(Clientts_)

        /*console.log(global.Directory_Dir_Clients_)
        console.log(global.Directory_Dir_Chat_Data)

        console.log(global.File_Data_Chat_Data)
        console.log(global.Data_File_Chat_Data)
        
        console.log(global.File_Data_Clients_)
        console.log(global.Data_File_Clients_)*/

        const Clients_ = JSON.parse(await fs.readFile(global.Data_File_Clients_, 'utf8'))
        //console.log(Clients_)
        const New_Client_ = Clients_.map(item => item.Clientt_ === Clientt_ ? { ...item, Clientt_: `_${Client_Id_}_${Client_Name}_` } : item )
        const jsonString = '[\n' + New_Client_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        await fs.writeFile(global.Data_File_Clients_, jsonString, 'utf8')
        await fse.rename(global.Data_File_Clients_, path.join(global.Directory_Dir_Clients_, `Client=_${Client_Id_}_${Client_Name}_.json`))

        await fse.rename(global.Data_File_Chat_Data, path.join(global.Directory_Dir_Chat_Data, `Chat_Data=_${Client_Id_}_${Client_Name}_.json`))
        
        //await Select_Client_(`_${Client_Id_}_${Client_Name}_`)

        /*console.log(global.File_Data_Chat_Data)
        console.log(global.Data_File_Chat_Data)
        
        console.log(global.File_Data_Clients_)
        console.log(global.Data_File_Clients_)*/


        return { Sucess: true, clientt_: `_${Client_Id_}_${Client_Name}_` }
        //return { Sucess: true, clientt_: Client_Name }
    } catch (error) {
        console.error(`> ❌ Rename_Client_: ${error}`)
        //Client_Not_Ready = false
    }
}

async function Load_Chat_Data(ChatData_Not_Ready_Aux, Clientt_) {
    if (ChatData_Not_Ready_Aux) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return //[]
    }
    try {
        let Files_ = await fs.readdir('Chat_Datas')//ok essa mudanca pra resolver de reatribuir um chatdata a um client novo apos apagar o tal parece que n vai ter problemas mas se tiver so da uma olhada na logica acredito que ta bem feita ent se tiver um problema e facil de achar pq ta bem pensando eu imagino so seguir...
        //console.log(Files_)

        const match_ChatData_Id = /Chat_Data=_([0-9]+)/
        //console.log(match_ChatData_Id)
        const match_ChatData_Name = /Chat_Data=_[0-9]+_([^_]+)_/
        //console.log(match_ChatData_Name)
        
        const Id_Clientt_ = Clientt_.split('_')[1]
        //console.log(Id_Clientt_)
        const Name_Clientt_ = Clientt_.split('_')[2]
        //console.log(Name_Clientt_)

        const Dir_ChatData_Clientt_Position = Files_.map(file => file.match(match_ChatData_Id)?.[1]).filter(Boolean).map(Number).indexOf(Number(Id_Clientt_))
        //console.log(Dir_ChatData_Clientt_Position)
        let Dir_ChatData_Clientt_ = null
        let Dir_ChatData_Clientt_Id = null
        let Dir_ChatData_Clientt_Name = null
        if (Dir_ChatData_Clientt_Position !== -1) {
            Dir_ChatData_Clientt_ = Files_[Dir_ChatData_Clientt_Position]
            Dir_ChatData_Clientt_Id = Dir_ChatData_Clientt_.match(match_ChatData_Id)?.[1]
            Dir_ChatData_Clientt_Name = Dir_ChatData_Clientt_.match(match_ChatData_Name)?.[1]
        }
        //console.log(Dir_ChatData_Clientt_)
        //console.log(Dir_ChatData_Clientt_Id)
        //console.log(Dir_ChatData_Clientt_Name)

        if (Dir_ChatData_Clientt_Name !== Name_Clientt_ && Dir_ChatData_Clientt_Name) {
            global.File_Data_Chat_Data = `Chat_Data=_${Dir_ChatData_Clientt_Id}_${Dir_ChatData_Clientt_Name}_.json`
            global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=_${Dir_ChatData_Clientt_Id}_${Dir_ChatData_Clientt_Name}_.json`)

            console.log(`>  ◌ Loading ChatData ${Clientt_} from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Loading</strong> ChatData <strong>${Clientt_}</strong> from <strong>${global.File_Data_Chat_Data}</strong>...`)

            await fse.rename(global.Data_File_Chat_Data, path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Clientt_}.json`))
        } else {
            global.File_Data_Chat_Data = `Chat_Data=${Clientt_}.json`
            global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Clientt_}.json`)

            console.log(`>  ◌ Loading ChatData ${Clientt_} from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Loading</strong> ChatData <strong>${Clientt_}</strong> from <strong>${global.File_Data_Chat_Data}</strong>...`)

            const ChatData = await fs.readFile(global.Data_File_Chat_Data, 'utf8')
            
            if (ChatData.length === 0) {
                console.log(`> ⚠️  ${global.File_Data_Chat_Data} off ${Clientt_} is empty.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.File_Data_Chat_Data}</strong> off <strong>${Clientt_}</strong> is <strong>empty</strong>.`)
                    await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                return //[]
            }
        }

        console.log(`> ✅ ChatData ${Clientt_} loaded from ${global.File_Data_Chat_Data}.`)
        if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i>ChatData <strong>${Clientt_}</strong> <strong>loaded</strong> from <strong>${global.File_Data_Chat_Data}</strong>.`)
            
        //global.Client_ = Clientt_
        if (Select_Client_Callback) Select_Client_Callback(Clientt_)
                
        //const Parse_Data = JSON.parse(ChatData)
        //return Parse_Data
    } catch (error) {
        if (error.code === 'ENOENT') {
            global.File_Data_Chat_Data = `Chat_Data=${Clientt_}.json`
            global.Data_File_Chat_Data = path.join(global.Directory_Dir_Chat_Data, `Chat_Data=${Clientt_}.json`)

            console.log(`> ⚠️  ${global.File_Data_Chat_Data} off ${Clientt_} does not exist: ${error}`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.File_Data_Chat_Data}</strong> off <strong>${Clientt_}</strong> does <strong>not</strong> exist: ${error}`)
            
            console.log(`>  ◌ Creating ${global.File_Data_Chat_Data} off ${Clientt_}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Creating</strong> <strong>${global.File_Data_Chat_Data}</strong> off <strong>${Clientt_}</strong>...`)

            await fs.mkdir(global.Directory_Dir_Chat_Data, { recursive: true } )                
            await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
            
            console.log(`> 📄 Created: ${global.File_Data_Chat_Data} off ${Clientt_}`)
            if (global.Log_Callback) global.Log_Callback(`> 📄 <i><strong><span class="sobTextColor">(back)</span></strong></i>Created: ${global.File_Data_Chat_Data} off ${Clientt_}`)
            await Load_Chat_Data(ChatData_Not_Ready_Aux, Clientt_)
        } else {
            console.error(`> ❌ ERROR Load_Chat_Data ${Clientt_}: ${error}`)
            //return []
        }
    }
}
async function Save_Chat_Data(chatId, name, Clientt_, isallerase) {
    if (ChatData_Not_Ready) {
        console.log(`>  ℹ️ ${Clientt_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> not Ready.`)
        return
    } 
    try {
        console.log(`>  ◌ Saving ChatData ${global.Client_} to Chat_Data=${Clientt_}.json...`)
        if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Saving</strong> ChatData <strong>${Clientt_}</strong> to <strong>Chat_Data=${Clientt_}.json</strong>...`)
        
        const Data_File_Chat_Data = `Chat_Data=${Clientt_}.json`
        const ChatData = JSON.parse(await fs.readFile(path.join(global.Directory_Dir_Chat_Data, Data_File_Chat_Data), 'utf8'))
        let New_ChatData
        //const Directories_ = await List_Directories('Local_Auth')
        New_ChatData = [{ chatId, name }, ...ChatData.filter(item => item.chatId !== chatId)]
        /*if (ChatData.) {
            New_ChatData = [{ chatId, name }, ...ChatData.filter(item => item.chatId !== chatId)]
        } else {
            if (ChatData.) {
                New_ChatData = [{ chatId, name }, ...ChatData.filter(item => item.chatId !== chatId)]
            } else {
                New_ChatData = [{ chatId, name }, ...ChatData.filter(item => item.chatId !== chatId)]
            }
        }*/
        const jsonString = '[\n' + New_ChatData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
        
        await fs.writeFile(path.join(global.Directory_Dir_Chat_Data, Data_File_Chat_Data), jsonString, 'utf8')
        
        console.log(`> 💾 ChatData ${global.Client_} saved to Chat_Data=${Clientt_}.json.`)
        if (global.Log_Callback) global.Log_Callback(`> 💾 <i><strong><span class="sobTextColor">(back)</span></strong></i>ChatData <strong>${global.Client_}</strong> <strong>saved</strong> to <strong>Chat_Data=${Clientt_}.json</strong>.`)

        let Is_From_All_Erase = false
        if (isallerase) {    
            Is_From_All_Erase = true
        }
        if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase, Clientt_)
    } catch (error) {
        console.error(`> ❌ ERROR Save_Chat_Data ${Clientt_}: ${error}`)
    }
}
async function Erase_Chat_Data_By_Query(query, Is_From_End) {
    if (ChatData_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Client_}</strong> not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null }
    }
    try {
        ChatData_Not_Ready = true

        const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
        
        const Normalized_Query = typeof query !== 'number' ? query.trim().toLowerCase() : query;
        const Query_Entries = ChatData.filter(({chatId, name}) => 
            //chatId.trim().toLowerCase() === (Normalized_Query) ||
            String(chatId).trim().toLowerCase() === (Normalized_Query) ||
            name.trim().toLowerCase() === (Normalized_Query)  
        )
    
        if (ChatData.length === 0) {
            console.log(`> ⚠️  ${global.File_Data_Chat_Data} is empty, does not contain any ChatCata.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.File_Data_Chat_Data}</strong> is <strong>empty</strong>, does <strong>not</strong> contain any <strong>ChatData</strong>.`)
            
            ChatData_Not_Ready = false
            
            return { Sucess: false, Is_Empty: true, Is_Empty_Input: false }
        }
        if (Query_Entries.length === 0) {
            console.log(`> ⚠️  No ChatData found for the search: ${query}`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>No</strong> ChatData <strong>found</strong> for the <strong>search: ${query}</strong>`)
            
            ChatData_Not_Ready = false
            
            return { Sucess: false, Is_Empty: false, Is_Empty_Input: true }
        }

        let Erased_ = false
        let chatIds_To_Erase = []
        if (Is_From_End) {
            console.log(`> ⚠️  Are you sure that you want to erase ${query} from ${global.File_Data_Chat_Data}?`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i>Are you <strong>sure</strong> that you <strong>want</strong> to <strong>erase</strong> <strong>${query}</strong> from <strong>${global.File_Data_Chat_Data}</strong>?`)
            const answer = await askForConfirmation(global.Client_)
            if (answer.toLowerCase() === 'y') {
                console.log(`>  ◌ Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Erasing</strong> <strong>${query}</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>...`)
                
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
                console.log(`> ⚠️  ChatData for ${query} from ${global.File_Data_Chat_Data}: DECLINED`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i>ChatData for <strong>${query}</strong> from <strong>${global.File_Data_Chat_Data}: DECLINED</strong>`)
                
                ChatData_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
            } else {
                console.log(`> ⚠️  ChatData for ${query} from ${global.File_Data_Chat_Data}: NOT Answered to erase.`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i>ChatData for <strong>${query}</strong> from <strong>${global.File_Data_Chat_Data}: NOT Answered to erase</strong>`)
                
                ChatData_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false, Is_Empty_Input: false }
            }
            
        } else {
            console.log(`>  ◌ Erasing ${query} ChatData from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Erasing</strong> <strong>${query}</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>...`)
        
            chatIds_To_Erase = Query_Entries.map(entry => entry.chatId)
                
            const Updated_ChatData = ChatData.filter(item =>
                !Query_Entries.some(Query_Entry =>
                    Query_Entry.chatId === item.chatId && Query_Entry.name === item.name
                )
            )
            console.log(global.Data_File_Chat_Data)
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
                if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>ended</strong> <strong>BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule}</strong> to <strong>ERASE</strong> ChatData for <strong>${chatIds_To_Erase}</strong> from <strong>${global.File_Data_Chat_Data}</strong>.`)
                Is_timer_On = false
            }
            console.log(`> ✅ ChatData for ${query} from ${global.File_Data_Chat_Data}: ERASED`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i>ChatData for <strong>${query}</strong> from <strong>${global.File_Data_Chat_Data}: ERASED</strong>`)
            let Is_From_All_Erase = false
            if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase, null)
            
            ChatData_Not_Ready = false
        
            return { Sucess: true, Is_Empty: false, Is_Empty_Input: false }
        }
    } catch (error) {
        console.error(`> ❌ ERROR Erase_Chat_Data_By_Query ${global.Client_}: ${error}`)
        
        ChatData_Not_Ready = false

        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null }
    }
}
async function Erase_All_Chat_Data(Is_From_End) {
    if (ChatData_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`>  ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Client_}</strong> not Ready.`)
        return { Sucess: false, Is_Empty: null }
    }
    try {
        ChatData_Not_Ready = true

        const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
        if (ChatData.length === 0) {
            console.log(`> ⚠️  ${global.File_Data_Chat_Data} is empty, does not contain any ChatData.`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>${global.File_Data_Chat_Data} is <strong>empty</strong>, does <strong>not</strong> contain any ChatData.`)

            ChatData_Not_Ready = false

            return { Sucess: false, Is_Empty: true }
        }

        let Erased_ = false
        if (Is_From_End) {
            console.log(`> ⚠️  Are you sure that you want to erase all ChatData from ${global.File_Data_Chat_Data}?`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Are you <strong>sure</strong> that you <strong>want</strong> to <strong>erase</strong> <strong>all</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>?`)
            const answer = await askForConfirmation(global.Client_)
            if (answer.toLowerCase() === 'y') {
                console.log(`>  ◌ Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Erasing</strong> <strong>all</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>...`)
                
                await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
                Erased_ = true
            } else if (answer.toLowerCase() === 'n') {
                console.log(`> ⚠️  All ChatData from ${global.File_Data_Chat_Data}: DECLINED`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>All</strong> ChatData from <strong>${global.File_Data_Chat_Data}: DECLINED</strong>`)
                
                ChatData_Not_Ready = false
                
                return { Sucess: false, Is_Empty: false }
            } else {
                console.log(`> ⚠️  All ChatData from ${global.File_Data_Chat_Data}: NOT Answered to erase`)
                if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>All</strong> ChatData from <strong>${global.File_Data_Chat_Data}: NOT Answered to erase</strong>`)
                
                ChatData_Not_Ready = false

                return { Sucess: false, Is_Empty: false }
            }
        } else {
            console.log(`>  ◌ Erasing all ChatData from ${global.File_Data_Chat_Data}...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Erasing</strong> <strong>all</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>...`)
            
            await fs.writeFile(global.Data_File_Chat_Data, '[\n\n]', 'utf8')
            Erased_ = true
        }

        if (Erased_) {    
            console.log(`> ✅ All ChatData from ${global.File_Data_Chat_Data}: ERASED`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>All</strong> ChatData from <strong>${global.File_Data_Chat_Data}: ERASED</strong>`)
            
            for (const chatId in timer_Schedule) {
                clearTimeout(timer_Schedule[chatId])
                delete timer_Schedule[chatId]
                if (Is_timer_On) {
                    console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}.`)
                    if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>ended</strong> <strone>BEFORE ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule}</strone> to <strong>ERASE</strong> ChatData for <strong>${chatId}</strong> from <strong>${global.File_Data_Chat_Data}</strong>.`)
                }
                Is_timer_On = false
            }

            let Is_From_All_Erase = true
            if (List_Auxiliar_Callback) List_Auxiliar_Callback(Is_From_All_Erase, null)

            ChatData_Not_Ready = false

            return { Sucess: true, Is_Empty: false }
        }
    } catch (error) {
        console.error(`> ❌ ERROR Erase_All_Chat_Data ${global.Client_}: ${error}`)
        
        ChatData_Not_Ready = false

        return { Sucess: false, Is_Empty: null }
    }
}
async function Search_Chat_Data_By_Search(search) {
    if (ChatData_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Client_}</strong> not Ready.`)
        return { Sucess: false, Is_Empty: null, Is_Empty_Input: null, ChatData: [] }
    }
    try {
        ChatData_Not_Ready = true

        const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))
        
        const Normalized_Search = typeof search !== 'number' ? search.trim().toLowerCase() : search;
        const Search_Entries = ChatData.filter(({chatId, name}) => 
            //chatId.trim().toLowerCase().includes(Normalized_Search) ||
            String(chatId).trim().toLowerCase().includes(Normalized_Search) ||
            name.trim().toLowerCase().includes(Normalized_Search)
        )

        if (ChatData.length === 0) {
            console.log(`> ↓↓ 📄${global.File_Data_Chat_Data} is empty, does not contain any ChatCata📄 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓  <i><strong><span class="sobTextColor">(back)</span></strong></i>📄<strong>${global.File_Data_Chat_Data}</strong> is <strong>empty</strong>, does <strong>not</strong> contain any ChatCata📄 ↓↓`)
            console.log(`- Length: (0)`)
            if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Length: (0)</strong>`)
            console.log(`- chatId: N/A = name: N/A`)
            if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>chatId: N/A = name: N/A</strong>`)

            ChatData_Not_Ready = false

            return { Sucess: false, Is_Empty: true, Is_Empty_Input: false, ChatData: [] }
        }
        if (Search_Entries.length === 0) {
            console.log(`> ⚠️  No ChatData found for the search: ${search}`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>No</strong> ChatData <strong>found</strong> for the <strong>search: ${search}</strong>`)

            ChatData_Not_Ready = false

            return { Sucess: false, Is_Empty: false, Is_Empty_Input: true, ChatData: [] }
        }

        console.log(`>  ◌ Printing ChatData for ${search} from ${global.File_Data_Chat_Data}...`)
        if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Printing</strong> ChatData for <strong>${search}</strong> from <strong>${global.File_Data_Chat_Data}</strong>...`)
        
        console.log(`> ↓↓ 📄${search} ChatData Printed📄 ↓↓`)
        if (global.Log_Callback) global.Log_Callback(`> ↓↓  <i><strong><span class="sobTextColor">(back)</span></strong></i>📄${search} ChatData <strong>Printed</strong>📄 ↓↓`)
        console.log(`- Length: (${Search_Entries.length})`)
        if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Length: (${Search_Entries.length})</strong>`)
        Search_Entries.forEach(({chatId, name}) => {
            console.log(`- chatId: ${chatId} = name: ${name}`)
            if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>chatId: ${chatId} = name: ${name}</strong>`)
        })

        ChatData_Not_Ready = false

        return { Sucess: true, Is_Empty: false, Is_Empty_Input: false, ChatData: Search_Entries }
    } catch (error) {
        console.error(`> ❌ ERROR Search_Chat_Data_By_Search ${global.Client_}: ${error}`)
        ChatData_Not_Ready = false
        return { Sucess: false, Is_Empty: false, Is_Empty_Input: false, ChatData: [] }
    } 
}
async function Print_All_Chat_Data(isallerase) {
    if (ChatData_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Client_}</strong> not Ready.`)
        return { Sucess: false, Is_Empty: null, ChatData: [], Is_From_All_Erase: null }
    }
    try {
        ChatData_Not_Ready = true

        const ChatData = JSON.parse(await fs.readFile(global.Data_File_Chat_Data, 'utf8'))

        if (isallerase) {
            console.log(`> ↓↓ 📄ALL ChatData Erased📄 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓  <i><strong><span class="sobTextColor">(back)</span></strong></i>📄<strong>ALL</strong> ChatData <strong>Erased</strong>📄 ↓↓`)
            console.log(`- Length: (0)`)
            if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Length: (0)</strong>`)
            console.log(`- chatId: N/A = name: N/A`)
            if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>chatId: N/A = name: N/A</strong>`)
                
            ChatData_Not_Ready = false

            return { Sucess: true, Is_Empty: false, ChatData: [], Is_From_All_Erase: true }
        }
        if (ChatData.length === 0) {
            console.log(`> ↓↓ 📄${global.File_Data_Chat_Data} is empty, does not contain any ChatData📄 ↓↓`)
            if (global.Log_Callback) global.Log_Callback(`> ↓↓  <i><strong><span class="sobTextColor">(back)</span></strong></i>📄<strong>${global.File_Data_Chat_Data}</strong> is <strong>empty</strong>, does <strong>not</strong> contain any ChatData📄 ↓↓`)
            console.log(`- Length: (0)`)
            if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Length: (0)</strong>`)
            console.log(`- chatId: N/A = name: N/A`)
            if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>chatId: N/A = name: N/A</strong>`)

            ChatData_Not_Ready = false

            return { Sucess: false, Is_Empty: true, ChatData: [], Is_From_All_Erase: false }
        }
        
        console.log(`>  ◌ Printing ChatData from ${global.File_Data_Chat_Data}...`)
        if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Printing</strong> ChatData from <strong>${global.File_Data_Chat_Data}</strong>...`)
        
        console.log(`> ↓↓ 📄ALL ChatData Printed📄 ↓↓`)
        if (global.Log_Callback) global.Log_Callback(`> ↓↓  <i><strong><span class="sobTextColor">(back)</span></strong></i>📄<strong>ALL</strong> ChatData <strong>Printed</strong>📄 ↓↓`)
        console.log(`- Length: (${ChatData.length})`)
        if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Length: (${ChatData.length})</strong>`)
        ChatData.forEach(entry => {
            console.log(`- chatId: ${entry.chatId} = name: ${entry.name}`)
            if (global.Log_Callback) global.Log_Callback(`- <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>chatId: ${entry.chatId} = name: ${entry.name}</strong>`)
        })

        ChatData_Not_Ready = false

        return { Sucess: true, Is_Empty: false, ChatData: ChatData, Is_From_All_Erase: false }
    } catch (error) {
        console.error(`> ❌ ERROR Print_All_Chat_Data ${global.Client_}: ${error}`)
        ChatData_Not_Ready = false
        return { Sucess: false, Is_Empty: null, ChatData: [], Is_From_All_Erase: null }
    }
}

async function List_Active_Clients_() { 
    try {
        let Actives_ = _.cloneDeep(Clientts_)
        //console.log(Actives_)
        //console.log(Clientts_)
        
        for (let i = 0; i < Object.keys(Clientts_).length; i++) {
            //console.log(Actives_[Object.keys(Actives_)[i]])
            if (Actives_[Object.keys(Actives_)[i]].instance === null) {
                Actives_[Object.keys(Actives_)[i]] = {
                    instance: true,
                }
            } else {
                Actives_[Object.keys(Actives_)[i]] = {
                    instance: false,
                }
            }
        }
        
        //console.log(Actives_)
        //console.log(Clientts_)
        return Actives_
    } catch (error) {
        console.error(`> ❌ ERROR List_Active_Clients_: ${error}`)
        return []
    }
}
async function Generate_Client_Id() {//talves esse sistemas dos ids do client ter so quando ta ativo ent se n tiver ativo ele vai da um id errado, sla tem que ver isso se e isso mesmo mas se for ent muda pro jeito que e o funil e template pelo menos so essa parte ne o resto essa logica e necessario de so ativos e tals
    if (Generate_Id_Not_Ready) {
        console.log('>  ℹ️ Generate_Client_Id not Ready.')
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Generate_Client_Id</strong> not Ready.`)
        return null
    }
    try {
        Generate_Id_Not_Ready = true

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

function Actual_Time() {
    if (ChatData_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Client_}</strong> not Ready.`)
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
            console.error(`> ❌ ERROR Actual_Timer ${global.Client_}: ${error}`)
        }
    }
}

async function Sleep_Timer(time, Cancel_Sleep, chatId) {
    if (ChatData_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Client_}</strong> not Ready.`)
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
                    return true
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
            return false
        } catch (error) {
            console.error(`> ❌ ERROR Sleep_Timer ${global.Client_}: ${error}`)
        }
    }
}
async function Funil_(msg, chat, chatId, name, Chat_Type, Chat_Action, Content_, Mode_) {
    if (ChatData_Not_Ready) {
        console.log(`>  ℹ️ ${global.Client_} not Ready.`)
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Client_}</strong> not Ready.`)
        return 
    } else {
        try {
            const Client_ = Clientts_[global.Client_]?.instance

            switch (Mode_) {
                case 1:
                    msg = msg
                    break;
                case 2:
                    msg = msg.from
                    break;
            }
            
            await sleep(1 * 1000)

            let MSG = true
            let timer = null
            let Is_Ended_By_MSG = null

            //Patterns for Miliseconds times:
            // Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
            // Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
            // Formated= 1 \ * 60 * 1000 = 1-Minute
            // Formated= 1 \ * 1000 = 1-Second

            let timer_Duration_Type_MSG_debug = 'Seconds' 
            let timer_Duration_MSG_Type_debug = 1000 
            let timer_Duration_debug = 10 * timer_Duration_MSG_Type_debug

            Chat_Action = '(NEW)'
            if (Mode_ === 2) {
                console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:</strong>\n${Content_}`)
            }
            console.log(`>  ◌ Sending ALL Messages...`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>ALL</strong> Messages...`)

            

            /*await sleep(1.5 * 1000)
            chat.sendStateTyping()
            await sleep(1 * 1000)
            Client_.sendMessage(msg.from, 'teste', 'utf8')

            await sleep(1.5 * 1000)
            chat.sendStateTyping()
            await sleep(1 * 1000)
            Client_.sendMessage(msg.from, 'teste', 'utf8')

            await sleep(1.5 * 1000)
            chat.sendStateTyping()
            await sleep(1 * 1000)
            Client_.sendMessage(msg.from, 'teste', 'utf8')*/


            let data = null
            data = fss.readFileSync(global.Data_File_Templates_, 'utf8')//pega pra pegar o json do template selecionado do funil selecionado, talves mudar a forma das pastas pros template dos funil e tals
            //console.log(data)
            let templateData = null
            templateData = JSON.parse(data)
            //console.log(templateData)
            let positions = null
            positions = templateData.filter(item => item.positionId)
            //console.log(positions)
            
            let TimeType = null
            //console.log(positions.length)
            for (let i = 0; i < positions.length; i++) {
                const item = positions[i]

                switch (item.typeMSG) {
                    case 1:
                        console.log(`>  ◌ Sending Message_${i+1}_...`)
                        if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>Message_${i+1}_</strong>...`)

                        TimeType = null
                        switch (item.delayType) {
                            case 'seconds':
                                TimeType = 1000
                                break;
                            case 'minutes':
                                TimeType = 60 * 1000
                                break;
                            case 'hours':
                                TimeType = 60 * 60 * 1000
                                break;
                            case 'days':
                                TimeType = 24 * 60 * 60 * 1000
                                break;
                        }
                        await sleep(item.delayData * TimeType)

                        console.log(`> ✅ Message_${i+1}_ Sent.`)
                        if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Message_${i+1}_</strong> <strong>Sent</strong>.`)
                        break;
                    case 2:
                        console.log(`>  ◌ Sending Message_${i+1}_...`)
                        if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>Message_${i+1}_</strong>...`)

                        if (item.delayType !== 'none' && item.delayData > 0 || item.delayData !== '') {
                            chat.sendStateTyping()
                            TimeType = null
                            switch (item.delayType) {
                                case 'seconds':
                                    TimeType = 1000
                                    break;
                                case 'minutes':
                                    TimeType = 60 * 1000
                                    break;
                                case 'hours':
                                    TimeType = 60 * 60 * 1000
                                    break;
                                case 'days':
                                    TimeType = 24 * 60 * 60 * 1000
                                    break;
                            }
                            await sleep(item.delayData * TimeType)
                        }
                        Client_.sendMessage(msg, item.textareaData, 'utf8')

                        console.log(`> ✅ Message_${i+1}_ Sent.`)
                        if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Message_${i+1}_</strong> <strong>Sent</strong>.`)
                        break;
                    case 3://mudar os fromFilePath e readFile pra pega os arquivo do json salvo nele e tals
                        console.log(`>  ◌ Sending Message_${i+1}_...`)
                        if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>Message_${i+1}_</strong>...`)

                        switch (item.fileType) {
                            case 'video':
                                const audioBuffer = Buffer.from(item.fileData.buffer.data)
                                const audioBase64 = audioBuffer.toString('base64')
                                const media = new MessageMedia(item.fileData.mimetype, audioBase64, item.fileData.originalname)

                                Client_.sendMessage(msg, media, { caption: item.textareaData })
                                break;
                            case 'audio':
                                if (item.delayType !== 'none' && item.delayData > 0 || item.delayData !== '') {
                                    chat.sendStateRecording()
                                    switch (item.delayType) {
                                        case 'seconds':
                                            TimeType = 1000
                                            break;
                                        case 'minutes':
                                            TimeType = 60 * 1000
                                            break;
                                        case 'hours':
                                            TimeType = 60 * 60 * 1000
                                            break;
                                        case 'days':
                                            TimeType = 24 * 60 * 60 * 1000
                                            break;
                                    }
                                    await sleep(item.delayData * TimeType)
                                }

                                const audioBuffer2 = Buffer.from(item.fileData.buffer.data)
                                const audioBase642 = audioBuffer2.toString('base64')
                                const media2 = new MessageMedia(item.fileData.mimetype, audioBase642, item.fileData.originalname)

                                Client_.sendMessage(msg, media2, { sendAudioAsVoice: true })
                                break;
                            case 'image':
                                const audioBuffer3 = Buffer.from(item.fileData.buffer.data)
                                const audioBase643 = audioBuffer3.toString('base64')
                                const media3 = new MessageMedia(item.fileData.mimetype, audioBase643, item.fileData.originalname)

                                Client_.sendMessage(msg, media3, { caption: item.textareaData })
                                break;
                            case 'text':
                                if (item.delayType !== 'none' && item.delayData > 0 || item.delayData !== '') {
                                    chat.sendStateTyping()
                                    TimeType = null
                                    switch (item.delayType) {
                                        case 'seconds':
                                            TimeType = 1000
                                            break;
                                        case 'minutes':
                                            TimeType = 60 * 1000
                                            break;
                                        case 'hours':
                                            TimeType = 60 * 60 * 1000
                                            break;
                                        case 'days':
                                            TimeType = 24 * 60 * 60 * 1000
                                            break;
                                    }
                                    await sleep(item.delayData * TimeType)
                                }
                                
                                const textContent = Buffer.from(item.fileData.buffer.data).toString('utf8')

                                Client_.sendMessage(msg, textContent, 'utf8')
                                break;
                            case 'document':
                                const audioBuffer4 = Buffer.from(item.fileData.buffer.data)
                                const audioBase644 = audioBuffer4.toString('base64')
                                const media4 = new MessageMedia(item.fileData.mimetype, audioBase644, item.fileData.originalname)

                                Client_.sendMessage(msg, media4, { caption: item.textareaData })
                                break;
                        }

                        console.log(`> ✅ Message_${i+1}_ Sent.`)
                        if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Message_${i+1}_</strong> <strong>Sent</strong>.`)
                        break;
                }
            }
            data = null
            templateData = null
            positions = null

            TimeType = null



            /*console.log(`>  ◌ Sending .Message_debug1.1....`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>.Message_debug.</strong>...`)

            await sleep(1.5 * 1000)
            chat.sendStateTyping()
            await sleep(1 * 1000)
            Client_.sendMessage(msg, 'debug1.1', 'utf8')

            console.log(`> ✅ .Message_debug1.1. Sent.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>.Message_debug.</strong> <strong>Sent</strong>.`)*/

            
            /*console.log(`> ⏲️  Timer STARTING for ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
            if (global.Log_Callback) global.Log_Callback(`> ⏲️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>STARTING</strong> for <strong>${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug}</strong> to <strong>send</strong> <strong>NEXT</strong> message...`)
            timer = setTimeout (async () => {
                clearTimeout(timer)
                timer = null
                console.log(`> ⏰ Timer FINALIZED ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                if (global.Log_Callback) global.Log_Callback(`> ⏰ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>FINALIZED</strong> <strong>${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug}</strong> to <strong>send</strong> <strong>NEXT</strong> message.`)
                    
                    
                console.log(`>  ◌ Sending .Message_debug1.2....`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>.Message_debug.</strong>...`)
    
                await sleep(1.5 * 1000)
                chat.sendStateTyping()
                await sleep(1 * 1000)
                Client_.sendMessage(msg, 'debug1.2', 'utf8')
    
                console.log(`> ✅ .Message_debug2. Sent.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>.Message_debug.</strong> <strong>Sent</strong>.`)

                
                timer = setTimeout (async () => {
                    MSG = false
                    clearTimeout(timer)
                    timer = null
                    console.log(`> ⏰ Timer FINALIZED ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⏰ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>FINALIZED</strong> <strong>${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug}</strong> to <strong>send</strong> <strong>NEXT</strong> message.`)
                        
                        
                    console.log(`>  ◌ Sending .Message_debug1.2-2....`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>.Message_debug.</strong>...`)
        
                    await sleep(1.5 * 1000)
                    chat.sendStateTyping()
                    await sleep(1 * 1000)
                    Client_.sendMessage(msg, 'debug1.2-2', 'utf8')
        
                    console.log(`> ✅ .Message_debug1.2-2. Sent.`)
                    if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>.Message_debug.</strong> <strong>Sent</strong>.`)
                }, timer_Duration_debug)
                console.log(`> ⏲️  Timer STARTING for ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
                if (global.Log_Callback) global.Log_Callback(`> ⏲️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>STARTING</strong> for <strong>${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug}</strong> to <strong>send</strong> <strong>NEXT</strong> message...`)
                await Sleep_Timer(13 * 1000, Chat_States[chatId].Cancel_Promise, chatId)
                await Chat_States[chatId].Promise_
                

                console.log('primeiro', MSG)
                if (MSG) {
                    MSG = false
                    clearTimeout(timer)
                    timer = null
                    console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                    if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>ended</strong> <strong>BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug}</strong> to <strong>send</strong> <strong>NEXT</strong> message.`)
                    

                    console.log(`>  ◌ Sending .Message_debug1.2-22....`)
                    if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>.Message_debug.</strong>...`)
        
                    await sleep(1.5 * 1000)
                    chat.sendStateTyping()
                    await sleep(1 * 1000)
                    Client_.sendMessage(msg, 'debug1.2-22', 'utf8')
        
                    console.log(`> ✅ .Message_debug1.2-22. Sent.`)
                    if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>.Message_debug.</strong> <strong>Sent</strong>.`)
                }
            }, timer_Duration_debug)
            Is_Ended_By_MSG = await Sleep_Timer(13 * 1000, Chat_States[chatId].Cancel_Promise, chatId)
            await Chat_States[chatId].Promise_

            if (!Is_Ended_By_MSG) {   
                await Sleep_Timer(13 * 1000, Chat_States[chatId].Cancel_Promise, chatId)
                await Chat_States[chatId].Promise_
            }

            console.log('segundo', MSG)
            if (MSG) {
                clearTimeout(timer)
                timer = null
                console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>ended</strong> <strong>BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug}</strong> to <strong>send</strong> <strong>NEXT</strong> message.`)
                

                console.log(`>  ◌ Sending .Message_debug1.22....`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>.Message_debug.</strong>...`)
    
                await sleep(1.5 * 1000)
                chat.sendStateTyping()
                await sleep(1 * 1000)
                Client_.sendMessage(msg, 'debug1.22', 'utf8')
    
                console.log(`> ✅ .Message_debug1.22. Sent.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>.Message_debug.</strong> <strong>Sent</strong>.`)
            } else {
                MSG = true 
            }


            if (Is_Ended_By_MSG) {   
                await sleep(4 * 1000)
            }
            console.log(`>  ◌ Sending .Message_debug2.1....`)
            if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>.Message_debug.</strong>...`)

            await sleep(1.5 * 1000)
            chat.sendStateTyping()
            await sleep(1 * 1000)
            Client_.sendMessage(msg, 'debug2.1', 'utf8')

            console.log(`> ✅ .Message_debug2.1. Sent.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>.Message_debug.</strong> <strong>Sent</strong>.`)

            
            console.log(`> ⏲️  Timer STARTING for ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
            if (global.Log_Callback) global.Log_Callback(`> ⏲️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>STARTING</strong> for <strong>${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug}</strong> to <strong>send</strong> <strong>NEXT</strong> message...`)
            timer = setTimeout (async () => {
                clearTimeout(timer)
                timer = null
                console.log(`> ⏰ Timer FINALIZED ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                if (global.Log_Callback) global.Log_Callback(`> ⏰ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>FINALIZED</strong> <strong>${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug}</strong> to <strong>send</strong> <strong>NEXT</strong> message.`)
            
            
                console.log(`>  ◌ Sending .Message_debug2.2....`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>.Message_debug.</strong>...`)
    
                await sleep(1.5 * 1000)
                chat.sendStateTyping()
                await sleep(1 * 1000)
                Client_.sendMessage(msg, 'debug2.2', 'utf8')
    
                console.log(`> ✅ .Message_debug2.2. Sent.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>.Message_debug.</strong> <strong>Sent</strong>.`)


                MSG = false
            }, timer_Duration_debug)
            Is_Ended_By_MSG = await Sleep_Timer(13 * 1000, Chat_States[chatId].Cancel_Promise, chatId)
            await Chat_States[chatId].Promise_
            
            //if (Is_Ended_By_MSG) {
                //await sleep(0.5 * 1000)
            //}
            if (MSG) {
                clearTimeout(timer)
                timer = null
                console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>ended</strong> <strong>BEFORE ${timer_Duration_debug / timer_Duration_MSG_Type_debug} ${timer_Duration_Type_MSG_debug}</strong> to <strong>send</strong> <strong>NEXT</strong> message.`)
                

                console.log(`>  ◌ Sending .Message_debug2.22....`)
                if (global.Log_Callback) global.Log_Callback(`>  ◌  <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Sending</strong> <strong>.Message_debug.</strong>...`)
    
                await sleep(1.5 * 1000)
                chat.sendStateTyping()
                await sleep(1 * 1000)
                Client_.sendMessage(msg, 'debug2.22', 'utf8')
    
                console.log(`> ✅ .Message_debug22. Sent.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>.Message_debug.</strong> <strong>Sent</strong>.`)
            } else {
                MSG = true 
            }*/

            

            console.log(`> ✅ ALL Messages Sent.`)
            if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>ALL</strong> Messages <strong>Sent</strong>.`)

           
            Chat_States[chatId].Is_MSG_Initiate = true
            
            if (Is_Schedule) { //&& Is_New) {
                //Is_New = false  
                console.log(`> ⏲️  Timer STARTING for ${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${global.File_Data_Chat_Data}...`)
                if (global.Log_Callback) global.Log_Callback(`> ⏲️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Timer</strong> <strong>STARTING</strong> for <strong>${timer_Duration_Schedule / timer_Duration_Schedule_Type} ${timer_Duration_Type_Schedule}</strong> to <strong>ERASE</strong> ChatData for <strong>${chatId}</strong> from <strong>${global.File_Data_Chat_Data}</strong>...`)
                
                await Schedule_Erase_Chat_Data(chatId, timer_Duration_Schedule, global.Client_)
            }

            delete Chat_States[chatId]
        } catch (error) {
            console.error(`> ❌ ERROR Funil_ ${global.Client_}: ${error}`)
        }
    }
}

async function Initialize_Client_(Clientt_, Is_New_Client_, Is_Initialize_Clients_) {
    if (initialize_Client_Not_Ready) {
        console.log('>  ℹ️ Initialize_Client_ not Ready.')
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Initialize_Client_</strong> not Ready.`)
        return 
    }
    try {
        initialize_Client_Not_Ready = true

        await Load_Client_(Client_Not_Ready_Aux, Clientt_)

        if (Counter_Id_Clients_ > global.MAX_Clients_) {
            console.log(`> ⚠️  Max instances off Clients_ reached (${Counter_Id_Clients_}): MAX(${MAX_Clients_})`)
            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Máx</strong> <strong>instances</strong> off <strong>Clients_</strong> reached (<strong>${Counter_Id_Clients_}</strong>)<strong>: MAX</strong>(<strong>${MAX_Clients_}</strong>)`)
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
                executablePath: process.env.BROWSER_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                args: ['--no-sandbox', '--disable-gpu'],
                headless: process.env.BROWSER_HEADLESS/*debug*/ || true
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
                    if (global.Log_Callback) global.Log_Callback(`> ↓↓ <i><strong><span class="sobTextColor">(back)</span></strong></i>📸<strong>${Clientt_}</strong> <strong>try</strong> to <strong>Connect</strong> for the <strong>${global.QR_Counter}</strong>º to <strong>WhatsApp Web</strong> by the <strong>QR-Code</strong> below📸 ↓↓`)
                    
                    qrcode.generate(qr, { small: true })
                    
                    qrcode.generate(qr, { small: true }, (Qr_String_Ascii) =>{
                        global.Is_Conected = false
                        global.Qr_String = Qr_String_Ascii
                    
                        if (global.Log_Callback) global.Log_Callback(global.Qr_String)
                        if (QrCode_On_Callback) QrCode_On_Callback(true, global.QR_Counter, Clientt_)
                    })

                    console.log(`> ↑↑ 📸${Clientt_} try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code above📸 ↑↑`)
                    if (global.Log_Callback) global.Log_Callback(`> ↑↑ <i><strong><span class="sobTextColor">(back)</span></strong></i>📸<strong>${Clientt_}</strong> <strong>try</strong> to <strong>Connect</strong> for the <strong>${global.QR_Counter}</strong>º to <strong>WhatsApp Web</strong> by the <strong>QR-Code</strong> below📸 ↑↑`)
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
                    if (global.Log_Callback) global.Log_Callback(`> ❌ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> <strong>Maximum</strong> <strong>QR_Code</strong> retries <strong>Exceeds</strong>(<strong>${QR_Counter_Exceeds}</strong>).`)
                    
                    if (Is_New_Client_ === true) {   
                        fse.remove(`Clients_\\${global.File_Data_Clients_}`)
                        if (Client_) Client_.destroy()
                        await sleep(1 * 1000)
                        fse.remove(`Local_Auth\\${Clientt_}`)
                        const clientIdNumber = Clientt_.match(/\d+/g)
                        Counter_Id_Clients_.splice(clientIdNumber-1, 1)
                    } else if (Is_New_Client_ === false) {   
                        if (Client_) Client_.destroy()
                    }
                    
                    if (Is_Initialize_Clients_ === true) {
                        if (Client_) Client_.destroy()
                        const clientIdNumber = Clientt_.match(/\d+/g)
                        Counter_Id_Clients_.splice(clientIdNumber-1, 1)
                    }

                    console.log(`>  ℹ️ Retry again.`)
                    if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Retry</strong> again.`)
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
                if (global.Log_Callback) global.Log_Callback(`> 🔑 <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>SUCESSIFULLY</strong> Client_ <strong>${Clientt_}</strong> <strong>Authenticated</strong> by the <strong>Local_Auth</strong>.`)
            } catch (error) {
                console.error(`> ❌ ERROR autenticated ${Clientt_}: ${error}`)
            } 
        })
        Client_.on('ready', async () => {
            try {
                Clientts_[Clientt_] = {
                    instance: Client_,
                }

                if (!Counter_Id_Clients_.includes((Number(Clientt_.split('_')[1])))) {
                    Counter_Id_Clients_.push(Number(Clientt_.split('_')[1]))
                }

                const id = await generateUniqueId()
                Client_Not_Ready = true
                await Save_Client_(id, Clientt_)
                if (Is_New_Client_) {//esta aqui mas acho que n e necessario, o list directories deve ta retornando na ordem errada real ent me bugo tudo
                    const Directories_ = await List_Directories(`Clients_`)
                    console.log(Directories_)
        
                    const Sorted_Directories_ = [...Directories_].sort((a, b) => {
                        const numA = parseInt(a.split('_')[1], 10)
                        const numB = parseInt(b.split('_')[1], 10)
                        return numA - numB
                    })
                    console.log(Sorted_Directories_)
        
                    const isEqual = JSON.stringify(Directories_) === JSON.stringify(Sorted_Directories_)
                    if (!isEqual) {
                        let Temp_Directories_ = []
        
                        for (let i = 0; i < Sorted_Directories_.length; i++) {
                            //console.log(Temp_Directories_, 'porra de errado')
                            //console.log(`Client=_${Directories_[i].split('_')[1]}_${Directories_[i].split('_')[2]}_temp_.json`, 'hehe')
                            //await sleep(1 * 1000)
                            const sortedPath = path.join(global.Directory_Dir_Clients_, `Client=_${Sorted_Directories_[i].split('_')[1]}_${Sorted_Directories_[i].split('_')[2]}_temp_.json`)
                        
                            await fs.writeFile(sortedPath, '[\n\n]')
                            Temp_Directories_.push(`Client=_${Sorted_Directories_[i].split('_')[1]}_${Sorted_Directories_[i].split('_')[2]}_temp_.json`)//diferente do template so muda aqui mas talves n seja necessario, o list directories deve ta retornando na ordem errada real ent me bugo tudo
                        }
                        //console.log(Temp_Directories_, 'final')
                        
                        for (let i = 0; i < Directories_.length; i++) {
                            const originalPath = path.join(global.Directory_Dir_Clients_, Directories_[i])
                            const tempPath = path.join(global.Directory_Dir_Clients_, Temp_Directories_[i])
                        
                            const fileContent = await fs.readFile(originalPath, 'utf8')
                            const templateData = JSON.parse(fileContent)
        
                            const New_Template_ = templateData
                            const jsonString = '[\n' + New_Template_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
                            await fs.writeFile(tempPath, jsonString, 'utf8')
                        }
                        
                        for (let i = 0; i < Directories_.length; i++) {
                            const originalPath = path.join(global.Directory_Dir_Clients_, Directories_[i])
                        
                            await fse.rm(originalPath, { recursive: true, force: true })
                        }
                        
                        for (let i = 0; i < Temp_Directories_.length; i++) {
                            //const Directories_ = await List_Directories(`Clients_`)
                            //console.log(Directories_, 'f')
                            //await sleep(1 * 1000)
                            const tempPath = path.join(global.Directory_Dir_Clients_, Temp_Directories_[i])
                            const newPath = path.join(global.Directory_Dir_Clients_, `Client=_${Temp_Directories_[i].split('_')[1]}_${Temp_Directories_[i].split('_')[2]}_.json`)
                            
                            await fse.rename(tempPath, newPath)
                            //const Directories_2 = await List_Directories(`Clients_`)
                            //console.log(Directories_2, 'b')
                        }
                    }
        
                    //const Directories_2 = await List_Directories(`Clients_`)
                    //console.log(Directories_2, 'saco')
                }
                Client_Not_Ready = false

                global.Qr_String = ''
                global.QR_Counter = 0
                global.Stage_ = 2
                global.Is_From_New = false 

                
                global.Is_QrCode_On = false

                let Is_Reinitialize = null
                if (Is_New_Client_ || Is_Initialize_Clients_) {
                    if (Clients_Callback) Clients_Callback(Clientt_)
                } else {
                    Is_Reinitialize = true
                }
                if (Ready_Callback) Ready_Callback(Clientt_, Is_Reinitialize)
                
                console.log(`> ✅ ${Clientt_} is READY.`)
                if (global.Log_Callback) global.Log_Callback(`> ✅ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Clientt_}</strong> is READY.`)
                
                await Load_Chat_Data(ChatData_Not_Ready_Aux, Clientt_)
                ChatData_Not_Ready = false
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

                if (Is_New_Client_ === true) {   
                    fse.remove(`Clients_\\${global.File_Data_Clients_}`)
                    if (Client_) Client_.destroy()
                    await sleep(1 * 1000)
                    fse.remove(`Local_Auth\\${Clientt_}`)
                    const clientIdNumber = Clientt_.match(/\d+/g)
                    Counter_Id_Clients_.splice(clientIdNumber-1, 1)
                } else if (Is_New_Client_ === false) {   
                    if (Client_) Client_.destroy()
                }
                
                if (Is_Initialize_Clients_ === true) {
                    if (Client_) Client_.destroy()
                    const clientIdNumber = Clientt_.match(/\d+/g)
                    Counter_Id_Clients_.splice(clientIdNumber-1, 1)
                }
                
                if (Auth_Failure_Callback) Auth_Failure_Callback()
                console.error(`> ⚠️  ERROR Authentication ${Clientt_} to WhatsApp Web by the Local_Auth: ${error}`)
            } catch (error) {
                console.error(`> ❌ ERROR auth_failure ${Clientt_}: ${error}`)
            } 
        })
        //message //actual
        //message_create //debug
        Client_.on('message_create', async msg => {
            try {
                if (Is_Mode_Test & Is_Test) {
                    console.log(`Test Mode is ON.`)
                    if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i>Test Mode is <strong>ON</strong>.`)

                    return
                }
        
                const chat = await msg.getChat()
                const chatId = Number(chat.id._serialized.slice(0, -5))
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
                        if (!Is_Test) {
                            console.log(`> ⚠️  NEW MEDIA TYPE`)
                            if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>NEW MEDIA TYPE</strong>`)
                        }
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
                    if (!Is_Test) {
                        console.log(`> ⚠️  NEW MSG TYPE`)
                        if (global.Log_Callback) global.Log_Callback(`> ⚠️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>NEW MSG TYPE</strong>`)
                    }
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
                    if (!Is_Test) {
                        console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:</strong>\n${Content_}`)
                    }

                    delete Chat_States[chatId]
                    return
                }

                const jsonString = await fs.readFile(global.Data_File_Chat_Data, 'utf8')
                let ChatData = JSON.parse(jsonString)
                const existingEntry = ChatData.find(item => item.chatId === chatId)
            
                if (existingEntry) {
                    if (existingEntry.name !== name) {
                        Chat_Action = '(DFN)'
                        if (!Is_Test) {
                            console.log(`>  ℹ️ ${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:\n${Content_}`)
                            if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${Actual_Time()} - ${chatId} - ${name} - ${Chat_Type}${Chat_Action}:</strong>\n${Content_}`)
                        }
                        
                        let isallerase = false
                        await Save_Chat_Data(chatId, name, Clientt_, isallerase)

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
                    await Save_Chat_Data(chatId, name, Clientt_, isallerase)
                
                    Chat_States[chatId].Is_MSG_Initiate = false
                    let Mode_ = 2
                    await Funil_(msg, chat, chatId, name, Chat_Type, Chat_Action, Content_, Mode_)
                }
            } catch (error) {
                console.error(`> ❌ ERROR sending messages ${Clientt_}: ${error}`)
            } 
        })
        Client_.on('message_revoke_everyone', async (msg) => {//?
            try {
                console.log(`> 📝 Message revoked: ${msg.body}`)
            } catch (error) {
                console.error(`> ❌ ERROR message_revoke_everyone ${Clientt_}: ${error}`)
            }
        })
        Client_.on('message_revoke_me', async (msg) => {//?
            try {
                console.log(`> 📝 Message revoked for me: ${msg.body}`)
            } catch (error) {
                console.error(`> ❌ ERROR message_revoke_me ${Clientt_}: ${error}`)
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
    if (initialize_Not_Ready) {
        console.log('>  ℹ️ initialize not Ready.')
        if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>initialize</strong> not Ready.`)
        return { Sucess: false }
    } else {
        try {
            const Directories_2 = await List_Directories('Clients_')
            //console.log(Directories_2)
            const Directories_ = await List_Directories('Local_Auth')
            
            let Counter_Clients_ = 0
            if (Directories_.length-1 === -1) {
                const Client_Name = await Set_Client_Name(true)
                global.Namet_Client_ = null
                Client_Not_Ready = false
                await New_Client_(Client_Name)

                initialize_Not_Ready = true
                
                return { Sucess: true }
            } else {
                for (let i = 0; i < Directories_.length; i++) {
                    initialize_Client_Not_Ready = false
                    let Is_New_Client_ = false
                    let Is_Initialize_Clients_ = true
                    console.log(`>  ℹ️ Initializing Client_ ${Directories_[Counter_Clients_]}...`)
                    if (global.Log_Callback) global.Log_Callback(`> ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>Iniciando</strong> Client_ <strong>${Directories_[Counter_Clients_]}</strong>...`)
                    await Initialize_Client_(Directories_[Counter_Clients_], Is_New_Client_, Is_Initialize_Clients_)

                    Counter_Clients_++
                }

                initialize_Not_Ready = true
                
                return { Sucess: true }
            }
        } catch (error) {
            console.error(`> ❌ ERROR initialize: ${error}`)
            //const clientIdNumber = Clientt_.match(/\d+/g)
            //Counter_Id_Clients_.splice(clientIdNumber-1, 1)
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
    List_Active_Clients_,
    Set_Ready_Callback,
    Set_Start_Callback,
    Erase_Chat_Data_By_Query,
    Erase_All_Chat_Data,
    Reload_Front, 
    Input_Command, 
    Erase_Client_,
    Set_Erase_Client_Callback,
    Destroy_Client_,
    Set_Destroy_Client_Callback,
    Insert_Exponecial_Position_Client_,
    Reinitialize_Client_,
    Set_Reinitialize_Client_Callback,
    Select_Client_,
    Set_Select_Client_Callback,
    Set_New_Client_Callback,
    Set_Set_Client_Name_Callback,
    New_Client_,
    Set_Client_Name,
    Rename_Client_,
    initialize,
    Set_Clients_Callback,
    Generate_MSG_Position_Id,
    Position_MSG_Erase,
    Insert_Exponecial_Position_MSG,
    New_Funil_,
    Set_Set_Funil_Name_Callback,
    Rename_Funil_,
    Insert_Exponecial_Position_Funil_,
    Select_Funil_,
    Erase_Funil_,
    New_Template_,
    Set_Set_Template_Name_Callback,
    Rename_Template_,
    Insert_Exponecial_Position_Template_,
    Select_Template_,
    Erase_Template_,
    Status_Erase_Schedule,
    Set_Erase_Schedule,
    Delay_Info_Erase_Schedule,
    Send_To_Template_Erase_Schedule,
    Set_Test_Mode,
    Set_Receive_MSG,
    Status_Test_Mode,
    Contact_Info_Test_Mode,
    Send_To_Template_Test_Mode,
    Initiate_Test_Mode,
    Send_To_Funil,
    Insert_Template_Front,
    Change_Position_MSG,
}

console.log(`> ✅ FINISHED(Starting functions)`)
if (global.Log_Callback) global.Log_Callback(`> ✅ FINISHED(Starting functions)`)

const { name: Name_Software } = JSON.parse(fss.readFileSync(path.resolve(Root_Dir, 'package.json'), 'utf8'))
global.Bot_Name = Name_Software.toUpperCase()
const { version: Version_ } = JSON.parse(fss.readFileSync(path.resolve(Root_Dir, 'package.json'), 'utf8'))
global.Bot_Version_ = Version_
console.log(`>  ℹ️ ${global.Bot_Name} = v${global.Bot_Version_}`)
if (global.Log_Callback) global.Log_Callback(`>  ℹ️ <i><strong><span class="sobTextColor">(back)</span></strong></i><strong>${global.Bot_Name || 'BOT'}</strong> = <strong>v${global.Bot_Version_ || '?.?.?'}</strong>`)

//tarefas bot backend 
//em desenvolvimento...
    //desenvolver o desenvolvimento de funils padroes de msg automaticas para o bot e implantar front end, principalmente front end so vai ser possivel mexer com isso la
        //////varios problemas no multi clients instance ao testar realmente 2 whats ao mesmo tempo e tals, salvando o client dos 2 no outro e vice versa talves seja a variaveis globais talves fazer array pra cada client dos caminhos de diretorio mai e mt role ein, equanto ta criando um client novo ta mostra o 2 mas ta rodando o 1 as funcao ent arruma isso questao da variavel global caso da incerteza e tals, ta pegando os 2 numero oq ta mandando e oq ta recebendo pro chatdata com o message_create talves seja normal ou n mas ruim pra debug ne os 2 tao linkado or isso ta assim, logica do funil o esquema de mandar msg e n responde e mandar outra msg n ta funfando, erro burro cometido so vai salvar ou ent funfa certo o q tiver selecionado e tem que ta com o front aberto ent ne burro n vai dar certo resolver isso logo, pode ta salvando chatdata no outro se selecionado outro
        //talves um sistema de for repeticao e vai mandando oq tiver na fila pra manda sla estando em uma funcao ou sla json
        //o funil ser de uma fila e oq tiver programado ali ele bate no codigo e executa na hora com oq tiver mandado e tals, sendo midias msg sleep contrapropostas e vai indo, um json programavel, ai ja as midias msg... como faco pra ta no json e rodas no zap assim?
        //lembrar dos erros do multi client, lembrar de resolver quando voltar nisso, no caso faze um sistema de cadastro ne e tals.... modifica tudo o codigo o beleza kaka////////////////////////////
        //um ifzao com os codigos ja e so recebe as info tipo se for file audio staterecording o tempo do delay e o asvoice true e manda carregando do funil dos arquivo salvos nas pastas os caminhos dados infos no json na ordem e tals
    //adicionar um botao de destroy client do lado do client erase e quando for destroy ele muda pra iniciar dnv unicamente aquele client selecionado, e de inicio todos ficar pra dar destroy ne pq eles iniciar e tals mas tenta pra deixar auto isso de inicia e destroy caso de erro e zas foda daora
    //faze o REST se der o ful mas n da ne, ver as funcoes do front e ver se precisa de uma rota so pra aquilo, padroniza os nomes dos callback websocket igual as rota, separa as rota e websocket do server, e os models client chatdada wweb.jss do app sla ainda como vai ser o app, ver os sistemas de camadas de tudo como fazer o certo ou se o gabiarra que e o jeito que ta ja serve sla 
        
//a desenvolver...
    //sucess false do start n ta funfando aparece o botao start dinovo
    //ver como bota num server finalmente frontend githubpages e back em algum canto ai google drive sla como e ver como junta os 2
    //adicionar pra nao executar comandos funcoes pra front end caso o front end n esteja conectado no caso quando estiver so rodando o backend as os funils funcionando sem ta no site com requesicao http e de Is e tal
    //?//arrumar meios de n precisar dessas variaveis permanentes, ou pelo menos diminuir muito?
    //da pra fazer de a cada usuario do websocket e todas as funcoes unicas dele igual e os callback, bota tudo dentro de uma funcao e roda a cada usuario pra pensa melhor se vai ser tudo dentro de uma funcao sla pq se desconectar fudeo sai da funcao e para tudo talves salva na memoria(talves ja esteja salvo ne) e n apagar a conexao o id e tals, criar formas de apagar o usuario prorio a conexao e criar uma talves atraves de um cadastro ne pai kkkk daora tudo isso ai separa por pasta de usuario e coloca tudo os json dentro de um so
    //tirar todos os logs do back so deixar pro front, so deixar os de erro