# 2023/02/11 LINE 使用者大量送出訊息進行廣告

## 事由

2022 年 10 月起，查核協作者發現，有相當數量的、與詐騙相關的網誌連結被送進 Cofacts 真的假的資料庫：
https://g0v.hackmd.io/JPUb9EMATwGLBhgeECAskA#%E6%9C%AC%E9%80%B1%E9%81%95%E8%A6%8F%E6%AA%A2%E8%88%89

過去曾有部落格文章下，有詐騙集團留言聲稱可以追回詐騙款項的[二次詐騙](https://getdr.com/%E4%BD%A0%E6%9C%89%E8%81%BD%E9%81%8E%E3%80%8C%E4%BA%8C%E6%AC%A1%E8%A9%90%E9%A8%99%E3%80%8D%E5%97%8E%EF%BC%9F%E6%83%B3%E8%A6%81%E8%BF%BD%E5%9B%9E%E8%A2%AB%E9%A8%99%E7%9A%84%E9%8C%A2%E4%B9%9F%E5%88%A5/)，
但在 2022 年 10 月的當下，尚未有此情形，故留待觀察。

然而，此類訊息送進 Cofacts 真的假的之後，鮮有使用者二次查詢。

後續[會議記錄](https://g0v.hackmd.io/G8JKqoW6T-SpCa704awGsw#CIB-%E8%99%95%E7%90%86)有提出更多疑點。此公告關注之 LINE 使用者與其發表內容如下：
- 乂活潑的六甲葛列格乂：https://cofacts.github.io/community-builder/#/editorworks?type=2&day=365&userId=j4S8C_LO8hbMHXx2JJGkLhlrJFIE3eilJW0mu2SGJScX1D1cE
    - 將內容發表於多個部落格之後，再送進 Cofacts 真的假的。
    - 2022/10/10 開始活躍，均為輸入詐騙相關部落格文章。訊息大多僅有一人查詢。
- 有雄心壯志的車城柏格：https://cofacts.github.io/community-builder/#/editorworks?type=2&day=365&userId=j4S8C_PM1BJIZ1acF-VZZPmA9Zm8AZUZC7Va2k1uN5p8CK23k
    - 部落格發表日期與進入 Cofacts 系統之日期相同，應是發表後即來送出。
    - 多篇下分留言處會有詐騙集團張貼 LINE ID 進行二次詐騙。
    - 2022/8/10 開始活躍，均為輸入詐騙相關部落格文章。訊息大多僅有一人查詢。

> 註：Cofacts 真的假的系統不紀錄 LINE 使用者所使用的顯示名稱，而是替每個 LINE 使用者指定一個隨機產生的假名。上列之名稱即為該系統中自動產生之假名。

## 判斷

此二使用者輸入大量資訊，均非 LINE 上的轉傳訊息，應是藉 Cofacts 真的假的網站獲取流量與搜尋引擎之索引，屬廣告行為，不應存在於 Cofacts 真的假的系統之中。

惟[《Cofacts 真的假的 聊天機器人使用者條款
》](https://github.com/cofacts/rumors-line-bot/blob/master/LEGAL.md)並未針對 LINE 使用者的廣告行為進行規範，故於 2023/2/11 諮詢協作者社群意見（[Facebook](https://www.facebook.com/groups/cofacts/posts/3503763443188793)、[Slack](https://g0v-slack-archive.g0v.ronny.tw/index/channel/C2PPMRQGP/2023-02#ts-1676099658.869559)），並於同年月 14 日搜集社群意見，並無異議者。

## 處置

啟用 Cofacts 反 SEO Spam 機制，循[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)隱藏「乂活潑的六甲葛列格乂」與「有雄心壯志的車城柏格」所提交之內容，包含：

- 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
- 隱藏此使用者的所有「可疑訊息」、「補充」、與「評價」。


