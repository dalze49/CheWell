var healthBar=null;
var satBar=null;
var energy=null;

var skill01=null;
var skillLevel01=null;
var skillCost01=null;

var eat=null;

var day=null;
var time=null;
var stage=null;
var timer=null;

var foodHP=null;
var food=null;

var nextFood=null;

var updateTimer = null;
var stageTimer = null;
var leftTime = 200;

var user=null;
var curFood=null;

var foodImg = ["./img/curFood.png"];

var Food = function(name, maxHP, satiery, imgSrc){
    this.name = name;
    this.maxHP = maxHP;
    this.curHP = maxHP;
    this.sat = satiery;
    this.img = imgSrc;
    
    this.getName = function() { return this.name; };
    this.getCurHP = function() { return this.curHP; };
    this.getMaxHP = function() { return this.maxHP; };
    this.getSat = function() { return this.sat};
    this.setCurHP = function(HP) {this.curHP = HP;};
    
    this.indigestion = function() {
        return this.curHP/this.maxHP;
    };
}

var Player = function(initATK, maxSat, maxHP){
    this.ATK = initATK;
    this.maxSat = maxSat;
    this.curSat = maxSat;
    this.maxHP = maxHP;
    this.curHP = maxHP;
    
    this.indigPercent = 1;
    this.indigLevel = 0;
    
    <!--chew power-->
    this.skillLevel01 = 1;
    this.skillCost01 = 50;
    
    <!-- sat  -->
    this.skillLevel02 = 0;
    this.skillCost02 = 100;
    
    this.upgradePoint = 0;
    
    
    this.getPercentHP = function(){return 100*this.curHP/this.maxHP;};
    this.getPercentSat = function(){return 100*this.curSat/this.maxSat;};
    <!-- 소화불량 확률 계산 -->
    this.getIndigPercent = function(){
        return 1 - (1/indigPercent);
    };
    <!-- 씹기 함수 -->
    this.chew = function ( curFood ){
        if(curFood.getCurHP() - this.ATK <= 0){
            curFood.setCurHP(0);
        }else{
            curFood.setCurHP(curFood.getCurHP() - this.ATK);
        }
    };
    <!-- 삼키기 함수 -->
    this.swallow = function( food ){
        this.indigPercent += food.indigestion();
        <!-- 대충 소화불량함수가 들어갈 자리 -->
        if(this.curSat + food.sat > this.maxSat){
            this.curSat = this.maxSat;
        }else{
            this.curSat += food.sat;
        }
    };
    <!-- 씹는 힘 강화 -->
    this.Skill01Up = function( newATK ){ this.ATK = newATK; };
}

var GM = function( user, foods){
    this.user = user;
    this.foods = foods;
    var curFood;
}

function update(){
    healthBar.css({"height":(user.getPercentHP()+"%"),"top":((100-user.getPercentHP())+"%")});
    satBar.css({"height":(user.getPercentSat()+"%"),"top":((100-user.getPercentSat())+"%")});
    user.curSat -=0.01;
    foodHP.text(curFood.getCurHP()+"/"+curFood.getMaxHP());
}

function newFood(){
    newf = new Food("Pizza",100,20,foodImg[0]);
    food.attr("src",newf.img);
    return newf;
}

$(document).ready(function(){
    healthBar = $('#health');
    satBar = $('#sat');
    energy = $('#energy');

    skill01 = $('#skill01');
    skillLevel01 = $('#skillLevel01');
    skillCost01 = $('#skillCost01');

    eat = $('#eat');

    day = $('#day');
    time = $('#time');
    stage = $('#stage');
    timer = $('#timer');

    foodHP = $('#hp');
    food =$('#food');

    nextFood = $('#nextFood');
    
    user = new Player(10,100,100);
    curFood = newFood();
    
    food.click(function(){
        user.chew(curFood);
    });
    
    eat.click(function(){
        user.swallow(curFood);
        curFood = newFood();
    });
    
    updateTimer = setInterval(update,10);
    stageTimer = setInterval(function() {
        timer.text(leftTime+"sec");
        leftTime-=1;
    }, 1000);
});


