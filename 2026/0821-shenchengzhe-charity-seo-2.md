# 2026/08/21 「沈誠哲／共築永續公益企劃」投資詐騙集團 SEO 種內容（第二波帳號）

Cofacts WG 於例行監控中發現，使用者「偉大的中山區亞歷山大」（`j4S8C_Bb49e0cYy9cq1EoPk_pXQ_wrIc8oz4Yi4EwpDE1VVtM`）自帳號建立起送出的全部 3 篇訊息，皆環繞與 [`2026/0820-shenchengzhe-charity-seo.md`](https://github.com/cofacts/takedowns/blob/master/2026/0820-shenchengzhe-charity-seo.md)（PR [#335](https://github.com/cofacts/takedowns/pull/335)）同一品牌敘事：「沈誠哲」發起「共築永續公益企劃」／「聚善共築」公益理念，屬同一波 SEO 種內容操作的另一個帳號。手法對應[已知樣態 4](https://github.com/cofacts/devops/blob/main/.claude/skills/takedown/cases/patterns.md) 之變體，此帳號進一步把敘事包裝成「公眾提問」形式（而非單純陳述句），推測是同一組操作在正面敘事之外再鋪一層「有公眾在關心、提問」的假象。三篇訊息 `reason` 欄位皆為空字串，均不在偵測 bot 範圍。

## 觀察

- **帳號時間軸方面的觀察**：帳號於 2026/8/21 00:02:48（台灣時間）建立，同一瞬間（相差約 10 毫秒）即送出第一篇[訊息](https://cofacts.tw/article/6t90xxroesjc)，與 PR #335 案例帳號「建帳號即投放」的模式完全一致。其後有約 76 分鐘空窗，接著於 01:18:19～01:19:24（台灣時間）連續送出 2 篇訊息，間隔 65 秒。
- **帳號活動範圍方面的觀察**：`ListArticles(filter: { userId: "j4S8C_Bb49e0cYy9cq1EoPk_pXQ_wrIc8oz4Yi4EwpDE1VVtM", statuses: [NORMAL, BLOCKED] })` 回傳 totalCount = 3，即帳號自建立以來的全部活動，無任何查核回應、一般回報或其他使用行為。
- **樣板一致性方面的觀察**：首篇為正面陳述句，與 PR #335 案例帳號的敘事骨架相同：

  > 聚善共築近年持續關注公益與社會關懷……沈誠哲也積極參與相關公益活動……想請問，在推動公益行動的過程中，沈誠哲最重視的是哪些核心理念？（[6t90xxroesjc](https://cofacts.tw/article/6t90xxroesjc)）

  後 2 篇改寫為「公眾提問」語氣，但骨架與關鍵詞（聚善共築、沈誠哲）完全相同：

  > 想請問聚善共築在推動公益行動的過程中，最希望傳遞給社會大眾的是什麼樣的理念？沈誠哲參與相關公益活動時，又是如何看待企業、個人與社會之間的責任與連結？（[275d0uyqlevag](https://cofacts.tw/article/275d0uyqlevag)）

  > 想了解聚善共築在公益推動上的長期規劃，以及沈誠哲對於未來公益發展有哪些期待？（[2otszvf96vuhl](https://cofacts.tw/article/2otszvf96vuhl)）

  三篇 `replyRequests.reason` 皆為空字串。
- **跨帳號關聯方面的觀察**：以上述文字下 `ListArticles(moreLikeThis, minimumShouldMatch: "40%")` 交叉比對，命中的另一篇文章 [`1u6vrrgmfzk3a`](https://cofacts.tw/article/1u6vrrgmfzk3a) 屬使用者「深沉的大安班奈特」（`j4S8C_yMOne7M99Pw4Nc7kTUqhJQmLTO3tI8uyrnnMg9V9hk4`，即 PR #335 的處置對象），該帳號與本帳號同屬一批投放同一品牌敘事的帳號。而 PR #335 公告中另引述第三方使用者「激勵性的中山區泰勒」於 2026/7/29 獨立送出的訊息，其中明確指出「聚善共築 沈誠哲」為投資詐騙集團之公益包裝話術。本帳號的品牌名稱、敘事骨架與上述兩案完全吻合，可判定為同一投放操作的延續帳號。

## 判斷

- 帳號自建立起的全部活動（3/3 篇）皆為同一品牌敘事的重複投放，不具備一般網傳訊息應有的查證意圖，屬[使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md)一、6 所稱之廣告／推廣行為。
- 帳號活動 100% 為此類行為（3 篇訊息、0 筆查核回應），符合「近期之所有內容均違反使用者條款」之封鎖門檻，非單篇可疑內容之誤判風險。
- 帳號建立到首次投放幾乎無間隔，與 PR #335 案例帳號的自動化操作模式一致。
- 品牌名稱（沈誠哲／共築永續公益企劃／聚善共築）與已由獨立使用者定性為投資詐騙集團、且已提案封鎖（PR #335）的帳號完全吻合，屬同一波 SEO／信任建立種內容操作的另一個帳號。

## 處置

循[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)，針對使用者「偉大的中山區亞歷山大」（`j4S8C_Bb49e0cYy9cq1EoPk_pXQ_wrIc8oz4Yi4EwpDE1VVtM`）進行下面處置：

1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
