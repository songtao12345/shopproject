<template>
        <el-container class="container">
            <!-- 头部区域 -->
            <el-header>
                <div class="left">
                    <img src="~assets/img/doge.jpg" alt="">
                    <span>电商管理系统</span>
                </div>
                <div class="right">
                    <el-button type="info" @click="logout">退出</el-button>
                </div>  
            </el-header>
            <!-- 内容区域 -->
            <el-container>
                <el-aside :width="isCollapse ? '64px':'200px'">
                    <div class="collapse" @click="collapse">|||</div>
                     <el-menu router background-color="#545c64" text-color="#fff" 
                       active-text-color="#ffd04b" unique-opened :collapse="isCollapse" :collapse-transition='false'>
                       <!-- 一级菜单 -->
                        <el-submenu :index="item.id + ''" v-for="(item,index) in menusList" :key="index">
                            <template slot="title">
                            <i :class="iconObj[item.id]"></i> 
                            <span>{{item.authName}}</span>
                            </template>  
                            <!-- 二级菜单 -->
                            <el-menu-item :index="'/'+subItem.path" v-for="(subItem,index) in item.children" :key="index">
                                <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>

                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>

<script>
import {getMenus} from 'network/home.js'
export default {
    name: 'Home',
    data() {
        return {
            menusList: [],
            iconObj: {
              '125': 'el-icon-user',
              '103': 'el-icon-location',
              '101': 'el-icon-s-goods',
              '102': 'el-icon-s-order',
              '145': 'el-icon-s-data'
            },
            isCollapse : false
        }
    },
    created() {
        getMenus().then(res => {
            this.menusList = res.data
            // console.log(res.data)
        })
    },
    methods: {
   
    },
    methods: {
        logout() {
            this.$router.push('/login')
        },
        collapse() {
            this.isCollapse = !this.isCollapse
        }
    }
}
</script>

<style scoped>
.el-header {
    background-color: #545c64;
    display: flex;
    justify-content: space-between; 
    /* 左右贴边对齐 */
    padding-left: 0;
    align-items: center;
    color: #eee;
    font-size: 20px;
}
.el-aside {
    background-color: #545c64;
}
.el-main {
    background-color: #ddd;
}
.container {
    height: 100vh;
}

.left img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    padding: 10px;
}
.left{
    display: flex;
    align-items: center;
}
.collapse {
    color: #eee;
    background-color: #4a5064;
    line-height: 24px;
    font-size: 10px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

</style>