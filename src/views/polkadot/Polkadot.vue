<template>
  <div>
    <BackToHome title="Polkadot Crowdloan" />
    <div class="cards-container">
        <CrowdloanCard chainId="0" projectId="0" communityId="0"/>
        <CrowdloanCard chainId="0" projectId="1" communityId="1"/>
        <CrowdloanCard chainId="0" projectId="2" communityId="2"/>
    </div>
  </div>
</template>

<script>
import BackToHome from "../../components/Buttons/BackToHome";
import CrowdloanCard from "../../components/CrowdloanCard"
import { mapMutations } from "vuex"

export default {
  name: "Polkadot",
  components: {
    BackToHome,
    CrowdloanCard
  },
  methods: {
      ...mapMutations(['saveProjectStatus', 'saveProjectName', 'saveCommunityName']),
      async getCommunityInfo() {
          this.saveProjectStatus({chainId:'0', project:'0', status:'Active'})
          this.saveProjectStatus({chainId:'0', project:'1', status:'Retired'})
          this.saveProjectStatus({chainId:'0', project:'2', status:'Completed'})

          this.saveProjectName({projectId: '0', name:'Plasma'})
          this.saveProjectName({projectId: '1', name:'Acala'})
          this.saveProjectName({projectId: '2', name:'Phala'})

          this.saveCommunityName({communityId: "0", name:"BML"})
          this.saveCommunityName({communityId: "1", name:"Nutbox"})
          this.saveCommunityName({communityId: "2", name:"Peanut"})
      }
  },
  async created () {
      await this.getCommunityInfo();
  },
};
</script>

<style lang="less" scoped>
.cards-container {
  padding: 24px 64px;
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>