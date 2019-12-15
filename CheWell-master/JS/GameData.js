<!--포만감 감소 수치/ -n sat/sec -->
var satDownSpeed = 5;

var healthBar=null;
var satBar=null;

<!--energy UI-->
var energy=null;

<!--업그레이드 UI-->
var skill01=null;
var skillLevel01=null;
var skillCost01=null;

<!--삼키기 UI-->
var eat=null;

<!--일 UI-->
var day=null;
var dayNum=1;

<!--아침 점심 저녁 UI, dayTimeColor는 각각 낮, 저녁, 아침 순서-->
var dayTime=null;
var dayTimeNum=0;
var dayTimeStr=["아침","점심","저녁"];
var dayTimeColor=["lightyellow","tomato","lightblue"];

<!--스테이지 UI-->
var stage=null;
var stageMax=15;
var stageCur=1;

<!--음식 UI-->
var foodHP=null;
var food=null;

var nextFoodSrc=null;
var nextFoodName=null;
var nextFoodHP=null;

<!--업데이트 타이머 객체-->
var updateTimer = null;

<!--게임 스테이지 타이머 UI-->
var timer=null;
var stageTimer=null;
var stageTimerNum=200;

<!--유저, 음식 객체-->
var user=null;
var curFood=null;
var nextFood=null;

<!--음식 이미지 배열-->
var foodImg = new Array();
foodImg[0] = "./img/food/hamburger.png";
foodImg[1] = "./img/food/hotdog.png";
foodImg[2] = "./img/food/pie.png";
foodImg[3] = "./img/food/pizza.png";
foodImg[4] = "./img/food/sandwich.png";
foodImg[5] = "./img/food/spagetti.png";

<!--음식 이름 배열-->
var foodName = new Array();
foodName[0] = "햄버거";
foodName[1] = "핫도그";
foodName[2] = "파이";
foodName[3] = "피자";
foodName[4] = "샌드위치";
foodName[5] = "스파게티";

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
    
    this.getEnergy = function(){
        return this.maxHP-this.curHP;
    }
}

var Player = function(initATK, maxSat, maxHP){
    this.ATK = initATK;
    this.maxSat = maxSat;
    this.curSat = maxSat;
    this.maxHP = maxHP;
    this.curHP = maxHP;
    this.energy=0;
    
    this.indigPercent = 1;
    this.indigLevel = 0;
    this.indigStack = 0;
    
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
        return 1 - (1/this.indigPercent);
    };
    <!-- 씹기 함수 -->
    this.chew = function( curFood ){
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

        if(this.indigStack>=1)
        {
            food.sat/=2;
            this.indigStack--;
        }

        var indigRan = Math.round(Math.random()*10);
        if((this.getIndigPercent()*10)/1>=indigRan)
        {
            this.indigStack+=5;
            this.indigPercent=1;
        }
       
        if(this.curSat + food.sat > this.maxSat){
            this.curSat = this.maxSat;
        }else{
            this.curSat += food.sat;
        }
        
        stageCur++;
        if(stageCur >= stageMax){
            stageNext();
        }
        this.energy+=food.getEnergy();
    };
    <!-- 씹는 힘 강화/ newATK 만큼 ATK값이 추가됨 -->
    this.skill01Up = function( newATK ){
        if(this.energy-this.skillCost01>=0){
            this.ATK += newATK;
            this.energy-=this.skillCost01;
            this.skillLevel01++;
            this.skillCost01 += 30;
        }
    };
}

var GM = function( user, foods){
    this.user = user;
    this.foods = foods;
    var curFood;
}

function update(){
    <!--UI 업데이트-->
    healthBar.css({"height":(user.getPercentHP()+"%"),"top":((100-user.getPercentHP())+"%")});
    satBar.css({"height":(user.getPercentSat()+"%"),"top":((100-user.getPercentSat())+"%")});
    if(user.curSat - 0.01 * satDownSpeed >= 0){
        user.curSat -=0.01 * satDownSpeed;
    }else{
        user.curHP -=20;
        user.curSat = user.maxSat;
        if(user.curHP <= 0)
        {
            alert("game over!");
         location.href="./CheWell Home Page.html";
        }
    }
    
    foodHP.text(curFood.getCurHP()+"/"+curFood.getMaxHP());
    day.text("day "+dayNum);
    dayTime.text(dayTimeStr[dayTimeNum])
    stage.text(stageCur+"/"+stageMax);
    energy.text(user.energy+"E");
    skillLevel01.text("Lv."+user.skillLevel01);
    skillCost01.text(user.skillCost01+"E");
    
    nextFoodSrc.attr("src",nextFood.img);
    nextFoodName.text(nextFood.getName());
    nextFoodHP.text(nextFood.getMaxHP());
}

<!--다음 스테이지 호출-->
function stageNext(){
	document.body.style.background=dayTimeColor[dayTimeNum];
    stageCur = 1;
    stageTimerNum=200;
    dayTimeNum++;
    if(dayTimeNum >= dayTimeStr.length){
        dayTimeNum=0;
        dayNum++;
    }
}

<!--새 음식 추가-->
function newFood(){
    var foodNum = Math.round(Math.random()*5);
    newf = new Food(foodName[foodNum],(dayNum*100+dayTimeNum*20+stageCur*10),20,foodImg[foodNum]);
    nextFoodSrc.attr("src",newf.img);
    return newf;
}

<!--초기화 담당-->
$(document).ready(function(){
    healthBar = $('#health');
    satBar = $('#sat');
    energy = $('#energy');

    skill01 = $('#skill01');
    skillLevel01 = $('#skillLevel01');
    skillCost01 = $('#skillCost01');

    eat = $('#eat');

    day = $('#day');
    dayTime = $('#dayTime');
    stage = $('#stage');
    timer = $('#timer');

    foodHP = $('#hp');
    food =$('#food');

    nextFoodSrc=$('#nextFoodSrc');
    nextFoodName=$('#nextFoodName');
    nextFoodHP=$('#nextFoodHP');
    
    user = new Player(10,100,100);
    curFood = newFood();
    food.attr("src",curFood.img);
    nextFood = newFood();
	
    
<!--씹기 버튼-->
    food.click(function(){
        user.chew(curFood);
    });

<!--업그레이드 버튼-->
    skill01.click(function(){
        user.skill01Up(5);
    });
    
    eat.click(function(){
        user.swallow(curFood);
        curFood = nextFood;
        nextFood = newFood();
        food.attr("src",curFood.img);
    });
    
    updateTimer = setInterval(update,10);
    stageTimer = setInterval(function() {
        timer.text(stageTimerNum+"sec");
        stageTimerNum-=1;
        if(stageTimerNum < 0){ stageNext(); };
    }, 1000);
});