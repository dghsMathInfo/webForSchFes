from flask import Flask, request, render_template, redirect, url_for, session
import Data
import time

app = Flask(__name__)
app.secret_key = b'_5#y9L"F4M0z\n\xec]/'

@app.route('/signin')
def signin():
    return render_template('singin.html')

@app.route('/signupName', methods=['GET'])
def signupName():
    failed = request.args.get('failed')
    if failed == None: failed = 'False'
    return render_template('signupName.html', failed=failed)

@app.route('/signupSid')
def signupSid():
    prev = request.args.get('prev')
    return render_template('signupSid.html', prev = prev)

@app.route('/back_signupName', methods=['POST'])
def back_signupName():
    name = request.form['name']
    tmp = Data.UserDb()
    if tmp.isUerExist(name): return redirect(url_for('signupName', failed='True'))
    else: return redirect(url_for('signupSid', prev = name))

@app.route('/back_signupSid', methods=['POST'])
def back_signupSid():
    name = request.form['name']
    studentId = request.form['studentId']
    userDb = Data.UserDb()
    userDb.uploadUser(name, int(studentId))
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/back_login', methods=['POST'])
def back_login():
    name = request.form['name']
    studentId = int(request.form['studentId'])
    print(name, studentId)
    userDb = Data.UserDb()
    if (tmp := userDb.getStudentId(name)) != None:
        print(type(tmp), type(studentId))
        if tmp == studentId:
            session['name'] = name
            return redirect(url_for('home'))
        else:
            return redirect(url_for('login'))
    else:
        return redirect(url_for('login'))


@app.route('/')
def home():
    if not 'name' in session: return redirect(url_for('login'))
    return render_template('home.html', name = session['name'])

@app.route('/room/<roomId>')
def room(roomId):
    userDb = Data.UserDb()
    if not userDb.getSurvyed(session['name']): return redirect(url_for('survey', roomId = roomId))

    roomDb = Data.Room(roomId)
    pid = roomDb.getNextPid()
    roomDb.uploadPlay(session['name'], int(time.time()))
    return render_template(f'room{roomId}.html', pid = pid)

@app.route('/back_roomSend')
def back_roomSend():
    pass # TODO

@app.route('/leaderboard/<roomId>')
def leaderboard(roomId):
    return '게임 끝나고 순위 보는 페이지'

@app.route('/sendinfo')
def sendinfo():
    return 'key, grade 같은 값들 보내는 페이지'

@app.route('/survey')
def survey():
    roomId = int(request.args.get('roomId'))
    return render_template('survey.html', roomId=roomId)

@app.route('/back_survey', methods=['POST'])
def back_survey():
    mbti = request.form['mbti']
    recentMathPCnt = request.form['recentMathPCnt']
    rateOfLikingMath = request.form['rateOfLikingMath']
    mostLikeMathField = request.form['mostLikeMathField']
    roomId = request.form['roomId']
    survyed = 1
    userDb = Data.UserDb()
    userDb.updateUser(session['name'], mbti, recentMathPCnt, rateOfLikingMath, mostLikeMathField, survyed)
    return redirect(f'/room/{roomId}')

@app.route('/congratulations')
def congratulations():
    roomId = request.args.get('roomId')
    return roomId

if __name__ == '__main__':
    app.run(debug=True)
