function slog(info){
chrome.runtime.sendMessage({
    action: "log",
    source: info
});
}
function onWindow(){
var docinner = document.getElementsByClassName("channel-panels-container");
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
		chrome.runtime.sendMessage({action: "email", source: document.getElementsByClassName("tw-stat__value").item(0).innerHTML.replace(",", "") + "," + doc[i]});
		break;
	}
}
chrome.runtime.sendMessage({action: "close"});
}
window.onload = onWindow;