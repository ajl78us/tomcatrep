var user = person.properties.userName ;
model.user = user;

var slingShot ="/share/proxy/alfresco/slingshot/node/content/";
var fullURL = url.full;
model.fullURL = fullURL ;
var path1 = fullURL.substring(fullURL.indexOf("?path=")+6, fullURL.indexOf("&alf_ticket="));
model.encodedpath = path1;
model.path1 = decodeURIComponent(path1);

var store = "workspace://SpacesStore"; 
var searchHome= "//app:company_home/st:sites";

var input = path1;
var output ="" ;
var res = input.split("/");
for (i =1; i< res.length ; i ++) { 
	output = output+ "/"+ search.ISO9075Encode(res[i]) ;
}

var re = new RegExp("/", 'g');
var folderPath= output.replace(re, '/cm:');

var query = searchHome + folderPath;

var nodes = search.xpathSearch(store, query);
var nodeRef ;
var docName;
var path;
if(nodes[0])
{
	nodeRef = nodes[0].nodeRef;
	docName = nodes[0].properties["cm:name"];
}
var fileSource1 = slingShot+nodeRef+"/"+res[res.length-1]+"?a=false";
model.fileSource = fileSource1.replace("://","/");
model.docName = docName;
model.nodeRef = nodeRef;