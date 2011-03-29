$(function(){
	Lists.load();
	ToDo.loadAll();

	$("#add_todo").click(function(event){
		var todo_title = $("#todo_title");

		if (todo_title.val() != ""){
			ToDo.create(todo_title.val());		
		}
        
        $("#todo_title").val("");

		return false;
	});
    
    $("#todos li").click(function(event){
        $(this).addClass("completed");
        
    });
});
