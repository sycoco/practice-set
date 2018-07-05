# ccms-icons
数据赢家 icons

将所有的 icons 从 ccms-components 分离出来, 这样加新 icon 时, 就不用升级组件库了.

#### 说明

如果工程中使用的是 v2.22.3-0 之前的版本, 需要手动引入 ccms-icons

```js
npm install ccms-icons --save
```

在工程中的主 scss 文件中引入 _iconfont.scss, 如下, 注意路径和引入顺序:
```scss
@import "../../node_modules/ccms-icons/iconfont";
```

如果是 v2.22.3-0(包括v2.22.3-0) 之后的版本, 则无需手动引入 ccms-icons
