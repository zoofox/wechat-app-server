var express = require('express');
var router = express.Router();
var Config = require('../utils/config');
var superagent = require('superagent');
var Users = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/getOpenId',(req,res,next)=>{
	let code = req.body.code;
	superagent.get('https://api.weixin.qq.com/sns/jscode2session?appid='+Config.appid+'&secret='+Config.secret+'&js_code='+code+'&grant_type=authorization_code')
	.end((err,r)=>{
		if(err){
			console.log(err)
			res.send({code:0,msg:err,data:null});
		}else{
			let result =JSON.parse(r.text);
			// console.log(result)
			if(result.errcode){
				res.send({code:1,msg:result.errmsg,openid:null})
			}else{
				res.send({code:0,msg:'',openid:result.openid});
			}
		}
	})

})

router.post('/getAccountByOpenId',(req,res,next)=>{
	let openId = req.body.openId;
	let avatar = req.body.avatar;
	let wechatNickname = req.body.nickname;

	Users.getUser(openId,(err,user)=>{
		if(err){
			res.send({code:1,user:null})
		}else{
			//First time init user,next time update user
			if(!user){
				let initUser = {
		 			openId:openId,
		 			rank:0,
		 			avatar:avatar,
		 			authorName:wechatNickname,
		 			wechatNickname:wechatNickname
		 		};
		 		new Users(initUser).save((err)=>{
		 				if(err){
		 					console.log('fail to openid:'+openId+' create user')
		 				}else{
		 					console.log('create new user successfully')
		 				}
		 				res.send({code:0,user:initUser})
		 		})
		 	}else{
		 		let updateInfo = {
		 			avatar:avatar,
		 			wechatNickname:wechatNickname
		 		}

		 		Users.updateUser(openId,updateInfo,(err,doc)=>{
		 			if(err){
			 			res.send({code:1,user:null})
		 			}else{
		 				res.send({code:0,user:user})
		 			}
		 		})
		 	}
			
		}
	})

})

module.exports = router;
