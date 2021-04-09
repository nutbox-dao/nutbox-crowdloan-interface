<template>
  <div class="k-page crowdloan-page">
    <div class="container">
      <!--      <BackToHome title="Kusama Crowdloan" />-->
      <div class="bg-box">
        <div class="bg"></div>
      </div>
      <div class="cards-container row">
        <div class="col-lg-4 col-md-6">
          <CrowdloanCard :paraId="200" communityId="0"
                         @showWithdrawModal="withdrawModal=true"
                         @showContributeModal="contributeModal=true"/>
        </div>
        <div class="col-lg-4 col-md-6">
          <CrowdloanCard :paraId="200" communityId="1"
                         @showWithdrawModal="withdrawModal=true"
                         @showContributeModal="contributeModal=true"/>
        </div>
        <div class="col-lg-4 col-md-6">
          <CrowdloanCard :paraId="300" communityId="2"
                         @showWithdrawModal="withdrawModal=true"
                         @showContributeModal="contributeModal=true"/>
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
import CrowdloanCard from '../../components/CrowdloanCard'
import { getFundInfo, subBlock } from '../../utils/polkadot'
import { mapMutations } from 'vuex'
import TipContribute from '../../components/TipBoxes/TipContribute'
import TipWithdraw from '../../components/TipBoxes/TipWithdraw'

export default {
  name: 'Kusama',
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
  },
  mounted () {
    this.saveProjectName({
      paraId: 200,
      name: 'Plasma'
    })
    this.saveProjectName({
      paraId: 300,
      name: 'Acala'
    })
    this.saveProjectName({
      paraId: 300,
      name: 'Acala'
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
  },
  async created () {
    this.$store.commit('saveSymbol', 'ROCOCO')
    await subBlock()

    await getFundInfo(200)
    await getFundInfo(300)
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
      background-image: linear-gradient(to bottom, rgba(166, 225, 249, 1), rgba(141, 231, 255, 0));
      border-radius: 34rem;
    }
  }

  .cards-container {
    padding: 3rem 0;
  }
}
</style>
