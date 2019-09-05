var Filters =
{
   /**
    * Type map to filter required types.
    * NOTE: "documents" filter also returns folders to show UI hint about hidden folders.
    */
   TYPE_MAP:
   {
      "documents": '+(TYPE:"content" OR TYPE:"app:filelink" OR TYPE:"folder")',
      "folders": '+(TYPE:"folder" OR TYPE:"app:folderlink")',
      "images": '+@cm\\:content.mimetype:image/*'
   },
   
   /**
    * Types that we want to suppress from the resultset
    */
   IGNORED_TYPES:
   [
      "cm:systemfolder",
      "fm:forums",
      "fm:forum",
      "fm:topic",
      "fm:post"
   ],
   
   /**
    * Aspects ignored from the canned query based resultset
    */
   IGNORED_ASPECTS:
   [
      "cm:checkedOut"
   ],

   /**
    * Encode a path with ISO9075 encoding
    *
    * @method iso9075EncodePath
    * @param path {string} Path to be encoded
    * @return {string} Encoded path
    */
   iso9075EncodePath: function Filter_iso9075EncodePath(path)
   {
      var parts = path.split("/");
      for (var i = 1, ii = parts.length; i < ii; i++)
      {
         parts[i] = "cm:" + search.ISO9075Encode(parts[i]);
      }
      return parts.join("/");
   },

   /**
    * Create filter parameters based on input parameters
    *
    * @method getFilterParams
    * @param filter {string} Required filter
    * @param parsedArgs {object} Parsed arguments object literal
    * @param optional {object} Optional arguments depending on filter type
    * @return {object} Object literal containing parameters to be used in Lucene search
    */
   getFilterParams: function Filter_getFilterParams(filter, parsedArgs, optional)
   {
      var filterParams =
      {
         query: "+PATH:\"" + parsedArgs.pathNode.qnamePath + "//*\"",
         limitResults: null,
         sort: [
         {
            column: "@cm:name",
            ascending: true
         }],
         language: "lucene",
         templates: null,
         variablePath: true,
         ignoreTypes: Filters.IGNORED_TYPES,
         ignoreAspects: Filters.IGNORED_ASPECTS,
		 isMikReadOnlyUser: false
      };

      optional = optional || {};

      // Sorting parameters specified?
      var sortAscending = args.sortAsc,
         sortField = args.sortField;

      if (sortAscending == "false")
      {
         filterParams.sort[0].ascending = false;
      }
      if (sortField !== null)
      {
         filterParams.sort[0].column = (sortField.indexOf(":") != -1 ? "@" : "") + sortField;
      }

      // Max returned results specified?
      var argMax = args.max;
      if ((argMax !== null) && !isNaN(argMax))
      {
         filterParams.limitResults = argMax;
      }

      var favourites = optional.favourites;
      if (typeof favourites == "undefined")
      {
         favourites = [];
      }
      
      // Create query based on passed-in arguments
      var filterData = String(args.filterData),
         filterQuery = "";

      // Common types and aspects to filter from the UI - known subtypes of cm:content and cm:folder
      var filterQueryDefaults = ' -TYPE:"' + Filters.IGNORED_TYPES.join('" -TYPE:"') + '"';
	  
/********************************************* MIK CHANGE - start ***********************************************************/ 
	var name = encodeURIComponent(person.properties.userName);	
	
	var isGateKeeper = false;
	var isAdmin = false;
	var isSiteConsumer = false;
	var isAllFunctions = false;
	
	var isTeamMember  	= false;
	var isSupervisor  	= false;
	var isStoreMgr  	= false;
	var isDistrict  	= false;
	var isMarket 		= false;
	var isZone  		= false;
	var isSupportCenter = false;
	
	if(people.isAdmin(person)){
		isAdmin = true;
		logger.log("Document Lib: User is admin");
	}	
	var currentUsersGroups = people.getContainerGroups(person);
	if(currentUsersGroups != null && currentUsersGroups != 'null'){
		for(i=0; i < currentUsersGroups.length; i++)
		{	
			var group = currentUsersGroups[i].getQnamePath()
			var p = group.split(":");
			p = p[p.length-1]
			logger.log("Group Name:"+i+" "+p);

			if(p.toUpperCase() == "GROUP_GATE_KEEPER".toUpperCase()) 
			{
				isGateKeeper = true;
			}
			else if(p.toUpperCase() == "GROUP_ALL_FUNCTIONS".toUpperCase()) 
			{
				isAllFunctions = true;
			}
			else if(p.toUpperCase() == "GROUP_PERSONA_TM".toUpperCase()) 
			{
				isTeamMember = true;
			}
			else if(p.toUpperCase() == "GROUP_PERSONA_SUP".toUpperCase()) 
			{
				isSupervisor = true;
			}
			else if(p.toUpperCase() == "GROUP_PERSONA_STRMGR".toUpperCase()) 
			{
				isStoreMgr = true;
			}
			else if(p.toUpperCase() == "GROUP_PERSONA_DISTRICT".toUpperCase()) 
			{
				isDistrict = true;
			}
			else if(p.toUpperCase() == "GROUP_PERSONA_MKT".toUpperCase()) 
			{
				isMarket = true;
			}
			else if(p.toUpperCase() == "GROUP_PERSONA_ZONE".toUpperCase()) 
			{
				isZone = true;
			}
			else if(p.toUpperCase() == "GROUP_PERSONA_CP".toUpperCase()) 
			{
				isSupportCenter = true;
			}			
			
		} // end of for
	} // end of if

	//get user site role
	var site = '';
	var siteUrl = '';
	var userSiteRole = '';
	if(parsedArgs.location.site != null){
		site = parsedArgs.location.site;
		logger.log("Doc Lib Site: "+site);
	}
	if(site != null && site != ''){
		siteUrl = siteService.getSite(site);
		logger.log("Doc Lib Site Url: "+siteUrl);
	}
	if(siteUrl != null && siteUrl != ''){
		userSiteRole = siteUrl.getMembersRole(person.properties.userName);
		logger.log("User Site Role:  "+userSiteRole);
	}
	
	var customPropertyFilters = "";	
	//@mikdoc\:persona:"Supervisor";
	var personaField = 'persona';
	
	var personaTMval    = 'Team Member';
	var personaSUPval   = 'Supervisor';
	var personaSMval    = 'Store Manager';
	var personaDistval  = 'District';
	var personaMktval   = 'Market';
	var personaZoneval  = 'Zone';
	var personaScval    = 'Support Center';
	
	var startDateField  = "startDate";
	var endDateField    = "endDate";	
	var docTypeContent  = " +TYPE:\"cm:content\"";
	 
	var personaTM		=  " (+@mikdoc\\:" + personaField + ":\"" + personaTMval   + '"'+docTypeContent +")";
	var personaSUP  	=  " (+@mikdoc\\:" + personaField + ":\"" + personaSUPval  + '"'+docTypeContent +")";
	var personaSM   	=  " (+@mikdoc\\:" + personaField + ":\"" + personaSMval   + '"'+docTypeContent +")";
    var personaDist 	=  " (+@mikdoc\\:" + personaField + ":\"" + personaDistval + '"'+docTypeContent +")";
	var personaMkt  	=  " (+@mikdoc\\:" + personaField + ":\"" + personaMktval  + '"'+docTypeContent +")";
	var personaZone		=  " (+@mikdoc\\:" + personaField + ":\"" + personaZoneval + '"'+docTypeContent +")";
	var personaSc   	=  " (+@mikdoc\\:" + personaField + ":\"" + personaScval   + '"'+docTypeContent +")";

   	var startDateQry	=  " +(@mikdoc\\:" + startDateField + ":[MIN TO NOW])";
	var endDateQry		=  " (+@mikdoc\\:" + endDateField   + ":[NOW TO MAX])";
    var endDateNullQry  =  " (+ISNULL:\"mikdoc:" + endDateField + "\")";

	logger.log("isAdmin : "+isAdmin + " ,isGateKeeper : " +isGateKeeper +" ,isAllFunctions: "+isAllFunctions);

		if(!isAdmin  && !isAllFunctions && (!isGateKeeper || (isGateKeeper  && isSiteConsumer))){
		
		if(isSupportCenter){
			customPropertyFilters =  personaTM +" OR " + personaSUP +" OR " +personaSM +" OR " +personaMkt +" OR " +personaDist +" OR " +personaZone +" OR " +personaSc;
		}
		else if(isZone){
			customPropertyFilters =  personaTM +" OR " + personaSUP +" OR " +personaSM +" OR " +personaMkt +" OR " +personaDist +" OR " +personaZone;
		}
		else if(isDistrict){
			customPropertyFilters =  personaTM +" OR " + personaSUP +" OR " +personaSM +" OR " +personaMkt +" OR " +personaDist;
		}
		else if(isMarket){
			customPropertyFilters =  personaTM +" OR " + personaSUP +" OR " +personaSM +" OR " +personaMkt +" OR " +personaDist;
		}
		else if(isStoreMgr){
			customPropertyFilters =  personaTM +" OR " + personaSUP +" OR " +personaSM;
		}
		else if(isSupervisor){
			customPropertyFilters =  personaTM +" OR " + personaSUP;
		}
		else if(isTeamMember){
			customPropertyFilters =  personaTM;
		}
		else{
			customPropertyFilters =  personaTM;
		}								
			
	}
	logger.log("customPropertyFilters : " +customPropertyFilters);
	logger.log("Persona Code ends");
	
	
/********************************************* MIK CHANGE - end ***********************************************************/ 

      switch (String(filter))
      {
         case "all":
            filterQuery = "+PATH:\"" + parsedArgs.rootNode.qnamePath + "//*\"";
            filterQuery += " +TYPE:\"cm:content\"";
            filterQuery += " -ASPECT:\"cm:checkedOut\"";
            filterParams.query = filterQuery + filterQueryDefaults;
            break;

         case "recentlyAdded":
         case "recentlyModified":
         case "recentlyCreatedByMe":
         case "recentlyModifiedByMe":
            var onlySelf = (filter.indexOf("ByMe")) > 0 ? true : false,
               dateField = (filter.indexOf("Modified") > 0) ? "modified" : "created",
               ownerField = (dateField == "created") ? "creator" : "modifier";

            // Default to 7 days - can be overridden using "days" argument
            var dayCount = 7,
               argDays = args.days;
            if ((argDays !== null) && !isNaN(argDays))
            {
               dayCount = argDays;
            }

            // Default limit to 50 documents - can be overridden using "max" argument
            if (filterParams.limitResults === null)
            {
               filterParams.limitResults = 50;
            }

            var date = new Date();
            var toQuery = date.getFullYear() + "\\-" + (date.getMonth() + 1) + "\\-" + date.getDate();
            date.setDate(date.getDate() - dayCount);
            var fromQuery = date.getFullYear() + "\\-" + (date.getMonth() + 1) + "\\-" + date.getDate();

            filterQuery = this.constructPathQuery(parsedArgs);
            filterQuery += " +@cm\\:" + dateField + ":[" + fromQuery + "T00\\:00\\:00.000 TO " + toQuery + "T23\\:59\\:59.999]";
            if (onlySelf)
            {
               filterQuery += " +@cm\\:" + ownerField + ":\"" + person.properties.userName + '"';
            }
            filterQuery += " +TYPE:\"cm:content\"";

            filterParams.sort = [
            {
               column: "@cm:" + dateField,
               ascending: false
            }];
            filterParams.query = filterQuery + filterQueryDefaults;
            break;

         case "editingMe":
            filterQuery = this.constructPathQuery(parsedArgs);
            filterQuery += " +((+@cm\\:workingCopyOwner:\"" + person.properties.userName + '")';
            filterQuery += " OR (+@cm\\:lockOwner:\"" + person.properties.userName + '"';
            filterQuery += " +@cm\\:lockType:\"WRITE_LOCK\"))";
            filterParams.query = filterQuery;
            break;

         case "editingOthers":
            filterQuery = this.constructPathQuery(parsedArgs);
            filterQuery += " +((+ASPECT:\"workingcopy\"";
            filterQuery += " -@cm\\:workingCopyOwner:\"" + person.properties.userName + '")';
            filterQuery += " OR (-@cm\\:lockOwner:\"" + person.properties.userName + '"';
            filterQuery += " +@cm\\:lockType:\"WRITE_LOCK\"))";
            filterParams.query = filterQuery;
            break;

         case "favourites":
            for (var favourite in favourites)
            {
               if (filterQuery)
               {
                  filterQuery += " OR ";
               }
               filterQuery += "ID:\"" + favourite + "\"";
            }
            
            if (filterQuery.length !== 0)
            {
               filterQuery = "+(" + filterQuery + ")";
               // no need to specify path here for all sites - IDs are exact matches
               if (parsedArgs.nodeRef != "alfresco://sites/home" && parsedArgs.nodeRef != "alfresco://company/home")
               {
                  filterQuery += ' +PATH:"' + parsedArgs.rootNode.qnamePath + '//*"';
               }
            }
            else
            {
               // empty favourites query
               filterQuery = "+ID:\"\"";
            }
            
            filterParams.query = filterQuery;
            break;

         case "synced":
            filterQuery = this.constructPathQuery(parsedArgs);
            filterQuery += " +ASPECT:\"sync:syncSetMemberNode\"";
            filterParams.query = filterQuery;
            break;

         case "syncedErrors":
            filterQuery = this.constructPathQuery(parsedArgs);
            filterQuery += " +ASPECT:\"sync:failed\"";
            filterParams.query = filterQuery;
            break;

         case "node":
            filterParams.variablePath = false;
            filterParams.query = "+ID:\"" + parsedArgs.nodeRef + "\"";
            break;

         case "tag":
            // Remove any trailing "/" character
            if (filterData.charAt(filterData.length - 1) == "/")
            {
               filterData = filterData.slice(0, -1);
            }
            filterQuery = this.constructPathQuery(parsedArgs);
            filterParams.query = filterQuery + " +PATH:\"/cm:taggable/cm:" + search.ISO9075Encode(filterData) + "/member\"";
            break;

         case "category":
            // Remove any trailing "/" character
            if (filterData.charAt(filterData.length - 1) == "/")
            {
               filterData = filterData.slice(0, -1);
            }
            filterQuery = this.constructPathQuery(parsedArgs);
            filterParams.query = filterQuery + " +PATH:\"/cm:generalclassifiable" + Filters.iso9075EncodePath(filterData) + "/member\"";
            break;

         case "aspect":
            filterQuery = "+PATH:\"" + parsedArgs.rootNode.qnamePath + "//*\"";
            filterQuery += "+ASPECT:\"" + args.filterData + "\"";
            filterParams.query = filterQuery;
            break;

         default: // "path"
            filterParams.variablePath = false;
			logger.info("inside default");
            filterQuery = "+PATH:\"" + parsedArgs.pathNode.qnamePath + "/*\"";
			if(customPropertyFilters != ''){				
				//filterQuery += "+(( +("+customPropertyFilters + ")" + startDateQry + endDateQry + ") OR (+TYPE:\"cm:folder\"))";  Perfectly working code
				//filterQuery += "+(( +("+customPropertyFilters + ")" + startDateQry + " " + endDateNullQry + ") OR (+TYPE:\"cm:folder\"))"; Perfectly working code

				filterQuery += "+(( +("+customPropertyFilters + ")" + startDateQry + " +(" + endDateQry + " OR " + endDateNullQry + ")) OR (+TYPE:\"cm:folder\"))";
				filterParams.isMikReadOnlyUser = true;				
			}			 
           filterParams.query = filterQuery + filterQueryDefaults;
		   filterParams.query = filterQuery;
           break;
      }
      // Specialise by passed-in type
      if (filterParams.query !== "")
      {
         filterParams.query += " " + (Filters.TYPE_MAP[parsedArgs.type] || "");
      }
      return filterParams;
   },
   
   constructPathQuery: function constructPathQuery(parsedArgs)
   {
      var pathQuery = "";
      if (parsedArgs.libraryRoot != companyhome || parsedArgs.nodeRef != "alfresco://company/home")
      {
         if (parsedArgs.nodeRef == "alfresco://sites/home")
         {
            // all sites query - better with //cm:*
            pathQuery = '+PATH:"' + parsedArgs.rootNode.qnamePath + '//cm:*"';
         }
         else
         {
            // site specific query - better with //*
            pathQuery = '+PATH:"' + parsedArgs.rootNode.qnamePath + '//*"';
         }
      }
      return pathQuery;
   }
};
