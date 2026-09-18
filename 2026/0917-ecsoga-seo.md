# 2026/09/17 封鎖新帳號投放電商課程廣告連結

例行監控（過去 1 小時窗口，UTC 2026-09-17T08:24:00Z ~ 09:24:00Z）發現一帳號於建立後不到 1 秒即送出與查證完全無關的商業廣告連結。此訊息本體不在偵測 bot 範圍（bot 僅檢查查核回應與回報補充文字，且 `reason` 為空字串會被濾掉），故由人工複核處置。

## 觀察

  - **帳號**：[平和的麻豆愛琳娜](https://cofacts.github.io/community-builder/#/editorworks?type=2&day=365&userId=j4S8C_d_0R160Hev3_lUTIf8rvjZo8LHzz44CQ1B5ggmoBCqw)（userId `j4S8C_d_0R160Hev3_lUTIf8rvjZo8LHzz44CQ1B5ggmoBCqw`）
  - **帳號時間軸方面的觀察**：使用者帳號於 2026/9/17 16:30:43（台灣時間）建立，帳號建立後約 0.05 秒即透過 LINE Bot 送出[訊息](https://cofacts.tw/article/3mx01thhwmee4)。
  - **內容方面的觀察**：訊息全文為電商課程招生廣告文字，開頭即以「請顧客先參考我們的電商課程喔」起始，並附外部報名連結，語氣為對「顧客」的商業招生話術，未包含任何查證問句，與 Cofacts 查證訊息的使用情境不符。
  - **帳號全部活動方面的觀察**：`ListReplyRequests(filter: { userId, statuses: [NORMAL, BLOCKED] })` 回傳 totalCount = 1，即此帳號自建立以來的全部活動，100% 為上述廣告訊息，`reason` 為空字串。
  - **跨帳號協同方面的觀察**：以此訊息文字做 `moreLikeThis`（50%）查詢，僅命中此帳號自身這 1 筆，未發現其他帳號投放相同或近似樣板。

## 判斷

- 帳號建立到首次（亦是唯一一次）活動間隔不到 1 秒，非真人瀏覽、判讀後手動送出訊息的合理時間，具自動化投放特徵。
- 帳號自建立以來的全部內容（1/1）皆為與查證無關的商業廣告，整體內容違反使用者條款，非偶發夾帶。
- 雖未查得跨帳號協同投放證據，但單一帳號、單筆活動、100% 為推廣內容，且帳號存活時間與首次投放間隔極短，足以認定為濫用查證訊息管道進行 SEO／導流投放，而非一般查證使用者。

## 處置

依 [rumors-site LEGAL.md](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md) 一、6 與三、4，封鎖此帳號，比照往例 [2021/1125-2nd-spam.md](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)：

1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
