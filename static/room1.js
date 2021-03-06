var rights = 0, easterEggs = 0;
var hint = [];
var h = [];
var letter = [];
var wrongs = [];
var answerIsText = [true, true, true, false, false];
var answers = ['일요일', '19', '11', '-1', '-1', '-1'];
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
const LEVEL1 = [[0, 993], [153, 1110]];
const LEVEL2 = [[63, 990], [223, 1104]];
const LEVEL3 = [[245, 430], [666, 840]];
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
            tmp.textContent = "힌트를 확인 하시겠습니까?";
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
    if(rights == 5) {
        var xhr = new XMLHttpRequest;
        xhr.open('POST', '/back_roomSend', false);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(JSON.stringify(data));
        window.location.href = "/congratulations?pid=" + document.getElementById('pid').value + "&roomId=1";
    }
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
    letter = ["아래 A, B, C, D, E, F 여섯 명의 사람 중 한 사람만 참을 말하고 있어.", "A. 모레는 홈파티가 열리는 날이야.", "B. 아니, 홈파티가 열리는 날은 수요일이야.", "C. 너희 다 틀렸어. 홈파티가 열리는 날은 3일 후야.",
    "D. 웃기는 군. 홈파티가 열리는 날은 목요일과 일요일 중에 있어.", "E. 난 홈파티가 어제와 같은 요일에 열린다는 걸 확신해.",
    "F. 내가 아는건 홈파티가 내일과 같은 요일에 열리지 않는다는 것 뿐이야."];
    for(var i = 0; i < letter.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = letter[i];
        questionLetterContent.appendChild(tmp);
    }
    questionContent.innerHTML = '';
    problem = ["장난스러운 당신의 친구는 홈파티 초대장에 보낸 시간을 논리 문제로 만들어 첨부하였습니다.", "오늘은 토요일이고, 일주일안에 홈파티가 열린다고 할 때,(다음주 토요일 포함X)",
    "홈파티는 무슨 요일에 열릴까요?(\"요일\"까지 입력)"]
    hint = [
        ["어떤 요일이 답이라고 가정했을때 참인 명제가 두개가 된다면, 그 가정은 잘못된 것이다."],
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
        ["사칙연산 중에 2개를 결합한 연산이다."],
        ["뺄셈과 덧셈을 이용해보자."],
        ["정답: 19"]
    ]
    level = 2;
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    var questionLetterContent = document.getElementById('questionModalLetterContent');
    questionLetterContent.innerHTML = '';
    letter = ["홈파티 요일을 잘 맞췄구나.", "\\(5\\circ 3=28\\)", 
    "\\(7\\circ 4=311\\)", "\\(3\\circ 2=15\\)", "\\(5\\circ 4=p\\)", "친구야, p시간에 맞춰 꼭 와줘"]
    for(var i = 0; i < letter.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = letter[i];
        questionLetterContent.appendChild(tmp);
    }
    problem = ["이제는 파티 시간을 알아내 볼까요?", "당신의 친구는 홈파티 시간을 쪽지에 이렇게 적어 두었습니다.",
    "쪽지의 식을 보고 문제를 풀어 홈파티에 늦지 않게 참여합시다.(답란에는 \\(p\\)만 입력)"]
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
            1001_{(2)} = &1 \\times 2^3 \\\\ \
                    + &0 \\times 2^2 \\\\ \
                    + &0 \\times 2^1 \\\\ \
                    + &1 \\times 2^0 \\\\ \
                    = &9_{(10)} \
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
    problem = ["당신은 친구가 보낸 초대장을 무사히 풀고, 홈파티 장소에 갈 준비를 하였습니다. ", "홈파티에서 먹을 아이스크림을 사가기로 한 당신은 파티 참여 인원을 확인합니다.",
    "초대장에 이진법으로 쓰여있는 초대인원을 알아내 알맞은 개수의 아이스크림을 준비해봅시다.", "\\(1011_{(2)}\\)"]
    for(var i = 0; i < problem.length; i++) {
        var tmp = document.createElement('p');
        tmp.textContent = problem[i];
        questionContent.appendChild(tmp);
    }
    MathJax.typeset();
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
        ["논리게이트 개념을 이용해 보자(XOR 게이트, AND게이트)"],
        ["AND게이트에는 모두 연결되어야 하고 XOR 게이트는 둘 중 하나만 연결되야 한다."],
        ["(왼쪽 위부터 오른쪽 아래로)ㅣ ㅣ ㅡ \n ㄴ ↲ \n ㅣ"]
    ]
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    problem = ["즐겁게 파티를 하고 있는 도중 갑작스럽게 불이 꺼졌습니다.", "이대로가면 친구가 욕을 먹는다는 장점이 있지만, ",
    "일단 파티를 다시 이어가기 위해 전기 회로를 고쳐봅시다."]
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
        ["임의의 폭죽은 최소 몇개의 줄로 연결되야할지 생각해보자."],
        ["임의의 폭죽은 최소 2개의 줄로 연결되어야 한다."],
        ["볼록다각형 모양으로 줄을 잇는다."]
    ]
    var questionContent = document.getElementById('questionModalContent');
    questionContent.innerHTML = '';
    problem = ["코로나 극복 후 처음으로 열린 신나는 파티, 여러분은 어떠셨나요? ", "이제 파티의 마지막 순서로 모두 함께 폭죽을 터트려 볼까요?",
    "화면에 보이는 폭죽을 줄로 연결하여 모든 폭죽이 줄이 하나가 끊어지더라도 한번에 터지도록 연결해봅시다.", "폭죽 하나를 클릭한 뒤 다른 것을 클릭해서 이을 수 있고, 최대 " +(FIREWORKSCOUNT +1) + "개의 줄을 사용할 수 있습니다."]
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
}
