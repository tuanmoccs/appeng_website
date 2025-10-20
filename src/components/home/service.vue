<template>
  <div class="services section" id="services">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6">
          <div class="service-item">
            <div class="icon">
              <img src="/src/assets/images/service-01.png" alt="online degrees">
            </div>
            <div class="main-content">
              <h4>Reading Test</h4>
              <p>Practice reading with diverse and engaging topics, then test your ability to understand key ideas and
                details.</p>
              <div class="main-button">
                <router-link to="/tests">Learn Now</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="service-item">
            <div class="icon">
              <img src="/src/assets/images/service-02.png" alt="short courses">
            </div>
            <div class="main-content">
              <h4>Listening Test</h4>
              <p>Practice your listening skills with engaging audio lessons and exercises designed to improve
                comprehension and vocabulary.</p>
              <div class="main-button">
                <router-link to="/listening-tests">Learn Now</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="service-item">
            <div class="icon">
              <img src="/src/assets/images/service-03.png" alt="web experts">
            </div>
            <div class="main-content">
              <h4>Quizzes</h4>
              <p>Test your English with fun and interactive quizzes covering grammar, vocabulary, and real-life
                conversations.</p>
              <div class="main-button">
                <router-link to="/quizzes">Learn Now</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>