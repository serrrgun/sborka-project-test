import 'core-js/stable';
import 'regenerator-runtime/runtime';

// import jquery from 'jquery';
// global.jquery = jquery;

import { gsap } from 'gsap';
//import { number } from 'yargs';

// import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
// gsap.registerPlugin(ScrollToPlugin);

global.gsap = gsap;

gsap.defaults({
	overwrite: 'auto',
});

class ProjectApp {
	constructor() {
		this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {
			Signal: require('./classes/Signal').default,
		};
		this.components = {};
		this.helpers = {};
		this.modules = {};
		document.addEventListener('DOMContentLoaded', () => {
			document.documentElement.classList.remove('_loading');
		});
	}
}

global.ProjectApp = new ProjectApp();

if (module.hot) {
	module.hot.accept();
}

// open cart

const basketButton = document.querySelector('.basket-button');
const cart = document.querySelector('.content__cart');

basketButton.addEventListener('click', () => {
	cart.classList.toggle('content__cart--open');
});

// open menu

const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');

menuButton.addEventListener('click', () => {
	menuButton.classList.toggle('menu-button--active');
	menu.classList.toggle('menu--open');
});

// basket

const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');

const subtotalPrice = document.querySelector('.js-subtototal-price');
const taxPrice = document.querySelector('.js-tax-price');
const shippingPrice = document.querySelector('.js-shipping-price');
const totalPrice = document.querySelector('.js-total-price');

const productList = [...document.querySelectorAll('.basket__order')];
const inputList = [...document.querySelectorAll('.basket__order-input')];

const basket = document.querySelector('.basket__list');
const basketCounter = document.querySelector('.js-counter-basket');

const calculateCounter = () => {
	let counter = +basketCounter.textContent;
	counter--;
	basketCounter.textContent = `${counter}`;
};

const init = () => {
	let totalCost = 0;

	productList.forEach((_, ind) => {
		totalCost += Number(inputList[ind].value) * Number(inputList[ind].dataset.price);
	});

	if (productList.length === 0) {
		taxPrice.dataset.tax = '0';
		taxPrice.textContent = '0';
		shippingPrice.dataset.shipping = '0';
		shippingPrice.textContent = '0';
		basket.textContent = 'Сart is empty';
	}

	subtotalPrice.textContent = formatNumber(totalCost);
	const totalCostFull = +taxPrice.dataset.tax + +shippingPrice.dataset.shipping + totalCost;
	totalPrice.textContent = formatNumber(totalCostFull);
};

const calculateSeparateItem = (basketItem, action) => {
	const input = basketItem.querySelector('.basket__order-input');
	const total = basketItem.querySelector('.basket__order-price');

	switch (action) {
		case 'plus':
			if (input.value > 0) {
				input.value++;
				total.textContent = `$ ${+input.value * +input.dataset.price}`;
				init();
			}
			break;
		case 'minus':
			if (input.value > 0) {
				input.value--;
				total.textContent = `$ ${+input.value * +input.dataset.price}`;
				init();
			}
			break;
		default:
			break;
	}
};

basket.addEventListener('click', evt => {
	if (evt.target.classList.contains('js-button--minus')) {
		calculateSeparateItem(evt.target.closest('.basket__order'), 'minus');
	}
	if (evt.target.classList.contains('js-button--plus')) {
		calculateSeparateItem(evt.target.closest('.basket__order'), 'plus');
	}

	if (evt.target.classList.contains('js-order-delete')) {
		evt.target.closest('.basket__order').remove();
		productList.pop();
		calculateCounter();
		init();
	}
});

init();
