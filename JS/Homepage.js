
	var uID = null;
	var uPW = null;
	
	var ubSign = null;
	var ubLog = null;
	
    var dbRef = null;
	var curUser = null;
	var stat = null;
	var start = null;
	
	var rank = [[null,null],[null,null],[null,null],[null,null],[null,null]];
	
	function login(playerID, playerPW){
		return new User(playerID, playerPW);
	}
	
	const snapshotToArray = snapshot => {
		const ret = [];
		snapshot.forEach(childSnapshot => {
			ret.push(childSnapshot);
		});
		return ret;
	};
	
	function top5(){
		var maxScore = null;
		var i = 0;
		dbRef.orderByChild('maxScore/score').limitToLast(5).once('value',function(data){
			snapshotToArray(data).reverse().forEach(function(childData){
				rank[i][0].text(childData.key);
				rank[i++][1].text(childData.child('maxScore').val().score);
				//console.log( childData.key+' : '+childData.child('maxScore').val().score);
			});
		});
	};
	
	function getMaxScore(user){
		var maxScore;
		dbRef.child(user.ID+'/scores/').orderByChild('score').limitToLast(1).on('value',function(data){
			data.forEach(function(childData){
				//console.log(childData.val().score);
				stat.text(curUser.ID+"님이 로그인중입니다.\n"+curUser.ID+"님의 최고점수: "+childData.val().score);
			});
		});
	}
	
	
	function addScore(user,score){
		var today = new Date();
		dbRef.child(user.ID).child('scores/'+today.getTime()).set({
			score:score,
			date:today.getTime()
		} );
		
		dbRef.child(user.ID).child('maxScore/score').once('value',function(data){
			data.forEach(function(childData){
				if(childData.val() < score){
					dbRef.child(user.ID).child('maxScore').set({
						score:score,
						date:today.getTime()
					})
				}
			});
			
		});
	};
	
	function addAccount(playerID, playerPW){
		dbRef.child(playerID).child('password').once('value', function(data){
			if(data.val() != null){
				alert(playerID+" is already in srever");
			}else if(playerPW == "" || playerID == ""){
				alert("ID and password must not be null");
			}else{
				alert(playerID+" is added to server");
				dbRef.child(playerID).set({
					password: playerPW,
					scores: null,
					maxScore: {
						date:0000,
						score:0
					}
				});
			}
		} );
		
	};
	
	var User = function (playerID, playerPW){
		this.ID = playerID;
		this.PW = playerPW;
		
		dbRef.child(playerID).child('password').once('value', function(data){
			if(playerPW == data.val()){
				alert(playerID+" is login!");
				return this;
			}else{
				alert("Wrong ID or password. please input again");
				return null;
			}
		} );
		
	};

$(document).ready(function(){
    // Your web app's Firebase configuration
	 
	
    var firebaseConfig = {
        apiKey: "AIzaSyDS_suXdmod8qlmjfq62fLVHdwHynHOqVk",
        authDomain: "chewell-b6097.firebaseapp.com",
        databaseURL: "https://chewell-b6097.firebaseio.com",
        projectId: "chewell-b6097",
        storageBucket: "chewell-b6097.appspot.com",
        messagingSenderId: "307133059934",
        appId: "1:307133059934:web:49ca2356579b59751735cf",
        measurementId: "G-PDV44KTRN3"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
 
    uID = $('#id');
	uPW = $('#passwd');
	
	ubSign = $('#sign');
	ubLog = $('#login');
	stat = $("#status");
	start = $("#start");
	
	for(var j = 0 ; j< 5; j++){
		for(var i = 0; i<2; i++){
			var tmp = '#rank'+j+i;
			rank[j][i] = $(tmp);
		}
	}
	
    dbRef = firebase.database().ref().child('user');
	//localStorage.clear();
	if(localStorage.getItem("currentUser") != null){
		curUser = JSON.parse(localStorage.getItem("currentUser"));
		if(stat != null){
			stat.text(curUser.ID+"님이 로그인중입니다.");
			getMaxScore(curUser);
		}
		if(ubLog != null) ubLog.attr("value","Logout");
	}
	
	top5();
	
	if(ubSign != null)
    ubSign.click(function(){
        curUser = addAccount(uID.val(),uPW.val());
    });
	
	if(ubLog != null)
	ubLog.click(function(){
		if(curUser == null){
			curUser = login(uID.val(),uPW.val());
			if(curUser != null){
				stat.text(curUser.ID+"님이 로그인중입니다.");
				getMaxScore(curUser);
				localStorage.setItem("currentUser", JSON.stringify(curUser));
				ubLog.attr("value","Logout");
			}
		}else{
			ubLog.attr("value","Login");
			curUser = null;
			localStorage.removeItem("currentUser");
			stat.text("현재 로그아웃 상태입니다.");
			
		}
    });
	
	if(start != null)
	start.click(function(){
        if(curUser == null){
            alert("Please Login first.");
            return ;
        }
        location.href="./main.html"
    });
});