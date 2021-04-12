<template>
  <div class="contribution-page ">
    <div class="container">
      <div class="font-bold font32 mt-3 mb-3 text-left">Dashboard</div>
      <div class="c-tabs-box">
        <div class="tab" v-for="tab of tabList" :key="tab.key"
             :class="activeTab===tab.key?'active':''" @click="activeTab=tab.key">{{tab.label}}</div>
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-6" v-for="(item, index) of dashboardTabs[activeTab]" :key="index">
          <div class="c-card">
            <div class="card-title-box flex-start-center">
              <div class="icons">
                <img class="icon2" src="~@/static/images/tron.svg" alt="">
                <img class="icon1" src="~@/static/images/eth.svg" alt="">
              </div>
              <div class="title-text font20 font-bold">
                <span>BML</span>
                <img src="~@/static/images/close.svg" alt="">
                <span>PLASM</span>
              </div>
            </div>
            <div class="h-line"></div>
            <div class="detail-info-box">
              <div class="project-info-container">
                <span class="name"> Contributors </span>
                <div class="info">test data</div>
              </div>
              <div class="project-info-container">
                <span class="name"> Fund </span>
                <div class="info">test data</div>
              </div>
            </div>
            <button class="primary-btn">Export</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      activeTab: 'kusuma',
      tabList: [
        { key: 'kusuma', label: 'Kusuma' },
        { key: 'polkadot', label: 'Polkadot' }
      ],
      dashboardTabs: {
        kusuma: [
          { name: 'BML x PLASM', contributors: '123123', funds: '2,222,000' },
          { name: 'BML x PLASM', contributors: '123123', funds: '2,222,000' }
        ],
        polkadot: [
          { name: 'BML x PLASM', contributors: '123123', funds: '2,222,000' }
        ]
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.contribution-page {
  height: 100%;
  background: rgba(246, 247, 249, 1);
  overflow: scroll;
  position: relative;
  padding-top: 4.6rem;
}
.table-card {
  border-radius: 1.4rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.02);
  border: none;
}
.Active {
  color: rgba(80, 191, 0, 1);
}
.Retired {
  color: rgba(248, 182, 42, 1);
}
.Completed {
  color: rgba(255, 91, 77, 1);
}
.change-page-box {
  margin: 1rem auto;
}
.c-tabs-box {
  width: 100%;
  max-width: 200px;
  display: flex;
  align-items: center;
  height: 2.4rem;
  background-color: rgba(227, 229, 232, 1);
  border-radius: 2.4rem;
  margin: 1rem auto 2rem auto;
  .tab {
    flex: 1;
    height: 2.4rem;
    line-height: 2.4rem;
    &.active {
      background-color: var(--primary-custom);
      border-radius: 2.4rem;
    }
  }
}
</style>
