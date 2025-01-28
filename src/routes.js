// routes.js
const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const {
    sleep,
    Reset_,
    Print_All_Chat_Data,
    Search_Chat_Data_By_Search,
    List_Directories,
    List_Active_Clients_,
    Erase_Chat_Data_By_Query,
    Erase_All_Chat_Data,
    Reload_Front, 
    Input_Command, 
    Erase_Client_,
    Destroy_Client_,
    Insert_Exponecial_Position_Client_,
    Reinitialize_Client_,
    Select_Client_,
    New_Client_,
    Set_Client_Name,
    Rename_Client_,
    initialize,
    Generate_MSG_Position_Id,
    Position_MSG_Erase,
    Insert_Exponecial_Position_MSG,
    New_Funil_,
    Insert_Exponecial_Position_Funil_,
    Select_Funil_,
    Erase_Funil_,
    New_Template_,
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
} = require('./app')

const upload = multer({ storage: multer.memoryStorage() }) // Armazena o arquivo em memória

router.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontEnd', 'index.html'))
        res.status(200).send({ sucess: true, message: `sucessfully get /.` })
    } catch (error) {
        console.error(`> ❌ ERROR /: ${error}`)
        res.status(500).send({ sucess: false, message: 'ERROR Internal server' })
    }
})

router.put('/funil/position-change', async (req, res) => {
    try {
        const { selectedId, toChangeFor } = req.body
        const { Sucess } = await Change_Position_MSG(selectedId, toChangeFor)
        res.status(200).send({ sucess: Sucess, message: `Sucessfully changed ${selectedId} on ${toChangeFor}.` })
    } catch (error) {
        console.error(`> ❌ ERROR /funil/send-data: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

router.put('/funil/send-data', upload.single('fileData'), async (req, res) => {
    try {
        let { typeMSG, MSGType, positionId, delayType, delayData, textareaData, fileType } = req.body
        positionId = parseInt(positionId)
        typeMSG = parseInt(typeMSG)
        //console.log('na rota: ', { typeMSG, MSGType, positionId, delayType, delayData, textareaData, fileType })
        const fileData = req.file
        //console.log('arquivo na rota: ', fileData)
        await Send_To_Funil(typeMSG, MSGType, positionId, delayType, delayData, textareaData, fileType, fileData)
        res.status(200).send({ sucess: true, message: `Sucessfully sent funil data.` })
    } catch (error) {
        console.error(`> ❌ ERROR /funil/send-data: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

router.get('/template/insert-front', async (req, res) => {
    try {
        const { Sucess, jsonTemplate } = await Insert_Template_Front()
        
        res.status(200).send({ sucess: Sucess, message: `Funil of Template_ ${Template_} inserted front.`, jsontemplate: jsonTemplate})
    } catch (error) {
        console.error(`> ❌ ERROR /template/insert-front: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`})
    }
})
router.delete('/template/erase', async (req, res) => {
    try {
        const Template_ = req.query.Templatet_
        const Funil_ = req.query.Funilt_
        let Is_From_End = false
        const { Sucess, Is_Empty, Is_Empty_Input, Not_Selected } = await Erase_Template_(Is_From_End, Template_, Funil_)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully erased ${Template_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to erase ${Template_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /template/erase: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, selected: null })
    }
})
router.post('/template/select', async (req, res) => {
    try {
        const { Template_ } = req.body
        
        await Select_Template_(Template_)
        
        res.status(200).send({ sucess: true, message: `Template_ ${Template_} selected.`})
    } catch (error) {
        console.error(`> ❌ ERROR /template/select: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`})
    }
})

router.get('/template/status-erase-schedule', async (req, res) => {
    try {
        const { Template_ } = req.body
        
        let eraseScheduleIs = await Status_Erase_Schedule(Template_)
        
        res.status(200).send({ sucess: true, message: `Status Erase_Schedule sent.`, erasescheduleis: eraseScheduleIs })
    } catch (error) {
        console.error(`> ❌ ERROR /template/status-erase-schedule: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, erasescheduleis: eraseScheduleIs })
    }
})
router.put('/template/set-erase-schedule', async (req, res) => {
    try {
        const { eraseScheduleIs } = req.body
        const { Sucess } = await Set_Erase_Schedule(eraseScheduleIs)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully set ${eraseScheduleIs} Erase Schedule.` })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to set ${eraseScheduleIs} Erase Schedule.` })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /template/set-erase-schedule: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})
router.get('/template/delay-info-erase-schedule', async (req, res) => {
    try {
        let { delayType, delayData } = await Delay_Info_Erase_Schedule()
        
        res.status(200).send({ sucess: true, message: `Info Erase_Schedule sent.`, delaytype: delayType, delaydata: delayData })
    } catch (error) {
        console.error(`> ❌ ERROR /template/delay-info-erase-schedule: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, delaytype: null, delaydata: null })
    }
})
router.put('/template/delay-update-erase-schedule', async (req, res) => {
    try {
        let { typeDelay, delayType, delayData } = req.body
        
        await Send_To_Template_Erase_Schedule(typeDelay, delayType, delayData)
        res.status(200).send({ sucess: true, message: `Sucessfully sent delay erase schedule data.` })
    } catch (error) {
        console.error(`> ❌ ERROR /template/delay-update-erase-schedule: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

router.get('/template/status-test-mode', async (req, res) => {
    try {
        const { Template_ } = req.body
        
        let { testModeIs, ReceiveMSG } = await Status_Test_Mode(Template_)
        
        res.status(200).send({ sucess: true, message: `Status Test_Mode sent.`, testmodeis: testModeIs, receivemsg: ReceiveMSG })
    } catch (error) {
        console.error(`> ❌ ERROR /template/status-test-mode: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, testmodeis: testModeIs })
    }
})
router.put('/template/set-test-mode', async (req, res) => {
    try {
        const { testModeIs } = req.body
        const { Sucess } = await Set_Test_Mode(testModeIs)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully set ${testModeIs} Test Funil.` })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to set ${testModeIs} Test Funil.` })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /template/set-test-mode: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})
