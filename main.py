import os
from flask import Flask, request, render_template, redirect, url_for, session
import Data
import time
import datetime
import logging
import logging.handlers
app = Flask(__name__)
app.secret_key = b'_5#y9L"F4M0z\n\xec]/'
logging.basicConfig(filename = "logs/project.log", level = logging.DEBUG)
myLogger = logging.getLogger('myLogger') # 로거 이름: myLogger
myLogger.setLevel(logging.DEBUG) # 로깅 수준: DEBUG
myLogger.propagate = 0
file_handler = logging.handlers.TimedRotatingFileHandler(
  filename='logs/project.log', when='midnight', interval=1,  encoding='utf-8'
  ) # 자정마다 한 번씩 로테이션
file_handler.suffix = 'log-%Y%m%d' # 로그 파일명 날짜 기록 부분 포맷 지정 
myLogger.addHandler(file_handler) # 로거에 핸들러 추가
formatter = logging.Formatter(
  '%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] %(message)s'
  )
file_handler.setFormatter(formatter) # 핸들러에 로깅 포맷 할당
@app.route('/signin')
def signin():
    myLogger.debug("signin executed")
    return render_template('singin.html')

@app.route('/signupName', methods=['GET'])
def signupName():
    myLogger.debug("signupName executed")
    failed = request.args.get('failed')
    if failed == None: failed = 'False'
    return render_template('signupName.html', failed=failed)

@app.route('/signupSid')
def signupSid():
    myLogger.debug("signupSid executed")
    prev = request.args.get('prev')
    return render_template('signupSid.html', prev = prev)

@app.route('/back_signupName', methods=['POST'])
def back_signupName():
    name = request.form['name']
    myLogger.debug(name + " back_signupName executed ")
    tmp = Data.UserDb()
    if tmp.isUserExist(name): return redirect(url_for('signupName', failed='True'))
    else: return redirect(url_for('signupSid', prev = name))

@app.route('/back_signupSid', methods=['POST'])
def back_signupSid():
    name = request.form['name']
    studentId = request.form['studentId']
    myLogger.debug(name + " " + studentId + " back_signupSid executed ")
    userDb = Data.UserDb()
    userDb.uploadUser(name, int(studentId))
    return redirect(url_for('login',re=0))

@app.route('/login', methods=["GET"])
def login():
    myLogger.debug(f'login executed')
    re = request.args.get('re')
    if re == None: re = 0
    return render_template('login.html',re=re)

@app.route('/back_login', methods=['POST'])
def back_login():
    name = request.form['name']
    studentId = int(request.form['studentId'])
    print(name, studentId)
    userDb = Data.UserDb()
    myLogger.debug(f'{name} {studentId}  back_login executed')
    if not userDb.isUserExist(name): return redirect(url_for('login', re=1))
    tmp = userDb.getStudentId(name)
    if tmp == studentId:
        session['name'] = name
        return redirect(url_for('home'))
    else:
        return redirect(url_for('login', re=2))

@app.route('/room1instruction')
def room1instruction():
    myLogger.debug(f'{session["name"]}  room1instruction executed')
    return render_template('room1instruction.html', name=session['name'])

@app.route('/room1answer')
def room1answer():
    userDb = Data.UserDb()
    name = session['name']
    myLogger.debug(f'{session["name"]}  room1answer executed')
    if not userDb.isUserExist(name): return redirect(url_for('login', re=0))
    roomDb = Data.Room(1)
    if not (5 in roomDb.getRightsByName(name) or '5' in roomDb.getRightsByName(name)):
        return redirect(url_for('home'))
    return render_template('room1answer.html', name=session['name'])

@app.route('/logout')
def logout():
    myLogger.debug(f'{session["name"]}  logout executed')
    del session['name']
    return redirect(url_for('home'))

@app.route('/')
def home():
    if not 'name' in session: return redirect(url_for('login', re = 0))
    myLogger.debug(f'{session["name"]}  home executed')
    return render_template('home.html', name = session['name'])

@app.route('/room/<roomId>')
def room(roomId):
    userDb = Data.UserDb()
    if not userDb.isUserExist(session['name']): return redirect(url_for('signupName'))
    if not userDb.getSurvyed(session['name']): return redirect(url_for('survey', roomId=roomId))

    roomDb = Data.Room(roomId)
    pid = roomDb.getNextPid()
    myLogger.debug(f'{session["name"]}({pid}) room(1) executed')
    #session['roomId'] = roomId
    #session['pid'] = pid
    roomDb.uploadPlay(session['name'], int(time.time()))
    return render_template(f'room{roomId}.html', pid = pid, roomId = roomId, name=session['name'])

