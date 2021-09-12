var rights = 0, easterEggs = 0;
var hints = [];
var h = [];
var letter = [];
var wrongs = [];
var answerIsText = [true, true, true, false, false];
var answers = ['일요일', '19', '11', '4', '5', '6'];
var level = 1;
var b = [false, false, false, false, false, false];
var puzzle = [];
const PUZZLECOORD = [
    [   [[656, 1121], [1089, 1121]],
        [[877, 913], [877, 1349]],
        [[656, 1121], [1089, 1121]],
        [[877, 913], [877, 1349]],
    ],
    [   [[2545, 1121], [2973, 1121]],
        [[2757, 913], [2757, 1349]],
        [[2545, 1121], [2973, 1121]],
        [[2757, 913], [2757, 1349]],
    ],
    [   [[4013, 1121], [4441, 1121]],
        [[4229, 913], [4229, 1349]],
        [[4013, 1121], [4441, 1121]],
        [[4229, 913], [4229, 1349]],
    ],
    [   [[1181, 3533], [1393, 3533], [1393, 3325]],
        [[1393, 3325], [1393, 3533], [1609, 3533]],
        [[1609, 3533], [1393, 3533], [1393, 3745]],
        [[1393, 3745], [1393, 3533], [1181, 3533]],
    ],
    [   [[3285, 3533], [3501, 3533], [3501, 3325]],
        [[3501, 3325], [3501, 3533], [3713, 3533]],
        [[3713, 3533], [3501, 3533], [3501, 3745]],
        [[3501, 3745], [3501, 3533], [3285, 3533]],
    ],
    [   [[1637, 5413], [2069, 5413]],
        [[1853, 5201], [1853, 5621]],
        [[1637, 5413], [2069, 5413]],
        [[1853, 5201], [1853, 5621]],
    ]
]
const LEVEL1 = [[0, 1225], [94, 1287]];
const LEVEL2 = [[79, 1214], [173, 1295]];
const LEVEL3 = [[255, 455], [656, 812]];
const LEVEL4 = [[3065, 4668], [4173, 5780]];
const LEVEL5 = [[100, 100], [200, 200]];
const LEVEL5_2 = [[300, 300], [400, 400]];
var fireworks = [];
const FIREWORKSCOUNT = 7;
var graph = [];
var focusing;
var focused;
for(var i = 0; i < 6; i++) {
    puzzle.push(Math.floor(Math.random()*(4))); // randon number in {0, 1, 2, 3}
}
for(var i = 0; i < 5; i++) {
    h.push([false, false, false]);
}
var prevHintRank = -1;
var p;
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
        MathJax.typeset();
    }
    else {
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
            MathJax.typeset();
        }
        sendInfo();
    }
    document.getElementById('modal-title').textContent = "Hint " + (prevHintRank + 1);
    return;
}
function end() {
    // finishedTime, rights, wrongs
    sendInfo();
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
    xhr.open('POST', '/back_roomSend', false);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(data));
    if(rights == 5) window.location.href = "/congratulations?pid=" + document.getElementById('pid').value + "&roomId=1";
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
    return [(x- normX)*(RW/(CW - 2*normX)), (y - normY)*(RH/(CH - 2*normY))];
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
    return [(x)*((CW - 2*normX)/RW) + normX, (y)*((CH - 2*normY)/RH) + normY];
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
    var answer = document.getElementById('answer').value;
    alert("Wrong answer!@!");
    wrongs.push(answer);
    sendInfo();
}

function find(n) {
    if(p[n] == n) return n;
    return p[n] = find(p[n]);
}

