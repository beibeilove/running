$(function () {
    var clientW=$(window).width();
    var clientH=$(window).height();
    var canvas=document.querySelector("canvas");
    canvas.width=clientW;
    canvas.height=clientH;
    var cobj=canvas.getContext("2d");
    var runs=$(".run");
    var jumps=$(".jump");
    var start=$(".start");
    var hinderImg=$(".hinder");
    var mask=$(".mask");
    var btn=$(".btn");
    var runA=document.querySelector(".runA");
    var jumpA=document.querySelector(".jumpA");
    var hitA=document.querySelector(".hitA");
    var suiA=document.querySelector(".suiA");
    var dieA=document.querySelector(".dieA");
    var bgA=document.querySelector(".bgA");
    var gameobj=new game(canvas,cobj,runs,jumps,hinderImg,runA,bgA,dieA,jumpA,suiA,hitA);
    btn.one("click",function () {
        gameobj.play(start,mask);
    })
})