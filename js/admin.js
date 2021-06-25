import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/api",
      apiPath: "yangalice212",
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  mounted() {
    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      {
        keyboard: false,
      }
    );
    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal"),
      {
        keyboard: false,
      }
    );
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token === "") {
      alert("請重新登入");
      window.location = "login.html";
    }
    axios.defaults.headers.common.Authorization = token;
    this.getData();
  },
  methods: {
    getData(page = 1) {
      axios
        .get(`${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
          } else {
            console.log(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateProduct() {
      let url = `${this.apiUrl}/${this.apiPath}}/admin/product`;
      let http = "post";
      if (!this.isNew) {
        url = `${this.apiUrl}/${this.apiPath}}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }
      axios[http](url, { data: this.tempProduct }).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          productModal.hide();
          this.getData();
        } else {
          console.log(res.data.message);
        }
      });
      // if (this.isNew) {
      //   //當產品不存在，新增至產品列表
      //   this.products.push({
      //     id: Date.now(),
      //     ...this.tempProduct,
      //   });
      //   this.tempProduct = {
      //     imagesUrl: [], //清空 tempProduct
      //   };
      //   productModal.hide();
      // } else {
      //   const index = this.products.findIndex(
      //     (item) => item.id === this.tempProduct.id
      //   );
      //   this.products[index] = this.tempProduct;
      //   productModal.hide();
      // }
    },
    openModal(status, item) {
      if (status === "new") {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (status === "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (status === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    delProduct() {
      axios
        .delete(
          `${this.apiUrl}/${this.apiPath}}/admin/product/${this.tempProduct.id}`
        )
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            delProductModal.hide();
            this.getData();
          } else {
            console.log(res.data.message);
          }
        });
      //   this.products.splice(
      //     this.products.findIndex((item) => item.id === this.tempProduct.id),
      //     1
      //   );
      //   delProductModal.hide();
      // },
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
}).mount("#app");
