<script setup lang="ts">
	import InputNumber from 'primevue/inputnumber';
	import type { InputNumberInputEvent } from 'primevue/inputnumber';
	const props = defineProps<{
		value: number
	}>();
	const emit = defineEmits<{
		(e: '@price-changed', newInputValue: number): void;
	}>();

	const changeValue = (newValue: number) => {
		const valueRounded = Math.round((newValue + Number.EPSILON) * 100) / 100;
		const resultValue = valueRounded && (valueRounded > 0)
			? valueRounded
			: 0;
		emit('@price-changed', resultValue);
	};

	const handleInput = (event: InputNumberInputEvent) => {
		const numberValue = Number(event.value);
		changeValue(numberValue);
	};
</script>

<template>
	<div class="step-input">
		<div class="step-input__controls">
			<span class="step-input__control-wrapper step-input__control-wrapper--ten">
				<button
					class="p-button p-component p-button-icon-only p-inputnumber-button p-inputnumber-button-up step-input__control--up"
					@click.prevent="changeValue(props.value + 10)">
					<span class="pi pi-angle-up p-button-icon"></span>
				</button>
				<button
					class="p-button p-component p-button-icon-only p-inputnumber-button p-inputnumber-button-down step-input__control--down"
					@click.prevent="changeValue(props.value - 10)">
					<span class="pi pi-angle-down p-button-icon"></span>
				</button>
			</span>
			<span class="step-input__control-wrapper step-input__control-wrapper--one">
				<button
					class="p-button p-component p-button-icon-only p-inputnumber-button p-inputnumber-button-up step-input__control--up"
					@click.prevent="changeValue(props.value + 1)">
					<span class="pi pi-angle-up p-button-icon"></span>
				</button>
				<button
					class="p-button p-component p-button-icon-only p-inputnumber-button p-inputnumber-button-down step-input__control--down"
					@click.prevent="changeValue(props.value - 1)">
					<span class="pi pi-angle-down p-button-icon"></span>
				</button>
			</span>
			<span class="step-input__control-dot">.</span>
			<span class="step-input__control-wrapper step-input__control-wrapper--tenth">
				<button
					class="p-button p-component p-button-icon-only p-inputnumber-button p-inputnumber-button-up step-input__control--up"
					@click.prevent="changeValue(props.value + 0.10)">
					<span class="pi pi-angle-up p-button-icon"></span>
				</button>
				<button
					class="p-button p-component p-button-icon-only p-inputnumber-button p-inputnumber-button-down step-input__control--down"
					@click.prevent="changeValue(props.value - 0.10)">
					<span class="pi pi-angle-down p-button-icon"></span>
				</button>
			</span>
		</div>
		<InputNumber 
			:step="0.01" 
			:min="0" 
			:minFractionDigits="2" :maxFractionDigits="2" 
			showButtons
			:value="props.value" 
			@input="handleInput" 
			mode="decimal" 
		/>
	</div>
</template> 

<style scoped>
 .step-input {
 	display: inline-block;
 	position: relative;
 }

 .step-input__controls {
 	display: flex;
 	justify-content: flex-end;
 	margin-right: 2.357rem;
 	position: absolute;
 	top: -1.2rem;
 }

 .step-input__control-wrapper {
 	display: flex;
 	justify-content: flex-end;
 	margin-left: .2rem;
 }

 .step-input__control--up,
 .step-input__control--down {
 	padding: 0;
 	cursor: pointer;
 	width: 2rem;
 	line-height: 1.2;
 	border-radius: .1875rem;

 	.step-input__control-wrapper--ten & {
 		background-color: brown;
 		border-color: brown;
 	}

 	.step-input__control-wrapper--one & {
 		background-color: burlywood;
 		border-color: burlywood;
 	}

 	.step-input__control-wrapper--tenth & {
 		background-color: cadetblue;
 		border-color: cadetblue;
 	}
 }

 .step-input__control--up {
 	border-top-right-radius: 0;
 	border-bottom-left-radius: 0;
 	border-bottom-right-radius: 0;
 }

 .step-input__control--down {
 	border-top-left-radius: 0;
 	border-bottom-left-radius: 0;
 	border-bottom-right-radius: 0;
 }

 .step-input__control-dot {
 	font-size: 2rem;
 	line-height: 1;
 	font-weight: bold;
 }
</style>