router.put('/template/set-test-mode-receivemsg', async (req, res) => {
    try {
        const { ReceiveMSG } = req.body
        const { Sucess } = await Set_Receive_MSG(ReceiveMSG)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully set ${ReceiveMSG} Receive MSG.` })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to set ${ReceiveMSG} Receive MSG.` })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /template/set-test-mode-receivemsg: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})
router.get('/template/contact-info-test-mode', async (req, res) => {
    try {
        let { testContact } = await Contact_Info_Test_Mode()
        
        res.status(200).send({ sucess: true, message: `Info Test_Mode sent.`, testcontact: testContact })
    } catch (error) {
        console.error(`> ❌ ERROR /template/contact-info-test-mode: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, testcontact: testContact })
    }
})
router.put('/template/contact-update-test-mode', async (req, res) => {
    try {
        let { testContact } = req.body
        
        await Send_To_Template_Test_Mode(testContact)
        res.status(200).send({ sucess: true, message: `Sucessfully sent test contact data.` })
    } catch (error) {
        console.error(`> ❌ ERROR /template/contact-update-test-mode: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})
router.post('/template/initiate-test-mode', async (req, res) => {
    try {
        await Initiate_Test_Mode()
        res.status(200).send({ sucess: true, message: `Sucessfully initiated test mode.` })
    } catch (error) {
        console.error(`> ❌ ERROR /template/initiate-test-mode: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

router.get('/template/insert_exponecial_position_Template_', async (req, res) => {
    try {
        const arrayidnametemplates_ = req.query.arrayIdNameTemplates_
        const { idNumberTemplate_DivAdjacent, isFirstUndefined } = await Insert_Exponecial_Position_Template_(arrayidnametemplates_)
        
        res.status(200).send({ sucess: true, message: `Sucessfully sent the insert info exponecial position Template_.`, idnumbertemplate_divadjacent: idNumberTemplate_DivAdjacent, isfirstundefined: isFirstUndefined })
    } catch (error) {
        console.error(`> ❌ ERROR /template/insert_exponecial_position_Template_: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, idnumbertemplate_divadjacent: null, isfirstundefined: null })
    }
})
router.post('/template/new', async (req, res) => {
    try {
        //global.Is_From_New = true
        const { Sucess, Template_ } = await New_Template_()

        res.status(200).send({ sucess: Sucess, message: `New Funil_ created.`, Templatet_: Template_ })
    } catch (error) {
        console.error(`> ❌ ERROR /template/new: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, Funilt_: null })
    }
})

router.delete('/funil/erase', async (req, res) => {
    try {
        const Funil_ = req.query.Funilt_
        let Is_From_End = false
        const { Sucess, Is_Empty, Is_Empty_Input, Not_Selected } = await Erase_Funil_(Is_From_End, Funil_)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully erased ${Funil_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to erase ${Funil_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /funil/erase: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, selected: null })
    }
})
router.post('/funil/select', async (req, res) => {
    try {
        const { Funil_ } = req.body
        
        await Select_Funil_(Funil_)
        
        res.status(200).send({ sucess: true, message: `Funil_ ${Funil_} selected.`})
    } catch (error) {
        console.error(`> ❌ ERROR /funil/select: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`})
    }
})
router.get('/funil/insert_exponecial_position_Funil_', async (req, res) => {
    try {
        const arrayidnamefunils_ = req.query.arrayIdNameFunils_
        const isnew = req.query.isNew

        let isNew = null//esse bagui e preguicoso tbm e so pega por body muda ai e tals esse req pra body e deve ja n modificar as var
        if (isnew === 'true') {
            isNew = true
        } 
        if (isnew === 'false') {
            isNew = false
        }

        const { idNumberFunil_DivAdjacent, isFirstUndefined } = await Insert_Exponecial_Position_Funil_(arrayidnamefunils_, isNew)
        
        res.status(200).send({ sucess: true, message: `Sucessfully sent the insert info exponecial position Funil_.`, idnumberfunil_divadjacent: idNumberFunil_DivAdjacent, isfirstundefined: isFirstUndefined })
    } catch (error) {
        console.error(`> ❌ ERROR /funil/insert_exponecial_position_Funil_: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, idnumberfunil_divadjacent: null, isfirstundefined: null })
    }
})
router.post('/funil/new', async (req, res) => {
    try {
        //global.Is_From_New = true
        const { Sucess, Funil_ } = await New_Funil_()

        res.status(200).send({ sucess: Sucess, message: `New Funil_ created.`, Funilt_: Funil_ })
    } catch (error) {
        console.error(`> ❌ ERROR /funil/new: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, Funilt_: null })
    }
})
router.get('/funil/insert_exponecial_position_MSG', async (req, res) => {
    try {
        let arrayidnumberposition = req.query.arrayIdNumberPosition
        arrayidnumberposition = arrayidnumberposition.map(Number)
        const { idNumberPositionDivAdjacent, isFirstUndefined } = await Insert_Exponecial_Position_MSG(arrayidnumberposition)
        
        res.status(200).send({ sucess: true, message: `Sucessfully sent the insert info exponecial position MSG.`, idnumberpositiondivadjacent: idNumberPositionDivAdjacent, isfirstundefined: isFirstUndefined })
    } catch (error) {
        console.error(`> ❌ ERROR /funil/insert_exponecial_position_MSG: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, idnumberpositiondivadjacent: null, isfirstundefined: null })
    }
})
router.delete('/funil/erase-position-MSG', async (req, res) => {
    try {
        const idnumberposition = req.query.IdNumberPosition
        const Sucess = await Position_MSG_Erase(idnumberposition)
        
        res.status(200).send({ sucess: Sucess, message: `Sucessfully erased the MSG position (${idnumberposition}).` })
    } catch (error) {
        console.error(`> ❌ ERROR /funil/new-MSG: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, idpositionmsg: null })
    }
})
router.post('/funil/new-MSG', async (req, res) => {
    try {
        const Id_Position_MSG = await Generate_MSG_Position_Id()
        
        res.status(200).send({ sucess: true, message: `Sucessfully sent the new position ID MSG (${Id_Position_MSG}).`, idpositionmsg: Id_Position_MSG })
    } catch (error) {
        console.error(`> ❌ ERROR /funil/new-MSG: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, idpositionmsg: null })
    }
})

