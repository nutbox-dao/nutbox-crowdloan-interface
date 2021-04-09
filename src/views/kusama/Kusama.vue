<template>
  <div>
    <BackToHome title="Kusama Crowdloan" />
    <div class="cards-container row">
      <div class="col-lg-4"><CrowdloanCard :paraId="200" communityId="0" /></div>
      <div class="col-lg-4"><CrowdloanCard :paraId="200" communityId="1" /></div>
      <div class="col-lg-4"><CrowdloanCard :paraId="300" communityId="2" /></div>
    </div>
  </div>
</template>

<script>
import BackToHome from "../../components/Buttons/BackToHome";
import CrowdloanCard from "../../components/CrowdloanCard";
import { getFundInfo, subBlock } from "../../utils/polkadot";
import { mapMutations } from "vuex"

export default {
  name: "Kusama",
  components: {
    BackToHome,
    CrowdloanCard,
  },
  data() {
    return {};
  },
  methods: {
      ...mapMutations(['saveProjectStatus', 'saveProjectName', 'saveCommunityName']),
  },
  mounted() {
    this.saveProjectName({ paraId: 200, name: "Plasma" });
    this.saveProjectName({ paraId: 300, name: "Acala" });
    this.saveProjectName({ paraId: 300, name: "Acala" });

    this.saveCommunityName({ communityId: "0", name: "BML" });
    this.saveCommunityName({ communityId: "1", name: "Nutbox" });
    this.saveCommunityName({ communityId: "2", name: "Peanut" });
  },
  async created() {
    this.$store.commit("saveSymbol", "ROCOCO");
    await subBlock();

    await getFundInfo(200);
    await getFundInfo(300)
  },
};
</script>

<style lang="less" scoped>
.cards-container {
  padding: 24px 0;
  //display: flex;
  //align-content: center;
  //flex-wrap: wrap;
  //justify-content: space-evenly;
}
</style>
