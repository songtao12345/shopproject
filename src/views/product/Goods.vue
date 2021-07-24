<template>
    <div class="Goods">
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                     <el-input clearable @clear="getGoods" placeholder="请输入内容" v-model="query" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
                    </el-input>  
                </el-col>
                 <el-col :span="4">
                <el-button type="primary" @click="goAddGoods">添加商品</el-button>
                 </el-col>
            </el-row>
                <!-- 列表区域 -->
                <el-table :data="goodsList" stripe style="width: 100%" border>
                   <el-table-column type="index" label="#"></el-table-column>
                   <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
                   <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
                   <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
                   <el-table-column prop="add_time" label="创建时间" width="140px">
                       <template slot-scope="scope">
                           {{scope.row.add_time | dateFormat}}
                       </template>
                   </el-table-column>
                   <el-table-column  label="操作" width="130px">
                       <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="goodsEditDialog(scope.row.id)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="goodsDeleteDialog(scope.row)"></el-button>
                       </template>
                   </el-table-column>
                </el-table>

                <!-- 分页区域 -->
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
                :page-sizes="[1, 2, 5, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>


        </el-card>



    </div>
</template>

<script>
import {getGoodsList, deleteGoods} from 'network/productlist'
export default {
    name: 'Goods',
    data() {
        return {
            query: '',
            pagenum: 1,
            pagesize: 5,
            total: 0,
            goodsList: [],
            goodsDialogVisible: false
        }
    },
    methods: {
        getGoods() {
            getGoodsList(this.query,this.pagenum,this.pagesize).then(res => {
                console.log(res)
                if(res.meta.status !== 200) return this.$message.error('获取商品列表失败')
                this.goodsList = res.data.goods
                this.total = res.data.total
            })
        },
         // 编辑
         goodsEditDialog(id) {
             console.log(id)
         },
         //删除
         goodsDeleteDialog(row) {
             this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',
            type: 'warning'}).then(() => {
                 // 发送删除请求
                    console.log(row.goods_id)
                    deleteGoods(row.goods_id).then(res=> {
                    console.log(res)
                    if(res.meta.status !== 200) return this.$message.error('删除失败')
                    this.$message.success('删除成功')
                    this.getGoods()
                   
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
         },

         handleSizeChange(newSize) {
            //  console.log(newSize)
             this.pagesize = newSize
             this.getGoods()
         },
         handleCurrentChange(newPage) {
            //  console.log(newPage)
             this.pagenum = newPage
             this.getGoods()
         },
         //添加商品
         goAddGoods() {
             this.$router.push('/goods/add')
         }
         
        


    },
    created() {
        this.getGoods()
    }
}
</script>

<style scoped>
.el-row {
    margin-bottom: 10px;
}
.el-pagination {
    margin-top: 10px;
}
</style>