@app.route('/back_roomSend', methods=['POST'])
def back_roomSend():
    params = request.get_json()
    myLogger.debug(f'{session["name"]} {params} back_roomSend executed')
    roomId = params['roomId']
    pid = params['pid']
    finishedTime = int(float(params['finishedTime'])/1000)
    device = params['device']
    rights = params['rights']
    wrongs = str(params['wrongs'])
    h = params['h']
    rateOfRecommendation = -1
    recommended = -1
    roomDb = Data.Room(roomId)
    roomDb.updatePlay(pid, finishedTime, device, rights, wrongs, rateOfRecommendation, recommended, h)
    return redirect(url_for('congratulations', roomId=roomId, pid=pid))

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    myLogger.debug(f'{session["name"]}  leaderboard executed')
    roomDb = Data.Room(int(request.args.get('roomId')))
    #tmp = roomDb.getNSFRForAll()
    tmp = roomDb.getNSFRWHForAll()
    d = []
    for i in range(len(tmp)):
        if tmp[i][3] != 5:
            d.append(i)
    for i in range(len(d)):
        del tmp[d[i] - i]

    for i in range(len(tmp)):
        tmp[i] = list(tmp[i])
        tmp[i].append(getScore(tmp[i][1], tmp[i][2], tmp[i][5], tmp[i][4], tmp[i][3]))
    for i in range(len(tmp)):
        tmp[i][1] = datetime.datetime.fromtimestamp(tmp[i][1])
    tmp.sort(key = lambda x:-x[-1])
    return render_template('leaderboard.html', things=tmp, thingLen=len(tmp))

def getScore(startTime:int, finishedTime:int, h:str, wrongs:str, right:int):
    ### for exception
    if h == "-1": h = "111111111111111"
    if finishedTime == -1: finishedTime = 1631191336
    ###
    deltaT = finishedTime - startTime
    wrongs = len(wrongs.split(',')) - (5 if right == 5 else (right + 1))
    ALPHA = 500
    BETA = 2
    GAMMA = 3
    DELTA = 4
    score = ALPHA
    for i in range(len(h)):
        score -= BETA**(int(h[i])*(i%3 + 1))
    score -= GAMMA*deltaT + DELTA*wrongs
    return score
    

@app.route('/survey')
def survey():
    myLogger.debug(f'{session["name"]}  survey executed')
    roomId = int(request.args.get('roomId'))
    return render_template('survey.html', roomId=roomId)

@app.route('/back_survey', methods=['POST'])
def back_survey():
    myLogger.debug(f'{session["name"]}  back_survey executed')
    mbti = request.form['mbti']
    recentMathPCnt = request.form['recentMathPCnt']
    rateOfLikingMath = request.form['rateOfLikingMath']
    mostLikeMathField = request.form['mostLikeMathField']
    roomId = 1#request.form['roomId']
    survyed = 1
    userDb = Data.UserDb()
    userDb.updateUser(session['name'], mbti, recentMathPCnt, rateOfLikingMath, mostLikeMathField, survyed)
    return redirect(f'/room/{roomId}')

@app.route('/congratulations', methods=['GET'])
def congratulations():
    roomId = request.args.get('roomId')
    pid = request.args.get('pid')
    myLogger.debug(f'{session["name"]}({pid}) congratulations executed')
    return render_template('congratulations.html', roomId=roomId, pid=pid)

@app.route('/back_congratulations', methods=['POST'])
def back_congratulations():
    roomId = request.form['roomId']
    pid = request.form['pid']
    rateOfRecommendation = request.form['rateOfRecommendation']
    recommended = request.form['recommended']
    myLogger.debug(f'{session["name"]}({pid}) {rateOfRecommendation} {recommended} back_congratulations executed')
    roomDb = Data.Room(roomId)
    roomDb.updateRec(pid, rateOfRecommendation, recommended)
    return redirect(url_for('leaderboard', roomId = roomId))

if __name__ == '__main__':
    app.run('0.0.0.0', port=80, debug=False)
    myLogger.debug("server start!")
