<template>
  <defaultlayout>
    <div class="min-vh-100" style="background-color: #f8f9fa;">
      <!-- Header -->
      <div class="search-container py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="text-center text-white mb-4">
                <h1 class="display-4 fw-bold mb-3">
                  <i class="fas fa-language me-3"></i>
                  Từ Điển Anh - Việt
                </h1>
                <p class="lead">Dịch từ, cụm từ và câu sang tiếng Việt</p>
              </div>

              <!-- Search Box -->
              <div class="search-box p-4">
                <div class="input-group input-group-lg">
                  <input type="text" class="form-control border-0 fs-4"
                    placeholder="Nhập từ, cụm từ hoặc câu cần dịch..." v-model="searchTerm" @input="onInputChange"
                    ref="searchInput" />
                  <button class="btn btn-primary px-4" @click="manualSearch" :disabled="loading"
                    style="background: linear-gradient(45deg, #667eea, #764ba2); border: none;">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fas fa-search me-2"></i>
                    Dịch
                  </button>
                </div>

                <!-- Language Toggle -->
                <div class="text-center mt-3">
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-light"
                      :class="{ 'active': translationMode === 'en-vi' }" @click="toggleTranslationMode('en-vi')">
                      Anh → Việt
                    </button>
                    <button type="button" class="btn btn-outline-light"
                      :class="{ 'active': translationMode === 'vi-en' }" @click="toggleTranslationMode('vi-en')">
                      Việt → Anh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-4">
        <div class="row">
          <!-- Main Content -->
          <div class="col-lg-8">
            <!-- Loading indicator -->
            <div v-if="loading" class="result-card p-4">
              <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Đang dịch...</span>
                </div>
                <p class="mt-3 text-muted">Đang dịch văn bản...</p>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="alert alert-warning alert-dismissible fade show" role="alert">
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ error }}
              <button type="button" class="btn-close" @click="error = ''"></button>
            </div>

            <!-- Translation Result -->
            <div v-if="translationResult" class="result-card p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <h3 class="mb-0 text-primary fw-bold">Kết quả dịch</h3>
                <div v-if="currentAudio">
                  <button class="btn btn-outline-primary btn-sm" @click="playTranslationAudio" title="Nghe phát âm">
                    <i class="fas fa-volume-up"></i>
                  </button>
                </div>
              </div>

              <!-- Original Text -->
              <div class="mb-3 p-3 bg-light rounded">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <small class="text-muted">{{ translationMode === 'en-vi' ? 'Tiếng Anh' : 'Tiếng Việt' }}:</small>
                    <div class="fs-5 fw-medium">{{ searchTerm }}</div>
                  </div>
                </div>
              </div>

              <!-- Translated Text -->
              <div class="mb-3 p-3 bg-primary bg-opacity-10 rounded">
                <small class="text-muted">{{ translationMode === 'en-vi' ? 'Tiếng Việt' : 'Tiếng Anh' }}:</small>
                <div class="fs-4 fw-bold text-primary">{{ translationResult }}</div>
              </div>
            </div>

            <!-- Dictionary Result (for single words) -->
            <div v-if="dictionaryResult" class="result-card p-4 mt-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <h3 class="mb-0 text-success fw-bold">Thông tin từ vựng</h3>
                <div v-if="dictionaryResult.phonetics && dictionaryResult.phonetics.length > 0">
                  <button v-for="(phonetic, index) in dictionaryResult.phonetics" :key="index"
                    v-if="phonetic && phonetic.audio && phonetic.audio.trim() !== ''"
                    class="btn btn-outline-success btn-sm ms-2" @click="playAudio(phonetic.audio)" title="Phát âm">
                    <i class="fas fa-volume-up"></i>
                  </button>
                </div>
              </div>

              <!-- Word and Phonetics -->
              <div class="mb-3">
                <h2 class="text-success fw-bold d-inline">{{ dictionaryResult.word }}</h2>
                <div v-if="dictionaryResult.phonetics && dictionaryResult.phonetics.length > 0" class="mt-2">
                  <span v-for="(phonetic, index) in dictionaryResult.phonetics" :key="index"
                    v-if="phonetic && phonetic.text && phonetic.text.trim() !== ''"
                    class="badge bg-light text-dark me-2 fs-6">
                    {{ phonetic.text }}
                  </span>
                </div>
              </div>

              <!-- Meanings with Vietnamese translations -->
              <div v-for="(meaning, meaningIndex) in (dictionaryResult.meanings || [])" :key="meaningIndex"
                class="mb-4">
                <span class="part-of-speech badge rounded-pill mb-3" v-if="meaning.partOfSpeech">
                  {{ translatePartOfSpeech(meaning.partOfSpeech) }}
                </span>

                <div v-for="(definition, defIndex) in (meaning.definitions || [])" :key="defIndex"
                  class="definition mb-3">
                  <!-- English definition -->
                  <p class="mb-2 fw-medium text-muted">{{ definition.definition }}</p>

                  <!-- Vietnamese translation of definition -->
                  <p v-if="definition.vietnameseTranslation" class="mb-2 fw-bold text-primary">
                    {{ definition.vietnameseTranslation }}
                  </p>

                  <div v-if="definition.example" class="example mb-2">
                    <small class="text-muted">Ví dụ:</small>
                    <div class="fst-italic text-muted">"{{ definition.example }}"</div>
                    <div v-if="definition.exampleVietnamese" class="fst-italic text-primary">
                      "{{ definition.exampleVietnamese }}"
                    </div>
                  </div>

                  <div v-if="definition.synonyms && definition.synonyms.length > 0" class="mt-2">
                    <small class="text-muted">Từ đồng nghĩa: </small>
                    <span v-for="(synonym, synIndex) in definition.synonyms.slice(0, 5)" :key="synIndex"
                      class="badge bg-success me-1 synonym-badge" @click="searchFromHistory(synonym)">
                      {{ synonym }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Search History -->
            <div v-if="history.length > 0" class="bg-white p-4 rounded-4 shadow-sm mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">
                  <i class="fas fa-history me-2"></i>
                  Lịch sử tìm kiếm
                </h5>
                <button class="btn btn-outline-danger btn-sm" @click="clearHistory" title="Xóa lịch sử">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="d-flex flex-wrap gap-2">
                <button v-for="(item, index) in history" :key="index" class="btn btn-outline-primary btn-sm"
                  @click="searchFromHistory(item.text)" :title="`${item.text} → ${item.translation}`">
                  {{ item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text }}
                </button>
              </div>
            </div>

            <!-- Quick Phrases -->
            <div class="bg-white p-4 rounded-4 shadow-sm mb-4">
              <h5 class="mb-3">
                <i class="fas fa-star me-2"></i>
                Cụm từ thông dụng
              </h5>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="phrase in quickPhrases" :key="phrase" class="btn btn-outline-secondary btn-sm"
                  @click="searchFromHistory(phrase)">
                  {{ phrase }}
                </button>
              </div>
            </div>

            <!-- Tips -->
            <div class="bg-white p-4 rounded-4 shadow-sm">
              <h5 class="mb-3">
                <i class="fas fa-lightbulb me-2"></i>
                Mẹo sử dụng
              </h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <i class="fas fa-check text-success me-2"></i>
                  Tự động dịch khi bạn nhập
                </li>
                <li class="mb-2">
                  <i class="fas fa-check text-success me-2"></i>
                  Hỗ trợ dịch cả câu dài
                </li>
                <li class="mb-2">
                  <i class="fas fa-check text-success me-2"></i>
                  Chuyển đổi hướng dịch Anh-Việt hoặc Việt-Anh
                </li>
                <li class="mb-2">
                  <i class="fas fa-check text-success me-2"></i>
                  Click từ đồng nghĩa để tra tiếp
                </li>
                <li>
                  <i class="fas fa-check text-success me-2"></i>
                  Nghe phát âm chuẩn
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </defaultlayout>
</template>

<script>
import defaultlayout from '@/layout/default.vue';

export default {
  data() {
    return {
      searchTerm: "",
      translationResult: "",
      dictionaryResult: null,
      loading: false,
      error: "",
      history: [],
      translationMode: 'en-vi', // 'en-vi' or 'vi-en'
      searchTimeout: null,
      currentAudio: null,
      quickPhrases: [
        'Hello', 'How are you?', 'Thank you', 'Good morning',
        'See you later', 'Nice to meet you', 'Excuse me', 'I love you'
      ]
    };
  },
  components: { defaultlayout },
  mounted() {
    const savedHistory = JSON.parse(localStorage.getItem("translationHistory") || "[]");
    const savedMode = localStorage.getItem("translationMode") || "en-vi";
    this.history = savedHistory;
    this.translationMode = savedMode;
  },
  methods: {
    onInputChange() {
      // Clear existing timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // If empty, clear results
      if (!this.searchTerm.trim()) {
        this.translationResult = "";
        this.dictionaryResult = null;
        this.error = "";
        return;
      }

      // Set timeout for auto-search
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 800); // Wait 800ms after user stops typing
    },

    manualSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.performSearch();
    },

    async performSearch() {
      if (!this.searchTerm.trim()) return;

      this.loading = true;
      this.error = "";

      try {
        // Always try translation first
        await this.translateText();

        // If it's a single word in English, also try dictionary lookup
        if (this.translationMode === 'en-vi' && this.isSingleWord(this.searchTerm)) {
          await this.searchDictionary();
        } else {
          this.dictionaryResult = null;
        }

        // Save to history
        this.saveToHistory();

      } catch (err) {
        this.error = err.message || "Có lỗi xảy ra khi dịch";
        console.error('Search error:', err);
      } finally {
        this.loading = false;
      }
    },

    async translateText() {
      const text = this.searchTerm.trim();

      try {
        const translation = await this.mockTranslateAPI(text, this.translationMode);
        this.translationResult = translation;

        // Generate audio for translation if available
        this.generateTranslationAudio();

      } catch (error) {
        throw new Error(error.message || "Không thể dịch văn bản này");
      }
    },

    async mockTranslateAPI(text, mode) {
      try {
        // Try LibreTranslate first (free API)
        const translation = await this.translateWithLibreTranslate(text, mode);
        if (translation && translation !== text) {
          return translation;
        }
      } catch (error) {
        console.log('LibreTranslate failed, trying MyMemory:', error);
      }

      try {
        // Fallback to MyMemory API (free, no key required)
        const translation = await this.translateWithMyMemory(text, mode);
        if (translation && translation !== text) {
          return translation;
        }
      } catch (error) {
        console.log('MyMemory failed, trying Lingva:', error);
      }

      try {
        // Fallback to Lingva Translate (free, no key required)
        const translation = await this.translateWithLingva(text, mode);
        if (translation && translation !== text) {
          return translation;
        }
      } catch (error) {
        console.log('Lingva failed:', error);
      }

      // If all APIs fail, return a fallback message
      throw new Error('Tất cả dịch vụ dịch đều không khả dụng');
    },

    async translateWithLibreTranslate(text, mode) {
      const sourceLang = mode === 'en-vi' ? 'en' : 'vi';
      const targetLang = mode === 'en-vi' ? 'vi' : 'en';

      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedText || text;
    },

    async translateWithMyMemory(text, mode) {
      const sourceLang = mode === 'en-vi' ? 'en' : 'vi';
      const targetLang = mode === 'en-vi' ? 'vi' : 'en';

      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
      );

      if (!response.ok) {
        throw new Error(`MyMemory API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData) {
        return data.responseData.translatedText;
      }

      throw new Error('MyMemory translation failed');
    },

    async translateWithLingva(text, mode) {
      const sourceLang = mode === 'en-vi' ? 'en' : 'vi';
      const targetLang = mode === 'en-vi' ? 'vi' : 'en';

      const response = await fetch(
        `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text)}`
      );

      if (!response.ok) {
        throw new Error(`Lingva API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translation || text;
    },

    async searchDictionary() {
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${this.searchTerm.trim()}`
        );

        if (!response.ok) return; // Don't show error if dictionary lookup fails

        const data = await response.json();
        if (data && data.length > 0 && data[0]) {
          this.dictionaryResult = data[0];

          // Clean up phonetics
          if (this.dictionaryResult.phonetics) {
            this.dictionaryResult.phonetics = this.dictionaryResult.phonetics.filter(
              p => p && typeof p === 'object' &&
                ((p.audio && p.audio.trim() !== '') || (p.text && p.text.trim() !== ''))
            );
          }

          // Add Vietnamese translations to definitions
          if (this.dictionaryResult.meanings) {
            for (let meaning of this.dictionaryResult.meanings) {
              if (meaning.definitions) {
                for (let definition of meaning.definitions) {
                  // Mock Vietnamese translation of definitions
                  try {
                    definition.vietnameseTranslation = await this.mockTranslateAPI(
                      definition.definition, 'en-vi'
                    );
                  } catch (e) {
                    definition.vietnameseTranslation = definition.definition;
                  }

                  // Translate examples
                  if (definition.example) {
                    try {
                      definition.exampleVietnamese = await this.mockTranslateAPI(
                        definition.example, 'en-vi'
                      );
                    } catch (e) {
                      definition.exampleVietnamese = definition.example;
                    }
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.log("Dictionary lookup failed:", err);
        // Don't show error for dictionary failures
      }
    },

    isSingleWord(text) {
      return text.trim().split(/\s+/).length === 1;
    },

    toggleTranslationMode(mode) {
      this.translationMode = mode;
      localStorage.setItem("translationMode", mode);

      // Re-search if there's existing text
      if (this.searchTerm.trim()) {
        this.performSearch();
      }
    },

    generateTranslationAudio() {
      // Mock audio generation - in real app you'd use Text-to-Speech API
      this.currentAudio = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${this.translationMode === 'en-vi' ? 'vi' : 'en'
        }&q=${encodeURIComponent(this.translationResult)}`;
    },

    playTranslationAudio() {
      if (this.currentAudio) {
        const audio = new Audio(this.currentAudio);
        audio.play().catch(err => console.log("Cannot play audio:", err));
      }
    },

    playAudio(audioUrl) {
      if (!audioUrl || audioUrl.trim() === '') return;
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.log("Cannot play audio:", err));
    },

    translatePartOfSpeech(partOfSpeech) {
      const translations = {
        'noun': 'danh từ',
        'verb': 'động từ',
        'adjective': 'tính từ',
        'adverb': 'trạng từ',
        'pronoun': 'đại từ',
        'preposition': 'giới từ',
        'conjunction': 'liên từ',
        'interjection': 'thán từ',
        'determiner': 'định từ'
      };
      return translations[partOfSpeech] || partOfSpeech;
    },

    saveToHistory() {
      if (!this.searchTerm.trim() || !this.translationResult) return;

      const historyItem = {
        text: this.searchTerm.trim(),
        translation: this.translationResult,
        mode: this.translationMode,
        timestamp: Date.now()
      };

      // Remove existing item if present
      const existingIndex = this.history.findIndex(
        item => item.text.toLowerCase() === historyItem.text.toLowerCase()
      );

      if (existingIndex > -1) {
        this.history.splice(existingIndex, 1);
      }

      // Add to beginning and limit to 15 items
      this.history = [historyItem, ...this.history].slice(0, 15);

      localStorage.setItem("translationHistory", JSON.stringify(this.history));
    },

    searchFromHistory(text) {
      this.searchTerm = text;
      this.performSearch();
      this.$refs.searchInput.focus();
    },

    clearHistory() {
      this.history = [];
      localStorage.removeItem("translationHistory");
    }
  }
};
</script>

<style scoped>
.search-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 300px;
}

.search-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.result-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #667eea;
}

.part-of-speech {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.synonym-badge {
  cursor: pointer;
  transition: all 0.3s ease;
}

.synonym-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.definition {
  border-left: 3px solid #e9ecef;
  padding-left: 15px;
  margin-left: 10px;
}

.example {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #28a745;
}

.btn-group .btn.active {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .display-4 {
    font-size: 2rem;
  }

  .search-box {
    margin: 0 15px;
  }
}
</style>
