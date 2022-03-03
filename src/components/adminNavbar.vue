<template>
  <nav>
    <div id="logo">
      <router-link to="admin/signin">
        <img src="../assets/Logo.png" alt="logo" />
      </router-link>
    </div>
      <div class="menu">
      <ul>
        <li :class="{ active: currentStatus.isIndex }">
          <router-link to="/admin/tweets" class="menu__item">
            <img src="../assets/icon_index.png" alt="index" class="tweet" />
            <span class="menu__item__title">推文清單</span>
          </router-link>
        </li>
        <li :class="{ active: currentStatus.isUser }">
          <router-link to="/admin/users" class="menu__item">
            <img src="../assets/icon_user.png" alt="index" class="user" />
            <span class="menu__item__title">使用者列表</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div id="log-out" @click.stop.prevent="logOut">
      <div>
        <img src="./../assets/Vector.png" alt="logoOut" class="icon" />
      </div>
      <p>登出</p>
    </div>
  </nav>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "adminNavbar",
  created() {
    const location = this.$route.path.split("/")[2];
    this.setCurrentLocation(location);
  },
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  data() {
    return {
      tweets: false,
      users: false,
    };
  },
  methods: {
    logout() {
      // delete token => log out
      this.$store.commit("revokeAuthentication");
      this.$router.push("/admin/signin");
    },
    setCurrentLocation(location) {
      console.log("location: " + location);
      if (location === "tweets") {
        this.tweets = true; // at tweets
        this.users = false;
      } else {
        this.tweets = false;
        this.users = true; // at users
      }
    },
  },
}

</script>
<style lang="scss" scoped>
@import "./../styles/variables.scss";
nav {
  margin-right: 2rem;
  margin-top: 0.7rem;
  position: relative;
  // width:378px;
  height: 100%;
  #logo {
    width: 50px;
    height: 50px;
  }
  .menu {
    margin-top: 47.78px;
    &__item {
      display: flex;
      align-items: center;
      color: $mainColor;
      font-weight: 700;
      margin-top: 35px;
      &__title {
        margin-left: 20px;
      }
    }
  }
  .adminItem .menu_item_title .active p {
    color: $orange;
  }

  .index,
  .user {
    width: 22.75px;
  }

  #log-out {
    position: fixed;
    bottom: 1rem;
    display: flex;
    justify-content: center;
    cursor: pointer;
    .icon {
      display: inline-block;
      width: 18px;
      height: 16px;
    }
    p {
      margin-left: 23px;
      font-weight: 700;
    }
  }
}
</style>
