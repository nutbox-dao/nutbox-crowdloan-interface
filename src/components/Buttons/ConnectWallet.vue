<template>
    <div>   
        <button @click="connect" :style="style" id="connect">
            Connect Wallet
        </button>
    </div>
</template>

<script>
    export default {
        name: 'ConnectWallet',
        props: {
            width: {
                type: String,
                default: '160px'
            },
            height: {
                type: String,
                default: '38px'
            },
            radius: {
                type: String,
                default: '8px'
            }
        },
        computed: {
            style() {
                return "width:"+this.width+';' + 'height:' + this.height + ';' + 'border-radius:'+ this.radius + ';'
            }
        },
        methods: {
            connect() {
                
            }
        },
    }
</script>

<style lang="less" scoped>
#connect{
    border: none;
    background-color: blanchedalmond;
}
#connect:hover{
    cursor: pointer;
    background-color: rgb(250, 225, 200);
}
</style>