function person(canvas,cobj,runs,jumps){
    this.canvas=canvas;
    this.cobj=cobj;
    this.runs=runs;
    this.jumps=jumps;
    this.x=0;
    this.y=410;
    this.width=100;
    this.height=100;
    this.speedx=5;
    this.speedy=5;
    this.zhongli=0.4;
    this.status="runs";
    this.state=0;
    this.num=0;
    this.life=3;
}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        //显示那张图片（状态）（张数）（多大的图片）（放到哪个区间）
        this.cobj.drawImage(this[this.status][this.state],0,0,200,200,0,0,this.width,this.height);
        this.cobj.restore();
    }
};
//子弹
function zidan(canvas,cobj){
    this.canvas=canvas;
    this.cobj=cobj;
    this.x=0;
    this.y=0;
    this.width=10;
    this.height=10;
    this.color="blue";
    this.speedx=5;
    this.jia=1;
}
zidan.prototype={
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.fillStyle=this.color;
        cobj.fillRect(0,0,this.width,this.height);
        cobj.restore();
    }
}
//障碍物
function hinder(canvas,cobj,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.state=0;
    this.x=canvas.width-20;
    this.y=460;
    this.width=84;
    this.height=60;
    this.speedx=6;
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,512,512,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
//血
function lizi(cobj){
    this.cobj=cobj;
    this.x = 380;
    this.y = 130;
    this.r = 1+3*Math.random();
    this.color = "red";
    this.speedy = -2;
    this.speedx = Math.random()*4-3;
    this.zhongli = 0.3;
    this.speedr = 0.05;
}
lizi.prototype = {
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.beginPath();
        cobj.fillStyle = this.color;
        cobj.arc(0,0,this.r,0,2*Math.PI);
        cobj.fill();
        cobj.restore();
    },
    update:function(){
        this.x+=this.speedx;
        this.speedy+=this.zhongli;
        this.y+=this.speedy;
        this.r-=this.speedr;
    }
}
function xue(cobj,x,y){
    var arr = [];
    for(var i = 0;i<30;i++) {
        var obj = new lizi(cobj);
        obj.x = x;
        obj.y = y;
        arr.push(obj);
    }
    var t = setInterval(function(){
        for(var i = 0;i<arr.length;i++) {
            arr[i].draw();
            arr[i].update();
            if(arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length==0){
            clearInterval(t);
        }
    },50)
}
function xue1(cobj,x,y){
    var arr = [];
    for(var i = 0;i<30;i++) {

        var obj = new lizi(cobj);
        obj.x = x;
        obj.y = y;
        obj.speedy=4-2*Math.random();
        obj.color="#ccc";
        arr.push(obj);
    }
    var t = setInterval(function(){
        for(var i = 0;i<arr.length;i++) {
            arr[i].draw();
            arr[i].update();
            if(arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length==0){
            clearInterval(t);
        }
    },50)
}
//游戏的主类
function game(canvas,cobj,runs,jumps,hinderImg,runA){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.height=canvas.height;
    this.width=canvas.width;
    this.person=new person(canvas,cobj,runs,jumps);
    this.backx=0;
    this.backSpeed=6;
    this.score=0;//积分
    this.hinderArr=[];
    this.isfire=false;
    this.zidanArr=[];
    this.zidanNum=0;
    this.num=3;
    this.lizi=new lizi(cobj);
    this.z=1;
    this.speeda=7;
    this.r=100;
    this.runA=runA;
}
game.prototype={
    //主运行方法
    play:function(start,mask){
        //大幕拉起
        start.css("animation","start1 2s ease forwards");
        mask.css("animation","mask1 2s ease forwards");
        this.run();
        this.key();
        this.mouse();
    },
    run:function(){
        var that = this;
        var num=0;
        var rand=(4+Math.ceil(6*Math.random()))*1000;
        setInterval(function(){
            num+=50;
            that.cobj.clearRect(0,0,that.width,that.height);
            that.person.num++; /*计算显示的图片*/
            //that.person.speedx=0;
            that.backSpeed=6;
            if(that.person.status=="runs"){
                that.person.state =that.person.num%8;///控制第几张
            }
            else{
                that.person.state = 0;
            }
            /*让人物的x轴发生变化*/
            that.person.x+=that.person.speedx;
            if(that.person.x>that.width/3){
                that.person.x=that.width/3;
                //that.backx-=that.backSpeed;
            }
            that.person.draw();

            //操作子弹
            if(that.isfire){
                for(var j=0;j<that.zidanArr.length;j++){
                    that.zidanNum=j;
                    that.zidanArr[j].speedx+=that.zidanArr[j].jia;
                    that.zidanArr[j].x+=that.zidanArr[j].speedx;
                    that.zidanArr[j].draw();
                }

            }

            //操作障碍物
            if(num%rand==0){
                num=0;
                var obj=new hinder(that.canvas,that.cobj,that.hinderImg);
                obj.state=Math.floor(Math.random()*that.hinderImg.length);
                if(obj.state==1){
                    obj.flag=true;
                    obj.flag2=true;
                }
                if(obj.state==3){
                    obj.flag=true;
                    obj.flag3=true;
                }
                if(obj.state==4){
                    obj.flag=true;
                    obj.flag4=true;
                }
                that.hinderArr.push(obj);
            }
            for(var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.hinderArr[i].speedx;
                that.hinderArr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                    that.hinderArr[i].width=0;
                    that.zidanArr[that.zidanNum].width=0;

                    if(!that.hinderArr[i].flag){
                        xue(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
                        that.person.life--;
                        document.querySelectorAll("span")[2].innerHTML=that.person.life;
                        if(that.person.life==0){
                            alert("Game over");
                            location.reload();
                        }
                        that.hinderArr[i].flag=true;
                    }
                    if(that.hinderArr[i].flag2){
                        xue1(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
                        that.person.life++;
                        document.querySelectorAll("span")[2].innerHTML=that.person.life;
                        that.hinderArr[i].flag2=false;
                    }
                    if(that.hinderArr[i].flag3){
                        xue1(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
                        that.r=150;
                        that.speeda=3;
                        that.hinderArr[i].flag3=false;
                    }
                    if(that.hinderArr[i].flag4){
                        xue1(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
                        that.num+=3;
                        that.hinderArr[i].flag3=false;
                    }
                }
                if(hitPix(that.canvas,that.cobj,that.zidanArr[that.zidanNum],that.hinderArr[i])){
                    that.hinderArr[i].width=0;
                    that.zidanArr[that.zidanNum].width=0;
                
                    if(!that.hinderArr[i].flag){
                        xue1(that.cobj,that.hinderArr[i].x+that.hinderArr[i].width/2,that.person.y+that.person.height/2);
                        document.querySelectorAll("span")[2].innerHTML = that.person.life;
                    }
                    if(that.hinderArr[i].flag2){
                        xue1(that.cobj,that.hinderArr[i].x+that.hinderArr[i].width/2,that.person.y+that.person.height/2);
                        that.person.life++;
                        document.querySelectorAll("span")[2].innerHTML=that.person.life;
                        that.hinderArr[i].flag2=false;
                    }
                    if(that.hinderArr[i].flag3){
                        xue1(that.cobj,that.hinderArr[i].x+that.hinderArr[i].width/2,that.person.y+that.person.height/2);
                        that.r=150;
                        that.speeda=3;
                        that.hinderArr[i].flag3=false;
                    }
                }


                if(that.person.x>(that.hinderArr[i].x+that.hinderArr[i].width)){
                    if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag1){
                        that.score++;
                        document.querySelectorAll("span")[0].innerHTML=that.score;
                        if(that.person.life>5){
                            alert("血量已蓄满，请继续奔跑吧！");
                            that.person.life=5;
                        }

                        if(that.score>3*that.z){
                            that.z++;
                            that.score=0;
                            that.person.life++;
                            document.querySelectorAll("span")[2].innerHTML=that.person.life

                            document.querySelectorAll("span")[0].innerHTML=that.score;
                            document.querySelectorAll("span")[1].innerHTML=that.z;
                        }
                        that.hinderArr[i].flag1=true;
                    }
                }
            }

            /*操作背景*/
            that.backx-=that.backSpeed;
            that.canvas.style.backgroundPositionX = that.backx+"px";
        },50)
    },
    key:function(){
        var that = this;
        var flag = true;
        document.onkeydown = function(e) {
            if (!flag) {
                return;
            }
            flag = false;
            if(e.keyCode==32){  //空格
                that.person.status="jumps";
                var inita=0;
                var y=that.person.y//记录
                /*跳跃动画*/
                var t=setInterval(function(){
                    inita+=that.speeda;
                    if(inita>=180){
                        that.person.y=y;
                        clearInterval(t);
                        flag=true;
                        that.person.status="runs";
                    }
                    else{
                        var top=Math.sin(inita* Math.PI/180)*that.r;
                        that.person.y=y-top;
                    }
                },50)
            }

            // if(e.keyCode==66){
            //     $("btn").eq(0).css("display","none").eq(1).css("display","block");
            // }
        }
    },
    mouse:function(){
        var that=this;
        document.querySelector(".mask").onclick=function(){
            that.zidan=new zidan(that.canvas,that.cobj);
            that.zidanArr.push(that.zidan);
            that.zidan.x=that.person.x+that.person.width;
            that.zidan.y=that.person.y+that.person.height*3/5;
            that.zidan.speedx=5;
            that.isfire=true;
        }
        document.onmouseup=function () {
            that.isfire=false;
        }
    }
};