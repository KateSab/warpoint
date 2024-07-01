<template>
  <v-container>
    <v-form>
      <v-select
        v-model="selectedTariff"
        :items="tariffs"
        item-text="name"
        label="Выбор тарифа"
        @change="updateTariff"
      ></v-select>
      <v-select
        v-model="selectedCurrency"
        :items="currencies"
        label="Выбор валюты"
        @change="updateCurrency"
      ></v-select>
      <v-radio-group v-model="paymentPeriod" @change="updatePeriod">
        <v-radio label="За месяц" value="monthly"></v-radio>
        <v-radio label="За год" value="yearly"></v-radio>
      </v-radio-group>
    </v-form>
    <v-card class="mt-4 calculation-result">
      <v-card-text>
        <p>Сумма для оплаты: {{ convertedPrice.toFixed(2) }} {{ selectedCurrency }}</p>
        <p v-if="discount > 0">Скидка: {{ discount }} руб</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'TariffCalculator',
  computed: {
    ...mapState(['tariffs', 'currencies', 'selectedTariff', 'selectedCurrency', 'paymentPeriod']),
    ...mapGetters(['convertedPrice', 'discount']),
  },
  methods: {
    ...mapActions(['fetchExchangeRates']),
    updateTariff(tariff) {
      this.$store.commit('setSelectedTariff', tariff)
    },
    updateCurrency(currency) {
      this.$store.commit('setSelectedCurrency', currency)
    },
    updatePeriod(period) {
      this.$store.commit('setPaymentPeriod', period)
    },
  },
  mounted() {
    this.fetchExchangeRates()
  },
}
</script>