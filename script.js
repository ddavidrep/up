"use strict";

/* CONFIGURACIÓN GENERAL - UPPSALA GRILLED BURGER */

const WHATSAPP_NUMBER = "527206325940";

// Días de la semana: 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
const MENU_SCHEDULE = {
    desayuno: {
        days: [2, 3, 4, 5, 6], // Martes a Sábado
        start: "07:00",
        end: "11:00",
        label: "Desayunos"
    },
    comida: {
        days: [4, 5, 6, 0], // Jueves a Domingo
        start: "18:00",
        end: "23:00",
        label: "Comida y Parrilla"
    }
};


/* ESTADO VISUAL DEL RESTAURANTE */

function minutesFromTimeString(timeString) {
    const [hours, minutes] =
        timeString.split(":").map(Number);
    return hours * 60 + minutes;
}


function getCurrentMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}


function formatHourLabel(timeString) {
    const [hours, minutes] =
        timeString.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat(
        "es-MX",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    ).format(date);
}


function getRestaurantOpenState() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = getCurrentMinutes();

    const breakfastConfig = MENU_SCHEDULE.desayuno;
    const foodConfig = MENU_SCHEDULE.comida;

    // Validar Desayunos
    if (breakfastConfig.days.includes(currentDay)) {
        const bStart = minutesFromTimeString(breakfastConfig.start);
        const bEnd = minutesFromTimeString(breakfastConfig.end);
        if (currentMinutes >= bStart && currentMinutes < bEnd) {
            return {
                isOpen: true,
                period: "desayuno",
                closesAt: breakfastConfig.end
            };
        }
    }

    // Validar Comida
    if (foodConfig.days.includes(currentDay)) {
        const fStart = minutesFromTimeString(foodConfig.start);
        const fEnd = minutesFromTimeString(foodConfig.end);
        if (currentMinutes >= fStart && currentMinutes < fEnd) {
            return {
                isOpen: true,
                period: "comida",
                closesAt: foodConfig.end
            };
        }
    }

    return {
        isOpen: false,
        period: null,
        opensAt: breakfastConfig.start
    };
}


function updateRestaurantHoursCard() {
    if (!restaurantHoursCard) {
        return;
    }

    const state = getRestaurantOpenState();

    if (breakfastHoursText) {
        breakfastHoursText.textContent =
            `Mar-Sáb ${formatHourLabel(MENU_SCHEDULE.desayuno.start)} – ${formatHourLabel(MENU_SCHEDULE.desayuno.end)}`;
    }

    if (foodHoursText) {
        foodHoursText.textContent =
            `Jue-Dom ${formatHourLabel(MENU_SCHEDULE.comida.start)} – ${formatHourLabel(MENU_SCHEDULE.comida.end)}`;
    }

    restaurantHoursCard.classList.toggle("is-open", state.isOpen);
    restaurantHoursCard.classList.toggle("is-closed", !state.isOpen);

    if (restaurantStatusDot) {
        restaurantStatusDot.classList.toggle("is-open", state.isOpen);
        restaurantStatusDot.classList.toggle("is-closed", !state.isOpen);
    }

    if (state.isOpen) {
        const activeLabel =
            state.period === "desayuno"
                ? "Desayunos disponibles"
                : "Comida y parrilla disponible";

        restaurantStatusLabel.textContent = "ABIERTO AHORA";
        restaurantStatusHeadline.textContent = activeLabel;
        restaurantStatusMessage.textContent =
            `Puedes ordenar hasta las ${formatHourLabel(state.closesAt)}.`;
        return;
    }

    restaurantStatusLabel.textContent = "CERRADO AHORA";
    restaurantStatusHeadline.textContent = "Fuera de horario de servicio";
    restaurantStatusMessage.textContent =
        "Consulta nuestros días y horarios de apertura.";
}


/* BASE DE DATOS DEL MENÚ - UPPSALA GRILLED BURGER */

