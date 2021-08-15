var rights = 0, easterEggs = 0;
var hints = [];
var h = [];
var wrongs = [];
var answerIsText = [true, true, true, false, false];
var answers = ['1', '2', '3', '4', '5', '6'];
var level = 1;
var b = [false, false, false, false, false, false];
var puzzle = [];
const PUZZLECOORD = [
    [   [[312.45, 1115.35], [517.6, 1115.35]],
        [[415, 912.55], [415, 1326.59]],
        [[312.45, 1115.35], [517.6, 1115.35]],
        [[415, 912.55], [415, 1326.59]],
    ],
    [   [[1219.2, 1115.35], [1424.35, 1115.35]],
        [[1321.75, 912.55], [1321.75, 1326.59]],
        [[1219.2, 1115.35], [1424.35, 1115.35]],
        [[1321.75, 912.55], [1321.75, 1326.59]],
    ],
    [   [[1924.9, 1115.35], [2139.05, 1115.35]],
        [[2036.45, 912.55], [2036.45, 1326.59]],
        [[1924.9, 1115.35], [2139.05, 1115.35]],
        [[2036.45, 912.55], [2036.45, 1326.59]],
    ],
    [   [[562.73, 3540.39], [661.2, 3548.84], [668.40, 3320.70]],
        [[668.40, 3320.70], [661.2, 3548.84], [767.88, 3540.39]],
        [[767.88, 3540.39], [661.2, 3548.84], [668.4, 3751.63]],
        [[668.4, 3751.63], [661.2, 3548.84], [562.73, 3540.39]],
    ],
    [   [[1580.26, 3540.39], [1678.73, 3548.84], [1685.92, 3320.70]],
        [[1685.92, 3320.70], [1678.73, 3548.84], [1785.4, 3540.39]],
        [[1785.4, 3540.39], [1678.73, 3548.84], [1685.92, 3751.63]],
        [[1685.92, 3751.63], [1678.73, 3548.84], [1580.26, 3540.39]],
    ],
    [   [[780.18, 5416.21], [985.33, 5416.21]],
        [[886.86, 5205], [886.86, 5619]],
        [[780.18, 5416.21], [985.33, 5416.21]],
        [[886.86, 5205], [886.86, 5619]],
    ]
]
var fireworks = [];
var graph = [];
for(var i = 0; i < 6; i++) {
    puzzle.push(Math.floor(Math.random()*(4))); // randon number in {0, 1, 2, 3}
}
for(var i = 0; i < 5; i++) {
    h.push([false, false, false]);
}
var prevHintRank = -1;

function hintClick(next) {
    if(!next) {
        document.getElementById('modal-title').textContent = "Hint 0";
        var hintContent = document.getElementById('hintModalContent');
        hintContent.innerHTML = '';
        if(prevHintRank == -1) {
            var tmp = document.createElement('p');
            tmp.textContent = "힌트 볼래?";
        }
        else {
            for(var i = 0; i < hint[prevHintRank].length; i++) {
                var tmp = document.createElement('p');
                tmp.textContent = hint[prevHintRank][i];
                hintContent.appendChild(tmp);
            }
        }
        hintContent.appendChild(tmp);
    }
    else {
        sendInfo();
        if(prevHintRank == 2) {
            alert("마지막 힌트입니다!");
            
        }
        else {
            prevHintRank++;
            h[level - 1][prevHintRank] = true;
            var hintContent = document.getElementById('hintModalContent');
            hintContent.innerHTML = '';
            for(var i = 0; i < hint[prevHintRank].length; i++) {
                var tmp = document.createElement('p');
                tmp.textContent = hint[prevHintRank][i];
                hintContent.appendChild(tmp);
            }
        }
    }
    document.getElementById('modal-title').textContent = "Hint " + (prevHintRank + 1);
    return;
}
function end() {
    // finishedTime, rights, wrongs
    alert("out!");
    sendInfo();
    //document.mainForm.submit();
}

function sendInfo() {
    console.log('sendInfo!!!');
    var pid = document.getElementById('pid').value;
    var roomId = document.getElementById('roomId').value;
    var finishedTime = Date.now();
    var device = document.getElementById('device').value;
    var data = new Object();
    var hText = ""
    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 3; j++) {
            hText += (h[i][j])?'1':'0';
        }
    }
    data.pid = pid;
    data.roomId = roomId;
    data.finishedTime = finishedTime;
    data.device = device;
    data.rights = rights;
    data.wrongs = wrongs;
    data.h = hText;
    
    var xhr = new XMLHttpRequest;
    xhr.open('POST', '/back_roomSend');
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(data));
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

