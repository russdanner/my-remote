<#--
 - Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU General Public License as published by
 - the Free Software Foundation, either version 3 of the License, or
 - (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU General Public License for more details.
 -
 - You should have received a copy of the GNU General Public License
 - along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<#macro renderComponents model>
 
 	<#assign componentCount = model['count(//rteComponents//item/id)'] />

	<#if componentCount == 1 > 
	    <#assign curComponentPath = ""+model['//rteComponents//item/contentId'] />
		<div style='display:none' id='o_${model['//rteComponents//item/id']}'>
			<#-- @renderComponent component=model['//rteComponents//item'] /-->
			<@renderComponent componentPath=curComponentPath />
		</div>	

		 <#assign item = siteItemService.getSiteItem(curComponentPath) />
		 <@renderComponents model=item />

	<#elseif (componentCount > 1) == true >
		<#assign components = model['//rteComponents//item'] />
		<#list components as c>
	        <#if c.id??>
	            <div style='display:none' id='o_${c.id}'>
					<#assign curComponentPath = "" + c.contentId />
	                 <@renderComponent componentPath=curComponentPath />
	            </div>
				
				 <#assign item = siteItemService.getSiteItem(curComponentPath) />
				 <@renderComponents model=item />
	        </#if>
		</#list>
	</#if>
</#macro>

<@renderComponents model=model />