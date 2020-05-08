/**
 * mongoose操作类(封装mongodb)
 */

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('pomelo-logger').getLogger('mongodb-log');
var config = require('../config')

var DB = function () {
  this.mongoClient = {};
  this.tabConf = config.table;
  this.init = function () {
    mongoose.connect(config.DB_HOST_PORT + '/' + config.DB_USE, {useNewUrlParser: true, useUnifiedTopology: true});

    mongoose.connection.on('connected', function (err) {
      if (err) logger.error('Database connection failure');
    });

    mongoose.connection.on('error', function (err) {
      logger.error('Mongoose connected error ' + err);
    });

    mongoose.connection.on('disconnected', function () {
      logger.error('Mongoose disconnected');
    });

    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
      });
    });
  };
  this.init()
};

DB.prototype.getConnection = function (table_name) {
  var client = this.mongoClient[table_name];
  if (!client) {
    //构建用户信息表结构
    // var nodeSchema = new mongoose.Schema(this.tabConf[table_name]);
    var nodeSchema = new mongoose.Schema(this.tabConf[table_name], {versionKey: false})
    //构建model
    client = mongoose.model(table_name, nodeSchema, table_name);
    this.mongoClient[table_name] = client;
  }
  return client;
};

DB.prototype.save = function (table_name, fields, callback) {
  var node_model = this.getConnection(table_name);
  var mongooseEntity = new node_model(fields);

  mongooseEntity.save(function (err, res) {
    if (err) {
      if (callback) callback(err);
    } else {
      if (callback) callback(null, res);
    }
  });
};

DB.prototype.find = function (table_name, conditions, fields, callback) {
    var node_model = this.getConnection(table_name);
    node_model.find(conditions, fields || null, {}, function (err, res) {
        if (err) {
            callback(err);
        } else {
            callback(null, res);
        }
    });
};

DB.prototype.findOne = function (table_name, conditions, callback) {
    var node_model = this.getConnection(table_name);
    node_model.findOne(conditions, function (err, res) {
        if (err) {
            callback(err);
        } else {
            callback(null, res);
        }
    });
};

DB.prototype.findById = function (table_name, _id, callback) {
    var node_model = this.getConnection(table_name);
    node_model.findById(_id, function (err, res){
        if (err) {
            callback(err);
        } else {
            callback(null, res);
        }
    });
};

DB.prototype.findByIdAndDelete = function (table_name, id, callback) {
  var node_model = this.getConnection(table_name);
  node_model.findByIdAndDelete(id, function (err, res) {
    if (err) {
      if (callback) callback(err);
    } else {
      if (callback) callback(null, res);
    }
  });
};

DB.prototype.findByIdAndUpdate = function (table_name, id, fields, callback) {
  var node_model = this.getConnection(table_name)
  node_model.findByIdAndUpdate(id, fields, {safe: true, upsert: true}, function (err, res) {
      if(err){
        callback(err);
      }else{
        callback(null, res)
      }
  })
};

DB.prototype.deleteOne = function (table_name, conditions, callback) {
  var node_model = this.getConnection(table_name)
  node_model.deleteOne(conditions, {safe: true, upsert: true}, function (err, res) {
    if(err){
      callback(err)
    }else{
      callback(null, res)
    }
  })
}

DB.prototype.update = function (table_name, conditions, fields, callback) {
    var node_model = this.getConnection(table_name);
    node_model.update(conditions, fields, {multi: false, upsert: true}, function (err, res) {
        if(err){
            callback(err);
        }else{
            callback(null, res)
        }
    });
};

DB.prototype.where = function (table_name, conditions, options, callback) {
  var node_model = this.getConnection(table_name);
  node_model.find(conditions)
      .select(options.fields || '')
      .sort(options.sort || {})
      .limit(options.limit || null)
      .where(options.where || '').in(options.in || [])
      .exec(function (err, res) {
        if (err) {
          callback(err);
        } else {
          callback(null, res);
        }
      });
};

module.exports = new DB();