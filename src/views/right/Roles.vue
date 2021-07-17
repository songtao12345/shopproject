<template>
    <div class="roles">
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片内容区域 -->
        <el-card class="box-card">
            <el-button type="primary" @click="addRole">添加角色</el-button>
            <el-table :data="rolesList" stripe style="width: 100%" border >
            <el-table-column  type="expand">
                <template slot-scope="scope">
                    <el-row v-for="(item1) in scope.row.children" :key="item1.id">
                        <!-- 一级权限 -->
                        <el-col :span="5">
                          <el-tag closable  @close="removeRights(scope.row,item1.id)">{{item1.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 二三级权限 -->
                        <el-col :span="19">
                           <el-row v-for="(item2) in item1.children" :key="item2.id">
                               <el-col :span="6">
                                   <el-tag type="success" closable @close="removeRights(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                   <i class="el-icon-caret-right"></i>
                               </el-col>
                               <el-col :span="13">
                                   <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRights(scope.row,item3.id)">{{item3.authName}}</el-tag>
                               </el-col>
                           </el-row>
                        </el-col>
                    </el-row>
                    <!-- <pre>
                         {{scope.row}}
                    </pre> -->  
                </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" ></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column  label="操作" >
                <template slot-scope="scope"> 
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="rolesEditDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="rolesDeleteDialog(scope.row.id)">删除</el-button>
                    <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="assignRights(scope.row)">分配权限</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            </el-table>
        </el-card>

         <!-- 添加用户区域 -->
        <el-dialog title="添加角色" :visible.sync="rolesDialogVisible" width="50%">
            <el-form :model="addRoles" :rules="rules" ref="addRoles" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoles.roleDesc"></el-input>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="rolesDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRolesInfo">确 定</el-button>
        </span>
        </el-dialog>

         <!-- 修改角色区域 -->
          <el-dialog title="修改角色信息" :visible.sync="editRolesDialogVisible" width="50%">
        <el-form :model="editRoles" :rules="rules" ref="addRolesRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoles.roleName" disabled></el-input>
        </el-form-item>
         <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editRolesDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRolesInfo">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配权限 -->
        <el-dialog title="分配权限" :visible.sync="showRightsdialogVisible" width="50%" @close="assignRightsClose" >
        <el-tree :data="rightsList" :props="rightsProps" 
                 show-checkbox node-key="id" default-expand-all :default-checked-keys="checkedKeys" ref="assignRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showRightsdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="assignRightsDialog">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
import {getRolesList, addRolesList, getRolesInfo, editRoles, 
        deleteRoles, deleteRolesRight, getRoleAllRights, assignRoleRights} from 'network/rightslist'
export default {
    name: 'Roles',
    data() {
        return {
            rolesList: [],
            roleId: '',
            rolesDialogVisible: false,
            editRolesDialogVisible: false,
            showRightsdialogVisible: false,
            editRoles: {},
            rightsList: [],
            checkedKeys: [],
            rightsProps: {
                children: 'children',
                label: 'authName'
            },
            addRoles: {
                roleName: '',
                roleDesc: ''
            },
            rules: {
                roleName: [
                     { required: false, message: '请输入角色名', trigger: 'blur' },
                     { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: false, message: '请输入角色名', trigger: 'blur' },
                ]

            }
        }
    },
    methods: {
        addRole() {
            this.rolesDialogVisible = true
            this.$refs.addRoles.resetFields()
        },
        getRoles() {
            getRolesList().then(res=>{
                // console.log(res)
                if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
                this.rolesList = res.data
            })
        },
        addRolesInfo() {
            this.$refs.addRoles.validate(valid => {
                // console.log(valid)
                if(!valid) return
                 //发起添加用户的网络请求
                 addRolesList(this.addRoles.roleName,this.addRoles.roleDesc).then(res=>{
                    //  console.log(res)
                     if(res.meta.status !== 201) return this.$message.error('添加角色信息失败')
                     this.$message.success('添加角色信息成功')
                     this.rolesDialogVisible = false
                     this.getRoles()
                 })
            })
           
        },
        rolesEditDialog(id) {
            // console.log(id)
          // 根据id获取角色信息
          getRolesInfo(id).then(res=>{
              console.log(res.data.roleName)
            //   this.editRoles.roleName = res.data.roleName
            //   this.editRoles.roleDesc = res.data.roleDesc
              this.editRoles = res.data
              this.editRoles.id = id
          })
          this.editRolesDialogVisible = true
        },
        editRolesInfo() {
            // console.log(this.editRoles.id,this.editRoles.roleName,this.editRoles.roleDesc)
            // 发起编辑用户网络请求
            editRoles(this.editRoles.id,this.editRoles.roleName,this.editRoles.roleDesc).then(res => {
                // console.log(res)
                if(res.meta.status !== 200) return this.$message.error('编辑用户信息失败')
                this.$message.success('编辑用户信息成功')
                this.editRolesDialogVisible = false
                this.getRoles()
            })
        },
        rolesDeleteDialog(id) {
             this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',
            type: 'warning'}).then(() => {
                console.log(id)
                 // 发送删除请求
                  deleteRoles(id).then(res => {
                      console.log(res)
                      if(res.meta.status !== 200) return this.$message.error('删除用户信息失败')
                      this.$message.success('删除用户信息成功')
                      this.getRoles()

                  })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        removeRights(role,rightId) {
            
            //弹框提示用户是否删除
            this.$confirm('此操作将永久删除该用户权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                // console.log('删除权限成功')
                // console.log(role.id,rightId)
                deleteRolesRight(role.id,rightId).then(res => {
                    // console.log(res.data)
                    if(res.meta.status !== 200) return this.$message.error('删除用户权限失败')
                    this.$message.success('删除用户权限成功')
                    role.children = res.data
                    
                })
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                });
            })
        },
        //获取该用户权限中的所有三级ID
        getThreeRightsId(role,arr) {   
                if(!role.children) {
                   return arr.push(role.id)
                }
                role.children.forEach(item => [
                    this.getThreeRightsId(item, arr)
                ])
                // console.log(arr)
            },
        //分配权限
        assignRights(role) {
            this.roleId = role.id
            this.getThreeRightsId(role,this.checkedKeys)
            this.showRightsdialogVisible = true
            //获取所有权限
            getRoleAllRights().then(res => {
                if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
                this.rightsList = res.data
                // console.log(this.rightsList)
                
            })
        },
        assignRightsClose() {
            this.checkedKeys = []
        },
        //分配权限
        assignRightsDialog() {
            const keys = [...this.$refs.assignRef.getCheckedKeys(),...this.$refs.assignRef.getHalfCheckedKeys()]
            const ridStr = keys.join(',')
            console.log(ridStr)
            //发送分配权限请求
            console.log(this.roleId)
            assignRoleRights(this.roleId,ridStr).then(res => {
                console.log(res)
                if(res.meta.status !== 200) return this.$message.error('更新权限列表失败')
                this.$message.success('更新权限列表成功')
                this.showRightsdialogVisible = false
                this.getRoles()
            })

            
        }

    },
    created() {
        this.getRoles()
    }
}
</script>

<style scoped>
.el-button {
    margin-bottom: 15px;
}
.el-tag {
    margin : 7px
}
.el-row {
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
}
</style>