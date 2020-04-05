$(document).ready(function() {
	

	$("#reportlist_scroll").mCustomScrollbar({
		scrollButtons : {
			enable : true
		},
		theme : "dark-thin",
		autoDraggerLength : false,
		advanced : {
			updateOnContentResize : true,
			updateOnBrowserResize : false
		}
	});
	pageLayout = $('body').layout({
		defaults : {
			padding : 0,
			margin : 0
		},
		north : {
			size : 80,
			spacing_open : 0,
			closable : false,
			resizable : false
		},
		west : {
			size : 300,
			spacing_closed : 22,
			togglerLength_closed : 140,
			togglerAlign_closed : "center",
			togglerContent_closed : "E<BR>n<BR>v<BR>i<BR>r<BR>o<BR>n<BR>s",
			togglerTip_closed : "Open & Pin Reports",
			sliderTip : "Slide Open Reports",
			slideTrigger_open : "mouseover"
		}
	});
    loadProjectList();
})

var listTemplate = '<li class="active" dir="${dir}" title="${name}" id="${li_id}">'
		+ '<a href="#${anchor_id}" title="${name}" id="job_${anchor_id}">'
		+ '<span class="jobid ${jobid}">${jobid}</span>'
		+ '<div class="details">'
		+ '<p>${name}</p>'
		+ '<span>${msToFormatedDateStr(startTime, "dd-MM-yy HH:MM")}</span>'
		+ '</div>' + '</a>' + '</li>';

var projectListTemplate = '<li class="active">' 
                    + '<a href="#${envr}">'    
					+ '<div class="details2">'
					+ '<p> Environment: ${envr}</p>'
					+'</div> </a> </li>'    

var projectListTemplate2 = '<li class="active">' 
					+ '<a href="#${grp}">'    
					+ '<div class="details2">'
					+ '<p> Group: ${grp}</p>'
					+'</div> </a> </li>'   

var tileTemplate = '<div class="dashboardTile">'
					+ '<p>${group}${subgroup}</p>'
					+ '<a href="./dashboard.htm?job=${jobpath}">'
					+  '<p>${project} (${env})</p>'
					+  '<span>${msToFormatedDateStr("1584821367594","dd-MM-yy HH:MM")}</span>'
					+'</a></div>'

function loadProjectList() {


		 $.getJSON("./dashboards.json", function(data) {

		var treports = data;
		var size = treports.dashboards.length;
		
		const groups = new Set()
		treports.dashboards.forEach(dashboard => {
			groups.add(dashboard.group)	
		});

		const environments = new Set()
		environments.add('All');
		treports.dashboards.forEach(dashboard => {
			environments.add(dashboard.environment)	
		});

		var mygrps = [...groups]
		var myenv = [...environments]
		mygrps.sort((a,b)=> {
			if (a<b) return -1;
			else if(a>b) return 1;
			else return 0;
		})

		myenv.sort((a,b)=> {
			if (a < b) return -1;
			else if (a > b) return 1;
			else return 0;
		})

		$.each(myenv, function(i,item) {
			$.tmpl(projectListTemplate,{"envr" :item}).appendTo('#reportlist')
		});

		$.each(mygrps, function(i,item) {
			$.tmpl(projectListTemplate2,{"grp" :item}).appendTo('#reportlist')
		});

		$.each(treports.dashboards, function(i, item) {
			item['group'] = item.group;
			if (item.subgroup) {
				if (item.subgroup.substring(0,1) !== '/')
				 { item['subgroup'] = '/' + item.subgroup;}
			}
			else {
				item['subgroup'] = ''
			}
			item['jobpath'] =item.dir
			if (item.project) {
				item['project'] = item.project
			}
			else {
				item['project'] ='Project'
			}
			item['env'] = item.environment
			$.tmpl(tileTemplate, item).appendTo('#dashboardTileContainer')
		});

		$('#reportlist li').click(function() {
			$('#details2').html('');
			if (($(this).hasClass('selected'))) {
				return 0;
			}
			window.location.href = $(this).find("a").attr('href');
			var curSelceteReport = $('#reportlist li.selected');
			if (curSelceteReport) {
				$(curSelceteReport).removeClass("selected");
				$(curSelceteReport).addClass("active");
			}
			$(this).addClass("selected");
			$(this).removeClass("active");
			$('#dashboardTileContainer').html('');
			$.each(treports.dashboards, function(i, item) {

				if ((item.environment === window.location.hash.substring(1).trim()) 
					|| (window.location.hash.substring(1) ==='All') 
					|| (item.group === window.location.hash.substring(1).trim()) ) {
					item['group'] = item.group;
					if (item.subgroup) {
						if (item.subgroup.substring(0,1) !== '/')
				 		{ item['subgroup'] = '/' + item.subgroup;}
					}
					else {
						item['subgroup'] = ''
					}
					item['jobpath'] =item.dir
					if (item.project) {
						item['project'] = item.project
					}
					else {
						item['project'] ='Project'
					}
					$.tmpl(tileTemplate, item).appendTo('#dashboardTileContainer')
				}
			});
	


		});

	});

}
