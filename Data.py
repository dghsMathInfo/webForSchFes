import sqlite3
import typing

class UserDb:
    def __init__(self) -> None:
        self.conn = sqlite3.connect('Data.db')
        self.c = self.conn.cursor()
    def makeDb(self) -> None:
        query = """
            CREATE TABLE "User" (
	        "name"	TEXT,
	        "studentId"	INTEGER NOT NULL,
	        "mbti"	TEXT NOT NULL,
	        "recentMathPCnt"	INTEGER NOT NULL,
	        "rateOfLikingMath"	INTEGER NOT NULL,
	        "mostLikeMathField"	TEXT NOT NULL,
	        "survyed" INTEGER NOT NULL DEFAULT 0,
	        PRIMARY KEY("name")
            );"""
        self.c.execute(query)
        self.conn.commit()

    def deleteAll(self) -> None:
        query = 'DROP TABLE User'
        self.c.execute()
        self.conn.commit
    
    def uploadUser(self, name:str, studentId:int, mbti:str='-', recentMathPCnt:int=-1, rateOfLikingMath:int=-1, mostLikeMathField:str='-', survyed:int=0) -> None:
        query = f'INSERT INTO User (name, studentId, mbti, recentMathPCnt, rateOfLikingMath, mostLikeMathField, survyed) VALUES ("{name}", {studentId}, "{mbti}", {recentMathPCnt}, {rateOfLikingMath}, "{mostLikeMathField}", {survyed})'
        self.c.execute(query)
        self.conn.commit()

    def updateUser(self, name:str, mbti:str, recentMathPCnt:int, rateOfLikingMath:int, mostLikeMathField:str, survyed:int) -> None:
        query = f'UPDATE User SET mbti = "{mbti}", recentMathPCnt = {recentMathPCnt}, rateOfLikingMath = {rateOfLikingMath}, mostLikeMathField = "{mostLikeMathField}", survyed = {survyed} WHERE name = "{name}"'
        self.c.execute(query)
        self.conn.commit()

    def isUserExist(self, name:str) -> bool:
        query = f'SELECT studentId FROM User WHERE name = "{name}"'
        self.c.execute(query)
        self.conn.commit()
        return self.c.fetchone() != None

    def getStudentId(self, name:str) -> int:
        query = f'SELECT studentId FROM User WHERE name = "{name}"'
        self.c.execute(query)
        self.conn.commit()
        return int(self.c.fetchone()[0])

    def getSurvyed(self, name:str) -> int:
        query = f'SELECT survyed FROM User WHERE name = "{name}"'
        self.c.execute(query)
        self.conn.commit()
        return int(self.c.fetchone()[0])

    def closeDb(self) -> None:
        self.conn.commit()
        self.c.close()
        self.conn.close()

class Room:
    def __init__(self, roomId:int) -> None:
        self.conn = sqlite3.connect('Data.db')
        self.c = self.conn.cursor()
        self.roomId:int = roomId
    def makeDb(self) -> None:
        query = f"""
            CREATE TABLE "Room_{self.roomId}" (
            "pid"	INTEGER,
	        "name"	TEXT NOT NULL DEFAULT -1,
	        "startTime"	INTEGER NOT NULL DEFAULT -1,
	        "finishedTime"	INTEGER DEFAULT -1,
	        "device"	TEXT DEFAULT -1,
	        "rights"	INTEGER DEFAULT -1,
	        "wrongs"	TEXT DEFAULT -1,
	        "h"	TEXT DEFAULT -1,
	        "rateOfRecommendation"	INTEGER DEFAULT -1,
	        "recommended"	INTEGER DEFAULT -1,
	        PRIMARY KEY("pid" AUTOINCREMENT)
            );"""
        self.c.execute(query)
        self.conn.commit()

    def deleteAll(self) -> None:
        query = f'DROP TABLE Room_{self.roomId}'
        self.c.execute(query)
        self.conn.commit()
    
    def uploadPlay(self, name:str, startTime:int) -> None:
        query = f'INSERT INTO Room_{self.roomId} (name, startTime) VALUES ("{name}", {startTime})'
        self.c.execute(query)
        self.conn.commit()

    def updatePlay(self, pid:int, finishedTime:int, device:str, rights:int, wrongs:str, rateOfRecommendation:int, recommended:int, h:str) -> None:
        query = f'UPDATE Room_{self.roomId} SET finishedTime = {finishedTime}, device = "{device}", rights = {rights}, wrongs = "{wrongs}", rateOfRecommendation = {rateOfRecommendation}, recommended = {recommended}, h = "{h}" WHERE pid = {pid}'
        self.c.execute(query)
        self.conn.commit()

    def updateRec(self, pid:int, rateOfRecommendation:int, recommended:int) -> None:
        query = f'UPDATE Room_{self.roomId} SET rateOfRecommendation = {rateOfRecommendation}, recommended = {recommended} WHERE pid = {pid}'
        self.c.execute(query)
        self.conn.commit()
    
    def getRightsByName(self, name:str) -> int:
        query = f'SELECT rights FROM Room_{self.roomId} WHERE name = "{name}"'
        self.c.execute(query)
        self.conn.commit()
        return self.c.fetchall()

    def getNextPid(self) -> int:
        query = f'SELECT seq FROM sqlite_sequence WHERE name = "Room_{self.roomId}"'
        self.c.execute(query)
        self.conn.commit()
        tmp = self.c.fetchone()
        return 1 if tmp == None else tmp[0] + 1

    def getNSFRWHForAll(self) -> typing.List: #get Name, startTime, finishedTime, rights, wrongs, h
        query = f'SELECT name, startTime, finishedTime, rights, wrongs, h FROM Room_{self.roomId}'
        self.c.execute(query)
        self.conn.commit()
        return self.c.fetchall()

    def getNSFRForAll(self) -> typing.List: #get Name, startTime, finishedTime, rights
        query = f'SELECT name, startTime, finishedTime, rights FROM Room_{self.roomId}'
        self.c.execute(query)
        self.conn.commit()
        return self.c.fetchall()

    def closeDb(self) -> None:
        self.conn.commit()
        self.c.close()
        self.conn.close()


if __name__ == '__main__':
    """
    a = Room(1)
    print(a.getNextPid())
    a = Room(2)
    print(a.getNextPid())
    """
    data = UserDb()
    room = Room(1)
    room.deleteAll()
    room.makeDb()