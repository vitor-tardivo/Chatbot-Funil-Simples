// app.js Back_End
let Name_Software = 'bot'
let Version_ = '0.1.0'
console.log(`>  ℹ️ ${Name_Software} = v${Version_}`)
console.log(`>  ◌ Starting secundary functions...`)

const { Client, LocalAuth, MessageMedia, Buttons } = require('whatsapp-web.js')
const axios = require('axios');
const qrcode = require('qrcode-terminal')
const fs = require('fs').promises
const path = require('path')
const readline = require('readline')

function Reload_Front() {
    //console.error(`> ⚠️  Reloaded FrontEnd page`);
    //Is_First_Reaload = false
    //process.exit(1)
}

let Exit_Callback = null;
function Set_Exit_Callback(callback) {
    Exit_Callback = callback;
}
process.on('exit', (code) => {
    /*if (Is_Exceeds) {
        Is_Not_Ready = true
        Is_Exceeds = true
        if (Exit_Callback) Exit_Callback();
    }*/
    Is_Not_Ready = true
    console.error(`> ⚠️  Process exited with code(${code})`);
});

process.on('uncaughtException', (error) => {
    if (Exit_Callback) Exit_Callback();
    console.error(`> ❌ Uncaught Exception: ${error}`);
    //process.exit(1);
});

process.on('SIGUSR2', () => {// nodemon
    if (Exit_Callback) Exit_Callback();
    console.error('> ❌ Process interrupted: (SIGUSR2)');
    //process.exit(0);
});
process.on('SIGINT', () => {// Ctrl+C
    if (Exit_Callback) Exit_Callback();
    console.error('> ❌ Process interrupted: (SIGINT)');
    //process.exit(0);
});
process.on('SIGTERM', () => {// kill
    if (Exit_Callback) Exit_Callback();
    console.error('> ❌ Process interrupted: (SIGTERM)');
    //process.exit(0);
});
process.on('SIGHUP', () => {// terminal closed
    if (Exit_Callback) Exit_Callback();
    console.error('> ❌ Process interrupted: (SIGHUP)');
    //process.exit(0);
});

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const Data_File = 'Chat_Data.json'
const rootDir = path.resolve(__dirname, '..'); 
const CHAT_DATA_FILE = path.join(rootDir, 'Chat_Datas', 'Chat_Data.json');
const Chat_Data = new Map()

let Is_Not_Ready = true

//Patterns for Miliseconds times:
// Formated= 1 \ * 24 * 60 * 60 * 1000 = 1-Day
// Formated= 1 \ * 60 * 60 * 1000 = 1-Hour
// Formated= 1 \ * 60 * 1000 = 1-Minute
// Formated= 1 \ * 1000 = 1-Second

let Is_Schedule = false //On/Off = Schedule_Erase_Chat_Data
let Is_New = false/////////////////
let timer_Schedule = {}
let Is_timer_On = false

let timer_Duration_Formated_Schedule = 10
let timer_Duration_Type_Schedule = 'Seconds'
let timer_Duration_Schedule = 1000

let timer = 0
let timer_Duration_Type_MSG_ = ''
let timer_Duration_Formated_MSG_ = 0
let timer_Duration_MSG_ = 0
let timer_Duration_ = 0

