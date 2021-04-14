<template>
  <div class="contribution-page ">
      <div class="font-bold font32 mt-3 mb-3 text-left">Cotributions</div>
    <div class="container" v-for="chain in chainName" :key="chain">
      <b-card class="table-card">
        <b-card-text class="font20 font-bold text-left">My contributions on {{chain}}</b-card-text>
        <b-table
          :items="getItems(chain)"
          :fields="fields"
          thead-tr-class="th-cell"
          :current-page="currentPage"
          :per-page="perPage"
          table-class="c-table"
          hover
          tbody-tr-class="c-tr"
          thead-class="c-th"
        >
          <template #cell(community)="row">
            <b-avatar size="sm" class="mr-2">C</b-avatar>
            <span>{{row.item.community}}</span>
          </template>
          <template #cell(chain)="row">
            <b-avatar size="sm" class="mr-2">C</b-avatar>
            <span>{{row.item.chain}}</span>
          </template>
          <!-- <template #cell(status)="row">
            <span class="font-bold" :class="statusLabel[row.item.status]">{{statusLabel[row.item.status]}}</span>
          </template> -->
          <!-- <template #cell(operate)="row">
            <div size="sm" class="mr-2 text-primary font-bold">
              {{ row.item.status ? 'Contribute' : 'Withdraw'}}
            </div>
          </template> -->
        </b-table>
      </b-card>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        class="change-page-box"
      ></b-pagination>
    </div>
  </div>
</template>

<script>

import { CHAIN_NAME } from '../../config'

export default {
  name: 'Contributions',
  data () {
    return {
      statusLabel: { 0: 'Active', 1: 'Retired', 2: 'Completed' },
      chainName: Object.values(CHAIN_NAME),
      fields: [
        { key: 'community', label: 'Community', class: 'text-left'},
        { key: 'chain', label: 'Chain', class: 'text-left' },
        { key: 'trieIndex', label: 'TrieIndex', class: 'text-right' },
        { key: 'date', label: 'Lease period', class: 'text-right' },
        { key: 'amount', label: 'Staking amount', class: 'text-right' },
        { key: 'status', label: 'Status', class: 'text-right' },
        { key: 'time', label: 'Staking time' },
        { key: 'operate', label: '', class: 'text-left' }
      ],
      polkadot: [
        { community: 'BML', chain: 'Plasm', trieIndex:2, date: '1-4', amount: '2,222,000', status: 0, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:2, date: '1-4', amount: '2,222,000', status: 0, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:1, date: '1-4', amount: '2,222,000', status: 0, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:1, date: '1-4', amount: '2,222,000', status: 1, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:0, date: '1-4', amount: '2,222,000', status: 1, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:0, date: '1-4', amount: '2,222,000', status: 1, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:0, date: '1-4', amount: '5,222,000', status: 2, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:0, date: '1-4', amount: '4,222,000', status: 2, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:0, date: '1-4', amount: '3,222,000', status: 1, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:0, date: '1-4', amount: '2,000', status: 1, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:0, date: '1-4', amount: '2,000', status: 1, time: '1 Days 22hours' },
        { community: 'BML', chain: 'Plasm', trieIndex:0, date: '1-4', amount: '2,000', status: 2, time: '1 Days 22hours' }
      ],
      currentPage: 1,
      totalRows: 12,
      perPage: 7
    }
  },
  methods: {
    getItems(chain) {
      return this[chain.toLowerCase()]
    }
  }
}
</script>

<style scoped lang="less">
.contribution-page {
  height: 100%;
  background: rgba(246, 247, 249, 1);
  overflow: scroll;
  position: relative;
  padding-top: 4.6rem;
}
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
