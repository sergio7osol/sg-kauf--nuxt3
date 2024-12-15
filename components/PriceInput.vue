<script setup lang="ts">
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
		<div class="step-input__controls"> <!-- TODO: change to custom buttons inside number field -->
			<PrimeButtonGroup class="step-input__control-wrapper step-input__control-wrapper--ten">
				<PrimeButton
					class="step-input__control--up"
					icon="pi pi-angle-up"
					@click.prevent="changeValue(props.value + 10)"
					severity="primary"
					aria-label="Add 10"
					raised
					outlined
				/>
				<PrimeButton
					class="step-input__control--down"
					icon="pi pi-angle-down"
					@click.prevent="changeValue(props.value - 10)"
					severity="primary"
					aria-label="Subtract 10"
					raised
					outlined
				/>
			</PrimeButtonGroup>
			<PrimeButtonGroup class="step-input__control-wrapper step-input__control-wrapper--one">
				<PrimeButton
					class="step-input__control--up"
					icon="pi pi-angle-up"
					@click.prevent="changeValue(props.value + 1)"
					severity="primary"
					aria-label="Add 1"
					raised
					outlined
				/>
				<PrimeButton
					class="step-input__control--down"
					icon="pi pi-angle-down"
					@click.prevent="changeValue(props.value - 1)"
					severity="primary"
					aria-label="Subtract 1"
					raised
					outlined
				/>
			</PrimeButtonGroup>
			<span class="step-input__control-dot">.</span>
			<PrimeButtonGroup class="step-input__control-wrapper step-input__control-wrapper--tenth">
				<PrimeButton
					class="step-input__control--up"
					icon="pi pi-angle-up"
					@click.prevent="changeValue(props.value + 0.10)"
					severity="primary"
					aria-label="Add 0.10"
					raised
					outlined
				/>
				<PrimeButton
					class="step-input__control--down"
					icon="pi pi-angle-down"
					@click.prevent="changeValue(props.value - 0.10)"
					severity="primary"
					aria-label="Subtract 0.10"
					raised
					outlined
				/>
			</PrimeButtonGroup>
		</div>
		<PrimeInputNumber
			:step="0.01"
			:min="0"
			:minFractionDigits="2"
			:maxFractionDigits="2"
			showButtons
			:modelValue="props.value"
			class="step-input__text-field"
			@input="handleInput"
			mode="decimal"
		/>
	</div>
</template>

<style scoped>
.step-input {
	display: inline-flex;
	flex-direction: column;
	position: relative;
}

.step-input__controls {
	display: flex;
	width: 100%;
	height: 100%;
	transform: translateY(15%);
}

.step-input__control-wrapper {
	display: flex;
	justify-content: flex-end;
	margin-left: .2rem;
}

.step-input__control--up,
.step-input__control--down {
	background-color: var(--primary-control-bg-color);
	padding: 0;
	cursor: pointer;
	width: 2rem;
	line-height: 1.2;
	border-color: var(--primary-control-border-color);
	border-radius: .1875rem;
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
	transform: translateY(-13%);
	margin-left: .2rem;
}

.step-input__text-field {
	width: calc(100% + .2rem);
}
</style>
