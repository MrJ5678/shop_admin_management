export default {
  data () {
    return {
      usersData: [{
        username: 'tige117',
        email: 'tige112@163.com',
        mobile: '18616358651'
      },
      {
        username: 'tige117',
        email: 'tige112@163.com',
        mobile: '18616358651'
      }],
      total: 0,
      pagenum: 1,
      queryText: '',
      // state: true,
      dialogAddUserFormVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
        ],
        email: [
          // eslint-disable-next-line no-useless-escape
          { pattern: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/, message: '格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/, message: '格式不正确', trigger: 'blur' }
        ]
      },
      dialogEditUserFormVisible: false,
      editUserForm: {
        id: '',
        username: 'jld',
        email: '',
        mobile: ''
      },
      dialogAssignRoleVisible: false,
      assignRoleForm: {
        username: '',
        id: 0,
        rid: ''
      },
      rolesData: []
    }
  },
  created () {
    const page = this.$route.params.page
    this.loadUsersData(page)
    this.loadRolesData()
  },
  methods: {
    async loadUsersData (pagenum = 1, query = '') {
      const config = {
        params: {
          query,
          pagenum,
          pagesize: 2
        }
      }
      let res = await this.$axios.get('users', config)
      // console.log(res)
      this.usersData = res.data.data.users
      this.total = res.data.data.total
      this.pagenum = res.data.data.pagenum
    },
    clickCurrentPage (curPage) {
      this.$router.push('/users/' + curPage)
      this.loadUsersData(curPage, this.queryText)
    },
    startQuery () {
      this.loadUsersData(1, this.queryText)
    },
    showAddUserDialog () {
      this.dialogAddUserFormVisible = true
    },
    async addUser () {
      let res = await this.$axios.post('users', this.addUserForm)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.dialogAddUserFormVisible = false
        this.loadUsersData()
        this.$message({
          message: '添加用户成功！',
          type: 'success',
          duration: 800
        })
        this.$refs.addUserForm.resetFields()
      } else {

      }
    },
    // 监听对话框关闭
    dialogClosed () {
      this.$refs.addUserForm.resetFields()
    },
    // 删除用户按钮点击事件
    async delUser (id) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送请求删除用户
        let res = await this.$axios.delete(`users/${id}`)
        if (res.data.meta.status === 200) {
          this.loadUsersData()
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 800
          })
        }
      } catch (error) {
        this.$message({
          message: '取消删除',
          type: 'info',
          duration: '800'
        })
      }
    },
    async stateChanged (row) {
      const { id, mg_state: mgState } = row
      let res = await this.$axios.put(`users/${id}/state/${mgState}`, null)
      if (res.data.meta.status === 200) {
        this.$message({
          message: '修改状态成功',
          type: 'success',
          duration: 800
        })
        this.loadUsersData(this.pagenum)
      }
    },
    showEditUserDialog (row) {
      const {username, email, mobile, id} = row
      this.editUserForm.username = username
      this.editUserForm.email = email
      this.editUserForm.mobile = mobile
      this.editUserForm.id = id
      this.dialogEditUserFormVisible = true
    },
    async editUser () {
      const {email, mobile, id} = this.editUserForm
      let res = await this.$axios.put(`users/${id}`, {
        email,
        mobile
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogEditUserFormVisible = false
        this.loadUsersData(this.pagenum)
        this.$message({
          message: '更新成功！',
          type: 'success',
          duration: 800
        })
      }
    },
    async loadRolesData () {
      let res = await this.$axios.get('roles')
      // console.log(res)
      this.rolesData = res.data.data
    },
    async showAssignRoleDialog (row) {
      this.dialogAssignRoleVisible = true
      // console.log(row)
      const { id, username } = row
      let res = await this.$axios.get(`users/${id}`)
      const rid = res.data.data.rid
      this.assignRoleForm.id = id
      this.assignRoleForm.username = username
      this.assignRoleForm.rid = (rid === -1 ? '' : rid)
    },
    async assignRole () {
      let {id, rid} = this.assignRoleForm
      let res = await this.$axios.put(`users/${id}/role`, {rid})
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogAssignRoleVisible = false
        this.$message({
          message: '分配角色成功',
          type: 'success',
          duration: 800
        })
        this.loadUsersData(this.pagenum)
      }
    }
  }
}
