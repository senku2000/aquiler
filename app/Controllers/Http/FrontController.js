'use strict'
const Product = use('App/Models/Product')
const Category = use('App/Models/Category')
const Cart = use('App/Models/Cart')
const CartLine = use('App/Models/CartLine')

const DeliveryAddress = use('App/Models/DeliveryAddress')
const Payment = use('App/Models/Payment')
const City = use('App/Models/City')
const District = use('App/Models/District')
const DelivryPrice = use('App/Models/DelivryPrice')
const Database = use('Database')

class FrontController {
  async  index({ view, request }) {
        
        let cart = null

    
        const cart_id = request.cookie('cart_id', 0)
        
        if (cart_id)
            cart = await Cart.find(cart_id)

        

        const products = await Database.table('products')
            .orderBy('created_at', 'desc')
            .where('onStore', true)
            .offset(0)
            .limit(6)

      const categoriesAll = (await Category.all()).toJSON()

      for (let i = 0; i < categoriesAll.length; i++) {

          categoriesAll[i].products = (await Database.table('products').where('category_id', categoriesAll[i].id))
              .filter(product => {
                  return product.onStore
              })
      }
      
      const categories = categoriesAll.filter(category => {
          return category.products.length > 0
      })
        return view.render('welcome', {
            products: products,
            cart: cart,
            categories: categories,
            active: 'home',
            view_caret: true
        })
        
    }

   async articles({ view ,request , params}) {



        /**
        * Au debut l'utilisateur n'a pas de panier
        */
        let cart = null

        /**
        * On verifie si l'utilisateur a un panier
        * enregistrer dans son cookie et
        * si ce dernier est valide et
        * on le recupere si oui
        */
        const cart_id = request.cookie('cart_id')

        if (cart_id)
            cart = await Cart.find(cart_id)



        /**
         * On recupere toutes les categories et on
         * leurs associe leur produits
         */
        const categoriesAll = (await Category.all()).toJSON()

        for (let i = 0; i < categoriesAll.length; i++) {

            categoriesAll[i].products = (await Database.table('products').where('category_id', categoriesAll[i].id))
                .filter(product => {
                    return product.onStore
                })
        }

        /**
         * On filtre les categorie pour recuperer uniquement
         * les categorie ayant des produits
         */
        const categories = categoriesAll.filter(category => {
            return category.products.length > 0
        })

        /**
         * On filtre les produits qui sont onStore pour 
         * recupere uniquement les produits qui sont dans la category demander
         */
        let category_id = params.category_id

        let products = (await Database.table('products').where('onStore', true)).filter(product => {
            if (category_id === "others") {
                return product.category_id == null // produis n'ayant pas de categorie

            } else if (category_id) {
                return (category_id === product.category_id)

            } else {
                return true
            }

        })

        if (products.length <= 0)
            return response.route('store')

        


        return view.render('article', {
            categories: categories,
            products: products,            
            cart: cart,            
            c_category_id: params.category_id,
            active: 'article',
            view_caret: true
        })
   }
    
    
    async addToCaret({ response, request }) {


        /**
         * On cree d'abord un panier
         */
        let cart = new Cart()

        /**
        * On verifie si l'utilisateur a un panier
        * enregistrer dans son cookie et
        * si ce dernier est valide et
        * on le recupere si oui dans le nouveau panier
        */
        const cart_id = request.cookie('cart_id')
        if (cart_id)
            cart = await Cart.find(cart_id)

        /**
         * si on a pas deja de panier a recupperer
         * on lui en cree un avec un identifiant unique         
         */
        if (cart === null || !cart.id) {

            // generateur d'identifiant
            let find = 0, code = "", enableCode = null
            do {
                find++;
                let characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let charactersLength = characters.length;

                for (let i = 0; i < 10; i++) {
                    code += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
                }

                enableCode = await Category.findBy('id', code)
            } while (enableCode && find < 10)

            /**
             * si le code genere est bien unique
             * et n'est pas encore utiliser
             * on l'affecte au panier si non
             * on redirige l'utilisateur pour reprendre le processus
             */
            if (!enableCode) {
                if (!cart) //si un panier n'existe pas encore on le cree
                    cart = new Cart()
                cart.id = code
            } else {
                session.flash({
                    alert: `<span>Une erreur s'est produite lors 
                            de la creation de votre panier ! <br>
                            Vous pouvez à nouveau tanté un achat.</span>`
                })
                return response.route('index')
            }

        }


        const product_id = request.get().id

        if (product_id) {

            const product = await Product.find(product_id)

            if (product) {


                let enableCartLine = await Database.table('cart_lines').where('cart_id', cart.id)
                    .where('product_id', product.id)
                if (enableCartLine.length > 0) {
                    let newQuantity = enableCartLine[0].quantity + 1

                    const affectedRow = await Database.table('cart_lines')
                        .where('cart_id', cart.id)
                        .where('product_id', product.id)
                        .update('quantity', newQuantity)
                } else {

                    let count = await Database.table('cart_lines').where('cart_id', cart.id).count()

                    if (count[0]['count(*)'] === 6) {
                        return response.send('max_items')
                    }

                    const cartLine = new CartLine()
                    cartLine.cart_id = cart.id
                    cartLine.product_id = product.id
                    cartLine.quantity = 1
                    await cartLine.save()
                }

                cart.itemCount = cart.itemCount ? cart.itemCount + 1 : 1
                cart.cartPrice = cart.cartPrice ? cart.cartPrice + product.price : product.price
                response.cookie('cart_id', cart.id)
                await cart.save()
                return response.send({ itemCount: cart.itemCount, prodName: product.name })

            } else {
                return response.send('error')
            }

        } else {
            return response.send('error')
        }

    }

