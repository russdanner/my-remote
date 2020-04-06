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

<#macro toolSupport>
  <#if siteContext.overlayCallback??>
   <script src="/studio/static-assets/libs/requirejs/require.js"
           data-main="/studio/overlayhook?site=NOTUSED&page=NOTUSED&cs.js"></script>
   <script>document.domain = "${Request.serverName}"; </script>
   </#if>
</#macro>

<#macro cstudioOverlaySupport>
  <@toolSupport />
</#macro>

<#macro componentAttr path="" ice=false iceGroup="">
  <#if siteContext.overlayCallback??>data-studio-component-path="${path}" data-studio-component="${path}" 
    <#if ice==true>
      <@iceAttr path=path iceGroup=iceGroup/>
    </#if>
  </#if> 
</#macro>

<#macro componentContainerAttr target objectId="">
    <#if siteContext.overlayCallback??> data-studio-components-target="${target}" data-studio-components-objectId="${objectId}"</#if>
</#macro>

<#macro iceAttr iceGroup="" path="" label="">
   <#if label == "">
      <#if iceGroup == "" >
        <#assign label = path />
      <#else>
        <#assign label = iceGroup />
      </#if>
   </#if>
   <#if siteContext.overlayCallback??> data-studio-ice="${iceGroup}" <#if path!="">data-studio-ice-path="${path}"</#if> data-studio-ice-label="${label}"</#if>
</#macro>


<#macro ice id="" component="" componentPath="">
    <#if siteContext.overlayCallback??>
        <div data-studio-ice="${id}" ></div>
    </#if>
</#macro>


<#macro draggableComponent id="" component="" componentPath="">
    <#if siteContext.overlayCallback??>
        <#if id != "" && component == "" && componentPath == "">
            <@ice id=id>
	            <div id='${id}' class='cstudio-draggable-component'><#nested></div>
	        </@ice>
        <#elseif id == "" && componentPath == "">
            <@ice component=component>
            	<div id="cstudio-component-${component.key}" class='cstudio-draggable-component'><#nested></div>
            </@ice>
        <#elseif id == "" && component == "">
            <@ice componentPath=componentPath>
            	<div id="cstudio-component-${componentPath}" class='cstudio-draggable-component'><#nested></div>
            </@ice>
        </#if>
    <#else>
        <#nested>
    </#if>
</#macro>


<#macro componentZone id="">
	<div class="cstudio-component-zone" id="zone-${id}">
		<@ice id=id>
			<#nested>
		</@ice>
	</div>
</#macro>