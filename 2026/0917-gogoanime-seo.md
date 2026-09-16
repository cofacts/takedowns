# 2026/09/17 Gogo Anime 帳號 SEO 導流回應下架

Cofacts WG 於例行監控中發現，使用者「Gogo Anime」（`ETBZq6ABEY7yIwhpDJ-x`）於帳號建立後約 4 分 30 秒，對一則與其推廣內容完全無關的網傳訊息新增「查核回應」，回應內容並非查證資訊，而是推廣第三方動畫串流網站 `gogoanime.biz.in`。此帳號自建立以來僅有此一筆活動。

## 觀察

- **帳號時間軸方面的觀察**：帳號於 2026/9/17 01:52:15 建立；2026/9/17 01:56:45（建立後約 4 分 30 秒）於[網傳訊息](https://cofacts.tw/article/2g6ftx74mdky1)新增查核回應。
- **帳號活動範圍方面的觀察**：查詢該 userId 的 `ListArticles`、`ListReplyRequests`、`ListReplies`，此帳號自建立以來僅有這 1 筆查核回應，未曾送出任何網傳訊息，也未曾新增回報補充——帳號全部活動即為下述推廣行為。
- **回應內容方面的觀察**：該筆查核回應標記為 `NOT_ARTICLE`（不構成查證判斷），內容為：「Watch Online Anime Free With English Subbed and Dubbed Format only at Gogoanime. Download popular and latest Tv series and movies for Free in HD quality.」並附上 `https://gogoanime.biz.in/` 連結，與原訊息內容毫無關聯。
- **灌注對象方面的觀察**：被回應的[網傳訊息](https://cofacts.tw/article/2g6ftx74mdky1)內容為一則 Facebook 影片分享連結，與動畫串流服務毫無關聯，顯示此帳號僅是挑選既有訊息掛推廣連結。
- **帳號名稱方面的觀察**：使用者顯示名稱「Gogo Anime」與被推廣網站品牌「Gogoanime」完全相同，顯示此帳號即為該網站自營或代操作之推廣帳號。
- **樣板比對方面的觀察**：以此回應文字進行 `moreLikeThis` 查詢（`minimumShouldMatch: 80%`），未發現其他帳號有相同或近似內容，暫未查得跨帳號協同投放跡象。

## 判斷

- 帳號自建立起的唯一活動即是在與己身推廣內容無關的訊息下張貼第三方網站導流連結，不具備「查核回應」應有的查證性質，屬於[使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md)一、6 所稱之廣告／推廣行為。
- 帳號活動 100% 為此類行為（1 筆查核回應、0 筆回報補充、0 筆送出訊息），符合「近期之所有內容均違反使用者條款」之封鎖門檻，非單篇可疑內容。
- 帳號名稱與推廣品牌一致、註冊後極短時間內即投放，顯示非一般使用者誤用查核回應欄位，而是有意圖之商業導流行為。
- 目前僅查得單一帳號、單筆行為，未發現跨帳號協同投放證據，列為「還無法確證的部分」供 moderator 複核參考。

## 處置

循[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)，針對使用者「Gogo Anime」（`ETBZq6ABEY7yIwhpDJ-x`）進行下面處置：

1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
