<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <tree-table
        class="treeTable"
        :data="catelist"
        style="width: 100%"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">
            二级
          </el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template v-slot:opt="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCate(scope.row.cat_id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
          ></el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"> 确 定 </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      selectedKeys: [],
      editDialogVisible: false,
      editCateForm: {
        cat_name: ''
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      // console.log(res)
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 每页显示条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 更换当前页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 显示添加分类
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 获取前两级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.success('获取列表失败')
      }
      this.parentCateList = res.data
      // console.log(this.parentCateList)
    },
    // 添加父级分类选择后触发
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return false
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 确定请求添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('商品分类信息错误')
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品分类失败')
        }
        this.getCateList()
        this.addCateDialogVisible = false
        this.$message.success('成功添加分类')
      })
    },
    // 关闭添加分类框后触发
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 编辑商品分类
    async showEditCate(cateId) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('categories/' + cateId)
      if (res.meta.status !== 200) {
        return this.$message.error('获取该商品分类失败')
      }
      this.editCateForm = res.data
    },
    editCateInfo() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('编辑分类失败')
        }
        const { data: res } = await this.$http.put(
          'categories/' + this.editCateForm.cat_id,
          this.editCateForm
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类失败')
        }
        this.getCateList()
        this.editDialogVisible = false
        this.$message.success('编辑商品分类成功')
      })
    },
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 删除商品分类
    async removeCateById(cateId) {
      const resultConfirm = await this.$confirm(
        '此操作将永久删除该商品分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(resultConfirm)
      if (resultConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('categories/' + cateId)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.getCateList()
      this.$message.success('成功商品删除分类')
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
