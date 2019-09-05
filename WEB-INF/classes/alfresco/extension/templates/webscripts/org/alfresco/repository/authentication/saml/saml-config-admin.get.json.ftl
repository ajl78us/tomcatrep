<#escape x as jsonUtils.encodeJSONString(x)>
{
	"ssoEnabled" : ${ssoEnabled?string},
	"ssoEnforced" : ${ssoEnforced?string},
	"idpDescription" : <#if idpDescription??>"${idpDescription}"<#else>null</#if>,
	"idpSsoURL" : <#if idpSsoURL??>"${idpSsoURL}"<#else>null</#if>,
	"idpSloRequestURL" : <#if idpSloRequestURL??>"${idpSloRequestURL}"<#else>null</#if>,
	"idpSloResponseURL" : <#if idpSloResponseURL??>"${idpSloResponseURL}"<#else>null</#if>,
	"autoProvisionEnabled" : ${autoProvisionEnabled?string},
	"alfrescoLoginCredentialEnabled" : ${alfrescoLoginCredentialEnabled?string},
	"entityID" : "${entityID}",
	"certificate" : <#if certificateInfo??><@certificateJSONDetails certificateInfo=certificateInfo/><#else>null</#if>	
}
</#escape>

	

<#macro certificateJSONDetails certificateInfo>
{  
   		"status" : "${certificateInfo.status}", 
   		"expiryDate" : 
   		{
     		"iso8601" : "${certificateInfo.expiryDate}",
     		"defaultFormat" : <#if certificateInfo.expiryDate?? && certificateInfo.expiryDate.toDate()?has_content>"${certificateInfo.expiryDate.toDate()?datetime}"<#else>null</#if>
   		}
}
</#macro> 

