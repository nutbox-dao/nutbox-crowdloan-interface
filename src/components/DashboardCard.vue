<template>
  <div class="row">
    <div class="col-lg-4 col-md-6" v-for="(item, index) of items" :key="index">
      <div class="c-card">
        <div class="card-title-box flex-start-center">
          <div class="icons">
            <img class="icon2" src="~@/static/images/tron.svg" alt="" />
            <img class="icon1" src="~@/static/images/eth.svg" alt="" />
          </div>
          <div class="title-text font20 font-bold">
            <span>BML</span>
            <img src="~@/static/images/close.svg" alt="" />
            <span>PLASM</span>
          </div>
        </div>
        <div class="h-line"></div>
        <div class="detail-info-box">
          <div class="project-info-container">
            <span class="name"> Contributors </span>
            <div class="info">{{ item.contributors }}</div>
          </div>
          <div class="project-info-container">
            <span class="name"> Fund </span>
            <div class="info">{{ fund(index) }}</div>
          </div>
        </div>
        <button class="primary-btn" @click="downloadCsv">Export</button>
      </div>
    </div>
  </div>
</template>

<script>
import CsvExportor from "csv-exportor";
export default {
  data() {
    return {
      items: [
        {
          paraId: 200,
          contributors: 18,
          raised: 2398234,
        },
        {
          paraId: 300,
          contributors: 8,
          raised: 9088723,
        },
      ],
    };
  },
  props: {
      chain: {
          type: String,
      },
  },
  computed: {
      
  },
  methods: {
    fund(index) {
      return this.items[index].raised;
    },
    downloadCsv() {
        // 获取详情信息

        // 下载
        const headr = [
            "community",
            "chain",
            "trieIndex",
            "date",
            "amount",
            "status",
            "time",
          ]
      CsvExportor.downloadCsv(
        this.items,
        {
          header
        },
        "contribution.csv"
      );
    },
  },
  mounted() {
    // 请求数据
  },
};
</script>

<style lang="scss" scoped>
</style>