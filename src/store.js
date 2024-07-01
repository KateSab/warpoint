import { createStore } from 'vuex'
import axios from 'axios'

const store = createStore({
  state: {
    tariffs: [
      { title: 'Стандартный', monthly: 100, yearly: 1000 },
      { title: 'Продвинутый', monthly: 150, yearly: 1400 },
    ],
    currencies: [
      { title: 'Юани', abbr: 'CNY' },
      { title: 'Тенге', abbr: 'KZT' }
    ],
    exchangeRates: {},
  },
  mutations: {
    setExchangeRates(state, rates) {
      state.exchangeRates = rates
    },
  },
  actions: {
    async fetchExchangeRates({ commit }) {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/RUB')
        commit('setExchangeRates', response.data.rates)
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    },
  },
})

export default store
