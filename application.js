var Settings = {
	counterName: "todosCounter",
	settingsName: "namespaceSettings"
};

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
			DB.save(Settings.counterName, count)			
			
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
		loadDefaultMessages: function(){
			var title = Translation.getMessage("appTitle");
			
			$('#app_title').html(title);
		},

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
					Lists.create(globalListTitle, {backgroundColor: "#EF0010"});
				} else {
					Lists.create(namespace);
				}
			});
		},

		create: function(list_name, settings) {
			var list = $("<div class='list'></div>'").html(list_name);
			list.css(settings);			

			$('#lists').append(list);
		}
	}
}();

$(function(){
	Translation.loadDefaultMessages();

	Counter.load();

	Lists.load();
	//$('#test').markItUp(richTextDefaultSettings);	
});
