<#include "/org/alfresco/enterprise/repository/admin/admin-template.ftl" />
<#import "admin-saml.lib.ftl" as samlConfig>
<style>
    /* Style the list */
    ul.tab {
        list-style-type: none;
        margin: 1em 0 0 1em;
        padding: 0;
        background-color: white;
    }

    /* Float the list items side by side */
    ul.tab li {
        float: left;
        margin-bottom: -1px;
    }

    /* Style the links inside the list items */
    ul.tab li a {
        border: 1px solid #ccc;
        border-left:none;
        width: 7em;
        display: inline-block;
        color: black;
        text-align: center;
        padding: 0.5em 0.5em;
        text-decoration: none;
        transition: 0.3s;
        font-size: 17px;
        background-color: transparent;
    }
    
    ul.tab li:first-child a {
        border-left: 1px solid #ccc;
    }
    
    div.saveMessage {
        padding: 0.5em 0.5em;
    }

    /* Change background color of links on hover */
    ul.tab li a:hover {
        color: black;
        background-color: white;
        border-bottom-color: white;
    }

    /* Create an active/current tablink class */
    ul.tab li a:focus {color: black; background-color: white;}
    ul.tab li a:visited {color: lightgrey; background-color: #f1f1f1;}
    ul.tab li a:link {color: lightgrey; background-color: #f1f1f1; }

    ul.tab li a.active {
        color: black;
        background-color: white;
        border-bottom-color: white;
    }

    /* Style the tab content */
    .tabcontent {
        display: none;
        padding: 6px 12px;
        border-width: 1px 0px 1px 0px;
        border-style: solid;
        border-color: #ccc;
    }
</style>
<@page title=msg("saml.title")>

<script type="text/javascript">//<![CDATA[

/**
 * Admin SAML SP Metadata Download Component
 */
var AdminSPMetadata = AdminSPMetadata || {};
var AdminSPCert = AdminSPCert || {};
var AdminIdPCertInfo = AdminIdPCertInfo || {};
var AdminFunctions = AdminFunctions || {};

window.onload = function() {
    var selectedTab = sessionStorage.getItem("activeTab");
    if(selectedTab == null)
    {
        selectedTab = 0;
    }
    AdminFunctions.clickTab(selectedTab);
};
(function() {

   AdminSPMetadata.download = function download(sp)
   {
      var url = "${url.serviceContext}/saml/" + sp + "/sp/metadata?a=true";
      window.location.href = url;
   };
   
   AdminSPCert.download = function download(sp)
   {
      var url = "${url.serviceContext}/saml/" + sp + "/sp/pubcert?a=true";
      window.location.href = url;
   };

    AdminFunctions.clickTab = function clickTab(tabIndex) {
        // Declare all variables
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
            if(i == tabIndex)
            {
                tabcontent[i].style.display = "block";
            }
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
            if(i == tabIndex)
            {
                tablinks[i].className += (" active");
            }
        }
        sessionStorage.setItem("activeTab", tabIndex);
    };

   // Get IdP cert info localization into JS on page load
   var idpCertStatusMessages =
   {
        "missing": "${msg('saml.sp.idp.certificate.status.missing')}",
        "expired": "${msg('saml.sp.idp.certificate.status.expired')}",
        "valid": "${msg('saml.sp.idp.certificate.status.valid')}"
   };
   
   AdminIdPCertInfo.update = function update(sp)
   {
      Admin.request({
         url: "${url.serviceContext}/saml/" + sp + "/config",
         fnSuccess: function(res)
         {
            var idpCertInfoEl = el("idpCertInfo-" + sp);
            var idPCert = { "status": "missing" }; // default cert object if none present
            if (res.responseJSON && res.responseJSON.certificate)
            {
                idPCert = res.responseJSON.certificate;
            }
            var idpCertStatusIcon = "${url.context}/admin/images/" + (idPCert.status == "valid" ? "enabled" : "disabled") + ".gif";
            var idpCertStatusTooltip = idpCertStatusMessages[idPCert.status];
            var idpCertExpiryDateDisplay = "";
            if (idPCert.expiryDate && idPCert.expiryDate.defaultFormat)
            {
                idpCertExpiryDateDisplay = idPCert.expiryDate.defaultFormat;
            }

            idpCertInfoEl.innerHTML = '<div class="section status">'
                + '<span class="label">${msg("saml.sp.idp.certificate.status.label")?html}:</span>'
                + '<span class="value"> '
                + '<img src="' + idpCertStatusIcon + '" width="16" height="16" alt="' + idpCertStatusTooltip + '" title="' + idpCertStatusTooltip + '" /> '
                + '<span>' + idpCertStatusTooltip + '</span> '
                + '</span>'
                + '</div>'
                + '<div class="control field">'
                + '<span class="label">${msg("saml.sp.idp.certificate.expiryDate.label")?html}:</span>'
                + '<span class="value">' + idpCertExpiryDateDisplay + '</span>'
                + '</div>';
         }
      });
   }

})();
//]]></script>

   <div class="column-full">
      <p class="intro">${msg("saml.intro-text")?html}</p>
   </div>
   <div class="column-left">
      <p class="info">${msg("saml.info-text", "<a href='http://docs.alfresco.com/saml/concepts/saml-overview.html'>", "</a>")}</p>
   </div>
   <#if isLogDisplaySupported>
       <div class="column-right">
          <@button id="tail-alfresco-log" label="${msg('saml.showRepoLogs.label')}" onclick="window.open('${url.serviceContext}/enterprise/admin/admin-log-settings-tail?context=Alfresco&filter=org.alfresco.repo.security.authentication.saml&filter=org.alfresco.repo.web.scripts.saml&hideCloseButton=true','_blank');"/>
          <span class="description">${msg('saml.showRepoLogs.description')}</span>
       </div>
   </#if>

   <div class="column-full">
      <#assign shareSp=sps[0]>
      <#assign repoSp=sps[1]>

       <ul class="tab">
           <#list sps as sp>
                 <li><a id="${sp.id}-link" href="#" class="tablinks" onclick="AdminFunctions.clickTab(${sp.tabIndex})">${sp.label}</a></li>
           </#list>
       </ul>
    
       <#list sps as sp>
             <div id="${sp.id}Tab" class="column-full tabcontent" style="display:block">
                <@samlConfig.page attributes=sp.attributes spId=sp.id />
             </div>
       </#list>

       <div class="saveMessage"><b>${msg('saml.sp.save.message')}</b></div>
</@page>