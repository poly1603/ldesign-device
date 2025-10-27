<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

defineProps<{
  product: Product
  compact?: boolean
}>()
</script>

<template>
  <div :class="['product-card', { compact }]">
    <div class="product-image">{{ product.image }}</div>
    <div class="product-info">
      <div class="product-category">{{ product.category }}</div>
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-price">¥{{ product.price }}</div>
      <button class="add-to-cart">加入购物车</button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.product-info {
  padding: 20px;
}

.product-category {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.product-name {
  margin: 0 0 12px 0;
  font-size: 1.125rem;
  color: #333;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4facfe;
  margin-bottom: 16px;
}

.add-to-cart {
  width: 100%;
  padding: 12px;
  border: none;
  background: #4facfe;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-to-cart:hover {
  background: #3f9cee;
}

/* 紧凑模式（移动端） */
.product-card.compact .product-image {
  font-size: 3rem;
  aspect-ratio: 16/9;
}

.product-card.compact .product-info {
  padding: 16px;
}

.product-card.compact .product-name {
  font-size: 1rem;
}

.product-card.compact .product-price {
  font-size: 1.25rem;
}

.product-card.compact .add-to-cart {
  padding: 10px;
  font-size: 0.875rem;
}
</style>


