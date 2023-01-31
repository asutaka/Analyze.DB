import mongoose from 'mongoose'
const URL = 'mongodb://127.0.0.1:27017/Data';
const conn = async () => {
    try {
        //0: disconnected
        //1: connected
        //2: connecting
        //3: disconnecting
        if(mongoose.connection.readyState == 1)
            return;

        mongoose.set('strictQuery', true);
        await mongoose.connect(
        URL,
        { useNewUrlParser: true, useUnifiedTopology: true }
        )
        console.log('Connected to mongoDB');
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
};

const create = (name, callback) => {
    conn();
    mongoose.connection.createCollection(name, function (err, res) {
        if (err){
            return callback(err);
        } 
        console.log("collection " + name + " created!");
        return callback("success");
    });
};

const remove = (name) => {
    conn();
    mongoose.connection.collection(name).drop();
    console.log("collection " + name + " has drop!");
};

const addRecord = (table, e, c, o, h, l, v, q, ut, state, callback) => {
    conn();
    var dat = {
        T : e,
        C : c,
        O : o,
        H : h,
        L : l,
        V : v,
        Q : q,
        UT: ut,
        State: state
    };

    mongoose.connection.collection(table).insertOne(dat, function(err, res){
        if (err){
            console.log("err ", err);
            return callback(err);
        } 
        return callback(res);
    });
};

const addMultiRecord = (table, data, callback) => {
    conn();
    // // console.log("table", table);
    // // console.log("data", data);
    mongoose.connection.collection(table).insertMany(data, function(err, res){
        if (err){
            console.log("err ", err);
            return callback(err);
        } 
        return callback(res);
    });
};

const updateRecord = (table, id, e, c, h, l, v, q, ut, state, callback) =>{
    conn();
    mongoose.connection.collection(table).updateOne({ _id: mongoose.Types.ObjectId(id) },
    { $set: { T : e, C : c, H : h, L : l, V : v, Q : q, UT: ut, State: state } },
    { upsert: true },
    function(err, res){
        if(err){
            return callback(err);
        }
        else{
            return callback(res);
        }
    });
};

const deleteRecord = (table, id,callback) =>{
    if(id == null)
    {
        return callback(null);
    }
    conn();
    mongoose.connection.collection(table).deleteOne({_id: id}, function(err, res){
        if(err){
            return callback(err);
        }
        else{
            return callback(res);
        }
    });
};

//Log
const addLog = (table, phone, type, ip, time, callback) => {
    conn();
    var dat = {
        Phone : phone,
        Type : type,
        IP : ip,
        Time : time
    };

    mongoose.connection.collection(table).insertOne(dat, function(err, res){
        if (err){
            console.log("err ", err);
            return callback(err);
        } 
        return callback(res);
    });
};

//User
const addUser = (table, _phone, _password, _createdtime, callback) => {
    conn();
    var dat = {
        phone : _phone,
        password : _password,
        createdtime : _createdtime,
        status : false
    };

    mongoose.connection.collection(table).insertOne(dat, function(err, res){
        if (err){
            console.log("err ", err);
            return callback(err);
        } 
        return callback(res);
    });
};

const updateUser = (table, id, _phone, _password, _createdtime, _updatedtime, _status, callback) =>{
    conn();
    mongoose.connection.collection(table).updateOne({ _id: mongoose.Types.ObjectId(id) },
    { $set: { phone : _phone,
        password : _password,
        createdtime : _createdtime,
        updatedtime: _updatedtime,
        status : _status } },
    { upsert: true },
    function(err, res){
        if(err){
            return callback(err);
        }
        else{
            return callback(res);
        }
    });
};

//Session
const addSession = (table, _phone, _session, _createdtime, callback) => {
    conn();
    var dat = {
        phone : _phone,
        session : _session,
        createdtime : _createdtime
    };

    mongoose.connection.collection(table).insertOne(dat, function(err, res){
        if (err){
            console.log("err ", err);
            return callback(err);
        } 
        return callback(res);
    });
};

//Maps
const addMap = (table, _phone, _chatId, callback) => {
    conn();
    var dat = {
        phone : _phone,
        chatId : _chatId
    };

    mongoose.connection.collection(table).insertOne(dat, function(err, res){
        if (err){
            console.log("err ", err);
            return callback(err);
        } 
        return callback(res);
    });
};


export default {conn, create, remove, addRecord, addMultiRecord, updateRecord, deleteRecord, addLog, addUser, updateUser, addSession, addMap };
