import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

import { url, path } from "./config.js";

import paginationComponent from "./components/paginationComponent.js"
import productModalComponent from "./components/productModalComponent.js";
import delModalComponent from './components/delModalComponent.js'
const app = createApp({
  data() {
    return {
      products: [],
      pagination: "",
      productModal: "",
      delModal:"",
      temp: {
        imagesUrl: ['']
      }
    };
  },
  components: {
    paginationComponent,
    productModalComponent,
    delModalComponent
  },
  methods: {
    checkLogin() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)vuew4token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .post(`${url}api/user/check`)
        .then((res) => {
          console.log("驗證成功");
          this.getProducts();
        })
        .catch((err) => {
          confirm("請重新登入");
          window.location = "index.html";
        });
    },
    getProducts(page=1) {
      axios
        .get(`${url}api/${path}/admin/products?page=${page}`)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination
        //   console.log(this.products);
        })
        .catch((err) => {
          confirm("無法取得產品列表");
        });
    },
    editProduct(){
      let baseurl;
      let method;
      console.log(this.temp)
      if (this.temp.id){
        baseurl = `${url}api/${path}/admin/product/${this.temp.id}`;
        method = "put"
      }else {
        baseurl = `${url}api/${path}/admin/product`;
        method = "post";
      }

      axios[method](baseurl,{data:this.temp})
            .then(res => {
                console.log("成功編輯產品");
                this.productModal.hide();
                this.getProducts();
                this.temp= {imagesUrl:[]};
            })
            .catch(err => {
              console.log("無法編輯")
                // console.log(err.response.data.message)
            });
    }, 
    delProduct(){
        axios.delete(`${url}api/${path}/admin/product/${this.temp.id}`)
        .then(res => {
            console.log("已成功刪除產品")
            this.delModal.hide();
            this.getProducts();
            console.log(this.products)
        })
        .catch(err => {
            console.log("刪除產品失敗")
        })
    },
    showModal(status,product){
       if (status === "newProduct"){
        this.temp = {imagesUrl: ['']};
        this.productModal.show();
       }else if (status === "editProduct"){
        this.temp = {...product};
        console.log(this.temp.imagesUrl)
        this.productModal.show();
       }else if (status === "delProduct"){
        this.temp = product;
        this.delModal.show();
       }
       console.log(this.temp)
    }
    
  },
  mounted() {
    this.checkLogin();
    
    this.productModal = new bootstrap.Modal(this.$refs.productModal);
    this.delModal = new bootstrap.Modal(this.$refs.delModal);
    // console.log(this.productModal)
  }
});

app.mount("#app");
