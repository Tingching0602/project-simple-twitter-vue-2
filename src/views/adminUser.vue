<template>
  <div id="AdminUser">
    <template>
      <!-- adminNavbar.vue -->
      <adminNavbar />
      <!-- adminTweetList.vue -->
      <div class="AdminUserPanel">
        <div class="title">
          <h1>使用者列表</h1>
        </div>
        <div class="admin-user-card">
          <adminUserCard v-for="user in users" :key="user.id" :user="user" />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import adminNavbar from "./../components/adminNavbar";
import adminUserCard from "./../components/adminuserCard";
import { Toast2 } from "./../utils/helper";
import userAPI from "../apis/users";
export default {
  name: "AdminUser",
  components: {
    adminNavbar,
    adminUserCard,
  },
  data() {
    return {
      user: [],
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const { data } = await userAPI.getTotalUser();
        this.users = data;
      } catch (error) {
        Toast2.fire({
          title: "無法取得使用者資料，請稍後再試",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./../styles/variables.scss";
#AdminUser {
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.adminUserPanel {
  flex: 1;
}

.admin-user-card {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}

.title {
  height: 55px;
  border-bottom: 1px solid $borderColor;
}

.title h1 {
  font-size: 18px;
  font-weight: 700;
  padding: 13px 0 14px 26px;
  margin: 0;
}
</style>