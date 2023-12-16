<template>
  <div style="padding: 5px 20px;">
    <br>
    <!-- 模糊查询 -->
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item>
        <el-input style="width: 180px" v-model="listQuery.empName" placeholder="姓名"></el-input>
        <el-select style="width: 90px" v-model="listQuery.deptName" placeholder="部门">
          <el-option
            v-for="item in bmOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select style="width: 90px" v-model="listQuery.empDegreeName" placeholder="学历">
          <el-option
            v-for="item in xlOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select style="width: 150px" v-model="value" placeholder="ID Ascending">
          <el-option
            v-for="item in idOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitSelect" icon="el-icon-search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="TJCollectionForm" icon="el-icon-edit">添加</el-button>
      </el-form-item>
      <!-- <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" /> -->
      <el-form-item>
        <el-button :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格-->
    <el-table :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="50" type="index"></el-table-column>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="职工姓名" prop="empName"></el-table-column>
      <el-table-column label="性别" prop="sex"></el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
      <el-table-column label="部门名称" prop="deptName"></el-table-column>
      <el-table-column label="学历" prop="empDegreeName"></el-table-column>

      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改密码" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="BJCollectionForm(scope.$index)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteVisible(scope)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"
      :background="true">
    </el-pagination>
     <!-- 弹出框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="collectionform" :rules="rules" :model="ruleForm" label-width="120px" label-position="left">
        <el-form-item label="姓名" prop="emp_name" v-if="dialogStatus=='create'">
          <el-input placeholder="姓名" v-model="ruleForm.empName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input placeholder="性别" v-model="ruleForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input placeholder="年龄" v-model="ruleForm.age"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="dept_name">
          <el-input placeholder="部门" v-model="ruleForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="emp_degree_name">
          <el-input placeholder="学历" v-model="ruleForm.empDegreeName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus=='create'" @click="submitCollectionForm('collectionform')">添 加</el-button>
        <el-button type="warning" v-else @click="updateCollectionForm('collectionform')">修 改</el-button>
      </div>
    </el-dialog>
 
 
  </div>
</template>
 
<script>
  import { list, add, edit, del } from '@/api/staff'   // 引入调用api
  import { parseTime } from '@/utils'

  export default {
    name: 'department',
    data() {
      return {
        /* typecode:this.$route.query.typecode,
         typetitle:this.$route.query.typetitle */
        // 表格参数
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx',

        listLoading: true,
        list: null,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          empName: '',
          deptName: '',
          empDegreeName: '',
        },
        dialogFormVisible: false,
        dialogStatus: 'create',
        textMap: {
          update: '修改',
          create: '添加'
        },
 
        ruleForm: {
          id: '',
          empName: '',
          deptName: '',
          empDegreeName: '',
          sex: '',
          age: '',
        },
 
        rules: {
          empName: [{
            required: false,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          deptName: [{
            required: false,
            message: '请输入部门名称',
            trigger: 'blur'
          }],
          empDegreeName: [{
            required: false,
            message: '请输入学历',
            trigger: 'blur'
          }],
          sex: [{
            required: false,
            message: '请输入性别',
            trigger: 'blur'
          }],
          age: [{
            required: false,
            message: '请输入年龄',
            trigger: 'blur'
          }]
        },
        value: '',
        xlOptions: [{value: '大专',label: '大专'}, {value: '本科',label: '本科'},{value: '研究生',label: '研究生'}],
        bmOptions: [{value: '后勤部',label: '后勤部'}, {value: '业务部',label: '业务部'},{value: '人事部',label: '人事部'}],
        idOptions: [{value: '0',label: '后勤部'}, {value: '1',label: '业务部'},{value: '2',label: '人事部'}],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      onSubmitSelect() {
        this.getList()
      },
      getList() {
        this.listLoading = true
        console.log("listQuery>>>"+this.listQuery);
        list(this.listQuery).then(response => {
          // console.log(">>>>>>>>>>>>>>"+response.data);
          this.list = response.data
          this.listLoading = false
          this.total = response.total

        })
      },
        /* 导出表单*/
      // ['Id', '姓名', '性别', '年龄', '部门名称', '学历']
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['Id', '姓名', '性别', '年龄', '部门名称', '学历']
          const filterVal = ['id', 'empName', 'sex', 'age', 'deptName', 'empDegreeName']
          const list = this.list
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      /* 添加表单*/
      TJCollectionForm() {
        /* 表单重置*/
        Object.assign(this.$data.ruleForm, this.$options.data().ruleForm);

        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      /* 编辑表单*/
      BJCollectionForm($index) {
        //显示修改对话框
        this.ruleForm = JSON.parse(JSON.stringify(this.list[$index]))
        //以下效果和上面的不一样
        //this.ruleForm=this.list[$index]

        this.dialogStatus = "update"
        this.dialogFormVisible = true

      },

      /* 添加按钮*/
      submitCollectionForm(formname) {
        this.$refs[formname].validate((valid) => {
          if (valid) {
            // console.log("this.ruleForm>>>"+this.ruleForm.empName)
            add(JSON.parse(JSON.stringify(this.ruleForm))).then((response) => {
              // console.log(response.code)
              if (response.code == 200) {
                this.getList();
                this.dialogFormVisible = false;
                this.$message.success('添加数据成功！');
              } else {
                this.$message.error('添加数据失败！');
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /* 修改按钮*/
      updateCollectionForm(formname) {
        this.$refs[formname].validate((valid) => {
          if (valid) {
            edit(JSON.parse(JSON.stringify(this.ruleForm))).then((response) => {
              if (response.code == 200) {
                this.getList();
                this.dialogFormVisible = false;
                this.$message.success('修改数据成功！');
              } else {
                this.$message.error('修改数据失败！');
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /* 删除按钮*/
      deleteVisible(scope) {
        console.log(typeof scope.row.id)
        console.log(typeof parseInt(scope.row.id))
        this.$confirm('确定要删除【' + scope.row.empName + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(scope.row.id).then((response) => {
            if (response.code == 200) {
              this.getList();
              this.dialogFormVisible = false;
              this.$message.error('删除完毕')
            } else {
              this.$message.error('删除数据失败！');
            }
          })
        });

      },
    },
  }
</script>
 
<style>
</style>