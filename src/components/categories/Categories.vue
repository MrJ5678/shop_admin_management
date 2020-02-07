<template>
    <div>
        <el-button type="success" plain @click="showAddCatDialog">添加分类</el-button>
        <el-table :data="catData" style="width: 100%">
            <el-table-tree-column
                prop="cat_name" label="分类名称" width="220" tree-key='cat_id' parent-key='cat_pid' level-key='cat_level' :indentSize='20'>
            </el-table-tree-column>
            <el-table-column
                label="是否有效"
                width="180">
                <template slot-scope="scope">
                    {{scope.row.cat_deleted ? '否' : '是'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="cat_level"
                label="层级">
                <template slot-scope="scope">
                    <span v-if='scope.row.cat_level === 0'>一级</span>
                    <span v-else-if='scope.row.cat_level === 1'>二级</span>
                    <span v-else>三级</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="添加分类" :visible.sync="dialogAddCatFormVisible">
            <el-form :model="addCatForm" label-width="80px">
                <el-form-item label="分类名称">
                <el-input v-model="addCatForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级名称">
                    <el-cascader :options="options" clearable :props='defaultProps' v-model="addCatForm.cat_pid_arr"></el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddCatFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCat">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
import ElTreeGrid from 'element-tree-grid'
Vue.component(ElTreeGrid.name, ElTreeGrid)

export default {
  data () {
    return {
      catData: [{
        cat_name: '王小虎',
        cat_level: '一级',
        cat_deleted: '是'
      }],
      dialogAddCatFormVisible: false,
      addCatForm: {
        cat_name: '',
        cat_pid_arr: []
      },
      options: [{
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  created () {
    this.loadCatData()
    this.loadCatData2()
  },
  methods: {
    async loadCatData () {
      let res = await this.$axios.get('categories', {
        params: {
          query: '',
          pagenum: 1,
          pagesize: 4
        }
      })
      //   console.log(res)
      const {data: {data: { result }}} = res
      this.catData = result
    },
    async loadCatData2 () {
      let res = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      //   console.log(res)
      this.options = res.data.data
    },
    showAddCatDialog () {
      this.dialogAddCatFormVisible = true
    },
    async addCat () {
      // 获取表格中绑定的数据信息
      // eslint-disable-next-line camelcase
      const { cat_name, cat_pid_arr } = this.addCatForm
      let res = await this.$axios.post('categories', {
        cat_pid: cat_pid_arr[cat_pid_arr.length - 1],
        cat_name,
        cat_level: cat_pid_arr.length
      })
      //   console.log(res)
      if (res.data.meta.status === 201) {
        this.dialogAddCatFormVisible = false
        this.$message({
          message: '添加分类成功',
          type: 'success',
          duration: 800
        })
        this.loadCatData()
      }
    }
  }
}
</script>

<style lang='less' scoped>
.cell {
    padding-right: 15px;
}
</style>
