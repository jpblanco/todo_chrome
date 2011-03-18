var Settings = {
	counterName: "todosCounter",
	settingsName: "namespaceSettings"
};

var selectedNamespace = "default";

var DB = function() {
	return {
		save: function(key, value, namespace){
			if(namespace === undefined){
				namespace = "default";
			}

			$.DOMCached.set(key,value, namespace);
		},

		load: function(key, namespace){
			if(namespace === undefined){
				namespace = "default";
			}
			
			return $.DOMCached.get(key, namespace);
		},

		getNamespaces: function() {
			var namespaces = [];
			
			$.each($.DOMCached.storage, function(key, value){
				namespaces.push(key);
			});

			return namespaces;
		},

		getAllKeysFromNamespace: function(namespace) {
			var keys = [];

			$.each($.DOMCached.storage[namespace], function(key, value){
				keys.push(key);
			});

			return keys;
		}
	}
}();

var Counter = function() {
	var currentColorArray = [255, 0, 0, 255];
	var count = 0;

	return {
		clearCounter: function(){
			chrome.browserAction.setBadgeText({text: ''});
		},
		
		setCount: function(new_count) {
			count = new_count;
			
			// Store the counter in the db
			DB.save(Settings.counterName, count);
			
			chrome.browserAction.setBadgeText({ text: '' + count });
			chrome.browserAction.setBadgeBackgroundColor({ color:  currentColorArray})
		},

		increment: function() {
			Counter.setCount((count + 1));
		},

		decrement: function() {
			Counter.setCount((count - 1));
		},

		load: function() {
			var count = DB.load(Settings.counterName);
			if (count == null){
				count = 0;
				DB.save(Settings.counterName, count)
			}

			if (count == 0){
				Counter.clearCounter();
			} else {
				Counter.setCount(parseInt(count));
			}

			Counter.increment();	
		}
	}
}();

var Translation = function(){
	return {
		getMessage: function(key){
			return chrome.i18n.getMessage(key);
		}
	}
}();

var Lists = function() {
	return {
		load: function() {
			var globalListTitle = Translation.getMessage("globalList");
			var namespaces = DB.getNamespaces();
			
			$.each(namespaces, function(index, namespace){
				if (namespace == "default"){
					Lists.create(globalListTitle);
				} else {
					Lists.create(namespace);
				}
			});
		},

		create: function(list_name, settings) {
			var list = $("<a href='#' class='list'></a>'").html(list_name);

			$('#lists').append(list);
		}
	}
}();

var ToDo = function(){
	return {
		create: function(title){
			var json_todo = {creation_at: new Date()};
			json_todo["title"] = title;

			var interval_regexp = /@\s*every\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)@/i

			var match = interval_regexp.exec(title);
			
			if (match != null){
				title = title.replace(interval_regexp, "");

				json_todo["title"] = title;
				json_todo["every_number"] = parseInt(match[0]);
				json_todo["every_interval"] = match[1];  
			}

			DB.save(title, json_todo, selectedNamespace);
			ToDo.loadAll();
		},
		
		loadAll: function() {
			var keys = DB.getAllKeysFromNamespace(selectedNamespace);

			var todos = $("#todos")
			todos.html("");
	
			$.each(keys, function(index, key){

				if (key != "todosCounter" && key != "settings"){
					var todo = DB.load(key, selectedNamespace); 
					
					var li = $("<li></li>").text(todo.title);
					
					todos.prepend(li);
				}
			});
		}
	}
}();

$(function(){
	Counter.load();
console.log(DB.getAllKeysFromNamespace("default"));
	//$('#test').markItUp(richTextDefaultSettings);	
});
