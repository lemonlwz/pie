window.vipDraw = (function(){
  var createNode, method;

  method = {};

  method.degGetPoint = function(deg, r){
    var _p = Math.PI/180;
    return {
      x: parseInt(r - r * Math.sin( deg * _p), 10),
      y: parseInt(r - r * Math.cos( deg * _p), 10)
    };
  };

  method.animate = function(form, to, callback){
    var _time, i = form, speed;
    _time = setInterval(function(){
      speed = (to - i) / 2;
      speed > 0 ? speed = Math.ceil(speed) : speed = Math.floor(speed);
      if(i === to){
        clearInterval(_time);
      } else {
        i += speed;
        callback && callback(i);
      }
    }, 50);
    return _time;
  };

  method.attr = function($elem, opt){
    for( o in opt){
      if (!opt.hasOwnProperty(o)) continue;
      $elem.setAttribute(o, opt[o]);
    }
  };

  if(!!window.document.createElementNS){
    // svg
    method.init = function(win){
      var doc = win.document;
      createNode = function(tagName) {
        return doc.createElementNS('http://www.w3.org/2000/svg', tagName);
      };
    };

    method.wrap = function($elem, width, height){
      var $wrap = createNode('svg');
      method.attr($wrap, {
        width: width,
        height: height,
        version: 1.1,
        xmlns: 'http://www.w3.org/2000/svg',
        style: 'position:relative;left:0;top:0;overflow:hidden;'
      });
      $elem.appendChild($wrap);
      return $wrap;
    };

    method.arcPath = function(x0, y0, r, deg, oDeg){
      var left, top, right, bottom, p1, p2, x1, y1, x2, y2;

      left = x0 - r;
      top = y0 - r;
      right = x0 + r;
      bottom = y0 + r;

      oDeg = typeof oDeg === 'number' ? oDeg : Math.floor(Math.random() * 361);

      p1 = method.degGetPoint(oDeg, r);
      p2 = method.degGetPoint(oDeg + deg, r);

      return {
        x0: x0,
        y0: y0,
        r: r,
        deg: deg,
        oDeg: oDeg,
        path: 'M' + [x0, y0].join(',') +  ' L' + [p1.x + left, p1.y + top].join(',') + ' A' + [r, r].join(',') + ',0,0,0,' + [p2.x + left, p2.y + top].join(',') + ' Z'
      };
    };

    method.createArc = function($elem, opt){
      var $el = createNode('path');
      var _pathRs;

      _pathRs = method.arcPath.apply(null, opt.path);

      method.attr($el, {
        fill: opt.fill,
        stroke: opt.stroke ? opt.stroke.color : '#f00',
        d: _pathRs.path,
        'stroke-width': opt.stroke ? opt.stroke.weight : '3.0001388724496585',
        transform: 'matrix(1,0,0,1,0,0)'
      });

      // anim
      if(opt.anim){
        method.anim($el, _pathRs, opt);
      }

      // data
      if(opt&&opt.data){
        method.data($elem, _pathRs, opt);
      }

      $elem.appendChild($el);
    };

    method.createText = function($elem, opt){
      var $el = createNode('text');
      var $text = createNode('tspan');

      method.attr($el, {
        x: opt.x,
        y: opt.y,
        fill: opt.stroke.color,
        'text-anchor': 'middle',
        'font-size': opt.stroke.weight
      });

      $text.appendChild(document.createTextNode(opt.text));

      $el.appendChild($text);
      $elem.appendChild($el);
    };

    method.data = function($elem, _pathRs, opt){
      var _deg = _pathRs.oDeg + _pathRs.deg/2;
      var _r = _pathRs.r + 80;
      var _left = _pathRs.x0 - _r;
      var _top = _pathRs.y0 - _r;
      var p3 = method.degGetPoint( _deg % 360, _r);
      var x1, y1, x2, y2;

      x1 = p3.x + _left;
      y1 = p3.y + _top;
      x2 = p3.x + _left + 1;
      y2 = p3.y + _top;

      method.createText($elem, {
        x: x1,
        y: y1,
        text: opt.data.text,
        stroke: {
          color: opt.data.color || opt.fill,
          weight: opt.data.weight || '12px'
        },
        path: 'm' + [x1, y1].join(',') + ' l' + [x2, y2].join(',')
      });
    };

    method.anim = function($el, _pathRs, opt){
      var _time;
      opt.anim = typeof opt.anim === 'number' ? opt.anim : 1.1;
      $el.onmouseover = function(){
        clearTimeout(_time);
        _time = method.animate(1000, 1000 * opt.anim, function(i){
          method.attr($el, {
            transform: 'matrix(' + i/1000 + ',0,0,' + i/1000 + ',' + -(i/1000-1) * _pathRs.x0 + ',' + -(i/1000-1) * _pathRs.y0 + ')'
          });
        });
      };

      $el.onmouseout = function(){
        clearTimeout(_time);
        _time = method.animate(1000 * opt.anim , 1000, function(i){
          method.attr($el, {
            transform: 'matrix(' + i/1000 + ',0,0,' + i/1000 + ',' + -(i/1000-1) * _pathRs.x0 + ',' + -(i/1000-1) * _pathRs.y0 + ')'
          });
        });
      };
    };

    method.ring = function($elem, ring){
      var $el = createNode('path');
      var path = ring.path;
      var _pathRs1, _pathRs2;

      _pathRs1 = method.arcPath.apply(null, path.concat([180, 0]));
      _pathRs2 = method.arcPath.apply(null, path.concat([180, 180]));

      method.attr($el, {
        fill: ring.fill || '#fff',
        d: _pathRs1.path + _pathRs2.path
      });

      $elem.appendChild($el);
    };

  } else {
    // vml
    method.init = function(win){
      var doc = win.document;
      doc.createStyleSheet().addRule('.rvml', 'behavior:url(#default#VML)');

      !doc.namespaces.rvml && doc.namespaces.add('rvml', 'urn:schemas-microsoft-com:vml');
      createNode = function(tagName) {
        return doc.createElement('<rvml:' + tagName + ' class="rvml">');
      };
    };

    method.wrap = function($elem, width, height){
      var $wrap = document.createElement('div');
      $wrap.style.cssText = 'position:relative;left:0;top:0;overflow:hidden;width:' + width + 'px;height:' + height + 'px;clip:rect(0px,' + width + 'px,' + height + 'px,0px)';
      $elem.appendChild($wrap);
      return $wrap;
    };

    method.arcPath = function(x0, y0, r, deg, oDeg){
      var left, top, right, bottom, p1, p2, x1, y1, x2, y2;

      left = x0 - r;
      top = y0 - r;
      right = x0 + r;
      bottom = y0 + r;

      oDeg = typeof oDeg === 'number' ? oDeg : Math.floor(Math.random() * 361);

      p1 = method.degGetPoint(oDeg, r);
      p2 = method.degGetPoint((oDeg+deg)%360, r);

      return {
        x0: x0,
        y0: y0,
        r: r,
        deg: deg,
        oDeg: oDeg,
        path: 'at' + [left, top, right, bottom, p1.x + left, p1.y + top, p2.x + left, p2.y + top].join(',') + ' l' + x0 + ',' + y0 + ' x e'
      };
    };

    method.createArc = function($elem, opt){
      var $el = createNode('shape');
      var _pathRs;
      $el.style.cssText = 'HEIGHT: 1px; WIDTH: 1px; POSITION: absolute; LEFT: 0px; FILTER: none; TOP: 0px';
      $el.coordsize = "1,1";
      if(opt.fill){
        $el.fillcolor = opt.fill;
      }
      if(opt.stroke){
        opt.stroke.color ? $el.strokecolor = opt.stroke.color : '';
        opt.stroke.weight ? $el.strokeweight = opt.stroke.weight : '';
      }
      _pathRs = method.arcPath.apply(null, opt.path);
      $el.path = _pathRs.path;

      if(opt&&opt.anim){
        method.anim($el, opt);
      }

      if(opt&&opt.data){
        method.data($elem, _pathRs, opt);
      }

      $elem.appendChild($el);
    };

    method.createText = function($elem, opt){
      var $el = createNode('shape');
      var $textpath = createNode('textpath');
      var $path = createNode('path');

      $el.style.cssText = 'HEIGHT: 1px; WIDTH: 1px; POSITION: absolute; LEFT: 0px; FILTER: none; TOP: 0px;';
      $el.coordsize = "1,1";
      if(opt.stroke){
        opt.stroke.color ? $el.strokecolor = opt.stroke.color : '';
        $el.style.fontSize = opt.stroke.weight;
      }
      $el.path = opt.path;

      $textpath.on = 't';
      $textpath.string = opt.text;

      $path.textpathok = 't';

      $el.appendChild($textpath);
      $el.appendChild($path);

      $elem.appendChild($el);
    };

    method.data = function($elem, _pathRs, opt){
      var _deg = _pathRs.oDeg + _pathRs.deg/2;
      var _r = _pathRs.r + 80;
      var _left = _pathRs.x0 - _r;
      var _top = _pathRs.y0 - _r;
      var p3 = method.degGetPoint( _deg % 360, _r);
      var x1, y1, x2, y2;

      x1 = p3.x + _left;
      y1 = p3.y + _top;
      x2 = p3.x + _left + 1;
      y2 = p3.y + _top;

      method.createText($elem, {
        text: opt.data.text,
        stroke: {
          color: opt.data.color || opt.fill,
          weight: opt.data.weight || '12px'
        },
        path: 'm' + [x1, y1].join(',') + ' l' + [x2, y2].join(',')
      });
    };

    method.anim = function($el, opt){
      var _time;
      opt.anim = typeof opt.anim === 'number' ? opt.anim : 1.1;
      $el.onmouseover = function(){
        var _path = opt.path.slice(0);
        var _r = _path[2];
        clearTimeout(_time);
        _time = method.animate(_r, parseInt(_r * opt.anim, 10), function(i){
          _path[2] = i;
          $el.path =  method.arcPath.apply(null, _path).path;
        });
      };
      $el.onmouseout = function(){
        var _path = opt.path.slice(0);
        var _r = _path[2];
        clearTimeout(_time);
        _time = method.animate(parseInt(_r * opt.anim, 10), _r, function(i){
          _path[2] = i;
          $el.path =  method.arcPath.apply(null, _path).path;
        });
      };
    };

    method.ring = function($elem, ring){
      var $el = createNode('shape');
      var path = ring.path;
      var fill = ring.fill || '#fff';
      var _pathRs1, _pathRs2;

      _pathRs1 = method.arcPath.apply(null, path.concat([180, 0]));
      _pathRs2 = method.arcPath.apply(null, path.concat([180, 180]));

      $el.style.cssText = 'HEIGHT: 1px; WIDTH: 1px; POSITION: absolute; LEFT: 0px; FILTER: none; TOP: 0px';
      $el.coordsize = "1,1";
      $el.fillcolor = fill;
      $el.strokecolor = fill;
      $el.path = _pathRs1.path + _pathRs2.path;

      $elem.appendChild($el);
    };

  }

  method.init(window);

  return {
    pie: function($elem, width, height, opt, ring){
      var $paper = method.wrap($elem, width, height);
      for (var i = 0, l = opt.length; i < l ; i++){
        method.createArc($paper, opt[i]);
      }

      if(ring){
        method.ring($paper, ring);
      }

    }
  };
})();
