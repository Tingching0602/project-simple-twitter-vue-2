<!-- Use preprocessors via the lang attribute! e.g. <template lang="pug"> -->
<template>
  <div id="admin">
    <div class="admin-top">
      <img class="admin-logo" src="../assets/Logo.png" alt="" />
      <h1>後台登入</h1>
    </div>
    <form class="admin-form" @submit.prevent.stop="handleSubmit">
      <div class="form-label-group">
        <label for="account">帳號</label>
        <input
          id="account"
          v-model="account"
          name="account"
          type="text"
          class="form-control"
          autocomplete="username"
          placeholder="帳號"
          required
          autofocus
        />
      </div>
      <div class="form-label-group">
        <label for="password">密碼</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          class="form-control"
          autocomplete="new-password"
          placeholder="密碼"
          required
        />
      </div>
      <button
        @click="success"
        class="btnLogin"
        type="submit"
        :disabled="isProcessing"
      >
        登入
      </button>
      <div class="text-center">
        <div class="text-link">
          <router-link to="/login" class="btnFontLogin">前台登入</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import authorization from "./../apis/authorization";
import { Toast2 } from "./../utils/helper";
export default {
  name: "admin",
  data() {
    return {
      email: "",
      account: "",
      password: "",
      isProcessing: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.account || !this.password) {
          Toast2.fire({
            title: "請填入 email 和 password",
          });
          return;
        }
        this.isProcessing = true;

        const response = await authorization.adminLogin({
          email: this.email,
          password: this.password,
        });
        console.log(response);
        const { data } = response;

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        localStorage.setItem("token", data.token);
        this.$router.push("/admin/tweets");
      } catch (error) {
        Toast2.fire({
          title: "請確認您輸入的帳號密碼",
        });
        this.isProcessing = false;
        console.log("error", error);
      }
    },
  },
};
</script>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style lang="scss" scoped>
@import "./../styles/variables.scss";
#admin {
  text-align: center;
  color: $bgColor;
  margin: 3.75rem 0 1.25rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.admin-logo {
  margin-left: 15px;
  width: 50px;
  height: 50px;
}
h1 {
  font-weight: bold;
  color: $mainColor;
  font-size: 23px;
  margin-top: 10px;
  margin-bottom: 50px;
}
.form-label-group {
  position: relative;
  bottom: 30px;
  width: 540px;
  margin: 10px;
}
label {
  display: none;
}

.placeholder {
  position: absolute;
  left: 0.625rem;
  top: 0.313rem;
  color: $secondaryTextColor;
  font-size: 15px;
  font-weight: 500;
  line-height: 15px;
}
input {
  width: 540px;
  height: 52px;
  border-radius: 4px;
  background-color: $formBgColor;
  margin-bottom: 2em;
  padding: 1.3em 0 0 1em;
  font-size: 19px;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid $secondaryTextColor;
}
.text-center {
  margin-top: 2em;
  text-align: right;
  font-weight: bold;
  color: $blue;
  margin-right: 14.5rem;
  margin-bottom: 45.43rem;
}

.btnFontLogin {
  position: relative;
  left: 240px;
  bottom: 28px;
  font-weight: 900;
  text-decoration-line: underline;
  margin-top: 20px;
  color: $blue;
}
.btnLogin {
  width: 540px;
  height: 50px;
  border-radius: 50px;
  background-color: $orange;
  font-size: 18px;
  font-weight: 700;
  color: $white;
  padding: 0.625rem 2.5rem;
  border: none;
}
</style>