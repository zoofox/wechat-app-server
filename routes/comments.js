var express = require('express');
var async = require('async');
var router = express.Router();
var Comments = require('../models/comments')
var Users = require('../models/users')

const THREAD_NUM = 1;

router.post('/list',(req,res,next)=>{
	let id  = req.body.id;                
	let count  = req.body.count;                
	let offset  = req.body.offset;

	count = (count)?count:'10';
	offset = (offset)?offset:'0';
	if(!id){
		res.send({code:1,msg:'id参数错误'})
	}
	if(isNaN(count) || count < 0){
		res.send({code:1,msg:'count参数错误'})
	}
	if(isNaN(offset) || offset < 0){
		res.send({code:1,msg:'offset参数错误'})
	}
	Comments.getList(id,count,offset,(err,docs)=>{
		if(err){
			console.log(err)
			res.send({code:1,docs:null})
		}else{
			// console.log(docs)
			let comments = [];
			async.mapLimit(docs,THREAD_NUM,(doc,callback)=>{
				Users.getUser(doc.openId,(err,user)=>{
					doc.user = user;
					comments.push(doc);
					callback(null);
				})
			},()=>{
				res.send({code:0,docs:comments})
			})
			
		}
	})
})


router.post('/save',(req,res,next)=>{
	let openId = req.body.openId;
	let diaryId = req.body.diaryId;
	let isReply = req.body.isReply;
	let replyName = req.body.replyName;
	let comment = req.body.comment;
	
	new Comments({
		openId:openId,
		diaryId:diaryId,
		isReply:isReply,
		replyName:replyName,
		comment:comment
	}).save((err)=>{
		if(err){
			res.send({code:1,msg:err})
		}else{
			res.send({code:0,msg:''})
		}
	})
})


router.post('/get',(req,res,next)=>{
	let id = req.body.id;
	if(id){
		Diaries.getOne(id,(err,article)=>{
			Users.getUser(article.openId,(err,user)=>{
				article.user = user;
				res.send({code:0,diary:article})
			})
			
		})

	}else{
			res.send({code:1,diary:{},msg:'id error'})
	}
	
})

 function escapeString(value) {
    value = value + "";
    var RexStr = /\</g;
    var step1 = value.replace(RexStr, '&lt;');
    var RexStr2 = /\>/g;
    var step2 = step1.replace(RexStr2, '&gt;');
    var RexStr3 = /\"/g;
    var step3 = step2.replace(RexStr3, '&quot;');
    var RexStr4 = /\'/g;
    var step4 = step3.replace(RexStr4, '&#39;');
    return step4;
  }

module.exports = router;