    async view_caret({ view, request, response, session }) {


        /**
        * On verifie si l'utilisateur a un panier
        * enregistrer dans son cookie et
        * si ce dernier est valide et
        * on le recupere si oui
        */
        let enableCart = null

        let cart_id = request.cookie('cart_id', 0)
        if (cart_id)
            enableCart = await Cart.find(cart_id)


        if (enableCart) {
            if (enableCart.cartPrice <= 0) {
                session.flash({
                    alert: `<span class="text-center">Votre panier est vide ! </span>`
                })
                return response.route('index')
            }
            // on recupere les produit du panier
            const cart_lines = await Database.table('cart_lines')
                .where('cart_id', enableCart.id)

            /**
             * on effectue un trie des produits
             */
            for (let i in cart_lines) {
                const current_prod = await Product.find(cart_lines[i].product_id)
                cart_lines[i].name = current_prod.name
                cart_lines[i].price = current_prod.price * cart_lines[i].quantity
                cart_lines[i].img = current_prod.imageUrl
            }

            return view.render('carret', { cart_lines: cart_lines, cart: enableCart })
        } else {

            response.clearCookie('cart_id')
            session.flash({
                alert: `<span class="text-center">Votre panier est vide ou a été perdu !</br>
                                             Recommencer votre achat </span>` })
            response.route('index')
        }

    }


    async addQuantity({ request }) {

        /**
         * On verifie si l'utilisateur a un panier
         * enregistrer dans son cookie et
         * si ce dernier est valide et
         * on le recupere si oui
         */
        let enableCart = null

        let cart_id = request.cookie('cart_id', 0)
        if (cart_id)
            enableCart = await Cart.find(cart_id)


        if (enableCart) {

            let data = request.all()

            let cart_line = await CartLine.find(data.id)

            if (cart_line) {
                cart_line.quantity += 1

                const product_price = (await Product.find(cart_line.product_id)).price
                enableCart.itemCount += 1
                enableCart.cartPrice += product_price
                await cart_line.save()
                await enableCart.save()
            }
        }

    }


    async decreaseQuantity({ request }) {

        /**
         * On verifie si l'utilisateur a un panier
         * enregistrer dans son cookie et
         * si ce dernier est valide et
         * on le recupere si oui
         */
        let enableCart = null

        let cart_id = request.cookie('cart_id', 0)
        if (cart_id)
            enableCart = await Cart.find(cart_id)


        if (enableCart) {

            let data = request.all()

            let cart_line = await CartLine.find(data.id)

            if (cart_line) {
                cart_line.quantity -= 1

                const product_price = (await Product.find(cart_line.product_id)).price
                enableCart.itemCount -= 1
                enableCart.cartPrice -= product_price
                await cart_line.save()
                await enableCart.save()
            }
        }
    }


