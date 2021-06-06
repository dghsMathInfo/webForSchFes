# 구조
|라벨|타입|자동 입력|비고|
|---|---|---|---|
|state|int|O|중간에 나갔는지, 끝까지 했는지|
|key|str|O|primary_key|
|grade|int|X|학년|
|name|str|X|-|
|startTime|int|O|-|
|finishedTime|int|O|-|
|selectedRoom|int|O|-|
|mbti|str|X|-|
|device|str|O|-|
|recentMathPCnt|int|X|최근 일주일간 푼 수학문제량|
|wrongs|str|O|틀린 문제, 틀린 답 모두 저장|
|rateOfLikingMath|int|X|평소 수학을 얼마나 좋아하는지|
|mostLikeMathField|str|X|가장 좋아하는 수학분야|
|rateOfRecommendation|int|X|추천하고 싶은 정도
# 생성 코드
```
CREATE TABLE "Played" (
	"state"	INTEGER NOT NULL,
	"key"	TEXT,
	"grade"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"startTIme"	INTEGER NOT NULL,
	"finishedTime"	INTEGER NOT NULL DEFAULT -1,
	"selectedRoom"	INTEGER NOT NULL,
	"mbti"	TEXT NOT NULL,
	"device"	TEXT NOT NULL,
	"recentMathPCnt"	INTEGER NOT NULL,
	"wrongs"	TEXT NOT NULL DEFAULT -1,
	"rateOfLikingMath"	INTEGER NOT NULL,
	"mostLikeMathField"	TEXT NOT NULL,
	"rateOfRecommendation"	INTEGER NOT NULL DEFAULT -1,
	PRIMARY KEY("key")
);
```