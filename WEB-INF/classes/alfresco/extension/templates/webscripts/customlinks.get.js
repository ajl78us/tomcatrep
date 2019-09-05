    var fullURL = url.full;
    model.fullURL = fullURL ;
    var site= fullURL.substring(fullURL.indexOf("?site=")+6, fullURL.indexOf("&name="));

    model.site = site;
 
   	var userGroupArray  = [] ;
    var user = fullURL.substring(fullURL.indexOf("&name=")+6, fullURL.indexOf("&alf_ticket="));
    model.user = user;

   	var person   = people.getPerson(user);
   	var containerGroups = people.getContainerGroups(person);
	var isGateKeeper = false;
	var isAdmin = false;
	var isAllFunctions = false;
	
	if(people.isAdmin(person)){
		isAdmin = true;
		//logger.log("Custom link - user is admin");
	}	
	
	for each (contGroup in containerGroups)	{
   		var group = contGroup.getQnamePath()
   		var p = group.split(":");
  		userGroupArray.push(p[p.length-1]);
	}

	var isTeamMember  = false;
	var isSupervisor  = false;
	var isStoreMgr  = false;
	var isDistrict  = false;
	var isMarket 	= false;
	var isZone  	= false;
	var isSupportCenter  = false;

	var personaTMval    = 'Team Member';
	var personaSUPval   = 'Supervisor';
	var personaSMval    = 'Store Manager';
	var personaDistval  = 'District';
	var personaMktval   = 'Market';
	var personaZoneval  = 'Zone';
	var personaScval    = 'Support Center';

	var userPersonaArray  = [] ;

	for(k=0; k < userGroupArray.length; k++) {
		var p = userGroupArray[k];
		//logger.log("Custom link - user groups: "+p.toUpperCase());
		if(p.toUpperCase() == "GROUP_GATE_KEEPER".toUpperCase()) 
		{
			isGateKeeper = true;
		}	
		else if(p.toUpperCase() == "GROUP_ALL_FUNCTIONS".toUpperCase()) 
		{
			isAllFunctions = true;
		}
		 else if(p.toUpperCase() == "GROUP_PERSONA_CP".toUpperCase()) 
		{
			isSupportCenter = true;
		}	
		else if(p.toUpperCase() == "GROUP_PERSONA_ZONE".toUpperCase()) 
		{
			isZone = true;
		}
		else if(p.toUpperCase() == "GROUP_PERSONA_MKT".toUpperCase()) 
		{
			isMarket = true;
		}
		else if(p.toUpperCase() == "GROUP_PERSONA_DISTRICT".toUpperCase()) 
		{
			isDistrict = true;
		}
		else if(p.toUpperCase() == "GROUP_PERSONA_STRMGR".toUpperCase()) 
		{
			isStoreMgr = true;
		}
		else if(p.toUpperCase() == "GROUP_PERSONA_SUP".toUpperCase()) 
		{
			isSupervisor = true;
		}
		else
		{
			isTeamMember = true;
		}
		
	}

	if(isSupportCenter){
			userPersonaArray.push(personaTMval);
            userPersonaArray.push(personaSUPval);
            userPersonaArray.push(personaSMval);
            userPersonaArray.push(personaDistval);
			userPersonaArray.push(personaMktval);
            userPersonaArray.push(personaZoneval);
            userPersonaArray.push(personaScval);
	}
	else if(isZone){
			userPersonaArray.push(personaTMval);
            userPersonaArray.push(personaSUPval);
            userPersonaArray.push(personaSMval);
            userPersonaArray.push(personaDistval);
			userPersonaArray.push(personaMktval);
            userPersonaArray.push(personaZoneval);
	}
	else if(isMarket){
			userPersonaArray.push(personaTMval);
            userPersonaArray.push(personaSUPval);
            userPersonaArray.push(personaSMval);
            userPersonaArray.push(personaDistval);
			userPersonaArray.push(personaMktval);
	}
	else if(isDistrict){
			userPersonaArray.push(personaTMval);
            userPersonaArray.push(personaSUPval);
            userPersonaArray.push(personaSMval);
            userPersonaArray.push(personaDistval);
			userPersonaArray.push(personaMktval);
	}
	else if(isStoreMgr){
			userPersonaArray.push(personaTMval);
            userPersonaArray.push(personaSUPval);
            userPersonaArray.push(personaSMval);
	}
	else if(isSupervisor){
			userPersonaArray.push(personaTMval);
            userPersonaArray.push(personaSUPval);
	}
	else {
		userPersonaArray.push(personaTMval);
	}

