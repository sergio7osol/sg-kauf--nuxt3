<script setup lang="ts">
useHead({
  title: 'Money Tracker',
  meta: [
    { name: "description", content: 'App about tracking your expences' }
  ],
});
</script>  

<template>
  <div class="main-content__left-menu">
    <LeftMenu />
  </div>
  <div class="main-content__body col">
    <BuySection />
  </div>
</template>
 
<style>
.main-content {
  padding-top: 3.5rem;
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content__left-menu {
  flex-grow: 0;
  height: 100%;
  overflow-y: auto;
  /* padding-right: 1.1rem; */
  position: relative;
  z-index: 1;
  background-color: var(--default-menu-bg-color);
  /* &::before {
     content: "";
     position: absolute;
     background-color: #343a40;
     top: 0;
     bottom: 0;
     right: 0; /* 1rem 
     left: 0;
    } */
}

.main-content__body {
  flex-grow: 1;
  padding: .5rem 1rem;
  overflow: auto;
  background: url(~~/assets/images/dotted-bg.webp) no-repeat top left transparent;
  background-size: cover;
}

.main-content__body::before {
  content: "";
  position: absolute;
  top: 0;
  left: -1.1rem;
  width: 1.1rem;
  bottom: 0;
  background-color: #fff;
  z-index: 0;
}
</style>
