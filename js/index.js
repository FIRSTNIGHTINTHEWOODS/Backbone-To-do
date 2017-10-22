// все события backbone помещаются в events



	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};

function  setTemplateId(id){
	return _.template($('#' + id).html());
}

App.Models.Task = Backbone.Model.extend({
    defaults: {
        title: '',
        priority: 0
    }
});


App.Views.Task = Backbone.View.extend({
	tagName: 'li',
	template: setTemplateId('tasks-template'),
	initialize: function() {
		_.bindAll(this, 'render', 'remove'); // or put third argument in 'on'
		this.model.on('destroy',this.remove);
		this.model.on('change',this.render);

	},
	render: function(){ 
		var templ = this.template(this.model.toJSON());
		this.$el.html(templ);
		return this;
	},
	events: {
		'click #edit': 'editTask',
		'click #delete': 'destroyTask',
		'click #increment': 'increment',
		'click #decrement': 'decrement',
	},
	remove: function(){
		this.$el.remove();
	},
	editTask: function(){
		var taskValue = prompt('New Title', this.model.get('title'));

		this.model.set('title', taskValue);
	},
	increment: function(){
		var priority = this.model.get('priority');
		priority++;
		this.model.set('priority', priority);
	},
	decrement: function(){
		var priority = this.model.get('priority');
		priority--;
		this.model.set('priority', priority);
	},
	destroyTask: function(){
		this.model.destroy();
	}
}); 
 

App.Collections.Tasks = Backbone.Collection.extend({
	model : App.Models.Task 
});

App.Views.Tasks = Backbone.View.extend({
	tagName: 'ul',
	render: function() {
		this.collection.each(this.changeTask, this);
		return this;
	},
	changeTask: function(task) {
		var taskView = new App.Views.Task({ model:task });
		this.$el.append(taskView.render().el);
	},
	initialize: function(){
		_.bindAll(this, 'changeTask'); // or put third argument in 'on'
		this.collection.on('add',this.changeTask);
	}
});
App.Views.AddTask = Backbone.View.extend({
	el: '#addTask',
	events: {
		'submit': 'submitted'
	},
	submitted: function(e){
		e.preventDefault();
		var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
		var newTask = new App.Models.Task({ title: newTaskTitle });	
		console.log(newTask);
		this.collection.add(newTask);
	},
	initialize: function(){

	}
});

var tasksCollection = new App.Collections.Tasks([
	{
		title: 'Learn Backbone',
		priority: 5
	},
		{
		title: 'Learn Git',
		priority: 4
	},
		{
		title: 'Learn Redux',
		priority: 3
	}
]);
	var tasksView = new App.Views.Tasks({ collection: tasksCollection}); 
	var addTaskView = new App.Views.AddTask({ collection: tasksCollection}); ;
	$('.Tasks').append(tasksView.render().$el);

// console.log(taskView.render().el);








// var Products = Backbone.Model.extend({
//     defaults: {
//         name: 'iPad mini',
//         asin: 'dA32Qa',
//         bsr_category: 'none',
//         id: 1
//     },
//     validate: function( attrs ) {
//         if (attrs.id < 0) {
//         	return 'invalid data';
//         }
//     }
// });

// var ProductsView = Backbone.View.extend({
//     initialize: function() {
//     	this.render();
//     },
//     template: setTemplateId('products-template'),
//     tagName: 'li',
//     className: 'Products',
//     id: 'products',
//     render:  function() {
// 		this.$el.html(this.template( this.model.toJSON() ));
//         return this;
// 	}
// });

// var product = new Products({ name: 'mac', asin: 'qa11', id:1 });
// var product2 = new Products({ name: 'iphone', asin: 'aq32', id:2 });


// var productsView = new ProductsView({
//     model: product2
// });

// // $('body').append(productsView.el);

// var ProductsViewList = Backbone.View.extend({    //view for collection
//     tagName: 'ul',
//     initialize: function(){
//     this.render();
//     },
//     render: function(){
//         this.collection.each(function(product) {
//             var productsView = new ProductsView({ model: product });
//             this.$el.append(productsView.$el);
//         },this);
//     }
// }); 

// var ListProducts = Backbone.Collection.extend({   // collection class
//     model: Products 
// });
// var listProducts = new ListProducts([product, product2 ]); // init collection 

// var productsViewList = new ProductsViewList({collection: listProducts});
// // view list products


// $('body').append(productsViewList.$el);