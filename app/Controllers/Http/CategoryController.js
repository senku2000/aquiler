'use strict'

const Category = use('App/Models/Category')

class CategoryController {
    async adminIndex({ request, view }){
        const referer = request.header('referer')

        let orderBy = request.input('orderBy')
        let onDesc = request.input('onDesc')
        let page = request.input('page')
        let perPage = request.input('perPage')

        onDesc = onDesc? onDesc: 1
        perPage = perPage? perPage: 20

        if(!orderBy){
            orderBy = "updated_at"
            onDesc = -1
        }

        const categories = (await Category.all()).toJSON()

        const pages = Array(Math.ceil(categories.length / perPage)).fill(0).map((x, i) => i + 1);
        page = page? page>pages.length? pages.length : page : 1

        categories.sort((category1, category2) => {
            let x, y
            if(orderBy==="name"){
                x = category1[orderBy].toLowerCase();
                y = category2[orderBy].toLowerCase();
                onDesc = 1

            }else{
                x = category1[orderBy]
                y = category2[orderBy]
            }
            
            if(x < y) { return (-1*onDesc) }
            if(x > y) { return (1*onDesc) }
        })

        const categoriesToView = []
        const start = (page-1)*perPage
        const end = start+perPage

        for (let i = start; i < end; i++) {
            const category = categories[i]
            if(category){
                categoriesToView.push(category)
            }
        }

        return view.render('/admin/categories', {
            categories: categoriesToView,
            page: page, pages: pages, perPage: perPage, orderBy: orderBy, onDesc: onDesc,
            sideMenu: 'categories'
        })
    }


    async adminAdd({ request, session, response }){
        const name = request.input('name')
        const category = await Category.findBy('name', name)

        if(category){
            session.flash({ errorNotif: 'Category '+category.name+' is already exist !'})

        }else{
            const newCategory = new Category()

            let find = 0, code = "", enableCode = null
            do{
                find++;
                let characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let charactersLength = characters.length;

                for (let i=0; i < 6; i++) {
                    code += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
                }

                enableCode = await Category.findBy('id', code)
            }while(enableCode && find < 10)

            if(!enableCode){
                newCategory.id = code
                newCategory.name = name
                await newCategory.save()
                session.flash({ successNotif: 'Category '+newCategory.name+' added !'})

            }else{
                session.flash({ errorNotif: 'An error has occured!!! Please try again.'})
            }
        }

        return response.redirect('/admin/categories')
        
    }


    async adminUpdateView({ params, request, session, response, view }) {
        const referer = request.header('referer')

        let prod = request.input('products')
        let orderBy = request.input('orderBy')
        let onDesc = request.input('onDesc')
        let page = request.input('page')
        let perPage = request.input('perPage')

        prod = prod? prod: 'all'
        onDesc = onDesc? onDesc: 1
        perPage = perPage? perPage: 20

        if(!orderBy){
            orderBy = "updated_at"
            onDesc = -1
        }

        const category = await Category.find(params.id)
        const productsGet = (await category.products().fetch()).toJSON()
        const products = productsGet.filter( product => {
            if(prod==='onStore'){
                return product.onStore
            }else if(prod==='offStore'){
                return !product.onStore
            }else{
                return true
            }
        })

        if(products.length === 0 && (prod==='onStore' || prod==='offStore')){
            const notif = prod==='onStore'? 'No products on store' : 'All products on store'
            session.flash({ errorNotif: notif})
            response.redirect(referer)
        }
        
        const pages = Array(Math.ceil(products.length / perPage)).fill(0).map((x, i) => i + 1);

        page = page? page>pages.length? pages.length : page : 1

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if(product.category_id){
                product.category = category
            }
        }

        products.sort((product1, product2) => {
            let x, y
            if(orderBy==="name"){
                x = product1[orderBy].toLowerCase();
                y = product2[orderBy].toLowerCase();
                onDesc = 1
            }else{
                x = product1[orderBy]
                y = product2[orderBy]
            }
            
            if(x < y) { return (-1*onDesc) }
            if(x > y) { return (1*onDesc) }
        })

        const productsToView = []
        const start = (page-1)*perPage
        const end = start+perPage

        for (let i = start; i < end; i++) {
            const product = products[i]
            if(product){
                productsToView.push(product)
            }
        }

        return view.render('/admin/category/update', {
            category: category,
            products: productsToView,
            page: page, pages: pages, perPage: perPage, orderBy: orderBy, onDesc: onDesc, prod:prod,
            sideMenu: 'categories'
        })
    }


    async adminUpdate({ params, request, session, response }){
        const name = await request.input('name')
        const category = await Category.find(params.id)

        if(category.name === name) {
            session.flash({ successNotif: 'Category '+category.name+' is updated !'})

        }else{
            const categoryExist = await Category.findBy('name', name)

            if(categoryExist){
                session.flash({ errorNotif: 'Category '+categoryExist.name+' is already exist !'})
                
            }else{
                category.name = name
                await category.save()
                session.flash({ successNotif: 'Category '+category.name+' is updated !'})
            }
        }

        return response.redirect('/admin/category/update/'+category.id)

    }


    async adminDelete({ params, request, session, response}){
        const referer = request.header('referer')
        
        const category = await Category.find(params.id)

        if(category){
            await category.delete()
            session.flash({ successNotif: 'Category '+category.name+' is deleted !'})

            return response.redirect(referer)
        }else{
            session.flash({ errorNotif: 'An error has occured!!!'})

            return response.redirect(referer)
        }
    }


    async adminSelect({ request, session, response}){
        const referer = request.header('referer')
        const inputs = request.post()
        const action = request.input('action')

        let done = 0
        let select = 0
        let notif = ""

        for (const key in inputs) {
            if(request.input(key)==="on"){
                const category = await Category.find(key)

                if(category){
                    if(action==="deleteCategories"){
                        await category.delete()
                        done++
                    }
                    select++
                }
            }
        }

        if(action==="deleteCategories"){
            notif = done+" categories of "+select+" are deleted !"
        }

        session.flash({ successNotif: notif })
        return response.redirect(referer)

    }
}

module.exports = CategoryController
