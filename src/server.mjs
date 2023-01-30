import db from './lib/helpers/database.mjs';
import mongoose from 'mongoose'
import express from "express";
import bodyParser from 'body-parser';
import axios from 'axios';
import cronjob from './cronjob.mjs';
import crypto from 'crypto';

const app = express();
const connection = mongoose.connection;
const PORT = 3000;
// create application/json parser
var jsonParser = bodyParser.json()

const DOMMAIN_MAIN = "https://analyze-api.vercel.app/";
const TABLE_MAP = "MAP";
const TALBE_USER = "USER";
const TABLE_SESSION = "SESSION";

cronjob.CheckDomainMain();
cronjob.CheckDomain1();
cronjob.CheckDomain2();
cronjob.CheckDomain3();
cronjob.CheckDomain4();
// cronjob.SyncUserFromAPI();
// cronjob.SyncMapFromAPI();
// cronjob.CheckStatusUser();

app.get('/', async (req, res)  => {
    res.status(200).json({msg: "hello world" });
})

app.listen(PORT, () => console.log('server port: ' + PORT + ' running!'));
await db.conn();


//Delete Map
app.post('/deleteMap', jsonParser,async (req, res) =>  {
    var data = req.body;
    //Delete on Database
    try{
            const collection  = connection.db.collection(TABLE_MAP);
            collection.find({ phone: data.phone }).toArray().then(function(result){
                if(result != null && result.length > 0)
                {
                    db.deleteRecord(TABLE_MAP, result[0]._id, async (callback) => {
                        if(callback == null)
                        {
                            return res.status(200).json({ msg: "[ERROR] Not delete record Map in Database", code: -60 });
                        }
                        else
                        {
                            //Delete on API
                            try{
                                var text = data.phone;
                                let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
                                var model = { phone: text, signature:  hash}
                                await axios.post(DOMMAIN_MAIN + "/secrect/deleteMap", model)
                                .then(function (response){
                                    return res.status(200).json(response.data);
                                })
                            }
                            catch(e)
                            {
                                return res.status(200).json({msg: DOMMAIN_MAIN + "Not Call!", code: -69 });
                            }
                        } 
                    });
                }
                else
                {
                    return res.status(200).json({msg: "[ERROR] Not found record Map for Delete", code: -61 });
                }
            })
    }
    catch(e)
    {
        return res.status(200).json({msg: "[EXCEPTION] Not delete record Map", code: -62 });
    }
});

//Delete User
app.post('/deleteUser', jsonParser,async (req, res) =>  {
    var data = req.body;
    //Delete on Database
    try{
            const collection  = connection.db.collection(TALBE_USER);
            collection.find({ phone: data.phone }).toArray().then(function(result){
                if(result != null && result.length > 0)
                {
                    db.deleteRecord(TALBE_USER, result[0]._id, async (callback) => {
                        if(callback == null)
                        {
                            return res.status(200).json({msg: "[ERROR] Not delete record", code: -60 });
                        }
                        else{
                            //Delete on API
                            try{
                                var text = data.phone;
                                let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
                                var model = { phone: text, signature:  hash}
                                var resPost = await axios.post(DOMMAIN_MAIN + "/secrect/deleteUser", model);
                                return res.status(200).json(resPost.data);
                            }
                            catch(e)
                            {
                                return res.status(200).json({msg: DOMMAIN_MAIN + "/secrect/deleteUser" + "Not Call!", code: -69 });
                            }
                        }   
                    });
                }
                else{
                    return res.status(200).json({msg: "[ERROR] Not found record for Delete", code: -61 });
                }
            })
    }
    catch(e)
    {
        return res.status(200).json({msg: "[EXCEPTION] Not delete record", code: -62 });
    }
});

