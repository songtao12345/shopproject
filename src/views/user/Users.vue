<template>
    <div class="user">
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/users">用户管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片内容区域 -->
        <el-card class="box-card" shadow="hover">
            <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容"  class="input-with-select" v-model="query" clearable @clear="getUser">
                <el-button slot="append" icon="el-icon-search" @click="getUser"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
            </el-col>
            </el-row>
        <!-- 用户列表区域 -->、
        <el-table :data="userList" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态">
                <!-- <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template> -->
                <template v-slot="scope">
                     <el-switch v-model="scope.row.mg_state" 
                       active-color="#13ce66" inactive-color="#ff4949" @change="statusChange(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.id)"></el-button>
                    
                    <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false" >
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="assignRole(scope.row)"></el-button>
                    </el-tooltip>

                </template>
            </el-table-column>
        </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="pagenum"
            :page-sizes="[1, 2, 5, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

        </el-card>

        <!-- 添加用户区域 -->
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addFormClose">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改用户区域 -->

        <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
        <el-form :model="editForm" :rules="rules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配权限 -->
        <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="30%" @close="roleClose">
        <div>
            <p>当前的用户:  {{userInfo.username}}</p>
            <p>当前的角色:  {{userInfo.role_name}}</p>
            <p>分配新角色:
                <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                </el-option>
                </el-select>    
            </p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="roleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="savaRoleInfo">确 定</el-button>
        </span>
        </el-dialog>
        
    </div>
</template>

<script>
import {getUserList, changeUserList, addUserList, getUserInfo, editUser, deleteUser} from 'network/userlist'
import {getRolesList, assignRoles} from 'network/rightslist'
export default {
    name: 'Users',
    methods: {
        roleClose() {
            this.selectedRoleId = ''
            this.userInfo = {}
        },
        savaRoleInfo() {
            assignRoles(this.userInfo.id,this.selectedRoleId).then(res => {
                if(res.meta.status !== 200) return this.$message.error('分配角色失败')
                this.$message.success('分配角色成功')
                this.getUser()
            })
           this.roleDialogVisible = false
        },
        // 分配权限
        assignRole(userInfo) {
            this.userInfo = userInfo
            console.log(this.userInfo)
            // 获取所有角色列表
            getRolesList().then(res => {
                console.log(res)
                if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
                this.rolesList = res.data
            })

            this.roleDialogVisible = true
           
        },
        // 删除对话框显示内容
        deleteDialog(id) {
           
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',
            type: 'warning'}).then(() => {
                 // 发送删除请求
                  console.log(id)
                deleteUser(id).then(res=> {
                    console.log(res)
                    if(res.meta.status !== 200) return
                    this.getUser()
                    this.$message({type: 'success',message: '删除成功'})
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //提交表单的域验证
        editUserInfo() {
            this.$refs.addFormRef.validate(valid => {
                console.log(valid)
                if(!valid) return
                // 发起网络请求
                editUser(this.editForm.id,this.editForm.email,this.editForm.mobile).then(res=>{
                    console.log(res)
                    if(res.meta.status !== 200) return this.$message.error('更新用户信息失败')
                    //更新成功 ,关闭对话框,刷新列表
                    this.editDialogVisible = false
                    this.getUser()
                    this.$message.success('更新用户信息成功')

                })
            })
        },
        editDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        editDialog(id) {
            getUserInfo(id).then(res=>{
                console.log(res)
                this.editForm = res.data
            })

            this.editDialogVisible = true
        },
        addUser() {
            this.$refs.addForm.validate(valid => {
                console.log(valid)
                if(!valid) return
                // 发起添加用户的网络请求
                 addUserList(this.addForm.username,this.addForm.password,this.addForm.email,this.addForm.mobile).then(res=> {
                     console.log(res)
                     if(res.meta.status !== 201) return this.$message.error('添加用户失败')
                     this.$message.success('添加用户成功')
                     this.dialogVisible = false

                 })
       
            })
        },
        addFormClose() {
            this.$refs.addForm.resetFields()
        },
        handleSizeChange(newSize){
            // console.log('--'+ newSize)
            this.pagesize = newSize
            this.getUser()

        },
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.pagenum = newPage
            this.getUser()
        },
        getUser() {
            getUserList(this.query,this.pagenum,this.pagesize).then(res => {
            // console.log(res.data.users)
            if(res.meta.status !== 200) return this.$message.error("获取用户列表失败")
            this.userList = res.data.users
            this.total = res.data.total
          })
        },
        statusChange(userInfo) {
            console.log(userInfo.id,userInfo.mg_state)
            changeUserList(userInfo.id,userInfo.mg_state).then(res => {
                console.log(res)
                if(res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    this.$message.error("更新用户列表失败")
                }
                this.$message.success('更新用户列表成功')
            })
        }

        
        
    },
    data() {
        return {
            query: '',
            pagenum: 1,
            pagesize: 5,
            userList: [],
            rolesList: [],
            editForm: {},
            total: 0,
            dialogVisible: false,
            editDialogVisible: false,
            roleDialogVisible: false,
            userInfo: {},
            selectedRoleId: '',
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { 
                    //   pattern: /^0{0,1}(1[345789][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
                      pattern: /^1[3-9]\d{9}$/,
                      message: '手机号格式不对',trigger: 'blur'
                    }
                    
                ]
                    
                
            }

            

        }
    },
    created() {
        // getUserList(this.query,this.pagenum,this.pagesize).then(res => {
        //     console.log(res.data.users)
        //     if(res.meta.status !== 200) return this.$message.error("获取用户列表失败")
        //     this.userList = res.data.users
        //     this.total = res.data.total
        // })
        this.getUser()
    }
}
</script>

<style scoped>

</style>