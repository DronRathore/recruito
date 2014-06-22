var userStats = {};
var getRepos = function(username, callback){
	userStats[username]["repos"] = {};
	$.getJSON("https://api.github.com/users/"+username+"/repos", function(data){
		var list = [];
		$.each(data, function(key, repo){
			userStats[username]["repos"][repo.name] = {
				"name"  :  repo.name,
				"url"   : repo.html_url,
				"language" : repo.language,
				"description" : repo.description,
				"is_fork"  : repo.fork 
			};
		});
		return callback(userStats);
	});
};
var getUserData = function(username, callback){
	
	$.getJSON("https://api.github.com/users/"+username, function(data){
		if (data)
			return callback({
				"name"    	: data.name,
				"blog"    	: data.blog,
				"avatar"  	: data.avatar_url,
				"joined"  	: new Date(data.created_at).toString().replace(/(?:((\d.\:).*))/, "").trim(),
				"updated" 	: new Date(data.updated_at).toString().replace(/(?:((\d.\:).*))/, "").trim(),
				"repos"   	: data.public_repos,
				"followers" : data.followers
			});
	});
}
var getUserList = function(callback){
	$.getJSON("http://dev.mozillaindia.org/event_name/data.json", function(data){
		callback(data);
	});
};
var buildStats = function(users){
	$.each(users, function(key, value){
		userStats[value] =  {};
		getUserData(value, function(data){
			$.extend(userStats[value], data);
			getRepos(value, function(data){
				userStats[value]["trends"] = {};
				$.each(userStats[value]["repos"], function(key, repo){
					if (userStats[value]["trends"][repo.language] && repo.language)
						userStats[value]["trends"][repo.language]++;
					else
						if (repo.language != null)
							userStats[value]["trends"][repo.language] = 1;
						else
							if (userStats[value]["trends"]["Others"])
								userStats[value]["trends"]["Others"]++;
							else
								userStats[value]["trends"]["Others"] = 1;
				});
				console.log(userStats);
			});
		});
	})
}
window.onload = function(){
		buildStats([["dronrathore"], ["octocat"]]);
}