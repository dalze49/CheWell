function Food(name, maxHP, satiery, indigestion){
    this.name = name; //이름, 문자열
    this.maxHP = maxHP; //최대 체력, 정수
    this.curHP = maxHP; //현재 체력, 정수 
    this.sat = satiery; //포만 수치, 실수
    
    this.getName = function() { return this.name; }
    this.getCurHP = function() { return this.curHP; }
    this.getSat = function() { return this.sat}
    this.setCurHP = function(HP) {this.curHP = HP;}
    
    this.indigestion = function() { //소화 불량 확률
        return this.curHP/this.maxHP;
    };
}


function Player(initATK, maxSat, maxHP){
    this.initATK = initATK; //공격력, 정수
    this.maxSat = maxSat; //최대 포만감, 정수
    this.curSat = maxSat; //현재 포만감, 정수
    this.maxHP = maxHP; // 최대 체력, 정수
    this.curHP = maxHP; //현재 체력, 정수
    
    //공격력 = initATK + powerLevel * step
    this.powerLevel = 0;
    this.powerUpCost = 100;
    
    //최대 포만감 = initSat + satLevel * step
    this.satLevel = 0;
    this.satUpCost = 100;
    
    this.getATK = function(){
        return initATK + this.powerLevel * 10;
    }
    
    this.getMaxSat = function(){
        return maxSat + this.satLevel * 10;
    }
    
    this.indigPercent = 1.0; //소화 불량 확률 스택, 실수
    this.indigLevel = 1; //소화 불량 스택
    
    this.upgradePoint = 0; // 성장 수치

    //소화불량 확률
    this.getIndigPercent = function(){
        return 1 - (1/indigPercent);
    }
}

function GM( user ){
    this.user = user;
    this.foods = [];
    this.curFood;
    
    //씹기 함수
    this.chew = function (){
        if(curFood.getCurHP() - user.getATK() <= 0){
            curFood.setCurHP(0);
        }else{
            curFood.setCurHP(curFood.getCurHP() - user.getATK());
        }
    }
    
    //삼키기 함수
    this.swallow = function(){
        var tmpSat = Math.floor(carFood.sat / user.indigLevel);
        //포만감 채우기
        if(user.curSat + tmpSat > user.getMaxSat) {user.curSat = user.getMaxSat;}
        else { user.curSat += tmpSat;}
        
        //소화 불량 확률 스택 업데이트
        user.indigPercent += curFood.indigestion();
        
        //소화 불량 스택 확률 계산
        if(Math.random() < user.getIndigPercent()){ user.indigLevel += 1;}
        
        //랜덤하게 음식 선택
        curFood = foods[Math.floor(Math.random() * foods.length)]
    }
}
