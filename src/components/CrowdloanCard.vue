<template>
  <div class="card">
    <div class="status-container">
      <img :src="statusIcon" alt="" />
      <span>
        {{ status }}
      </span>
    </div>
    <p class="card-title">
      {{ communityNm + " X " + projectNm }}
    </p>
    <p class="project-info-container">
      <span class="name"> Lease period </span>
      <span class="info">
        {{ leasePeriod }}
      </span>
    </p>
    <p class="project-info-container">
      <span class="name"> Countdown </span>
      <span class="info"> {{ countDown }} </span>
    </p>
    <p class="project-info-container">
      <span class="name"> Fund </span>
      <span class="info">
        {{ fund }}
      </span>
    </p>
    <p class="project-info-container">
      <span class="name"></span>
      <span class="info">
        {{ completion }}
      </span>
      <span class="info">
        {{ contributions }} contributors
      </span>
    </p>

    <ConnectWallet style="margin-top: 48px" width="240" v-if="isConnected" />
    <div v-else>
      <button
        class="action-btn primary-btn"
        v-show="status === 'Active'"
        @click="showContribute = true"
      >
        Contribute
      </button>
      <button
        class="action-btn primary-btn"
        v-show="status === 'Retired'"
        @click="showWithdraw = true"
      >
        Withdraw
      </button>
      <button
        class="action-btn primary-btn"
        disabled="true"
        v-show="status === 'Completed'"
      >
        Withdraw
      </button>
    </div>

    <TipContribute
      v-if="showContribute"
      @hideContribute="showContribute = false"
    />
    <TipWithdraw v-if="showWithdraw" @hideWithdraw="showWithdraw = false" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ConnectWallet from "./Buttons/ConnectWallet";
import TipContribute from "./TipBoxes/TipContribute";
import TipWithdraw from "./TipBoxes/TipWithdraw";
import { TOKEN_SYMBOL } from "../config";
import { BLOCK_SECOND, TIME_PERIOD } from "../constant";
export default {
  data() {
    return {
      showContribute: false,
      showWithdraw: false,
      tokenSymbol: TOKEN_SYMBOL,
      timePeriod: TIME_PERIOD,
    };
  },
  props: {
    paraId: {
      type: Number,
    },
    communityId: {
      type: String,
    },
  },
  components: {
    ConnectWallet,
    TipContribute,
    TipWithdraw,
  },
  computed: {
    ...mapState([
      "projectStatus",
      "projectName",
      "communityName",
      "isConnected",
      "symbol",
    ]),
    ...mapGetters([
      "getProjectStatus",
      "getProjectName",
      "getCommunityName",
      "getParaFund",
      "currentBlockNum",
    ]),

    communityNm() {
      return this.getCommunityName(this.communityId);
    },
    projectNm() {
      return this.getProjectName(this.paraId);
    },
    status() {
      return this.getProjectStatus(this.paraId);
    },
    fundInfo() {
      return this.getParaFund(this.paraId);
    },
    leasePeriod() {
      try {
        return (
          parseInt(this.fundInfo.firstSlot) +
          " - " +
          parseInt(this.fundInfo.lastSlot)
        );
      } catch (e) {
        return "0 - 0";
      }
    },
    countDown() {
      try {
        const end = parseInt(this.fundInfo.end);
        let diff = end - parseInt(this.currentBlockNum);
        if (diff > 0) {
          const secs = diff * BLOCK_SECOND;
          let date = new Date(secs*1000)
          if (secs >= this.timePeriod['MONTH']){
            const month = date.getMonth() + 1
            const day = date.getDay() % 30
            return month + 'mons' + day + 'days'
          }else if(secs >= this.timePeriod['DAY']){
            const day = date.getDay()
            const hour = date.getHours()
            return day + 'days' + hour + 'hrs'
          }else if (secs >= this.timePeriod['HOUR']){
            const hour = date.getHours()
            const min = date.getMinutes()
            return hour + 'hrs' + min + 'mins'
          }else {
            const min = date.getMinutes()
            const sec = date.getSeconds()
            return min + 'mins' + sec + 'sec'
          }
        }
        return "Completed";
      } catch (e) {
        return "";
      }
    },
    fund() {
      try {
        const raised = parseFloat(this.fundInfo.raised).toFixed(4);
        let cap = parseFloat(this.fundInfo.cap).toFixed(4);
        if (cap >= 1e9) {
          cap = (cap / 1e9).toFixed(4) + "B";
        } else if (cap >= 1e6) {
          cap = (cap / 1e6).toFixed(4) + "M";
        }
        return raised + "/" + cap + this.tokenSymbol[this.symbol];
      } catch (e) {
        return "";
      }
    },
    completion() {
      try {
        const raised = parseFloat(this.fundInfo.raised);
        const cap = parseFloat(this.fundInfo.cap);
        return parseFloat((raised * 100) / cap).toFixed(2) + "%";
      } catch (e) {
        return "0.0%";
      }
    },
    contributions() {
      try {
        return this.fundInfo.funds.length;
      } catch (e) {
        return 0;
      }
    },
    statusIcon() {
      switch (this.status) {
        case "Active":
          return require("../static/images/card-pin-blue.png");
        case "Retired":
          return require("../static/images/card-pin-yellow.png");
        default:
          return require("../static/images/card-pin-pink.png");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.card {
  width: 100%;
  height: 380px;
  border-radius: 8px;
  background-color: rgb(185, 246, 248);
  margin-bottom: 12px;
  overflow: hidden;
  .status-container {
    display: flex;
    align-items: center;
    position: relative;
    img {
      width: 100px;
      height: 40px;
    }
    span {
      position: absolute;
      margin: 0;
      left: 6px;
    }
  }
  .card-title {
    font-size: 28px;
    font-weight: 600;
    color: rgb(238, 157, 65);
  }
  .project-info-container {
    padding: 0px 12px;
    text-align: left;
    font-size: 14px;
    .name {
      display: inline-block;
      color: var(--secondary-text);
      margin-right: 6px;
      width: 90px;
      text-align: right;
    }
    .info {
      color: var(--primary-text);
    }
  }
  .action-btn {
    margin-top: 48px;
    width: 240px;
    height: 36px;
  }
}
</style>
