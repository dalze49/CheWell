<script src="http://code.jquery.com/jquery-latest.min.js">
var healthBar = JQuery('#health')[0];
var satBar = JQuery('#sat')[0];
var energy = JQuery('#energy')[0];

var skill01 = JQuery('#skill01')[0];
var skillLevel01 = JQuery('#skillLevel01')[0];
var skillCost01 = JQuery('#skillCost01')[0];

var eat = JQuery('#eat')[0];

var day = JQuery('#day')[0];
var time = JQuery('#time')[0];
var stage = JQuery('#stage')[0];
var timer = JQuery('#timer')[0];

var foodHP = JQuery('#hp')[0];
var food =JQuery('#food')[0];

var nextFood = JQuery('#nextFood')[0];


window.onload = function() {};

function Food(name, maxHP, satiery, indigestion, imgSrc){
    this.name = name;
    this.maxHP = maxHP;
    this.curHP = maxHP;
    this.sat = satiery;
    this.img = imgSrc;
    
    this.getName = function() { return this.name; }
    this.getCurHP = function() { return this.curHP; }
    this.getSat = function() { return this.sat}
    this.setCurHP = function(HP) {this.curHP = HP;}
    
    this.indigestion = function() {
        return this.curHP/this.maxHP;
    };
}

var foods = [];

function Player(initATK, maxSat, maxHP){
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
    
    <!-- 소화불량 확률 계산 -->
    this.getIndigPercent = function(){
        return 1 - (1/indigPercent);
    }
    <!-- 씹기 함수 -->
    this.chew = function ( food ){
        if(curFood.getCurHP() - atk <= 0){
            curFood.setCurHP(0);
        }else{
            curFood.setCurHP(curFood.getCurHP() - atk);
        }
    }
    <!-- 삼키기 함수 -->
    this.swallow = function( food ){
        
    }
    <!-- 씹는 힘 강화 -->
    this.Skill01Up = function( newATK ){ this.ATK = newATK; }
}

function GM( user, foods){
    this.user = user;
    this.foods = foods;
    var curFood;
}

</script>

