
//자바스크립트로 현재 url가져오기(?)
myDomain = "http://" + window.location.host;
localStorage["x"]= 0;  // xCoord
localStorage["y"]= 0;  // yCoord

//하테기 상태를 매초마다 체크
setInterval(function() {
    if(localStorage['id']){
        statuscheck(myDomain,localStorage['id']);
    }
}, 1000);

$("#ITcafe_Escort").on('click', GotoITcafe() {
  window.location = "map-ITcafe.html";
});

/*
장소별 좌표

이니셜포즈 .323 , -1.25
도킹 1.03, -1.58
엘베 -7.58, -11.3
화장실 -12.1, -15.6
아카 -14.8, -22.6
공대도서관 32.2 -35.6
저층부화장실 51.5, -43.5
*/

// '바로 안내' 버튼 클릭시 좌표값을 turtlebot_queue 에 저장 (push the coordinates to the server and monitor the status)
function GotoITcafe(){
  push_xy(myDomain,"-14.8","-22.6");
  statuscheck(myDomain,localStorage["id"]);
}

function GotoToilet(){
  push_xy(myDomain,"-12.1","-15.6");
  statuscheck(myDomain,localStorage["id"]);
}

function GotoLibrary(){
  push_xy(myDomain,"32.2","-35.6");
  statuscheck(myDomain,localStorage["id"]);
}

function GotoCopyCenter(){
  //###########계단 좌표로 수정해줘야함 계단으로 이동해서 맵보여줄거야
  push_xy(myDomain,"-10","-5.31");
  statuscheck(myDomain,localStorage["id"]);
}

function GotoOffice(){
  //엘베로 이동해서 맵보여줄거야
  push_xy(myDomain,"-7.58","-11.3");
  statuscheck(myDomain,localStorage["id"]);
}

// json이용해서 도메인, 좌표값 서버에 넘겨 주는 함수
function push_xy(domain,x,y) {
  var status;
  var id;
  var script = "/Hategi-server/escort_queue.php?push&quat_z=0.892&quat_w=-1.5&point_x="+ x + "&point_y=" + y;
  console.log(script);

  //the server passes back a unique id for this coffee request.
  //That'll allow us to keep track of future coffee requests
	$.getJSON( domain + script, function( data ) {
		status = data["status"];
		id = data["id"];
		console.log(id);
    localStorage['id'] = id;
	});
}

//check if the coffee has been delivered yet
function statuscheck(domain,id) {
  if( typeof domain === 'undefined' || domain === null ){ return; }
  if( typeof id === 'undefined' || id === null ){return;}

  var howmanybeforeme;
  var status;
  $.getJSON( domain + "/Hategi-server/escort_queue.php?statuscheck&id=" + id + "", function( data ) {
    howmanybeforeme = data["how-many-are-pending-before-id"];
    status = data["status"];

    console.log(status);
    console.log(howmanybeforeme);

    //we're either complete or failed so mark it as canceled
    if(status != "pending") {
      localStorage.removeItem('id');
    }
    else {
      //we're pending still
      //show the number of people before you on the badge
    }
  });
}


//cancel your current coffee request
function noEscort(domain,id) {
	$.getJSON( domain + "/Hategi-server/escort_queue.php?update&id=" + id + "&status=failed", function( data ) {
		$.each( data, function( key, val ) {
			if(data["updated"] == "1") {
				console.log("success");
			}
		});
	});
}
