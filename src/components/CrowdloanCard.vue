<template>
  <div class="card">
    <div class="status-container">
      <img :src="statusIcon" alt="" />
<!--      <span>-->
<!--        {{ status }}-->
<!--      </span>-->
    </div>
    <div class="card-title-box flex-start-center">
      <div class="icons">
        <img class="icon2" src="~@/static/images/tron.svg" alt="">
        <img class="icon1" src="~@/static/images/eth.svg" alt="">
      </div>
      <div class="title-text font20 font-bold">
        <span>{{ surportCommunities[communitId] }}</span>
        <img src="~@/static/images/close.svg" alt="">
        <span>{{ surportChains[paraId] }}</span>
      </div>
    </div>
    <div class="h-line"></div>
    <div class="detail-info-box">
      <div class="project-info-container">
        <span class="name"> Lease period </span>
        <div class="info">{{ leasePeriod || 'test data'}}</div>
      </div>
      <div class="project-info-container">
        <span class="name"> Countdown </span>
        <div class="info"> {{ countDown || 'test data' }} </div>
      </div>
      <div class="project-info-container">
        <span class="name"> Fund </span>
        <div class="info">
          <div>{{ fund || 'test data'}}</div>
          <div>
            <span>{{ completion }}</span>
            <span>{{ contributions }} contributors</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isConnected">
      <button
        class="primary-btn"
        v-show="status === 'Active'"
        @click="$emit('showContributeModal')"
      >
        Contribute
      </button>
      <button
        class="primary-btn"
        v-show="status === 'Retired'"
        @click="$emit('showWithdrawModal')"
      >
        Withdraw
      </button>
      <button
        class="action-btn primary-btn"
        disabled
        v-show="status === 'Completed'"
      >
        Withdraw
      </button>
      <button class="primary-btn" @click="$emit('showContributeModal')">Other(test)</button>
    </div>
    <ConnectWallet v-else />
<!--    <TipContribute-->
<!--      v-if="showContribute"-->
<!--      @hideContribute="showContribute = false"-->
<!--    />-->
<!--    <TipWithdraw v-if="showWithdraw" @hideWithdraw="showWithdraw = false" />-->
    <b-modal v-model="showContribute" modal-class="custom-modal" centered hide-header hide-footer no-close-on-backdrop>
      <TipContribute @hideContribute="showContribute = false"/>
    </b-modal>
    <b-modal v-model="showWithdraw" modal-class="custom-modal" centered hide-header hide-footer no-close-on-backdrop>
      <TipWithdraw @hideWithdraw="showWithdraw = false" />
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ConnectWallet from './Buttons/ConnectWallet'
import TipContribute from './TipBoxes/TipContribute'
import TipWithdraw from './TipBoxes/TipWithdraw'
import { TOKEN_SYMBOL, SURPORT_CHAINS, SURPORT_COMMUNITIES } from '../config'
import { BLOCK_SECOND, TIME_PERIOD } from '../constant'
export default {
  data () {
    return {
      showContribute: true,
      showWithdraw: false,
      tokenSymbol: TOKEN_SYMBOL,
      timePeriod: TIME_PERIOD,
      surportChains: SURPORT_CHAINS,
      surportCommunities: SURPORT_COMMUNITIES
    }
  },
  props: {
    paraId: {
      type: Number
    },
    communityId: {
      type: String
    }
  },
  components: {
    ConnectWallet,
    TipContribute,
    TipWithdraw
  },
  computed: {
    ...mapState([
      'projectName',
      'communityName',
      'isConnected',
      'symbol',
      'projectFundInfos'
    ]),
    ...mapGetters([
      'getProjectStatus',
      'getFundInfo',
      'currentBlockNum'
    ]),
    status () {
      return this.getProjectStatus(this.paraId)
    },
    fundInfo () {
      return this.getFundInfo(this.paraId)
    },
    leasePeriod () {
      try {
        return (
          parseInt(this.fundInfo.firstSlot) +
          ' - ' +
          parseInt(this.fundInfo.lastSlot)
        )
      } catch (e) {
        return '0 - 0'
      }
    },
    countDown () {
      try {
        const end = parseInt(this.fundInfo.end)
        const diff = end - parseInt(this.currentBlockNum)
        if (diff > 0) {
          const secs = diff * BLOCK_SECOND + 3600;
          const month = MATH.floor(secs / this.timePeriod['MONTH'])
          const day = MATH.floor(secs % this.timePeriod['MONTH'] / this.timePeriod["DAY"])
          const hour = MATH.floor(secs % this.timePeriod['DAY'] / this.timePeriod["HOUR"])
          const min = MATH.floor(secs % this.timePeriod['HOUR'] / this.timePeriod["MINUTES"])
          const sec = MATH.floor(secs % this.timePeriod['MINUTES'])
          if (secs >= this.timePeriod['MONTH']){
            return month + 'mons' + day + 'days' + hour + 'hrs'
          }else if(secs >= this.timePeriod['DAY']){
            return day + 'days' + hour + 'hrs' + min + 'mins'
          }else if (secs >= this.timePeriod['HOUR']){
            return hour + 'hrs' + min + 'mins'
          }else {
            return min + 'mins' + sec + 'sec'
          }
        }
        return 'Completed'
      } catch (e) {
        return ''
      }
    },
    fund () {
      try {
        const raised = parseFloat(this.fundInfo.raised).toFixed(4)
        let cap = parseFloat(this.fundInfo.cap).toFixed(4)
        if (cap >= 1e9) {
          cap = (cap / 1e9).toFixed(4) + 'B'
        } else if (cap >= 1e6) {
          cap = (cap / 1e6).toFixed(4) + 'M'
        }
        return raised + '/' + cap + this.tokenSymbol[this.symbol]
      } catch (e) {
        return ''
      }
    },
    completion () {
      try {
        const raised = parseFloat(this.fundInfo.raised)
        const cap = parseFloat(this.fundInfo.cap)
        return parseFloat((raised * 100) / cap).toFixed(2) + '%'
      } catch (e) {
        return '0.0%'
      }
    },
    contributions () {
      try {
        return this.fundInfo.funds.length
      } catch (e) {
        return 0
      }
    },
    statusIcon () {
      switch (this.status) {
        case 'Active':
          return require('../static/images/card-active.svg')
        case 'Retired':
          return require('../static/images/card-retired.svg')
        default:
          return require('../static/images/card-completed.svg')
      }
    }
  },
}
</script>

<style lang="less" scoped>
.card {
  width: 100%;
  border-radius: 1.4rem;
  margin-bottom: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.02);
  position: relative;
  padding: 2.2rem 1.2rem;
  .status-container {
    position: absolute;
    right: 0;
    top: 0;
    img {
      width: 3.4rem;
      height: 3.4rem;
    }
  }
  .card-title-box {
    .icons {
      position: relative;
      margin-right: 2.4rem;
      img {
        width: 2rem;
      }
      .icon2 {
        position: absolute;
        left: 1.8rem;
      }
      .icon1 {
        position: relative;
        left: 0;
      }
    }
  }
  .h-line {
    width: 1.6rem;
    height: .2rem;
    background: var(--primary-custom);
    margin-top: 1.6rem;
    margin-bottom: .8rem;
    border-radius: 4px;
  }
  .detail-info-box {
    margin-bottom: 1.2rem;
  }
  .project-info-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: .6rem;
    .name {
      flex: .4;
      text-align: left;
      color: rgba(189, 191, 194, 1);
      font-weight: bold;
    }
    .info {
      flex: .6;
      text-align: right;
    }
  }
}
</style>
