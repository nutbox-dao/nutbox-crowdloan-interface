<template>
  <div>
    <b-table
      :items="items"
      :fields="fields"
      thead-tr-class="th-cell"
      :current-page="currentPage"
      :per-page="perPage"
    >
      <template #cell(operate)="row">
        <b-button size="sm" class="mr-2">
          {{ row.item.status ? 'Contribute' : 'Withdraw'}}
        </b-button>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
    ></b-pagination>
  </div>
</template>

<script>
export default {
  name: 'Contributions',
  data () {
    return {
      fields: [
        'chain',
        { key: 'date', label: 'Lease period' },
        { key: 'amount', label: 'Staking amount' },
        {
          key: 'status',
          label: 'Status',
          formatter: (value) => {
            return value ? 'Active' : 'Retired'
          }
        },
        { key: 'time', label: 'Staking time' },
        { key: 'operate', label: '' }
      ],
      items: [
        { chain: 'Plasm', date: '1-4', amount: '2,222,000', status: true, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '2,222,000', status: false, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '2,222,000', status: false, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '2,222,000', status: false, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '2,222,000', status: true, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '2,222,000', status: true, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '5,222,000', status: true, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '4,222,000', status: true, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '3,222,000', status: true, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '2,000', status: true, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '2,000', status: true, time: '1 Days 22hours' },
        { chain: 'Plasm', date: '1-4', amount: '2,000', status: true, time: '1 Days 22hours' }
      ],
      currentPage: 1,
      totalRows: 12,
      perPage: 5
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="less">

</style>
