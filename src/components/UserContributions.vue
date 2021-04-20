<template>
  <div v-show="items.length > 0">
    <b-card class="table-card">
      <b-card-text class="font20 font-bold text-left"
        >My contributions on {{ chain }}</b-card-text
      >
      <b-table
        :items="items"
        :fields="fields"
        thead-tr-class="th-cell"
        table-class="c-table"
        hover
        tbody-tr-class="c-tr"
        thead-class="c-th"
      >
        <template #cell(community)="row">
          <b-avatar size="sm" class="mr-2">C</b-avatar>
          <span>{{ row.item.community }}</span>
        </template>
        <template #cell(chain)="row">
          <b-avatar size="sm" class="mr-2">C</b-avatar>
          <span>{{ row.item.chain }}</span>
        </template>
      </b-table>
    </b-card>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      class="change-page-box"
    ></b-pagination>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { API_URL } from "../config";
import axios from "axios";

export default {
  name: "UserContributions",
  props: {
    chain: {
      type: String,
    },
  },
  computed: {
    ...mapState(["account"]),
  },
  data() {
    return {
      cancelToken: null,
      fields: [
        { key: "community", label: "Community", class: "text-left" },
        { key: "chain", label: "Chain", class: "text-left" },
        { key: "trieIndex", label: "TrieIndex", class: "text-right" },
        { key: "date", label: "Lease period", class: "text-right" },
        { key: "amount", label: "Staking amount", class: "text-right" },
        { key: "status", label: "Status", class: "text-right" },
        { key: "time", label: "Staking time" },
        { key: "operate", label: "", class: "text-left" },
      ],
      items: [
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 2,
          date: "1-4",
          amount: "2,222,000",
          status: 0,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 2,
          date: "1-4",
          amount: "2,222,000",
          status: 0,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 1,
          date: "1-4",
          amount: "2,222,000",
          status: 0,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 1,
          date: "1-4",
          amount: "2,222,000",
          status: 1,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 0,
          date: "1-4",
          amount: "2,222,000",
          status: 1,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 0,
          date: "1-4",
          amount: "2,222,000",
          status: 1,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 0,
          date: "1-4",
          amount: "5,222,000",
          status: 2,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 0,
          date: "1-4",
          amount: "4,222,000",
          status: 2,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 0,
          date: "1-4",
          amount: "3,222,000",
          status: 1,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 0,
          date: "1-4",
          amount: "2,000",
          status: 1,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 0,
          date: "1-4",
          amount: "2,000",
          status: 1,
          time: "1 Days 22hours",
        },
        {
          community: "BML",
          chain: "Plasm",
          trieIndex: 0,
          date: "1-4",
          amount: "2,000",
          status: 2,
          time: "1 Days 22hours",
        },
      ],
      currentPage: 1,
      totalRows: 12,
      perPage: 7,
    };
  },
  watch: {
    async currentPage(newValue, oldValue) {
      if (newValue == oldValue) return
      this.requstData(newValue - 1, this.perPage);
    },
  },
  methods: {
    async requstData(offset, limit) {
      this.cancelToken && this.cancelToken();
      this.cancelToken = axios.CancelToken;
      const res = await axios
        .post(API_URL + "/contrib/find/contributor", {
          relaychain: this.chain.toLowerCase(),
          contributor: this.account.address,
          offset,
          limit,
        })
        .then((res) => {
          this.totalRows = res && res.count;
          console.log({ chain: this.chain, res: res.data });
        })
        .catch((err) => {});
    },
  },
  async created() {
    this.requstData();
  },
};
</script>

<style lang="less" scoped>
.table-card {
  border-radius: 1.4rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.02);
  border: none;
  .card-body {
    padding: 0;
    margin: 1rem;
    overflow: auto;
  }
}

.Active {
  color: rgba(80, 191, 0, 1);
}
.Retired {
  color: rgba(248, 182, 42, 1);
}
.Completed {
  color: rgba(255, 91, 77, 1);
}
.change-page-box {
  margin: 1rem auto;
}
</style>