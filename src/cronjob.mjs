import cron from "cron";
import db from './lib/helpers/database.mjs';
import axios from 'axios';
import crypto from 'crypto';
import mongoose from 'mongoose'

const connection = mongoose.connection;

const DOMMAIN_MAIN = "https://analyze-api.vercel.app/";
// const DOMMAIN_MAIN = "http://localhost:8999/";
const DOMAIN_SUB1 = "https://asutaka-subcribe1.onrender.com/";
const DOMAIN_SUB2 = "https://asutaka-subcribe2.onrender.com/";
const DOMAIN_SUB3 = "https://asutakaoutlook-subcribe3.onrender.com/";
const DOMAIN_SUB4 = "https://asutakaoutlook-subcribe4.onrender.com/";
const DOMAIN_SUB5 = "https://nguyenphuict-subcribe5.onrender.com/";
const DOMAIN_SUB6 = "https://nguyenphuict-subcribe6.onrender.com/";
const DOMAIN_SUB7 = "https://asutakayahoo-subcribe7.onrender.com/";
const DOMAIN_SUB8 = "https://asutakayahoo-subcribe8.onrender.com/";
const TABLE_MAP = "MAP";
const TALBE_USER = "USER";
const TABLE_SESSION = "SESSION";

const CheckDomainMain = () => {
    new cron.CronJob('30 0/3 * * * *', async () => {
        try{
            var date = (new Date()).getTime();
            var result = await axios.get(DOMMAIN_MAIN)
            .catch(function (error) {
                console.log("Exception when call: " + DOMMAIN_MAIN);
            });
            if(result != null)
            {
                console.log(date + "|" + DOMMAIN_MAIN + "|", result.data);
            }
        }
        catch(error)
        {
            console.error("CheckDomainMain", error.response.data);
        }
    }).start();
};

const CheckDomain1 = () => {
    new cron.CronJob('30 1/3 * * * *', async () => {
        try{
            var date = (new Date()).getTime();
            var result1 = await axios.get(DOMAIN_SUB1)
            .catch(function (error) {
                console.log("Exception when call: " + DOMAIN_SUB1);
            });
            if(result1 != null)
            {
                console.log(date + "|" + DOMAIN_SUB1 + "|", result1.data);
            }
    
            var result2 = await axios.get(DOMAIN_SUB2)
            .catch(function (error) {
                console.log("Exception when call: " + DOMAIN_SUB2);
            });
            if(result2 != null)
            {
                console.log(date + "|" + DOMAIN_SUB2 + "|", result2.data);
            }
        }
        catch(error)
        {
            console.error("CheckDomain1", error.response.data);
        }
    }).start();
};

const CheckDomain2 = () => {
    new cron.CronJob('30 3/3 * * * *', async () => {
        try{
            var date = (new Date()).getTime();
            var result1 = await axios.get(DOMAIN_SUB3)
            .catch(function (error) {
                console.log("Exception when call: " + DOMAIN_SUB3);
            });
            if(result1 != null)
            {
                console.log(date + "|" + DOMAIN_SUB3 + "|", result1.data);
            }
    
            var result2 = await axios.get(DOMAIN_SUB4)
            .catch(function (error) {
                console.log("Exception when call: " + DOMAIN_SUB4);
            });
            if(result2 != null)
            {
                console.log(date + "|" + DOMAIN_SUB4 + "|", result2.data);
            }
        }
        catch(error)
        {
            console.error("CheckDomain2", error.response.data);
        }
    }).start();
};

const CheckDomain3 = () => {
    new cron.CronJob('30 5/3 * * * *', async () => {
        try{
            var date = (new Date()).getTime();
            var result1 = await axios.get(DOMAIN_SUB5)
            .catch(function (error) {
                console.log("Exception when call: " + DOMAIN_SUB5);
            });
            if(result1 != null)
            {
                console.log(date + "|" + DOMAIN_SUB5 + "|", result1.data);
            }
    
            var result2 = await axios.get(DOMAIN_SUB6)
            .catch(function (error) {
                console.log("Exception when call: " + DOMAIN_SUB6);
            });
            if(result2 != null)
            {
                console.log(date + "|" + DOMAIN_SUB6 + "|", result2.data);
            }
        }
        catch(error)
        {
            console.error("CheckDomain3", error.response.data);
        }
    }).start();
};

const CheckDomain4 = () => {
    new cron.CronJob('30 7/3 * * * *', async () => {
        try{
            var date = (new Date()).getTime();
            var result1 = await axios.get(DOMAIN_SUB7)
            .catch(function (error) {
                console.log("Exception when call: " + DOMAIN_SUB7);
            });
            if(result1 != null)
            {
                console.log(date + "|" + DOMAIN_SUB7 + "|", result1.data);
            }
            
    
            var result2 = await axios.get(DOMAIN_SUB8)
            .catch(function (error) {
                console.log("Exception when call: " + DOMAIN_SUB8);
            });
            if(result2 != null)
            {
                console.log(date + "|" + DOMAIN_SUB8 + "|", result2.data);
            }
        }
        catch(error)
        {
            console.error("CheckDomain4", error.response.data);
        }
    }).start();
};