const products = [

    /* =========================
       HAMBURGUESAS
       ========================= */
    {
        id: 1,
        name: "Vegetariana",
        category: "hamburguesas",
        categoryLabel: "Hamburguesas",
        mealPeriod: "comida",
        available: true,
        price: 90,
        badge: "Grill",
        image: "assets/img/burger1.webp",
        description: "Medallón preparado con lentejas, avena y especias acompañado de queso americano.",
        ingredients: [
            { name: "Medallón de lentejas", default: true },
            { name: "Queso americano", default: true },
            { name: "Lechuga", default: true },
            { name: "Jitomate", default: true },
            { name: "Cebolla", default: true }
        ],
        options: [
            "Sola ($90)",
            "Con guarnición de papas a la francesa ($105)",
            "Paquete: hamburguesa, papas (100gr) y refresco ($115)"
        ],
        extras: [
            { name: "Carne extra", price: 40 },
            { name: "Cambio a papas de gajo o aros de cebolla", price: 10 },
            { name: "Refresco 400ml", price: 25 },
            { name: "Refresco 600ml", price: 35 }
        ]
    },

    {
        id: 2,
        name: "Baby Burgers",
        category: "hamburguesas",
        categoryLabel: "Hamburguesas",
        mealPeriod: "comida",
        available: true,
        price: 95,
        badge: "Mini 4 pzas",
        image: "assets/img/babyburgers.JPG",
        description: "4 piezas de hamburguesas mini con carne mixta preparada en casa y queso americano.",
        ingredients: [
            { name: "4 Mini Carnes mixtas", default: true },
            { name: "Queso americano", default: true }
        ],
        options: [
            "Sola ($95)",
            "Con guarnición de papas a la francesa ($110)",
            "Paquete: hamburguesa, papas (100gr) y refresco ($120)"
        ],
        extras: [
            { name: "Carne extra", price: 40 },
            { name: "Cambio a papas de gajo o aros de cebolla", price: 10 },
            { name: "Refresco 400ml", price: 25 },
            { name: "Refresco 600ml", price: 35 }
        ]
    },

    {
        id: 3,
        name: "RickHard Choice",
        category: "hamburguesas",
        categoryLabel: "Hamburguesas",
        mealPeriod: "comida",
        available: true,
        price: 110,
        badge: "Especial",
        image: "assets/img/rickhardchoice.JPG",
        description: "Carne mixta preparada en casa, tocino, queso Oaxaca, aros de cebolla y queso americano.",
        ingredients: [
            { name: "Carne mixta", default: true },
            { name: "Tocino", default: true },
            { name: "Queso Oaxaca", default: true },
            { name: "Aros de cebolla", default: true },
            { name: "Queso americano", default: true }
        ],
        options: [
            "Sola ($110)",
            "Con guarnición de papas a la francesa ($125)",
            "Paquete: hamburguesa, papas (100gr) y refresco ($135)"
        ],
        extras: [
            { name: "Carne extra", price: 40 },
            { name: "Cambio a papas de gajo o aros de cebolla", price: 10 },
            { name: "Refresco 400ml", price: 25 },
            { name: "Refresco 600ml", price: 35 }
        ]
    },

    {
        id: 4,
        name: "Hawaiana",
        category: "hamburguesas",
        categoryLabel: "Hamburguesas",
        mealPeriod: "comida",
        available: true,
        price: 105,
        badge: "Tropical",
        image: "assets/img/hawaiana.JPG",
        description: "Carne mixta preparada en casa, tocino, queso Oaxaca, piña fresca, queso americano y jamón.",
        ingredients: [
            { name: "Carne mixta", default: true },
            { name: "Tocino", default: true },
            { name: "Queso Oaxaca", default: true },
            { name: "Piña fresca", default: true },
            { name: "Queso americano", default: true },
            { name: "Jamón", default: true }
        ],
        options: [
            "Sola ($105)",
            "Con guarnición de papas a la francesa ($120)",
            "Paquete: hamburguesa, papas (100gr) y refresco ($130)"
        ],
        extras: [
            { name: "Carne extra", price: 40 },
            { name: "Cambio a papas de gajo o aros de cebolla", price: 10 }
        ]
    },

    {
        id: 5,
        name: "Sencilla",
        category: "hamburguesas",
        categoryLabel: "Hamburguesas",
        mealPeriod: "comida",
        available: true,
        price: 95,
        badge: "Clásica",
        image: "assets/img/Sencilla.JPG",
        description: "Carne mixta preparada en casa, tocino y queso americano.",
        ingredients: [
            { name: "Carne mixta", default: true },
            { name: "Tocino", default: true },
            { name: "Queso americano", default: true }
        ],
        options: [
            "Sola ($95)",
            "Con guarnición de papas a la francesa ($110)",
            "Paquete: hamburguesa, papas (100gr) y refresco ($120)"
        ],
        extras: [
            { name: "Carne extra", price: 40 },
            { name: "Cambio a papas de gajo o aros de cebolla", price: 10 }
        ]
    },

    {
        id: 6,
        name: "Pollo",
        category: "hamburguesas",
        categoryLabel: "Hamburguesas",
        mealPeriod: "comida",
        available: true,
        price: 100,
        badge: "Crujiente",
        image: "assets/img/pollo.JPG",
        description: "Pechuga de pollo empanizada, tocino y queso americano.",
        ingredients: [
            { name: "Pechuga de pollo empanizada", default: true },
            { name: "Tocino", default: true },
            { name: "Queso americano", default: true }
        ],
        options: [
            "Sola ($100)",
            "Con guarnición de papas a la francesa ($115)",
            "Paquete: hamburguesa, papas (100gr) y refresco ($125)"
        ],
        extras: [
            { name: "Carne extra / Pollo", price: 40 },
            { name: "Cambio a papas de gajo o aros de cebolla", price: 10 }
        ]
    },


    /* =========================
       HOT DOGS
       ========================= */
    {
        id: 7,
        name: "Hot Dog Kawaiano",
        category: "hotdogs",
        categoryLabel: "Hot Dogs",
        mealPeriod: "comida",
        available: true,
        price: 70,
        badge: "Popular",
        image: "assets/img/hwaiano.JPG",
        description: "Salchicha jumbo, tocino, queso Oaxaca y piña fresca.",
        ingredients: [
            { name: "Salchicha Jumbo", default: true },
            { name: "Tocino", default: true },
            { name: "Queso Oaxaca", default: true },
            { name: "Piña fresca", default: true }
        ],
        options: [
            "Solo ($70)",
            "Con guarnición de papas a la francesa ($85)",
            "Paquete HD, papas (100gr) y refresco ($95)"
        ],
        extras: [
            { name: "Cambio a papas de gajo o aros de cebolla", price: 10 }
        ]
    },

    {
        id: 8,
        name: "Hot Dog Sencillo",
        category: "hotdogs",
        categoryLabel: "Hot Dogs",
        mealPeriod: "comida",
        available: true,
        price: 60,
        badge: "Clásico",
        image: "assets/img/sencillo.JPG",
        description: "Salchicha jumbo y tocino crujiente.",
        ingredients: [
            { name: "Salchicha Jumbo", default: true },
            { name: "Tocino", default: true }
        ],
        options: [
            "Solo ($60)",
            "Con guarnición de papas a la francesa ($75)",
            "Paquete HD, papas (100gr) y refresco ($85)"
        ],
        extras: [
            { name: "Cambio a papas de gajo o aros de cebolla", price: 10 }
        ]
    },


    /* =========================
       ALITAS Y BONELESS
       ========================= */
    {
        id: 9,
        name: "Alitas Adobadas",
        category: "alitas",
        categoryLabel: "Alitas y Boneless",
        mealPeriod: "comida",
        available: true,
        price: 80,
        badge: "5 piezas",
        image: "assets/img/Alitas.JPG",
        description: "5 piezas de alitas adobadas preparadas al gusto con salsa inglesa, jugo Maggi, BBQ, tajín y salsa.",
        ingredients: [
            { name: "5 Alitas adobadas", default: true },
            { name: "Salsa inglesa", default: true },
            { name: "Jugo Maggi", default: true },
            { name: "Salsa BBQ / Tajín", default: true }
        ],
        options: [
            "Solas ($80)",
            "Con guarnición de papas a la francesa ($95)",
            "Paquete Alitas, papas (100gr) y refresco ($105)"
        ],
        extras: [
            { name: "Cambio a papas de gajo o aros de cebolla", price: 10 }
        ]
    },

    {
        id: 10,
        name: "Boneless",
        category: "alitas",
        categoryLabel: "Alitas y Boneless",
        mealPeriod: "comida",
        available: true,
        price: 80,
        badge: "Crujientes",
        image: "assets/img/Boneless.JPG",
        description: "Trocitos de pollo empanizados bañados en tu salsa favorita.",
        ingredients: [
            { name: "Boneless de pollo", default: true },
            { name: "Aderezo / Salsa", default: true }
        ],
        options: [
            "Orden individual ($80)"
        ],
        extras: [
            { name: "Papas a la francesa", price: 50 },
            { name: "Refresco 400ml", price: 25 }
        ]
    },


    /* =========================
       ANTOJITOS
       ========================= */
    {
        id: 11,
        name: "Salchipulpos",
        category: "antojitos",
        categoryLabel: "Antojitos",
        mealPeriod: "comida",
        available: true,
        price: 45,
        badge: "Divertidos",
        image: "assets/img/papas1.webp",
        description: "Salchichas fritas cortadas en forma de pulpo.",
        ingredients: [
            { name: "Salchichas", default: true }
        ],
        options: [
            "Orden estándar ($45)"
        ],
        extras: []
    },

    {
        id: 12,
        name: "Banderillas",
        category: "antojitos",
        categoryLabel: "Antojitos",
        mealPeriod: "comida",
        available: true,
        price: 30,
        badge: "Clásicas",
        image: "assets/img/papas2.webp",
        description: "Banderilla de salchicha empanizada doradita.",
        ingredients: [
            { name: "Banderilla", default: true }
        ],
        options: [
            "Pieza ($30)"
        ],
        extras: []
    },


    /* =========================
       PAPAS Y EXTRAS
       ========================= */
    {
        id: 13,
        name: "Papas a la Francesa",
        category: "papas",
        categoryLabel: "Papas y Extras",
        mealPeriod: "comida",
        available: true,
        price: 50,
        badge: "Orden",
        image: "assets/img/papas1.webp",
        description: "Orden de papas a la francesa crujientes.",
        ingredients: [
            { name: "Papas a la francesa", default: true }
        ],
        options: [
            "Orden ($50)"
        ],
        extras: []
    },

    {
        id: 14,
        name: "Papas de Gajo",
        category: "papas",
        categoryLabel: "Papas y Extras",
        mealPeriod: "comida",
        available: true,
        price: 70,
        badge: "Especiales",
        image: "assets/img/PapasGajo.JPG",
        description: "Orden de papas de gajo sazonadas.",
        ingredients: [
            { name: "Papas de gajo", default: true }
        ],
        options: [
            "Orden ($70)"
        ],
        extras: []
    },

    {
        id: 15,
        name: "Aros de Cebolla",
        category: "papas",
        categoryLabel: "Papas y Extras",
        mealPeriod: "comida",
        available: true,
        price: 70,
        badge: "Crujientes",
        image: "assets/img/Aroscebolla.JPG",
        description: "Orden de aros de cebolla dorados.",
        ingredients: [
            { name: "Aros de cebolla", default: true }
        ],
        options: [
            "Orden ($70)"
        ],
        extras: []
    },

    {
        id: 16,
        name: "Nachos con Carne",
        category: "papas",
        categoryLabel: "Papas y Extras",
        mealPeriod: "comida",
        available: true,
        price: 80,
        badge: "Para compartir",
        image: "assets/img/papas2.webp",
        description: "Totopos crujientes con queso fundido y carne.",
        ingredients: [
            { name: "Totopos", default: true },
            { name: "Queso fundido", default: true },
            { name: "Carne", default: true }
        ],
        options: [
            "Orden ($80)"
        ],
        extras: []
    },

    {
        id: 17,
        name: "Plátanos Fritos",
        category: "papas",
        categoryLabel: "Papas y Extras",
        mealPeriod: "comida",
        available: true,
        price: 30,
        badge: "Dulces",
        image: "assets/img/Platanos.JPG",
        description: "Plátanos fritos doraditos.",
        ingredients: [
            { name: "Plátanos", default: true }
        ],
        options: [
            "Orden ($30)"
        ],
        extras: []
    },


    /* =========================
       BEBIDAS
       ========================= */
    {
        id: 18,
        name: "Refresco 400ml",
        category: "bebidas",
        categoryLabel: "Bebidas",
        mealPeriod: "comida",
        available: true,
        price: 25,
        badge: "Frío",
        image: "assets/img/limonada1.webp",
        description: "Refresco presentación 400ml.",
        ingredients: [
            { name: "Refresco", default: true }
        ],
        options: [
            "400ml ($25)"
        ],
        extras: []
    },

    {
        id: 19,
        name: "Refresco 600ml",
        category: "bebidas",
        categoryLabel: "Bebidas",
        mealPeriod: "comida",
        available: true,
        price: 35,
        badge: "Grande",
        image: "assets/img/limonada1.webp",
        description: "Refresco presentación 600ml.",
        ingredients: [
            { name: "Refresco", default: true }
        ],
        options: [
            "600ml ($35)"
        ],
        extras: []
    },


    /* =========================
       MALTEADAS Y POSTRES (DEMO)
       ========================= */
    {
        id: 20,
        name: "Malteada Uppsala",
        category: "malteadas",
        categoryLabel: "Malteadas",
        mealPeriod: "comida",
        available: true,
        price: 85,
        badge: "Cremosa",
        image: "assets/img/malteada1.webp",
        description: "Deliciosa malteada artesanal de la casa.",
        ingredients: [
            { name: "Helado artesanal", default: true },
            { name: "Crema batida", default: true }
        ],
        options: [
            "Vainilla",
            "Chocolate"
        ],
        extras: [
            { name: "Extra crema batida", price: 15 }
        ]
    },

    {
        id: 21,
        name: "Postre del Día",
        category: "postres",
        categoryLabel: "Postres",
        mealPeriod: "comida",
        available: true,
        price: 75,
        badge: "Dulce",
        image: "assets/img/brownie.webp",
        description: "Pregunta por nuestro postre especial de temporada.",
        ingredients: [
            { name: "Especialidad repostera", default: true }
        ],
        options: [
            "Porción individual ($75)"
        ],
        extras: []
    }

];


