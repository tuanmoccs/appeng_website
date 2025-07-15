<template>
  <header class="header-area header-sticky">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav class="main-nav">
            <!-- ***** Logo Start ***** -->
            <router-link to="/" class="logo">
              <h1>Scholar</h1>
            </router-link>
            <!-- ***** Logo End ***** -->
            <!-- ***** Serach Start ***** -->
            <div class="search-input">
              <form id="search" action="#">
                <input type="text" placeholder="Type Something" id='searchText' name="searchKeyword"
                  onkeypress="handle" />
                <i class="fa fa-search"></i>
              </form>
            </div>
            <!-- ***** Serach Start ***** -->
            <!-- ***** Menu Start ***** -->
            <ul class="nav">
              <li class="scroll-to-section">
                <router-link to="/">
                  Home
                </router-link>
              </li>
              <li class="scroll-to-section">
                <router-link to="/">
                  Listening
                </router-link>
              </li>
              <li class="scroll-to-section">
                <router-link to="/">
                  Reading
                </router-link>
              </li>
              <li class="scroll-to-section">
                <router-link to="/">
                  Speaking
                </router-link>
              </li>
              <li class="scroll-to-section"><router-link to="/">
                  Writing
                </router-link></li>
              <li class="scroll-to-section">
                <router-link to="/register">
                  Register
                </router-link>
              </li>
              <li class="scroll-to-section">
                <router-link to="/login">
                  Login
                </router-link>
              </li>
            </ul>
            <a class='menu-trigger'>
              <span>Menu</span>
            </a>
            <!-- ***** Menu End ***** -->
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
</script>