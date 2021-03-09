# vue-h5-template

基于vue-cli3.0+webpack 4+vant ui + sass+ rem适配方案+axios封装，构建手机端模板脚手架

#### 介绍

 1. vuecli3.0      
 2. 多环境开发       
 3. axios封装         
 4. rem适配方案        
 5. 生产环境cdn优化首屏加速
 6. babel低版本浏览器兼容
 7. 环境发布脚本

#### 多环境

这里参考了[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)  基本思路不变
在src的文件里新建config 根据不同的环境去引用不同的配置文件，不同的是在根目录下有三个设置环境变量的文件
这里可以参考vue-admin-template

#### rem适配方案

还是那句话，用vw还是用rem，这是个问题？

选用rem的原因是因为vant直接给到了这个适配方案，个人也比较喜欢这个方案

[vant](https://youzan.github.io/vant/#/zh-CN/quickstart)  