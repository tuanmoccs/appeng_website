<template>
  <header class="header-area header-sticky">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav class="main-nav">
            <!-- ***** Logo Start ***** -->
            <router-link to="/" class="logo">
              <h1>ELearning</h1>
            </router-link>

            <ul class="nav">
              <li class="scroll-to-section">
                <router-link to="/">Home</router-link>
              </li>
              <li class="scroll-to-section">
                <router-link to="/listening-tests">Listening</router-link>
              </li>
              <li class="scroll-to-section">
                <router-link to="/tests">Reading</router-link>
              </li>
              <li class="scroll-to-section">
                <router-link to="/">Speaking</router-link>
              </li>
              <li class="scroll-to-section">
                <router-link to="/">Writing</router-link>
              </li>
              <li class="scroll-to-section" v-if="!isLogged">
                <router-link to="/register">Register</router-link>
              </li>
              <li class="scroll-to-section" v-if="!isLogged">
                <router-link to="/login">Login</router-link>
              </li>
              <li class="scroll-to-section relative" v-else @click="toggleDropdown">
                <!-- Avatar -->
                <img src="@/assets/images/member-01.jpg" class="avatar" alt="Avatar" />
                <!-- Dropdown -->
                <div v-if="dropdownVisible" class="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48 z-10">
                  <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-100">
                    Thông tin cá nhân
                  </router-link>
                  <button @click="handleLogout" class="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Đăng xuất
                  </button>
                </div>
              </li>
            </ul>
            <a class='menu-trigger'>
              <span>Menu</span>
            </a>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import anhdaidien from '@/assets/images/member-01.jpg';
export default {
  name: "Header",
  data() {
    return {
      dropdownVisible: false
    }
  },
  computed: {
    ...mapState(['userInfo']),
    ...mapGetters(['isLogged', 'currentUser'])
  },
  methods: {
    ...mapActions(['logout']),
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    handleLogout() {
      this.logout();
      this.dropdownVisible = false;
      this.$router.push('/');
    },
    getAvatarUrl() {
      if (!currentUser?.avatar) return anhdaidien;

      // Nếu avatar là URL hoàn chỉnh thì dùng luôn
      if (currentUser.avatar.startsWith('http')) {
        return currentUser.avatar;
      }

      // Nếu avatar là tên file thì tạo đường dẫn
      return new URL(`@/assets/avatars/${currentUser.avatar}`, import.meta.url).href;
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.dropdownVisible = false;
      }
    });
  }
}
</script>
<style>
.avatar {
  background: none;
  height: 40px;
  width: 40px;
}
</style>