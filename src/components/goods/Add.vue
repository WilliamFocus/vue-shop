<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 标签选项卡 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 添加基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="props"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 添加商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border=""
                ></el-checkbox
              ></el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 添加商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 添加商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 添加商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 引入lodash用于复制一个addForm对象
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      upLoadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取商品分类列表供选择
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    // 商品分类级联选择器必须为第三级具体分类
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return false
      }
    },
    // 必须选择商品分类才能添加后面信息
    beforeTabLeave(newTab, oldTab) {
      if (oldTab === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 切换信息选项卡
    async tabClicked() {
      // 获取商品分类参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          'categories/' + this.cateId + '/attributes',
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      }
      // 获取商品分类属性
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          'categories/' + this.cateId + '/attributes',
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 商品图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 商品图片移除
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(index, 1)
    },
    // 商品图片上传后关联商品信息
    handleSuccess(respone) {
      const picInfo = { pic: respone.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    // 提交添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请完善商品信息')
        }
        // 由于级联选择器依赖于数组对象
        // 所以只能复制一份再转字符串上传
        const newAddForm = _.cloneDeep(this.addForm)
        newAddForm.goods_cat = newAddForm.goods_cat.join(',')
        // 处理分类参数数组
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理分类属性数组
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        newAddForm.attrs = this.addForm.attrs
        // 发起添加请求
        const { data: res } = await this.$http.post('goods', newAddForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加商品失败')
        }
        this.$router.push('goods')
        this.$message.success('添加商品成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