    async delFromCart({ request }) {

        /**
         * On verifie si l'utilisateur a un panier
         * enregistrer dans son cookie et
         * si ce dernier est valide et
         * on le recupere si oui
         */
        let enableCart = null

        let cart_id = request.cookie('cart_id', 0)
        if (cart_id)
            enableCart = await Cart.find(cart_id)


        if (enableCart) {

            const data = request.all()

            const cart_line = await CartLine.find(data.id)

            if (cart_line) {
                enableCart.itemCount -= cart_line.quantity

                const product_price = (await Product.find(cart_line.product_id)).price
                enableCart.cartPrice -= (cart_line.quantity * product_price)
                await cart_line.delete()
                await enableCart.save()
            }

        }
    }

    async delivry_addressView({ request, view, response, session }) {

        /**
         * On verifie si l'utilisateur a un panier
         * enregistrer dans son cookie et
         * si ce dernier est valide et
         * on le recupere si oui
         */
        let enableCart = null

        let cart_id = request.cookie('cart_id', 0)
        if (cart_id)
            enableCart = await Cart.find(cart_id)

        if (enableCart) {

            if (enableCart.cartPrice <= 0) {
                session.flash({
                    alert: `<span class="text-center">Votre panier est vide ! </span>`
                })
                return response.route('home')
            }

            const cart_lines = await Database.table('cart_lines').where('cart_id', enableCart.id) // on recupere les produit du panier

            //on effectue un trie des produits
            for (let i in cart_lines) {
                const current_prod = await Product.find(cart_lines[i].product_id)
                cart_lines[i].name = current_prod.name
                cart_lines[i].price = current_prod.price * cart_lines[i].quantity
                cart_lines[i].img = current_prod.imageUrl
            }


            let cities = (await City.all()).toJSON()

            for (let i in cities) {
                cities[i].district = await Database.table('districts').where('city_id', cities[i].id)
            }

            cities = cities.filter(el => {
                return el.district.length > 0
            })

            return view.render('addresseLivraison', {
                cart_lines: cart_lines,
                cart: enableCart,
                coordonnee: request.cookie('coordonnee'),
                cities: cities,
            })

        } else {

            response.clearCookie('cart_id')
            session.flash({
                alert: `<span class="text-center">Votre panier est vide ou a été perdu !</br>
                                             Recommencer votre achat </span>` })
            response.route('home')
        }

    }


    async delivry_adressPost({ request, response, session }) {

        let data = request.all()
        
        
        let delivry_price = null


        
        response.cookie('coordonnee', {
            fullname: data.fullname,
            address: data.address,
            code:data.code,
            city:data.city ,
            phone: data.phone,
            email:data.email
            
        })

        response.route('payments')
    }


    async paymentsView({ view, request, response, session }) {

        /**
         * On verifie si l'utilisateur a un panier
         * enregistrer dans son cookie et
         * si ce dernier est valide et
         * on le recupere si oui
         */
        let enableCart = null

        let cart_id = request.cookie('cart_id', 0)
        if (cart_id)
            enableCart = await Cart.find(cart_id)

        if (enableCart) {

            if (enableCart.cartPrice <= 0) {

                session.flash({
                    alert: `<span class="text-center">Votre panier est vide ! </span>`
                })

                return response.route('home')
            }

            if (!request.cookie('coordonnee', 0)) {
                session.flash({
                    alert: `<span class="text-center">Veuillez renseigner vos coordonnée ! </span>`
                })

                return response.route('delivry_addressView')

            }

            const cart_lines = await Database.table('cart_lines').where('cart_id', enableCart.id) // on recupere les produit du panier

            //on effectue un trie des produits
            for (let i in cart_lines) {
                const current_prod = await Product.find(cart_lines[i].product_id)
                cart_lines[i].name = current_prod.name
                cart_lines[i].price = current_prod.price * cart_lines[i].quantity
                cart_lines[i].img = current_prod.imageUrl
            }

            return view.render('payments', {
                cart_lines: cart_lines,
                cart: enableCart,
                coordonnee: request.cookie('coordonnee')
            })


        } else {

            response.clearCookie('cart_id')
            session.flash({
                alert: `<span class="text-center">Votre panier est vide ou a été perdu !</br>
                                             Recommencer votre achat </span>` })
            response.route('home')
        }
    }

}

module.exports = FrontController
