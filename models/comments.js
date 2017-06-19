//var dh = require('../utils/dbHandler');

var mongodb = require('../utils/connectMongo');
var crypto = require('crypto');

class comments{
	constructor(comment){
		this.comment = Object.assign({
			openId:'',
			comment:'',
			isReply:0,
			replyName:''
		},comment);
	}

	save(){
	   var date = new Date();
	   var self = this;
       var md5 = crypto.createHash('md5');
       this.comment.id = md5.update('comment'+data.getTime()+Math.random().toFixed(2)).digest('hex');

		this.comment.time = { 
				date: date, 
		 		year : date.getFullYear(),  
		 	    month : date.getFullYear() + "-" + (date.getMonth() + 1),
		 	    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),       
		 	    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())    
		 }
		mongodb((err,db)=>{
		 	if(err){
		 		return callback(err);
		 	}
		 	var collection = db.collection('diaryComments');
		 	collection.insertOne(self.comment,{safe:true},function(err,doc){
		 			if(err){
		 				return callback(err);
		 			}
		 			return callback(null);
		 		})

		 	

		 })
	}
	static getList(id,count,skip,callback){
		mongodb((err,db)=>{
		 	if(err){
		 		return callback(err);
		 	}
		 	var collection = db.collection('diaryComments');
		 	collection.find({id:id}).skip(parseInt(skip)).limit(parseInt(count)).toArray(function(err,docs){
		 			if(err){
		 				return callback(err);
		 			}
		 			return callback(null,docs);
		 		})
		 })
	}
	static getOne(id,callback){
		mongodb((err,db)=>{
		 	if(err){
		 		return callback(err);
		 	}
		 	var collection = db.collection('diaryComments');
		 	collection.findOne({id:id},function(err,doc){
		 			if(err){
		 				return callback(err);
		 			}
		 			return callback(null,doc);
		 		})
		 })
	}
}

module.exports = comments;

