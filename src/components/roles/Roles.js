import { nextTick } from 'q'

export default {
  data () {
    return {
      rolesData: [
        {
          roleName: '主管',
          roleDesc: '技术负责人'
        }
      ],
      dialogAssignRightsVisible: false,
      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: 0
    }
  },
  created () {
    this.loadRolesData()
    this.loadAllRightsData()
  },
  methods: {
    indexMethod (index) {
      return index
    },
    async loadRolesData () {
      let res = await this.$axios.get('roles')
      // console.log(res)
      const { data: { data } } = res
      this.rolesData = data
    },
    async loadAllRightsData () {
      let res = await this.$axios.get('rights/tree')
      console.log(res)
      const { data: { data } } = res
      this.treeData = data
    },
    showAssignRightDialog (row) {
      this.roleId = row.id
      this.dialogAssignRightsVisible = true
      let keys = []
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            keys.push(item3.id)
          })
        })
      })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(keys)
      })
    },
    async assignRights () {
      let keys1 = this.$refs.tree.getHalfCheckedKeys()
      let keys2 = this.$refs.tree.getCheckedKeys()
      console.log(keys1, keys2)
      let keys = keys1.concat(keys2)

      let res = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: keys.join(',')
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogAssignRightsVisible = false
        this.$message({
          message: '更新成功',
          type: 'success',
          duration: 800
        })
        this.loadRolesData()
      }
    }
  }
}
