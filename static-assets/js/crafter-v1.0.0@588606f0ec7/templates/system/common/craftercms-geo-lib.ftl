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

<#macro browserTimeOfDaySupport cookie=true>
</#macro>

<#function calculateSeason date=.now locale="">
	<#if siteContext.overlayCallback??>
		<#assign season = profile.season!"" />
	<#else>
		<#assign month = date?string("MMMM") />
		<#assign winter = 'December,January,February' />
		<#assign spring = 'March,April,May' />
		<#assign summer = 'June,July,August' />
		<#assign fall = 'September,October,November' />

	    <#assign season = 'unknown' />

		<#if winter?index_of(month) != -1>
		    <#assign season = 'Winter' />
		<#elseif spring?index_of(month) != -1 >
	        <#assign season = 'Spring' />
		<#elseif summer?index_of(month) != -1 >
		        <#assign season = 'Summer' />
		<#elseif fall?index_of(month) != -1 >
	        <#assign season = 'Fall' />
		</#if>
	</#if>
	
	<#return season>
</#function>


<#macro browserGeoLocationSupport cookie=true>
	<#if siteContext.overlayCallback??>
		<#assign browserCoords = profile.geo!"" />	
	<#else>
		<script  type="text/javascript">
		    var crafterCMS = (crafterCMS) ? crafterCMS : {};
			crafterCMS._BROWSERCOORDS_COOKIE_NAME = "crafterCMSbrowserCoords";
	
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
	  			   function( position ){
					   crafterCMS.browserCoods = position;
					   <#if cookie?? && cookie == true>
					   	   document.cookie = crafterCMS._BROWSERCOORDS_COOKIE_NAME + "=" 
						                   + position.coords.latitude + "%2C" 
										   + position.coords.longitude + "; path=/;";
					   </#if>
	  			   },
	  			   function( error ){
	  			      console.log( "Something went wrong: ", error );
	  			   },
	  			   {
	  			      timeout: (5 * 1000),
	  			      maximumAge: (1000 * 60 * 15),
	  			      enableHighAccuracy: true
	  			   }
	  			);

	  			var positionTimer = navigator.geolocation.watchPosition(
	  			   function( position ){
					   crafterCMS.browserCoods = position;
					   <#if cookie?? && cookie == true>
					   	   document.cookie = crafterCMS._BROWSERCOORDS_COOKIE_NAME + "=" 
						                   + position.coords.latitude + "%2C" 
										   + position.coords.longitude + "; path=/;";
					   </#if>
	  			   }
	  			);
			}
		</script>
		<#assign browserCoords = (Cookies["crafterCMSbrowserCoords"]!"")?replace("%2C", ",") />	
	</#if>
</#macro>