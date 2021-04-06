<template>
  <div id="app">
    <div id="account">
      <AccountConnector/>
    </div>
    <div id="ad">
      <p>
        Advice  
      </p>
      
    </div>
    <div id="crowd-select-box">
      <div class='crowd-select' @click="goto('/kusama')">
        <p>
          Kusama Crowdloan
        </p>
        
      </div>
      <div class="crowd-select" @click="goto('/polkadot')">
        <p>
          Polkadot Crowdloan
        </p>
        
      </div>
    </div>
  </div>
</template>


<script>
import AccountConnector from '../components/Wallet/AccountConnector'
import { getFund } from '../utils/polkadot'

export default {
  components: {
    AccountConnector,
  },
  methods: {
    goto(network) {
      this.$router.push(network)
    }
  },
  async created () {
    await getFund();
  },
}
</script>


<style lang="less">
#account{
  display: flex;
  flex-direction: row-reverse;
}
#ad{
  height: 240px;
  background-color: aquamarine;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  p{
    text-align: center;
    line-height: 100%;
  }
}
#crowd-select-box{
  display: flex;
  justify-content: space-evenly;
}

.crowd-select{
  width: 360px;
  height: 160px;
  margin-top: 26%;
  border-radius: 8px;
  background-color: #c7ceb1;
  p{
    margin-top: 56px;
    font-size: 20px;
    font-weight: 500;
  }
}

.crowd-select:hover{
  cursor: pointer;
}
</style>