let Start_Callback = null;
function Set_Start_Callback(callback) {
    Start_Callback = callback;
}
let Print_Callback = null;
function Set_Print_Callback(callback) {
    Print_Callback = callback;
}
let All_Erase_Callback = null;
function Set_All_Erase_Callback(callback) {
    All_Erase_Callback = callback;
}
let Search_List_Callback = null;
function Set_Search_List_Callback(callback) {
    Search_List_Callback = callback;
}
let Name_Erase_Callback = null;
function Set_Name_Erase_Callback(callback) {
    Name_Erase_Callback = callback;
}
//let Is_Erase = false
let Is_From_End = null
// Is_Front_Back - front = false, back = true
async function commands(command, Is_Front_Back) {
    if (Is_Not_Ready) {
        if (command === 'start') {
            if (Is_Front_Back) {
                initialize()
                return
            } else {
                if (Start_Callback) Start_Callback();
                return
            }
        }

        console.log('>  ℹ️ Client not Ready.')
        return
    } else {
        /*console.log(command)*/
        
        if (Is_Front_Back) {
            if (command === null) {
                console.log('>  ℹ️ Command not recognized.')
                return
            } else if (command === 'start') {
                console.log(`> ⚠️ Bot already Initialized`)
            }
            else if (command.startsWith('erase ')) {
                const chatName = command.substring(6).trim()
                if (chatName !== null) {
                    Is_From_End = true
                    await Erase_Chat_Data_By_Name(chatName, Is_From_End)
                } else {
                    console.log(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                }
            } else if (command === 'all erase') {
                Is_From_End = true
                await Erase_All_Chat_Data(Is_From_End)
            } else if (command.startsWith('print ')) {
                const chatName = command.substring(6).trim();
                if (chatName !== null) {
                    await Search_Chat_Data_By_Name(chatName);
                } else {
                    console.log(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                }
            } else if (command === 'all print') {
                await Print_All_Chat_Data()
                if (Print_Callback) Print_Callback();
            } else {
                console.log('>  ℹ️ Command not recognized.')
            }
        } else {
            /*if (Is_Erase) {
                Is_Erase = false
                Command_Confirm(command)
            }*/ 
            if (command === null) {
                console.log('>  ℹ️ Command not recognized.')
                return
            } else if (command === 'start') {
                console.log(`> ⚠️ Bot already Initialized`)
            } else if (command.startsWith('erase ')) {
                const chatName = command.substring(6).trim()
                if (chatName !== null) {
                    /*Is_Erase = true
                    Is_From_End = true
                    await Erase_Chat_Data_By_Name(chatName, Is_From_End)*/
                    if (Name_Erase_Callback) Name_Erase_Callback(chatName);
                } else {
                    console.log(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                }
            } else if (command === 'all erase') {
                if (All_Erase_Callback) All_Erase_Callback();
                
                /*Is_Erase = true
                Is_From_End = true
                await Erase_All_Chat_Data(Is_From_End)*/
            } else if (command.startsWith('print ')) {
                const chatName = command.substring(6).trim();
                if (chatName !== null) {
                    if (Search_List_Callback) Search_List_Callback(chatName);
                    //await Search_Chat_Data_By_Name(chatName);
                } else {
                    console.log(`> ⚠️  Specify a ChatName to erase ChatData from ${Data_File}, EXEMPLE:\nerase <contact-name>`)
                }
            } else if (command === 'all print') {
                await Print_All_Chat_Data()
                if (Print_Callback) Print_Callback();
            } else {
                console.log('>  ℹ️ Command not recognized.')
            }
        }
    }
}
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
            rl.write(command + '\n');
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
    /*if (command === null || command === undefined) {
        console.log('> ℹ️ Command not recognized.')
        return
    }*/
    command = command.trim()
    
    commands(command, Is_Front_Back)    
}
function askForConfirmation() {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        return
    } else {
        return new Promise((resolve) => {
            console.log('>  ℹ️ Confirm(Y/N)')
            rl.question('',(answer) => {
                resolve(answer.trim().toLowerCase())
            })
        })
    }
}

async function Load_Chat_Data() {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        return
    } else {
        try {
            console.log(`>  ◌ Loading ChatData from ${Data_File}...`)
            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            if (Data_.length === 0) {
                console.log(`> ⚠️  ${Data_File} is empty.`)
                await fs.writeFile(CHAT_DATA_FILE, '[\n\n]', 'utf8')
                return
            }
            const Parse_Data = JSON.parse(Data_)
            Parse_Data.forEach(entry => Chat_Data.set(entry.chatId, entry.name))
            
            const organizedData = Array.from(Chat_Data.entries()).map(([chatId, name]) => ({ chatId, name }))
            const jsonString = '[\n' + organizedData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            
            await fs.writeFile(CHAT_DATA_FILE, jsonString, 'utf8')

            console.log(`> ✅ ChatData loaded from ${Data_File}.`)
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`> ⚠️  ${Data_File} does not exist.`)
                console.log(`>  ◌ Creating ${Data_File}...`)
                await fs.writeFile(CHAT_DATA_FILE, '[\n\n]', 'utf8')
                console.log(`> 📄 Created: ${Data_File}`)
            } else {
                console.error(`> ⚠️  ERROR loading ChatData from ${Data_File}:`, error)
            }
        }
    }
}

