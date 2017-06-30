//var dh = require('../utils/dbHandler');

var mongodb = require('../utils/connectMongo');
var crypto = require('crypto');

class diaries{
	constructor(article){
		this.article = Object.assign({
			openId:'',
			agree:[],
			disagree:[],
			weather:0,
			diaryName:'',
			content:'',
			hugs:[],//鲜花数量
			commentsCount:0,
			isPublic:1
		},article);
	}

	save(callback){
			 var date = new Date();
	  		 var self = this;
      	 	 var md5 = crypto.createHash('md5');
       		 this.article.id = md5.update('guji'+date.getTime()+Math.random().toFixed(2)).digest('hex');

		this.article.time = { 
				date: date, 
		 		year : date.getFullYear(),  
		 	    month : date.getFullYear() + "-" + (date.getMonth() + 1),
		 	    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),       
		 	    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())    
		 }
		mongodb((err,db)=>{
		 	if(err){
		 		console.log(err)
		 		return callback(err);
		 	}
		 	var collection = db.collection('diaries');
		 	collection.insertOne(self.article,{safe:true},function(err,doc){
		 			if(err){
		 				console.log(err)
		 				return callback(err);
		 			}
		 			return callback(null);
		 		})
		 })
	}
	static getList(count,skip,callback){
		console.log('count:'+count,'skip:'+skip)
		mongodb((err,db)=>{
		 	if(err){
		 		return callback(err);
		 	}
		 	var collection = db.collection('diaries');
		 	collection.find().sort({"time":-1}).skip(parseInt(skip)).limit(parseInt(count)).toArray(function(err,docs){
		 			if(err){
		 				return callback(err);
		 			}
		 			//console.log(docs)
		 			return callback(null,docs);
		 		})
		 })
	}
	static getOne(id,callback){
		mongodb((err,db)=>{
		 	if(err){
		 		return callback(err);
		 	}
		 	var collection = db.collection('diaries');
		 	collection.findOne({id:id},function(err,doc){
		 			if(err){
		 				return callback(err);
		 			}
		 			return callback(null,doc);
		 		})
		 })
	}
}

module.exports = diaries;

