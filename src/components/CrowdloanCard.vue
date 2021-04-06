<template>
  <div class="card">
    <div class="status-container">
      <img :src="statusIcon" alt="">
      <span>
        {{ projectStatus[chainId][projectId] }}
      </span>
    </div>
    <p class="card-title">
        {{ communityName[communityId] + ' X ' + projectName[projectId] }}
    </p>
    <p class="project-info-container">
        <span class="name">
            Lease period
        </span>
        <span class="info">
            1-4
        </span>
    </p>
        <p class="project-info-container">
        <span class="name">
            Countdown
        </span>
        <span class="info">
            3 days 21 hours
        </span>
    </p>
        <p class="project-info-container">
        <span class="name">
            Fund
        </span>
        <span class="info">
            1645.1565/10.0000 MKSM
        </span>
    </p>

    <ConnectWallet style="margin-top:64px" width="240" v-if="isConnected" />
    <div v-else>
        <button class="action-btn primary-btn" v-show="projectStatus[chainId][projectId] === 'Active'" @click="showContribute=true">
            Contribute
        </button>
        <button class="action-btn primary-btn" v-show="projectStatus[chainId][projectId] === 'Retired'" @click="showWithdraw=true">
            Withdraw
        </button>
        <button class="action-btn primary-btn" disabled="true" v-show="projectStatus[chainId][projectId] === 'Completed'">
            Withdraw
        </button>

    </div>

    <TipContribute v-if="showContribute" @hideContribute="showContribute=false"/>
    <TipWithdraw v-if="showWithdraw" @hideWithdraw="showWithdraw=false"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ConnectWallet from "./Buttons/ConnectWallet"
import TipContribute from "./TipBoxes/TipContribute"
import TipWithdraw from "./TipBoxes/TipWithdraw"
export default {
    data() {
        return {
            showContribute: false,
            showWithdraw: false
        }
    },
  props: {
    chainId: {
      type: String,
    },
    projectId:{
        type: String,
    },
    communityId: {
      type: String,
    },
  },
  components: {
      ConnectWallet,
      TipContribute,
      TipWithdraw
  },
  computed: {
    ...mapState(["projectStatus", 'projectName', 'communityName', 'isConnected']),

    statusIcon() {
      switch (this.projectStatus[this.chainId] && this.projectStatus[this.chainId][this.projectId]) {
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
  width: 300px;
  height: 380px;
  border-radius: 8px;
  background-color: rgb(185, 246, 248);
  margin-bottom: 12px;
  overflow: hidden;
  .status-container {
      display: flex;
      align-items: center;
      position: relative;
      img{
          width: 100px;
          height: 40px;
      }
      span{
          position: absolute;
          margin: 0;
          left: 6px;
      }
  }
  .card-title{
      font-size: 28px;
      font-weight: 600;
      color: rgb(238, 157, 65);
  }
  .project-info-container{
      padding: 0px 12px;
      text-align: left;
      font-size: 14px;
      .name{
          display: inline-block;
          color: var(--secondary-text);
          margin-right: 6px;
          width: 90px;
          text-align: right;
      }
      .info{
          color: var(--primary-text);
      }
  }
  .action-btn{
      margin-top: 64px;
      width: 240px;
      height: 36px;
      
  }
}
</style>