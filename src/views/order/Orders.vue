<template>
    <div class="Orders">
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                      <el-input placeholder="请输入内容" v-model="query" class="input-with-select" clearable @clear="getOrder">
                        <el-button slot="append" icon="el-icon-search" @click="getOrder"></el-button>
                      </el-input>
                </el-col>
            </el-row>
             <!-- 列表区域 -->
            <el-table :data="orderlist" style="width: 100%" stripe border>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="order_number" label="订单编号" ></el-table-column>
            <el-table-column prop="order_price" label="订单价格" ></el-table-column>
            <el-table-column  label="是否付款" >
                <template prop="pay_status" slot-scope="scope" >
                    <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
                    <el-tag v-else type="success">已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" ></el-table-column>
            <el-table-column prop="create_time" label="下单时间" >
                <template slot-scope="scope">
                    {{scope.row.create_time | dateFormat}}
                </template>
            </el-table-column>
             <el-table-column  label="操作" >
                 <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="orderEditDialog(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-location" size="mini" @click="orderProgessDialog(scope.row)"></el-button>
                 </template>
             </el-table-column>
            </el-table>

            <!-- 分页区域 -->
             <el-pagination  @size-change="orderHandleSizeChange" @current-change="orderHandleCurrentChange" :current-page="pagenum" 
             :page-sizes="[1, 2, 5, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <!-- 编辑对话框 -->
            <el-dialog  title="修改地址"  :visible.sync="editOrdersdialogVisible" width="50%" @close="orderClose">
                <!-- 表单 -->
                <el-form :model="editForm" :rules="rules" ref="orderRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="省市区/县" prop="address1">
                      <el-cascader  v-model="editForm.address1" :options="cityData"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input></el-input>
                </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editOrdersdialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editSubmit">确 定</el-button>
                </span>
                </el-dialog>
            <!-- 物流对话框 -->
            <el-dialog title="查询物流信息" :visible.sync="progessDialogVisible"  width="50%">
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item  v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
            <span slot="footer" class="dialog-footer">
                <el-button @click="progessDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="progessDialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import {getOrderList, getProgessInfo} from 'network/orderlist'
import cityData from './citydata'
export default {
    name: 'Orders',
    data() {
        return {
            query: '',
            pagenum: 1,
            pagesize: 5,
            orderlist: [],
            progressInfo: [
                 {
                    "time": "2018-05-10 09:39:00",
                    "ftime": "2018-05-10 09:39:00",
                    "context": "已签收,感谢使用顺丰,期待再次为您服务",
                    "location": ""
                    },
                    {
                    "time": "2018-05-10 08:23:00",
                    "ftime": "2018-05-10 08:23:00",
                    "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    "location": ""
                    },
                    {
                    "time": "2018-05-10 07:32:00",
                    "ftime": "2018-05-10 07:32:00",
                    "context": "快件到达 [北京海淀育新小区营业点]",
                    "location": ""
                    },
                    {
                    "time": "2018-05-10 02:03:00",
                    "ftime": "2018-05-10 02:03:00",
                    "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 23:05:00",
                    "ftime": "2018-05-09 23:05:00",
                    "context": "快件到达 [北京顺义集散中心]",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 21:21:00",
                    "ftime": "2018-05-09 21:21:00",
                    "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 13:07:00",
                    "ftime": "2018-05-09 13:07:00",
                    "context": "顺丰速运 已收取快件",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 12:25:03",
                    "ftime": "2018-05-09 12:25:03",
                    "context": "卖家发货",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 12:22:24",
                    "ftime": "2018-05-09 12:22:24",
                    "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                    "location": ""
                    },
                    {
                    "time": "2018-05-08 21:36:04",
                    "ftime": "2018-05-08 21:36:04",
                    "context": "商品已经下单",
                    "location": ""
                    }
            ],
            cityData: cityData,
            total: 0,
            editForm: {
                address1: [],
                address2: ''
            },
            editOrdersdialogVisible: false,
            progessDialogVisible: false,
            rules:{
                address1: [
                     { required: true, message: '请选择省市区/县', trigger: 'blur' }
                ],
                address2: [
                     { required: true, message: '请输入详细地址', trigger: 'blur' }
                ]
            },

        }
    },
    methods: {
        getOrder() {
            getOrderList(this.query,this.pagenum,this.pagesize).then(res => {
                // console.log(res.data)
                console.log(this.query)
                if(res.meta.status !== 200) return this.$message.error('获取列表数据失败')
                this.orderlist = res.data.goods
                this.total = res.data.total
                console.log(this.orderlist)
            })
        },

        orderHandleSizeChange(newSize) {
            console.log(newSize)
            this.pagesize = newSize
            this.getOrder()
        },
        orderHandleCurrentChange(newPage) {
            console.log(newPage)
            this.pagenum = newPage
            this.getOrder()
        },

        orderEditDialog(row) {
            this.editOrdersdialogVisible = true
            console.log(row.order_id)

        },
        orderProgessDialog(row){
            this.progessDialogVisible = true
            console.log(row.order_id)
            // 获取物流信息  接口有问题
            // getProgessInfo().then(res => {
            //     console.log(res)
            // })
           
            
        },
        editSubmit() {

        },
        orderClose() {
            this.$refs.orderRuleForm.resetFields()
        }

        

    },
    created() {
        this.getOrder()
    }
}
</script>

<style scoped>
@import '~plugins/timeline/timeline.css';
@import '~plugins/timeline-item/timeline-item.css';
.el-pagination {
    margin-top: 10px;
}
</style>