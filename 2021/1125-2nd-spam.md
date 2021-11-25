# 11/25 移除「我想補充」中的色情與二次詐騙廣告

## 說明

2021 年 10 月中，經網友於 g0v slack 的 #cofacts 頻道中回報，下列試算表中的 22 名 Cofacts 真的假的 網站使用者，在網站的「網友補充」區塊，張貼廣告內文吸引人加入特定 LINE ID 進行二次詐騙或情色消費。
https://docs.google.com/spreadsheets/d/1Ytd69YU6z7Fgra81_79XrsPwQYV1Clh0yp5OZlk5Psg/edit#gid=0

這些使用者所張貼的實際內容，條列於上述連結的「Reply requests to delete」試算表。

此等行為已經符合[Cofacts 網站使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md)一、6 所禁止的「廣告投放」行為。

## 處理

針對此類廣告使用者，逐篇公告並刪除並不可行，故將採取新的隱藏機制，針對以上公告的 22 名 Cofacts 真的假的網站使用者，進行下面處置：

1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被封鎖的使用者登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。

Cofacts 真的假的 工作小組在 2021/10/18 於編輯交流天地社團中，公告[新的處理方式](https://www.facebook.com/groups/cofacts/posts/3111789079052900/)並徵求意見。
