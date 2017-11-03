var message = document.getElementById("message");
function addlog(msg){
	message.innerText += "\n" + msg;
}
var queue = [];
var queue_next = true;
function next(url){
	chrome.tabs.create({url: url, active: false}, function(tab){
		chrome.tabs.executeScript(tab.id, { file: "readEmail.js", runAt: "document_end"}, function(arr){});
	});
}
chrome.runtime.onMessage.addListener(function(request, sender) {
	if(request.action == "streamer"){
		addlog(request.source);
		if(queue_next){
			queue_next = false;
			next(request.source);
		} else {
			queue.push(request.source);
		}
	}
	if(request.action == "email"){
		var nmspl = sender.tab.url.split("/");
		var towrite = nmspl[nmspl.length - 1] + "," + request.source + ";";
		addlog(towrite);
	}
	if(request.action == "log"){
		addlog(request.source);
	}
	if(request.action == "close"){
		chrome.tabs.remove(sender.tab.id);
		if(queue.length < 1)return;
		var nxt = queue.splice(queue.length - 1, 1);
		next(nxt[0]);
	}
});
chrome.tabs.query({active: true},
function(tab){
    if(tab[0].url.includes("go.twitch.tv")){
		addlog("Found twitch side.");
		if(tab[0].url.includes("/communities/")){
			var com = tab[0].url.split("/communities/")[1].split("/")[0];
			addlog("Found a communitie(\"" + com + "\")");
			addlog("Requesting side infos");
			chrome.tabs.executeScript(tab[0].id, { code: "Array.prototype.forEach.call(document.getElementsByClassName('live-channel-card__videos'), function(el) { chrome.runtime.sendMessage({action: 'streamer', source: el.href.replace('/videos', '')} )});" })
		} else {
			addlog("Currently not supported");
		}
	} else {
		addlog("Your not on twitch");
	}
});