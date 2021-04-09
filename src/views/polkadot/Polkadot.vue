<template>
  <div class="p-page crowdloan-page">
    <div class="container">
      <!--      <BackToHome title="Kusama Crowdloan" />-->
      <div class="bg-box">
        <div class="bg"></div>
      </div>
      <div class="cards-container row">
        <div class="col-lg-4 col-md-6">
          <CrowdloanCard chainId="0" projectId="0" communityId="0"
                         @showWithdrawModal="withdrawModal=true"
                         @showContributeModal="contributeModal=true"/>
        </div>
        <div class="col-lg-4 col-md-6">
          <CrowdloanCard chainId="0" projectId="1" communityId="1"
                         @showWithdrawModal="withdrawModal=true"
                         @showContributeModal="contributeModal=true"/>
        </div>
        <div class="col-lg-4 col-md-6">
          <CrowdloanCard chainId="0" projectId="2" communityId="2"
                         @showWithdrawModal="withdrawModal=true"
                         @showContributeModal="contributeModal=true"/>
        </div>
      </div>
    </div>
    <b-modal v-model="contributeModal" modal-class="custom-modal" centered hide-header hide-footer no-close-on-backdrop>
      <TipContribute @hideContribute="contributeModal = false"/>
    </b-modal>
    <b-modal v-model="withdrawModal" modal-class="custom-modal" centered hide-header hide-footer no-close-on-backdrop>
      <TipWithdraw @hideWithdraw="withdrawModal = false"/>
    </b-modal>
  </div>
</template>

<script>
import CrowdloanCard from '../../components/CrowdloanCard'
import { mapMutations } from 'vuex'
import TipContribute from '../../components/TipBoxes/TipContribute'
import TipWithdraw from '../../components/TipBoxes/TipWithdraw'
export default {
  name: 'Polkadot',
  components: {
    CrowdloanCard,
    TipContribute,
    TipWithdraw
  },
  data () {
    return {
      contributeModal: false,
      withdrawModal: false
    }
  },
  methods: {
    ...mapMutations(['saveProjectStatus', 'saveProjectName', 'saveCommunityName']),
    async getCommunityInfo () {
      this.saveProjectStatus({
        chainId: '0',
        project: '0',
        status: 'Active'
      })
      this.saveProjectStatus({
        chainId: '0',
        project: '1',
        status: 'Retired'
      })
      this.saveProjectStatus({
        chainId: '0',
        project: '2',
        status: 'Completed'
      })

      this.saveProjectName({
        projectId: '0',
        name: 'Plasma'
      })
      this.saveProjectName({
        projectId: '1',
        name: 'Acala'
      })
      this.saveProjectName({
        projectId: '2',
        name: 'Phala'
      })

      this.saveCommunityName({
        communityId: '0',
        name: 'BML'
      })
      this.saveCommunityName({
        communityId: '1',
        name: 'Nutbox'
      })
      this.saveCommunityName({
        communityId: '2',
        name: 'Peanut'
      })
    }
  },
  async created () {
    await this.getCommunityInfo()
  },
}
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