function rawCoordToImgCoord(x, y, CW, CH, RW, RH) { // x, y, CANVASWIDTH, CANVASHEIGHT, REALWIDTH, REALHEIGHT
    var isHeightMax = true;
    if(CW*RH < CH*RW) isHeightMax = false;
    var normX, normY, imgWidth, imgHeight;
    if(isHeightMax) {
        imgWidth = CH*(RW/RH), imgHeight = CH;
        normX = (CW - imgWidth)/2, normY = 0;
    }
    else {
        imgWidth = CW, imgHeight = CW*(RH/RW);
        normX = 0, normY = (CH - imgHeight)/2;
    }
    return [(x- normX)*(RW/CW), (y - normY)*(RH/CH)];
}
function imgCoordToRawCoord(x, y, CW, CH, RW, RH) {
    var isHeightMax = true;
    if(CW*RH < CH*RW) isHeightMax = false;
    var normX, normY, imgWidth, imgHeight;
    if(isHeightMax) {
        imgWidth = CH*(RW/RH), imgHeight = CH;
        normX = (CW - imgWidth)/2, normY = 0;
    }
    else {
        imgWidth = CW, imgHeight = CW*(RH/RW);
        normX = 0, normY = (CH - imgHeight)/2;
    }
    return [(x)*(CW/RW) + normX, (y)*(CH/RH) + normY];
}
function isInRectangle(x, y, normX, normY, width, height) {
    return (normX <= x && x <= normX + width && normY <= y && y <= normY + height);
}

function nextLevel() {
    rights++;
    level++;
    sendInfo();
    hideQuestionModal();
    hideHintModal();
    eval('initLevel' + (level) + "_cli();");
    return;
}

function wrong() {
    alert("Wrong answer!@!");
    wrongs.push(answer);
    sendInfo();
}

function submitAnswer() {
    var answer = document.getElementById('answer').value;
    console.log(answer);
    if(answerIsText[level - 1]) {
        if(answers[level - 1] == answer) {
            nextLevel();
        }
        else {
            if(answer == '' || answer == null) alert("뭐라도 써..");
            else wrong();
        }
        document.getElementById('answer').value = "";
    }
    else {
        if(level == 4) {
            if((puzzle[0]%2) && (puzzle[1]%2) && !(puzzle[2]%2) && (puzzle[3]==1) && !puzzle[4] && (puzzle[5]%2)) {
                level4Finished();
            }
            else {
                answer = ""
                for(var i = 0; i < 6; i++) answer += puzzle[i];
                wrong();
            }
        }
        else {

        }
    }
    sendInfo();
    return;
}
function initLevel1() {
    wrongs.push('=1=');
    prevHintRank = -1;
    level = 1;
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    problem = ["장난스러운 당신의 친구는 홈파티 초대장에 보낸 시간을 논리문제로 만들어 첨부하였다.", "당신은 친구에게 문제적 남자 시청을 추천했던 과거의 당신을 원망해보지만 이미 늦은 일이다.",
    "과거는 저기너머에 두고 당신의 절친한 친구를 위해 문제를 풀어 홈파티에 참여하자.", "a. 홈파티는 수요일에 시작한다.", "b. 홈파티는 목요일에 시작한다.", "c. 홈파티는 금요일에 시작한다.", 
    "d. 홈파티는 토요일에 시작한다.", "e. 홈파티는 일요일에 시작한다."]
    hint = [
        ["h1"],
        ["h2"],
        ["h3"]
    ]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    var questionTitle = document.getElementById('questionModalTitle');
    questionTitle.textContent = "문제 1";
}
function initLevel2() {
    wrongs.push('=2=');
    prevHintRank = -1;
    hint = [
        ["h1"],
        ["h2"],
        ["h3"]
    ]
    level = 2;
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    problem = ["친구가 다음과 같은 식을 초대장에 첨부해서 홈파티를  몇시에 하는지 알려주었다.", "장난스러운 친구를 가진 당신은, 그런 친구를 가진 당신의 업보라 여기고 문제를 만든 친구의 정성을 봐서라도 다음과 같은 문제를 풀자.",
    "5+3 = 28", "7 + 4 = 311", "3 + 2 = 15", "5 + 4 = p", "0 + 0 = q", "p시 q분에 열린다."]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    var questionTitle = document.getElementById('questionModalTitle');
    questionTitle.textContent = "문제 2";
}
function initLevel3() {
    wrongs.push('=3=');
    prevHintRank = -1;
    hint = [
        ["h1"],
        ["h2"],
        ["h3"]
    ]
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
    //puzzle using geometrical interpretation of complex number
    wrongs.push('=4=');
    prevHintRank = -1;
    document.getElementById("answerBtn").setAttribute('style', 'display: none;');
    document.getElementById("answer").setAttribute('style', 'display: none;');
    document.getElementById("answerLabel").setAttribute('style', 'display: none;');
    hint = [
        ["h1"],
        ["h2"],
        ["h3"]
    ]
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    problem = ["즐겁게 파티를 하고 있는 도중, 갑작스럽게 불이 꺼졌다.", "이대로 가면 친구가 욕먹는 것은 뻔하다.",
    "사실 그것도 나쁘진 않지만 일단 불을 켜보자."]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    var questionTitle = document.getElementById('questionModalTitle');
    questionTitle.textContent = "문제 4";
}
function initLevel5() {
    wrongs.push('=5=');
    prevHintRank = -1;
    hint = [
        ["h1"],
        ["h2"],
        ["h3"]
    ]
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
    questionTitle.textContent = "문제 5";
}
function init() {
    var canvas = document.getElementById('mainCanvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    var modalBg = document.getElementById('questionModal')
    modalBg.width = screen.width;
    modalBg.height = screen.height;
    var modalBg = document.getElementById('hintModal')
    modalBg.width = screen.width;
    modalBg.height = screen.height;
    var modal = document.getElementById('questionContent')
}