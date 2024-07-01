<template>
    <v-card variant="flat">
      <v-card-title>{{ tariff.title }}</v-card-title>
      <div class="price">
        <p><strong>{{ tariff.monthly }}</strong> руб/месяц</p>
        <p>или</p>
        <p><strong>{{ tariff.yearly }}</strong> руб/год</p>
      </div>
    </v-card>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  tariff: {
    type: Object,
    required: true,
  },
})
</script>