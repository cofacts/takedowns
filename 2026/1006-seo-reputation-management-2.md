# 2026/10/06 「映善 Lumen Mind」品牌聲譽管理：兩個新帳號張貼查核回應洗白

Cofacts WG 於例行監控中發現，在[同日稍早公告](https://github.com/cofacts/takedowns/blob/master/2026/1006-seo-reputation-management.md)處置的「禾光啟源」「映善 Lumen Mind」品牌洗白操作之後，同一操作者改以兩個新帳號、以「查核回應」形式延續：兩帳號在同一分鐘內建立、各自只對同一篇訊息（[映善 × Lumentum是投資詐騙](https://cofacts.tw/article/1ktg8az7gcid1)）送出一則長篇 LLM 風格「澄清」回應。內容並非查核，而是替品牌洗白；偵測 bot 逐篇判斷時看不出跨帳號的群集特徵。

## 觀察

|使用者|建立時間（台灣時間）|活動|
|---|---|---|
|[Thuxike Nguyen](https://cofacts.github.io/community-builder/#/editorworks?type=0&day=365&userId=1jEBDaEBEY7yIwhpEyV9)（userId `1jEBDaEBEY7yIwhpEyV9`）|2026/10/06 00:58:56|10/06 02:13:47 送出唯一一則[查核回應](https://cofacts.tw/reply/DzFFDaEBEY7yIwhplyaW)|
|[Huy Nguyen](https://cofacts.github.io/community-builder/#/editorworks?type=0&day=365&userId=1zEBDaEBEY7yIwhpqCU3)（userId `1zEBDaEBEY7yIwhpqCU3`）|2026/10/06 00:59:34|10/06 02:19:01 送出唯一一則[查核回應](https://cofacts.tw/reply/EDFKDaEBEY7yIwhpYyYQ)|

- **帳號活動範圍**：`GetUser`、`ListReplies`、`ListArticles`、`ListReplyRequests` 顯示兩帳號自建立以來**僅有上述 1 則查核回應**，無任何其他使用行為。
- **兩帳號建立時間僅差約 38 秒**，投放時間相隔約 5 分鐘，皆針對同一篇文章、同一品牌。
- **內容樣態**：兩則回應皆為多段落的文章體，逐點「檢視」該訊息下既有的查核回應（指其「經濟部商工登記查無資料」的佐證連結 404、不能推導出詐騙），結論為「現有資料不足以證實是投資詐騙」，並暗示指控者「惡意造謠」，最後帶出「假冒律師追回資金」的警語。此套路（暗示指控者惡意散播、附「假律師追回」警語、替品牌洗白）與前述公告中的訊息投放一致：[映善 Lumen Mind 篇](https://cofacts.tw/article/2jegtpdsmwhts)、[禾光啟源篇](https://cofacts.tw/article/1adu9qjdlevio)。
- **同一時段另有已封鎖帳號**：2023 年已封鎖之使用者（見[公告](https://github.com/cofacts/takedowns/blob/master/2023/1128-cib-spam.md)）於 2026/10/06 01:54（台灣時間）亦張貼與前述「禾光啟源」訊息開頭幾乎逐字相同的回應（[連結](https://cofacts.tw/reply/_zEzDaEBEY7yIwhpfSUb)）；該帳號已被封鎖，本次不另行處置。

## 判斷

- 兩帳號全部活動（各 1/1 則）皆為替特定品牌洗白，不具查核意圖，屬[使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md)一、6 所稱之廣告／推廣行為，符合「近期之所有內容均違反使用者條款」之封鎖門檻。
- 兩帳號在同一分鐘內建立、針對同一品牌投放同一套路，且與前案已封鎖帳號同一小時內持續交錯投放同敘事，屬 LEGAL.md 一、6 所稱之協同行為（CIB）。單一帳號僅 1 則回應，證據本不足，但兩帳號跨帳號重複補足了此缺口。

## 處置

循[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)，針對上述兩個使用者進行下面處置[^block]：

[^block]: 
    1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
    2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
    3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
