<template>
  <form @submit.prevent.stop="handleSubmit($event)">
    <div class="row">
      <label for="account">帳號<span class="note ml-5">*帳號長度不得大於 50 字元</span></label>
      <input id="account" name="account" type="text" v-model="form.account" required maxlength="50" />
    </div>

    <div class="row">
      <label for="name">名稱<span class="note ml-5">*名稱長度不得大於 50 字元</span></label>
      <input id="name" name="name" type="text" v-model="form.name" maxlength="50" required />
    </div>

    <div class="row">
      <label for="email">Email<span class="note ml-5">*信箱長度不得大於 50 字元</span></label>
      <input id="email" name="email" type="email" v-model="form.email" maxlength="50" required />
    </div>

    <div class="row">
      <label for="password">密碼<span class="note ml-5">*密碼長度需介於 4 和 12 之間</span></label>
      <input id="password" name="password" type="password" v-model="form.password" required maxLength="12" />
    </div>
    <div class="row">
      <label for="passwordCheck">密碼確認<span class="note ml-3">*密碼長度需介於 4 和 12 之間</span></label>
      <input id="passwordCheck" name="passwordCheck" type="password" v-model="form.checkPassword" required />
    </div>

    <template v-if="isRegister">
      <div class="row mt-4">
        <button class="btn submit" type="submit" :disabled="isProcessing">
          {{ isProcessing ? "註冊中.." : "註冊" }}
        </button>
      </div>
      <div class="row">
        <button class="btn cancel" @click.stop.prevent="goBackToSignIn">
          取消
        </button>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <button v-if="!isSaved" class="btn update" type="submit" :disabled="isProcessing">
          {{ isProcessing ? "儲存中.." : "儲存" }}
        </button>
        <button v-else class="btn update" disabled>已儲存</button>
      </div>
    </template>
  </form>
</template>
<script>
import { Toast } from "../utils/helper";
import authorization from "../apis/authorization";
import usersAPI from "../apis/users";
import { mapState } from "vuex";
export default {
  name: "registerForm",
  props: {
    isRegister: {
      // if signUp => signUp => API POST: /users
      // if not signUp => accountEdit => API PUT: /users/:id
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.fetchCurrentUser(this.currentUser);
  },
  data() {
    return {
      form: {
        name: "",
        account: "",
        email: "",
        password: "",
        checkPassword: "",
      },
      isProcessing: false,
      isSaved: true,
      userChanged: false,
    };
  },
  methods: {
    fetchCurrentUser(newVal) {
      const { name, email, account } = newVal;
      this.form = {
        ...this.form,
        name,
        email,
        account,
      };
    },
    goBackToSignIn() {
      this.$router.push("/login");
    },
    handleSubmit(e) {
      const formDataCheckResult = this.formDataCheck();
      if (!formDataCheckResult) {
        return (this.isProcessing = false);
      }
      if (this.isRegister) {
        this.handleSignUpSubmit(e);
      } else {
        this.handleSaveSetting(e);
      }
    },
    formDataCheck() {
      let result = false;
      if (!this.form.account) {
        Toast.fire({
          icon: "info",
          title: "請填寫帳號！",
        });
        return result;
      }
      if (!this.form.name) {
        Toast.fire({
          icon: "info",
          title: "請填寫名稱！",
        });
        return result;
      }
      if (!this.form.email) {
        Toast.fire({
          icon: "info",
          title: "請填寫 Email！",
        });
        return result;
      }
      if (!this.form.password) {
        Toast.fire({
          icon: "info",
          title: "請填寫密碼！",
        });
        return result;
      }
      if (this.form.password.length > 12 || this.form.password.length < 4) {
        Toast.fire({
          icon: "info",
          title: "密碼長度不得小於 4 或超過 12！",
        });
        return result;
      }
      if (!this.form.checkPassword) {
        Toast.fire({
          icon: "info",
          title: "請填寫密碼確認！",
        });
        return result;
      }
      if (this.form.password !== this.form.checkPassword) {
        Toast.fire({
          icon: "error",
          title: "密碼不相符！",
        });
        return result;
      }
      console.log("Data check passed");
      return (result = true);
    },
    async handleSignUpSubmit() {
      try {
        this.isProcessing = true;
        const formData = this.form;
        // call api to post formData
        const { data } = await authorization.register(formData);
        if (data.status !== "success") {
          throw new Error(data);
        }
        Toast.fire({
          icon: "success",
          title: "註冊成功！",
        });
        // 轉址
        this.$router.push('/login');
      } catch (error) {
        console.log(error);
        const { data } = error.response
        if (data.message.length === 1) {
          if (data.message[0].error === 'Account is exists.') {
            Toast.fire({
              icon: "warning",
              title: "account 已重複註冊！",
            })
            this.isProcessing = false
            return
          } else if (data.message[0].error === 'Email is exists.') {
            Toast.fire({
              icon: "warning",
              title: "email 已重複註冊！",
            })
            this.isProcessing = false
            return 
          }
        }
      }
    },
    async handleSaveSetting() {
      const formDataCheckResult = this.formDataCheck();
      if (!formDataCheckResult) {
        return;
      }
      try {
        this.isProcessing = true;
        const userId = this.currentUser.id;
        const formData = {
          ...this.form,
          page: "setting",
        };
        const { data } = await usersAPI.update(userId, formData);
        console.log(data);
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        Toast.fire({
          icon: "success",
          title: "資料修改成功！",
        });
        this.isProcessing = false;
        this.isSaved = true;
        this.userChanged = true;
        this.form.password = "";
        this.form.checkPassword = "";
      } catch (error) {
        console.log(error);
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法變更使用者資訊，請稍候再試！",
        });
      }
    },
  },
  watch: {
    currentUser(newVal) {
      this.fetchCurrentUser(newVal);
    },
    form: {
      handler: function () {
        if (!this.userChanged) {
          // true
          return (this.userChanged = true);
        }
        this.isSaved = false;
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>
<style lang="scss"scoped>
@import "./../styles/variables.scss";
form {
  display: flex;
  flex-direction: column;
  margin: 20px 0 0 15px;
  width: 642px;
}
.row {
  width: 642px;
  margin: 10px 0;
}
.row label {
  padding-left: 11px;
  color: $secondaryTextColor;
  font-weight: 700;
  display: block;
  width: 100%;
}
.row input {
  padding-left: 11px;
  font-weight: 500;
  font-size: 19px;
  background-color: $formBgColor;
  width: 100%;
  border: none;
  border-bottom: 2px solid $secondaryTextColor;
}
.note {
  font-size: 15px;
  color: $orange;
}
.btn {
  width: 100%;
  border-radius: 50px;
  height: 50px;
}
button.submit,
button.update {
  background-color: $orange;
  color: $white;
  font-size: 18px;
  font-weight: 700;
}
button.cancel {
  color: $blue;
  text-decoration: underline;
  font-size: 18px;
  font-weight: 700;
}
.row:last-child {
  position: relative;
  height: 50px;
}
button.update {
  position: absolute;
  right: 0;
  width: 122px;
  font-size: 18px;
}
</style>