#파일 합치기
'''
import pandas as pd


df1 = pd.read_json('data.json', encoding='cp949')
df2 = pd.read_json("data2.json", encoding='cp949')
result = pd.concat([df1,df2])
result.to_json('final_data.json', orient='records', indent=4)
'''



#제주 버전
'''
import googlemaps,os
from datetime import datetime
import pandas as pd
import time #구동 시간을 측정하기 위하여 time 모듈 임포트


df = pd.read_csv('data/제주특별자치도 제주시_클린하우스_20241106.csv', encoding='cp949')


df2=pd.DataFrame({'위치':df['단지 명'], '주소':df['도로명 주소'],'위도':df['위도 좌표'],'경도':df['경도 좌표']})

# 변환한 데이터를 json으로 내보내기
df2.to_json('data2.json', orient='records', indent=4)
print(df2)
'''



#서귀포 버전
'''
import googlemaps,os
from datetime import datetime
import pandas as pd
import time #구동 시간을 측정하기 위하여 time 모듈 임포트

my_key = "AIzaSyDmZwUsB57XD2okbWY7FmQ1NhYEPAttFiM"
maps = googlemaps.Client(key=my_key)

df = pd.read_csv('data/제주특별자치도 서귀포시_클린하우스현황_20240823.csv', encoding='cp949')
df = df.drop(columns="데이터기준일자")

#읍면동,위치,인근주소,데이터기준일자
lat = []  #위도
lng = []  #경도

i=0

t1 = time.time() #지오코딩 코드 처리 전 시각
print(df)
for address in df["인근주소"]:   
  i = i + 1
  try:
      geo_location = maps.geocode(address)[0].get('geometry')
      lat.append(geo_location['location']['lat'])
      lng.append(geo_location['location']['lng'])

# 좌표를 가져오지 못한 경우 에러 출력
  except:
      lat.append('')
      lng.append('')
      print("%d번 인덱스 에러"%(i))


print(time.time() - t1) #지오코딩 총 구동 시간

# 변환한 위도, 경도를 데이터프레임으로 만들어 출력하기
df2=pd.DataFrame({'위치':df['위치'], '주소':df['인근주소'],'위도':lat,'경도':lng})

# 변환한 데이터를 json으로 내보내기
df2.to_json('data.json', orient='records', indent=4)
'''