router.get('/api/data', async (req, res) => {
    try {
        res.status(200).send({ sucess: true, message: `sucessfully sent the router data.`, name: global.Bot_Name || 'BOT', version: global.Bot_Version_ || '?.?.?' })
    } catch (error) {
        console.error(`> ❌ ERROR /api/data: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, data: null, data2: null, data3: null })
    }
})

router.get('/back/what-stage', async (req, res) => {
    try {
        res.status(200).send({ sucess: true, message: `sucessfully get stage.`, data: global.Stage_, data2: global.QR_Counter, data3: global.Client_, data4: global.Funil_, data5: global.Template_ })
    } catch (error) {
        console.error(`> ❌ ERROR /back/what-stage: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, data: null, data2: null, data3: null })
    }
})

router.put('/back/reset', async (req, res) => {
    try {
        global.Is_Reset = false
        await Reset_()

        res.status(200).send({ sucess: true, message: `sucessfully code reset.`})
    } catch (error) {
        console.error(`> ❌ ERROR /back/reset: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, data: null, data2: null, data3: null })
    }
})

router.delete('/chatdata/query-erase', async (req, res) => {
    try {
        const query = req.query.queryList
        const Is_From_End = false
        const { Sucess, Is_Empty, Is_Empty_Input } = await Erase_Chat_Data_By_Query(query, Is_From_End)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `sucessfully erased ${query}.`, empty: Is_Empty, empty_input: Is_Empty_Input, chatdatajson: global.File_Data_Chat_Data })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to erase ${query}.`, empty: Is_Empty, empty_input: Is_Empty_Input, chatdatajson: global.File_Data_Chat_Data })
        }
    } catch (error) {
        console.error(`> ❌ ERROR chatdata/query-erase: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, chatdatajson: global.File_Data_Chat_Data })
    }
})
router.delete('/chatdata/all-erase', async (req, res) => {
    try {
        const Is_From_End = false
        const { Sucess, Is_Empty } = await Erase_All_Chat_Data(Is_From_End)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: 'Sucessfully erased all ChatData.', empty: Is_Empty, chatdatajson: global.File_Data_Chat_Data })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to erase all ChatData.`, empty: Is_Empty, chatdatajson: global.File_Data_Chat_Data })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /chatdata/all-erase: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, chatdatajson: global.File_Data_Chat_Data })
    }
})
router.get('/chatdata/search-print', async (req, res) => {
    try {
        const search = req.query.Search
        const { Sucess, Is_Empty, ChatData, Is_Empty_Input } = await Search_Chat_Data_By_Search(search)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully to sent the ChatData ${search}.`, empty: Is_Empty, chatdata: ChatData, empty_input: Is_Empty_Input, chatdatajson: global.File_Data_Chat_Data })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to sent the ChatData ${search}.`, empty: Is_Empty, chatdata: ChatData, empty_input: Is_Empty_Input, chatdatajson: global.File_Data_Chat_Data })
        }         
    } catch (error) {
        console.error(`> ❌ ERROR /chatdata/search-print: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, chatdata: [], empty_input: null, chatdatajson: global.File_Data_Chat_Data })
    }    
})
router.get('/chatdata/all-print', async (req, res) => {
    try {
        const isallerase = req.query.isallerase
        const { Sucess, Is_Empty, ChatData, Is_From_All_Erase } = await Print_All_Chat_Data(isallerase)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully send all ChatData.`, empty: Is_Empty, chatdata: ChatData, isallerase: Is_From_All_Erase, chatdatajson: global.File_Data_Chat_Data })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to send all ChatData.`, empty: Is_Empty, chatdata: ChatData, isallerase: Is_From_All_Erase, chatdatajson: global.File_Data_Chat_Data })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /chatdata/all-print: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, chatdata: [], isallerase: null, chatdatajson: global.File_Data_Chat_Data })
    }
})

router.get('/front/reload', (req, res) => {
    try {
        Reload_Front()
        res.status(200).send({ sucess: true, message: `Sucessfully get reload FrontEnd and send to BackEnd.`})
    } catch (error) {
        console.error(`> ❌ ERROR /front/reload: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

