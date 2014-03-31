#VML&SVG绘图
##vipDraw
命令空间,vip前缀
###绘制饼图方法(pie)
  - @param Element  // element, 画布节点
  - @param Object // options 参数
    - @width Int    // width, 画布宽度
    - @height Int   // height, 画布高度
    - @data Array    // 饼图参数
        - @fill String      // 填充色
        - @path Array  // 扇形参数
          - @param  // x0, 圆点x坐标
          - @param  // y0, 圆点y坐标
          - @param  // r, 半径
          - @param  // x-axis-rotation, 弧度
          - @param  // 起始弧度
        - @field Object   // 文本
          - @text String  // 文本
          - @stroke Object  // 文本笔触
            - @color String // 文本颜色
            - @weight String // 文字大小
    - @anim Blooen or Float    // 动态变化系数(小于1变小,大于1变大)(可选)
    - @ring Object    // 圆环参数(可选)
      - @fill String    // 填充色
      - @path Array    // 填充色
        - @param  // x0, 圆点x坐标
        - @param  // y0, 圆点y坐标
        - @param  // r, 半径

###例子
```js
    vipDraw.pie(document.body, {  
      width: 600,  
      height: 600,  
      data: [{  
        fill: '#f90',  
        path: [300, 300, 200, 60, 30],  
        field: {  
          stroke: {  
            color: '#fff',  
            weight: '2.25pt'  
          },  
          text: 'JavaScript'  
        }  
      },{  
        fill: '#f90',  
        path: [300, 300, 200, 60, 30],  
        field: {  
          stroke: {  
            color: '#fff',  
            weight: '2.25pt'  
          },  
          text: 'JavaScript'  
        }  
      },{  
        fill: '#f00',  
        path: [300, 300, 200, 98, 30+60],  
        field: {  
          stroke: {  
            color: '#fff',  
            weight: '2.25pt'  
          },  
          text: 'Ruby'  
        }  
      },{  
        fill: '#0065ff',  
        path: [300, 300, 200, 80, 30+60+98],  
        field: {  
          stroke: {  
            color: '#fff',  
            weight: '2.25pt'  
          },  
          text: 'Java'  
        }  
      },{  
        fill: '#cf0',  
        path: [300, 300, 200, 360-60-98-80, 30+60+98+80],  
        field: {  
          stroke: {  
            color: '#fff',  
            weight: '2.25pt'  
          },  
          text: 'Python'  
        }  
      }],  
      anim: true,  
      ring: {  
        fill: '#fff',  
        path: [300, 300, 150]  
      }  
    });  
```