/* REFERENCIAS DEL DOM */

const productsGrid = document.querySelector("#productsGrid");
const filterButtons = document.querySelectorAll(".filter-button");
const productModal = document.querySelector("#productModal");
const modalProductImage = document.querySelector("#modalProductImage");
const modalProductName = document.querySelector("#modalProductName");
const modalProductDescription = document.querySelector("#modalProductDescription");
const modalProductPrice = document.querySelector("#modalProductPrice");
const regularOptions = document.querySelector("#regularOptions");
const productBuilderGroup = document.querySelector("#productBuilderGroup");
const productIngredientOptions = document.querySelector("#productIngredientOptions");
const extraOptions = document.querySelector("#extraOptions");
const productOptionsForm = document.querySelector("#productOptionsForm");
const productNotes = document.querySelector("#productNotes");
const modalQuantityElement = document.querySelector("#modalQuantity");
const modalButtonTotal = document.querySelector("#modalButtonTotal");
const modalSubmitLabel = document.querySelector("#modalSubmitLabel");
const decreaseModalQuantity = document.querySelector("#decreaseModalQuantity");
const increaseModalQuantity = document.querySelector("#increaseModalQuantity");
const cartSidebar = document.querySelector("#cartSidebar");
const cartOverlay = document.querySelector("#cartOverlay");
const cartItems = document.querySelector("#cartItems");
const emptyCart = document.querySelector("#emptyCart");
const cartSubtotal = document.querySelector("#cartSubtotal");
const cartCount = document.querySelector("#cartCount");
const sendWhatsAppButton = document.querySelector("#sendWhatsAppButton");
const cartSummary = document.querySelector("#cartSummary");
const checkoutToggle = document.querySelector("#checkoutToggle");
const checkoutContent = document.querySelector("#checkoutContent");
const checkoutToggleArrow = document.querySelector("#checkoutToggleArrow");
const checkoutToggleText = document.querySelector("#checkoutToggleText");
const toast = document.querySelector("#toast");
const mobileMenuButton = document.querySelector("#mobileMenuButton");
const navigation = document.querySelector("#navigation");
const menuFilters = document.querySelector("#menuFilters");
const mealPeriodButtons = document.querySelectorAll("[data-meal-period]");
const menuScheduleStatus = document.querySelector("#menuScheduleStatus");

