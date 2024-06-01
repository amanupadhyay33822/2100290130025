const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

const BASE_URL = "http://20.244.56.144/test/companies";

// Arrow function to fetch data from the e-commerce company's API
const fetchDataFromCompany = async (company, category, top, minPrice, maxPrice) => {
    const url = `${BASE_URL}/${company}/categories/${category}/products`;
    const params = {
        top: top,
        minPrice: minPrice,
        maxPrice: maxPrice
    };
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        return {
            message: error.message
        };
    }
};

// Endpoint to get products
app.get('/products/companies/:company/categories/:category/products', async (req, res) => {
    const { company, category } = req.params;
    const top = parseInt(req.query.top);
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    const n = top;
    const page = parseInt(req.query.page) || 1;
    const sort_by = req.query.sort_by;
    const order = req.query.order || 'asc';

    // Fetch data from the specified company
    const allProducts = await fetchDataFromCompany(company, category, top, minPrice, maxPrice);

    // Generate unique ID for each product
    const productsWithId = allProducts.map(product => ({ ...product, id: uuidv4() }));

    // Sorting
    if (sort_by) {
        const reverse = (order === 'desc');
        productsWithId.sort((a, b) => {
            if (a[sort_by] < b[sort_by]) return reverse ? 1 : -1;
            if (a[sort_by] > b[sort_by]) return reverse ? -1 : 1;
            return 0;
        });
    }

    // Pagination
    const start = (page - 1) * n;
    const end = start + n;
    const paginatedProducts = productsWithId.slice(start, end);

    res.json(paginatedProducts);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
