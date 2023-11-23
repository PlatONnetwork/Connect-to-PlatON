钱包 App 内部浏览器 ios

|                        | 成功      | 拒绝             | 重复添加 | app 反馈情况                 |
| ---------------------- | --------- | ---------------- | -------- | ---------------------------- |
| Metamask(v7.10.0)      | true      | Error code: 4001 | true     | 成功时有反馈                 | done
| Bitget(v8.5.1)         | ''        | ''               | N/A      | 成功、重复添加时有反馈       |
| tp wallet(v2.1.6)      | true      | 'User cancel'    | true     | 无反馈                       |
| okx(v6.41.0)           | undefined | Error code: 4001 | N/A      | 成功有反馈，重复添加会报失败 |
| coinbase(v28.68.0)     | true      | false            | ?        | 重复添加会报失败             |
| coin98(v14.1.5)        | ？        | Error code: 4001 | ?        | 无反馈，当做不支持           |

| trust(v10.1)(链不支持) | 无返回值  | 无返回值         | 无返回值 | 重复添加时有反馈             |
| imToken(v2.13.5)       | N/A       | N/A              | N/A      | N/A                          | 不支持添加
| particle(v1.0.5)       | N/A       | N/A              | N/A      | N/A                          |



钱包 App 内部浏览器 android

|                         | 成功 | 拒绝                   | 重复添加 | app 反馈情况            |
| ----------------------- | ---- | ---------------------- | -------- | --------------------- |
| Metamask                | true | Error code: 4001       | true     | 成功时有反馈           |  done
| Bitget(v8.6.0)          | ''   | ''                     | N/A      | 成功、重复添加时有反馈  |
| tp wallet(v1.9.0)       | true | 'cancel'               | N/A      | 重复添加时有反馈       |
| okx(v6.41.0)            | true | false                  | true     | 成功、重复添加有反馈   |
| coinbase(v28.68.0)      | true | false/Error code: 4001 | ?        | 重复添加会报失败       |
| coin98(v14.1.5)         | ?    | Error code: 4001       | ?        | 无反馈，当做不支持     |

| trust(v8.2.7)(链不支持) | ?    | ?                      | ?        | 重复添加时有反馈        |
| particle(v1.0.5)        | N/A  | N/A                    | N/A      | N/A  不支持添加       |
| imToken                 | N/A  | N/A                    | N/A      | N/A  不支持添加       |   



web 端浏览器插件或网页

|               | 成功      | 拒绝               | 重复添加           |   都是true 无法判断是否是第一次添加还是反复添加
| ------------- | --------- | ------------------ | ------------------ |
| Metamask      | true      | Error code: 4001   | true               | done
| trust         | undefined | Error code: 4001   | Error code: -32602 | done
| tp wallet     | true      | false              | true               | done(reject 返回居然也是true,在切换网络时, 明明查看已经切换成功, 但是还是会报错, 切换网络再添加代币过程会中断, 也没有气泡显示, 需要再点击一下界面, 会提示)
| okx           | true      | Error code: 4001   | true               | pending
| coinbase      | true      | false              | true               | 添加货币没有在插件显示, 提示是成功了
| coin98        | true      | Error code: 4001   | true               | custom token比较难找, 无法添加dev网络
| Bitget        | ？        | Error code: -32603 | N/A                | 每次添加需要提示一次添加网络,需要手动再添加一次

| imToken       | N/A       | N/A                | N/A                |
| particle      | N/A       | N/A                | N/A                |
| unipass       | N/A       | N/A                | N/A                |
| walletConnect | N/A       | N/A                | N/A                |
