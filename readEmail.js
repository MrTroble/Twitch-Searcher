function slog(info){
chrome.runtime.sendMessage({
    action: "log",
    source: info
});
}
function onWindow(){
var docinner = document.getElementsByClassName("channel-panels-container");
slog("Wait for the page")
setTimeout(function() {
	chrome.runtime.sendMessage({action: "close"});
}, 20000);
if(docinner.length <= 0){
	setTimeout(function() {
		onWindow();
	}, 1000);
	return;
}
slog("Start Searching on tab");
var docin = docinner.item(0).outerHTML;
var doci = docin.replace(/ \(at\) | \(at\)|\(at\) |\(at\)| \( at \) | \( at \)|\( at \) |\( at \)/gi, "@").replace(/ \(dot\) | \(dot\)|\(dot\) |\(dot\)| \( dot \) | \( dot \)|\( dot \) |\( dot \)/gi, ".")
var doc = doci.split(/[^.@A-Za-z0-9]/);
for(i = 0; i < doc.length;i++){
	if(doc[i].includes("@") && doc[i].includes(".") && !doc[i].endsWith(".") && !doc[i].endsWith("html")){
		slog("Found:");
		var item = document.getElementsByClassName("align-items-stretch flex flex-shrink-0 flex-nowrap").item(0);
	    var input = item.getElementsByTagName("a");
		var out;
		for(y = 0;y < input.length;y++){
		    if(input[y].getAttribute("data-a-target") == "followers-channel-header-item"){
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
window.onload = onWindow;