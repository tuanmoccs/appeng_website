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
              <!-- <li class="scroll-to-section reading-dropdown" @mouseenter="readingDropdownVisible = true"
                @mouseleave="readingDropdownVisible = false">
                <span class="reading-link">Reading ▼</span>
                <ul class="reading-submenu" v-show="readingDropdownVisible">
                  <li><router-link to="/word">Word</router-link></li>
                  <li><router-link to="/quizz">Quizz</router-link></li>
                  <li><router-link to="/tests">Test</router-link></li>
                </ul>
              </li> -->
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

              <!-- User Dropdown Menu -->
              <li class="scroll-to-section user-dropdown" v-else>
                <div class="dropdown-container" @click="toggleDropdown">
                  <img :src="getAvatarUrl()" class="avatar" alt="Avatar" />
                  <span class="username">{{ currentUser?.name || 'User' }}</span>
                  <i class="dropdown-arrow" :class="{ 'rotated': dropdownVisible }">▼</i>
                </div>

                <!-- Dropdown Menu -->
                <div class="dropdown-menu" :class="{ 'show': dropdownVisible }">
                  <router-link to="/profile" class="dropdown-item" @click="closeDropdown">
                    <i class="fa-solid fa-user" style="color: black; margin-right: 10px;"></i>
                    <span style="color: black">Thông tin cá nhân</span>
                  </router-link>
                  <div class="dropdown-divider"></div>
                  <button @click="handleLogout" class="dropdown-item logout-btn">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Đăng xuất</span>
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
      dropdownVisible: false,
      readingDropdownVisible: false
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
    closeDropdown() {
      this.dropdownVisible = false;
    },
    handleLogout() {
      this.logout();
      this.dropdownVisible = false;
      this.$router.push('/');
    },
    getAvatarUrl() {
      if (!this.currentUser?.avatar) return anhdaidien;

      // Nếu avatar là URL hoàn chỉnh thì dùng luôn       
      if (this.currentUser.avatar.startsWith('http')) {
        return this.currentUser.avatar;
      }

      // Nếu avatar là tên file thì tạo đường dẫn       
      return new URL(`@/assets/avatars/${this.currentUser.avatar}`, import.meta.url).href;
    }
  },
  mounted() {
    // Close dropdown when clicking outside     
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.dropdownVisible = false;
      }
    });
  },
  beforeUnmount() {
    // Clean up event listener
    document.removeEventListener('click', this.handleClickOutside);
  }
} 
</script>

<style scoped>
/* User Dropdown Styles */
.user-dropdown {
  position: relative;
}

.dropdown-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 12px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dropdown-container:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.dropdown-container:hover .avatar {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
}

.username {
  color: white;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-arrow {
  color: white;
  font-size: 10px;
  transition: transform 0.3s ease;
  margin-left: 4px;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px) scale(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 20px;
  width: 12px;
  height: 12px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: none;
  border-right: none;
  transform: rotate(45deg);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  color: black;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #6c5ce7;
  transform: translateX(4px);
}

.dropdown-item .icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.dropdown-item span {
  font-weight: 500;
}

.dropdown-divider {
  height: 1px;
  background: #e9ecef;
  margin: 8px 0;
}

.logout-btn {
  color: #dc3545;
}

.logout-btn:hover {
  background: #fff5f5;
  color: #dc3545;
}

/* Animation cho dropdown */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .username {
    display: none;
  }

  .dropdown-container {
    padding: 6px;
    border-radius: 50%;
  }

  .dropdown-menu {
    right: -8px;
    min-width: 180px;
  }

  .dropdown-menu::before {
    right: 16px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .dropdown-menu {
    background: #2d3748;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .dropdown-menu::before {
    background: #2d3748;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .dropdown-item {
    color: #e2e8f0;
  }

  .dropdown-item:hover {
    background: #4a5568;
    color: #9f7aea;
  }

  .dropdown-divider {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* Fix cho position trong header */
.header-area {
  position: relative;
  z-index: 999;
}

.main-nav {
  position: relative;
}

.nav {
  position: relative;
  z-index: 1000;
}

.reading-dropdown {
  position: relative;
  font-size: 14px;
  color: #fff;
  line-height: 40px;
  margin-top: -7px;
}

.reading-link {
  cursor: pointer;
  padding: 8px 12px;
  display: inline-block;
}

.reading-submenu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #7a6ad8;
  border: 1px solid #ddd;
  min-width: 120px;
  padding: 4px 0;
  margin: 0;
  list-style: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reading-submenu li {
  padding: 0;
}

.reading-submenu li a {
  display: block;
  padding: 6px 12px;
  color: #333;
  font-size: 14px;
  text-decoration: none;
  border-radius: 0;
}

.reading-submenu li a:hover {
  background: #f5f5f5;
}
</style>