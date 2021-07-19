<template>
    <div class="Categories">
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片内容区域 -->
        <el-card class="box-card">
            <el-button type="primary" @click="addCate">添加分类</el-button>
            <!-- 表格区域 -->
            <!-- <el-table :data="categoryList" style="width: 100%">
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="cat_name" label="分类名称" width="180">
            </el-table-column>
            <el-table-column prop="cat_deleted" label="是否有效" width="180">
            </el-table-column>
            <el-table-column prop="cat_level" label="排序" width="180">
                <template slot-scope="scope">
                    <el-tag  v-if="scope.row.cat_level === 0 ">一级</el-tag>
                    <el-tag v-else-if="scope.cat_level === 1 ">二级</el-tag>
                    <el-tag v-else>三级</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template >
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </el-table-column>
            </el-table> -->

            <table-tree :data="categoryList" :columns="columns" show-index 
            index-text="#" border :selection-type="false" :expand-type="false">
                <!-- 是否有效 -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序 -->
                <template slot="cateSort" slot-scope="scope">
                    <el-tag  v-if="scope.row.cat_level === 0 ">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1 ">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="handle" slot-scope="scope"> 
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="cateEditDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="cateDeleteDialog(scope.row.cat_id)">删除</el-button>
                </template>
            </table-tree>

            <!-- 分页区域 -->
            <el-pagination @size-change="cateHandleSizeChange"  @current-change="cateHandleCurrentChange" :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类区域 -->
        <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="50%" @close="cateClose">
            <el-form :model="addCategory" :rules="rules" ref="cateRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCategory.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:" >
                   <el-cascader expand-trigger = "hover" v-model="casValue" :options="parentCateList" 
                      :props="casProps" @change="calHandleChange" clearable></el-cascader>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateForm">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改分类区域 -->
        <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="30%">
        <el-form :model="editCateForm" :rules="rules" ref="editCateForm" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="editCateForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCatedialog">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import {getCategoryList, addCategory, getCateById, editCategory, deleteCategory} from 'network/productlist'
export default {
    name: 'Categories',
    data() {
        return {
            categoryList: [],
            parentCateList: [],
            cateDialogVisible: false,
            editCateDialogVisible: false,
            casValue: [],
            editCateForm: {},
            casProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true
            },
            addCategory: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    prop: 'cat_deleted',
                    type: 'template',
                    template: 'isOk'
                },
                {
                    label: '排序',
                    prop: 'cat_level',
                    type: 'template',
                    template: 'cateSort'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'handle'
                }
            ],
            rules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        // 获取一级和二级分类列表
        getParentCateList() {
            getCategoryList(2).then(res => {
                console.log(res)
                this.parentCateList = res.data
            })
        },

        getCategory() {
            getCategoryList(this.queryInfo.type,this.queryInfo.pagenum,this.queryInfo.pagesize).then(res => {
            // console.log(res)
            this.categoryList = res.data.result
            this.total = res.data.total
        })
        },
        cateHandleSizeChange(newsize) {
            // console.log(newsize)
            this.queryInfo.pagesize = newsize
            this.getCategory()
        },
        cateHandleCurrentChange(newpage) {
            // console.log(newpage)
            this.queryInfo.pagenum = newpage
            this.getCategory()
        },
        cateClose() {
            this.$refs.cateRef.resetFields()
            this.casValue = []
            this.addCategory.cat_level = 0
            this.addCategory.cat_pid = 0
        },
        addCate() {
            // 获取父级分类的列表数据
            this.getParentCateList()
            this.cateDialogVisible = true
        },
        addCateForm() {
            console.log(this.addCategory)
            this.$refs.cateRef.validate(valid => {
                if(!valid) return
                //表单域验证通过,发送请求
                addCategory(this.addCategory.cat_pid, this.addCategory.cat_name, this.addCategory.cat_level).then(res => {
                    console.log(res)
                    if(res.meta.status !== 201) return this.$message.error('添加分类失败')
                    this.$message.success('添加分类成功')
                    this.getCategory()

                })
            })
            this.cateDialogVisible = false
        },
        calHandleChange() {
            console.log(this.casValue)
            if(this.casValue.length > 0) {
               this.addCategory.cat_pid = this.casValue[this.casValue.length-1]
               this.addCategory.cat_level = this.casValue.length
               return
            }else {
                this.addCategory.cat_level = 0
                this.addCategory.cat_pid = 0
            }
        },

        //编辑
        cateEditDialog(id) {
            console.log(id,this.addCategory.cat_name)
            getCateById(id).then(res => {
                console.log(res)
                if(res.meta.status !== 200) return
                this.editCateForm = res.data
            })
            this.editCateDialogVisible = true
        },
        //删除分类
        cateDeleteDialog(id) {
            console.log(id)
             this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteCategory(id).then(res => {
                        console.log(res)
                        if(res.meta.status !== 200) return this.$message.error('删除失败')
                        this.$message.success('删除成功')
                        this.getCategory()
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });

        },
        //  发起网络修改分类请求
        editCatedialog() {
            console.log(this.editCateForm.cat_id, this.editCateForm.cat_name)
            editCategory(this.editCateForm.cat_id, this.editCateForm.cat_name).then(res => {
                if(res.meta.status !== 200) return this.$message.error('更新失败')
                this.$message.success('更新成功')
                this.getCategory()
            })
            this.editCateDialogVisible = false
        }


    },
    created() {
        this.getCategory()
    }
}
</script>

<style scoped>
.el-pagination {
    margin-top: 10px;
}
.el-button {
    margin-bottom: 10px;
}
</style>