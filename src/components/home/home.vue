<template>
  <el-container>
  <el-header>
    <el-row>
      <el-col :span='8'>
        <img src="../../assets/images/logo.png" alt="logo">
      </el-col>
      <el-col :span='8'>
        <h1>电商后台管理系统</h1>
      </el-col>
      <el-col :span='8' class="col_r">
        <a @click.prevent="logout" href="#">退出</a>
      </el-col>
    </el-row>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <el-menu
      :default-active="handlePath($route.path)"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
      >
      <el-submenu :index="item.id+''" v-for='item in menus' :key="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for='item1 in item.children' :key="item1.id" :index="'/'+item1.path">{{item1.authName}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.loadMenusData()
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('此操作将退出该帐号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('token')
        this.$message({
          type: 'success',
          message: '退出成功!',
          duration: 800
        })
        this.$router.push('/login')
      } catch (error) {
        this.$message({
          type: 'info',
          message: '不退出',
          duration: 800
        })
      }

      // .then(() => {
      //   localStorage.removeItem('token')
      //   this.$message({
      //     type: 'success',
      //     message: '退出成功!',
      //     duration: 800
      //   })
      //   this.$router.push('/login')
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '不退出',
      //     duration: 800
      //   })
      // })
    },
    async loadMenusData () {
      let res = await this.$axios.get('menus')
      console.log(res)
      this.menus = res.data.data
    },
    handlePath (path) {
      if (path === '/goods-add') return '/goods'
      else return path
    }
  }
}
</script>

<style lang='less' scoped>
  .el-container {
    height: 100%;
    min-width: 900px;
  }
  .el-header {
    padding: 0;
    background-color: #b3c1cd;
    h1 {
      line-height: 60px;
      height: 60px;
      text-align: center;
      font-size: 26px;
    }
    .col_r {
      text-align: right;
      line-height: 60px;
      padding-right: 10px;
        a {
        color: #000;
        text-decoration: none;
        font-size: 16px;
        }
    }
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #eaeef1;
  }
</style>
