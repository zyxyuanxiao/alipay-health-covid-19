# "健康申报助手"支付宝小程序
支付宝搜索"健康申报助手"，或者用支付宝扫下方的二维码，就可以体验使用。

![支付宝小程序](/支付宝健康申报助手.png)

## 背景介绍
我是湖北人，目前在武汉创业，由于疫情原因被困在家中无法复工，想着能用一技之长为抗击疫情做点贡献，但是我一直都是从事java开发，这是我第一次开发小程序，之所以用uni-app，主要是想实现跨端开发，同时能够支持支付宝小程序和微信小程序，顺便学习下vue框架。

## 功能介绍
支付宝小程序"健康申报助手"源码，基于uni-app开发，帮助企业、社区、乡镇、园区做好新型冠状肺炎的疫情防控，包括体温登记、体温地图、健康码、出入登记等功能

个人用户可以用来每天记录自己的体温和相关症状，社区、企业、园区等机构用户可以用来管理居民或者员工的健康状态。及时了解是否有发热、咳嗽症状，同时，小程序的出入登记功能可以帮助机构用户对人员出入进行管理和登记。

## 项目结构
这个完整的支付宝小程序代码，项目结构也比较简单，主要的目录结构如下
> **common**: 主要是公用的js、css代码

> **components**: 小程序里面用到的vue组件

> **pages**: 小程序里面的页面，所有的页面都需要在pages.json进行注册，具体如何配置可以查看这里：https://uniapp.dcloud.io/collocation/pages?id=pages

> **static**: 主要是一些icon和banner图片

这里重点说明 **/common/config.js**, 小程序要运行起来，需要配置支付宝appId和服务器的地址，这里的服务器地址一定要用的https，并且域名需要在在支付宝小程序的服务器域名白名单中。
```javascript
const Errcode = {
	success: 0
}

const App = {
	appId: "支付宝小程序的appId"	
}

const Server = {
	host: "服务器的地址"
}

const StorageKey = {
	token : "token",
	userId: "userId"
}

export {Errcode, App, Server, StorageKey};
```

## 运行环境
使用的IDE工具是**HBuilder**, 可以在这里下载：https://www.dcloud.io/hbuilderx.html ，将代码git clone到本地以后，在HBuilder打开这个项目即可，具体如何使用可以参考这里：https://uniapp.dcloud.io/quickstart ，最终版本的上传和运行还是要使用支付宝官方的小程序开发工具，可以在这里下载： https://render.alipay.com/p/f/fd-jwq8nu2a/pages/home/index.html ，在支付宝开放平台注册一个支付宝小程序，然后小程序开发工具中进行关联，这样支付宝小程序能运行起来了。

## 注意事项

> 除了login请求外，其他请求都需要在请求头中带上 **Access-Token** 令牌，login请求获取的token存储在localStorage中，由于login请求比较重要，我专门写了一个login方法，具体可以查看 **/common/request.js** 中的login方法。

> 为了统一处理**Access-Token**，对get、post请求都做了封装，分为四个常用的方法 **getWithToken**、**getWithoutToken**、**postWithToken**、**postWithoutToken**，比如login请求使用**postWithoutToken**方法，这四个方法均在 **/common/request.js** 中。

> 在小程序中有很多页面需要进行分享或者扫码二维码打开，对于这类页面的处理需要特别注意，该页面需要区分是分享进来、扫二维码进来还是小程序内部跳转进来，如果分享进来或者扫二维码进来的，则一定要保证login请求获取到token后，才能进行数据请求，否则有可能报错，为了便于区分，所有分享页面都加了一个 **action=share** 参数，由**/common/page.js**的isScanOrShareEnterPage方法统一判断。

## 如何获取后端源码
后端代码目前没有开源，时间比较多的同学，完全可以自己写后端，开发难度并不大，后端我是采用spring boot开发、mysql数据库，总共有30个接口、11张表，有需要的同学可以加我微信(下图)，请备注"github"，我可以有偿提供完整的后端代码、接口文档以及数据库表结构。

![微信](/微信.png)


## 最后
### 武汉加油，中国加油，希望我们湖北能够早日复工复产！