var rights = 0, wrongs = 0, easterEggs = 0;
var hints = [];
var h = [];
var answerIsText = [true, true, true, false, false];
var answers = []
var level = 1;
for(var i = 0; i < 5; i++) {
    h.push([false, false, false]);
}
var prevHintRank = -1;

function hintClick(level) {
    hints = ['h1', 'h2'];
    alert(hints[parseInt(name[name.length -1])-1]);
}
function end() {
    document.mainForm.submit();
}
function showQuestionModal() {
    document.getElementById('questionModal').setAttribute('style', 'display: block;');
}
function hideQuestionModal() {
    document.getElementById('questionModal').setAttribute('style', 'display: none;');
}
function showHintModal() {
    document.getElementById('hintModal').setAttribute('style', 'display: block;');
}
function hideHintModal() {
    document.getElementById('hintModal').setAttribute('style', 'display: none;');
}

function submitAnswer() {
    answer = document.getElementById('answer').textContent;
    if(answerIsText[level -1]) {
        if(answers[level - 1] == answer) {
            rights++;
            level++;
            eval('initLevel' + toString(level) + "();");
        }
    }
    else {

    }
}

function initLevel1() {
    level = 1;
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    problem = ["장난스러운 당신의 친구는 홈파티 초대장에 보낸 시간을 논리문제로 만들어 첨부하였다.", "당신은 친구에게 문제적 남자 시청을 추천했던 과거의 당신을 원망해보지만 이미 늦은 일이다.",
    "과거는 저기너머에 두고 당신의 절친한 친구를 위해 문제를 풀어 홈파티에 참여하자.", "a. 홈파티는 수요일에 시작한다.", "b. 홈파티는 목요일에 시작한다.", "c. 홈파티는 금요일에 시작한다.", 
    "d. 홈파티는 토요일에 시작한다.", "e. 홈파티는 일요일에 시작한다."]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    var questionTitle = document.getElementById('questionModalTitle');
    questionTitle.textContent = "문제 1";
}
function initLevel2() {
    level = 2;
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    problem = ["친구가 다음과 같은 식을 초대장에 첨부해서 홈파티를  몇시에 하는지 알려주었다.", "장난스러운 친구를 가진 당신은, 그런 친구를 가진 당신의 업보라 여기고 문제를 만든 친구의 정성을 봐서라도 다음과 같은 문제를 풀자.",
    "$5+3 = 28$", "$7 + 4 = 311$", "$3 + 2 = 15$", "$5 + 4 = p$", "$0 + 0 = q$", "p시 q분에 열린다."]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    var questionTitle = document.getElementById('questionModalTitle');
    questionTitle.textContent = "문제 1";
}
function initLevel3() {
    level = 3;
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    problem = ["장난스러운 친구가 날린 초대장을 푸느라 고생한 당신! ", "당신은 친구의 어려운 초대장 때문에 고생하고 있는 다른 피해자가 얼마나 있을지 알아볼 필요가 있다.",
    "사죄의 의미로 소소한 사탕을 돌리기로 결심한 '착한' 당신은 이 파티에 총 몇명이 올지를 알아보자.", "정말 다행히도 친구는 파티 참여 인원를 이진법으로 초대장에 첨부하였다.",
    "1011(2)"]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    var questionTitle = document.getElementById('questionModalTitle');
    questionTitle.textContent = "문제 3";
}
function initLevel4() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = "{{url_for('static', filename='dark_room.png')}}";
    img.onload = function () {ctx.drawImage(img, 0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);}
}
function initLevel5() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = "{{url_for('static', filename='cong.png')}}";
    img.onload = function () {ctx.drawImage(img, 0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);}
}
function init() {
    var canvas = document.getElementById('mainCanvas');
    canvas.height = screen.height;
    canvas.width = screen.width;
    var modalBg = document.getElementById('questionModal')
    modalBg.width = screen.width;
    modalBg.height = screen.height;
    var modalBg = document.getElementById('hintModal')
    modalBg.width = screen.width;
    modalBg.height = screen.height;
    var modal = document.getElementById('questionContent')
}