<script setup lang="ts">
defineProps<{
  columns: number
}>()
</script>

<template>
  <div class="product-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
    <slot />
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  gap: 20px;
}

@media (max-width: 768px) {
  .product-grid {
    gap: 12px;
  }
}
</style>


