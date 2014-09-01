'use strict';

var User    = require('../models/user'),
    Message = require('../models/message'),
    Mailgun = require('mailgun-js');

exports.new = function(req, res){
  res.render('users/new');
};

exports.login = function(req, res){
  res.render('users/login');
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      res.redirect('/');
    }else{
      res.redirect('/register');
    }
  });
};

exports.authenticate = function(req, res){
  User.authenticate(req.body, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      res.redirect('/login');
    }
  });
};

exports.edit = function(req, res){
  res.render('users/edit');
};

exports.update = function(req, res){
  res.locals.user.save(req.body, function(){
    res.redirect('/profile');
  });
};

exports.show = function(req, res){
  res.render('users/show');
};

exports.index = function(req, res){
  User.find({isVisible:true}, function(err, users){
    res.render('users/index', {users:users});
  });
};

exports.client = function(req, res){
  User.findOne({email:req.params.email, isVisible:true}, function(err, client){
    if(client){
      res.render('users/client', {client:client});
    }else{
      res.redirect('/users');
    }
  });
};

exports.message = function(req, res){
  User.findById(req.params.userId, function(err, receiver){
    res.locals.user.send(receiver, req.body, function(){
      console.log('message action', receiver);
      res.redirect('/users/' + receiver.email);
    });
  });
};

exports.mssgIndex = function(req, res){
  User.findOne({email:req.params.email, isVisible:true}, function(err, user){
    Message.query({toId:user._id}, function(err, messages){
      console.log(messages);
      console.log(user);
      res.render('messages/index', {user:user, messages:messages});
    });
  });
};

exports.showMssg = function(req, res){
  Message.findById(req.params.mssgId, function(err, message){
    res.render('messages/show', {message:message});
  });
};
