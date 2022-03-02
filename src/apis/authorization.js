import { apiHelper } from "../utils/helper";

export default {
  login({ email, password }) {
    return apiHelper.post('/singin', {
      email,
      password,
    })
  },
  register(data) {
    return apiHelper.post("/signup", { ...data })
  },
  adminLogin({ email, password }) {
    return apiHelper.post("admin/signin", {
      email,
      password,
    })
  }
}
