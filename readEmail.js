function slog(info){
chrome.runtime.sendMessage({
    action: "log",
    source: info
});
}
var tout;
function onWindow(bol){
var docinner = document.getElementsByClassName("channel-panels-container");
slog("Wait for the page");
if(bol){
   tout = setTimeout(function() {
	chrome.runtime.sendMessage({action: "close"});
   }, 20000);
}
if(docinner.length <= 0){
	setTimeout(function() {
		onWindow(false);
	}, 1000);
	return;
}
clearTimeout(tout);
slog("Start Searching on tab");
var docin = docinner.item(0).outerHTML;
var doci = docin.replace(/ \(at\) | \(at\)|\(at\) |\(at\)| \( at \) | \( at \)|\( at \) |\( at \)/gi, "@").replace(/ \(dot\) | \(dot\)|\(dot\) |\(dot\)| \( dot \) | \( dot \)|\( dot \) |\( dot \)/gi, ".");
var doc = doci.split(/[^.@A-Za-z0-9]/);
for(var i = 0; i < doc.length;i++){
	if(doc[i].includes("@") && doc[i].includes(".") && !doc[i].endsWith(".") && !doc[i].endsWith("html") && !doc[i].startsWith("@") && !doc[i].toUpperCase().endsWith("PNG") && !doc[i].toUpperCase().endsWith("GHZ")){
		slog("Found:");
		var item = document.getElementsByClassName("align-items-stretch flex flex-shrink-0 flex-nowrap").item(0);
	    var input = item.getElementsByTagName("a");
		var out;
		for(var y = 0;y < input.length;y++){
		    if(input[y].getAttribute("data-a-target") === "followers-channel-header-item"){
				out = input[y].getElementsByClassName("channel-header__item-count flex mg-l-05").item(0).getElementsByClassName("font-size-5").item(0).innerHTML.replace(",", "");
				break;
			}
		}
		chrome.runtime.sendMessage({action: "email", source: out + "," + doc[i]});
		break;
	}
}
chrome.runtime.sendMessage({action: "close"});
}
function onWindowLoad(){
	onWindow(true);
}
window.onload = onWindowLoad;