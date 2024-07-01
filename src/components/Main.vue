<template>
  <div class="main-content">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка...</p>
    </div>
    <div v-else>
      <div class="header-wrapper">
        <h1>ТАРИФНЫЙ КАЛЬКУЛЯТОР</h1>
      </div>
      <div class="calculator-items-wrapper">
        <div class="calculator-item">
          <div class="tariff-item">
            <TariffItem :tariff="tariffs[0]" />
          </div>
          <div class="tariff-item">
            <TariffItem :tariff="tariffs[1]" />
          </div>
        </div>
        <div class="step">1</div>
        <h2>Выберите тариф</h2>
        <div class="calculator-item">
          <v-select
            variant="outlined"
            color="var(--bg-color-blue)"
            bg-color="grey-darken-4"
            max-width="500px"
            min-width="200px"
            aria-hidden="false"
            density="compact"
            v-model="selectedTariff"
            :item-props="true"
            :items="tariffs"
            return-object
            @update:modelValue="convertedPrice"
          ></v-select>
        </div>
        <v-divider class="border-opacity-75" color="var(--color-accent-red)" width="70%"></v-divider>
        <div class="step">2</div>
        <h2>Выберите валюту</h2>
        <div class="calculator-item">
          <v-select
            variant="outlined"
            color="var(--bg-color-blue)"
            bg-color="grey-darken-4"
            max-width="500px"
            min-width="200px"
            aria-hidden="false"
            density="compact"
            v-model="selectedCurrency"
            :item-props="true"
            :items="currencies"
            return-object
            @update:modelValue="convertedPrice"
          ></v-select>
        </div>
        <v-divider class="border-opacity-75" color="var(--color-accent-red)" width="70%"></v-divider>
        <div class="step">3</div>
        <h2>Выберите период оплаты</h2>
        <div class="calculator-item">
          <div class="payment-period">
            <v-radio-group
              inline
              v-model="paymentPeriod"
            >
              <v-radio label="За месяц" value="monthly" @change="convertedPrice"></v-radio>
              <v-radio label="За год" value="yearly" @change="convertedPrice"></v-radio>
            </v-radio-group>
          </div>
        </div>
      </div>
      <div class="calculation-result-wrapper">
        <div class="calculation-result">
          <h2>ВАШ ТАРИФ</h2>
          <p><strong>{{ selectedTariff.title }}</strong></p>
          <p>Сумма для оплаты: <strong>{{ paymentSum }} {{ selectedCurrency.abbr }}</strong></p>
          <p v-if="discount > 0">Скидка: <strong>{{ discount }} {{ selectedCurrency.abbr }} | {{ discount_percent }} %</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import TariffItem from './TariffItem.vue';

const store = useStore();

const selectedTariff = ref({ title: '', monthly: 0, yearly: 0 });
const selectedCurrency = ref({ title: '', abbr: '' });
const paymentPeriod = ref('yearly');
const loading = ref(true);
const paymentSum = ref(0);
const discount = ref(0);
const discount_percent = ref(0);

const tariffs = store.state.tariffs;
const currencies = store.state.currencies;
let exchangeRates = '';

const fetchExchangeRates = async () => {
  await store.dispatch('fetchExchangeRates');
};

const convertedPrice = () => {
  if (selectedTariff.value.title === '' || selectedCurrency.value.title === '') {
    paymentSum.value = 0;
    discount.value = 0;
    return;
  }
  console.log(exchangeRates[selectedCurrency.value.abbr], selectedTariff.value, paymentPeriod.value)
  const rate = exchangeRates[selectedCurrency.value.abbr] || 1
  const price = paymentPeriod.value === 'monthly' ? selectedTariff.value.monthly : selectedTariff.value.yearly
  paymentSum.value = (price * rate).toFixed(2);

  if (paymentPeriod.value === 'yearly') {
    const monthlyPrice = selectedTariff.value.monthly * 12
    const yearlyPrice = selectedTariff.value.yearly
    discount.value = (monthlyPrice - yearlyPrice) * exchangeRates[selectedCurrency.value.abbr]
    discount_percent.value = ((discount.value / paymentSum.value) * 100).toFixed(2)
  } else {
    discount.value = 0
  }
}

onBeforeMount(async () => {
  await fetchExchangeRates()
  loading.value = false;
  exchangeRates = store.state.exchangeRates;
})
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--bg-color-blue);
  border-top: 5px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
