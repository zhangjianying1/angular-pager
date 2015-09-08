var appendHtml = (function () {
   return function (el, html) {
       var oDiv = document.createElement('div');
       oDiv.innerHTML = html;
       var childs = oDiv.children;

       for (var i = 0; i < childs.length; i ++) {
          el.appendChild(childs[i].cloneNode(true));
       }
       childs = null;
       oDiv = null;

   }
}());
var getUrl = (function () {
    return function () {

        var url = location.href;
        var re = /\/(\w+\-?\w+)\.html/g;
        url = re.exec(url)[1];
        return url;
    }
}())
var on = (function () {
    return function (event, sign, fn) {
        document.addEventListener(event, function (event) {
            var target = event.target;

            if (typeof sign === 'string') {
                try {

                    while (!target.classList.contains(sign)) {
                        target = target.parentNode;
                    }

                    if (target.classList.contains(sign)) {
                        fn.call(this)
                    }
                } catch (e) {
                    return;
                }
            }

        }, false);
    }
}());
var route = (function(){
    var url = getUrl();
    var state = [url];
    var go = function(url, fn) {
        history.pushState(null, null, url + '.html');
        state.push(url);
        if (fn) {
            fn.call(this);
        }
    };
    var popState = function () {

    };
    var showCurr = function (data) {
        var oBox = document.querySelector('.scroll-box');
        console.log((document.querySelector('.' + data.url) == null))
        if (document.querySelector('.' + data.url) == null) {
            var oDiv = document.createElement('div');
            oDiv.innerHTML = data.html;
            oDiv.classList.add(data.url);
            oBox.appendChild(oDiv);
        }
        var childs = oBox.children;

        for (var i = 0; i < childs.length; i ++) {
            childs[i].style.display = 'none';
        }

        if (oDiv) {
            oDiv.style.display = 'block';

        } else {
            document.querySelector('.' + data.url).style.display = 'block';
        }
    };

    /**
     * @param defulat {Boolean} 如果为真是有js模板
     */
    var getData = function (curr) {
        var url = getUrl()
        //根据url去加载相应的html
        if (curr) {

        } else {
            var data = {
                drawing: '<div class="drawing"><form><div class="model-cont-box"><label>真实姓名：</label>' +
                    '<div class="cont-box-input"><div class="modle-input" data-id="aaa"><input type="text" value="省" disabled="true"></div><div class="modle-input" data-id="bbb"><input type="text" value="省" disabled="true"></div></div></div></div>',
                province: '<div class="province"><ul class="province-list"><li>北京</li><li>上海</li><li>南京</li><li>天津</li><li>河北</li><li>山东</li></ul></div>',
                'number-index': '<div class="mynumber-index"><div class="controll-panel"><ul class="have-line-list">' +
                    '<li class="draw-money"><a href="javascript:;"><i class="panel-icon-draw"></i> <span class="panel-tit"><em>提款</em></span></a></li></ul></div></div>'
            };
        }


        return {
            html: data[url],
            url: url
        };
    };
    window.addEventListener('popstate', function () {
        showCurr(getData());
    }, false);
    return {
        showCurr: showCurr,
        getData: getData,
        go: go,
        state: state
    }
}());

route.showCurr(route.getData());

/* 提现 */
on('click', 'panel-tit', function () {

    //跳转
    route.go('drawing', function () {
        route.showCurr(route.getData());
    });
});

/* 省份选择 */
on('click', 'modle-input', function(){
    //跳转
    route.go('province', function () {
        route.showCurr(route.getData());
    });
});

//on('click', 'back', function () {
//    var url = getUrl();
//    if (route.state.length === 1) {
//        history.forward();
//    } else {
//        route.state.length = route.state.indexOf(url);
//        console.log(route.state)
//        history.replaceState(null, null, route.state[route.state.length-1] + '.html');
//        route.showCurr(route.getData());
//    }
//
//});