# 구조
## User 테이블
|라벨|타입|자동 입력|비고|
|---|---|---|---|
|name|str|X|primary_key, 사용자를 구분하는 역할 함|
|grade|int|X|학년|
|mbti|str|X|-|
|recentMathPCnt|int|X|최근 일주일간 푼 수학문제량|
|rateOfLikingMath|int|X|평소 수학을 얼마나 좋아하는지|
|mostLikeMathField|str|X|가장 좋아하는 수학분야|
|survyed|int|O|설문조사 했는지 안했는지|
## Room_i 테이블(i=1,2,...,5)
|라벨|타입|자동 입력|비고|
|---|---|---|---|
|pid|int|O|primary_key|
|name|str|X|-|
|startTime|int|O|-|
|finishedTime|int|O|-|
|device|str|O|-|
|rights|int|O|맞은 문제 번호 기록(이진수로)|
|wrongs|str|O|틀린 문제, 틀린 답 모두 저장|
|rateOfRecommendation|int|X|추천하고 싶은 정도|
|recommended|int|X|추천 받아서 플레이 한것인지|
# 생성 코드
```
CREATE TABLE "User" (
	"name"	TEXT,
	"grade"	INTEGER NOT NULL,
	"mbti"	TEXT NOT NULL,
	"recentMathPCnt"	INTEGER NOT NULL,
	"rateOfLikingMath"	INTEGER NOT NULL,
	"mostLikeMathField"	TEXT NOT NULL,
	"survyed" INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("name")
);
CREATE TABLE "Room_1" (
	"pid"	INTEGER,
	"name"	TEXT NOT NULL,
	"startTime"	INTEGER NOT NULL,
	"finishedTime"	INTEGER,
	"device"	TEXT NOT NULL,
	"rights"	INTEGER,
	"wrongs"	TEXT,
	"rateOfRecommendation"	INTEGER,
	"recommended"	INTEGER,
	PRIMARY KEY("pid" AUTOINCREMENT)
);
```