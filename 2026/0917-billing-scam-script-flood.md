# 2026/09/17 封鎖批量投放假客服扣款詐騙話術帳號

帳號「菔達的大安雷爾夫」（userId `j4S8C_lIwbTx39DQbeIrK9NrT9eAnkq2hCJuFEEY_Xxrj7MtY`）於帳號建立後約 53 秒，在 6.6 秒內密集送出 11 筆訊息／回報補充，串接後為一則完整的「假客服扣款詐騙」對話腳本（自稱平台客服，聲稱使用者訂閱扣款異常，以核對身分、取消訂閱等話術取信對象），被拆成多段各自以獨立訊息投放。此為帳號自建立以來的全部活動。

## 觀察

  - **帳號時間軸方面的觀察**：帳號於 2026/9/17 18:27:33（台灣時間）建立；53 秒後（18:28:26）開始送出訊息，至 18:28:33 為止的 6.6 秒內共送出 11 筆（10 篇新訊息 + 1 筆對既有訊息的回報補充），多筆之間間隔僅數毫秒，非真人操作可能達到的速度。
  - **內容樣態方面的觀察**：10 篇新訊息（[bjhi0max9gxb](https://cofacts.tw/article/bjhi0max9gxb)、[2bfsvk22vi84a](https://cofacts.tw/article/2bfsvk22vi84a)、[3sboujzpqj1hg](https://cofacts.tw/article/3sboujzpqj1hg)、[36knu2uzt8vlz](https://cofacts.tw/article/36knu2uzt8vlz)、[2jt17v2x8xqj0](https://cofacts.tw/article/2jt17v2x8xqj0)、[1avowttyjakrg](https://cofacts.tw/article/1avowttyjakrg)、[8o6nztdp2n9x](https://cofacts.tw/article/8o6nztdp2n9x)、[1jmhep1of9j6l](https://cofacts.tw/article/1jmhep1of9j6l)、[26aaey5zawe56](https://cofacts.tw/article/26aaey5zawe56)、[ODDprqABEY7yIwhpGqQs](https://cofacts.tw/article/ODDprqABEY7yIwhpGqQs)）依內容前後銜接，即構成一則假客服對話腳本：自稱平台客服通知「訂閱扣款異常」，援引 PCI-DSS、支付機構管理條例等說法要求核對身分、取消訂閱，並附虛構的訂閱明細與訂單編號。另 1 筆為對一篇既有通用制式訊息（[1drg5c65w1v8l](https://cofacts.tw/article/1drg5c65w1v8l)，內容為「請稍等，正在幫您查詢」）新增的回報補充。上述 11 筆之 `reason` 全為空字串。
  - **帳號全部活動方面的觀察**：`ListReplyRequests(filter: { userId: "j4S8C_lIwbTx39DQbeIrK9NrT9eAnkq2hCJuFEEY_Xxrj7MtY", statuses: [NORMAL, BLOCKED] })` 回傳 `totalCount = 11`，即帳號自建立以來的全部活動，100% 為上述投放，無任何一般查證行為。
  - **跨帳號協同投放方面的觀察**：以其中一段文字做 `moreLikeThis`（50%）反查全站訊息，僅命中此帳號自身，未發現其他帳號投放相同樣板文字。

## 判斷

- 帳號自建立至首次投放僅間隔約 53 秒，且 11 筆訊息／補充於 6.6 秒內以毫秒級間隔送出，明顯為自動化批次投放，而非真人使用 LINE bot 逐則對話或查證。
- 帳號自建立以來的全部內容（100%）均為上述投放，未見任何一般查證行為，符合封鎖門檻「近期之所有內容均違反使用者條款」。
- 內容本身為虛構的假客服扣款詐騙對話腳本，刻意拆成多段各自以獨立「訊息」投放，性質上是濫用訊息投稿管道製造內容，而非查證真實收到的訊息，符合 [rumors-site 使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md) 一、6 與三、4。
- 雖未查得其他帳號共用相同樣板文字，但依現行往例（如 [#349 Gogo Anime 案](https://github.com/cofacts/takedowns/pull/349)、[#350 ecsoga 案](https://github.com/cofacts/takedowns/pull/350)），單一帳號、建立至投放間隔極短、投放內容 100% 與查證無關，即足以認定為濫用查證訊息管道，不以查得跨帳號協同投放為必要條件。

## 處置

依循[往例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)，針對此帳號進行下面處置：

1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
