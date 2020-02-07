/* eslint-disable camelcase */
export default {
  data () {
    return {
      activeIndex: 1,
      activeName: 'three',
      addGoodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        radio: true
      },
      options: [
        {
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
          }
          ]
        }
      ],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name'
      },
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      },
      editorOption: {
        placeholder: '请输入文字...'
      }
    }
  },
  created () {
    this.loadCatName()
  },
  methods: {
    clickTabs (tab) {
      this.activeIndex = +tab.index + 1
    },
    next (index, name) {
      this.activeIndex = index
      this.activeName = name
    },
    async loadCatName () {
      let res = await this.$axios.get('categories')
      //   console.log(res)
      this.options = res.data.data
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadImgSuc (res) {
      this.addGoodsForm.pics.push({
        pics: res.data.tmp_path
      })
    },
    async addGoods () {
      const {
        goods_name,
        goods_cat,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics
      } = this.addGoodsForm
      let res = await this.$axios.post('goods', {
        goods_name,
        goods_cat: goods_cat.join(','),
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics
      })
      //   console.log(res)
      if (res.data.meta.status === 201) {
        this.$message({
          message: '添加商品成功！',
          type: 'success',
          duration: 800
        })
        this.$router.push('/goods')
      }
    }
  }
}
