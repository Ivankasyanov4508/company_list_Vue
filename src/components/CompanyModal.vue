<template>
  <div class="modal" @click="closeModal">
    <div class="modal__content" @click.stop>
      <div class="modal__header">
        <h2>{{ title }}</h2>
        <button class="modal__close-btn" @click="closeModal">&times;</button>
      </div>

      <div class="modal__body">
        <div class="modal__form-group">
          <label for="companyName">Название компании:</label>
          <input
            id="companyName"
            v-model="formData.companyName"
            type="text"
            placeholder="Введите название компании"
            :class="{
              'modal__input--error':
                !isValidField('companyName') && showValidation
            }"
          />
        </div>

        <div class="modal__form-group">
          <label for="directorFullName">ФИО директора:</label>
          <input
            id="directorFullName"
            v-model="formData.directorFullName"
            type="text"
            placeholder="Введите ФИО директора"
            :class="{
              'modal__input--error':
                !isValidField('directorFullName') && showValidation
            }"
          />
        </div>

        <div class="modal__form-group">
          <label for="phoneNumber">Номер телефона:</label>
          <input
            id="phoneNumber"
            v-model="formData.phoneNumber"
            type="tel"
            placeholder="Введите номер телефона"
            :class="{
              'modal__input--error':
                !isValidField('phoneNumber') && showValidation
            }"
          />
        </div>

        <div class="modal__address-section">
          <h3>Адрес:</h3>

          <div class="modal__form-group">
            <label for="city">Город:</label>
            <input
              id="city"
              v-model="formData.address.city"
              type="text"
              placeholder="Введите город"
              :class="{
                'modal__input--error': !isValidField('city') && showValidation
              }"
            />
          </div>

          <div class="modal__form-group">
            <label for="street">Улица:</label>
            <input
              id="street"
              v-model="formData.address.street"
              type="text"
              placeholder="Введите улицу"
              :class="{
                'modal__input--error': !isValidField('street') && showValidation
              }"
            />
          </div>

          <div class="modal__form-group">
            <label for="house">Дом:</label>
            <input
              id="house"
              v-model="formData.address.house"
              type="text"
              placeholder="Введите номер дома"
              :class="{
                'modal__input--error': !isValidField('house') && showValidation
              }"
            />
          </div>
        </div>
      </div>

      <div class="modal__footer">
        <button
          class="modal__ok-btn"
          :disabled="!isFormValid"
          @click="handleOk"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Address } from '../type/Item'

interface CompanyData {
  id: number | undefined
  companyName: string
  directorFullName: string
  phoneNumber: string
  address: Address
}

interface Props {
  id?: number
  title: string
  companyName?: string
  directorFullName?: string
  phoneNumber?: string
  address?: Address
  isNewItem?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  companyName: '',
  directorFullName: '',
  phoneNumber: '',
  address: () => ({ city: '', street: '', house: '' }),
  isNewItem: false
})

const emit = defineEmits<{
  close: []
  submit: [data: CompanyData]
}>()

const showValidation = ref(false)

const formData = ref({
  companyName: '',
  directorFullName: '',
  phoneNumber: '',
  address: {
    city: '',
    street: '',
    house: ''
  }
})

const isValidField = (field: string): boolean => {
  const value =
    field === 'city' || field === 'street' || field === 'house'
      ? formData.value.address[field as keyof Address]
      : formData.value[field as keyof typeof formData.value]
  return typeof value === 'string' && value.trim().length > 0
}

const isFormValid = computed(() => {
  return (
    isValidField('companyName') &&
    isValidField('directorFullName') &&
    isValidField('phoneNumber') &&
    isValidField('city') &&
    isValidField('street') &&
    isValidField('house')
  )
})

const initializeFormData = () => {
  if (props.isNewItem) {
    formData.value.companyName = ''
    formData.value.directorFullName = ''
    formData.value.phoneNumber = ''
    formData.value.address = {
      city: '',
      street: '',
      house: ''
    }
  } else {
    formData.value.companyName = props.companyName
    formData.value.directorFullName = props.directorFullName
    formData.value.phoneNumber = props.phoneNumber

    if (props.address) {
      formData.value.address = { ...props.address }
    }
  }
}

const handleOk = () => {
  if (!isFormValid.value) {
    showValidation.value = true
    return
  }

  const companyData: CompanyData = {
    id: props.id,
    companyName: formData.value.companyName,
    directorFullName: formData.value.directorFullName,
    phoneNumber: formData.value.phoneNumber,
    address: { ...formData.value.address }
  }

  emit('submit', companyData)
}

const closeModal = () => {
  emit('close')
}

watch(
  () => [
    props.companyName,
    props.directorFullName,
    props.phoneNumber,
    props.address,
    props.isNewItem
  ],
  () => {
    initializeFormData()
  },
  { immediate: true }
)

onMounted(() => {
  initializeFormData()
})
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal__content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal__header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.modal__close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__close-btn:hover {
  color: #333;
}

.modal__body {
  padding: 24px;
}

.modal__form-group {
  margin-bottom: 20px;
}

.modal__form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.modal__form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.modal__form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.modal__form-group input.modal__input--error {
  border-color: #dc3545;
}

.modal__address-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.modal__address-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.modal__footer {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.modal__ok-btn {
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

.modal__ok-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.modal__ok-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>