router.post('/features/command', express.json(), (req, res) => {
    try {
        const { command } = req.body
        let Is_Front_Back = false
        Input_Command(command, Is_Front_Back) 
        res.status(200).send({ sucess: true, message: `Sucessfully send command.`})
    } catch (error) {
        console.error(`> ❌ ERROR /features/command: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

router.get('/client/insert_exponecial_position_Client_', async (req, res) => {
    try {
        const arrayidnameclients_ = req.query.arrayIdNameClients_
        const { idNumberClient_DivAdjacent, isFirstUndefined } = await Insert_Exponecial_Position_Client_(arrayidnameclients_)
        
        res.status(200).send({ sucess: true, message: `Sucessfully sent the insert info exponecial position Client_.`, idnumberclient_divadjacent: idNumberClient_DivAdjacent, isfirstundefined: isFirstUndefined })
    } catch (error) {
        console.error(`> ❌ ERROR /client/insert_exponecial_position_Client_: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, idnumberclient_divadjacent: null, isfirstundefined: null })
    }
})
router.delete('/client/erase', async (req, res) => {
    try {
        const Client_ = req.query.Clientt_
        let Is_From_End = false
        const { Sucess, Is_Empty, Is_Empty_Input, Not_Selected } = await Erase_Client_(Is_From_End, Client_)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully erased ${Client_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to erase ${Client_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /client/erase: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, selected: null })
    }
})
router.put('/client/destroy', async (req, res) => {
    try {
        const { Clientt_ } = req.body
        let Is_From_End = false
        const { Sucess, Is_Empty, Is_Empty_Input, Not_Selected } = await Destroy_Client_(Is_From_End, Clientt_)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully detroyed ${Clientt_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to destroy ${Clientt_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /client/destroy: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, selected: null })
    }
})
router.put('/client/reinitialize', async (req, res) => {
    try {
        const { Clientt_ } = req.body
        const { Sucess, Is_Empty, Is_Empty_Input, Not_Selected } = await Reinitialize_Client_(Clientt_)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully reinitialized ${Clientt_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to reinitialize ${Clientt_}.`, empty: Is_Empty, empty_input: Is_Empty_Input, nselected: Not_Selected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /client/destroy: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, empty: null, empty_input: null, selected: null })
    }
})
router.post('/client/select', async (req, res) => {
    try {
        const { Client_ } = req.body
        
        await Select_Client_(Client_)
        
        res.status(200).send({ sucess: true, message: `Client_ ${Client_} selected.`})
    } catch (error) {
        console.error(`> ❌ ERROR /client/select: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`})
    }
})

router.get('/client/qr-code', (req, res) => {
    try {
        if (Qr_String === null) {
            res.status(200).send({ sucess: true, message: `Sucessfully send command.`, qrString: 'Client já Conectado ao Whatsrouter Web!', Is_Conected })
        } else {
            res.status(200).send({ sucess: true, message: `Sucessfully send command.`, qrString: Qr_String, Is_Conected })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /client/qr: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})
router.post('/client/new', async (req, res) => {
    try {
        const Client_Name = await Set_Client_Name(true)
        global.Namet_Client_ = null
        global.Is_From_New = true
        await New_Client_(Client_Name)

        res.status(200).send({ sucess: true, message: `New Client_ ${global.Client_} initialized.` })
    } catch (error) {
        console.error(`> ❌ ERROR /client/new: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})
router.put('/client/rename-client-name', async (req, res) => {
    try {
        const { Clientt_ } = req.body
        const { Sucess, clientt_ } = await Rename_Client_(Clientt_)
        if (Sucess) {
            res.status(200).send({ sucess: Sucess, message: `Sucessfully renamed ${Clientt_}.`, Clientt_: clientt_ })
        } else {
            res.status(200).send({ sucess: Sucess, message: `ERROR to rename ${Clientt_}.`, Clientt_: clientt_ })
        }
    } catch (error) {
        console.error(`> ❌ ERROR /client/rename-client-name: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, Clientt_: null })
    }
})

router.get('/functions/dir', async (req, res) => {//REST representacao de recurso
    try {
        const dirpath = req.query.dir_Path
        const Directories_ = await List_Directories(dirpath)
        
        res.status(200).send({ sucess: true, message: `All Clients_ dir sent.`, dirs: Directories_ })
    } catch (error) {
        console.error(`> ❌ ERROR /functions/dir: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, dirs: [] })
    }
})
router.get('/clients/active', async (req, res) => {//REST representacao de recurso
    try {
        const Actives_ = await List_Active_Clients_()
        
        res.status(200).send({ sucess: true, message: `All Actives Clients_ sent.`, actives: Actives_ })
    } catch (error) {
        console.error(`> ❌ ERROR /clients/active: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}`, actives: [] })
    }
})

router.get('/clients/start', async (req, res) => {
    try {
        const { Sucess } = await initialize()
        
        res.status(200).send({ sucess: Sucess, message: `Sucessfully started ${global.Bot_Name || 'BOT'}.` })
    } catch (error) {
        console.error(`> ❌ ERROR /clients/start: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

module.exports = router