const restaurantHoursCard = document.querySelector("#restaurantHoursCard");
const restaurantStatusDot = document.querySelector("#restaurantStatusDot");
const restaurantStatusLabel = document.querySelector("#restaurantStatusLabel");
const restaurantStatusHeadline = document.querySelector("#restaurantStatusHeadline");
const restaurantStatusMessage = document.querySelector("#restaurantStatusMessage");
const breakfastHoursText = document.querySelector("#breakfastHoursText");
const foodHoursText = document.querySelector("#foodHoursText");

const floatingCartButton = document.querySelector("#floatingCartButton");
const floatingCartCount = document.querySelector("#floatingCartCount");
const floatingCartTotal = document.querySelector("#floatingCartTotal");

const tableField = document.querySelector("#tableField");
const customerNameField = document.querySelector("#customerNameField");
const customerName = document.querySelector("#customerName");
const addressField = document.querySelector("#addressField");
const deliveryAddress = document.querySelector("#deliveryAddress");
const referencesField = document.querySelector("#referencesField");
const deliveryReferences = document.querySelector("#deliveryReferences");
const orderNotes = document.querySelector("#orderNotes");
const cashPaymentOption = document.querySelector("#cashPaymentOption");
const deliveryPaymentNotice = document.querySelector("#deliveryPaymentNotice");
const bankDetails = document.querySelector("#bankDetails");


/* ESTADO DE LA APLICACIÓN */

let currentProduct = null;
let editingCartId = null;
let modalQuantity = 1;
let cart = loadCart();
let currentCategory = "todos";
let currentMealPeriod = getCurrentServicePeriod() || "comida";
let lastDetectedServicePeriod = getCurrentServicePeriod();


/* UTILIDADES */

function formatCurrency(value) {
    return new Intl.NumberFormat(
        "es-MX",
        {
            style: "currency",
            currency: "MXN"
        }
    ).format(value);
}


function createUniqueId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}


function saveCart() {
    localStorage.setItem("uppsalaCart", JSON.stringify(cart));
}


function loadCart() {
    try {
        const savedCart = localStorage.getItem("uppsalaCart");
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("No fue posible recuperar el carrito:", error);
        return [];
    }
}


function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(showToast.timeout);

    showToast.timeout = window.setTimeout(
        () => {
            toast.classList.remove("is-visible");
        },
        2400
    );
}


/* HORARIOS Y DISPONIBILIDAD */

function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}


function isPeriodActiveToday(periodKey) {
    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const config = MENU_SCHEDULE[periodKey];

    if (!config.days.includes(currentDay)) {
        return false;
    }

    const startMinutes = timeToMinutes(config.start);
    const endMinutes = timeToMinutes(config.end);

    if (startMinutes <= endMinutes) {
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }

    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}