function Schedule_Erase_Chat_Data(chatId, timeout) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        return
    } else {
        Is_timer_On = true
        timer_Schedule[chatId] = setTimeout(async () => {
            try {
                Chat_Data.delete(chatId)
                Is_New = false
                await Save_Chat_Data(Is_New)
                console.log(`> 🚮 Timer FINALIZED ChatData for ${chatId} ERASED after ${timeout / timer_Duration_Schedule} ${timer_Duration_Type_Schedule} from ${Data_File}.`)
                delete timer_Schedule[chatId]
            } catch (error) {
                console.error(`> ⚠️ ERROR deleting ChatData for ${chatId} from ${Data_File}:`, error)
            }
        }, timeout)
    }
}
let List_Callback = null;
function Set_List_Callback(callback) {
    List_Callback = callback;
}
async function Save_Chat_Data(Is_New) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        return
    } else {
        try {
            console.log(`>  ◌ Saving ChatData to ${Data_File}...`)
            
            const Data_ = Array.from(Chat_Data.entries()).map(([chatId, name]) => ({ chatId, name }))
            const reversedData = Data_.reverse();
            const jsonString = '[\n' + reversedData.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            await fs.writeFile(CHAT_DATA_FILE, jsonString, 'utf8')
            
            console.log(`> 💾 ChatData saved to ${Data_File}.`)

            if (Is_Schedule && Is_New) {
                Is_New = false
                for (const { chatId } of Data_) {
                    if (!timer_Schedule[chatId]) {
                        console.log(`> ⏲️  Timer STARTING for ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${Data_File}...`)
                        Schedule_Erase_Chat_Data(chatId, timer_Duration_Formated_Schedule * timer_Duration_Schedule)
                    }
                }
            }

            if (List_Callback) List_Callback();
        } catch (error) {
            console.error(`> ⚠️ ERRROR saving ChatData to ${Data_File}:`, error)
        }
    }
}

