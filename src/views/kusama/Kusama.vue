<template>
  <div class="k-page crowdloan-page">
    <div class="loading-bg" v-if="loadingFunds">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">Loading, please wait</p>
    </div>
    <template v-else>
      <div class="bg" v-if="funds.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p>No ongoing auction</p>
      </div>
      <div class="cards-container">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 col-md-6" v-for="para of funds" :key="para.paraId">
              <div
                v-for="communitId of communitIds"
                :key="communitId"
              >
                <CrowdloanCard
                  :paraId="para.paraId"
                  :communityId="communitId"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CrowdloanCard from "../../components/CrowdloanCard";
import {
  getFundInfo,
  subBlock,
  contribute
} from "../../utils/polkadot";
import { mapMutations, mapState, mapGetters } from "vuex";
import { SURPORT_CHAINS, SURPORT_COMMUNITIES } from "../../config";
import TipContribute from "../../components/TipBoxes/TipContribute";
import TipWithdraw from "../../components/TipBoxes/TipWithdraw";

export default {
  name: "Kusama",
  components: {
    CrowdloanCard,
    TipContribute,
    TipWithdraw,
  },
  data() {
    return {
      communitIds: [],
    };
  },
  computed: {
    ...mapState(["projectFundInfos", "symbol", "loadingFunds", 'balance']),
    funds() {
      const fundInfos = this.getFundInfos();
      return fundInfos || [];
    },
  },
  methods: {
    ...mapGetters(["getFundInfos"]),
    ...mapMutations([
      "saveProjectStatus",
      "saveProjectName",
      "saveCommunityName",
    ]),
  },
  async mounted() {
    this.communitIds = Object.keys(SURPORT_COMMUNITIES);
    subBlock();
    const chains = Object.keys(SURPORT_CHAINS);
    await getFundInfo(chains);
  },
  created() {
    this.$store.commit("saveSymbol", "ROCOCO");
  },
};
</script>

<style lang="less">
.crowdloan-page {
  height: 100%;
  background: rgba(246, 247, 249, 1);
  overflow: hidden;
  position: relative;
  .bg {
    position: absolute;
    left: 50%;
    top: 4.6rem;
    transform: translateX(-50%);
    margin: auto;
    max-width: 34rem;
    max-height: 34rem;
    width: 90vw;
    height: 90vw;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 219, 27, 0.7),
      rgba(141, 231, 255, 0)
    );
    background-repeat: repeat-x;
    border-radius: 34rem;
    background-position: center top;
  }
  .empty-bg {
    position: relative;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      height: 7rem;
    }
  }
  .loading-bg {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      margin-top: 12rem;
    }
    p {
      margin-top: 1rem;
      font-weight: 400;
      color: #bdbfc2;
      line-height: 22px;
    }
  }
  .cards-container {
    height: 100%;
    overflow: auto;
    padding-top: 6.6rem;
    padding-bottom: 3rem;
  }
}
</style>
