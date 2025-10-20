<template>
  <div class="section about-us">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 offset-lg-1">
          <div class="accordion">
            <div v-for="item in accordionData" :key="item.id" class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button" :class="{ collapsed: activeItem !== item.id }" type="button"
                  @click="toggleAccordion(item.id)">
                  {{ item.question }}
                </button>
              </h2>
              <div :class="['accordion-collapse', 'collapse', { show: activeItem === item.id }]">
                <div class="accordion-body" v-html="item.answer">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5 align-self-center" style="padding: 30px 0;">
          <div class="section-heading">
            <h6>About Us</h6>
            <h2>Helping You Speak English with Confidence</h2>
            <p>We are an online English academy offering interactive lessons, real-life practice, and AI-powered
              support. Whether you’re learning for work, study, or travel, our platform helps you improve quickly and
              stay motivated.</p>
            <div class="main-button">
              <a href="#">Discover More</a>
            </div>
          </div>
        </div>
        <!-- Phần content bên phải giống như code gốc -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnglishLearningAccordion',
  data() {
    return {
      activeItem: 'collapseOne',
      accordionData: [
        {
          id: 'collapseOne',
          question: 'How should I start learning English here?',
          answer: 'Begin with our placement test to check your current level. Then, follow our step-by-step learning path with listening, reading, speaking, and writing lessons designed just for you.'
        },
        {
          id: 'collapseTwo',
          question: 'How does AI help me improve faster?',
          answer: 'Our AI provides instant feedback on pronunciation, grammar, and writing. It suggests corrections, gives personalized exercises, and helps you speak more naturally with real-time conversation practice.'
        },
        {
          id: 'collapseThree',
          question: 'Why choose our English learning platform?',
          answer: 'We combine interactive lessons, daily quizzes, and AI-powered support to help you learn efficiently. Our platform is flexible, beginner-friendly, and works on any device, anytime.'
        },
        {
          id: 'collapseFour',
          question: 'Do I get support from teachers?',
          answer: 'Yes! You can join live sessions with experienced English teachers, ask questions anytime, and get guidance to make steady progress toward your language goals.'
        }
      ]
    }
  },
  methods: {
    toggleAccordion(itemId) {
      this.activeItem = this.activeItem === itemId ? '' : itemId;
    }
  }
}
</script>