let Empty_List_Callback = null;
function Set_Empty_List_Callback(callback) {
    Empty_List_Callback = callback;
}
async function Erase_All_Chat_Data(Is_From_End) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        return
    } else {
        try {
            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            const Parse_Data = JSON.parse(Data_)
            if (Parse_Data.every(entry => !entry.chatId)) {
                console.log(`> ⚠️  ${Data_File} is empty, does not contain any chat data.`)
                if (Empty_List_Callback) Empty_List_Callback();
                return
            }

            if (Is_From_End) {
                console.log(`> ⚠️  Are you sure that you want to erase all ChatData from ${Data_File}?`)
                const answer = await askForConfirmation()
                if (answer.toLowerCase() === 'y') {
                    console.log(`>  ◌ Erasing all ChatData from ${Data_File}...`)
                    for (const chatId in timer_Schedule) {
                        clearTimeout(timer_Schedule[chatId])
                        delete timer_Schedule[chatId]
                        if (Is_timer_On) {
                            console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${Data_File}.`)
                            Is_timer_On = false
                        }
                    }
                    Chat_Data.clear()
                    Is_New = false
                    await Save_Chat_Data(Is_New)
                    console.log(`> ✅ All ChatData from ${Data_File}: ERASED.`)
                    Is_From_End = null
                    return
                } else if (answer.toLowerCase() === 'n') {
                    console.log(`> ⚠️  All ChatData from ${Data_File}: DECLINED.`)
                    Is_From_End = null
                    return
                } else {
                    console.log(`> ⚠️  All ChatData from ${Data_File}: NOT Answered to erase.`)
                    Is_From_End = null
                    return
                }
            } else {
                console.log(`>  ◌ Erasing all ChatData from ${Data_File}...`)
                for (const chatId in timer_Schedule) {
                    clearTimeout(timer_Schedule[chatId])
                    delete timer_Schedule[chatId]
                    if (Is_timer_On) {
                        console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatId} from ${Data_File}.`)
                        Is_timer_On = false
                    }
                }
                Chat_Data.clear()
                Is_New = false
                await Save_Chat_Data(Is_New)
                console.log(`> ✅ All ChatData from ${Data_File}: ERASED.`)
                Is_From_End = null
                return
            }
        } catch (error) {
            console.error(`> ⚠️ ERROR erasing all ChatData from ${Data_File}:`, error)
            Is_From_End = null
        }
    }
}
async function Erase_Chat_Data_By_Name(chatName, Is_From_End) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        return
    } else {
        try {
            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            const Parse_Data = JSON.parse(Data_)
            if (Parse_Data.every(entry => !entry.chatId)) {
                console.log(`> ⚠️  ${Data_File} is empty, does not contain any chat data.`)
                if (Empty_List_Callback) Empty_List_Callback();
                Is_From_End = null
                return
            }
            let erased = false
            const normalizedChatName = chatName.toLowerCase()
            let chatIdToErase = null

            for (const [chatId, name] of Chat_Data.entries()) {
                const normalizedEntryName = name.toLowerCase()
                if (Is_From_End) {
                    if (normalizedEntryName === normalizedChatName) {
                        console.log(`> ⚠️  Are you sure that you want to erase ${chatName} from ${Data_File}?`)
                        const answer = await askForConfirmation()
                        if (answer.toLowerCase() === 'y') {
                            console.log(`>  ◌ Erasing ${chatName} ChatData from ${Data_File}...`)
                            chatIdToErase = chatId
                            Chat_Data.delete(chatId)
                            erased = true
                            Is_From_End = null
                        } else if (answer.toLowerCase() === 'n') {
                            console.log(`> ⚠️  ChatData for ${chatName} from ${Data_File}: DECLINED.`)
                            Is_From_End = null
                            return
                        } else {
                            console.log(`> ⚠️  ChatData for ${chatName} from ${Data_File}: NOT Answered to erase.`)
                            Is_From_End = null
                            return
                        }
                        break
                    } else {
                        console.log(`> ⚠️  ChatData for ${chatName} from ${Data_File}: NOT Found.`)
                        Is_From_End = null
                        return
                    }
                } else {
                    if (normalizedEntryName === normalizedChatName) {
                        console.log(`>  ◌ Erasing ${chatName} ChatData from ${Data_File}...`)
                        chatIdToErase = chatId
                        Chat_Data.delete(chatId)
                        erased = true
                    } else {
                        console.log(`> ⚠️  ChatData for ${chatName} from ${Data_File}: NOT Found.`)
                        return
                    }
                }
            }

            if (erased) {
                clearTimeout(timer_Schedule[chatIdToErase])
                delete timer_Schedule[chatIdToErase]
                if (Is_timer_On) {
                    console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_Schedule} ${timer_Duration_Type_Schedule} to ERASE ChatData for ${chatIdToErase} from ${Data_File}.`)
                    Is_timer_On = false
                }
                Is_New = false
                await Save_Chat_Data()
                console.log(`> ✅ ChatData for ${chatName} from ${Data_File}: ERASED`)
                Is_From_End = null
            }
        } catch (error) {
            console.error(`> ⚠️ ERROR erasing ChatData from ${Data_File}:`, error)
            Is_From_End = null
        }
    }
}
async function Print_All_Chat_Data() {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        return []
    } else {
        try {
            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            const Parse_Data = JSON.parse(Data_)
            
            if (Parse_Data.length === 0) {
                console.log(`> ⚠️  ${Data_File} is empty.`)
                return []
            }
            
            console.log(`>  ◌ Printing ChatData from ${Data_File}...`)
            
            console.log('> ↓↓💬ALL ChatData Printed💬↓↓')
            Parse_Data.forEach(entry => {
                console.log(`- ChatId: ${entry.chatId} = Name: ${entry.name}`)
            })
            return Parse_Data
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`> ⚠️  ${Data_File} does not exist.`)
            } else {
                console.error(`> ⚠️  ERROR printing ChatData from ${Data_File}:`, error)
                return []
            }
        }
    }
}
async function Search_Chat_Data_By_Name(search) {
    if (Is_Not_Ready) {
        console.log('>  ℹ️ Client not Ready.')
        return []
    } else {
        try {
            const Data_ = await fs.readFile(CHAT_DATA_FILE, 'utf8')
            const Parse_Data = JSON.parse(Data_)
            
            if (Parse_Data.length === 0) {
                console.log(`> ⚠️  ${Data_File} is empty.`)
                return true
            }
            const normalizedName = search.toLowerCase();
            const chatEntries = Array.from(Chat_Data.entries()).filter(([_, chatName]) => chatName.toLowerCase().includes(normalizedName));
            
            if (chatEntries.length === 0) {
                console.log(`> ⚠️  No ChatData found for the name: ${search}.`);
                return []
            }

            console.log(`>  ◌ Printing ChatData for ${search} from ${Data_File}...`)
            
            console.log(`> ↓↓💬${search} Printed💬↓↓`);
            chatEntries.forEach(([chatId, chatName]) => {
                console.log(`- ChatId: ${chatId} = Name: ${chatName}`);
            });

            const formattedData = chatEntries.map(([chatId, chatName]) => ({
                chatId,
                name: chatName
            }));

            return formattedData
        } catch (error) {
            console.error(`> ⚠️ ERROR searching ChatData by name ${search}:`, error);
            return []
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
let QrCode_On_Callback = null;
function Set_QrCode_On_Callback(callback) {
    QrCode_On_Callback = callback;
}
let QrCode_Exceeds_Callback = null;
function Set_QrCode_Exceeds_Callback(callback) {
    QrCode_Exceeds_Callback = callback;
}
let Auth_Autenticated_Callback = null;
function Set_Auth_Autenticated_Callback(callback) {
    Auth_Autenticated_Callback = callback;
}
let Auth_Failure_Callback = null;
function Set_Auth_Failure_Callback(callback) {
    Auth_Failure_Callback = callback;
}
let Ready_Callback = null;
function Set_Ready_Callback(callback) {
    Ready_Callback = callback;
}
//let Is_Exceeds = true
let QR_Counter_Exceeds = 3
try {
    client.on('qr', async qr => {
        global.QR_Counter++
        global.Stage_ = 1
        if (global.QR_Counter <= QR_Counter_Exceeds) { 
            console.log(`> ↓↓ 📸 Client try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code below 📸 ↓↓`)
            qrcode.generate(qr, { small: true })
            qrcode.generate(qr, { small: true }, (Qr_String_Ascii) =>{
                global.Is_Conected = false
                global.Qr_String = Qr_String_Ascii

                if (QrCode_On_Callback) QrCode_On_Callback(true, global.QR_Counter);
            })
            console.log(`> ↑↑ 📸 Client try to Connect for the ${global.QR_Counter}º to WhatsApp Web by the QR-Code above 📸 ↑↑`)
        } else {
            global.QR_Counter = 0
            global.Stage_ = 0
            if (QrCode_Exceeds_Callback) QrCode_Exceeds_Callback(QR_Counter_Exceeds);
            console.log(`> ❌ Maximum QR_Code retries Exceeds(${QR_Counter_Exceeds}).`)
            //console.log(`>  ◌ Exiting...`)
            //Is_Exceeds = false
            //process.exit(1)
            client.destroy()
            console.log(`>  ℹ️ Retry again.`)
        }
    })
} catch (error) {
    console.log(`> ❌ ERROR connecting Client to WhatsApp Web by the QR_Code:`, error)
}
client.on('authenticated', async () => {
    global.Qr_String = ''
    global.QR_Counter = 0
    global.Stage_ = 2
    if (Auth_Autenticated_Callback) Auth_Autenticated_Callback();
    console.log('> 🔑 SUCESSIFULLY Client Authenticated by the Local_Auth.')
})
client.on('auth_failure', async error => {
    global.Qr_String = ''
    global.QR_Counter = 0
    global.Stage_ = 0
    if (Auth_Failure_Callback) Auth_Failure_Callback();
    console.error('>  ⚠️  ERROR Authentication Client to WhatsApp Web by the Local_Auth:', error)
})
client.on('ready', async () => {
    global.Qr_String = ''
    global.QR_Counter = 0
    global.Stage_ = 2
    if (Ready_Callback) Ready_Callback();
    global.Is_QrCode_On = false
    global.QR_Counter = 1
    console.log(`> ✅ Client is READY.`)
    Is_Not_Ready = false
    await Load_Chat_Data()
    console.log(`> ✅ FINISHED(Starting primary functions: Bot)`)
})

let Count_MSG = 0
//message //actual
//message_create //debug
client.on('message_create', async msg => {
    const chat = await msg.getChat()
    const chatId = chat.id._serialized
    const contact = await chat.getContact()
    const contactName = chat.name || contact.pushname || contact.verifiedName || 'Unknown'

    let debug_MSG = false //debug
    
    let Content_ = '?UNKNOWN?'
    if (msg.hasMedia) {
        const media = await msg.downloadMedia()
        if (media) {
            if (media.mimetype.startsWith('image')) {
                Content_ = '📷IMAGE📷'
                //debug_MSG = true; //debug
            } else if (media.mimetype.startsWith('video')) {
                Content_ = '📹VIDEO📹'
                //debug_MSG = true; //debug
            } else if (media.mimetype.startsWith('audio')) {
                Content_ = '🎵AUDIO🎵'
                //debug_MSG = true; //debug
            } else if (media.mimetype.startsWith('document')) {
                Content_ = '📄DOCUMENT📄'
                //debug_MSG = true; //debug
            } else {
                console.log(`NEW MEDIA`)
                Content_ = '?UNKNOWN?'
                //debug_MSG = true; //debug
            }
        }
    } else {
        Content_ = msg.body
        if (Content_ === '.') { //debug
            debug_MSG = true
        }
            
    }

    if (chat.isGroup) {
        //console.log(`>  ℹ️ ${chatId} - ${contactName} = (GRO)(IGNORED): 💬 ${Content_}`)
        //console.log(`>  ℹ️ ${contactName} = (GRO)(IGNORED): 💬 ${Content_}`)
        //console.log(`>  ℹ️ ${chatId} - ${contactName} = (GRO): 💬 ${Content_}`)
        console.log(`>  ℹ️ ${contactName} = (GRO): 💬 ${Content_}`)
        return
    } else {
        //console.log(`>  ℹ️ ${chatId} - ${contactName} = (IN)(DEBUG): 💬 ${Content_}`)
        //console.log(`>  ℹ️ ${contactName} = (IN)(DEBUG): 💬 ${Content_}`)
        //console.log(`>  ℹ️ ${chatId} - ${contactName} = (IN): 💬 ${Content_}`)
        //console.log(`>  ℹ️ ${contactName} = (IN): 💬 ${Content_}`)
    }

    if (Chat_Data.has(chatId)) {
        if (Chat_Data.get(chatId) !== contactName) {
            console.log(`> ⚠️  ${chatId} - ${contactName} = (IN)(DIFERENT NAME): 💬 ${Content_}`)
            console.log(`> ${chatId} = Already exists: ${Chat_Data.get(chatId)} - Updating to - ${contactName}...`)
            
            Chat_Data.set(chatId, contactName)

            console.log(`>  ◌ Saving UPDATED ChatData to ${Data_File}...`)

            const Data_ = Array.from(Chat_Data.entries()).map(([chatId, name]) => ({ chatId, name }))
            const jsonString = '[\n' + Data_.map(item => '\t' + JSON.stringify(item)).join(',\n') + '\n]'
            await fs.writeFile(CHAT_DATA_FILE, jsonString, 'utf8')
            
            console.log(`> 💾 ChatData UPDATE saved to ${Data_File}.`)

            if (List_Callback) List_Callback();

            return
        } else {
            if (Count_MSG !== 2 ) {
                //console.log(`>  ℹ️ ${chatId} - ${contactName} = (IN)(SAVED): 💬 ${Content_}`)
                return
            }
        }
    }

    //Content_ !== null //actual
    //debug_MSG //debug
    if (debug_MSG) {
        try {

            //debug
            let timer_Duration_Type_MSG_debug = timer_Duration_Type_MSG_ 
            let timer_Duration_Formated_MSG_debug = timer_Duration_Formated_MSG_
            let timer_Duration_MSG_debug = timer_Duration_MSG_
            
            timer_Duration_Type_MSG_debug = 'Seconds'
            timer_Duration_Formated_MSG_debug = 10
            timer_Duration_MSG_debug = 1000

            if (Count_MSG === 0) {
                console.log(`> ✨ ${chatId} - ${contactName} = (IN)(NEW): 💬 ${Content_}`)
                console.log(`>  ◌ ${chatId} - ${contactName} Sending ALL Messages...`)
                Count_MSG++
            }
            if(Count_MSG === 1) {
                console.log(`>  ◌ ${chatId} - ${contactName} Sending .Message1....`)
                const Text_ = await fs.readFile('./Debug_MSG/Debug_Text.txt', 'utf8')
                client.sendMessage(msg.from, Text_)
                console.log(`> ✅ ${chatId} - ${contactName} .Message1. Sent.`)
            } 
            if (Count_MSG === 1) {
                timer_Duration_ = timer_Duration_Formated_MSG_debug * timer_Duration_MSG_debug
                
                console.log(`> ⏲️  Timer STARTING for ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message...`)
                Count_MSG++
                timer = setTimeout(async () => {
                    console.log(`> ⏰ Timer FINALIZED ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                    console.log(`>  ◌ ${chatId} - ${contactName} Sending .Message3....`)
                    const Text_3 = await fs.readFile('./Debug_MSG/Debug3_Text.txt', 'utf8')
                    await client.sendMessage(msg.from, Text_3)
                    console.log(`> ✅ ${chatId} - ${contactName} .Message3. Sent.`)
                    Count_MSG = 0
                    console.log(`> ✅ ${chatId} - ${contactName} ALL Messages Sent.`)
                    Chat_Data.set(chatId, contactName)
                    Is_New = true
                    await Save_Chat_Data(Is_New)
                }, timer_Duration_)
                return
            }
            if (Count_MSG > 1) {
                clearTimeout(timer)
                console.log(`>  ℹ️ Timer ended BEFORE ${timer_Duration_Formated_MSG_debug} ${timer_Duration_Type_MSG_debug} to send NEXT message.`)
                console.log(`>  ◌ ${chatId} - ${contactName} Sending .Message2....`)
                const Text_2 = await fs.readFile('./Debug_MSG/Debug2_Text.txt', 'utf8')
                await client.sendMessage(msg.from, Text_2)
                console.log(`> ✅ ${chatId} - ${contactName} .Message2. Sent.`)
                Count_MSG = 0
                console.log(`> ✅ ${chatId} - ${contactName} ALL Messages Sent.`)
                Chat_Data.set(chatId, contactName)
                Is_New = true
                await Save_Chat_Data(Is_New)
            }
            //debug
            
        } catch (error) {
            console.error(`> ⚠️ Error sending messages:`, error)
        } 
    }
})