/*	for (i = 0; i < userPersonaArray.length; i++) {
  		logger.log(userPersonaArray[i].toUpperCase());
	}*/
	
	var canEditLink  = false;
		
	if(isGateKeeper || isAdmin) {
		canEditLink = true;
		logger.info("Custom link - canEditLink: "+canEditLink);
	}
	
	model.canEditLink = canEditLink;
	
/*	var referenceType = "node"; 
	var reference = ["workspace", "SpacesStore", "f451de85-9bd7-4c0e-a16e-61d8a21d383e"]; 
	var node = search.findNode(referenceType, reference);

	var referenceType = "path"; 
	var reference = ["workspace", "SpacesStore", "Company Home/Sites/msr/documentLibrary/Links"]
	var node = search.findNode(referenceType, reference);*/

var node = companyhome.childByNamePath("Sites/"+site+"/documentLibrary/Links");

	var linkNodeArray = [] ;	
	var finalLinkNodeArray = [];
	var breakLoop = false;
	var count = userGroupArray.length;
	if(node)
	{
	for each (n in node.children)
	{  	
		breakLoop = false;      
		if(n.isDocument && n.typeShort == 'miklink:mik_link')
		{
			var permissions = n.getPermissions();
          
		   if(isAdmin){ // for admin users					
				linkNodeArray.push(n); 
			}			
			else // for non admin users
			{
				for(var i=0; i < permissions.length ; i ++)
				{ 
					var permission 	= permissions[i];
					var group 		= permission.split(";")[1]; 
//					logger.info("group.toUpperCase() "+group.toUpperCase());
					for(j=0; j < count; j++)
						{
//							logger.info("userGroupArray[j].toUpperCase() "+userGroupArray[j].toUpperCase());
							if(userGroupArray[j].toUpperCase() == group.toUpperCase()) 
							{
								linkNodeArray.push(n);
								breakLoop = true;
								break;
							}			
					}				
					
					if(breakLoop) {
						break;
					}
				}
			}
		}
	}
	}
	//  Persona filter startes
		for (i = 0; i < linkNodeArray.length; i++) { 
			var nOuter = linkNodeArray[i];
			var now = new Date();
			var isActiveLink = false;
/*			logger.log("Custom link Date:"+ nOuter.properties["miklink:startDate"]);
			logger.log("Custom link end Date:"+ nOuter.properties["miklink:endDate"]);
			logger.log("Current date:"+ now);	*/	
			if(nOuter.properties["miklink:startDate"] <= now && (nOuter.properties["miklink:endDate"] == null || nOuter.properties["miklink:endDate"] >= now))
			{
				isActiveLink = true;
		//		logger.log("isActiveLink: "+isActiveLink);
			}
			
			
			if(isAdmin || isGateKeeper || isAllFunctions){
		//			logger.log("Admin has access to the custom link persona: "+nOuter.properties["miklink:persona"]);
					finalLinkNodeArray.push(nOuter);
			}
			else{
				for( p = 0; p < userPersonaArray.length; p++){  // filter link based on persona & Active link to Read only users
//					logger.log("User has access to the custom link persona: "+nOuter.properties["miklink:persona"]);
//					logger.log("User has access to the custom link persona: "+userPersonaArray[p]);
					if(nOuter.properties["miklink:persona"] == userPersonaArray[p] && isActiveLink){					
	//					logger.log("User has access to the custom link persona: "+nOuter.properties["miklink:persona"]);
						finalLinkNodeArray.push(nOuter);
					}		
				}
			}
		}
	
    
 //  	logger.log("Custom link length: "+finalLinkNodeArray.length);
	model.linkNodeArray = finalLinkNodeArray;
	model.linkCount = finalLinkNodeArray.length;