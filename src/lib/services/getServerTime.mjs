import { spotPublicRequest } from '../requestClient.mjs';


const getTime = () => spotPublicRequest()
  .get('/api/v3/time')
  .then(({ data }) => data)
  .catch((error) => console.log(error.message));

const getNextTime1M = function(callback){
  var currTime = new Date();
  var month = currTime.getMonth();
  var year = currTime.getFullYear();
  if(month < 12)
    month = month + 1;
  else month = 1;
  //////////////////////////////////////////////////////////////////////////////////////////////
  //for year
  if(month == 1)
    year = year + 1;
  //////////////////////////////////////////////////////////////////////////////////////////////  

  var datum = new Date(Date.UTC(year, month, 0, 0, 0, 0));
  return callback(datum.getTime());
};

const getNextTime1W = function(callback){
  var currTime = new Date();
  var first = currTime.getDate() - currTime.getDay();//sunday
  var datum = new Date(currTime.setDate(first + 8));//monday
  return callback(datum.getTime());
};

const getNextTime1D = function(callback){
  var currTime = new Date();
  var day = currTime.getDay();
  var month = currTime.getMonth();
  var year = currTime.getFullYear();

  var lastDayOfMonth = new Date(year, month, 0);
  if(day < lastDayOfMonth.getDay())
    day = day + 1;
  else day = 1;
  //////////////////////////////////////////////////////////////////////////////////////////////
  //for month
  if(day == 1){
    if(month < 12)
      month = month + 1;
    else month = 1;
    //////////////////////////////////////////////////////////////////////////////////////////////
    //for year
    if(month == 1)
      year = year + 1;
    //////////////////////////////////////////////////////////////////////////////////////////////
  }
  //////////////////////////////////////////////////////////////////////////////////////////////

  var datum = new Date(Date.UTC(year, month, day, 0, 0, 0));
  return callback(datum.getTime());
};

const getNextTime4H = function(callback){
  var currTime = new Date();
  var hour =  currTime.getHours();
  var day = currTime.getDay();
  var month = currTime.getMonth();
  var year = currTime.getFullYear();
  var div = hour%4;
  hour = hour - div;
  if(hour < 20)
      hour = hour + 4;
  else hour = 0;
  //for day
  if(hour == 0){
    var lastDayOfMonth = new Date(year, month, 0);
    if(day < lastDayOfMonth.getDay())
      day = day + 1;
    else day = 1;
    //////////////////////////////////////////////////////////////////////////////////////////////
    //for month
    if(day == 1){
      if(month < 12)
        month = month + 1;
      else month = 1;
      //////////////////////////////////////////////////////////////////////////////////////////////
      //for year
      if(month == 1)
        year = year + 1;
      //////////////////////////////////////////////////////////////////////////////////////////////
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
  }

  var datum = new Date(Date.UTC(year, month, day, hour, 0, 0));
  return callback(datum.getTime());
};

const getNextTime1H = function(callback){
  var currTime = new Date();
  var hour =  currTime.getHours();
  var day = currTime.getDay();
  var month = currTime.getMonth();
  var year = currTime.getFullYear();
  if(hour < 23)
      hour = hour + 1;
  else hour = 0;
  //for day
  if(hour == 0){
    var lastDayOfMonth = new Date(year, month, 0);
    if(day < lastDayOfMonth.getDay())
      day = day + 1;
    else day = 1;
    //////////////////////////////////////////////////////////////////////////////////////////////
    //for month
    if(day == 1){
      if(month < 12)
        month = month + 1;
      else month = 1;
      //////////////////////////////////////////////////////////////////////////////////////////////
      //for year
      if(month == 1)
        year = year + 1;
      //////////////////////////////////////////////////////////////////////////////////////////////
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
  }

  var datum = new Date(Date.UTC(year, month, day, hour, 0, 0));
  return callback(datum.getTime());
};

const getNextTime15M = function(callback){
  var currTime = new Date();
  var currMinute = currTime.getMinutes();
  var minute = 0;
  var hour =  currTime.getHours();
  var day = currTime.getDay();
  var month = currTime.getMonth();
  var year = currTime.getFullYear();
  //////////////////////////////////////////////////////////////////////////////////////////////
  //for Minute
  if(currMinute < 15)
  {
    minute = 15;
  }
  else if(currMinute < 30)
  {
    minute = 30;
  }
  else if(currMinute < 45)
  {
    minute = 45;
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  //for Hour
  if(currMinute == 0){
    if(hour < 23)
      hour = hour + 1;
    else hour = 0;
    //////////////////////////////////////////////////////////////////////////////////////////////
    //for day
    if(hour == 0){
      var lastDayOfMonth = new Date(year, month, 0);
      if(day < lastDayOfMonth.getDay())
        day = day + 1;
      else day = 1;
      //////////////////////////////////////////////////////////////////////////////////////////////
      //for month
      if(day == 1){
        if(month < 12)
          month = month + 1;
        else month = 1;
        //////////////////////////////////////////////////////////////////////////////////////////////
        //for year
        if(month == 1)
          year = year + 1;
        //////////////////////////////////////////////////////////////////////////////////////////////
      }
      //////////////////////////////////////////////////////////////////////////////////////////////
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  var datum = new Date(Date.UTC(year, month, day, hour, minute, 0));
  return callback(datum.getTime());
}

const getCurTime15M = function(callback){
  var currTime = new Date();
  var currMinute = currTime.getMinutes();
  var minute = 0;
  var hour =  currTime.getHours();
  var day = currTime.getDay();
  var month = currTime.getMonth();
  var year = currTime.getFullYear();
  //////////////////////////////////////////////////////////////////////////////////////////////
  //for Minute
  if(currMinute >= 45)
  {
    minute = 45;
  }
  else if(currMinute >= 30)
  {
    minute = 30;
  }
  else if(currMinute >= 15)
  {
    minute = 15;
  }
  var datum = new Date(Date.UTC(year, month, day, hour, minute, 0));
  return callback(datum.getTime());
}

export default { getTime, getNextTime15M, getNextTime1H, getNextTime4H, getNextTime1D, getNextTime1W, getNextTime1M, getCurTime15M };