function union(n1, n2) {
    n1 = find(n1);
    n2 = find(n2);
    if(n1 < n2) {
        p[n2] = n1;
    }
    else {
        p[n1] = n2;
    }
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
                //level4Finished();
                nextLevel();
            }
            else {
                answer = "";
                for(var i = 0; i < 6; i++) answer += puzzle[i];
                wrong();
            }
        }
        else {
            p = [];
            var flag = true;
            for(var i = 0; i < FIREWORKSCOUNT; i++) {
                p.push(i);
            }
            for(var i = 0; i < graph.length; i++) {
                for(var j = 0; j < graph.length; j++) {
                    if(i != j) {
                        union(graph[j][0], graph[j][1]);
                    }
                }
                for(var j = 0; j < FIREWORKSCOUNT; j++) find(j);
                for(var j = 0; j < FIREWORKSCOUNT; j++) {
                    if(p[j] != p[0]) {
                        flag = false;
                        break;
                    }
                }
                if(!flag) break;
            }
            if(flag) {
                rights = 5;
                end();
            }
            else {
                answer = "";
                for(var i = 0; i < graph.length; i++) {
                    answer += (!i)?("/" + graph[i][0] + graph[i][1]):(graph[i][0] + graph[i][1]);
                }
                wrong();
            }
        }
    }
    return;
}
function initLevel1() {
    wrongs.push('=1=');
    prevHintRank = -1;
    level = 1;
    var questionContent = document.getElementById('questionModalContent');
    var questionLetterContent = document.getElementById('questionModalLetterContent');
    questionLetterContent.innerHTML = '';
    letter = ["A. 모레는 홈파티가 열리는 날이야.", "B. 아니, 홈파티가 열리는 날은 수요일이야.", "C. 너희 다 틀렸어. 홈파티가 열리는 날은 3일 후야.",
    "D. 웃기는 군. 홈파티가 열리는 날은 목요일과 일요일 중에 있어.", "E. 난 홈파티가 어제와 같은 요일에 열린다는 걸 확신해.",
    "F. 내가 아는건 홈파티가 내일과 같은 요일에 열리지 않는다는 것 뿐이야."];
    for(var i = 0; i < letter.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = letter[i];
        questionLetterContent.appendChild(tmp);
    }
    questionContent.innerHTML = '';
    problem = ["장난스러운 당신의 친구는 홈파티 초대장에 보낸 시간을 논리 문제로 만들어 첨부하였습니다.", "오늘은 토요일이고, 일주일안에 홈파티가 열린다고 할 때,",
    "친구의 문제를 풀어 알맞은 요일을 찾아 홈파티에 참여합시다.", "아래 A, B, C, D, E, F 여섯 명의 사람 중 한 사람만 참을 말할 때 홈파티가 열리는 날은 언제일까요?(O요일로 입력)"]
    hint = [
        ["어떤 요일을 가정했을때 참인 명제가 두개가 된다면, 그 가정은 잘못된 것이다."],
        ["대화에서 언급된 요일 중 한 번만 언급된 요일을 찾는다"],
        ["정답 : 일요일"]
    ]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    var questionTitle = document.getElementById('questionModalTitle');
    document.getElementById('questionTitle').textContent = "요일을 찾아라!";
    questionTitle.textContent = "문제 1";
}
function initLevel2() {
    wrongs.push('=2=');
    prevHintRank = -1;
    hint = [
        ["사칙연산을 이용해보자."],
        ["뺄셈과 덧셈을 이용해보자."],
        ["정답: 19"]
    ]
    level = 2;
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    var questionLetterContent = document.getElementById('questionModalLetterContent');
    questionLetterContent.innerHTML = '';
    letter = ["아까 문제는 어려웠지?", "이번엔 조금 나을거야.", "포기하지 말고 홈파티에 꼭 와줘!", "\\(5+3=28\\)", 
    "\\(7+4=311\\)", "\\(3+2=15\\)", "\\(5+4=p\\)"]
    for(var i = 0; i < letter.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = letter[i];
        questionLetterContent.appendChild(tmp);
    }
    problem = ["친구는 짧은 메세지와 함께 또 다른 문제를 첨부하였습니다. ", "아래 식을 보고 친구의 문제를 풀어 홈파티에 참여합시다.",
    "홈파티는 \\(p\\)시에 열린다고 합니다. 몇시에 열릴까요?(\\(p\\)만 입력)"]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    MathJax.typeset();
    var questionTitle = document.getElementById('questionModalTitle');
    questionTitle.textContent = "문제 2";
    document.getElementById('questionTitle').textContent = "파티 시작 시간을 찾아라!";
}
function initLevel3() {
    wrongs.push('=3=');
    prevHintRank = -1;
    hint = [
        ["2진법의 각 자리수는 \\(2^0\\), \\(2^1\\), \\(2^2\\), \\(2^3\\)이다. (1001(2진법) -> 9(10진법))"],
        ["\\(\\begin{align} \
            1101_(2) = &1 \\times 2^3 \\\\ \
                    + &1 \\times 2^2 \\\\ \
                    + &0 \\times 2^1 \\\\ \
                    + &1 \\times 2^0 \\\\ \
                    = &13_(10) \
            \\end{align}\\)"],
        ["정답: 11명"]
    ]
    level = 3;
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    var questionLetterContent = document.getElementById('questionModalLetterContent');
    questionLetterContent.innerHTML = '';
    letter = []
    for(var i = 0; i < letter.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = letter[i];
        questionLetterContent.appendChild(tmp);
    }
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
    document.getElementById('questionTitle').textContent = "인원을 찾아라!";
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
    document.getElementById('questionTitle').textContent = "빛을 되찾아라!";
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
    problem = ["파티를 마치기 위해 폭죽을 터트리려고 한다.", "당신은 파티를 완벽하게 끝내기 위해 줄 하나가 끊어져도 폭죽이 모두 터지도록 하고 싶다",
    "이것이 가능하도록 폭죽끼리 이어보자.", "폭죽 하나를 클릭한뒤 다른 것을 클릭해서 이을 수 있다.",
    "(원하는 만큼 이어도 상관없다.)"]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    var questionTitle = document.getElementById('questionModalTitle');
    questionTitle.textContent = "문제 5";
    document.getElementById('questionTitle').textContent = "폭죽을 잘 터트릴 방법을 찾아라!";
}
function init() {
    var canvas = document.getElementById('mainCanvas');
    canvas.height = window.innerHeight - 33;
    canvas.width = window.innerWidth;
    var modalBg = document.getElementById('questionModal')
    modalBg.width = screen.width;
    modalBg.height = screen.height;
    var modalBg = document.getElementById('hintModal')
    modalBg.width = screen.width;
    modalBg.height = screen.height;
    var modal = document.getElementById('questionContent')
}
