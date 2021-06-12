# 주소
## /
방선택 페이지
## /room/\<int>
게임 플레이 하는 페이지
## /leaderboard/\<int>
게임 끝나고 순위 보는 페이지
## /sendInfo
key, grade 같은 값들 보내는 페이지(POST 메소드 사용)
## /survey?room=\<int>
grade, mbti같은 값 넣는 페이지. room을 GET메소드로 받아서, 나중에 적절한 방으로 리다이렉트가 가능하도록 함.
## /congratulations?room=\<int>
끝난거 축하해주는 페이지(리더보드랑 통합될수도 있음)  
여기서 방에대한 만족도 조사