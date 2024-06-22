import pizza_info from "./PizzaList1.js";

document.addEventListener("DOMContentLoaded", function() {

    // must have
    //  name
    //  size
    //  weight
    //  price
    //  quantity
    //  image
    
    let itemsInCart = [];

    const order_list = document.querySelector('.order-list');
    const menu_list = document.querySelector('.pizza-menu');

    const cart_item_template = document.querySelector('#cart-item-template')
                                       .content.cloneNode(true);

    const menu_item_template = this.documentElement.querySelector('#menu-item-template')
                                       .content.cloneNode(true);
    
    const pizza_size_option_template = this.documentElement.querySelector('#pizza-size-option-template')                                       
                                       .content.cloneNode(true);                                       

    function updateCart() {

        order_list.innerHTML = '';


        let totalPrice = 0;
        let totalPizzas = 0;

        const totalCartCost = document.querySelector('#cart-price-sum');
        const totalCartPizzas = document.querySelector('.amount-in-order');

        totalCartCost.innerHTML = totalPrice;
        totalCartPizzas.innerHTML = totalPizzas;

        itemsInCart.forEach(item => {

            totalPrice += item.price * item.quantity;
            totalPizzas += item.quantity;

            const newItem = cart_item_template.cloneNode(true);
            
            const totalCostSpan = newItem.querySelector('#total-pizza-type-cost');
            const itemAmountSpan = newItem.querySelector('.menu-amount');
            
            newItem.querySelector('.item-name').innerHTML = item.name;
            newItem.querySelector('#size').innerHTML = item.size;
            newItem.querySelector('#weight').innerHTML = item.weight;
            totalCostSpan.innerHTML = item.quantity * item.price;
            itemAmountSpan.innerHTML = item.quantity;
            newItem.querySelector('.order-img').src = item.image;

            const buyButton = newItem.querySelector('.buy');
            const decButton = newItem.querySelector('.dec');
            const deleteButton = newItem.querySelector('.summary-item-delete-button');


            buyButton.addEventListener('click', function() {

                item.quantity++;
                
                itemAmountSpan.innerHTML = item.quantity;
                totalCostSpan.innerHTML = item.quantity * item.price;

                totalPrice += item.price;
                totalPizzas++;

                updateCartData();
            });

            decButton.addEventListener('click', function() {

                item.quantity--;

                if (item.quantity > 0) {

                    itemAmountSpan.innerHTML = item.quantity;
                    totalCostSpan.innerHTML = item.quantity * item.price;

                    totalPrice -= item.price;
                    totalPizzas--;

                } else {

                    totalPrice -= item.price;
                    totalPizzas--;

                    deleteItem(item, this);
                }  
                
                

                updateCartData();
            });

            deleteButton.addEventListener('click', function() {

                totalPrice -= item.quantity * item.price;
                totalPizzas -= item.quantity;

                deleteItem(item, this);

                updateCartData();
            });

            order_list.appendChild(newItem);
            updateCartData();


            function updateCartData() {

                totalCartCost.innerHTML = totalPrice;
                totalCartPizzas.innerHTML = totalPizzas;
                
                localStorage.setItem("order", JSON.stringify(itemsInCart));
            }
    
            function deleteItem(item, button) {
    
                const index = itemsInCart.find((itemInCart) => itemInCart == item);
                    itemsInCart.splice(index ,1);
    
                const itemElement = button.closest(".order-item");
                    itemElement.remove();   
    
                updateCartData();
    
            }

        });

        

    }

    //the reason why we are parsing menuList 
    //is because we have filtration by types
    //therefore we can parse only used items 
    function updateMenu(items) {

        menu_list.innerHTML = '';

        document.querySelector('.pizza-count').innerHTML = items.length;

        items.forEach(item => {

            const menu_item = menu_item_template.cloneNode(true);
            setup_Menu_item_names();
            populatePizzaSides();

            menu_list.appendChild(menu_item);
        

            function setup_Menu_item_names() {

                menu_item.querySelector('.pizza-icon').src = item.icon;
                menu_item.querySelector('.pizza-title').innerHTML = item.title;
                menu_item.querySelector('.pizza-type').innerHTML = item.type;

                const itemContent = Object.values(item.content).join(" ");
                menu_item.querySelector('.pizza-content p').innerHTML = itemContent;


            }

            function populatePizzaSides() {

                const pizzaSizes = [];
                if ('small_size' in item) {
                    pizzaSizes.push(item.small_size);
                } 
                if ('big_size' in item) {
                    pizzaSizes.push(item.big_size);
                }

                pizzaSizes.forEach((pizzaSize) => {
                    
                    const pizza_size_option = pizza_size_option_template.cloneNode(true);

                    pizza_size_option.querySelector('.pizza-size-diameter').innerHTML = pizzaSize.size;
                    pizza_size_option.querySelector('.pizza-size-weight').innerHTML = pizzaSize.weight;
                    pizza_size_option.querySelector('.pizza-size-price').innerHTML = pizzaSize.price;


                    const button = pizza_size_option.querySelector('.pizza-size-button');
                    button.addEventListener('click', function() {

                         addItemToCart(pizzaSize);

                    });

                    menu_item.querySelector('.pizza-sizes').appendChild(pizza_size_option);


                        function addItemToCart(pizzaSize) {

                            const existingPizza = itemsInCart.find(pizza => (
                                pizza.name === item.title &&
                                pizza.size === pizzaSize.size &&
                                pizza.weight === pizzaSize.weight
                            ));


                            if (existingPizza){

                                existingPizza.quantity++;

                            } else

                                itemsInCart.push({

                                    name: item.title,
                                    size: pizzaSize.size,
                                    price: pizzaSize.price,
                                    quantity: 1,
                                    weight: pizzaSize.weight,
                                    image: item.icon

                                });

                            updateCart();

                        }

                });

            }    
        });    
    }

    function addFilterListers() {

        const categories = document.querySelectorAll('.category, category active');


        categories.forEach(category => {

            category.addEventListener('click', function() {

                categories.forEach(function(category) {
                    category.className = "category";
                });

                let pizzas = [];

                switch (category.innerHTML) {

                    case 'Усі':
                        category.className = "category active";
                        pizzas = pizza_info;
                        break;
                    case 'М\'ясні':
                        category.className = "category active";
                        pizza_info.forEach(function (pizza) {
                            if (pizza.type === 'М’ясна') {
                                pizzas.push(pizza);
                            }
                        })
                        break;
                    case 'З ананасами':
                        category.className = "category active";
                        pizza_info.forEach(function (pizza) {
                            if (pizza.type === 'З ананасами') {
                                pizzas.push(pizza);
                            }
                        })
                        break;
                    case 'З грибами':
                        category.className = "category active";
                        pizza_info.forEach(function (pizza) {
                            if (pizza.type === 'З грибами') {
                                pizzas.push(pizza);
                            }
                        })
                        break;
                    case 'З морепродуктами':
                        category.className = "category active";
                        pizza_info.forEach(function (pizza) {
                            if (pizza.type === 'З морепродуктами') {
                                pizzas.push(pizza);
                            }
                        })
                        break;
                    case 'Вега':
                        category.className = "category active";
                        pizza_info.forEach(function (pizza) {
                            if (pizza.type === 'Вега') {
                                pizzas.push(pizza);
                            }
                        })
                                      

                }

                document.querySelector('.pizza-count').innerHTML = pizzas.length;

                updateMenu(pizzas);

            });

        });

    }

    
    document.querySelector('.clear-order').addEventListener( 'click', function() {

        itemsInCart = [];
        updateCart();

    });
    if(JSON.parse(localStorage.getItem("order")) != null) {
        itemsInCart = JSON.parse(localStorage.getItem("order"));
    }
    updateCart();
    addFilterListers();
    updateMenu(pizza_info);



    const tableButton = document.querySelector('.table-button');
    const tableOverlay = document.getElementById('tableOverlay');
    const closeTableButton = document.getElementById('closeTableButton');

    tableButton.addEventListener('click', function() {
        tableOverlay.style.display = 'flex';
        createPizzaReport();
    });

    closeTableButton.addEventListener('click', function() {
        tableOverlay.style.display = 'none';
    });

    function createPizzaReport() {
        const reportData = itemsInCart.map(item => ({
            name: item.name,
            size: item.size,
            weight: item.weight,
            price: item.price,
            quantity: item.quantity,
            sum: item.price * item.quantity
        }));

        new WebDataRocks({
            container: "#pizzaPivotTable",
            toolbar: true,
            report: {
                dataSource: {
                    data: reportData
                },
                slice: {
                    rows: [
                        { uniqueName: "name" }
                    ],
                    columns: [
                        { uniqueName: "weight" },
                        { uniqueName: "size" },
                        { uniqueName: "price" },
                        { uniqueName: "quantity" },
                        { uniqueName: "sum" }
                    ],
                },
                options: {
                    grid: {
                        type: "flat",
                        grandTotalsPosition: "bottom"
                    }
                }
            }
        });
    }
});