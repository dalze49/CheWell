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


function Player(initATK, maxSat, maxHP){
    this.ATK = initATK;
    this.maxSat = maxSat;
    this.curSat = maxSat;
    this.maxHP = maxHP;
    this.curHP = maxHP;
    
    this.indigPercent = 1.0;
    this.indigLevel = 0;

    this.powerLevel = 0;
    this.powerUpCost = 100;
    this.satLevel = 0;
    this.satUpCost = 100;
    
    this.upgradePoint = 0;

    this.getIndigPercent = function(){
        return 1 - (1/indigPercent);
    }


}

function GM( user ){
    this.user = user;
    this.foods = [];
    this.curFood;
    
    
    this.chew = function (){
        if(curFood.getCurHP() - user.ATK <= 0){
            curFood.setCurHP(0);
        }else{
            curFood.setCurHP(curFood.getCurHP() - user.ATK);
        }
    }

    this.swallow = function(){
        if(user.curSat + curFood.sat > user.maxSat) {user.curSat = user.maxSat;}
        else{ user.curSat += curFood.sat;}
        
        user.indigPercent += curFood.indigestion();
        
        if(Math.random() < user.getIndigPercent()){ user.indigLevel += 1;}
        
        curFood = foods[Math.floor(Math.random() * foods.length)]
    }
}
