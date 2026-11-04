# 2026/11/04 「禾光啟源」SEO 品牌洗白：新帳號建立後即投放「假律師」樣板訊息

Cofacts WG 於例行監控中發現，新帳號在建立當下送出一篇以「禾光啟源」為關鍵字、談「假律師真詐騙」的長篇文章體訊息，樣板與 [2026/10/06 公告](https://github.com/cofacts/takedowns/blob/master/2026/1006-seo-reputation-management.md)處置的品牌洗白一致，且與已被封鎖的帳號在 2 分鐘內先後投放同一套路。

## 觀察

|使用者|建立時間（台灣時間）|活動|
|---|---|---|
|[☞文雅的春日加爾☜](https://cofacts.github.io/community-builder/#/editorworks?type=2&day=365&userId=j4S8C_d7ZhlfvVFCocTaf3j5KLrTbBXb1njwFveX-0-tOkcU0)（userId `j4S8C_d7ZhlfvVFCocTaf3j5KLrTbBXb1njwFveX-0-tOkcU0`）|2026/11/04 12:31:32|同一秒內送出唯一一篇[訊息](https://cofacts.tw/article/wbeifvf92vb7)，`reason` 為空|

- **帳號活動範圍**：自建立以來，`ListArticles`、`ListReplyRequests`、`ListReplies` 僅有上表這 1 筆活動（1/1）。
- **內容樣態**：標題與首段以「禾光啟源防詐提醒」「假律師真詐騙」為主軸，行文為 LLM 風格的科普警語，末段改為描述「禾光啟源」的金融科技、AI 交易、普惠金融等「正面」賣點，並註明以官方公布為準；並非轉貼待查證的可疑訊息，而是替特定品牌鋪陳形象內容。
- **跨帳號重複**：台灣時間 12:33:23，已於 10/06 公告封鎖的帳號送出[另一篇](https://cofacts.tw/article/1lh9ptg63wjdq)同樣以「禾光啟源」＋「假律師」為主軸、同樣結尾轉入金融科技賣點的訊息，兩者相隔不到 2 分鐘。該已封鎖帳號過去的同類投放見前述 10/06 公告。
- **節奏**：帳號建立與送出訊息同為 12:31:32，與先前同波投放帳號「建帳即投放」的樣態一致。

## 判斷

- 該帳號全部活動（1/1 筆）皆為替特定品牌洗白、置入關鍵字的推廣內容，不具查證意圖，屬[使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md)一、6 所稱之廣告／推廣行為。
- 單一帳號僅 1 筆活動，證據本不足；但同一批樣板由已因 CIB 被封鎖的帳號在 2 分鐘內接續投放，屬 LEGAL.md 一、6 所稱之協同造假行為（CIB），跨帳號重複補足了單一帳號證據不足的缺口，做法比照[前例](https://github.com/cofacts/takedowns/blob/master/2026/1022-seo-reputation-management-2.md)。

## 處置

循[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)，針對上述使用者進行下面處置[^block]：

[^block]: 
    1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
    2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
    3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
