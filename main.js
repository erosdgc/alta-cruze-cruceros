function Cruise(id, destination, image, departure, departureDate, duration, price) {
        this.id = id;
        this.destination = destination;
        this.image = image;
        this.departure = departure;
        this.departureDate = departureDate;
        this.duration = duration;
        this.price = price;
        this.quantity = 0;
        this.subtotal = 0;
        this.subTotal = () => this.subtotal = this.price * this.quantity;
        this.decreaseQuantity = () => this.quantity--;
        this.increaseQuantity = () => this.quantity++;
    }

const $main = document.getElementById("main");
const $iconCart = document.getElementById("icon-cart-container");
const $cart = document.getElementById("cart");
const $total = document.createElement("footer");
$total.classList.add("cart-total");
let listCruises = [];
let cart = [];
let loadData = [];

const getBBD = async () => {
    const res = await fetch('./data/bdd.json')
    const data = await res.json();
    listCruises = [];
    loadData += 4;
    for (let i = 0; i < loadData; i++) {
        if (data[i] == undefined) {
            const btnLoadMore = document.querySelector("#btn-load-more");
            btnLoadMore.disabled = true;
            btnLoadMore.classList.add("btn-disabled-load-more");
            return;
        }
        listCruises.push(new Cruise(data[i].id, data[i].destination, data[i].image, data[i].departure, data[i].departureDate, data[i].duration, data[i].price));
        renderCruises();
        inCart();
    }
}

// Render cruises cards
const renderCruises = () => {
    $main.innerHTML = "";
    listCruises.forEach(el => {
        $main.innerHTML += `
        <article class="col-12 row card card-cruise p-3 mt-5 shadow-sm rounded-0">
            <div class="d-flex justify-content-around">
                <div class="card-image shadow border">
                    <img src="${el.image}" alt="${el.destination}" />
                </div>
                <div class="shadow card-info d-flex flex-column p-3">
                    <h2 class="card-name roboto-font">${el.destination}</h2>
                    <h4 class="departurePoint roboto-font">Desde ${el.departure}</h4>
                    <p class="roboto-font initialism">${el.duration} noches</p>
                    <p class="roboto-font mb-0">Próxima fecha de salida</p>
                    <p class="roboto-font">${el.departureDate}</p>
                    <p class="roboto-font initialism mb-0">Precio por persona</p>
                    <h4 class="roboto-font card-price">$${el.price}</h4>
                    <button class="btn btn-success rounded-0 btn-custom-color card-btn-buy mt-2 p-3" data-id="${el.id}">RESERVAR</button>
                    <p class="initialism text-center mt-4 mb-0 text-muted">Tasa de servicios incluida.</p>
                </div>
            </div>
        </article>`;
    });
}

// Agregar viaje al carrito
const bookCruise = e => {
    if (e.target.matches(".card-btn-buy")) {
        const cruiseFound = listCruises.find(el => el.id === Number(e.target.dataset.id));
        const cruiseInCart = cart.find(el => el.id === cruiseFound.id);
        if (!cruiseInCart) {
            cruiseFound.increaseQuantity();
            cart.push(cruiseFound);
        }
        alertCruiseAdded();
        addToCart();
        saveToLocalStorage();
    }
}

// Paquete por persona agregado
const alertCruiseAdded = () => {
    setTimeout(() => {
        $iconCart.removeChild(document.getElementById("bookedCruise"));
    }, 500);
}

// Al clickear en "RESERVAR", una vez que aparezca en el carrito, aparecerá en el index como "RESERVADO" en verde
const inCart = () => {
    const $btnsBuy = document.querySelectorAll(".card-btn-buy");
    $btnsBuy.forEach(btn => {
        const btnFound = cart.find(el => el.id === Number(btn.dataset.id));
        btnFound ? (
            btn.disabled = true,
            btn.classList.add("btn-disabled"),
            btn.textContent = "RESERVADO"
        ) : (
            btn.disabled = false,
            btn.classList.remove("btn-disabled"),
            btn.textContent = "RESERVAR"
        )
    })
}

// Render reservas de viajes en carrito
const addToCart = () => {
    toggleIconCart();
    $cart.innerHTML = "";
    cart.forEach(el => {
        $cart.innerHTML += `
        <div class="cart-card p-5 bg-blur shadow cart-visual flex flex-column align-items-center">
            <div class="card-in-cart card-image flex flex-column align-items-center">
                <img class="card-image shadow-sm" src="${el.image}" alt="${el.destination}"/>
                <h2 class="cartDestination roboto-font mt-2">${el.destination}</h2>
            </div>
            <div class="cart-btns flex flex-column align-items-center">
                <h3 class="cart-quantity roboto-font">Personas: ${el.quantity}</h3>    
                <p class="roboto-font cart-subtotal"><subtotal>$${el.subTotal()}</subtotal></p>
                <p class="mb-0">Quitar pasajero</p>
                <button class="btn btn-danger btn-custom-color cart-btn cart-btn-dec rounded-0 px-4" data-id="${el.id}">-</button>
                <p class="mb-0">Agregar pasajero</p>
                <button class="btn btn-success btn-custom-color cart-btn cart-btn-inc rounded-0 px-4" data-id="${el.id}">+</button>
                <p class="mb-0">Eliminar paquete</p>
                <i class="btn btn-danger rounded-0 fa-solid fa-trash-can cart-btn px-4" data-id="${el.id}"></i>
            </div>
        </div>
        `;
    })
    inCart();
    cart.length > 0 ? (
        $total.innerHTML = `
        <nav class="flex flex-column justify-content-center">
            <div class="cart-total-visual">
                <h2 class="text-center roboto-font">Total: <total>$${total()}</total></h2>
                <div class="cart-btns-total flex justify-content-center align-items-center mt-5 mb-5">
                    <button class="btn btn-danger btn-custom-color cart-btn rounded-0 empty-cart roboto-font px-5">Vaciar Carrito</button>
                    <button class="btn btn-success btn-custom-color cart-btn rounded-0 checkout-btn roboto-font px-4">Finalizar Compra</button>
                </div>
            </div>
        </nav>`,
        $cart.insertAdjacentElement("beforeend", $total),
        document.querySelector(".empty-cart").addEventListener("click", emptyCart),
        document.querySelector(".checkout-btn").addEventListener("click", checkout)
    ) : (null);
}

