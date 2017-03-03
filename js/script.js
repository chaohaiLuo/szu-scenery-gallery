function g(selector){//通用函数
    var method = selector.substr(0,1)=='.'?'getElementsByClassName':'getElementById';
    return document[method](selector.substr(1)); 
}
function random( range ){//随机生成一个值，支持取值范围为图片张数
    var max = Math.max(range[0],range[1]);
    var min = Math.min(range[0],range[1]);
    var diff = max - min;
    var number = Math.ceil(Math.random()*diff+min);
    //ceil 会向上取整
    return number;
}
//输出所有的图片数据
var mydata = data;
function addPhotos(){
    var template = g('#wrap').innerHTML;
    var html=[];
    var nav=[];
    for(var s in mydata){//输出控制按钮，每一个按钮对应一张图片
        var _html = template
            .replace('{{index}}',s)
            .replace('{{img}}',mydata[s].img)
            .replace('{{caption}}',mydata[s].caption)
            .replace('{{desc}}',mydata[s].desc);
        html.push(_html);
        nav.push('<span id="nav_'+s+'" onclick="turn(g(\'#photo_'+s+'\'))" class="i">&nbsp;</span>');
    }
    html.push('<div class="nav">'+nav.join('')+'</div>');
    g('#wrap').innerHTML = html.join('');
    rsort(random([-1,data.length-1])); 
}
addPhotos();
function range(){//计算左右分区的范围
    var range={ left:{ x:[],y:[] },right:{ x:[] ,y:[] }};
    var wrap={
        w: g('#wrap').clientWidth,
        h: g('#wrap').clientHeight
    }
    var photo={
        w: g('.photo')[0].clientWidth,
        h: g('.photo')[0].clientHeight
    }
    range.wrap = wrap;
    range.photo = photo;
    range.left.x=[0-photo.w,wrap.w/2-photo.w/2];
    range.left.y=[0-photo.h,wrap.h];
    range.right.x=[wrap.w/2+photo.w/2,wrap.w+photo.w];
    range.right.y=range.left.y;
    return range;
}
function rsort(n){//海报排序
    var  _photo = g('.photo');
    var photos=[];
    for(var s=0;s<_photo.length;s++){
        _photo[s].className = _photo[s].className.replace(/\s*photo_center\s*/,' ');
        _photo[s].className = _photo[s].className.replace(/\s*photo_front\s*/,' ');
        _photo[s].className = _photo[s].className.replace(/\s*photo_back\s*/,' ');
        _photo[s].className += ' photo_front';
        _photo[s].style.left='';
        _photo[s].style.top='';
        _photo[s].style.transform='rotate(360deg)';
        photos.push(_photo[s]);
    }
    var photo_center = g('#photo_'+n);
    photo_center.className += ' photo_center';
    photo_center = photos.splice(n,1)[0]; 
    var photos_left = photos.splice(0,Math.ceil(photos.length/2));//海报分为左右两个部分
    var photos_right = photos;
    var ranges = range();
    for(var s in photos_left){//左分区
        var photo = photos_left[s];
        photo.style.left= random(ranges.left.x)+'px';
        photo.style.top= random(ranges.left.y)+'px';
        photo.style['transform']='rotate('+random([-150,150])+'deg)';
    }
    for(var s in photos_right){//右分区
        var photo = photos_right[s];
        photo.style.left= random(ranges.right.x)+'px';
        photo.style.top= random(ranges.right.y)+'px';
        photo.style['transform']='rotate('+random([-150,150])+'deg)';
    }
    var navs = g('.i');
    for(var s=0;s<navs.length;s++){
        navs[s].className = navs[s].className.replace(/\s*i_current\s*/,' ');
        navs[s].className = navs[s].className.replace(/\s*i_back\s*/,' ');
    }
    g('#nav_'+n).className += ' i_current ';
}
function turn(elem){//翻转控制
    var str = elem.className;
    var pattern = /photo_front/;
    var n= elem.id.split('_')[1];
    if(!/photo_center/.test(str)){
        return rsort(n);
    }
    if(pattern.test(str)){
        elem.className = str.replace(pattern,"photo_back");
        g('#nav_'+n).className += 'i_back';
    }else{
        elem.className = str.replace(/photo_back/,"photo_front");
        g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
    }
}
