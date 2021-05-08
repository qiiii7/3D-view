<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-tag type="success">test</el-tag>
      </el-header>
      <el-container>
        <el-aside>
          <el-col >
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>3Dview</span>
                </template>
                <el-menu-item-group>
                  <template slot="title">choice</template>
                      <router-link to="/space">
                        <el-menu-item index="1-1">
                            space
                        </el-menu-item>
                      </router-link>
                      <router-link to="/test">
                        <el-menu-item index="1-2">
                            test
                        </el-menu-item>
                      </router-link>
                      <router-link to="/light">
                        <el-menu-item index="1-3">
                            light
                        </el-menu-item>
                      </router-link>
                      <router-link to="/mytest">
                        <el-menu-item index="1-4">
                            myTest
                        </el-menu-item>
                      </router-link>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
              </el-submenu>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
              </el-menu-item>
              <el-menu-item index="3" disabled>
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main style="padding: 0;">
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {
  },
  methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}

html,body{
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}

  .el-header, .el-footer {
    background-color: #c7c7c7;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #545c64;
  }
  
  .el-main {
    background-color: #E9EEF3;
  }
  .el-container{
    height: 100%;
  }
  
</style>
