import cron from "cron";
import db from './lib/helpers/database.mjs';
import axios from 'axios';

const DOMMAIN_MAIN = "https://analyze-api.vercel.app/";
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
            var result = await axios.get(DOMMAIN_MAIN);
            console.log(date + "|" + DOMMAIN_MAIN + "|", result.data);
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
            var result1 = await axios.get(DOMAIN_SUB1);
            console.log(date + "|" + DOMAIN_SUB1 + "|", result1.data);
    
            var result2 = await axios.get(DOMAIN_SUB2);
            console.log(date + "|" + DOMAIN_SUB2 + "|", result2.data);
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
            var result1 = await axios.get(DOMAIN_SUB3);
            console.log(date + "|" + DOMAIN_SUB3 + "|", result1.data);
    
            var result2 = await axios.get(DOMAIN_SUB4);
            console.log(date + "|" + DOMAIN_SUB4 + "|", result2.data);
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
            var result1 = await axios.get(DOMAIN_SUB5);
            console.log(date + "|" + DOMAIN_SUB5 + "|", result1.data);
    
            var result2 = await axios.get(DOMAIN_SUB6);
            console.log(date + "|" + DOMAIN_SUB6 + "|", result2.data);
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
            var result1 = await axios.get(DOMAIN_SUB7);
            console.log(date + "|" + DOMAIN_SUB7 + "|", result1.data);
    
            var result2 = await axios.get(DOMAIN_SUB8);
            console.log(date + "|" + DOMAIN_SUB8 + "|", result2.data);
        }
        catch(error)
        {
            console.error("CheckDomain4", error.response.data);
        }
    }).start();
};

const SyncUserFromAPI = () => {
    new cron.CronJob('30 5/15 * * * *', async () => {
        try{
            const collection  = connection.db.collection(TALBE_USER);
            var text = "users";
            let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
            axios.get(DOMMAIN_MAIN + 'secrect/users/' + hash).then(async (response) => {
                response.data.forEach((item) => {
                    collection.find({ phone: item.phone }).toArray().then(function(result){
                        if(result.status != item.status 
                            || result.password != item.password)
                        {
                            //update lai db
                            db.updateUser(TALBE_USER, item.id, item.phone, item.password, item.createdtime, item.updatedtime, item.status, (callback) => {
                                if(callback == null)
                                    return res.status(200).json({msg: "[ERROR] Not update user sync from API", code: -60 });
                            });
                        }
                    });
                }); 
            });
        }
        catch(ex)
        {
            console.log("[ERROR] NOT sync User from API");
        }
    }).start();
};

const SyncMapFromAPI = () => {
    new cron.CronJob('30 10/30 * * * *', async () => {
        try{
            const collection  = connection.db.collection(TABLE_MAP);
            var text = "maps";
            let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
            axios.get(DOMMAIN_MAIN + 'secrect/maps/' + hash).then(async (response) => {
                response.data.forEach((item) => {
                    collection.find({ phone: item.phone }).toArray().then(function(result){
                        if(result == null)
                        {
                            //insert map
                            db.addMap(TABLE_MAP, item.phone, item.chatId, (callback) => {
                                if(callback == null)
                                    return res.status(200).json({msg: "[ERROR] Not insert map sync from API", code: -60 });
                            });
                        }
                    });
                }); 
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
            const collection  = connection.db.collection(TABLE_SESSION);
            collection.find({}).toArray().then(function(response){
                if(response != null)
                {
                    var date = (new Date()).getTime();
                    response.data.forEach(async (item) => {
                        if(date >= item.session)
                        {
                            var text = item.phone+false;
                            let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
                            var model = { phone: item.phone, status: false, signature: hash };
                            var resPost = await axios.post(DOMMAIN_MAIN + "/secrect/updateStatus", model);
                            console.log(item.phone, resPost.data);
                        }
                    }); 
                } 
            });
        }
        catch(ex)
        {
            console.log("[ERROR] NOT update status");
        }
    }).start();
};

export default { CheckDomainMain, CheckDomain1, CheckDomain2, CheckDomain3, CheckDomain4, SyncUserFromAPI, SyncMapFromAPI, CheckStatusUser};
