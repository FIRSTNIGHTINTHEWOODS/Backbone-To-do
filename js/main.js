// function httpGet(url) {

//   return new Promise(function(resolve, reject) {

//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);

//     xhr.onload = function() {
//       if (this.status == 200) {
//         resolve(this.response);
//       } else {
//         var error = new Error(this.statusText);
//         error.code = this.status;
//         reject(error);
//       }
//     };

//     xhr.onerror = function() {
//       reject(new Error("Network Error"));
//     };

//     xhr.send();
//   });

// }


// httpGet('https://api.github.com/users/firstnightinthewoods')
//   // 1. Получить данные о пользователе в JSON и передать дальше
//   .then(response => {
//     console.log(response);
//     return response;
//   })
//   // 3. Вывести аватар на 3 секунды (можно с анимацией)
//   .then(githubUser => {
//     console.log(githubUser);
//     githubUser = JSON.parse(githubUser);
//     console.log(githubUser);
//     let img = new Image();
//     img.src = githubUser.avatar_url;
//     img.className = "promise-avatar-example";
//     document.body.appendChild(img);

//     setTimeout(() => img.remove(), 3000); // (*)
//   });

// var Items = Backbone.Model.extend({
// 	urlRoot: 'http://demo.omnigon.com/pgatdemo1/mikeg/products.json'
// });
var Products = Backbone.Model.extend({
    urlRoot: 'http://demo.omnigon.com/pgatdemo1/mikeg/products.json',
    defaults: {
        name: '',
        img: '',
        asin: '',   
        bsr_category: '',
        link: ''
    }
});

var items = new Products({});

items.fetch({
    
    async: false,
	success: function(items){
	}
});

// Model для item


// collection для items

var ListProducts = Backbone.Collection.extend({   // class of items

    model: Products 
});


    // view для каждого item 
var ProductsView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    template: _.template( $('#products-template').html() ),
    tagName: 'p',
    render:  function() {
        this.$el.html(this.template( this.model.toJSON() ));
        return this;
    }
});

//class view для всех items
var ProductsViewList = Backbone.View.extend({    //view for collection
    tagName: 'div',
    className: 'Products',
    initialize: function(){
    this.render();
    },
    render: function(){
        this.collection.each(function(product) {
            var productsView = new ProductsView({ model: product });
            this.$el.append(productsView.$el);
        },this);
    }
}); 


var listProducts = new ListProducts(items.get('products')); // init collection

var productsView = new ProductsViewList({collection: listProducts}); // init view for collection

$('body').append(productsView.$el); 



