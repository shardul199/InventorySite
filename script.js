document.addEventListener('DOMContentLoaded', () => {
    const productListElement = document.getElementById('productList');
    const categoryListElement = document.getElementById('categoryList');
    const addProductForm = document.getElementById('addProductForm');
    const productCategorySelect = document.getElementById('productCategory');
    const resetButton = document.getElementById('resetButton');
    const searchInput = document.getElementById('searchInput');

    // Function to display products
    function displayProducts(productsToDisplay) {
        productListElement.innerHTML = ''; // Clear existing list
        productsToDisplay.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.classList.add('productCard');
            productCard.innerHTML = `
                <h2>${product.name}</h2>
                <p>Description: ${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
                <p>Category: ${getCategoryName(product.categoryId)}</p>
                <button class="updateButton" data-index="${index}">Update</button>
                <button class="deleteButton" data-index="${index}">Delete</button>
            `;
            productListElement.appendChild(productCard);
        });
    }

    // Function to display categories
    function displayCategories() {
        categoryListElement.innerHTML = ''; // Clear existing list
        categories.forEach((category) => {
            const categoryButton = document.createElement('button');
            categoryButton.classList.add('categoryButton');
            categoryButton.innerText = category.name;
            categoryButton.dataset.categoryId = category.id; // Store category ID as a data attribute
            categoryListElement.appendChild(categoryButton);
        });

        // Populate categories in the add product form dropdown
        productCategorySelect.innerHTML = '';
        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.innerText = category.name;
            productCategorySelect.appendChild(option);
        });
    }

    // Function to get category name based on category ID
    function getCategoryName(categoryId) {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : 'N/A';
    }

    // Function to filter products based on selected category ID
    function filterProductsByCategory(categoryId) {
        const filteredProducts = products.filter((product) => product.categoryId === categoryId);
        displayProducts(filteredProducts);
    }

    // Function to add a new product
    function addProduct(event) {
        event.preventDefault();
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = parseFloat(document.getElementById('productPrice').value);
        const productQuantity = parseInt(document.getElementById('productQuantity').value, 10);
        const productCategory = parseInt(productCategorySelect.value, 10);

        const newProduct = {
            name: productName,
            description: productDescription,
            price: productPrice,
            quantity: productQuantity,
            categoryId: productCategory,
        };

        products.push(newProduct);
        displayProducts(products);
        addProductForm.reset();
    }

    // Function to delete a product
    function deleteProduct(index) {
        products.splice(index, 1);
        displayProducts(products);
    }

   // Keep track of the index of the product being updated
let updatingIndex = -1;

// Event listener for update buttons
productListElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('updateButton')) {
        const index = parseInt(event.target.dataset.index, 10);
        updateProduct(index);
    }
});

// Function to update a product
function updateProduct(index) {
    const product = products[index];
    
    updatingIndex = index; // Set the updating index
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productQuantity').value = product.quantity;
    productCategorySelect.value = product.categoryId;

    // Update the form submit event listener to handle update instead of add
    addProductForm.removeEventListener('submit', addProduct);
    addProductForm.addEventListener('submit', saveUpdatedProduct);
}

// Function to save the updated product
function saveUpdatedProduct(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productQuantity = parseInt(document.getElementById('productQuantity').value, 10);
    const productCategory = parseInt(productCategorySelect.value, 10);

    // Update the product at the updating index
    products[updatingIndex].name = productName;
    products[updatingIndex].description = productDescription;
    products[updatingIndex].price = productPrice;
    products[updatingIndex].quantity = productQuantity;
    products[updatingIndex].categoryId = productCategory;

    // Clear updating index and reset the form
    updatingIndex = -1;
    addProductForm.reset();
    addProductForm.removeEventListener('submit', saveUpdatedProduct);
    addProductForm.addEventListener('submit', addProduct);

    // Redisplay the products
    displayProducts(products);
}


    // Function to reset products and search input
    function resetProducts() {
        displayProducts(products);
        searchInput.value = ''; // Clear search input
    }

    // Initial setup - display products and categories
    displayProducts(products);
    displayCategories();

    // Event listener for category buttons
    categoryListElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('categoryButton')) {
            const categoryId = parseInt(event.target.dataset.categoryId, 10);
            filterProductsByCategory(categoryId);
        }
    });

    // Event listener for adding a new product
    addProductForm.addEventListener('submit', addProduct);

    // Event listener for reset button
    resetButton.addEventListener('click', resetProducts);

    // Event listener for delete and update buttons
    productListElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteButton')) {
            const index = parseInt(event.target.dataset.index, 10);
            deleteProduct(index);
        } else if (event.target.classList.contains('updateButton')) {
            const index = parseInt(event.target.dataset.index, 10);
            updateProduct(index);
        }
    });

    // Event listener for search input
    searchInput.addEventListener('input', (event) => {
        const searchQuery = event.target.value.trim();
        if (searchQuery !== '') {
            searchProducts(searchQuery);
        } else {
            displayProducts(products);
        }
    });

    // Function to search products based on search query
    function searchProducts(query) {
        const filteredProducts = products.filter(
            (product) =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase()) ||
                getCategoryName(product.categoryId).toLowerCase().includes(query.toLowerCase())
        );
        displayProducts(filteredProducts);
    }
});
