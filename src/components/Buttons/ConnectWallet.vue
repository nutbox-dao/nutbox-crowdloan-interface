<template>
  <div>
    <button @click="connect" class="primary-btn">
      Connect Wallet
    </button>
  </div>
</template>

<script>
export default {
  name: 'ConnectWallet',
  props: {
    width: {
      type: Number,
      default: 160
    },
    height: {
      type: Number,
      default: 38
    },
    radius: {
      type: Number,
      default: 8
    }
  },
  computed: {
    style () {
      return 'width:' + this.width + 'px;' + 'height:' + this.height + 'px;' + 'border-radius:' + this.radius + 'px;'
    }
  },
  methods: {
    connect () {

    }
  }
}
</script>

<style lang="less" scoped>
</style>
