import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Address } from '../type/Item'

export interface TableItem {
  id: number
  companyName: string
  directorFullName: string
  phoneNumber: string
  address: Address
}

export const useTableStore = defineStore('table', () => {
  const filterValue = ref<string>('')
  const currentPage = ref<number>(1)
  const itemsPerPage = 5

  const tableData = ref<TableItem[]>([
    {
      id: 0,
      companyName: 'ООО "Вектор"',
      directorFullName: 'Иванов И.И.',
      phoneNumber: '+7:000:123:45',
      address: {
        city: 'г. Москва',
        street: 'ул. Ленина',
        house: 'д. 1'
      }
    },
    {
      id: 1,
      companyName: 'ИП Сидоров С.С.',
      directorFullName: 'Сидоров С.С.',
      phoneNumber: '+7:000:56:7899',
      address: {
        city: 'г. Санкт-Петербург',
        street: 'пр. Невский',
        house: 'д. 2'
      }
    },
    {
      id: 2,
      companyName: 'ООО "Стэлс Технолоджи"',
      directorFullName: 'Петров П.П.',
      phoneNumber: '+7 495 987 65 43',
      address: {
        city: 'г. Москва',
        street: 'ул. Тверская',
        house: 'д. 15, офис 203'
      }
    },
    {
      id: 3,
      companyName: 'ЗАО "Динамика"',
      directorFullName: 'Синицына А.В.',
      phoneNumber: '+7 812 456 78 90',
      address: {
        city: 'г. Санкт-Петербург',
        street: 'ул. Садовая',
        house: 'д. 8'
      }
    },
    {
      id: 4,
      companyName: 'ИП Козлов Д.Е.',
      directorFullName: 'Козлов Д.Е.',
      phoneNumber: '+7 495 555 33 22',
      address: {
        city: 'г. Москва',
        street: 'ул. Арбат',
        house: 'д. 25'
      }
    },
    {
      id: 5,
      companyName: 'ООО "ТехноМир"',
      directorFullName: 'Смирнов А.А.',
      phoneNumber: '+7 495 111 22 33',
      address: {
        city: 'г. Москва',
        street: 'ул. Красная Площадь',
        house: 'д. 1'
      }
    },
    {
      id: 6,
      companyName: 'ИП Волков В.В.',
      directorFullName: 'Волков В.В.',
      phoneNumber: '+7 812 444 55 66',
      address: {
        city: 'г. Санкт-Петербург',
        street: 'ул. Дворцовая',
        house: 'д. 10'
      }
    },
    {
      id: 7,
      companyName: 'ООО "Инновации"',
      directorFullName: 'Новиков Н.Н.',
      phoneNumber: '+7 495 777 88 99',
      address: {
        city: 'г. Москва',
        street: 'ул. Тверская',
        house: 'д. 20'
      }
    },
    {
      id: 8,
      companyName: 'ИП Морозов М.М.',
      directorFullName: 'Морозов М.М.',
      phoneNumber: '+7 812 333 44 55',
      address: {
        city: 'г. Санкт-Петербург',
        street: 'пр. Литейный',
        house: 'д. 5'
      }
    },
    {
      id: 9,
      companyName: 'ЗАО "Прогресс"',
      directorFullName: 'Федоров Ф.Ф.',
      phoneNumber: '+7 495 666 77 88',
      address: {
        city: 'г. Москва',
        street: 'ул. Арбат',
        house: 'д. 30'
      }
    },
    {
      id: 10,
      companyName: 'ИП Лебедев Л.Л.',
      directorFullName: 'Лебедев Л.Л.',
      phoneNumber: '+7 812 222 33 44',
      address: {
        city: 'г. Санкт-Петербург',
        street: 'ул. Невский',
        house: 'д. 15'
      }
    },
    {
      id: 11,
      companyName: 'ООО "Будущее"',
      directorFullName: 'Григорьев Г.Г.',
      phoneNumber: '+7 495 999 00 11',
      address: {
        city: 'г. Москва',
        street: 'ул. Ленина',
        house: 'д. 50'
      }
    }
  ])

  const addItem = (item: Omit<TableItem, 'id'>): void => {
    const maxId = Math.max(...tableData.value.map(item => item.id), -1)
    const newItem: TableItem = {
      ...item,
      id: maxId + 1
    }
    tableData.value.push(newItem)
  }

  const removeItem = (id: number): void => {
    const index = tableData.value.findIndex(item => item.id === id)
    if (index !== -1) {
      tableData.value.splice(index, 1)

      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value > 0 ? totalPages.value : 1
      }
    }
  }

  const updateItem = (item: TableItem): void => {
    const index = tableData.value.findIndex(dataItem => dataItem.id === item.id)
    if (index !== -1) {
      tableData.value[index] = item
    }
  }

  const filteredData = computed(() => {
    if (!filterValue.value.trim()) {
      return tableData.value
    }

    const searchTerm = filterValue.value.toLowerCase().trim()
    return tableData.value.filter(item =>
      item.directorFullName.toLowerCase().includes(searchTerm)
    )
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage)
  })

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredData.value.slice(start, end)
  })

  watch(filterValue, () => {
    currentPage.value = 1
  })

  const setPage = (page: number): void => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const goToNextPage = (): void => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const goToPrevPage = (): void => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const initializeFromUrl = (): void => {
    const urlParams = new URLSearchParams(window.location.search)
    const pageParam = urlParams.get('page')
    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (!isNaN(page) && page >= 1) {
        // Проверяем, что страница не превышает общее количество страниц
        // Если превышает, устанавливаем первую страницу
        if (page <= totalPages.value) {
          currentPage.value = page
        } else {
          currentPage.value = 1
        }
      }
    }
  }

  const updateUrl = (): void => {
    const url = new URL(window.location.href)
    if (currentPage.value === 1) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', currentPage.value.toString())
    }
    window.history.replaceState({}, '', url.toString())
  }

  watch(currentPage, () => {
    updateUrl()
  })

  return {
    tableData,
    filterValue,
    filteredData,
    paginatedData,
    currentPage,
    totalPages,
    addItem,
    removeItem,
    updateItem,
    setPage,
    goToNextPage,
    goToPrevPage,
    initializeFromUrl
  }
})