function getCurrentServicePeriod() {
    if (isPeriodActiveToday("desayuno")) {
        return "desayuno";
    }
    if (isPeriodActiveToday("comida")) {
        return "comida";
    }
    return null;
}


function getPeriodAvailabilityText(period) {
    const schedule = MENU_SCHEDULE[period];
    return `${schedule.start}–${schedule.end}`;
}


function isProductOrderable(product) {
    return (
        product.available !== false &&
        getCurrentServicePeriod() === product.mealPeriod
    );
}


function getProductAvailabilityLabel(product) {
    if (product.available === false) {
        return "Agotado";
    }

    const currentPeriod = getCurrentServicePeriod();

    if (!currentPeriod) {
        return "Fuera de horario o día cerrado";
    }

    if (currentPeriod !== product.mealPeriod) {
        return `Disponible en su turno`;
    }

    return "";
}


function updateScheduleInterface() {
    const activePeriod = getCurrentServicePeriod();

    mealPeriodButtons.forEach((button) => {
        const period = button.dataset.mealPeriod;

        button.classList.toggle("active", period === currentMealPeriod);
        button.classList.toggle("is-orderable", period === activePeriod);
    });

    if (!activePeriod) {
        menuScheduleStatus.innerHTML = `
            <strong>Servicio cerrado en este momento.</strong>
            Desayunos (Mar–Sáb 7:00–11:00) ·
            Comida y Parrilla (Jue–Dom 18:00–23:00).
        `;
    } else if (activePeriod === "desayuno") {
        menuScheduleStatus.innerHTML = `
            <strong>Turno de desayunos activo.</strong>
            Disponibles de Martes a Sábado de 7:00 a 11:00.
        `;
    } else {
        menuScheduleStatus.innerHTML = `
            <strong>Turno de comida y parrilla activo.</strong>
            Disponibles de Jueves a Domingo de 18:00 a 23:00.
        `;
    }

    menuFilters.hidden = currentMealPeriod === "desayuno";
}


/* RENDER DEL MENÚ */

function createProductCard(product, index) {
    const card = document.createElement("article");
    const orderable = isProductOrderable(product);
    const unavailableLabel = getProductAvailabilityLabel(product);

    card.className = "product-card is-appearing";

    if (!orderable) {
        card.classList.add("product-card--unavailable");
    }

    card.dataset.category = product.category;
    card.style.animationDelay = `${(index % 3) * 70}ms`;

    card.innerHTML = `
        <div class="product-card__image-wrapper">
            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-card__image"
                loading="lazy"
                decoding="async"
            >

            <span class="product-card__badge">
                ${orderable ? product.badge : unavailableLabel}
            </span>

            ${
                !orderable
                    ? `
                        <div class="product-card__unavailable-overlay">
                            <strong>${unavailableLabel}</strong>
                        </div>
                    `
                    : ""
            }
        </div>

        <div class="product-card__content">
            <span class="product-card__category">
                ${product.categoryLabel}
            </span>

            <div class="product-card__heading">
                <h3>${product.name}</h3>

                <span class="product-card__price">
                    ${formatCurrency(product.price)}
                </span>
            </div>

            <p class="product-card__description">
                ${product.description}
            </p>

            <button
                type="button"
                class="product-card__button"
                data-product-id="${product.id}"
                ${orderable ? "" : "disabled"}
            >
                ${orderable ? "Personalizar" : unavailableLabel}

                <span aria-hidden="true">
                    ${orderable ? "↗" : "×"}
                </span>
            </button>
        </div>
    `;

    return card;
}


