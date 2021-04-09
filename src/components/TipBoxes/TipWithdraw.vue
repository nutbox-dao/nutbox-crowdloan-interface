<template>
  <div class="tip-modal">
    <img class="close-btn" src="~@/static/images/close.svg" alt="" @click="hide">
    <div class="tip-contribute">
      <div class="text-center font20">You Would Withdraw</div>
      <div class="tip-withdraw mt-3 mb-1">12345.2323 KSM</div>
      <button class="primary-btn" @click="hide">
        Confirm & Sign
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    hide () {
      this.$emit('hideWithdraw')
    }
  },
}
</script>

<style lang="less" scoped>
.tip-withdraw {
  font-size: 1.2rem;
  font-weight: bold;
  color: rgba(255, 91, 77, 1);
  text-align: center;
}
</style>
