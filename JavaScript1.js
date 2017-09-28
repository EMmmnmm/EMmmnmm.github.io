window.onload = function () {

    //滑动菜单
    var oslUl = document.getElementById('slul');
    var aslLi = oslUl.getElementsByTagName('li');
    var oBg = aslLi[aslLi.length - 1];

    for (var i = 0; i < aslLi.length - 1; i++) {
        aslLi[i].onmouseover = function () {
            slide(oBg, this.offsetLeft);
        }
    }

    //无缝滚动
    var ogdDiv = document.getElementById('gddiv');
    var ogdUl = document.getElementById('gdul');
    var agdLi = ogdUl.getElementsByTagName('li');
    var gdtimer = null;

    ogdUl.innerHTML += ogdUl.innerHTML;
    ogdUl.style.width = agdLi.length * agdLi[0].offsetWidth + 'px';
    gdT();

    function gdT() {
        gdtimer = setInterval(function () {
            if (ogdUl.offsetLeft == -ogdUl.offsetWidth / 2)
                ogdUl.style.left = 0;
            ogdUl.style.left = ogdUl.offsetLeft - 5 + 'px';
        }, 30);
    };

    ogdDiv.onmouseover = function () {
        clearInterval(gdtimer);
    }
    ogdDiv.onmouseout = function () {
        gdT();
    }

    //另
    var eDiv = document.getElementById('ediv');
    var eUl = document.getElementById('eul');
    var eLi = eUl.getElementsByTagName('li');
    var etime = null;
    var eLeft = 0;

    eUl.innerHTML += eUl.innerHTML;
    eUl.style.width = eLi.length * eLi[0].offsetWidth + 'px';
    t();

    function t() {
        etime = setInterval(function () {
            if (eLeft == 0) {
                Move(eUl, { left: -400 });
                eLeft = -400;
            } else if (eLeft == -400) {
                Move(eUl, { left: -800 });
                eLeft = -800;
            } else if (eLeft == -800) {
                Move(eUl, { left: -1200 });
                eLeft = -1200;
            }
            else if (eLeft == -1200) {
                Move(eUl, { left: -1600 }, function () {
                    eUl.style.left = 0;
                });
                eLeft = 0;
            }
        }, 2000);
    }

    eDiv.onmouseover = function () {
        clearInterval(etime);
    }
    eDiv.onmouseout = function () {
        t();
    }

    //方块
    var oDia = document.getElementById('dia');
    var lastx = 0;
    var lasty = 0;

    oDia.onmousedown = function (ev) {
        var eve = ev || event;
        var disx = eve.clientX - oDia.offsetLeft;
        var disy = eve.clientY - oDia.offsetTop;


        document.onmousemove = function (ev) {
            var eve = ev || event;
            var L = eve.clientX - disx;
            var T = eve.clientY - disy;

            oDia.style.left = L + 'px';
            oDia.style.top = T + 'px';

            speedx = L - lastx;
            speedy = T - lasty;

            lastx = L;
            lasty = T;
        };

        document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null;
            document.title = speedx + '/' + speedy;
            sl();
        };

        clearInterval(timer);
        return false;
    }
}


//运动框架
function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}

function Move(obj, json, fn) {
    clearInterval(obj.time);
    obj.time = setInterval(function () {
        var bStop = true;
        for (var attr in json) {
            var cur = null;
            if (attr == 'opacity')
                cur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
            else
                cur = parseInt(getStyle(obj, attr));

            var speed = (json[attr] - cur) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (json[attr] != cur)
                bStop = false;
            if (attr == 'opacity') {
                obj.style.filter = 'alpha(opacity:' + cur + speed + ')';
                obj.style.opacity = (cur + speed) / 100;
            }
            else
                obj.style[attr] = cur + speed + 'px';
        }

        if (bStop) {
            clearInterval(obj.time);
            if (fn)
                fn();
        }
    }, 30)
}


//滑动菜单
var slspeed = 0;
var left = 0;
function slide(obj, target) {
    clearInterval(obj.time);

    obj.time = setInterval(function () {
        slspeed += (target - obj.offsetLeft) / 5;
        slspeed *= 0.7;

        left += slspeed;          //减少多次使用slspeed后产生的误差

        if (Math.abs(left) < 1 && Math.abs(target - left) < 1) {
            obj.style.left = target + 'px';     //或再使用一次  obj.style.left = left + 'px';
            clearInterval(obj.time);
        }
        else
            obj.style.left = left + 'px';
    }, 30);
}


//方块
var speedx = 0;
var speedy = 0;
var timer = null;
function sl() {
    var oDia = document.getElementById('dia');
    clearInterval(timer);
    timer = setInterval(function () {
        speedy += 2;

        var l = oDia.offsetLeft + speedx;
        var t = oDia.offsetTop + speedy;

        //限制
        if (t >= document.documentElement.clientHeight - oDia.offsetHeight) {
            t = document.documentElement.clientHeight - oDia.offsetHeight;
            speedy *= -0.8;
            speedx *= 0.9;
        }
        else if (t <= 0) {
            t = 0;
            speedy *= -0.8;
            speedx *= 0.9;
        }
        if (l >= document.documentElement.clientWidth - oDia.offsetWidth) {
            l = document.documentElement.clientWidth - oDia.offsetWidth;
            speedx *= -0.8;
            speedy *= 0.9;
        } else if (l <= 0) {
            l = 0;
            speedx *= -0.8;
            speedy *= 0.9;
        }

        //防止滑动
        if (Math.abs(speedx) < 1)
            speedx = 0;
        if (Math.abs(speedy) < 1)
            speedy = 0;

        //判断是否停止
        if (speedx == 0 && speedy == 0 && t == document.documentElement.clientHeight - oDia.offsetHeight) {
            clearInterval(timer);
        }
        else {
            oDia.style.left = l + 'px';
            oDia.style.top = t + 'px';
        }
    }, 15);
}
