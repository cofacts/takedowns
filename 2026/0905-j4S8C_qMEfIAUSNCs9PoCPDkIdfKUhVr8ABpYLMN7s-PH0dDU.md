# 2026/09/05 貸款詐騙「種頁面」樣板投放帳號

Cofacts WG 於每小時例行監控中發現，使用者「乂辦事仔細的牡丹喬休爾乂」（`j4S8C_qMEfIAUSNCs9PoCPDkIdfKUhVr8ABpYLMN7s-PH0dDU`）自帳號建立起送出的唯一一篇訊息，內容為已知的「貸款初審通過」詐騙頁面導流樣板句，`replyRequests.reason` 為空字串，不在偵測 bot 範圍內。

## 觀察

- **帳號時間軸方面的觀察**：帳號於 2026/9/5 01:06:03.074（台灣時間）建立，同一秒內（相差約 93 毫秒）即送出唯一一篇[訊息](https://cofacts.tw/article/10kfha4vsbdy5)，屬「建帳號即投放」的典型自動化模式（對照 PR #335、#336 等既有案例）。
- **帳號活動範圍方面的觀察**：`ListArticles(filter: { userId: "j4S8C_qMEfIAUSNCs9PoCPDkIdfKUhVr8ABpYLMN7s-PH0dDU", statuses: [NORMAL, BLOCKED] })` 與 `ListReplyRequests`／`ListReplies`（同帶 `statuses: [NORMAL, BLOCKED]`）皆回傳 totalCount = 1／1／0——即帳號自建立以來的全部活動只有這一篇訊息，無任何查核回應、其他回報或使用行為。
- **樣板一致性方面的觀察**：訊息內容為：

  > 請登入平台官方申請網址　註冊登入後填寫您的真實個資　選擇借貸金額　分期數申請完成了跟我說
  > https://tusja.ushyw.cyou（[10kfha4vsbdy5](https://cofacts.tw/article/10kfha4vsbdy5)）

  以此句下 `ListArticles(moreLikeThis: { like: "請登入平台官方申請網址 註冊登入後填寫您的真實個資 選擇借貸金額 分期數申請完成了跟我說", minimumShouldMatch: "70%" }, statuses: [NORMAL, BLOCKED])` 命中 totalCount = 18，時間橫跨 2023～2025 年，每篇僅網域不同（`zarfov.buzz`、`pieya.sbs`、`nshench.click`、`chzvd.shop` 等一次性拋棄域名），且每篇皆由不同的、僅出現一次的帳號送出——為長期重複使用的詐騙導流樣板，本帳號是該樣板的又一次投放。
- **「跟我說」用語方面的觀察**：句尾「跟我說」是對真人下的指示（要求受害者填完資料後回報），而非陳述句或提問句，顯示此訊息本身即為詐騙集團用來種頁面的腳本，並非一般使用者轉貼詢問真偽的用語。
- **網域方面的觀察**：`tusja.ushyw.cyou` 為免費、一次性 `.cyou` 短網域，與歷史比對命中的其他 17 個網域（`.buzz`、`.sbs`、`.click`、`.shop`、`.cyou` 等）風格一致，均屬詐騙集團慣用的拋棄式網域。

## 判斷

- 帳號自建立起的全部活動（1/1 篇）為已知貸款詐騙樣板的重複投放，不具備一般使用者轉貼查證的意圖，屬[使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md)一、6 所稱之廣告／推廣行為。
- 帳號活動 100% 為此類行為（1 篇訊息、0 筆查核回應、`reason` 全空），符合「近期之所有內容均違反使用者條款」之封鎖門檻；雖僅有 1 篇，但該篇即為帳號的全部內容，且與 18 起歷史同款投放（[已知樣態 4](https://github.com/cofacts/devops/blob/main/.claude/skills/takedown/cases/patterns.md) 之變體）逐字吻合，非單篇可疑內容之誤判風險。
- 帳號建立到首次投放僅相差約 93 毫秒，屬程式化自動投放的時間特徵，非真人操作。

## 處置

循[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)，針對使用者「乂辦事仔細的牡丹喬休爾乂」（`j4S8C_qMEfIAUSNCs9PoCPDkIdfKUhVr8ABpYLMN7s-PH0dDU`）進行下面處置：

1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