const SyncUserFromAPI = () => {
    new cron.CronJob('30 5 * * * *', async () => {
        var arrSync = [];
        try{
            const collection  = connection.db.collection(TALBE_USER);
            var text = "users";
            let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
            axios.get(DOMMAIN_MAIN + 'secret/users/' + hash).then(async (response) => {
                if(response != null && response.data.data.length > 0)
                {
                    response.data.data.forEach((item) => {
                        if(item.status == true)
                        {
                            arrSync.push(item);
                        }
                    }); 

                    const sleep = ms =>
                    new Promise(res => {
                        setTimeout(res, ms)
                    })

                    const myPromise = num =>
                    sleep(5000).then(async () => {
                        //Update to database
                        try{
                            collection.find({ phone: num.phone }).toArray().then(function(result){
                                if(result != null && result.length > 0)
                                {
                                    var item = result[0];
                                    if(result[0].password != num.password)
                                    {
                                        //update lai db
                                        db.updateUser(TALBE_USER, item._id, item.phone, num.password, item.createdtime, item.updatedtime, item.status, (callback) => {
                                            // console.log("callback", callback);
                                        });
                                    }
                                }
                            });
                        }
                        catch(e)
                        {
                            console.log("[EXCEPTION] Database cannot update record| " + e);
                        }
                    })

                    const forEachSeries = async (iterable, action) => {
                        for (const x of iterable) {
                            await action(x)
                        }
                    }

                    forEachSeries(arrSync, myPromise)
                    .then(() => {
                        console.log('all done!')
                    })
                }
            })
            .catch(function (error) {
                console.log("Exception when call: " + DOMMAIN_MAIN + 'secret/users/' + hash);
            });
        }
        catch(ex)
        {
            console.log("[ERROR] NOT sync User from API");
        }
    }).start();
};

const SyncMapFromAPI = () => {
    // new cron.CronJob('0/10 * * * * *', async () => {
    new cron.CronJob('30 10/30 * * * *', async () => {
        var arr = [];
        try{
            const collection  = connection.db.collection(TABLE_MAP);
            var text = "maps";
            let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
            axios.get(DOMMAIN_MAIN + 'secret/maps/' + hash).then(async (response) => {
                if(response != null && response.data.data.length > 0){
                    response.data.data.forEach((item) => {
                        arr.push(item);
                    }); 

                    const sleep = ms =>
                    new Promise(res => {
                        setTimeout(res, ms)
                    })

                    const myPromise = num =>
                    sleep(5000).then(async () => {
                        //Insert to database
                        try{
                            collection.find({ phone: num.phone }).toArray().then(function(result){
                                if(result == null || result.length == 0)
                                {
                                    //insert map
                                    db.addMap(TABLE_MAP, num.phone, num.chatId, (callback) => {
                                        // console.log("callback", callback);
                                    });
                                }
                            });
                        }
                        catch(e)
                        {
                            console.log("[EXCEPTION] Database cannot update record| " + e);
                        }
                    })

                    const forEachSeries = async (iterable, action) => {
                        for (const x of iterable) {
                            await action(x)
                        }
                    }

                    forEachSeries(arr, myPromise)
                    .then(() => {
                        // console.log('all done!')
                    })
                }
            })
            .catch(function (error) {
                console.log("Exception when call: " + DOMMAIN_MAIN + 'secret/maps/' + hash);
            });
        }
        catch(ex)
        {
            console.log("[ERROR] NOT sync Map from API");
        }
    }).start();
};

const CheckStatusUser = () => {
    new cron.CronJob('30 0/5 * * * *', async () => {
        try{
            var arrUpdate = [];
            const collection  = connection.db.collection(TABLE_SESSION);
            collection.find({}).toArray().then(function(response){
                if(response != null && response.length > 0)
                {
                    var date = (new Date()).getTime();
                    response.forEach(async (item) => {
                        if(date >= item.session)
                        {
                            arrUpdate.push(item);
                        }
                    }); 

                    const sleep = ms =>
                    new Promise(res => {
                        setTimeout(res, ms)
                    })

                    const myPromise = num =>
                    sleep(5000).then(async () => {
                        //Update to database
                        try{
                            const collectionUser  = connection.db.collection(TALBE_USER);
                            collectionUser.find({ phone: num.phone }).toArray().then(function(result){
                                if(result != null && result.length > 0)
                                {
                                    var item = result[0];
                                    db.updateUser(TALBE_USER, item.id, item.phone, item.password, item.createdtime, date, false, async (callback1) => {
                                        if(callback1 != null)
                                        {
                                             //Update to API
                                             try{
                                                 //Update to API
                                                var text = num.phone+false;
                                                let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
                                                var model = { phone: num.phone, status: false, signature: hash };
                                                var resPost = await axios.post(DOMMAIN_MAIN + "secret/updateStatus", model).catch(function (error) {
                                                    console.log("Exception when call: " + DOMMAIN_MAIN + 'secret/updateStatus');
                                                });
                                                // console.log("resPost", resPost.data);
                                            }
                                            catch(e0)
                                            {
                                                console.log(DOMMAIN_MAIN + "secret/updateStatus|" + e0);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        catch(e)
                        {
                            console.log("[EXCEPTION] Database cannot update record| " + e);
                        }
                        //Delete Record
                        db.deleteRecord(TABLE_SESSION, num._id, (callback) => {
                            // console.log("callback", callback);
                        });
                    })

                    const forEachSeries = async (iterable, action) => {
                        for (const x of iterable) {
                            await action(x)
                        }
                    }

                    forEachSeries(arrUpdate, myPromise)
                    .then(() => {
                        console.log('all done!')
                    })
                } 
            });
        }
        catch(ex)
        {
            console.log("[ERROR] NOT update status" + ex);
        }
    }).start();
};

export default { CheckDomainMain, CheckDomain1, CheckDomain2, CheckDomain3, CheckDomain4, SyncUserFromAPI, SyncMapFromAPI, CheckStatusUser};
