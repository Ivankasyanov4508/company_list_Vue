<template>
  <div class="table">
    <div class="table__wrapper">
      <table class="table__content">
        <thead class="table__head">
          <tr class="table__row">
            <th
              v-for="header in headers"
              :key="header.field"
              class="table__header"
              :class="{ 'table__header--sortable': header.sortable }"
              @click="handleSort(header)"
            >
              <div class="table__header-content">
                <span class="table__header-text">{{ header.text }}</span>
                <i
                  v-if="header.sortable"
                  class="table__header-icon"
                  :class="getSortIconClass(header.field)"
                ></i>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="table__body">
          <tr
            v-for="item in sortedItems"
            :key="item.id"
            class="table__row table__row--hover"
            @click="handleRowClick(item)"
          >
            <td
              v-for="(header, index) in headers"
              :key="header.field"
              class="table__cell"
            >
              <div class="table__cell-content">
                <span
                  v-if="index < headers.length - 1"
                  class="table__cell-text"
                >
                  {{ getItemValue(item, header.field) }}
                </span>
                <slot
                  v-else
                  :item="item"
                  :value="getItemValue(item, header.field)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableItem } from '../stores/tableStore'

interface TableHeader {
  text: string
  sortable: boolean
  field: string
}

interface Props {
  headers: TableHeader[]
  items: TableItem[]
}

interface SortState {
  field: string | null
  order: 'asc' | 'desc' | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [item: TableItem]
}>()

const sortState = ref<SortState>({
  field: null,
  order: null
})

const sortedItems = computed(() => {
  if (!sortState.value.field || !sortState.value.order) {
    return props.items
  }

  const field = sortState.value.field
  const order = sortState.value.order

  return [...props.items].sort((a, b) => {
    const aVal = a[field as keyof TableItem]
    const bVal = b[field as keyof TableItem]

    if (aVal < bVal) {
      return order === 'asc' ? -1 : 1
    }
    if (aVal > bVal) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })
})

const getSortIconClass = (field: string) => {
  if (sortState.value.field !== field) {
    return 'table__header-icon--unsorted'
  }

  if (sortState.value.order === 'asc') {
    return 'table__header-icon--asc'
  }

  if (sortState.value.order === 'desc') {
    return 'table__header-icon--desc'
  }

  return 'table__header-icon--unsorted'
}

const handleSort = (header: TableHeader) => {
  if (!header.sortable) {
    return
  }

  const currentField = sortState.value.field
  const currentOrder = sortState.value.order

  if (currentField === header.field) {
    if (currentOrder === 'asc') {
      sortState.value.order = 'desc'
    } else if (currentOrder === 'desc') {
      sortState.value.order = null
      sortState.value.field = null
    } else {
      sortState.value.order = 'asc'
    }
  } else {
    sortState.value.field = header.field
    sortState.value.order = 'asc'
  }
}

const getItemValue = (item: TableItem, field: string): string | number => {
  if (field === 'address') {
    return `${item.address.city}, ${item.address.street}, ${item.address.house}`
  }
  return item[field as keyof TableItem] as string | number
}

const handleRowClick = (item: TableItem) => {
  emit('click', item)
}
</script>

<style scoped>
.elevation-1 {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.table {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 20px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  flex-grow: 1;
}

.table__wrapper {
  overflow: auto;
}

.table__content {
  width: 100%;
  border-collapse: collapse;
}

.table__head {
  background: #fafafa;
}

.table__row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.table__row--hover:hover {
  background: #f5f5f5;
  cursor: pointer;
}

.table__header,
.table__cell {
  padding: 12px 16px;
  text-align: left;
  vertical-align: middle;
}

.table__header {
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.table__header--sortable {
  cursor: pointer;
  user-select: none;
}

.table__header--sortable:hover {
  background: rgba(0, 0, 0, 0.04);
}

.table__header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.table__header-text {
  font-weight: 500;
}

.table__header-icon {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.54);
  transition: transform 0.2s;
}

.table__header-icon--unsorted::before {
  content: '⇅';
  opacity: 0.5;
}

.table__header-icon--asc::before {
  content: '▲';
}

.table__header-icon--desc::before {
  content: '▼';
}

.table__cell {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.table__cell-content {
  display: flex;
  align-items: center;
}

.table__cell-text {
  flex: 1;
}
</style>
