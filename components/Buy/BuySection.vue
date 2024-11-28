<template>
  <div class="buy-section">
    <BuyAddNewItem />
    <BuyList />
  </div>
</template>

<style>
.buy-section__list {
  counter-reset: buy-counter;
  align-items: stretch;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
