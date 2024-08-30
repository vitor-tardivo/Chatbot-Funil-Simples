// routes.js
const express = require('express')
const router = express.Router()
const path = require('path')
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
    Reinitialize_Client_,
    Select_Client_,
    New_Client_,
    initialize,
} = require('./app')

router.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontEnd', 'index.html'))
        res.status(200).send({ sucess: true, message: `sucessfully get /.` })
    } catch (error) {
        console.error(`> ❌ ERROR /: ${error}`)
        res.status(500).send({ sucess: false, message: 'ERROR Internal server' })
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
        res.status(200).send({ sucess: true, message: `sucessfully get stage.`, data: global.Stage_, data2: global.QR_Counter, data3: global.Client_ })
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
        global.Is_From_New = true
        await New_Client_()

        res.status(200).send({ sucess: true, message: `New Client ${Clientt_} initialized.` })
    } catch (error) {
        console.error(`> ❌ ERROR /client/new: ${error}`)
        res.status(500).send({ sucess: false, message: `ERROR Internal server: ${error}` })
    }
})

router.get('/clients/dir', async (req, res) => {//REST representacao de recurso
    try {
        const Directories_ = await List_Directories('Local_Auth')
        
        res.status(200).send({ sucess: true, message: `All Clients_ dir sent.`, dirs: Directories_ })
    } catch (error) {
        console.error(`> ❌ ERROR /clients/dir: ${error}`)
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