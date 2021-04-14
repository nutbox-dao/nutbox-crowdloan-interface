<template>
  <div class="tip-modal">
    <img
      class="close-btn"
      src="~@/static/images/close.svg"
      alt=""
      @click="hide"
    />
    <div class="tip-contribute">
      <div class="text-center mb-4 font20">
        Contribute to<span class="big"> {{ paraName }} </span>crowdloan <br />
        fund in<span class="big"> {{ symbol }} </span>network
      </div>
      <div class="input-group-box">
        <div class="label">Amount</div>
        <div class="flex-between-center">
          <input
            type="number"
            v-model="inputAmount"
            placeholder="Staking amount"
          />
          <span>{{ paraTokenSymbol }}</span>
        </div>
      </div>
      <div class="input-group-box">
        <div class="label">Nominator</div>
        <div class="flex-between-center">
          <input
            type="text"
            v-model="inputNonimator"
            placeholder="Your nominator's address"
          />
          <span class="text-grey" style="opacity: 0.4">(optional)</span>
        </div>
      </div>
      <button class="primary-btn" @click="confirm" :disabled="isComtribution">
        <b-spinner small type="grow" v-show="isComtribution"></b-spinner>Confirm
        & Sign
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  TOKEN_SYMBOL,
  SURPORT_CHAINS,
} from "../../config";
import { contribute, validAddress } from "../../utils/polkadot";
import BN from "bn.js";

export default {
  data() {
    return {
      inputAmount: "",
      inputNonimator: "",
      paraName: SURPORT_CHAINS[this.symbol][this.paraId],
      paraTokenSymbol: TOKEN_SYMBOL[this.symbol],
      isComtribution: false,
    };
  },
  props: {
    communityId: {
      type: String,
    },
    paraId: {
      type: Number,
    },
  },
  computed: {
    ...mapState(["symbol", "balance"]),
    ...mapGetters(["getFundInfo"]),
  },
  methods: {
    hide() {
      if (this.isComtribution) return;
      this.$emit("hideContribute");
    },
    checkInput() {
      const reg = /^\d+(\.\d+)?$/;
      const res = reg.test(this.inputAmount);
      if (!res) {
        this.$bvToast.toast("Input error!", {
          title: "Tips",
          autoHideDelay: 5000,
          variant: "warning", // info success danger
        });
        return false;
      }

      if (
        this.inputNonimator &&
        this.inputNonimator.length > 0 &&
        !validAddress(this.inputNonimator)
      ) {
        this.$bvToast.toast("Wrong Nominator Address", {
          title: "Tips",
          autoHideDelay: 5000,
          variant: "warning", // info success danger
        });
        return false;
      }else{
        this.inputNonimator = this.communityId
      }

      const amount = parseFloat(this.inputAmount);

      if (amount < 1) {
        this.$bvToast.toast(
          "Input is less than the minimum allowed contribution of 1.0000",
          {
            title: "Tips",
            autoHideDelay: 5000,
            variant: "warning",
          }
        );
        return;
      }

      // below cap
      const fund = this.getFundInfo(this.paraId);
      const raised = fund.raised;
      const cap = fund.cap;
      const gap = cap.sub(raised);
      console.log('gao', gap.toNumber(), amount);

      if (gap.lt(new BN(amount))) {
        this.$bvToast.toast("Out of cap", {
          title: "Tips",
          autoHideDelay: 5000,
          variant: "warning", // info success danger
        });
        return false;
      }

      if (this.balance.lte(new BN(amount))) {
        this.$bvToast.toast("Insufficient Balance", {
          title: "Tips",
          autoHideDelay: 5000,
          variant: "warning", // info success danger
        });
        return false;
      }
      return true;
    },
    async confirm() {
      if (!this.checkInput()) {
        return;
      }
      try {
        this.isComtribution = true;
        const trieIndex = this.getFundInfo(this.paraId).trieIndex;
        const res = await contribute(
          this.paraId,
          parseFloat(this.inputAmount),
          this.communityId,
          this.inputNonimator,
          trieIndex,
          (info, param) => {
            this.$bvToast.toast(info, param);
          }
        );
        if (res) {
          console.log("res", res);
          // this.$emit('hideContribute')
          this.$bvToast.toast("Contribution Success!", {
            title: 'Info',
            autoHideDelay: 5000,
            variant: 'success'
          })
        }
      } catch (e) {
        console.log('eee', e);
        this.$bvToast.toast(e.message, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger",
        });
      } finally {
        this.isComtribution = false;
      }
    },
  },
};
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
    background-image: linear-gradient(
      to right,
      var(--primary-custom),
      var(--primary-custom)
    );
    background-size: 90% 50%;
    background-repeat: no-repeat;
    background-position-y: bottom;
    background-position-x: 50%;
  }
}
.input-group-box {
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  input {
    flex: 1;
    border: none;
    background: rgba(246, 247, 249, 1);
    font-size: 0.8rem;
    height: 2.4rem;
    padding: 0.4rem 0.8rem;
    box-sizing: border-box;
    border-radius: 0.8rem;
    margin-right: 1rem;
  }
  span {
    display: inline-block;
    min-width: 5rem;
  }
}
</style>
