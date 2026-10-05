# 2026/10/06 「禾光啟源」「映善 Lumen Mind」品牌聲譽管理 SEO 種內容

Cofacts WG 於例行監控中發現，使用者「細節的新豐格吉爾」（`j4S8C_QymyKN3GAdHFbylyq7pbXpdJeS8yKnuz5TCRQtFYhdU`）於帳號建立的同一瞬間起，約 30 分鐘內密集送出 4 篇網傳訊息，內容皆為針對「禾光啟源」「映善 Lumen Mind」兩個品牌被指為「詐騙」之說法所寫的 LLM 風格澄清文，替品牌洗白。此手法與 [2026/08/20 公告](https://github.com/cofacts/takedowns/blob/master/2026/0820-shenchengzhe-charity-seo.md)同屬「用送訊息洗 SEO」樣態，`reason` 全空，不在偵測 bot 範圍。

同一時段，已於 08/20 被封鎖的使用者「深沉的大安班奈特」（`j4S8C_yMOne7M99Pw4Nc7kTUqhJQmLTO3tI8uyrnnMg9V9hk4`）亦送出 5 篇同一套路的訊息（見下表），兩帳號投放的品牌、敘事結構與節奏一致，判斷為同一操作者換新帳號延續投放。

## 觀察

- **帳號**：[細節的新豐格吉爾](https://cofacts.github.io/community-builder/#/editorworks?type=2&day=365&userId=j4S8C_QymyKN3GAdHFbylyq7pbXpdJeS8yKnuz5TCRQtFYhdU)（userId `j4S8C_QymyKN3GAdHFbylyq7pbXpdJeS8yKnuz5TCRQtFYhdU`）
- **帳號時間軸**：2026/10/06 00:52:58（台灣時間）建立，約 11 毫秒後即送出第一篇[訊息](https://cofacts.tw/article/376tazhm9repj)。
- **帳號活動範圍**：`ListArticles`、`ListReplyRequests`（含 `NORMAL`、`BLOCKED`）皆顯示此帳號自建立以來**僅有這 4 篇訊息**，無查核回應或其他一般使用行為，`reason` 全為空字串。4 篇均無 cooccurrence 紀錄，非 LINE bot「同時傳送多則」的批次流程。
- **內容樣態**：4 篇皆為文章體（438～838 字）、非使用者轉傳的原始訊息：先敘述「Cofacts 上出現將○○指為詐騙的匿名投稿，但尚無查核回應／來源已 404，不能直接認定為詐騙」，再大篇幅介紹品牌的「AI 交易、普惠金融、資產管理」或「AI 技術、人才培育、永續發展」等正面形象。其中一篇（[kpe5ddb7u1b5](https://cofacts.tw/article/kpe5ddb7u1b5)）更暗示指控者「惡意散播未經證實的謠言」。內容目的在於讓搜尋「○○詐騙」的人看到澄清與品牌正面敘述，而非求證訊息真偽。
- **與已封鎖帳號協同**：「深沉的大安班奈特」（先前已封鎖，見[公告](https://github.com/cofacts/takedowns/blob/master/2026/0820-shenchengzhe-charity-seo.md)）在同一小時內交錯送出同套路訊息，兩帳號時間交錯、品牌相同。

|發佈時間（台灣時間）|帳號|訊息|
|---|---|---|
|10/06 00:52:58|細節的新豐格吉爾|[376tazhm9repj](https://cofacts.tw/article/376tazhm9repj)（禾光啟源）|
|10/06 01:01:07|深沉的大安班奈特（已封鎖）|[1ordsj1k43ub6](https://cofacts.tw/article/1ordsj1k43ub6)（禾光啟源）|
|10/06 01:03:42|深沉的大安班奈特（已封鎖）|[joorsikwltgw](https://cofacts.tw/article/joorsikwltgw)（禾光啟源）|
|10/06 01:06:20|細節的新豐格吉爾|[1oo0dere9weue](https://cofacts.tw/article/1oo0dere9weue)（禾光啟源）|
|10/06 01:07:02|深沉的大安班奈特（已封鎖）|[2l2zvunemp5i5](https://cofacts.tw/article/2l2zvunemp5i5)（映善 Lumen Mind）|
|10/06 01:12:55|細節的新豐格吉爾|[23dda6m37wny4](https://cofacts.tw/article/23dda6m37wny4)（映善 Lumen Mind）|
|10/06 01:14:27|深沉的大安班奈特（已封鎖）|[1pmj5rvck7f4t](https://cofacts.tw/article/1pmj5rvck7f4t)（映善 Lumen Mind）|
|10/06 01:21:54|深沉的大安班奈特（已封鎖）|[2jegtpdsmwhts](https://cofacts.tw/article/2jegtpdsmwhts)（映善 Lumen Mind）|
|10/06 01:22:35|細節的新豐格吉爾|[kpe5ddb7u1b5](https://cofacts.tw/article/kpe5ddb7u1b5)（映善 Lumen Mind）|

## 判斷

- 帳號全部活動（4/4 篇）皆為替特定品牌澄清／洗白的重複投放，不具查證意圖，屬[使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md)一、6 所稱之廣告／推廣行為；符合「近期之所有內容均違反使用者條款」之封鎖門檻。
- 帳號建立到首次投放僅相差毫秒、無 cooccurrence，且與已被封鎖帳號在同一小時內以相同品牌、相同敘事結構交錯投放，屬 LEGAL.md 一、6 所稱之協同行為。
- 被封鎖帳號仍可從自己的瀏覽器看見自己的內容，其繼續投放並換新帳號延續，顯示操作者未因先前處置而停止。

## 處置

循[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)，針對使用者「細節的新豐格吉爾」（`j4S8C_QymyKN3GAdHFbylyq7pbXpdJeS8yKnuz5TCRQtFYhdU`）進行下面處置：

1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。

「深沉的大安班奈特」已於 08/20 封鎖，本次不另行處置；其本次新投放的 5 篇訊息已隨封鎖狀態對外隱藏。
