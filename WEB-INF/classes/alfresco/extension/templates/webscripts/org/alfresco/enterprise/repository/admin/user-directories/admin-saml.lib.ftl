<#include "/org/alfresco/enterprise/repository/admin/admin-template.ftl" />

<#macro samlattrcheckbox attribute label=attribute.name description="" id="" style="" controlStyle="" disabled=false>
   <@samlcheckbox  name=attribute.qname label=label description=description value=cvalue(attribute.type, attribute.value) id=id style=style controlStyle=controlStyle disabled=disabled>
   <#nested>
   </@samlcheckbox>
</#macro>

<#-- Label and checkbox boolean field -->
<#macro samlcheckbox name label description="" value="false" id="" style="" controlStyle="" disabled=false>
   <div class="control checkbox"<#if style?has_content> style="${style?html}"</#if>>
      <span class="label">${label?html}:</span>
      <span class="value">
         <input <#if id?has_content>id="${id?html}"</#if> name="" onchange="el('${name?html}').value = (this.checked ? 'true' : 'false');" type="checkbox" <#if value="true">checked="checked"</#if> tabindex="0" <#if controlStyle?has_content>style="${controlStyle?html}"</#if> <#if disabled=true>disabled="disabled"</#if>/>
         <input id="${name?html}" name="${name?html}" type="hidden" value="<#if value="true">true<#else>false</#if>" />
      </span>
      <#if description?has_content><span class="description">${description?html}</span></#if>
      <#nested>
   </div>
</#macro>

<#-- Status read-only boolean field -->
<#macro samlstatus label description="" value="false" style="">
   <#if value != "">
      <#if value="true"><#local tooltip=msg("admin-console.enabled")?html><#else><#local tooltip=msg("admin-console.disabled")?html></#if>
      <div class="control status"<#if style?has_content> style="${style?html}"</#if>>
         <span class="label">${label?html}:</span>
         <span class="value">
            <img src="${url.context}/admin/images/<#if value="true">enabled<#else>disabled</#if>.gif" width="16" height="16" alt="${tooltip}" title="${tooltip}" />
            <span>${tooltip}</span>
         </span>
         <#if description?has_content><span class="description">${description}</span></#if>
      </div>
   <#else>
      <div class="control status"<#if style?has_content> style="${style?html}"</#if>>
         <span class="label">${label?html}:</span>
         <span class="value">
            <span>${msg("admin-console.unavailable")}</span>
         </span>
         <#if description?has_content><span class="description">${description}</span></#if>
      </div>
   </#if>
</#macro>

<#macro page attributes spId>
<#if attributes["saml.sp.isEnabled"]??>
<div class="column-left">
    <#if !attributes["spSigningCredentialStatus"]?? || attributes["spSigningCredentialStatus"].value == "missing">
        <@samlattrcheckbox id="samlEnabled-${spId}" attribute= attributes["saml.sp.isEnabled"] label=msg("saml.sp.isEnabled.label") description=msg("saml.sp.isEnabled.description") disabled=true/>
    <#else>
        <@samlattrcheckbox id="samlEnabled-${spId}" attribute= attributes["saml.sp.isEnabled"] label=msg("saml.sp.isEnabled.label") description=msg("saml.sp.isEnabled.description") />
    </#if>
</div>
<div class="column-right">
    <#if !attributes["spSigningCredentialStatus"]?? || attributes["spSigningCredentialStatus"].value == "missing">
        <@samlstatus label=msg("saml.sp.status.label") description=msg("saml.sp.status.missing.description") value="false" />
    <#else>
        <@attrstatus attribute= attributes["saml.sp.isEnabled"] label=msg("saml.sp.status.label") description=msg("saml.sp.status.description") />
    </#if>
</div>

<div class="column-full section">

<#if attributes["saml.sp.hideEnforced"]?? && attributes["saml.sp.hideEnforced"].value?lower_case=="true">
<#else>
    <#if !attributes["spSigningCredentialStatus"]?? || attributes["spSigningCredentialStatus"].value == "missing">
        <@samlattrcheckbox id="samlEnforced-${spId}" attribute= attributes["saml.sp.isEnforced"] label=msg("saml.sp.isEnforced.label") description=msg("saml.sp.isEnforced.description") disabled=true />
    <#else>
        <@samlattrcheckbox id="samlEnforced-${spId}" attribute= attributes["saml.sp.isEnforced"] label=msg("saml.sp.isEnforced.label") description=msg("saml.sp.isEnforced.description") />
    </#if>
</#if>

    <@attrtext id="idpDescription-${spId}" attribute= attributes["saml.sp.idp.description"] label=msg("saml.sp.idp.description.label") description=msg("saml.sp.idp.description.description") />
</div>

<div class="column-full section">
    <@attrtext id="ssoRequestUrl-${spId}" attribute= attributes["saml.sp.idp.sso.request.url"] label=msg("saml.sp.idp.sso.request.url.label") description=msg("saml.sp.idp.sso.request.url.description") />
    <@attrtext id="sloRequestUrl-${spId}" attribute= attributes["saml.sp.idp.slo.request.url"] label=msg("saml.sp.idp.slo.request.url.label") description=msg("saml.sp.idp.slo.request.url.description") />
    <@attrtext id="sloResponseUrl-${spId}" attribute= attributes["saml.sp.idp.slo.response.url"] label=msg("saml.sp.idp.slo.response.url.label") description=msg("saml.sp.idp.slo.response.url.description") />
    <@attrtext id="spIssuer-${spId}" attribute= attributes["saml.sp.idp.spIssuer"] label=msg("saml.sp.idp.spIssuer.label") description=msg("saml.sp.idp.spIssuer.description") />
    <@attrtext id="userMappingId-${spId}" attribute= attributes["saml.sp.user.mapping.id"] label=msg("saml.sp.user.mapping.id.label") description=msg("saml.sp.user.mapping.id.description") />
</div>

<div class="column-left section">
    <@button id="upload-certificate-${spId}" label=msg("saml.sp.idp.upload-certificate.label") description=msg("saml.sp.idp.upload-certificate.description") onclick="Admin.showDialog('${url.serviceContext}/enterprise/admin/admin-saml-idp-cert-upload/${spId}');" />
</div>
<div id="idpCertInfo-${spId}" class="column-right section">
</div>
<script type="text/javascript">//<![CDATA[
AdminIdPCertInfo.update('${spId}');
//]]></script>

<div class="column-full section">
    <#if !attributes["spSigningCredentialStatus"]?? || attributes["spSigningCredentialStatus"].value == "missing">
        <@button id="download-sp-cert-${spId}" label=msg("saml.sp.sp.cert.label") description=msg("saml.sp.sp.cert.description") onclick="AdminSPCert.download('${spId}')" disabled="true"/>
    <#else>
        <@button id="download-sp-cert-${spId}" label=msg("saml.sp.sp.cert.label") description=msg("saml.sp.sp.cert.description") onclick="AdminSPCert.download('${spId}')" />
    </#if>
</div>
<div class="column-full section">
    <@button id="download-sp-metadata-${spId}" label=msg("saml.sp.sp.metadata.label") description=msg("saml.sp.sp.metadata.description") onclick="AdminSPMetadata.download('${spId}')" />
</div>
<#else>
<p class="info">${msg("saml.sp.subsystem.unsupported.description")?html}</p>
</#if>
</#macro>