//Insert User
app.post('/addUser', jsonParser,function (req, res) {
    try{
        var data = req.body;
        var time = (new Date()).getTime();
        var text = "1234a@";
        let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
        db.addUser(TALBE_USER, data.phone, hash, time, async (callback) => {
            if(callback.insertedId == null)
            {
                return res.status(200).json({msg: "[ERROR] Not Insert record", code: -60 });
            }
            else{
                try{
                    var model = { data: { _id: callback.insertedId, phone: data.phone, pasword:  hash, createdtime: time, updatedtime: time, status: false } };
                    var resPost = await axios.post(DOMMAIN_MAIN + "/secrect/insertUser", model);
                    return res.status(200).json(resPost.data);
                }
                catch(ex)
                {
                    return res.status(200).json({msg: DOMMAIN_MAIN + "Not Call!", code: -69 });
                }
            }
        });
    }
    catch(e)
    {
        return res.status(200).json({msg: "[EXCEPTION] Not insert user", code: -62 });
    }
});

//Insert Session
app.post('/addSession', jsonParser,function (req, res) {
    try{
        var data = req.body;
        var time = (new Date()).getTime();
        db.addSession(TABLE_SESSION, data.phone, data.session, time, async (callback) => {
            if(callback.insertedId == null)
            {
                return res.status(200).json({msg: "[ERROR] Not Insert session", code: -60 });
            }
            return res.status(200).json({msg: "success", code: 1 });
        });
    }
    catch(e)
    {
        return res.status(200).json({msg: "[EXCEPTION] Not insert session", code: -62 });
    }
});

//Reset Password
app.post('/resetPassword', jsonParser,async (req, res) => {
    //Update on Database
    try{
        var time = (new Date()).getTime();
        var text = "1234a@";
        let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
        const collection  = connection.db.collection(TALBE_USER);
        collection.find({ phone: _phone }).toArray().then(function(result){
            if(result != null)
            {
                db.updateUser(TALBE_USER, result._id, _phone, hash, result.createdtime, time, result.status, async (callback) => {
                    if(callback == null)
                    {
                        return res.status(200).json({msg: "[ERROR] Not update user", code: -60 });
                    }
                    else{
                        try{
                            var model = { phone: _phone, pasword:  hash }
                            var resPost = await axios.post(DOMMAIN_MAIN + "/updatePassword", model);
                            return res.status(200).json(resPost.data);
                        }
                        catch(ex)
                        {
                            return res.status(200).json({msg: DOMMAIN_MAIN + "/updatePassword|"+ "Not Call!", code: -69 });
                        }
                    }
                });
            }
            else{
                return res.status(200).json({msg: "[ERROR] Not found user for update", code: -61 });
            }
        })
    }
    catch(e)
    {
        return res.status(200).json({msg: "[EXCEPTION] Not update record", code: -62 });
    }
});

//Sync User from Database to API
app.post('/syncUserToAPI', jsonParser,async (req, res) => {
    try{
        const collection  = connection.db.collection(TALBE_USER);
        collection.find({}).toArray().then(async function(result){
            if(result != null)
            {
                try{
                    var model = { lData: result.data };
                    var resPost = await axios.post(DOMMAIN_MAIN + "/secrect/insertUser", model);
                    return res.status(200).json(resPost.data);
                }
                catch(ex)
                {
                    return res.status(200).json({msg: DOMMAIN_MAIN + "/secrect/insertUser" + "Not Call!", code: -69 });
                }
            }
            else{
                return res.status(200).json({msg: "[ERROR] Not found users for sync", code: -61 });
            }
        })
    }
    catch(e)
    {
        return res.status(200).json({msg: "[EXCEPTION] Not sync user", code: -62 });
    }
});

//Sync Map from Database to API
app.post('/syncMapToAPI', jsonParser,async (req, res) => {
    try{
        const collection  = connection.db.collection(TABLE_MAP);
        collection.find({}).toArray().then(async function(result){
            if(result != null)
            {
                try{
                    var model = { lData: result.data };
                    var resPost = await axios.post(DOMMAIN_MAIN + "/secrect/insertMap", model);
                    return res.status(200).json(resPost.data);
                }
                catch(ex)
                {
                    return res.status(200).json({msg: DOMMAIN_MAIN + "/secrect/insertMap" + "Not Call!", code: -69 });
                }
            }
            else{
                return res.status(200).json({msg: "[ERROR] Not found maps for sync", code: -61 });
            }
        })
    }
    catch(e)
    {
        return res.status(200).json({msg: "[EXCEPTION] Not sync map", code: -62 });
    }
});

