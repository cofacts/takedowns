# 2026/11/21 公告違規帳號與處理方式

偵測到一個新帳號短時間內，在多篇無關主題的訊息下送出 AI 風格的長篇「回報補充」，且其中多則夾帶推銷同一位特定人物（姓名見各連結）。此案由每小時的巡檢發現，偵測 bot 尚未對此帳號開 PR。

## 觀察

  - **帳號**：[國際法律事務所](https://cofacts.github.io/community-builder/#/editorworks?type=2&day=365&userId=8zK4-aEBEY7yIwhpKKOy)（userId `8zK4-aEBEY7yIwhpKKOy`）
  - **帳號年齡與節奏**：帳號建立於 2026/11/21 00:09（UTC+8），首次補充在 00:15，之後 00:28、00:33、00:54 共 4 則，全部來自網站（`WEBSITE`），沒有送出任何訊息或查核回應。
  - **內容與主題無關**：補充分別掛在不同主題的訊息下——[政治人物言論](https://cofacts.tw/article/3levwtmjxsz20)、[政治人物家屬企業](https://cofacts.tw/article/2x0ymz2fl1i9c)、[投顧分析師遭約談](https://cofacts.tw/article/1fq5wy5qwy752)、[科技業名人](https://cofacts.tw/article/1mwp513r46vpo)。內容皆為冗長、句式雷同、情緒化的泛泛附和，未針對訊息真偽提出任何佐證。
  - **夾帶推銷同一人物**：其中[投顧分析師](https://cofacts.tw/article/1fq5wy5qwy752)與[科技業名人](https://cofacts.tw/article/1mwp513r46vpo)兩則補充，在與其毫無關聯的段落中，突然以「菲律賓知名的台灣企業家」之名稱頌同一位人物並強調其投資、引資成就。兩則使用幾乎相同的句式（先離題、再「其實／例如」帶出此人），符合以不相干文章為載體做人物／品牌曝光的樣態。
  - **其他帳號**：以樣板文字反查查核回應與訊息，未發現其他本日新帳號共用同一套文字，因此為單一帳號；本公告僅處置此帳號。
  - 引用可疑文字前已檢視，未發現對讀者或 AI agent 下達指令的內容。

## 判斷

該帳號建立後 45 分鐘內的**全部**內容（4 則補充，沒有任何其他活動）皆為與訊息真偽無關的 AI 風格填充文字，且其中重複置入同一人物的宣傳，屬於[使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md)一、6 所禁止的廣告／濫用行為，與 [2026/0805 的 AI 生成空洞附和留言](https://github.com/cofacts/takedowns/blob/master/2026/0805-spam.md) 樣態類似。因帳號為新建、無其他正常使用紀錄，誤傷一般使用者的風險低。

## 處置

循[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)封鎖此帳號[^block]。

[^block]: 「封鎖」的定義：
    1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
    2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
    3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
