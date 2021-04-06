<template>
  <div class="mask" @click="hide">
    <div class="tip-contribute">
      <p>
        <span> Contribute to </span>
        <span class="big"> PLASM </span>
        <span> crowdloan fund in </span>
        <span class="big"> Kusuma </span>
        <span> network </span>
      </p>
      <p>
        <span> amount: </span>
        <input type="text" placeholder="Staking amount" />
        <span class="big"> KSM </span>
      </p>
      <button class="primary-btn">
          Contribute
      </button>
    </div>
  </div>
</template>

<script>
export default {
    methods: {
        hide() {
            this.$emit('hideContribute')
        }
    },
};
</script>

<style lang="less" scoped>
.tip-contribute {
  padding: 16px 16px;
  border-radius: 8px;
  background-color: white;
  margin-top: -24%;
  width: 360px;
  p {
    text-align: left;
  }
  .big {
    font-size: 18px;
    font-weight: 500;
    color: seagreen;
  }
}
</style>