<html>
<div class="dashlet customlinks">
	<div class="title" >${msg("header.customlinks")} </div>
	<div class="body">
		<div class="customlinks">
				<table>
					<#if linkCount gt 0>
						<#list linkNodeArray as link>
						<#if (link.properties["miklink:url"])??>
							<div class="detail-list-item ${link.properties["miklink:linkType"]} ">
								<div class="link ${link.properties["miklink:browser"]}">
								
									<a target="_blank" href="${link.properties["miklink:url"]}" class="theme-color-1" target="${link.name}" id="${link.properties["miklink:browser"]}" >${link.name}</a>																
								
								</div>
								<div class="actions">
									<#if canEditLink><a href="/share/page/site/${site}/edit-metadata?nodeRef=${link.nodeRef}" class="theme-color-1 details"  title="Link's details"></a></#if>
								</div>
							</div>
							</#if>
						</#list>
					</#if>
				</table>
		</div>
	</div>
</div> 
</html>