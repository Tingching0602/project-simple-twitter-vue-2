<template>
  <div class="container">
    <form @submit.prevent.stop="handleSubmit">
      <div class="logo">
        <img src="../assets/Logo.png" alt="" />
      </div>
      <div class="title">
        <h1>登入 Alphitter</h1>
      </div>

      <div class="row">
        <label for="account">帳號</label>
        <input
          id="account"
          name="account"
          type="text"
          v-model="account"
          placeholder="帳號"
          required
        />
      </div>

      <div class="row">
        <label for="password">密碼</label>
        <input
          id="password"
          name="password"
          type="password"
          v-model="password"
          placeholder="密碼"
          required
        />
      </div>

      <div class="row mt-4">
        <button class="btn signin" type="submit" :disabled="isProcessing">
          {{ isProcessing ? "登入中" : "登入" }}
        </button>
      </div>
      <div class="row link-btns-container">
        <div class="link-btns">
          <router-link class="routerLink" to="/register"
            >註冊 Alphitter</router-link
          >
          <span> &#xb7; </span>
          <router-link class="routerLink" to="/admin/signin"
            >後台登入</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import authorizationAPI from "./../apis/authorization";
import { Toast } from "./../utils/helper";

export default {
  name: "login",
  data() {
    return {
      account: "",
      password: "",
      isProcessing: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.email || !this.password) {
          Toast.fire({
            icon: "warning",
            title: "請輸入email和password",
          });
          return;
        }
        this.isProcessing = true;
        const { data } = await authorizationAPI.login({
          email: this.email,
          password: this.password,
        });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        localStorage.setItem("token", data.token);
        this.$store.commit("setCurrentUser", data.user);
        this.$router.push("/main");
      } catch (error) {
        console.log(error);
        this.isProcessing = false;
        this.password = "";
        Toast.fire({
          icon: "warning",
          title: "登入失敗，請稍後再試",
        });
      }
    },
  },
};
</script>



<style lang="scss" scoped>
@import "./../styles/variables.scss";
.logo {
  margin: 60px 0 30px 0;
}
.logo img {
  width: 50px;
  height: 50px;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.row {
  width: 540px;
  height: 52px;
  margin: 10px;
}
.row label {
  display: none;
  color: $secondaryTextColor;
  font-weight: 700;
}
.title h1 {
  width: 100%;
  text-align: center;
  font-weight: 900;
  font-size: 23px;
}
input {
  background-color: $formBgColor;
  width: 100%;
  height: 52px;
  border: none;
  border-bottom: 2px solid $secondaryTextColor;
}
.btn {
  width: 100%;
  border-radius: 50px;
  height: 50px;
}
button.signin {
  background-color: $orange;
  color: $white;
  font-size: 18px;
  font-weight: 700;
}
.link-btns-container {
  position: relative;
  height: 26px;
}
.link-btns {
  position: absolute;
  right: 0;
}
.routerLink {
  font-weight: 700;
  color: $blue;
  text-decoration: underline;
}
.link-btns-container span {
  color: $blue;
  font-weight: 700;
}
</style>