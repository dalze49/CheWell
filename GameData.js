function Food(name, maxHP, satiery, indigestion){
    this.name = name;
    this.maxHP = maxHP;
    this.curHP = maxHP;
    this.sat = satiery;
    
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

    this.powerLevel = 0;
    this.powerUpCost = 100;
    this.satLevel = 0;
    this.satUpCost = 100;
    
    this.upgradePoint = 0;

    this.getIndigPercent = function(){
        return 1 - (1/indigPercent);
    }

    this.chew = function ( food ){
        if(curFood.getCurHP() - atk <= 0){
            curFood.setCurHP(0);
        }else{
            curFood.setCurHP(curFood.getCurHP() - atk);
        }
    }

    this.swallow = function( food ){
        
    }
}

function GM( user, foods){
    this.user = user;
    this.foods = foods;
    var curFood;
}