function renderProducts(category = currentCategory) {
    currentCategory = category;
    productsGrid.innerHTML = "";

    const periodProducts = products.filter(
        (product) => product.mealPeriod === currentMealPeriod
    );

    const filteredProducts =
        category === "todos"
            ? periodProducts
            : periodProducts.filter(
                (product) => product.category === category
            );

    if (!filteredProducts.length) {
        productsGrid.innerHTML = `
            <div class="menu-empty-state">
                <span>🍔</span>
                <h3>No hay productos disponibles</h3>
                <p>Prueba seleccionando otra categoría o turno del menú.</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach((product, index) => {
        productsGrid.append(createProductCard(product, index));
    });
}


/* FILTROS */

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;
        currentCategory = category;

        filterButtons.forEach((currentButton) => {
            currentButton.classList.remove("active");
        });

        button.classList.add("active");
        renderProducts(category);
    });
});


mealPeriodButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentMealPeriod = button.dataset.mealPeriod;
        currentCategory = "todos";

        filterButtons.forEach((currentButton) => {
            currentButton.classList.toggle(
                "active",
                currentButton.dataset.category === "todos"
            );
        });

        updateScheduleInterface();
        renderProducts();
    });
});


/* MODAL DE PERSONALIZACIÓN */

productsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-id]");
    if (!button) return;

    const productId = Number(button.dataset.productId);
    const selectedProduct = products.find((product) => product.id === productId);

    if (!selectedProduct) return;

    openProductModal(selectedProduct);
});


function openProductModal(product, cartItem = null) {
    if (!cartItem && !isProductOrderable(product)) {
        showToast(getProductAvailabilityLabel(product));
        return;
    }

    currentProduct = product;
    editingCartId = cartItem?.cartId || null;
    modalQuantity = cartItem?.quantity || 1;

    modalProductImage.src = product.image;
    modalProductImage.alt = product.name;
    modalProductName.textContent = product.name;
    modalProductDescription.textContent = product.description;
    modalProductPrice.textContent = formatCurrency(product.price);
    modalQuantityElement.textContent = modalQuantity;
    productNotes.value = cartItem?.notes || "";

    renderProductIngredients(product, cartItem);
    renderRegularOptions(product.options);
    renderExtraOptions(product.extras);

    if (cartItem) {
        const selectedOptions = new Set(cartItem.options || []);

        regularOptions
            .querySelectorAll('input[name="regularOption"]')
            .forEach((input) => {
                input.checked = selectedOptions.has(input.value);
            });

        const selectedExtras = new Set(
            (cartItem.extras || []).map((extra) => extra.name)
        );

        extraOptions
            .querySelectorAll('input[name="extraOption"]')
            .forEach((input) => {
                input.checked = selectedExtras.has(input.value);
            });
    }

    modalSubmitLabel.textContent = cartItem
        ? "Guardar cambios"
        : "Agregar al carrito";

    updateModalTotal();

    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}


function closeProductModal() {
    productModal.classList.remove("is-open");
    productModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    currentProduct = null;
    editingCartId = null;
    modalSubmitLabel.textContent = "Agregar al carrito";
}


/* OPCIONES DE INGREDIENTES */

function renderProductIngredients(product, cartItem = null) {
    if (!productBuilderGroup || !productIngredientOptions) return;

    const ingredients = product.ingredients || [];

    if (!ingredients.length) {
        productBuilderGroup.hidden = true;
        productIngredientOptions.innerHTML = "";
        return;
    }

    productBuilderGroup.hidden = false;
    productIngredientOptions.innerHTML = "";

    const savedSelections = Array.isArray(cartItem?.ingredientSelections)
        ? new Set(cartItem.ingredientSelections)
        : null;

    ingredients.forEach((ingredient, index) => {
        const isChecked = savedSelections
            ? savedSelections.has(ingredient.name)
            : ingredient.default;

        const label = document.createElement("label");
        label.className = "ingredient-option";

        label.innerHTML = `
            <input
                type="checkbox"
                name="productIngredient"
                value="${ingredient.name}"
                data-default="${ingredient.default}"
                id="product-ingredient-${index}"
                ${isChecked ? "checked" : ""}
            >
            <span class="ingredient-option__switch" aria-hidden="true"></span>
            <span class="ingredient-option__name">${ingredient.name}</span>
            <small class="ingredient-option__status">
                ${isChecked ? "Incluido" : "Sin agregar"}
            </small>
        `;

        productIngredientOptions.append(label);
    });

    updateIngredientOptionStates();
}


function updateIngredientOptionStates() {
    if (!productIngredientOptions) return;

    productIngredientOptions
        .querySelectorAll('input[name="productIngredient"]')
        .forEach((input) => {
            const label = input.closest(".ingredient-option");
            const status = label?.querySelector(".ingredient-option__status");

            label?.classList.toggle("is-selected", input.checked);

            if (status) {
                status.textContent = input.checked ? "Incluido" : "Sin agregar";
            }
        });
}


function getSelectedProductIngredients() {
    return Array.from(
        document.querySelectorAll('input[name="productIngredient"]:checked')
    ).map((input) => input.value);
}


function getProductIngredientChanges() {
    if (!currentProduct?.ingredients?.length) return [];

    const selected = new Set(getSelectedProductIngredients());

    return currentProduct.ingredients
        .map((ingredient) => {
            const isSelected = selected.has(ingredient.name);

            if (ingredient.default && !isSelected) {
                return `Sin ${ingredient.name}`;
            }

            if (!ingredient.default && isSelected) {
                return `Con ${ingredient.name}`;
            }

            return null;
        })
        .filter(Boolean);
}


function renderRegularOptions(options) {
    regularOptions.innerHTML = "";

    if (!options.length) {
        regularOptions.innerHTML = `
            <p class="no-options">Este producto no requiere modificaciones adicionales.</p>
        `;
        return;
    }

    options.forEach((option, index) => {
        const label = document.createElement("label");
        label.className = "option-label";

        label.innerHTML = `
            <span>${option}</span>
            <input
                type="checkbox"
                name="regularOption"
                value="${option}"
                id="regular-option-${index}"
            >
        `;
        regularOptions.append(label);
    });
}


function renderExtraOptions(extras) {
    extraOptions.innerHTML = "";

    if (!extras || !extras.length) {
        extraOptions.innerHTML = `
            <p class="no-options">No hay extras disponibles para este producto.</p>
        `;
        return;
    }

    extras.forEach((extra, index) => {
        const label = document.createElement("label");
        label.className = "option-label";

        label.innerHTML = `
            <span>${extra.name}</span>
            <strong>+${formatCurrency(extra.price)}</strong>
            <input
                type="checkbox"
                name="extraOption"
                value="${extra.name}"
                data-price="${extra.price}"
                id="extra-option-${index}"
            >
        `;
        extraOptions.append(label);
    });
}


productOptionsForm.addEventListener("change", (event) => {
    if (event.target.matches('input[name="productIngredient"]')) {
        updateIngredientOptionStates();
    }
    updateModalTotal();
});


decreaseModalQuantity.addEventListener("click", () => {
    modalQuantity = Math.max(1, modalQuantity - 1);
    modalQuantityElement.textContent = modalQuantity;
    updateModalTotal();
});


increaseModalQuantity.addEventListener("click", () => {
    modalQuantity += 1;
    modalQuantityElement.textContent = modalQuantity;
    updateModalTotal();
});


function getSelectedExtras() {
    return Array.from(
        document.querySelectorAll('input[name="extraOption"]:checked')
    ).map((input) => ({
        name: input.value,
        price: Number(input.dataset.price)
    }));
}


function calculateCurrentUnitPrice() {
    if (!currentProduct) return 0;

    const extrasTotal = getSelectedExtras().reduce(
        (total, extra) => total + extra.price,
        0
    );

    return currentProduct.price + extrasTotal;
}


function updateModalTotal() {
    const total = calculateCurrentUnitPrice() * modalQuantity;
    modalButtonTotal.textContent = formatCurrency(total);
}


/* AGREGAR AL CARRITO */

productOptionsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!currentProduct) return;

    const selectedOptions = Array.from(
        document.querySelectorAll('input[name="regularOption"]:checked')
    ).map((input) => input.value);

    const selectedExtras = getSelectedExtras();
    const ingredientSelections = getSelectedProductIngredients();
    const ingredientChanges = getProductIngredientChanges();
    const unitPrice = calculateCurrentUnitPrice();

    const cartItemData = {
        productId: currentProduct.id,
        name: currentProduct.name,
        image: currentProduct.image,
        basePrice: currentProduct.price,
        unitPrice,
        quantity: modalQuantity,
        options: selectedOptions,
        extras: selectedExtras,
        ingredientSelections,
        ingredientChanges,
        notes: productNotes.value.trim()
    };

    const productName = currentProduct.name;

    if (editingCartId) {
        const itemIndex = cart.findIndex((item) => item.cartId === editingCartId);
        if (itemIndex !== -1) {
            cart[itemIndex] = { ...cartItemData, cartId: editingCartId };
        }

        saveCart();
        renderCart();
        animateCartCount();
        closeProductModal();
        showToast(`${productName} actualizado`);
        return;
    }

    cart.push({ ...cartItemData, cartId: createUniqueId() });
    saveCart();
    renderCart();
    animateCartCount();
    animateFloatingCart();
    closeProductModal();
    showToast(`${productName} agregado al carrito`);
});


/* RENDER DEL CARRITO */

function renderCart() {
    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    cartSubtotal.textContent = formatCurrency(subtotal);

    floatingCartButton.hidden = cart.length === 0;
    floatingCartCount.textContent = `${totalQuantity} ${totalQuantity === 1 ? "producto" : "productos"}`;
    floatingCartTotal.textContent = formatCurrency(subtotal);
    sendWhatsAppButton.disabled = cart.length === 0;
    emptyCart.hidden = cart.length > 0;

    cartItems.querySelectorAll(".cart-item").forEach((item) => item.remove());

    cart.forEach((item) => {
        cartItems.append(createCartItem(item));
    });
}


function createCartItem(item) {
    const article = document.createElement("article");
    article.className = "cart-item";
    article.dataset.cartId = item.cartId;

    const optionsText = buildItemSpecifications(item);

    article.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item__image">

        <div class="cart-item__content">
            <div class="cart-item__heading">
                <h3>${item.name}</h3>
                <span class="cart-item__price">
                    ${formatCurrency(item.unitPrice * item.quantity)}
                </span>
            </div>

            ${optionsText ? `<p class="cart-item__options">${optionsText}</p>` : ""}
            ${item.notes ? `<p class="cart-item__notes">Nota: ${item.notes}</p>` : ""}
        </div>

        <div class="cart-item__footer">
            <div class="cart-item__quantity-controls" aria-label="Cantidad">
                <button type="button" data-cart-action="decrease" aria-label="Disminuir">−</button>
                <span class="cart-item__quantity">${item.quantity}</span>
                <button type="button" data-cart-action="increase" aria-label="Aumentar">+</button>
            </div>

            <div class="cart-item__secondary-actions">
                <button type="button" class="cart-item__edit" data-cart-action="edit">Editar</button>
                <button type="button" class="cart-item__remove" data-cart-action="remove">Eliminar</button>
            </div>
        </div>
    `;

    return article;
}


function buildItemSpecifications(item) {
    const specifications = [
        ...(item.ingredientChanges || []),
        ...(item.options || []),
        ...(item.extras || []).map((extra) => extra.name)
    ];
    return specifications.join(", ");
}


cartItems.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-cart-action]");
    if (!actionButton) return;

    const cartItemElement = actionButton.closest(".cart-item");
    if (!cartItemElement) return;

    const cartId = cartItemElement.dataset.cartId;
    const action = actionButton.dataset.cartAction;

    updateCartItem(cartId, action);
});


