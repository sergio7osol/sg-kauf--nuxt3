<script setup lang="ts">
  import type SortOrder from '@/types/SortOrder';

  const { activeSortOrder } = defineProps<{
    activeSortOrder: SortOrder
  }>();
  const emit = defineEmits<{
    (e: '@sort-order', direction: SortOrder): void;
  }>();
</script>

<template>
  <div class="sort-box">
    <button
        class="btn btn-secondary sort-box__ctrl"
        :class="{ 'sort-box__ctrl--active': activeSortOrder === 'ascend' }"
        @click="emit('@sort-order', 'ascend')"
    >
      &uarr;
    </button>
    <button
        class="btn btn-secondary sort-box__ctrl"
        :class="{ 'sort-box__ctrl--active': activeSortOrder === 'descend' }"
        @click="emit('@sort-order', 'descend')"
    >
      &darr;
    </button>
  </div>
</template>

<style scoped>
.sort-box {
  display: flex;
  justify-content: center;
  padding: .5rem 1rem;
}

.sort-box__ctrl {
  border: .1rem solid var(--default-outline-color);
  line-height: 1;
}

.sort-box__ctrl:last-child {
  margin-left: .5rem;
}

.sort-box__ctrl--active {
  color: #fff;
  border-color: var(--default-menu-btn-bg-color);
  background-color: var(--default-menu-btn-bg-color);
  cursor: default !important;
}
</style>
