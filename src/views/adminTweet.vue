<template>
  <div id="AdminTweets">
    <template>
      <!-- AdminSidebar.vue -->
      <adminNavbar :current-status="currentStatus"/>
      <!-- AdminTweetsList.vue -->
      <div class="AdminTweetsPanel">
        <div class="title">
          <h1>推文清單</h1>
        </div>
        <adminTweetList
          v-for="tweet in tweets"
          :key="tweet.id"
          :tweet="tweet"
          @after-delete-tweet="afterDeleteTweet"
        />
      </div>
    </template>
  </div>
</template>

<script>
import adminNavbar from "./../components/adminNavbar";
import adminTweetList from "./../components/adminTweetList";
import { Toast } from "../utils/helper";
import tweetsAPI from "../apis/tweets.js";


export default {
  name: "AdminTweets",
  components: {
    adminNavbar,
    adminTweetList,
  },
  data() {
    return {
      tweets: [],
    };
  },
  created() {
    this.fetchTweets();
  },
  methods: {
    async fetchTweets() {
      try {
        const { data } = await tweetsAPI.getTweets();
        // const { tweets } = response.data;
        this.tweets = data;
      } catch (error) {
        console.log("error", error);
        Toast.fire({
          icon: "error",
          title: "無法取得推文資料，請稍後再試",
        });
      }
    },
    async afterDeleteTweet(tweetId) {
      try {
        const { data } = await tweetsAPI.deleteTweet({ tweetId });

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.tweets = this.tweets.filter((tweet) => tweet.id !== tweetId);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法將餐廳移除最愛，請稍後再試",
        });
        console.log("error", error);
      }
    },
  },
};
</script>

<style lang="scss"scoped>
@import "./../styles/variables.scss";
#AdminTweets {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: auto;
}

.AdminTweetsPanel {
  flex: 1;
  min-height: 100vh;
}

.title {
  height: 55px;
  border-bottom: 1px solid $borderColor;
}

.title h1 {
  font-size: 19px;
  font-weight: 700;
  padding: 13px 0 14px 23px;
  margin: 0;
  color: $mainColor;
}
</style>