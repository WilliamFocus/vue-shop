<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item> 权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="roleslist" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" labe="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
              >编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeRoles(scope.row.id)"
              >删除
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adddRoles">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        node-key="id"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleslist: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: []
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      editFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: []
      },
      setRightDialogVisible: false,
      rightlist: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 用户权限列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色权限失败')
      }
      this.roleslist = res.data
    },
    // 重置添加角色表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 验证添加角色发送请求
    adddRoles() {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) return this.$message.error('添加角色失败')
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.getRolesList()
        this.addDialogVisible = false
        this.$message.success('添加成功')
      })
    },
    // 编辑角色
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(roleID) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + roleID)
      if (res.meta.status !== 200) return
      this.editForm = res.data
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async v => {
        if (!v) return this.$message.error('编辑角色失败')
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          this.editForm
        )
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
        this.getRolesList()
        this.editDialogVisible = false
        this.$message.success('编辑成功')
      })
    },
    // 删除角色
    async removeRoles(roleID) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('roles/' + roleID)
      if (res.meta.status !== 200) return this.message.error('删除角色失败')
      this.getRolesList()
      this.$message.success('删除角色成功')
    },
    // 删除角色权限
    async removeRightById(role, rightsId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(
        'roles/' + role.id + '/rights/' + rightsId
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色权限失败')
      }
      role.children = res.data
      this.$message.success('已成功删除角色权限')
    },
    // 分配角色权限
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.err('获取权限列表失败')
      this.rightlist = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 获取已选三级权限
    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 重置已选数组
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 修改角色权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        'roles/' + this.roleId + '/rights',
        { rids: idStr }
      )
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.getRolesList()
      this.setRightDialogVisible = false
      this.$message.success('成功分配角色权限')
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
