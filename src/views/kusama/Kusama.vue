<template>
  <div class="k-page crowdloan-page">
    <div class="container">
      <!--      <BackToHome title="Kusama Crowdloan" />-->
      <div class="bg-box"><div class="bg"></div></div>
      <div class="cards-container row">
        <div v-for="para of projectFundInfos" :key="para">
          <div class="col-lg-4 col-md-6">
            <CrowdloanCard
              :paraId="para.paraId"
              :communityId="community"
              v-for="community of communitId"
              :key="community"
            />
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="contributeModal" modal-class="custom-modal" centered hide-header hide-footer no-close-on-backdrop>
      <TipContribute @hideContribute="contributeModal = false"/>
    </b-modal>
    <b-modal v-model="withdrawModal" modal-class="custom-modal" centered hide-header hide-footer no-close-on-backdrop>
      <TipWithdraw @hideWithdraw="withdrawModal = false" />
    </b-modal>
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
import { mapMutations, mapState } from "vuex";
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
    ...mapState(["projectFundInfos"]),
  },
  methods: {
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
    connect(async () => {
      loadAccounts();
      await subBlock();
      const chains = Object.keys(SURPORT_CHAINS);
      await getFundInfo(chains);
    });
  },
}
</script>

<style lang="less">
.crowdloan-page {
  position: relative;
  padding: 1rem;
  background: rgba(246, 247, 249, 1);

  .bg-box {
    position: absolute;
    left: 0;
    right: 0;

    .bg {
      margin: auto;
      width: 34rem;
      height: 34rem;
      background-image: linear-gradient(
        to bottom,
        rgba(166, 225, 249, 1),
        rgba(141, 231, 255, 0)
      );
      border-radius: 34rem;
    }
  }

  .cards-container {
    padding: 3rem 0;
  }
}
</style>
