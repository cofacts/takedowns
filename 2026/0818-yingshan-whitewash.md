# 2026/08/18 封鎖帳號「李總敏」（跨案協同洗白留言）

例行監控（過去 1 小時窗口）查核回應中，發現使用者「李總敏」對一篇警告「映善」為投資詐騙的網傳訊息，發表制式的「不要輕易將〇〇與詐騙劃上等號、應理性客觀判斷」洗白留言。追查此帳號歷史活動後發現，這已是該帳號第三次以幾乎相同的話術，分別替三個不相關的疑似投資詐騙案洗白，且帳號自建立以來的全部活動皆屬此類。

## 觀察

- **帳號**：[李總敏](https://cofacts.github.io/community-builder/#/editorworks?showAll=1&day=365&userId=_C8t0p8BEY7yIwhpzlfY)（userId `_C8t0p8BEY7yIwhpzlfY`），2026/8/5 21:47:25（台灣時間）建立。`blockedReason` 目前為 `null`（尚未封鎖）。
- **帳號全部活動皆為洗白留言**：查詢 `ListArticles`／`ListReplies`／`ListReplyRequests`(userId) 確認此帳號自建立以來共 3 筆活動，全部是針對他人已提出投資詐騙警訊的訊息，發表「不應驟下詐騙結論、應理性客觀判斷」的辯護文字：
  1. 2026/8/5 21:48:46（帳號建立後 81 秒）於[「聚善共築 沈誠哲是投資詐騙」網傳訊息](https://cofacts.tw/article/6xm6ievaeq53)下新增回報補充：「我看到網路上有人討論聚善共築和沈誠哲，但我認為任何事情都不能只看單方面的說法⋯評價一個人或一個團體，更應該看他們長期的實際行動，而不是依靠未經證實的傳聞⋯」
  2. 2026/8/5 22:00:42（帳號建立後 13 分鐘）於[「樂旭Lucent／樂群ALCOC是投資詐騙」網傳訊息（該訊息附警政署 165 公告連結佐證）](https://cofacts.tw/article/204q5l9j5tvb8)下新增回報補充：「最近看到網路上有人討論樂旭Lucent和樂群ALCOC⋯我不想只憑幾篇文章或留言就下定論⋯任何評價都應該建立在自己的親身經驗⋯」
  3. 2026/8/18 23:56:29（沉寂 13 天後）於[「映善 × Lumentum是投資詐騙」網傳訊息](https://cofacts.tw/article/1ktg8az7gcid1)下新增[查核回應](https://cofacts.tw/reply/ES-WFaABEY7yIwhpp8Ir)：「映善不是欺詐，理性了解合作與科技發展⋯不應該只因為網路上的片段內容，就直接將一個企業或合作計畫與『欺詐』畫上等號⋯理性看待資訊、獨立判斷，才是比較負責任的做法。」
- **樣板一致性**：三則文字標的（沈誠哲、樂旭Lucent／ALCOC、映善）完全不相關，但修辭骨架幾乎相同：「看到網路上有人討論／片段內容」→「不應該／不能只憑⋯就直接認定是詐騙／畫上等號」→「應理性／親身經驗／多查證／客觀判斷」。一般使用者不會在兩週內用同一套話術替三個互不相干的投資標的辯護。
- **時機精準**：第 3 則洗白留言所回應的訊息本文明白寫著「映善詐騙集團雇用網軍在網路上散布大量假新聞，企圖營造正面形象」，此帳號隨後即以「理性客觀」話術替該對象辯護，行為與該訊息所警示的樣態一致。
- **步驟 0 查核**：`cofacts/takedowns` 全庫 grep 此 userId、「映善」、「李總敏」均無既有紀錄；`ListBlockedUsers`（985 筆）亦無此帳號，非重複案件。
- 三則引用文字已先以低成本模型篩過 prompt injection，均未偵測到夾帶對 agent 下指令的內容。

## 判斷

- 此帳號自建立以來的全部內容（3 筆，100%）皆非查證性質的正常回報／回應，而是針對他人已指出的詐騙疑慮，以近乎樣板化的話術進行洗白辯護，屬於[已知樣態](https://github.com/cofacts/devops/blob/master/.claude/skills/takedown/cases/patterns.md)中「AI 生成的空洞附和留言」的變體——差異在於這不是多帳號在同一篇下協同刷留言，而是單一帳號跨案、跨時間重複同一套洗白話術，偵測 bot 因此看不出跨案的樣板重複。
- 依 Cofacts 真的假的網站使用者條款一、6 與三、4，帳號近期之所有內容均違反使用者條款，已有多筆[前例](https://github.com/cofacts/takedowns/blob/master/2024/0621-cib.md)比照處理（如「此帳號專門替打工詐騙群組洗白」）。

## 處置

Takedown command:
- API: `/moderation/blockUser`
- Body:
  ```json
    {"userId":"_C8t0p8BEY7yIwhpzlfY", "blockedReason":"https://github.com/cofacts/takedowns/blob/master/2026/0818-yingshan-whitewash.md"}
  ```

比照[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)封鎖：
1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