// Icono del carrito
const toggleIconCart = () => {
    if (cart.length === 0) {
        $iconCart.style.visibility = "hidden";
        $cart.classList.remove("cart-visible");
    }
    if (cart.length > 0) {
        $iconCart.style.visibility = "visible";
        $iconCart.lastElementChild.textContent = `${cart.length}`;
    }
}

// Ampliar o colapsar carrito
const displayCart = e => {
    if (e.target.matches([".icon-cart", ".icon-cart-quantity"])) {
        if (!$cart.classList.contains("cart-visible")) return $cart.classList.add("cart-visible");
        if ($cart.classList.contains("cart-visible")) return $cart.classList.remove("cart-visible");
    }
}

// Disminuir cantidad
const decrementQuantity = e => {
    if (e.target.matches(".cart-btn-dec")) {
        const cruiseFound = cart.find(el => el.id === Number(e.target.dataset.id));
        cruiseFound.decreaseQuantity();
        if (cruiseFound.quantity === 0) cart = cart.filter(el => el.id != cruiseFound.id);
        addToCart();
        saveToLocalStorage();
    }
}

// Aumentar cantidad
const incrementQuantity = e => {
    if (e.target.matches(".cart-btn-inc")) {
        const cruiseFound = cart.find(el => el.id === Number(e.target.dataset.id));
        cruiseFound.increaseQuantity();
        addToCart();
        saveToLocalStorage();
    }
}

// Borrar paquete desde el carrito
const deleteItem = e => {
    if (e.target.matches(".fa-trash-can")) {
        Swal.fire({
            title: '¿Estás seguro de eliminar el paquete?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'SI',
            confirmButtonColor: '#000',
            cancelButtonColor: '#cc3333',
            cancelButtonText: 'NO',
            iconColor: '#ffcc00'
        }).then((result) => {
            if (result.isConfirmed) {
                const cruiseFound = cart.find(el => el.id === Number(e.target.dataset.id));
                cart = cart.filter(el => el.id != cruiseFound.id);
                addToCart();
                saveToLocalStorage();
                Swal.fire({
                    title: 'Paquete eliminado',
                    icon: 'success',
                    iconColor: '#ffcc00',
                    confirmButtonColor: '#000'
                })
            }
        })
    }
}

// Total del carrito
const total = () => {
    return cart.reduce((accumulator, cruise) => accumulator + cruise.subtotal, 0);
}

// Vaciar carrito
const emptyCart = () => {
    cart = [];
    listCruises.forEach(el => el.quantity = 0);
    addToCart();
    $cart.classList.remove("cart-visible");
    localStorage.removeItem("cart");
}

// Gracias por su compra
const checkout = e => {
    if (e.target.matches(".checkout-btn")) {
        document.body.style.overflow = "hidden";
        document.body.innerHTML = `
            <div class="checkout-container">
                <div class="checkout">
                    <h3 class="checkout-thanks">Gracias por tu reserva. ¡Que disfrutes el viaje!</h3>
                    <button class="btn btn-success btn-custom-color back-to-home">Inicio</button>
                </div>
            </div>
        `;
        document.querySelector(".back-to-home").addEventListener("click", () => {
            location.reload();
            localStorage.removeItem("cart");
        });
    }
}

// Guardar en local storage
const saveToLocalStorage = () => {
    if (cart.length === 0) return localStorage.clear();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar desde local storage
const loadLocalStorage = () => {
    if (localStorage.getItem('cart')) {
        let cartLocalStorage = JSON.parse(localStorage.getItem('cart'));
        cartLocalStorage.forEach(el => {
            const cruise = new Cruise(el.id, el.destination, el.image, el.departure, el.departureDate, el.duration, el.price);
            cruise.quantity = el.quantity;
            cart.push(cruise);
        });
        addToCart();
    }
}

// Filtrar
const filter = e => {
    if (e.target.matches("#input-search")) {
        const inputValue = e.target.value.toLowerCase();
        const cruises = document.querySelectorAll(".card-cruise");
        cruises.forEach(el => {
            const cruiseName = el.querySelector(".card-name");
            if (cruiseName.textContent.toLowerCase().includes(inputValue)) {
                el.classList.remove("hidden");
            } else {
                el.classList.add("hidden");
            }
        });
        if ($main.firstElementChild.classList.contains("no-results")) {
            $main.firstElementChild.remove();
        }
        const hidden = document.querySelectorAll(".hidden");
        const listCruises = document.querySelectorAll(".card-cruise");
        if (hidden.length === listCruises.length) {
            const $noResults = document.createElement("div");
            $noResults.classList.add("no-results");
            $noResults.textContent = "No hay resultados";
            $main.insertAdjacentElement("afterbegin", $noResults);
        }
    }
}

// Cargar más paquetes de cruises
const loadMore = e => {
    if (e.target.matches(".btn-load-more")) {
        getBBD();
    }
}

// Eventos
document.addEventListener("click", e => {
    bookCruise(e);
    decrementQuantity(e);
    incrementQuantity(e);
    deleteItem(e);
    displayCart(e);
    loadMore(e);
});

document.addEventListener("keyup", e => {
    filter(e);
})

getBBD();
loadLocalStorage();