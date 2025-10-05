<template>
  <div class="page">
    <div class="page__header">
      <h1 class="label">Управление организациями</h1>
    </div>
    <div class="app__action-section">
      <button class="page__add-button" @click="showAddModal">Добавить</button>
    </div>

    <div class="page__filter">
      <input
        v-model="tableStore.filterValue"
        type="text"
        class="page__filter-input"
        placeholder="Поиск по ФИО директора..."
      />
    </div>

    <CustomTable
      :headers="headers"
      :items="tableStore.paginatedData"
      @click="handleRowClick"
    >
      <template #default="{ item }">
        <button class="page__delete-button" @click.stop="handleDelete(item)">
          &#88;
        </button>
      </template>
    </CustomTable>

    <Pagination
      :current-page="tableStore.currentPage"
      :total-pages="tableStore.totalPages"
      @page-change="handlePageChange"
    />

    <CompanyModal
      v-if="showModal"
      :title="modalTitle"
      :is-new-item="isNewItem"
      :id="currentEditingItem?.id"
      :company-name="currentEditingItem?.companyName"
      :director-full-name="currentEditingItem?.directorFullName"
      :phone-number="currentEditingItem?.phoneNumber"
      :address="currentEditingItem?.address"
      @submit="handleModalSubmit"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CustomTable from './components/CustomTable.vue'
import CompanyModal from './components/CompanyModal.vue'
import Pagination from './components/Pagination.vue'
import { useTableStore, type TableItem } from './stores/tableStore'

const tableStore = useTableStore()

const showModal = ref(false)
const modalTitle = ref('')
const isNewItem = ref(true)
const currentEditingItem = ref<TableItem | null>(null)

const headers = [
  {
    text: 'Название',
    sortable: true,
    field: 'companyName'
  },
  {
    text: 'ФИО директора',
    sortable: true,
    field: 'directorFullName'
  },
  {
    text: 'Номер телефона',
    sortable: false,
    field: 'phoneNumber'
  },
  {
    text: 'Адрес',
    sortable: false,
    field: 'address'
  },
  {
    text: '',
    sortable: false,
    field: 'false'
  }
]

const showAddModal = (): void => {
  modalTitle.value = 'Добавить организацию'
  isNewItem.value = true
  currentEditingItem.value = null
  showModal.value = true
}

const handleRowClick = (item: TableItem): void => {
  modalTitle.value = 'Редактировать организацию'
  isNewItem.value = false
  currentEditingItem.value = item
  showModal.value = true
}

const handleDelete = (item: TableItem): void => {
  tableStore.removeItem(item.id)
}

const handleModalSubmit = (data: TableItem | Omit<TableItem, 'id'>): void => {
  if (isNewItem.value) {
    tableStore.addItem(data as Omit<TableItem, 'id'>)
  } else {
    tableStore.updateItem(data as TableItem)
  }
  closeModal()
}

const closeModal = (): void => {
  showModal.value = false
}

const handlePageChange = (page: number): void => {
  tableStore.setPage(page)
}

onMounted(() => {
  tableStore.initializeFromUrl()
})
</script>

<style>
.page {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.label {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5em;
}

.page__add-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page__add-button:hover {
  background-color: #0056b3;
}

.page__filter {
  margin-bottom: 20px;
}

.page__filter-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.page__filter-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.page__delete-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.page__delete-button:hover {
  color: #686161;
}
.label {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5em;
}
.app__action-section {
  margin-bottom: 30px;
  text-align: center;
}
</style>
