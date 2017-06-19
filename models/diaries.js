//var dh = require('../utils/dbHandler');

var mongodb = require('../utils/connectMongo');
var crypto = require('crypto');

class diaries{
	constructor(article){
		this.article = Object.assign({
			openId:'',
			agree:[],
			disagree:[],
			reviews:[],
			averageScore:100,
			weather:'风和日丽',
			diaryName:'',
			content:'',
			hugs:[]
		},article);
	}

	save(){
	   var date = new Date();
	   var self = this;
       var md5 = crypto.createHash('md5');
       this.article.id = md5.update('guji'+data.getTime()+Math.random().toFixed(2)).digest('hex');

		this.article.time = { 
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
		 	var collection = db.collection('diaries');
		 	collection.insertOne(self.article,{safe:true},function(err,doc){
		 			if(err){
		 				return callback(err);
		 			}
		 			return callback(null);
		 		})

		 	

		 })
	}
	static getList(count,skip,callback){
		mongodb((err,db)=>{
		 	if(err){
		 		return callback(err);
		 	}
		 	var collection = db.collection('diaries');
		 	collection.find().skip(parseInt(skip)).limit(parseInt(count)).toArray(function(err,docs){
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

