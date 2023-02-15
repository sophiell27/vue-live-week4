
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

import { url } from "./config.js"

const app = createApp({
    data(){
        return {
            user: {}
        }
    },
    methods: {
        login(){
            axios.post(`${url}admin/signin`, this.user)
            .then(res => {
                console.log("登入成功");
                const {token, expired} = res.data;
                document.cookie = `vuew4token=${token};expires=${new Date(expired)}`
                // console.log(`vuew4token=${token};expires=${new Date(expired)}`)
                window.location = "admin-products.html"
            })
            .catch(err => {
                console.dir(err)
                confirm("登入失敗")
            })
        }
    }
});

app.mount("#app")