<import resource="classpath:alfresco/enterprise/webscripts/org/alfresco/enterprise/repository/admin/admin-common.lib.js">

var LOG_DISPLAY_REQUIRED_AMP_NAME = "support-tools";
var LOG_DISPLAY_REQUIRED_AMP_VERSION_MIN = "1.10";

function isSubsystemSupported(attributes)
{
   if (!attributes)
   {
      return false;
   }
   // TODO: other SPs could be added / overridden here
   return !(attributes["saml.sp.isEnabled"] === undefined);
}

function isLogDisplaySupported()
{
   //Retrieving the actual version of the alfresco version
   var systemInformation = Admin.getMBeanAttributes(
         "Alfresco:Name=RepositoryDescriptor,Type=Server",
         ["Edition", "VersionNumber"]
         );
   //If the version of alfresco is 5.2 or above, support tools are already part of the platform.
   var currentAlfrescoVersion = systemInformation["VersionNumber"].value;
   currentAlfrescoVersion = currentAlfrescoVersion.replace(".", "");
   if(parseInt(currentAlfrescoVersion.substring(0,2))>=52)
   {
      return true;
   }
   var installedAMPs = Admin.getCompositeDataAttributes(
         "Alfresco:Name=ModuleService",
         "AllModules",
         ["module.id","module.version"]
         );
   for (var i=0;i<installedAMPs.length; i++)
   {
      installedAMP = installedAMPs[i];
      // TODO Make this tied to something other than id in case support tools is renamed?
      if (installedAMP["module.id"] == LOG_DISPLAY_REQUIRED_AMP_NAME)
      {
         var logDisplayAmpVersionSegments = installedAMP["module.version"].split(".");
         var requiredLogDisplayAmpVersionSegments = LOG_DISPLAY_REQUIRED_AMP_VERSION_MIN.split(".");
         for (var j=0;j<requiredLogDisplayAmpVersionSegments.length; j++)
         {
            var logDisplayAmpVersionSegment = logDisplayAmpVersionSegments[j].replace("-SNAPSHOT", "");
            if (!logDisplayAmpVersionSegments[j] || logDisplayAmpVersionSegments[j] < requiredLogDisplayAmpVersionSegments[j])
            {
               return false;
            }
         }
         return true;
      }
   }
   return false;
}

function getSPs()
{
   var sps = [];

   var manager = Admin.getMBeanAttributes(
      "Alfresco:Type=Configuration,Category=SAML,id1=manager"
   );
   var chain = manager['chain'].value;

   // TODO error message if syntax of chain is incorrect

   var compositeIds = chain.split(",");
   for (var i = 0; i < compositeIds.length; i++) {
      var compositeId = compositeIds[i].split(':');
      var spId = compositeId[0].trim();
      var attributes = Admin.getMBeanAttributes('Alfresco:Type=Configuration,Category=SAML,id1=managed,id2=' + spId);
      sps.push({
        id: spId,
        tabIndex: i,
        attributes: attributes,
        isSubsystemSupported: isSubsystemSupported(attributes),
        label: msg.get('saml.sp.' + spId + '.label')
      });
   }

   return sps;
}

function main()
{
   model.sps = getSPs();

   model.tools = Admin.getConsoleTools("admin-saml");
  
   model.metadata = Admin.getServerMetaData();
   
   model.isLogDisplaySupported = isLogDisplaySupported();
}

main();