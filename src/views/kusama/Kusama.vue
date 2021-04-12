<template>
  <div class="k-page crowdloan-page">
    <div class="bg" v-if="funds.length > 0"></div>
    <div class="empty-bg" v-else>
      <img src="~@/static/images/empty-data.png" alt="">
      <p>No ongoing auction</p>
    </div>
    <div class="cards-container">
      <div class="container">
        <div class="row">
          <div v-for="para of funds" :key="para">
            <div class="col-lg-4 col-md-6" v-for="community of communitId"
                 :key="community">
              <CrowdloanCard :paraId="para.paraId" :communityId="community"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CrowdloanCard from "../../components/CrowdloanCard";
import {
  getFundInfo,
  subBlock,
  NumberTo4BytesU8A,
  loadAccounts,
  connect,
} from "../../utils/polkadot";
import { mapMutations, mapState, mapGetters } from "vuex";
import { SURPORT_CHAINS, SURPORT_COMMUNITIES } from "../../config";
import TipContribute from '../../components/TipBoxes/TipContribute'
import TipWithdraw from '../../components/TipBoxes/TipWithdraw'

export default {
  name: 'Kusama',
  components: {
    CrowdloanCard,
    TipContribute,
    TipWithdraw
  },
  data() {
    return {
      communitId: [],
    };
  },
  computed: {
    ...mapState(["projectFundInfos",'symbol']),
    funds (){
      const fundInfos = this.getFundInfos()
      return fundInfos || []
    }
  },
  methods: {
    ...mapGetters(['getFundInfos']),
    ...mapMutations([
      "saveProjectStatus",
      "saveProjectName",
      "saveCommunityName",
    ]),
  },
  mounted() {
    this.communitId = Object.keys(SURPORT_COMMUNITIES);
  },
  async created() {
    this.$store.commit("saveSymbol", "ROCOCO");
      await subBlock();
      const chains = Object.keys(SURPORT_CHAINS);
      await getFundInfo(chains);
  },
}
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
    top: 2rem;
    transform: translateX(-50%);
    margin: auto;
    max-width: 34rem;
    max-height: 34rem;
    width: 90vw;
    height: 90vw;
    background-image: linear-gradient(
      to bottom,
      rgba(166, 225, 249, 1),
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
  .cards-container {
    height: 100%;
    overflow: auto;
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}
</style>
