<template>
  <div class="mask" @click="hide">
      <div class="tip-withdraw">
          <p>
              You would withdraw
          </p>
          <button class="primary-btn">
              Confirm
          </button>
      </div>
  </div>
</template>

<script>
export default {
    methods: {
        hide() {
            this.$emit('hideWithdraw')
        }
    },
};
</script>

<style lang="less" scoped>
.tip-withdraw{
    padding: 16px 16px;
    background-color: white;
    border-radius: 8px;
}
</style>