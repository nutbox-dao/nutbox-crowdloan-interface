<template>
  <div class="home-page">
<!--    <div id="account">-->
<!--      <AccountConnector/>-->
<!--    </div>-->
    <div class="bg"></div>
    <div class="container">
      <div class="banner-box">
        <b-carousel
          id="carousel-1"
          :interval="3000"
          indicators
          img-height="20rem"
          background="RGBA(246, 247, 249, 1)"
          style="text-shadow: 1px 1px 2px #333;"
        >
<!--          <b-carousel-slide v-for="(item, index) of bannerImg" :key="index"-->
<!--                            :img-src="item">-->
<!--            <template>-->
<!--              <div class="row">-->
<!--                <div class="col-md-7">-->
<!--                  <div class="font40 font-bold text-black">The Scalable, Multichain <br>-->
<!--                    Network for Radical Innovation.</div>-->
<!--                  <p class="text-grey font14">Unprecedented interoperability and scalability for blockchain developers-->
<!--                    who want to quickly push the limits of what’s possible.</p>-->
<!--                </div>-->
<!--              </div>-->
<!--            </template>-->
<!--          </b-carousel-slide>-->
          <b-carousel-slide v-for="(item, index) of bannerImg" :key="index"
                            img-blank img-alt="Blank image">
            <template>
              <div class="row">
                <div class="col-md-7">
                  <div class="font40 font-bold text-black">The Scalable, Multichain <br>
                    Network for Radical Innovation.</div>
                  <p class="text-grey font14">Unprecedented interoperability and scalability for blockchain developers
                    who want to quickly push the limits of what’s possible.</p>
                </div>
              </div>
            </template>
          </b-carousel-slide>
        </b-carousel>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class='crowd-select card-1' @click="goto('/kusama')">
            <img src="https://nutbox.io/img/logo.b363fe37.svg" alt="">
            <div class="font28 font-bold mt-2 mb-4">Kusuma Crowdload</div>
            <button class="primary-btn">Enter</button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="crowd-select card-2">
            <img src="https://nutbox.io/img/logo.b363fe37.svg" alt="">
            <div class="font28 font-bold mt-2 mb-4">Polkadot Crowdload</div>
            <button class="primary-btn">Enter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AccountConnector from '../components/Wallet/AccountConnector'

export default {
  components: {
    AccountConnector
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
    goto (network) {
      this.$router.push(network)
    }
  }
}
</script>
<style scoped lang="less">
.home-page {
  position: absolute;
  top: 3.6rem;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 30%;
    background-color: RGBA(246, 247, 249, 1);
    border-bottom-left-radius: 10%;
    border-bottom-right-radius: 10%;
  }
  .container {
  }
  .banner-box {
    height: 20rem;
    overflow: hidden;
    padding: 2rem 0;
    border-radius: 1.4rem;
  }
}

#account{
  display: flex;
  flex-direction: row-reverse;
}
.crowd-select{
  width: 100%;
  height: 16rem;
  margin-top: 40px;
  border-radius: 1.4rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.02);
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &.card-1 {
    border-bottom: 4px solid #000000;
  }
  &.card-2 {
    border-bottom: 4px solid #E61C84;
  }
  img {
    height: 3rem;
  }
}
.crowd-select:hover{
  cursor: pointer;
}
</style>
