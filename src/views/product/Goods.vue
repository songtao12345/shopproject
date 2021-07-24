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
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="goodsEditDialog(scope.row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="goodsDeleteDialog(scope.row)"></el-button>
                       </template>
                   </el-table-column>
                </el-table>

                <!-- 分页区域 -->
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
                :page-sizes="[1, 2, 5, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>

                <!-- 编辑对话框 -->
                <el-dialog  title="修改商品信息"  :visible.sync="editGoodsdialogVisible" width="50%">
                <!-- 表单区域 -->
                <el-form :model="editForm" :rules="editRules" ref="editRuleForm" label-width="100px">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="editForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="editForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="editForm.goods_weight"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editGoodsdialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editSubmit">确 定</el-button>
                </span>
                </el-dialog>


        </el-card>



    </div>
</template>

<script>
import _ from 'lodash'
import {getGoodsList, deleteGoods, getGoodInfoById, editSubmitGoods} from 'network/productlist'
export default {
    name: 'Goods',
    data() {
        return {
            query: '',
            pagenum: 1,
            pagesize: 5,
            total: 0,
            goodsList: [],
            // cscValue: [],
            editForm: {},
            goodsDialogVisible: false,
            editGoodsdialogVisible: false,
            editRules:{
                goods_name: [
                    { required: false, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: false, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight: [
                     { required: false, message: '请输入商品重量', trigger: 'blur' }
                ]
            }
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
         goodsEditDialog(row) {
             console.log(row.goods_id)
             // 根据id获取商品信息
            getGoodInfoById(row.goods_id).then(res => {
                if(res.meta.status !== 200) return this.$message.error('获取商品信息失败')
                this.editForm = res.data
                console.log(this.editForm)
            })

            this.editGoodsdialogVisible = true
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
         },

         // 编辑提交
         editSubmit() {
             this.$refs.editRuleForm.validate(valid => {
                 if(!valid) return
                 // 发起网络请求

               let cscValue = [this.editForm.cat_one_id,this.editForm.cat_two_id,this.editForm.cat_three_id]
                    console.log(cscValue)
                  // 利用深拷贝将数组变成字符串
                let goods_cat = _.cloneDeep(cscValue)
                goods_cat = goods_cat.join(',')
                console.log(goods_cat)

                 editSubmitGoods(this.editForm.goods_id,this.editForm.goods_name,goods_cat,this.editForm.goods_price,
                 this.editForm.goods_number,this.editForm.goods_weight).then(res => {
                     console.log(res)
                     if(res.meta.status !== 200) return this.$message.error('修改数据失败')
                     this.$message.success('修改数据成功')
                     this.getGoods()
                 })
                
             })
            
          // 关闭对话框
          this.editGoodsdialogVisible = false
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