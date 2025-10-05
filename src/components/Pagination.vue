<template>
  <div class="pagination" v-if="totalPages > 1">
    <button
      class="pagination__btn"
      :class="{ 'pagination__btn--disabled': currentPage === 1 }"
      @click="handlePrevPage"
      :disabled="currentPage === 1"
    >
      Предыдущая
    </button>

    <template v-if="totalPages <= 3">
      <button
        v-for="page in totalPages"
        :key="page"
        class="pagination__btn"
        :class="{ 'pagination__btn--active': page === currentPage }"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
    </template>

    <template v-else>
      <button
        v-if="currentPage > 2"
        class="pagination__btn"
        @click="handlePageChange(1)"
      >
        1
      </button>

      <span v-if="currentPage > 3" class="pagination__dots">...</span>

      <button
        v-if="currentPage > 1"
        class="pagination__btn"
        @click="handlePageChange(currentPage - 1)"
      >
        {{ currentPage - 1 }}
      </button>

      <button
        class="pagination__btn pagination__btn--active"
        @click="handlePageChange(currentPage)"
      >
        {{ currentPage }}
      </button>

      <button
        v-if="currentPage < totalPages"
        class="pagination__btn"
        @click="handlePageChange(currentPage + 1)"
      >
        {{ currentPage + 1 }}
      </button>

      <span v-if="currentPage < totalPages - 2" class="pagination__dots"
        >...</span
      >

      <button
        v-if="currentPage < totalPages - 1"
        class="pagination__btn"
        @click="handlePageChange(totalPages)"
      >
        {{ totalPages }}
      </button>
    </template>

    <button
      class="pagination__btn"
      :class="{ 'pagination__btn--disabled': currentPage === totalPages }"
      @click="handleNextPage"
      :disabled="currentPage === totalPages"
    >
      Следующая
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
}

interface Emits {
  (e: 'page-change', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handlePageChange = (page: number): void => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const handlePrevPage = (): void => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

const handleNextPage = (): void => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 20px 0;
}

.pagination__btn {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background-color: white;
  color: #495057;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 40px;
}

.pagination__btn:hover:not(.pagination__btn--disabled) {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.pagination__btn--active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination__btn--disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination__dots {
  padding: 8px 4px;
  color: #6c757d;
  font-weight: bold;
}

@media (max-width: 768px) {
  .pagination {
    gap: 4px;
    flex-wrap: wrap;
  }

  .pagination__btn {
    padding: 6px 10px;
    font-size: 12px;
    min-width: 35px;
  }
}
</style>
