<template>
  <div class="user-page container">
    <div class="page-header">
      <b-button @click="goBack">go back</b-button>
    </div>
    <div class="page-content">
      <div class="tab">
        <span @click="activeId = 0" :class="{'active':activeId===0}">Contributions</span> |
        <span @click="activeId = 1" :class="{'active':activeId===1}">Dashboard</span>
      </div>
      <div class="tab-content">
        <Contributions v-show="activeId === 0"/>
        <Dashboard v-show="activeId === 1"/>
      </div>
    </div>
  </div>
</template>

<script>
import Contributions from '@/views/user/Contributions'
import Dashboard from '@/views/user/Dashboard'
export default {
  name: 'Index',
  components: {
    Contributions,
    Dashboard
  },
  data () {
    return {
      activeId: 0
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.user-page {
  text-align: left;
  margin: 20px auto;
}
.tab {
  margin: 10px;
  span {
    cursor: pointer;
  }
  .active {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
