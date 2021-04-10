<template>
  <div class="tip-modal">
    <img class="close-btn" src="~@/static/images/close.svg" alt="" @click="hide">
    <div class="tip-contribute">
      <div class="text-center mb-4 font20">
        Contribute to<span class="big"> PLASM </span>crowdloan <br>
        fund in<span class="big"> Kusuma </span>network
      </div>
      <div class="input-group-box">
        <div class="label">Amount</div>
        <div class="flex-between-center">
          <input type="number" v-model="inputAmount" placeholder="Staking amount">
          <span>KSM</span>
        </div>
      </div>
      <div class="input-group-box">
        <div class="label">Nominator</div>
        <div class="flex-between-center">
          <input type="text" v-model="inputAmount" placeholder="Your nominator's address">
          <span class="text-grey" style="opacity: .4">(optional)</span>
        </div>
      </div>
      <button class="primary-btn">
        Confirm & Sign
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputAmount: ''
    }
  },
  methods: {
    hide () {
      this.$emit('hideContribute')
    }
  }
}
</script>

<style lang="less">
.tip-modal {
  position: relative;
  .close-btn {
    position: absolute;
    right: 0;
    width: 1rem;
    height: 1rem;
  }
  .primary-btn {
    width: 100%;
    margin-top: 1rem;
  }
  .big {
    background-image: linear-gradient(to right, var(--primary-custom), var(--primary-custom));
    background-size: 90% 50%;
    background-repeat: no-repeat;
    background-position-y: bottom;
    background-position-x: 50%;
  }
}
.input-group-box {
  margin-bottom: .5rem;
  font-size: .8rem;
  input {
    flex: 1;
    border: none;
    background: rgba(246, 247, 249, 1);
    font-size: .8rem;
    height: 2.4rem;
    padding: .4rem .8rem;
    box-sizing: border-box;
    border-radius: .8rem;
    margin-right: 1rem;
  }
  span {
    display: inline-block;
    min-width: 5rem;
  }
}
</style>
