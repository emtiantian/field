###穿山单风场API及接口说明
# API说明
1. 全部参数说明
```js
var defaults = {
		fatherDiv:$(window),// 这里是用来根据父div 的宽高缩放 默认是根据页面整个的宽高
    	isdebugMsg : true, //是否打印测试值
    	mainWidth : 1600, // 默认宽度
		mainHeight : 800, // 默认高度
		background : "", //默认div背景颜色
		tipBackground:"#FF9900",// 弹窗背景颜色
		img : ["img/windfarm_ningbo.png","img/windfarm_ningbo2.png"], //切换的图片数组 与 默认宽高一致	
		type :"sm",// 默认为小号风机 sm 小号 ，me 中号 ，lg 大号
		status:"0",// 默认为通讯中断 这个状态值与 颜色有对应关系 具体看下面的 statusColor
		windSpeed:"",//默认为正常  stop 停止， slow 慢速，fast 快速，"" 正常速度
		//0	通讯中断	#CCCCCC	浅灰#CCCCCC
		//1	启动	#6CE26C	绿#6CE26C
		//2	待机	#6CE26C	绿
		//3	故障停机	#FF6666	红#FF6666
		//4	正常停机	#6CE26C	黄FFCC00
		//5	维护	#FFCC00	黄
		//6	并网	#6CE26C	绿
		//7	手动停机	#FFCC00	黄
		statusColor : ["grey","green","green","red","yellow","yellow","green","yellow"],//对应颜色数组
		statusWindSpeed : ["stop","slow","stop","stop","stop","stop","","stop"];//对应风机转速
		offset :{"sm":{"offsetX":40,"offsetY":72},"me":{"offsetX":50,"offsetY":100},"lg":{"offsetX":90,"offsetY":170}},//弹出框对应的 偏移量 因为3中风机的型号不同当风机大小发送改动才需要改动此值
		update :[], //更新方法 url对应更新 ajax路径，timer更新频率， 示例：[{"type":"dataUpdate","url":"","timmer":""},{"type":"titleUpdate","url":"","timer":""},{"type":"speedUpdate","url":"","timer":""}]
		onclick :null, // 点击风机的触发事件 示例 :function(e){ console.dir(e) }
		data:null,// 示例：[{"type":"sm","x":"0","y":"0","code":"b15","status":"","windSpeed":"fast","speed":"","windWheelSpeed":"","activePower":"","reactivePower":"","motorSpeed":"","powerGeneration":""}]
		titleData:{"x":"50","y":"50"},//{x:"150",y:"50",name:"国电电力宁波穿山风电场",a:"4500",b:"4500",c:"4500",d:"4500"e:"4500"f:"4500",g:"4500",h:"4500",i:"4500"j:"4500"}		
		speedData:{"x":"1300","y":"550"},//	{"x":"1300","y":"550","speed":20};
   };
```
# 接口说明
1. 单风机数据接口说明
	注：没有说明为可选 ， 类型：json数组 ，对应 data：参数
``` js
[
    {
        "type": "sm",// 不同大小风机  默认为小号风机     sm 小号 ，me 中号 ，lg 大号 
        "x": "0", // 风机对应x位置 (必选)
        "y": "0", // 风机对应y位置(必选)
        "code": "b15",//风机名称或者id号(必选)
        "status": "",//风机运行状态 默认为通讯中断  状态号 与我们通用一致
        "windSpeed": "fast", //风机转速 默认为正常  "" 正常速度,stop 停止， slow 慢速，fast 快速
        "speed": "",// 风速 
        "windWheelSpeed": "",// 风轮转速
        "activePower": "",// 有功功率
        "reactivePower": "",//无功功率
        "motorSpeed": "", //风机转速
        "powerGeneration": "" // 总发电量
    }
]
```
2. 总览数据接口说明
	注：均为必填项 ，类型： json，对应 titleData：参数
``` js
{
    "name": "国电电力宁波穿山风电场", //风电场名称
    "a": "4500", //总装机容量
    "b": "4500",//总发电量
    "c": "4500",//当年总发电量
    "d": "4500",//有功功率
    "e": "4500",//无功功率
    "f": "4500",//平均风速
    "g": "4500",//平均温度
    "h": "4500",//风机台数
    "i": "4500",//运行台数
    "j": "4500" //停机台数
}
```
3. 风速表数据
	注：没有说明为可选 ，类型： json，对应 speedData：参数
```js
{
    "x": "1300", // 风速表x位置
    "y": "550", // 风速表y位置
    "speed": 20 // 当前风速 （必选）
}
```
# 示例 使用说明
1. 进入server目录并安装node 依赖
```node
nmp install 
```
2. 运行模拟接口
``` node
node index.js//模拟ajax 接口
```
2. 打开index.html