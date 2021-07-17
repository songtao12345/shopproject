<template>
    <div class="right">
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片内容区域 -->
        <el-card class="box-card">
            <!-- 列表区域 -->
            <el-table :data="rightsList"  stripe style="width: 100%" border>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
            <el-table-column prop="path" label="路径" width="180"></el-table-column>
            <el-table-column prop="level" label="权限等级">
                <template slot-scope="scope">
                    
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <!-- <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="pagenum"
            :page-sizes="[1, 2, 5, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination> -->
        </el-card>


    </div>
</template>

<script> 
import {getRightsList} from 'network/rightslist'
export default {
    name: 'Rights',
    data() {
        return {
            rightsList: [],
            pagenum: 1,
            pagesize: 5,
            total: 0
        }
    },
    methods: {
        getRightsListInfo() {
            getRightsList(this.pagenum,this.pagesize).then(res => {
                console.log(res)
                if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
                this.rightsList = res.data
                this.total = res.data.length
            })
        },
        handleSizeChange(newSize) {
            console.log(newSize)
            this.pagesize = newSize
            this.getRightsListInfo()
        },
        handleCurrentChange(newPage) {
            console.log(newPage)
             this.pagenum = newPage
             this.getRightsListInfo()
        }
    },
    created() {
        this.getRightsListInfo()
        // getRightsList().then(res=>console.log(res))
    }
}
</script>

<style scoped>

</style>