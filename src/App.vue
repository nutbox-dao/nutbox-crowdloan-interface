<template>
  <div id="app">
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <b-navbar toggleable="lg">
            <b-navbar-brand>
              <img src="https://nutbox.io/img/logo.b363fe37.svg" alt="" class="logo-brand"
                   @click="selectMenu(0, '/', 'home')">
            </b-navbar-brand>
            <div class="mobile-menu flex-start-center">
              <b-nav-item class="user-address flex-between-center">
                <img src="~@/static/images/account.png" alt="">
              </b-nav-item>
            </div>
            <div class="menu-btn">
              <img src="~@/static/images/menu-btn.svg" alt="">
              <b-navbar-toggle target="nav-collapse" @click="expandMenu"></b-navbar-toggle>
            </div>

            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav class="mr-auto">
                <b-nav-item v-for="(item,index) of menuOptions" :key="item.id"
                            href="javascript:void(0)" :class="activeNav === index? 'active':''"
                            @click="selectMenu(index, item.url, item.id)">{{ item.label }}
                </b-nav-item>
              </b-navbar-nav>
              <div class="mobile-address">
                <p style="word-break: break-all">{{ userAddress}}</p>
              </div>
              <!-- Right aligned nav items -->
              <b-navbar-nav class="pc-menu">
                <b-nav-item class="user-address">
                  <div v-if="isConnected" class="p-2">
                    <b-dropdown toggle-class="accounts-toggle" variant="text" right no-caret>
                      <template #button-content>
                        <div class="flex-between-center font18" @click="accountsPop=!accountsPop">
                          <b-avatar class="mr-2" size="sm" text=""></b-avatar>
                          <span>{{ formatUserAddress(userAddress) }}</span>
                        </div>
                      </template>
                      <b-dropdown-item v-for="(item,index) of accountsOptions" :key="index">
                        <template>
                          <div class="flex-between-center">
                            <b-avatar class="mr-2" size="sm" text="A"></b-avatar>
                            <div class="account-info">
                              <div class="font-bold">account name</div>
                              <div>{{ formatUserAddress(item) }}</div>
                            </div>
                            <img class="ml-3" v-if="item===userAddress" src="~@/static/images/selected.png" alt="">
                          </div>
                        </template>
                      </b-dropdown-item>
                    </b-dropdown>
                  </div>
                  <ConnectWallet v-else/>
                </b-nav-item>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>
      </div>
      <div class="page-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ConnectWallet from './components/Buttons/ConnectWallet'

export default {
  name: 'App',
  components: {
    ConnectWallet
  },
  computed: {
    ...mapState([
      'isConnected'
    ])
  },
  data () {
    return {
      menuOptions: [
        { id: 'home', url: '/', label: 'Home' },
        { id: 'kusama', url: '/kusama', label: 'Kusuma Crowdload' },
        { id: 'polkadot', url: '/polkadot', label: 'Polkadot Crowdload' }
      ],
      accountsOptions: ['TEwJioeQZzaYxNUDpYMUx15zSxcCtJNmaz', 'NUDpYMUx15zSxcCtJNmazxxxxxxxxxxxxxx'],
      accountsPop: false,
      activeNav: -1,
      menuIsExpand: false,
      userAddress: 'TEwJioeQZzaYxNUDpYMUx15zSxcCtJNmaz'
    }
  },
  mounted () {
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    selectMenu (index, url, id) {
      this.activeNav = index
      this.$router.push(url)
    },
    expandMenu () {
      this.menuIsExpand = !this.menuIsExpand
      if (this.menuIsExpand) {
        document.querySelector('.page-header').classList.add('header-expand')
      } else {
        setTimeout(() => {
          document.querySelector('.page-header').classList.remove('header-expand')
        }, 200)
      }
    },
    formatUserAddress (address) {
      if (address.length < 10) return address
      const start = address.slice(0, 10)
      const end = address.slice(-5)
      return `${start}...${end}`
    },
    showError (err) {
      this.$bvToast.toast(err, {
        title: 'MFund',
        autoHideDelay: 5000,
        variant: 'danger'
      })
    }
  }
}
</script>
<style lang="less">
@import 'static/style/common.less';
:root {
  --yellow-background: #f5ecd8;
  --primary-custom: #ffdb1b;
  --primary-text: #242629;
  --secondary-text: #717376;
  --disable: #bdbfc2;
  --dividers: #e3e5e8;
  --background: #f6f7f9;
  --error: #ff5040;
  --success: #50bf00;
  --link: #408fff;
  --warning: #ff9500;
  --backgroud-state: #b37012;
}
#app,
html,
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
#app {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: RGBA(246, 247, 249, 1);
  font-size: 14px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.page-container {
  //background-color: RGBA(246, 247, 249, 1);
}
.page-header {
  background: white;
  //box-shadow: 0 10px 10px rgba(0, 0, 0, 0.04) ;
  border-bottom-left-radius: 1.2rem;
  border-bottom-right-radius: 1.2rem;
  .navbar-expand-lg {
    background: transparent;
  }
  .menu-btn {
    display: none;
    position: relative;
    .navbar-toggler {
      opacity: 0;
      width: 1.6rem;
      height: 1.6rem;
    }
    img {
      position: absolute;
      width: 1.6rem;
      height: 1.2rem;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .navbar-brand {
    display: flex;
    align-items: center;
  }
  .logo-brand {
    height: 2rem;
  }
  .navbar {
    padding: 0;
  }
  .nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .navbar-nav .nav-link {
    height: 3.6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: bold;
    font-size: .8rem;
    opacity: .5;
  }
  .navbar-nav .active > .nav-link {
    color: var(--primary-custom);
    opacity: 1;
    border-bottom: 4px solid var(--primary-custom);
  }
  .dropdown-menu {
    border-radius: 1.2rem;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.02);
    border: none;
    margin-top: .5rem;
    .dropdown-item {
      padding: .2rem .5rem;
    }
    .account-info {
      flex: 1;
      font-size: .7rem;
    }
    .dropdown-item:hover {
      background: transparent;
    }
  }

  .user-address {
    a {
      opacity: 1 !important;
    }
    img {
      width: 23px;
      margin-right: 10px;
    }
  }
}
</style>
