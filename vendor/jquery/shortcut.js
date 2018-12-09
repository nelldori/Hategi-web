
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


// 특정 모달이 클릭 되었을때 장소의 좌표만 저장
$('#portfolioModal1').on('shown.bs.modal', function(e)){
    // IT cafe 좌표값
    localStorage["x"]= 1.59;   // xCoord
    localStorage["y"]= 0.314;  // yCoord
    window.alert("된다구욧!");
}


// '바로 안내' 버튼 클릭시 좌표값을 turtlebot_queue 에 저장 (push the coordinates to the server and monitor the status)
escortButton.onclick = function(){
	push_xy(myDomain,localStorage["x"],localStorage["y"]);
	statuscheck(myDomain,localStorage["id"]);
}


//when the cancel button is pressed tell the server to cancel the request and update the UI
// 취소했을때 해당 id 제거해주고 ui전환
//취소는 없으니까 필요없음
noEscortButton.onclick = function(){
	noEscort(myDomain,localStorage["id"]);
	localStorage.removeItem('id');
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
