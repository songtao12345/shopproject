<template>
  <!-- 表单区域 -->
  <div class="login">
    <div class="login_box">
      <div class="dog"><img src="~assets/img/doge.jpg" alt="" /></div>
      <el-form class="login_form" :model="form" :rules="formRules" ref="form">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <div class="button">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="buttonClick">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {getLogin} from 'network/login.js'
// import {request} from 'network/request.js'
// import axios from 'axios'
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
      },
      formRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
      }


    };
  },
  methods: {
    buttonClick() {
      this.$refs.form.resetFields()
    },
    login() {
      //表单的预验证
      this.$refs.form.validate(valide => {
        // console.log(valide)
        if(!valide) return;
        getLogin(this.form.username, this.form.password).then(res => {
          if(res.meta.status !== 200) return this.$message.error('用户名或密码错误')
          this.$message.success('登陆成功')
          console.log(res)
          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
        })


        //方法一
        // axios.post('http://127.0.0.1:8888/api/private/v1/login',{
        //   username: this.form.username,
        //   password: this.form.password
        // }).then(res => console.log(res))
        // 方法二
        // this.$http.post("login",this.form).then(res => {console.log(res)})
        // 方法三
        // request({
        //   type: 'post',
        //   url: '/login',
        //   params: {
        //     username: this.form.username,
        //     password: this.form.password
        //   }
        // }).then(res => console.log(res))
        
      })
    }

  },
};
</script>

<style scoped>
.login {
  background-color: #84af9b;
  height: 100vh;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.dog img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  position: relative;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #eee;
  /* padding: 10px; */
  box-shadow: 0 0 10px #eee;
  background-color: #eee;
}
.login_form {
  position: absolute;
  width: 80%;
  top: 90px;
  left: 10%;
  box-sizing: border-box;
}
.button {
  display: flex;
  justify-content: flex-end;
}
</style>