<template>
  <div>
    <span class="text-grey-light">
      {{ percent + "" }}
    </span>
    <span>
      {{ 10 + " " }}
    </span>
    <span class="text-grey-light"> contributors </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    paraId: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters(["getFundInfo"]),
    fundInfo() {
      return this.getFundInfo(this.paraId);
    },
    
    percent() {
      console.log("fundinfo", this.paraId, this.fundInfo);
      return (
        parseFloat(this.fundInfo.raised.div(this.fundInfo.cap)).toFixed(2) + "%"
      );
    },
  },
};
</script>

<style lang="less" scoped>
</style>