var express = require('express');


//服务器框架
var app = express();
//json 解析
var jsonStr = null;
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//设置跨域访问
app.all('*', function(req, res, next) {	
	//设置跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    console.log("接到请求了");
    next(); 
});
//json psot 解析
app.post("*",function(req, res, next){
	//json 解析
	jsonStr = req.body;
    next();
})
//json get 解析
app.get("*",function(req, res, next){
	jsonStr = req.query;
	next();
})


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('啊  Example app listening at http://%s:%s', host, port);
});


//模拟风机数据
app.get('/data/windData',function(req,res){
	res.json( getWindData());
})
//模拟标题数据
app.get('/data/titleData',function(req,res){
	res.json( getTitleData());
})
//模拟风速数据
app.get('/data/speedData',function(req,res){
	res.json( getSpeedData());
})
//模拟全部风机数据
app.get("/data/data",function(req,res){
	res.json( getAllData());
})

//模拟风机数据
app.post('/data/windData',function(req,res){
	res.json( getWindData());
})
//模拟标题数据
app.post('/data/titleData',function(req,res){
	res.json( getTitleData());
})
//模拟风速数据
app.post('/data/speedData',function(req,res){
	res.json( getSpeedData());
})

app.post("/data/data",function(req,res){
	res.json( getAllData());
})
function getAllData (){
	var data  = {}
	data.data = getWindData();
	data.titleData = getTitleData();
	data.speedData = getSpeedData();
	return data;
}
//{"type":"sm","x":"0","y":"450","code":"b11","status":"","windSpeed":"","speed":"","windWheelSpeed":"1","activePower":"2","reactivePower":"3","motorSpeed":"4","powerGeneration":"5"}
function getWindData(){
	var num = 4;
	var dataArray = [];
	var xydata = [{"x":"0","y":"450"},{"x":"100","y":"480"},{"x":"200","y":"500"},{"x":"300","y":"550"}]
	for(var i =0;i<num;i++){
		var data ={"code":"1","status":"","windSpeed":"","speed":"","windWheelSpeed":"1","activePower":"2","reactivePower":"3","motorSpeed":"4","powerGeneration":"5"}
		var status = Math.round(Math.random()*6) >4 ? 1:6;// 随机0到7
		var windSpeedArr = ["","slow","fast","stop"]
		var windSpeed = Math.round(Math.random()*4)//
		var other = Math.round(100000+Math.random()*10000)
		data.x=xydata[i].x;
		data.y=xydata[i].y;
		data.code = "b"+i;
		data.status = status;
		data.windSpeed = windSpeedArr[windSpeed];
		data.speed = other;
		data.windWheelSpeed = other;
		data.activePower = other;
		data.reactivePower = other;
		data.motorSpeed = other;
		data.powerGeneration = other;
		dataArray.push(data);
		console.log(data.code);
	}
	
	return dataArray;
	
}
//{name:"国电电力宁波穿山风电场",a:"4500",b:"4500",c:"4500",d:"4500",e:"4500",f:"4500",g:"4500",h:"4500",i:"4500",j:"4500"},
function getTitleData(){
	var data = {name:"国电电力宁波穿山风电场",a:"4500",b:"4500",c:"4500",d:"4500",e:"4500",f:"4500",g:"4500",h:"4500",i:"4500",j:"4500"};
	data.a = Math.round(Math.random()*10000);
	data.b = Math.round(Math.random()*10000);
	data.c = Math.round(Math.random()*10000);
	data.d = Math.round(Math.random()*10000);
	data.e = Math.round(Math.random()*10000);
	data.f = Math.round(Math.random()*10000);
	data.g = Math.round(Math.random()*10000);
	data.h = Math.round(Math.random()*10000);
	data.i = Math.round(Math.random()*10000);
	data.j = Math.round(Math.random()*10000);
	return data;
}
//{speed:20}
function getSpeedData(){
	return {"drection":Math.round(Math.random()*360)}
}
