<#if fileSource??>

	<html>
		<#if docName??>
			<head>
				<title>${docName}</title>
			</head>
		</#if>
		<body style="height: 100%; width: 100%; overflow: hidden; margin: 0px;">
			<object>
				<iframe style="position:absolute; width:100%; height: 100%" name="plugin" id="plugin" src="${fileSource}"/>
			</object>
		</body>
	</html>

<#else>
	The document you are trying to access is no longer available or You don't have access to this document. 
	
</#if>