<template>
  <div class="tip-modal">
    <img
      class="close-btn"
      src="~@/static/images/close.svg"
      alt=""
      @click="hide"
    />
    <div class="tip-contribute">
      <div class="text-center font20">{{ $t('crowdloan.youWillWithdraw')}}</div>
      <div class="tip-withdraw mt-3 mb-1">
        {{ contributed + " " + tokenSymbol }}
      </div>
      <button
        class="primary-btn"
        @click="withdrawClick"
        :disabled="isWithdraw"
      >
      <b-spinner small type="grow" v-show="isWithdraw"></b-spinner>
        {{ $t('crowdloan.confirm') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { TOKEN_SYMBOL } from "../../config";
import { withdraw } from "../../utils/crowdloan";
import BN from "bn.js";

export default {
  props: {
    paraId: {
      type: Number,
    },
  },
  data() {
    return {
      isWithdraw: false
    };
  },
  computed: {
    ...mapState(["symbol", "balance", "account"]),
    ...mapGetters(["getFundInfo"]),
    contributed() {
      const fund = this.getFundInfo(this.paraId);
      // console.log("fund", fund);
      // console.log(
      //   "funded",
      //   fund.funds.filter((c) => c.contributor === this.account.address)
      // );

      const contributions = fund.funds
        .filter((c) => c.contributor === this.account.address)
        .reduce((total, c) => total.add(c.amount), new BN(0));
      return parseFloat(contributions.toNumber()).toFixed(4);
    },
    tokenSymbol() {
      return TOKEN_SYMBOL[this.symbol];
    },
  },
  methods: {
    hide() {
      if (this.isWithdraw) return;
      this.$emit("hideWithdraw");
    },
    async withdrawClick() {
      if (this.contributed <= 0){
        this.$bvToast.toast('No Need To Withdraw', {
          title: "Info",
          variant: 'info'
        })
        return
      }
      try {
        this.isWithdraw = true
        const res = await withdraw(this.paraId, (info, param) => {
          this.$bvToast.toast(info, param);
        },()=>{
          this.$emit("hideWithdraw");
        });
      } catch (e) {
        this.$bvToast.toast(e.message, {
          title: "Error",
          variant: "danger",
        });
      } finally{
        this.isWithdraw = false
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tip-withdraw {
  font-size: 1.2rem;
  font-weight: bold;
  color: rgba(255, 91, 77, 1);
  text-align: center;
}
</style>
