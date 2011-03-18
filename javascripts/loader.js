$(function(){
	Lists.load();
	ToDo.loadAll();

	$("#add_todo").click(function(event){
		var todo_title = $("#todo_title");

		if (todo_title.val() != ""){
			ToDo.create(todo_title.val());		
		}

		event.stopPropagation();
		event.preventDefault();
	});
});
