<template>
  <div class="Params">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card class="box-card">
      <!-- 警告区域 -->
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon>
      </el-alert>
      <!-- 商品分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类: </span>
          <!-- 级联选择器 -->
          <el-cascader v-model="cscValue" :options="categoryList" :props="casProps" @change="calHandleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addParams">添加参数</el-button>
          <!-- 动态表格区域 -->
          <el-table :data="dynamicData" stripe style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <!-- 点击切换为输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"  v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"  icon="el-icon-edit"  @click="editParams(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete"  @click="deleteParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addParams">添加属性</el-button>
          <!-- 静态属性表格区域 -->
          <el-table :data="staticData" stripe style="width: 100%">
              <!-- 展开行 -->
             <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <!-- 点击切换为输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"  v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit"  @click="editParams(scope.row.attr_id)">修改</el-button>
                <el-button type="danger"  icon="el-icon-delete" @click="deleteParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数区域 -->
    <el-dialog :title="'添加'+paramsTitle" :visible.sync="dynaticdialogVisible" width="50%" @close="paramsClose">
      <el-form :model="addParamsForm" :rules="addParamsrules" ref="paramsRuleForm" label-width="100px">
        <el-form-item :label="paramsTitle" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dynaticdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsFormList">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数区域 -->
    <el-dialog :title="'修改' + paramsTitle" :visible.sync="editdialogVisible" width="50%" @close="editDiaogClose">
    <el-form :model="editParamsForm" :rules="addParamsrules" ref="editParamsRef" label-width="100px">
        <el-form-item :label="paramsTitle" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitParams">确 定</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
import { getCategoryList } from "network/productlist";
import { getParamsList, addParams, deleteParams, getParamsById, editSubmitParams } from "network/paramslist";
export default {
  name: "Params",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      categoryList: [],
      dynamicData: [],
      staticData: [],
      cscValue: [],
      casProps: {
        expandTrigger: "hover",
        value: "cat_id", // 选中的值
        label: "cat_name", // 看到的值
        children: "children", // 实现父子节点的嵌套
      },
      activeName: "many",
      dynaticdialogVisible: false,
      editdialogVisible: false,
      editParamsForm: {},
      addParamsForm: {
        attr_name: ''
      },
      addParamsrules: {
          attr_name: [
               { required: true, message: '请输入参数名称', trigger: 'blur' },
               { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ]
      }
    };
  },
  methods: {
      handleClose(index,row) {
          console.log(index,row)
           row.attr_vals.splice(index,1)
           editSubmitParams(this.cateId, row.attr_id,row.attr_name,row.attr_sel,row.attr_vals.join(' ')).then(res => {
            console.log(res)
            if(res.meta.status !== 200) return this.$message.error('删除参数失败')
            this.$message.success('删除参数成功')
            // this.getParamsData()
        })
      },
      showInput(row) {
        row.inputVisible = true
        this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
        });
      },
    handleInputConfirm(row) {
        if(row.inputValue.trim().length === 0) {
            row.inputValue = ''
            row.inputVisible = false
        }
        //输入的有内容
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        // console.log(this.cateId, row.attr_id,row.attr_name,row.attr_sel,row.attr_vals.join(' '))
        // 发送请求
        editSubmitParams(this.cateId, row.attr_id,row.attr_name,row.attr_sel,row.attr_vals.join(' ')).then(res => {
            console.log(res)
            if(res.meta.status !== 200) return this.$message.error('添加参数失败')
            this.$message.success('添加参数成功')
            // this.getParamsData()
        })

    },
    // 获取商品列表数据
    getCategory() {
      getCategoryList(this.queryInfo).then((res) => {
        // console.log(res)
        if (res.meta.status !== 200) return;
        this.categoryList = res.data;
      });
    },
    getParamsData() {
      if (this.cscValue.length !== 3) {
        this.cscValue = [];
        this.dynamicData = [];
        this.staticData = [];
        return;
      }
      console.log(this.cscValue);
      // 发送请求
      console.log(this.cateId);
      getParamsList(this.cateId, this.activeName).then((res) => {
       
        res.data.forEach(item => {
           item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
           item.inputVisible = false
           item.inputValue = ''
            // console.log(item.attr_vals)
        })
         console.log(res);
        if (res.meta.status !== 200) return;
        //获取成功
        if (this.activeName === "many") {
          this.dynamicData = res.data;
        } else {
          this.staticData = res.data;
        }
      });
    },
    calHandleChange() {
      this.getParamsData();
    },
    handleTabClick() {
    //   console.log(this.activeName);
      this.getParamsData();
    },
    // 修改参数
    editParams(id) {
      this.editdialogVisible = true
      console.log(this.cateId,id);
      // 根据Id查询参数
      getParamsById(this.cateId,id).then(res => {
          console.log(res)
          if(res.meta.status !== 200) return
          this.editParamsForm = res.data
      })

    },
    // 删除参数
    deleteParam(id) {
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',
            type: 'warning'}).then(() => {
                console.log(id)
                 // 发送删除请求
                  deleteParams(this.cateId,id).then(res => {
                        console.log(res)
                        if(res.meta.status !== 200) return
                        this.$message.success('删除参数成功')
                        this.getParamsData()
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            }); 
    },
    //添加参数
    addParams() {
        this.dynaticdialogVisible = true
    },
    paramsClose() {
        this.$refs.paramsRuleForm.resetFields()
    },

    addParamsFormList() {
        this.$refs.paramsRuleForm.validate(valid => {
            if(!valid) return
            //表单预验证通过
            // console.log(this.cateId, this.addParamsForm.attr_name, this.activeName)
            addParams(this.cateId, this.addParamsForm.attr_name, this.activeName).then(res => {
                console.log(res)
                if(res.meta.status !== 201) return this.$message.error('添加参数失败')
                this.$message.success('添加参数成功')
                this.getParamsData()
            })

            this.dynaticdialogVisible = false
        })
        
    },

    // 提交参数
    submitParams() {
        // console.log(this.cateId, this.editParamsForm.attr_id,this.editParamsForm.attr_name,this.editParamsForm.attr_sel)
       editSubmitParams(this.cateId, this.editParamsForm.attr_id,this.editParamsForm.attr_name,this.editParamsForm.attr_sel).then(res => {
        console.log(res)
        if(res.meta.status !== 200) return
        this.$message.success('更新成功')
        this.getParamsData()
       })
       this.editdialogVisible = false
    },

    // 重置
    editDiaogClose() {
        this.$refs.editParamsRef.resetFields()
    }

  },
  created() {
    this.getCategory();
  },
  computed: {
    isDisabled() {
      if (this.cscValue.length === 3) {
        return false;
      } else {
        return true;
      }
    },
    // 获取三级分类 ID
    cateId() {
      if (this.cscValue.length === 3) {
        return this.cscValue[2];
      }
      return null;
    },
    paramsTitle() {
        if(this.activeName === 'many') {
            return '动态参数'
        }else {
            return '静态属性'
        }
    }
  },
};
</script>

<style scoped>
.el-col {
  margin-top: 15px;
}
.el-cascader {
  margin-left: 10px;
}
.el-row {
  margin: 10px;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width: 10%
}
</style>