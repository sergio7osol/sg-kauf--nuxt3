<script setup>
  useHead({
    titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} - Money tracking` : 'Money tracking App',
    meta: [
      { name: 'description', content: 'Money tracking and planning App' },
    ],
  });
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