console.log(`> ✅ FINISHED(Starting secundary functions)`)

//debug
/*console.log(`>  ℹ️ ${name} = v${version}`)
console.log(`>  ◌ Starting primary functions: Bot...`)
client.initialize()*/

async function initialize() {
    console.log(`>  ◌ Starting primary functions: Bot...`)
    await client.initialize()
}

module.exports = {
    Set_Start_Callback,
    Set_Exit_Callback,
    Reload_Front,
    initialize,
    Input_Command,
    Set_QrCode_On_Callback,
    Set_QrCode_Exceeds_Callback,
    Set_Auth_Autenticated_Callback,
    Set_Auth_Failure_Callback,
    Set_Ready_Callback,
    Print_All_Chat_Data,
    Set_Print_Callback,
    Set_List_Callback,
    Search_Chat_Data_By_Name,
    Erase_All_Chat_Data,
    Set_Empty_List_Callback,
    Set_All_Erase_Callback,
    Set_Search_List_Callback,
    Erase_Chat_Data_By_Name,
    Set_Name_Erase_Callback
}

//tarefas bot backend 
//em desenvolvimento...


//a desenvolver...
    //desenvolver o desenvolvimento de funils padroes de msg automaticas para o bot e implantar front end, principalmente front end so vai ser possivel mexer com isso la
    //descobrir pq ta dando erro apagar por nome ou total os chatdata de vez em quando
    //melhorar as acoes de erros, de se atualiza a pagina do front end e executa o reinicio do backend e todos os outros tipos
    //melhoras os logs de conexao do websocket backend e frontend
    //arrumar de nao reconhecer direito documentos no chat whatsapp, ta caindo como ?UNKNOWN? NEW MEDIA
    //arrumar de o backend nunca resetar com or reload do front e o front pular pra etapa que o backend tiver, dependendo de onde tiver o frontend ai sim resetar o backend mas talves pra n o inicio tudo
    //organizar a ordem de como as funcoes sao chamadas pra um melhor desempenho e sentido logico
    //tornar possivel varias instancias com client do wweb.js possivel varios numeros conectados na mesma conta e diferentes contas ao mesmo tempo
    //modificar as pesquisar delete por nome ou print por nome pra aceitar o numero tbm
    //melhorar a logica de usar a mesma funcao pra duas coisas
    //melhorar o reconhecimento do arquivo json estar vazio e as acoes sobre, status e tals
    //adicionar debug pra quando o client desconecta o whatsapp web do bot, nao fazer dar error total e so continuar no caso resetar e tals
    //melhorar trazer os logs do backend a dedo e trazer o efeito de error tbm caso for um log disso
    //se ainda existe encontrar variaveis Is e resetalas a qualquer erro que tiver que n seja de resetar tudo nos locais de debug de erro, sinca com o front end e tals
    //adicionar pra nao executar comandos funcoes pra front end caso o front end n esteja conectado no caso quando estiver so rodando o backend as os funils funcionando sem ta no site com requesicao http e de Is e tals