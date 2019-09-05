<#escape x as jsonUtils.encodeJSONString(x)>
   {
      "entry":
      {
         "isSamlEnabled": ${isSamlEnabled?string},
         "isSamlEnforced": ${isSamlEnforced?string},
         "idpDescription": "${idpDescription?string}",
         <#if isNetAdmin??>
         "isNetAdmin": ${isNetAdmin?string},
         </#if>
         "tenantDomain": "${tenantDomain}"
      }
   }
</#escape>
