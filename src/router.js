//引入vue
import Vue from 'vue';

//引入vue-router
import VueRouter from 'vue-router';

//第三方库需要use一下才能使用
Vue.use(VueRouter);

import space from './components/space.vue';

import test from './components/test.vue';

import light from './components/light';

import myTest from './components/mytest';

//定义路由集合 数组类型
const routes = [
    //单个路由均为对象类型， path代表的是路径，conponent代表组件
    {path: '/space' , component: space},
    {path: '/test' , component: test},
    {path: '/light' , component: light},
    {path: '/mytest' , component: myTest},
    {path: '' , redirect: 'mytest'},
];

//实例化vuerouter并将routes添加进去
const router = new VueRouter({
    routes
});

//抛出这个实例对象方便外部读取以及访问
export default router;