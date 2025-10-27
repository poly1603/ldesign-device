<script setup lang="ts">
const categories = [
  { name: '全部商品', icon: '📦' },
  { name: '电子产品', icon: '💻' },
  { name: '配件', icon: '🎧' },
  { name: '穿戴设备', icon: '⌚' },
]
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-section">
      <h3 class="sidebar-title">商品分类</h3>
      <nav class="category-list">
        <a 
          v-for="category in categories" 
          :key="category.name"
          href="#" 
          class="category-item"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </a>
      </nav>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">筛选</h3>
      <div class="filter-group">
        <label class="filter-label">价格范围</label>
        <select class="filter-select">
          <option>全部</option>
          <option>0-1000</option>
          <option>1000-5000</option>
          <option>5000以上</option>
        </select>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  margin-right: 24px;
  flex-shrink: 0;
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  color: #333;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #666;
  transition: all 0.2s;
}

.category-item:hover {
  background: #f5f5f5;
  color: #4facfe;
}

.category-icon {
  font-size: 1.25rem;
}

.category-name {
  font-weight: 500;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}
</style>


