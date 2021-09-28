'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'FrontController.index').as('index')
Route.get('/article/:category_id?', 'FrontController.articles').as('articles')

Route.get('/add-to-caret/', 'FrontController.addToCaret').as('addToCaret')
Route.get('/your-caret', 'FrontController.view_caret').as('viewCaret')

Route.post('/delete-prods-from-cart', 'FrontController.delFromCart').as('delFromCart')
Route.post('/add-product-quantity', 'FrontController.addQuantity').as('addQuantity')
Route.post('/decrease-product-quantity', 'FrontController.decreaseQuantity').as('decreaseQuantity')
Route.get('/addresse-de-livraison', 'FrontController.delivry_addressView').as('delivry_addressView')

Route.post('/addresse-de-livraison', 'FrontController.delivry_adressPost').as('delivry_adressPost')
Route.get('/payments', 'FrontController.paymentsView').as('payments')






Route.get('/admin', ({ response }) => {
    response.redirect('/admin/dashboard')
})

Route.get('/admin/auth/login', 'UserController.loginView').as('login')
Route.post('/admin/auth/login', 'UserController.login').validator('LoginUser')


Route.get('/admin/auth/secret', 'UserController.secretView')
Route.post('/admin/auth/secret', 'UserController.secret')

Route.get('/admin/auth/superuser', 'UserController.superUser')
Route.post('/admin/auth/superuser', 'UserController.createSuperUser').validator('CreateUser')


Route.group(() => {
    Route.get('/dashboard', 'AdminController.dashboard')

    Route.get('/orders', 'OrderController.adminIndex').as('orders')
    Route.get('/order/view/:id', 'OrderController.adminView').as('viewOrder')
    Route.get('/order/delete/:id', 'OrderController.adminDelete').as('deleteOrder')

    Route.get('/categories', 'CategoryController.adminIndex').as('categories')
    Route.post('/categories', 'CategoryController.adminAdd').as('categories').validator('CategoryCreate')
    Route.post('/categories/select', 'CategoryController.adminSelect').as('categoriesSelect')

    Route.get('/category/update/:id', 'CategoryController.adminUpdateView').as('updateCategory')
    Route.post('/category/update/:id', 'CategoryController.adminUpdate').as('updateCategory')
        .validator('CategoryCreate')
    Route.get('/category/delete/:id', 'CategoryController.adminDelete').as('categoryDelete')

    Route.get('/products', ({ response }) => {
        response.route('products', { code: 'all' })
    })
    Route.post('/products/addStore', 'ProductController.adminAddProductsStore').as('productsAddStore')
    Route.get('/products/:code', 'ProductController.adminView').as('products')
    Route.post('/products/:code', 'ProductController.adminSelect').as('products')

    Route.get('/product/add', 'ProductController.adminAddView').as('addProduct')
    Route.post('/product/add', 'ProductController.adminAdd').validator('ProductCreate')
    Route.get('/product/update/:id', 'ProductController.adminUpdateView').as('updateProduct')
    Route.post('/product/update/:id', 'ProductController.adminUpdate').as('updateProduct').validator('ProductCreate')
    Route.get('/product/delete/:id', 'ProductController.adminDelete').as('deleteProduct')
    Route.post('/product/image/update/:id', 'ProductController.adminUploadImage').as('uploadProductImage')
    Route.get('/product/image/remove/:id', 'ProductController.adminRemoveImage').as('removeProductImage')
    Route.get('/product/putStore/:id', 'ProductController.onStore').as('onStore')
    Route.get('/product/removeStore/:id', 'ProductController.offStore').as('offStore')





    Route.get('/zones', 'ZoneController.index').as('zones')

    Route.get('/zones/cities', 'CityController.adminCitiesView').as('cities')
    Route.post('/zones/cities', 'CityController.adminSelect')

    Route.post('/zones/city/add', 'CityController.adminAddCity').as('adminAddCity').validator('CityCreate')
    Route.get('/zones/city/update/:id', 'CityController.adminUpdateCityView').as('adminUpdateCity')
    Route.post('/zones/city/update/:id', 'CityController.adminUpdateCity').as('adminUpdateCity')
        .validator('CityCreate')
    Route.get('/zones/city/delete/:id', 'CityController.adminDeleteCity').as('adminDeleteCity')


    Route.get('/zones/districts', 'DistrictController.adminDistrictsView').as('adminDistricts')
    Route.post('/zones/districts', 'DistrictController.adminAddDistrict').as('adminDistricts')
        .validator('DistrictCreate')
    Route.post('/zones/districts/select', 'DistrictController.adminSelect').as('adminSelectDistricts')

    Route.post('/zones/district/add', 'DistrictController.adminAddDistrict').as('adminAddDistrict')
        .validator('DistrictCreate')
    Route.get('/zones/district/update/:id', 'DistrictController.adminUpdateDistrictView')
        .as('adminUpdateDistrict')
    Route.post('/zones/district/update/:id', 'DistrictController.adminUpdateDistrict')
        .as('adminUpdateDistrict').validator('DistrictCreate')
    Route.get('/zones/district/delete/:id', 'DistrictController.adminDeleteDistrict').as('adminDeleteDistrict')


    Route.get('/zones/delivery-prices', 'DeliveryPriceController.adminDeliveryPricesView')
        .as('adminDeliveryPrices')
    Route.post('/zones/delivery-prices', 'DeliveryPriceController.adminSelect').as('adminDeliveryPrices')

    Route.get('/zones/delivery-price/add', 'DeliveryPriceController.adminAddDeliveryPriceView')
        .as('adminAddDeliveryPrice')
    Route.post('/zones/delivery-price/add', 'DeliveryPriceController.adminAddDeliveryPrice')
        .as('adminAddDeliveryPrice').validator('DeliveryPriceForm')
    Route.post('/zones/delivery-price/update/:id', 'DeliveryPriceController.adminUpdateDeliveryPrice')
        .as('adminUpdateDeliveryPrice').validator('DeliveryPriceForm')
    Route.get('zones/delivery-price/delete/:id', 'DeliveryPriceController.adminDeleteDeliveryPrice')
        .as('adminDeleteDeliveryPrice')


    Route.get('/auth/logout', async ({ auth, response }) => {
        await auth.logout();
        return response.redirect('/admin/auth/login')
    })

}).prefix('/admin').middleware('auth')



