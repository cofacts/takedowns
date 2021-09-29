# 0929 清除空回應

## 說明

Cofacts WG 觀察到資料庫裡有回應文字（`text` 欄位）為空的回應，如下所示：

- https://cofacts.tw/reply/r9KtXnIBb3SlMKoAVax9
- https://cofacts.tw/reply/QNLEXnIBb3SlMKoAOa_y
- https://cofacts.tw/reply/-tLIXnIBb3SlMKoAy68w
- https://cofacts.tw/reply/AdLJXnIBb3SlMKoAo7Dz
- https://cofacts.tw/reply/DtLKXnIBb3SlMKoAgbCR
- https://cofacts.tw/reply/JtLNXnIBb3SlMKoAD7BQ
- https://cofacts.tw/reply/19LSXnIBb3SlMKoAgrAu
- https://cofacts.tw/reply/3dLtX3IBb3SlMKoAGsqd
- https://cofacts.tw/reply/99LxX3IBb3SlMKoAAMq4
- https://cofacts.tw/reply/-NL0X3IBb3SlMKoAEspk
- https://cofacts.tw/reply/4JbpmXQB9w1KR1IkEwQi
- https://cofacts.tw/reply/CZmY0XQB9w1KR1Ik_cIv
- https://cofacts.tw/reply/kJzK-3QB9w1KR1IkkYXW
- https://cofacts.tw/reply/Z6hrxXUB9w1KR1IkpSdN （有出處但沒有回應文字）
- https://cofacts.tw/reply/fKhqC3cB9w1KR1IkqqDy
- https://cofacts.tw/reply/MKi97HcB9w1KR1IkT_ju
- https://cofacts.tw/reply/OKjJ7HcB9w1KR1IkfPiu
- https://cofacts.tw/reply/zqh07HcB9w1KR1Ikvvcn
- https://cofacts.tw/reply/76iD7HcB9w1KR1IkAve4
- https://cofacts.tw/reply/8KiD7HcB9w1KR1IkN_em
- https://cofacts.tw/reply/mKm-fXgB9w1KR1Iktjbt
- https://cofacts.tw/reply/SalSRHgB9w1KR1Ikqh6a
- https://cofacts.tw/reply/TkIPEXoBgBgcuemXLSUW （回應文字僅表情符號）
- https://cofacts.tw/reply/UkJBtHoBgBgcuemX5aeB
- https://cofacts.tw/reply/fkKQvnoBgBgcuemXs678
- https://cofacts.tw/reply/DKmJmHkB9w1KR1IkCMuT
- https://cofacts.tw/reply/FEKTiXoBgBgcuemXpIa7 （有出處但沒有回應文字）
- https://cofacts.tw/reply/tULJnHoBgBgcuemXvJSJ
- https://cofacts.tw/reply/NkKcVnoBgBgcuemXe1_C
- https://cofacts.tw/reply/tqkmhXkB9w1KR1Ik8bmm
- https://cofacts.tw/reply/jak0tnkB9w1KR1IkA-RU
- https://cofacts.tw/reply/UEJNvXoBgBgcuemX860s
- https://cofacts.tw/reply/qkJkM3oBgBgcuemX50Iv
- https://cofacts.tw/reply/1akatngB9w1KR1Ik8lD_
- https://cofacts.tw/reply/AUITL3oBgBgcuemXAz9t
- https://cofacts.tw/reply/DkJy0XoBgBgcuemXXbxp
- https://cofacts.tw/reply/2PRY5HsBqH8xU4Aw5stD
- https://cofacts.tw/reply/J_S6vXsBqH8xU4AwC7Lz
- https://cofacts.tw/reply/cUJjAXsBgBgcuemX_N9N （回應文字僅表情符號）
- https://cofacts.tw/reply/RkLcGnsBgBgcuemXZ_Gj （有出處但沒有回應文字）

（文字與細節請見 https://docs.google.com/spreadsheets/d/1X2myO4xyFLjBTT6UEJcPTiEy1-Z9dTn8HGUTka9WPYg/edit#gid=2080968331 ）

回應文字為空，雖然並不違反使用者條款，但也沒有留存在資料庫中的意義。再者，空的回應文字也會導致 LINE bot 出錯：https://github.com/cofacts/rumors-line-bot/issues/285

## 處理

Cofacts WG 已經在 2021/9/15 在 [Cofacts 編輯社團](https://www.facebook.com/groups/cofacts/posts/3087699461461862/) 公告希望刪除此類回應，並徵集意見。因無異議，故於 2021/9/29 刪除以上列出的回應。

Chatbot 使用者將無法看到這些回應，不過此回應仍可在下面的狀況瀏覽到：

- 直接造訪上面的回應頁面。
- 前往被回應的訊息頁面，查看被刪除的回應。
- 該回應作者自行恢復此回應。

