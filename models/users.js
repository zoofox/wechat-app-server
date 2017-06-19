//var dh = require('../utils/dbHandler');

var mongodb = require('../utils/connectMongo');

class users{
	constructor(user){
		this.user = Object.assign({
			openId:'',
			rank:0,
			authorName:'',//笔名
			wechatNickname:'',
			avatar:'',
		},user);
	}

	save(callback){
		var date = new Date();
		var self = this;
		this.user.time = { 
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
		 	var collection = db.collection('diaryUsers');
		 	console.log('---------------------');
		 	console.log(self.user);
		 	collection.insertOne(self.user,{safe:true},function(err,doc){
		 			if(err){
		 				return callback(err);
		 			}
		 			return callback(null);
		 		})

		 	

		 })
	}
	static getUser(openId,callback){
		mongodb((err,db)=>{
		 	if(err){
		 		return callback(err);
		 	}
		 	var collection = db.collection('diaryUsers');
		 	var query = {};
		 	if(openId){
		 		query.openId = openId;
		 	}
		 	collection.findOne(query, function(err, doc) {
		 			if(err){
		 				return callback(err);
		 			}
		 			return callback(null,doc);
		 		})
		 })
	}
	static updateUser(openId,updateInfo,callback){
		mongodb((err,db)=>{
		 	if(err){
		 		return callback(err);
		 	}
		 	var collection = db.collection('diaryUsers');
		 	if(updateInfo&&typeof updateInfo === 'object'){
		 		collection.updateOne({openId:openId}, {$set:updateInfo},function(err, doc) {
			 			if(err){
			 				console.log(err)
			 				return callback(err);
			 			}
			 			console.log(doc)
			 			return callback(null,doc);
			 	})
		 	}else{
		 		return callback('update type error',null);
		 	}
		 	
		 	
		})
	}
}

module.exports = users;

