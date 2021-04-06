<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
:root {
  --yellow-background: #f5ecd8;
  --primary: #ffdb1b;
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
.mask{
  position: absolute;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
}
.primary-btn{
  padding: 6px 8px;
  border-radius: 8px;
  border:none;
  background-color: var(--primary);
}
.primary-btn:hover{
  cursor: pointer;
}
</style>
