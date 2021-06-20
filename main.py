from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/')
def home():
    return '방선택 페이지'

@app.route('/room' )
def room():
    return '게임 플레이 하는 페이지'

@app.route('/leaderboard')
def leaderboard() :
    return '게임 끝나고 순위 보는 페이지'

@app.route('/sendinfo')
def sendinfo():
    return 'key, grade 같은 값들 보내는 페이지'

@app.route('/survey')
def survey():
    roomId = request.args.get('roomId')
    return roomId
@app.route('/congratulations')
def congratulations():
    roomId = request.args.get('roomId')
    return roomId

if __name__ == '__main__':
    app.run(debug=True)
