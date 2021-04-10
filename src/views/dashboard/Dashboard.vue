<template>
  <div>
    <b-table
      :items="items"
      :fields="fields"
      thead-tr-class="th-cell"
      :current-page="currentPage"
      :per-page="perPage"
    >
      <template #cell(operate)>
        <b-button size="sm" class="mr-2">
          Export
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
  name: 'Dashboard',
  data () {
    return {
      fields: [
        'name', 'contributors', 'funds',
        { key: 'operate', label: '' }
      ],
      items: [
        { name: 'BML x PLASM', contributors: '123123', funds: '2,222,000' },
        { name: 'BML x PLASM', contributors: '123123', funds: '2,222,000' }
      ],
      currentPage: 1,
      totalRows: 2,
      perPage: 5
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="less">

</style>
