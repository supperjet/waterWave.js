# waterWave.js
waterWave是一款水波动画插件
### 1、Feature
1. 使用原生canvas，不需依赖任何外部插件
1. 支持`AMD`&&`CMD`规范

### 2、Install&&Useage
下载文件引入`waterWave.js`或`waterWave.min.js`文件

```bash
<canvas id="canvas" style="background:#f5f5f5"></canvas>
   
   <script>
    waterWave('canvas', {
    	//canvs宽高
        cW: 1000,
        cH: 600,
        
        //液面高度
        baseY: 150,
        
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
        dropAcce: 0.018,
        
        //是否显示提示
        isShowTips: true
        })
   </script>
    
```

###3、DEMO
[点击运行demo](http://codepen.io/supperjet/pen/LboKLg)


###4、Configure
|   属性  |   类型  | 默认值 |   描述   |
|--------|-------- |-------|-------- |
|cW| Number| 1367  |canvas宽度|
|cH| Number| 500  |canvas高度|
|baseY| Number | 150 |液面高度|
|oneColor|String| "#6ca0f6" |上层颜色 |
|twoColor| String | "#367aec"  |下层颜色|
|vertexsNum| Number| 250 |顶点数目|
|autoDiff| Number | 1000  |初始浪高|
|isMouseWhell| Boolean| true |是否支持滚轮滚动|
|isDrop| Boolean | true |是否来个雨滴|
|dropRadius|  Number | 3 |雨滴半径|
|dropLocation|   Number | 500  | 雨滴位置|
|isShowTips|  Boolean | true  | 是否显示提示|


###5、Supports browser
- IE 10+
- Chrome
- Firefox
- Opera
- Safari