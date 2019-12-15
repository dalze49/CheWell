
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
	}
	
	function getMaxScore(user){
		var maxScore;
		dbRef.child(user.getID()+'/scores/').orderByChild('score').limitToLast(1).once('value',function(data){
			data.forEach(function(childData){
				console.log(childData.val().score)
			});
		});
	}
	
	function addScore(user,score){
		var today = new Date();
		dbRef.child(user.getID()).child('scores/'+today.getTime()).set({
			score:score,
			date:today.getTime()
		} );
		
		dbRef.child(user.getID()).child('maxScores').once('value',function(data){
			if(data.val() < score){
				dbRef.child(user.getID()).child('maxScore').set({
					score:score,
					date:today.getTime()
				})
			}
		});
	}
	
	function addScoreByID(playerID,score){
		var today = new Date();
		dbRef.child(playerID).child('scores/'+today.getTime()).set({
			score:score,
			date:today.getTime()
		} );
		
		dbRef.child(playerID).child('maxScores').once('value',function(data){
			if(data.val() < score){
				dbRef.child(playerID).child('maxScore').set({
					score:score,
					date:today.getTime()
				})
			}
		});
	}
	
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
		
	}
	
	var User = function (playerID, playerPW){
		this.ID = playerID;
		this.getID = function(){return this.ID;}
		
		dbRef.child(playerID).child('password').once('value', function(data){
			if(playerPW == data.val()){
				alert(playerID+" is login!");
				return this;
			}else{
				alert("Wrong ID or password. please input again");
				return null;
			}
		} );
		
	}

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
	
	top5();
	
    ubSign.click(function(){
        curUser = addAccount(uID.val(),uPW.val());
    });
	
	ubLog.click(function(){
        curUser = login(uID.val(),uPW.val());
		if(curUser != null){
			stat.text(curUser.getID()+"님이 로그인중입니다.");
		}
    });
	
	start.click(function(){
		if(curUser != null){
			alert("Please Login first.");
		}
    });
});