;
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory()
  } else {
    // Browser globals
    root.field = factory()
  }
}(this, function factory (exports) {
  'use strict'
  //默认值
  var defaults = {
    fatherDiv: $(window),// 这里是用来根据父div 的宽高缩放 默认是根据页面整个的宽高
    isdebugMsg: true, //是否打印测试值
    infoWidth: 190,//提示框宽度
    mainWidth: 1600, // 默认宽度
    mainHeight: 800, // 默认高度
    background: '', //默认div背景颜色
    tipBackground: '#FF9900',// 弹窗背景颜色
    img: ['img/windfarm_ningbo.png', 'img/windfarm_ningbo2.png'], //切换的图片数组 与 默认宽高一致
    type: 'sm',// 默认为小号风机 sm 小号 ，me 中号 ，lg 大号
    status: '0',// 默认为通讯中断 这个状态值与 颜色有对应关系 具体看下面的 statusColor
    windSpeed: '',//默认为正常  stop 停止， slow 慢速，fast 快速，"" 正常速度
    //0	通讯中断	#CCCCCC	浅灰#CCCCCC
    //1	启动	#6CE26C	绿#6CE26C
    //2	待机	#6CE26C	绿
    //3	故障停机	#FF6666	红#FF6666
    //4	正常停机	#6CE26C	黄FFCC00
    //5	维护	#FFCC00	黄
    //6	并网	#6CE26C	绿
    //7	手动停机	#FFCC00	黄
    statusColor: ['grey', 'green', 'green', 'red', 'yellow', 'yellow', 'green', 'yellow'],//对应颜色数组
    statusWindSpeed: ['stop', 'slow', 'stop', 'stop', 'stop', 'stop', '', 'stop'],//对应风机转速
    offset: {
      'sm': {'offsetX': 40, 'offsetY': 72},
      'me': {'offsetX': 50, 'offsetY': 100},
      'lg': {'offsetX': 90, 'offsetY': 170}
    },//弹出框对应的 偏移量 因为3中风机的型号不同当风机大小发送改动才需要改动此值
    update: [], //更新方法 示例：[{"type":"dataUpdate","url":"","timmer":""},{"type":"titleUpdate","url":"","timer":""},{"type":"speedUpdate","url":"","timer":""}]
    onclick: null, // 点击风机的触发事件 示例 :function(e){ console.dir(e) }
    data: null,
// 示例：[{"type":"sm","x":"0","y":"0","code":"b15","status":"","windSpeed":"fast","speed":"","windWheelSpeed":"","activePower":"","reactivePower":"","motorSpeed":"","powerGeneration":""}]
//		这里的一些参数可以 配置不同的风机样式 ，风机转速，状态，等值 
    titleData: {'x': '50', 'y': '50'},//{x:"150",y:"50",name:"国电电力宁波穿山风电场",a:"4500",b:"4500",c:"4500",d:"4500"e:"4500"f:"4500",g:"4500",h:"4500",i:"4500"j:"4500"}
    speedData: {'x': '1300', 'y': '50'},//	{"x":"1300","y":"550","drection":20};
  }

  function field (opts) {
    if (!(this instanceof field)) {
      return new field(opts)
    }

    if (typeof opts === 'string') {
      opts = {selector: opts}
    }

    if (!opts.selector) {
      return this.error('至少有一个选择器')
    }
//		if(typeof flexslider == "undefined"){
//			return this.error("flexslider 没有找到");
//		}
    if (typeof jQuery == 'undefined') {
      return this.error('jquery 没有找到')
    }
    this.mainEle = $(opts.selector)
    this.opts = $.extend(true, {}, defaults, opts)
    this.init()
  }

  field.prototype.error = function (message) {
    console.log('field error: ' + message)
  }
  field.prototype.debugMsg = function (message) {
    if (this.opts.isdebugMsg) {
      typeof message == 'string' ? console.log('field dubug: ' + message) : console.dir(message)
    }
  }
  field.prototype.init = function () {
    var _self = this
    this.mainEle.css({
      'position': 'absolute',
      'width': this.opts.mainWidth,
      'height': this.opts.mainHeight,
      'background': this.opts.background
    })
    //在开始初始化的时候先隐藏 或许透明更好?
    this.mainEle.hide()
    //链式调用
    this.createBackground().createWindmill().createTitle().createSpeed().resize()
    //更新方法
    this.update(this.opts.update)
//		_self.debugMsg(this.opts.update);
//		if(this.opts.update){
//			$.each(this.opts.update, function(i,ele) {
//				_self.update(ele.url,ele.timer,_self.getFun(ele.type))
//			});
//		}
//		$.each(this.opts.update, function(i,ele) {
//			setInterval(function(){
//				_self.debugMsg(ele.url);
//				//_self.update(ele.url,ele.timer,_self.getFun(ele.type))	
//			}			
//			,ele.timer)

//			setTimeout(function(){
//				_self.debugMsg(ele.url);
////				_self.getFun(ele.type)
////				_self.update(ele.url,ele.timer,_self.getFun(ele.type))
////				_self.debugMsg("开始ajax");
//			},ele.timer);
//		});

//		//初始化轮播
//		this.createBackground();
//		//初始化风机
//		this.createWindmill();
//		//初始化 标题
//		this.createTitle();
//		//初始化 速度表
//		this.createSpeed();
    //初始化完成前最后一步 根据 当前页面大小
//		this.resize();
    this.mainEle.show()

    window.onresize = function () {
      _self.resize()
    }

  }

  //判断参数对应的方法
  field.prototype.getFun = function (type) {
    var fan = ''
    switch (type) {
      case 'dataUpdate':
        fan = this.dataUpdate
        break
      case 'titleUpdate':
        fan = this.titleUpdate
        break
      case 'speedUpdate':
        fan = this.speedUpdate
        break
      default:
        this.error('更新找不到对应更新方法')
        break
    }
    this.debugMsg(fan)
    return fan
  }

  //变换尺寸
  field.prototype.resize = function () {
    var parentEle = $(this.opts.fatherDiv)
    var scale = 1
    if (parentEle.width() >= this.opts.mainWidth && parentEle.height() >= this.opts.mainHeight) {
      this.debugMsg('大于现有尺寸的缩放' + scale)
    } else {
      scale = parentEle.width() / this.opts.mainWidth > parentEle.height() / this.opts.mainHeight ? parentEle.height() / this.opts.mainHeight : parentEle.width() / this.opts.mainWidth
      scale = scale.toFixed(2)
      this.debugMsg('parentEle.width()=' + parentEle.width() + 'parentEle.height()' + parentEle.height())
      this.debugMsg('document.body.offsetWidth=' + document.body.offsetWidth + 'document.body.offsetHeight=' + document.body.offsetHeight)
      this.debugMsg('document.body.clientWidth=' + document.body.clientWidth + 'document.body.clientHeight=' + document.body.clientHeight)
      this.debugMsg('document.body.scrollWidth=' + document.body.scrollWidth + 'document.body.scrollHeight=' + document.body.scrollHeight)
      this.debugMsg('$(document).width();=' + $(document).width() + '$(document).height()t=' + $(document).height())
      this.debugMsg('scale=' + scale)
    }
    this.top = (parentEle.height() - this.opts.mainHeight * scale) / 2 - (this.opts.mainHeight * (1 - scale) / 2)
    this.left = (parentEle.width() - this.opts.mainWidth * scale) / 2 - (this.opts.mainWidth * (1 - scale) / 2)
    this.scale = scale
    this.mainEle.css({'top': this.top, 'left': this.left, 'transform': 'scale(' + scale + ') '})//translate3d(0, 0, 0) 这个是为了修改 chrome的问题
    return this
    //this.mainEle.css({"top":this.top,"left":this.left,"zoom":scale*100+"%"});
  }

  //data数据整理
  field.prototype.makeData = function (d) {
    var data = []
    var _self = this
    //对数据进行初始化
    $.each(d, function (i, ele) {
      var offset = _self.getOffset(ele.type || _self.opts.type)
      ele.type = ele.type || _self.opts.type
      ele.offsetX = offset.offsetX
      ele.offsetY = offset.offsetY
      ele.windSpeed = _self.opts.statusWindSpeed[ele.status] || _self.opts.windSpeed
      ele.status = _self.opts.statusColor[ele.status || _self.opts.status]
      data.push(ele)
    })

    return data
  }

  //data中不同型号对应不同偏移量
  field.prototype.getOffset = function (type) {
    switch (type) {
      case 'sm':
        return this.opts.offset.sm
        break
      case 'me':
        return this.opts.offset.me
        break
      case 'lg':
        return this.opts.offset.lg
        break
      default:
        this.error('出错了没有找到对应的偏移量')
        break
    }
  }

  //创建风机对象并且 弹窗窗口
  field.prototype.createWindmill = function () {
    var _self = this
    //对data 进行包装
    var obj = {
      success: true,
      data: this.makeData(this.opts.data)
    }
    var tmpl = document.getElementById('j-tmpl').innerHTML
    var doTtmpl = doT.template(tmpl)
    var html = doTtmpl(obj)
    this.debugMsg(html)
    this.mainEle.append(html)
    //初始化 弹出框
    $('.windeymill-div').tipso({
      position: 'top-right',
//				hideDelay:100000,
      width: _self.opts.infoWidth,
      background: _self.opts.tipBackground,
      onBeforeShow: function (ele, tipso) {
        var resize = _self.getResize()
        $(ele).tipso('update', 'offsetX', (resize.scale) * $(ele).attr('offsetX'))
        $(ele).tipso('update', 'offsetY', (resize.scale) * $(ele).attr('offsetY'))
        $(ele).tipso('update', 'content', $('#' + $(ele).attr('id') + '_content').html())

      },
      tooltipHover: true
    })
    $('.windeymill-div').bind('click', function (e) {
      _self.debugMsg(e.currentTarget)
      _self.opts.onclick(e.currentTarget)
    })
    return this
  }

  //创建标题
  field.prototype.createTitle = function () {
    var _self = this
    //对data 进行包装
    var obj = {
      success: true,
      data: this.opts.titleData
    }
    var tmpl = document.getElementById('title-tmpl').innerHTML
    var doTtmpl = doT.template(tmpl)
    var html = doTtmpl(obj)
    this.debugMsg(html)
    this.mainEle.append(html)
    return this
  }

  //创建速度表
  field.prototype.createSpeed = function () {
    var tmpl = document.getElementById('speed-tmpl').innerHTML
    var doTtmpl = doT.template(tmpl)
    var _self = this
    this.debugMsg('速度表')
    this.debugMsg(_self.opts.speedData)
    var html = doTtmpl(_self.opts.speedData)
    this.debugMsg(html)
    this.mainEle.append(html)
    move('.speed2').rotate(this.opts.speedData.drection).duration('2s').end()
    return this
  }

  //更新方法
  field.prototype.update = function (d) {
    var _self = this
    $.ajax({
      type: 'post',
      url: d.url,
      data: {},
      dataType: 'json',
      async: true,
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        _self.error(XMLHttpRequest.status)
        _self.error(XMLHttpRequest.readyState)
        _self.error(textStatus)

//				(默 认: 自动判断 (xml 或 html)) 请求失败时调用时间。
//				参数有以下三个：XMLHttpRequest 对象、错误信息、（可选）捕获的错误对象。
//				如果发生了错误，错误信息（第二个参数）除了得到null之外，
//				还可能是"timeout", "error", "notmodified" 和 "parsererror"。

//				textStatus: "timeout", "error", "notmodified" 和 "parsererror"
//				XMLHttpRequest.readyState: 状态码的意思
//				0 － （未初始化）还没有调用send()方法
//				1 － （载入）已调用send()方法，正在发送请求
//				2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
//				3 － （交互）正在解析响应内容
//				4 － （完成）响应内容解析完成，可以在客户端调用了
      },
      success: function (data) {
        _self.titleUpdate(data.titleData, _self)
        _self.dataUpdate(data.data, _self)
        _self.speedUpdate(data.speedData, _self)
        setTimeout(function () {
//					_self.debugMsg(timer);
          _self.update(d)
        }, d.timer)
      }
    })
  }

  //更新标题内容
  field.prototype.titleUpdate = function (data, _self) {
    //这个更新方法需要根据数据格式变化
    //TODO 这个方法很不好~
    //_self.debugMsg(data);
    $.each($('#' + data.name).find('.num'), function (i, ele) {
      //_self.debugMsg($(ele));
      $(ele).html(data[$(ele).attr('id')])
    })
  }

  //更新风机内容
  field.prototype.dataUpdate = function (d, _self) {
    var data = _self.makeData(d)
    //这里没有用数据绑定 就有点坑了 要自己写下更新的方法
    $.each(data, function (i, ele) {
      var elementDiv = $('#' + ele.code)
      //修改类型
      //elementDiv.attr("class","windeymill-div " +ele.type);
      //修改偏移量
      elementDiv.attr('offsetX', ele.offsetX)
      elementDiv.attr('offsetY', ele.offsetY)
      //修改转速
      elementDiv.find('.windmill-blades').attr('class', 'windmill-blades windmill-' + ele.windSpeed)
      //修改状态颜色
      elementDiv.find('.windeymill-color').attr('class', 'windeymill-color ' + ele.status)
      //修改其他值
      var elementDivContent = $('#' + ele.code + '_content')
      elementDivContent.find('#content_code').html(ele.code)
      elementDivContent.find('#contend_speed').html(ele.speed)
      elementDivContent.find('#contend_windWheelSpeed').html(ele.windWheelSpeed)
      elementDivContent.find('#contend_activePower').html(ele.activePower)
      elementDivContent.find('#contend_reactivePower').html(ele.reactivePower)
      elementDivContent.find('#contend_motorSpeed').html(ele.motorSpeed)
      elementDivContent.find('#contend_powerGeneration').html(ele.powerGeneration)

    })

  }

  //更新速度表
  field.prototype.speedUpdate = function (data, _self) {
    move('.speed2').rotate(data.drection).duration('2s').end()
  }

  //获取当前 x，y的变化值和缩放的值
  field.prototype.getResize = function () {
    this.debugMsg('x' + this.left + 'y' + this.top)
    return {'x': this.left, 'y': this.top, 'scale': this.scale}
  }

  //创建背景图片及轮播
  field.prototype.createBackground = function () {
    var liEle = ''
    var self = this
    $.each(this.opts.img, function (i, ele) {
      liEle += '<li><img name="" src="' + ele + '"></li>'
    })
    this.mainEle.append('<div class="flexslider"><ul class="slides">' + liEle + ' </ul></div><div class="bannerButton"><div id="prev" class="left"></div><div id="next" class="right"></div></div>')
    //初始化轮播
    this.slider = ''
//		$(window).load(function() {
    self.debugMsg('初始化轮播')
    $('.flexslider').flexslider({
      animation: 'slide',//滑动
      slideshow: false,
      directionNav: false,//左右按钮
      controlNav: false, //Boolean:  usage是否显示控制菜单
      keyboard: false, // 键盘控制
      start: function (slider) {
        $('body').removeClass('loading')
      }
    })
    self.slider = $('.flexslider').data('flexslider')
    $('#prev').click(function () {
      self.slider.flexAnimate(self.slider.getTarget('prev'), true)
    })
    $('#next').click(function () {
      self.slider.flexAnimate(self.slider.getTarget('next'), true)
    })
//		});
    return this
  }

  //判断是不是ios系统
  field.prototype.isIos = function () {
    var ua = navigator.userAgent
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      isAndroid = ua.match(/(Android)\s+([\d.]+)/),
      //ipad iphone android 均记为手机
      isIos = isIphone || ipad
    return isIos
  }
  return field
}))