function updateCartItem(cartId, action) {
    const item = cart.find((currentItem) => currentItem.cartId === cartId);
    if (!item) return;

    if (action === "edit") {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            showToast("No fue posible editar este producto");
            return;
        }
        closeCart();
        openProductModal(product, item);
        return;
    }

    if (action === "increase") {
        item.quantity += 1;
    }

    if (action === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter((c) => c.cartId !== cartId);
        }
    }

    if (action === "remove") {
        cart = cart.filter((c) => c.cartId !== cartId);
        showToast(`${item.name} eliminado del carrito`);
    }

    saveCart();
    renderCart();
}


/* CHECKOUT PLEGABLE Y FLUJO */

function setCheckoutCollapsed(collapsed) {
    if (!cartSummary || !checkoutToggle || !checkoutContent) return;

    cartSummary.classList.toggle("is-collapsed", collapsed);
    checkoutContent.classList.toggle("is-collapsed", collapsed);
    checkoutToggle.classList.toggle("is-collapsed", collapsed);
    checkoutToggle.setAttribute("aria-expanded", String(!collapsed));

    if (checkoutToggleArrow) {
        checkoutToggleArrow.textContent = collapsed ? "↑" : "↓";
    }

    if (checkoutToggleText) {
        checkoutToggleText.textContent = collapsed ? "Finalizar pedido" : "Ocultar opciones";
    }
}


checkoutToggle?.addEventListener("click", () => {
    const isCollapsed = checkoutContent.classList.contains("is-collapsed");
    setCheckoutCollapsed(!isCollapsed);
});


function openCart() {
    cartSidebar.classList.add("is-open");
    cartOverlay.classList.add("is-open");
    cartSidebar.setAttribute("aria-hidden", "false");
    cartOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    if (
        window.matchMedia("(max-width: 720px)").matches &&
        cart.length >= 2
    ) {
        setCheckoutCollapsed(true);
    }
}


function closeCart() {
    cartSidebar.classList.remove("is-open");
    cartOverlay.classList.remove("is-open");
    cartSidebar.setAttribute("aria-hidden", "true");
    cartOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}


document.querySelectorAll(
    "#headerCartButton, #heroCartButton, #contactCartButton"
).forEach((button) => {
    button.addEventListener("click", openCart);
});


document.querySelector("#closeCartButton").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
floatingCartButton.addEventListener("click", openCart);


