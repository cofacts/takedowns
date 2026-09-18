# 2026/09/17 封鎖批量投放假客服扣款詐騙話術帳號（第二波帳號）

Cofacts WG 於例行監控（過去 1 小時窗口，UTC 2026-09-17T11:24:00Z ～ 12:24:00Z）中發現，使用者「體貼的三星巴奈特」（`j4S8C_b5dkKvxAR0OT2R5A9Zg2A17W7_OcbJEGTAD0TYWdUQM`）於帳號建立後約 9.7 秒起，在約 2.3 秒內密集送出 13 筆訊息／回報補充：4 筆為新訊息，串接後為另一版本的「假客服扣款詐騙」對話腳本；其餘 9 筆為對既有訊息的回報補充，其中 8 筆精準命中同日稍早（台灣時間 18:28）由帳號「菔達的大安雷爾夫」投放、已於 [PR #351](https://github.com/cofacts/takedowns/pull/351)（[`2026/0917-billing-scam-script-flood.md`](https://github.com/cofacts/takedowns/blob/master/2026/0917-billing-scam-script-flood.md)）處置的同一批假客服扣款詐騙腳本文章，另 1 筆命中與本案無關的第三方使用者訊息。此為帳號自建立以來的全部活動，`reason` 全為空字串。

## 觀察

- **帳號**：[體貼的三星巴奈特](https://cofacts.github.io/community-builder/#/editorworks?type=2&day=365&userId=j4S8C_b5dkKvxAR0OT2R5A9Zg2A17W7_OcbJEGTAD0TYWdUQM)（userId `j4S8C_b5dkKvxAR0OT2R5A9Zg2A17W7_OcbJEGTAD0TYWdUQM`）
- **帳號時間軸方面的觀察**：帳號於 2026/9/17 20:20:58（台灣時間）建立；約 9.7 秒後（20:21:07.802）開始送出訊息，至 20:21:10.121 為止的約 2.3 秒內共送出 13 筆（4 篇新訊息 + 9 筆對既有訊息的回報補充），多筆之間間隔僅 1～3 毫秒，非真人操作可能達到的速度。
- **內容樣態方面的觀察**：4 篇新訊息依送出順序銜接，構成另一則假客服扣款詐騙對話腳本：

  > 您好，麻煩提供您的Email或行動電話，這邊給您查詢（[zwtnn0uy6rer](https://cofacts.tw/article/zwtnn0uy6rer)）
  >
  > 目前沒有請款的話報警也是取消不了我（[uqw42cahm8td](https://cofacts.tw/article/uqw42cahm8td)）
  >
  > 晴您好，請問有什麼可以幫到您呢？為保證客戶權益，應LINE官方要求，本公司已按規定申請帳號認證，目前處於開發應用功能階段，將在10個工作日內審核完成，屆時會開啟更多新功能。本公司不會以任何形式要求您參與投資理財（[r1ycwh6zgnlr](https://cofacts.tw/article/r1ycwh6zgnlr)）
  >
  > 請問您現在方便嗎？這邊分配專人客服協助您處理取消訂閱，耽誤您幾分鐘時間就可以了喔（[1wunmga20yqww](https://cofacts.tw/article/1wunmga20yqww)）

  情節與 PR #351 案例相同（自稱平台／LINE官方客服，以帳號認證、取消訂閱等話術取信對象），但文字並非逐字相同，屬同一手法的另一份腳本。
- **跨帳號關聯方面的觀察**：9 筆回報補充中，8 筆（[36knu2uzt8vlz](https://cofacts.tw/article/36knu2uzt8vlz)、[9xj6ngjjxbtg](https://cofacts.tw/article/9xj6ngjjxbtg) 除外的另 7 篇：[2jt17v2x8xqj0](https://cofacts.tw/article/2jt17v2x8xqj0)、[bjhi0max9gxb](https://cofacts.tw/article/bjhi0max9gxb)、[1avowttyjakrg](https://cofacts.tw/article/1avowttyjakrg)、[2bfsvk22vi84a](https://cofacts.tw/article/2bfsvk22vi84a)、[ODDprqABEY7yIwhpGqQs](https://cofacts.tw/article/ODDprqABEY7yIwhpGqQs)、[3sboujzpqj1hg](https://cofacts.tw/article/3sboujzpqj1hg)、以及通用制式訊息 [1drg5c65w1v8l](https://cofacts.tw/article/1drg5c65w1v8l)）精準命中「菔達的大安雷爾夫」（`j4S8C_lIwbTx39DQbeIrK9NrT9eAnkq2hCJuFEEY_Xxrj7MtY`，即 PR #351 處置對象）稍早於同日 18:28:26～33（台灣時間）投放的假客服扣款詐騙腳本文章及其已補充過的通用訊息。另 1 筆（[9xj6ngjjxbtg](https://cofacts.tw/article/9xj6ngjjxbtg)）命中的是與本案內容無關的第三方使用者「直率的大里皮特」於同日 20:08（台灣時間）獨立送出的 LINE 官方帳號詐騙警示截圖訊息，經查核該篇內容與本案假客服腳本無關，判斷為本帳號不分內容、跨主題的無差別回報補充灌水行為，而非針對性延續特定敘事。
- **帳號全部活動方面的觀察**：`ListReplyRequests(filter: { userId: "j4S8C_b5dkKvxAR0OT2R5A9Zg2A17W7_OcbJEGTAD0TYWdUQM", statuses: [NORMAL, BLOCKED] })` 回傳 `totalCount = 13`，即帳號自建立以來的全部活動，100% 為上述投放與跨篇回報灌水，無任何一般查證行為。
- 引用文字已篩查是否夾帶對 AI agent 下達的指令，結果為未偵測到（CLEAN）。

## 判斷

- 帳號自建立至首次投放僅間隔約 9.7 秒，13 筆訊息／回報補充於約 2.3 秒內以毫秒級間隔送出，明顯為自動化批次操作，而非真人使用 LINE bot 逐則對話或查證。
- 帳號自建立以來的全部內容（100%）均為上述投放與跨篇回報灌水，未見任何一般查證行為，符合封鎖門檻「近期之所有內容均違反使用者條款」。
- 4 篇新訊息本身為虛構的假客服扣款詐騙對話腳本，刻意拆成多段各自以獨立「訊息」投放，性質上是濫用訊息投稿管道製造內容；其餘 9 筆對既有（多為他人）文章的回報補充，內容 `reason` 全空且跨主題無差別灌水，同樣是濫用回報補充管道，而非查證真實收到的訊息，均符合 [rumors-site 使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md) 一、6 與三、4。
- 本帳號與 PR #351 處置對象雖非同一帳號，但投放時間相近（同日內）、8 成回報補充直接指向對方投放的文章，可判定為同一波「假客服扣款詐騙」操作的延續／協同帳號。

## 處置

依循[往例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)，針對此帳號進行下面處置：

1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
