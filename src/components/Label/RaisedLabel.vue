<template>
  <div>
    <span>
      {{ items[0] }}
    </span>
    <span class="text-grey-light">
      {{ items[1] }}
    </span>
    <span>
      {{ items[2] }}
    </span>
    <span class="text-grey-light">
      {{ items[3] }}
    </span>
    <span>
      {{ items[4] }}
    </span>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { TOKEN_SYMBOL } from "../../config";
import BN from "bn.js";
export default {
  props: {
    paraId: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState(["symbol"]),
    ...mapGetters(["getFundInfo"]),
    fund() {
      return this.getFundInfo(this.paraId);
    },
    items() {
      const raised = this.convertUni(this.fund.raised);
      const cap = this.convertUni(this.fund.cap);
      const raisedStr = this.formatBanlance(raised[0]);
      const capStr = this.formatBanlance(cap[0]);
      return [
        raisedStr[0],
        raisedStr[1],
        raised[1] + "/" + capStr[0],
        capStr[1],
        cap[1] + TOKEN_SYMBOL[this.symbol],
      ];
    },
  },
  methods: {
    convertUni(uni) {
      let unit = " ";
      if (uni >= 1e18) {
        uni = uni.div(new BN(1e18));
        unit = " E";
      } else if (uni >= 1e15) {
        uni = uni.div(new BN(1e15));
        unit = " P";
      } else if (uni >= 1e12) {
        uni = uni.div(new BN(1e12));
        unit = " T";
      } else if (uni >= 1e9) {
        uni = uni.div(new BN(1e9));
        unit = " B";
      } else if (uni >= 1e6) {
        uni = uni.div(new BN(1e6));
        unit = " M";
      } else if (uni >= 1e3) {
        uni = uni.div(new BN(1e3))
        unit = " K"
      }
      return [uni, unit];
    },

    formatBanlance(value) {
      if (!value) return ["0.", "0000"];
      const str = parseFloat(value).toFixed(4).toString();
      const integer = str.split(".")[0];
      const fraction = str.split(".")[1];
      return [integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".", fraction];
    },
  },
};
</script>

<style lang="less" scoped>
</style>