function animateFloatingCart() {
    floatingCartButton.classList.remove("is-bumping");
    void floatingCartButton.offsetWidth;
    floatingCartButton.classList.add("is-bumping");
}


function getSelectedFulfillment() {
    return document.querySelector('input[name="fulfillmentType"]:checked')?.value || "local";
}


function getSelectedPaymentMethod() {
    return document.querySelector('input[name="paymentMethod"]:checked')?.value || "";
}


function updateCheckoutFields() {
    const fulfillment = getSelectedFulfillment();

    tableField.hidden = fulfillment !== "local";
    customerNameField.hidden = fulfillment === "local";
    addressField.hidden = fulfillment !== "domicilio";
    referencesField.hidden = fulfillment !== "domicilio";

    const cashInput = document.querySelector('input[name="paymentMethod"][value="efectivo"]');
    const transferInput = document.querySelector('input[name="paymentMethod"][value="transferencia"]');
    const isDelivery = fulfillment === "domicilio";

    cashInput.disabled = isDelivery;
    cashPaymentOption.classList.toggle("is-disabled", isDelivery);
    deliveryPaymentNotice.hidden = !isDelivery;

    if (isDelivery) {
        transferInput.checked = true;
        cashInput.checked = false;
    }

    updateBankDetails();
}


function updateBankDetails() {
    bankDetails.hidden = getSelectedPaymentMethod() !== "transferencia";
}


document.querySelectorAll('input[name="fulfillmentType"]').forEach((input) => {
    input.addEventListener("change", updateCheckoutFields);
});


document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
    input.addEventListener("change", updateBankDetails);
});


function validateCheckout() {
    const fulfillment = getSelectedFulfillment();

    if (fulfillment === "llevar") {
        if (!customerName.value.trim()) {
            showToast("Escribe el nombre del cliente");
            customerName.focus();
            return false;
        }
    }

    if (fulfillment === "domicilio") {
        if (!customerName.value.trim()) {
            showToast("Escribe el nombre de quien recibe");
            customerName.focus();
            return false;
        }

        if (!deliveryAddress.value.trim()) {
            showToast("Escribe la dirección de entrega");
            deliveryAddress.focus();
            return false;
        }
    }

    if (!getSelectedPaymentMethod()) {
        showToast("Selecciona un método de pago");
        return false;
    }

    return true;
}


/* WHATSAPP */

sendWhatsAppButton.addEventListener("click", () => {
    if (!cart.length) return;
    if (!validateCheckout()) return;

    const message = createWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});


function createWhatsAppMessage() {
    const fulfillment = getSelectedFulfillment();
    const paymentMethod = getSelectedPaymentMethod();

    const fulfillmentLabels = {
        local: "En local",
        llevar: "Para llevar",
        domicilio: "A domicilio"
    };

    const paymentLabels = {
        efectivo: "Efectivo",
        transferencia: "Transferencia (Mercado Pago)"
    };

    const lines = [
        "🍔 NUEVO PEDIDO - UPPSALA GRILLED BURGER",
        ""
    ];

    cart.forEach((item) => {
        lines.push(`${item.quantity}x ${item.name}`);
        lines.push(`Precio base: ${formatCurrency(item.basePrice)}`);

        if (item.options.length) {
            lines.push("Opciones:");
            item.options.forEach((opt) => lines.push(`• ${opt}`));
        }

        if (item.extras.length) {
            lines.push("Extras:");
            item.extras.forEach((ext) => lines.push(`• ${ext.name} +${formatCurrency(ext.price)}`));
        }

        if (item.notes) {
            lines.push(`Nota: ${item.notes}`);
        }

        lines.push(`Subtotal: ${formatCurrency(item.unitPrice * item.quantity)}`);
        lines.push("");
    });

    const total = cart.reduce((sub, item) => sub + item.unitPrice * item.quantity, 0);

    lines.push("------------------------");
    lines.push(`TOTAL: ${formatCurrency(total)}`);
    lines.push("");
    lines.push(`Modalidad: ${fulfillmentLabels[fulfillment]}`);

    if (fulfillment === "local") {
        lines.push("Mesa: se asigna al llegar");
    }

    if (fulfillment === "llevar" || fulfillment === "domicilio") {
        lines.push(`Nombre: ${customerName.value.trim()}`);
    }

    if (fulfillment === "domicilio") {
        lines.push(`Dirección: ${deliveryAddress.value.trim()}`);
        if (deliveryReferences.value.trim()) {
            lines.push(`Referencias: ${deliveryReferences.value.trim()}`);
        }
    }

    lines.push(`Pago: ${paymentLabels[paymentMethod]}`);

    if (orderNotes.value.trim()) {
        lines.push(`Notas generales: ${orderNotes.value.trim()}`);
    }

    if (fulfillment === "domicilio") {
        lines.push("");
        lines.push("Costo de envío: por confirmar");
    }

    return lines.join("\n");
}


/* CERRAR MODALES CON ESC */

document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeProductModal);
});


document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && productModal.classList.contains("is-open")) {
        closeProductModal();
    }
    if (event.key === "Escape" && cartSidebar.classList.contains("is-open")) {
        closeCart();
    }
});


function animateCartCount() {
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("bump");
}


mobileMenuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
});


navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navigation.classList.remove("is-open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
    });
});


/* INICIALIZACIÓN */

updateScheduleInterface();
renderProducts();
renderCart();
updateCheckoutFields();

window.setInterval(() => {
    const detectedPeriod = getCurrentServicePeriod();
    if (detectedPeriod !== lastDetectedServicePeriod) {
        lastDetectedServicePeriod = detectedPeriod;
        if (detectedPeriod) {
            currentMealPeriod = detectedPeriod;
            currentCategory = "todos";
        }
        updateScheduleInterface();
        renderProducts();
    }
}, 60000);

updateRestaurantHoursCard();
window.setInterval(updateRestaurantHoursCard, 60 * 1000);