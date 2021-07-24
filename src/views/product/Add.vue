<template>
    <div class="add">
         <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
      <!-- 卡片内容区域 -->
    <el-card class="box-card">
        <!-- 提示区域 -->
        <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
        <!-- 步骤条 -->
        <el-steps :space="200" :active="+active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
        </el-steps>
        <!-- tabs区域 -->
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" label-position="top">
         <el-tabs v-model="active" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClick">
            <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name"> 
                    <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price" > 
                    <el-input v-model="addForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight"> 
                    <el-input v-model="addForm.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number"> 
                    <el-input v-model="addForm.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_number">
                    <!-- 级联选择器 -->
                     <el-cascader v-model="cscValue" :options="categoryList" :props="cscProps" @change="cscHandleChange"></el-cascader>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
                <!-- 渲染表单item项 -->
                <el-form-item :label="item.attr_name" v-for="(item) in dynamicTableData" :key="item.attr_id">
                     <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox border :label="item1" v-for="(item1,i) in item.attr_vals" :key="i"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="item.attr_name" v-for="item in staticTableData" :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
                <el-upload class="upload-demo" action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview"
                :on-remove="handleRemove"  list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
                <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                <el-button type="primary" @click="add">添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
        </el-form>


    </el-card>

        <!-- 预览图片对话框 -->
        <el-dialog title="预览图片" :visible.sync="previewVisible"  width="50%">
        <img :src="previewUrl" alt="" class="previewImg">
        </el-dialog>

    </div>
</template>

<script>
import _ from 'lodash'
import { getCategoryList, addGoods } from "network/productlist";
import {getParamsList} from 'network/paramslist'
export default {
    name: 'Add',
    data() {
        return {
            active: '0',
            categoryList: [],
            cscValue: [],
            dynamicTableData: [],
            staticTableData: [],
            previewVisible: false,
            previewUrl: '',
            flag: true,
            activeName: "many",
            cscProps: {
                expandTrigger: "hover",
                value: "cat_id", // 选中的值
                label: "cat_name", // 看到的值
                children: "children", // 实现父子节点的嵌套
            },
            addForm: {
                goods_name: '测试',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                pics: [],
                goods_introduce: '',
                attrs: []
            },
            addRules: {
                goods_name: [
                     { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ]
            },
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            }
        }
    },
    methods: {
        getCategory() {
        getCategoryList(this.queryInfo).then((res) => {
            console.log(res)
            if (res.meta.status !== 200) return;
            this.categoryList = res.data;
        });
        },
        cscHandleChange() {
            console.log(this.cscValue)
            if(this.cscValue.length !== 3) {
                this.cscValue = []
            }
        },
        beforeTabLeave(activeName,oldActiveName) {
            this.$refs.addFormRef.validate(valid => {
                if(oldActiveName === '0' && this.cscValue.length !== 3) {
                this.$message.error('请选择商品分类')
                return this.flag = false
                }       
                return this.flag = valid
            })
            return this.flag
        },
        
        tabClick() {
            console.log(this.active)
            if(this.active === '1'){
                console.log('动态参数面板')
                getParamsList(this.cateId, 'many').then(res => {
                    // console.log(res)
                    res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                        
                    })
                    if(res.meta.status !== 200) return
                    this.dynamicTableData = res.data
                    console.log(this.dynamicTableData)
                })
            }else if(this.active === '2') {
                console.log('静态属性面板')
                  getParamsList(this.cateId, 'only').then(res => {
                    // console.log(res)
                    // res.data.forEach(item => {
                    // item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    // })
                    if(res.meta.status !== 200) return
                    this.staticTableData = res.data
                    console.log(this.staticTableData)
                })

            }
        },
        // 图片预览事件
        handlePreview(file) {
           this.previewVisible = true
           this.previewUrl = file.response.data.url
           console.log(this.previewUrl)
        },
        //图片移除事件
        handleRemove(file) {  
            //删除图片的路径
            const filePath = file.response.data.tmp_path
            // console.log(filePath)
            //从数组找出该索引值
           const i = this.addForm.pics.findIndex(x => {
               console.log(x.pic)
               return x.pic === filePath
           })
            // console.log(i)

            // 调用数组的splice 方法
            this.addForm.pics.splice(i,1)
            // console.log(this.addForm)
        },

        handleSuccess(res) {
            // console.log(res)
            // 拼接一个图片信息对象
            const picInfo = {pic: res.data.tmp_path}
            //将图片信息push到pics数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm)
        },
        // 添加商品
        add()  {
            console.log(this.addForm)
            this.$refs.addFormRef.validate(valid => {
                if(!valid) return
                // 利用深拷贝将数组变成字符串
                let goods_cat = _.cloneDeep(this.cscValue)
                goods_cat = goods_cat.join(',')
                console.log(goods_cat)
                // 处理动态参数
                // console.log(this.dynamicTableData)
                this.dynamicTableData.forEach(item => {
                    // console.log(item)
                    const newInfo = {attr_id: item.attr_id,attr_value: item.attr_vals.join(' ')}
                    this.addForm.attrs.push(newInfo)
                })
                //处理静态属性
                this.staticTableData.forEach(item => {
                    const newInfo = {attr_id: item.attr_id,attr_value: item.attr_vals}
                    this.addForm.attrs.push(newInfo)
                    // console.log(item)
                })
                console.log(this.addForm)

                //校验成功,发起请求

                addGoods(this.addForm.goods_name,goods_cat,this.addForm.goods_price,
                this.addForm.goods_number,this.addForm.goods_weight,this.addForm.goods_introduce,
                this.addForm.pic,this.addForm.attrs).then(res => {
                    console.log(res)
                    if(res.meta.status !== 201) return this.$message.error('创建商品失败')
                    this.$message.error('创建商品成功')
                    this.$router.push('/goods')
                })
            })
        }


    },
    created() {
        this.getCategory()
    },
    computed: {
         // 获取三级分类 ID
    cateId() {
      if (this.cscValue.length === 3) {
        return this.cscValue[2];
      }
      return null;
    }
    }

}
</script>

<style scoped>
.el-steps {
    margin: 15px 0;
}
.el-step__title {
    font-size: 13px;
}
.el-checkbox {
    margin: 0 10px 0 0 !important;
}
.previewImg {
    width: 100%
}

.el-button {
    margin-top: 10px;
}
</style>