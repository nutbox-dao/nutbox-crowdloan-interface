<template>
  <div id="app">
    <div id="account">
      <AccountConnector/>
    </div>
    <div>
      <b-carousel
        id="carousel-1"
        :interval="3000"
        indicators
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333;"
      >
        <b-carousel-slide v-for="(item, index) of bannerImg" :key="index"
                          :img-src="item"></b-carousel-slide>
      </b-carousel>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class='crowd-select' @click="goto('/kusama')">
          <p>
            Kusama Crowdloan
          </p>

        </div>
      </div>
      <div class="col-md-6">
        <div class="crowd-select">
          <p>
            Polkadot Crowdloan
          </p>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AccountConnector from '../components/Wallet/AccountConnector'

export default {
  components: {
    AccountConnector,
  },
  data () {
    return {
      bannerImg: [
        'https://picsum.photos/1024/480/?image=52',
        'https://picsum.photos/1024/480/?image=54',
        'https://picsum.photos/1024/480/?image=55',
        'https://picsum.photos/1024/480/?image=56'
      ]
    }
  },
  methods: {
    goto(network) {
      this.$router.push(network)
    }
  },
}
</script>
<style scoped lang="less">
#account{
  display: flex;
  flex-direction: row-reverse;
}
.crowd-select{
  width: 100%;
  height: 160px;
  margin-top: 40px;
  border-radius: 8px;
  background-color: #c7ceb1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p{
    font-size: 20px;
    font-weight: 500;
  }
}
.crowd-select:hover{
  cursor: pointer;
}
</style>
