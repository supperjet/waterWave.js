/*
 waterWave.js
 Author Yufei Zhou
*/
(function(window, factory){
    
    if(typeof define === "function" && define.amd){
	//AMD
		define(factory);
	}else if(typeof module === "object" && module.exports){
	//CMD
		module.exports = factory();
	}else{
	//window
		window.waterWave = factory();
	}
    
}(typeof window !== "undefined" ? window : this, function(selector, userOptions){
    var waterWave = function(selector, userOptions){
        
    "user strict";
        
    var options = {
        //canvas宽高
        cW: 1360,
        cH: 700,
        
        //液面位置
        baseY: 350,
        
        //上层颜色
        oneColor: "#6ca0f6",
        
        //下层颜色
        twoColor: "#367aec",
        
        //顶点数目
        vertexsNum: 250,
        
        //初始浪高
        autoDiff: 1000,
        
        //是否支持滚轮滚动
        isMouseWhell: true,
        
        //是否来个雨滴
        isDrop: true,
        
        //雨滴半径
        dropRadius: 3,
        
        //雨滴位置
        dropLocation: 500,
        
        //雨滴下落加速度
        dropAcce: 0.015,
        
        //是否显示粘度提示
        isShowTips: true
    }
    
    /*******
    全局变量
    *******/
    var canvas = null,
        ctx = null,
        W = null,
        H = null,
        
        //顶点集合
        vertexes = [],
        
        //差分数组
        diffPt = [],
        
        //差分值
        autoDiff = 1000,
        
        //震荡点
        vPos = null,
        
        //缓冲值
        dd = 15,
        
        //水滴
        rainDropNew = null;
    
    
    //1.参数混合
    var mergeOptions = function(userOptions, options){
			Object.keys(userOptions).forEach(function(key){
				options[key] = userOptions[key];
			});
    }
    
    //2.顶点类
    function Vertex(x,y,baseY){
		this.baseY = baseY;
		this.x = x;
		this.y = y;
		this.vy = 0;
		this.targetY = 0;
		this.friction = 0.15;
		this.deceleration = 0.95;
	}
		
    Vertex.prototype.updateY = function(diffVal){
		this.targetY = diffVal + this.baseY;
		this.vy += (this.targetY - this.y);
		this.vy *= this.deceleration;
		this.y += this.vy * this.friction;
	}
    
    //3.雨滴
    function rainDrop(radius,color){
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
        this.scaleX = 1;
        this.scaleY = 1;
        this.color = color;
    }

    rainDrop.prototype.draw = function(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX,this.scaleY);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0,0,this.radius,0,Math.PI*2,false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    
    //4.生成水滴
    var makeRainDrop = function(){
        rainDropNew = new rainDrop(options.dropRadius, options.oneColor);
        rainDropNew.x = options.dropLocation;
        rainDropNew.y = 0;
        rainDropNew.vy = 0;
    }
    
    var moveDrop = function(rainDropNew){
        //水滴移动
        rainDropNew.vy += options.dropAcce;
        rainDropNew.y += rainDropNew.vy;
            
        if(rainDropNew.y > options.cH-options.baseY){
            rainDropNew.y = 0;
            rainDropNew.vy = 0;
            vPos = 1 + Math.floor((options.vertexsNum - 2) * rainDropNew.x / W);
            autoDiff = options.autoDiff;
            diffPt[vPos] = autoDiff;
            rainDropNew.y = 0;
            rainDropNew.vy = 0; 
        }
        
        rainDropNew.draw(ctx);   
            
    }
    
    //5.生成液面
    var makeLiquaid = function(ctx){
        ctx.save()
		ctx.fillStyle = options.oneColor;
		ctx.beginPath();
		ctx.moveTo(0, options.cH);
		ctx.lineTo(vertexes[0].x, vertexes[0].y);
		for(var i=1; i<vertexes.length; i++){
			ctx.lineTo(vertexes[i].x, vertexes[i].y);
		}
		ctx.lineTo(options.cW,options.cH);
		ctx.lineTo(0,options.cH);
		ctx.fill();
		ctx.restore();

		ctx.save();
		ctx.fillStyle = options.twoColor;
		ctx.beginPath();
		ctx.moveTo(0, options.cH);
		ctx.lineTo(vertexes[0].x, vertexes[0].y+5);
		for(var i=1; i<vertexes.length; i++){
			ctx.lineTo(vertexes[i].x, vertexes[i].y+5);
		}
		ctx.lineTo(options.cW, options.cH);
		ctx.lineTo(0, options.cH);
		ctx.fill();
		ctx.restore();
        
        if(options.isShowTips){
            ctx.save();
		    ctx.fillStyle="#777";
		    ctx.font="12px sans-serif";
		    ctx.textBaseline="top";
		    ctx.fillText("点 击 液 体 表 面",70,(options.cH-options.baseY)-20);
		    ctx.fillStyle="#fff";
		    ctx.fillText("滑 动 滚 轮 改 变 液 体 粘 度",70,(options.cH-options.baseY)+15);
		    ctx.fillText("滚轮改变粘稠度 / Viscosity: "+((dd-15)*20/7).toFixed(2)+"%",options.cW/2.5,options.cH-50);
		    ctx.restore();
        }
    }
    
    //6.顶点更新
    var update = function(){
		autoDiff -= autoDiff*0.9;
		diffPt[vPos] = autoDiff;

		//左侧
		for(var i=vPos-1; i>0; i--){
			var d = vPos-i;
			if(d > dd){
				d=dd;
			}
			diffPt[i]-=(diffPt[i] - diffPt[i+1])*(1-0.02*d);
		}
		//右侧
		for(var i=vPos+1; i< options.vertexsNum; i++){
			var d = i-vPos;
			if(d>dd){
				d=dd;
			}
			diffPt[i] -= (diffPt[i] - diffPt[i-1])*(1-0.02*d);
		}

		//更新Y坐标
		for(var i=0; i<options.vertexsNum; i++){
			vertexes[i].updateY(diffPt[i]);
		}

	}
	
    //7.鼠标事件
    var mouseInteract = function(ele){
        ele.addEventListener('mousedown', function(e){

		var mouse = {x:null, y:null};

		if(e.pageX||e.pageY){
			mouse.x = e.pageX;
			mouse.y = e.pageY;
		}else{
			mouse.x = e.clientX + document.body.scrollLeft +document.documentElement.scrollLeft;
            mouse.y = e.clientY + document.body.scrollTop +document.documentElement.scrollTop;
		}

		//重设差分值
		if(mouse.y>((options.cH - options.baseY)-50) && mouse.y<((options.cH - options.baseY) +50)){
			autoDiff = options.autoDiff;
			vPos = 1 + Math.floor((options.vertexsNum - 2) * mouse.x / options.cW);
			diffPt[vPos] = autoDiff;
		}

	   }, false);
    
    }
    
    //8.滚轮事件
    var wheelHandler = function(e) {
			var s = ( e.detail ) ? -e.detail : e.wheelDelta;
			s > 0 ? ( dd > 15 ? dd-- :  dd=dd) : ( dd < 50 ? dd++ : dd=dd );
	};

    
    //初始化设置
    var initSetup = function(selector, userOptions){
        mergeOptions(userOptions, options);
        
        canvas = document.getElementById(selector);
        ctx = canvas.getContext('2d');
        
        canvas.width = W = options.cW;
        canvas.height = H = options.cH;
        
        vPos = options.vertexsNum/2;
        
        //生成顶点，初始差分值 options.vertexsNum
        for(var i=0; i<options.vertexsNum; i++){
		   vertexes[i] = new Vertex(options.cW/(options.vertexsNum-1)*i, options.cH-options.baseY, options.cH-options.baseY);
		   diffPt[i] = 0;
        }
        
        //鼠标交互
        mouseInteract(canvas);
        
        //是否支持鼠标滚动
        if(options.isMouseWhell){
            window.addEventListener('mousewheel', wheelHandler);
        }
	
        //水滴
        if(options.isDrop){
           makeRainDrop();
        }
        
    
        (function drawFrame(){
            window.requestAnimationFrame(drawFrame);
            ctx.clearRect(0, 0, W, H);
            
            if(options.isDrop){
                moveDrop(rainDropNew);
            }
            
            update();
            makeLiquaid(ctx);
        }())
    }
    
    initSetup(selector, userOptions)

    }
    
    return waterWave;
}))