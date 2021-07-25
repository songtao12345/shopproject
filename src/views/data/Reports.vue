<template>
    <div class="Reports">
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- echarts -->
             <div id="main" style="width: 700px;height:400px;"></div>
        </el-card>

    </div>
</template>

<script>
import echarts from 'echarts'
import {getEchartsData} from 'network/datalist'
import _ from 'lodash'
export default {
    name: 'Reports',
    data() {
        return {
            options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ]
            }
        }
    },
    methods: {

    },
    mounted() {
         var myChart = echarts.init(document.getElementById('main'));
         getEchartsData().then(res => {
             console.log(res)
             if(res.meta.status !== 200) return this.$message.error('或者折线图数据失败')

           const result = _.merge(res.data,this.options)
             // 获取数据成功
             myChart.setOption(result);
         })
        

          
    }
}
</script>

<style scoped>

</style>