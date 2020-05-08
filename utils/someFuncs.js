/**
 * Created by sanshi on 4/6/20.
 */
exports.echo = function () {
  console.log.apply(console, arguments)
}

var dao = require('./dao')
var columns_confirmedData = ['_id', 'srcOfMessage', 'urlOfMessage', 'date', 'trainNumber', 'type', 'startPoint', 'endPoint', 'compartment', 'description', 'startTime', 'endTime', 'submitTime']
var columns_unconfirmedData = ['_id', 'srcOfMessage', 'urlOfMessage', 'date', 'trainNumber', 'type', 'startPoint', 'endPoint', 'compartment', 'description', 'startTime', 'endTime', 'submitTime']
var columns_admin = ['_id', 'username', 'password']
var columns_feedback = ['_id', 'id', 'errInfo']

exports.CRUB = {
  getConfirmedData: function (callback) {
    dao.find('confirmedData', {}, columns_confirmedData, callback)
  },

  getUnconfirmedData: function (callback) {
    dao.find('unconfirmedData', {}, columns_unconfirmedData, callback)
  },

  getFeedback: function (callback) {
    dao.find('feedback', {}, ['id', 'errInfo'], function (err, res1) {
      if(err) {
        callback(err, res1);
        return
      }
      ids = res1.map(item => item.id)
      dao.where('confirmedData', {}, {where:'_id', in: ids, fields: columns_confirmedData}, function (err, res) {
          if(err){
            callback(err, res);
            return
          }
          for(let i = 0; i < ids.length; i++){
            res[i] = res[i].toObject()
            res[i].errInfo = res1[i].errInfo
          }
          callback(null, res)
      })
    })
  },

  getAdmin: function (userInfo, callback) {
    dao.find('admin', userInfo, columns_admin, callback)
  },



  addUnconfirmedData: function (fields, callback) {
    dao.save('unconfirmedData', fields, callback)
  },

  submitUnconfirmedData: function (id, callback) {
    dao.findByIdAndDelete('unconfirmedData', id, function (err, res1) {
      if(err) {
        callback(err, res1);
        return
      }
      // var obj = {...res1}
      var obj = res1.toObject()
      dao.save('confirmedData', obj, callback)
    })
  },

  updateUnconfirmedData: function (id, fields, callback) {
    dao.findByIdAndUpdate('unconfirmedData', id, fields, callback)
  },

  deleteUnconfirmedData: function (id, callback) {
      dao.findByIdAndDelete('unconfirmedData', id, callback)
  },


  addFeedback: function(id, errInfo, callback){
      dao.findOne('feedback', {id:id}, function (err, res) {
          if(err) throw err;
          if(res){
              dao.update('feedback', {id:id}, { $push: {errInfo: errInfo}}, callback)
              //dao.findByIdAndUpdate('mayError', id, { $push: {errInfo: errorInfo}}, callback)
          }else{
              dao.save('feedback', {id:id, errInfo: errInfo}, callback)
          }
      })
  },

  deleteFeedback: function (id, callback) {
    dao.deleteOne('feedback', { id }, callback)
  },

  updateConfirmedDataAccordingToFeedback: function (fields, callback) {
    var id = fields['_id']
    delete fields.errInfo
    dao.deleteOne('feedback', {id}, function (err, res) {
      if(err) throw err;
      console.log(res)
      dao.findByIdAndUpdate('confirmedData', id, fields,callback)
    })
  }
}