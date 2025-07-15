<template>
  <div class="contact-us section" id="contact">
    <div class="container">
      <div class="row">
        <div class="col-lg-6  align-self-center">
          <div class="section-heading">
            <h6>E-Learning</h6>
            <h2>Get newest lesson</h2>
            <p>Thanks for visiting our website! We offer completely free English lessons for you. Feel free to support
              us by sharing our site with your friends!</p>
            <div class="special-offer">
              <span class="offer">off<br><em>50%</em></span>
              <h6>Valide: <em>24 April 2036</em></h6>
              <h4>Special Offer <em>50%</em> OFF!</h4>
              <a href="#"><i class="fa fa-angle-right"></i></a>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="contact-us-content">
            <form id="contact-form" action="" method="post">
              <div
                style="display: flex; align-items: center; justify-self: center; color: aliceblue; margin-bottom: 20px;">
                <h2>REGISTER</h2>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <fieldset>
                    <input type="name" name="name" id="name" placeholder="Your Name ..." autocomplete="on" required>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <input type="name" name="name" id="name" placeholder="Your Email ..." autocomplete="on" required>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <input type="password" name="password" id="password" placeholder="Password" required>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <input type="password" name="password" id="password" placeholder="ConfirmPassword" required>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <button type="submit" id="form-submit" class="orange-button"
                      style="min-width: 200px; margin-top: 5px; margin-bottom: 5px;">Register</button>
                  </fieldset>
                  <p class="auth-switch-section" style="color: aliceblue;">
                    Have an account?
                    <router-link to="/login" class="auth-switch-link">Login Now</router-link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'registerComponent',
  data() {
    return {
      registerForm: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        nameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: ''
      },
      registerLoading: false,
      passwordStrength: { class: '', text: '' }
    }
  }
}
</script>