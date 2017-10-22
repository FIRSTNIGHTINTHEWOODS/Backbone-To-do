// все события backbone помещаются в events
function setTemplateId(id)  {
	return _.template($('#' + id).html());
}

$(function (){

window.App = {
	Models: {},
	Views: {},
	Collections: {}
};




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

});
/////////////// Marionette example app

var ModelView = Mn.View.extend({
	tagName: 'li',
	template: setTemplateId('mn-template')
});

var ModelCollectionView = Mn.CompositeView.extend({
	el: '#base-element',
	template: setTemplateId('mn-template-form'),
	childView: ModelView,
	childViewContainer: 'ul',
	ui: {
		task: '#task_id',
		priority: '#priority_id',
		button: '#add_task'
	},
	triggers: {
		'click button': 'add:task'  //  onAddTask = add:task
	},
	collectionEvents: {
		add: 'taskCreated'
	},
	onAddTask: function(){
		this.collection.add({
			task: this.ui.task.val(),
			priority: this.ui.priority.val()
		});
	},
	taskCreated: function(){
		this.ui.task.val("");
		this.ui.priority.val("");
	}
});

var todo = new ModelCollectionView({
	collection: new Backbone.Collection(
		[
			{ task: 'cook', priority: '1'},
			{ task: 'sleep', priority: '2'},
			{ task: 'work', priority: '3'}
		]
	)
});

todo.render();	