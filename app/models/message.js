'use strict';

var Mongo = require('mongodb');

function Message(o, fromId, toId, name){
  this.date     = new Date();
  this.body     = o.message;
  this.fromId   = Mongo.ObjectID(fromId);
  this.fromName = name;
  this.toId     = Mongo.ObjectID(toId);
  this.isUnread = true;
  this.color    = 'red';
}

Object.defineProperty(Message, 'collection', {
  get: function(){return global.mongodb.collection('messages');}
});

Message.create = function(o, fromId, toId, name, cb){
  var a = new Message(o, fromId, toId, name);
  Message.collection.save(a, cb);
};


Message.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Message.collection.findOne({_id:_id}, cb);
};

Message.query = function(query, cb){
  var property = Object.keys(query)[0];
  query[property] = Mongo.ObjectID(query[property]);
  Message.collection.find(query).sort({date:1}).toArray(cb);
};

module.exports = Message;
