var app = angular.module('schedulerDashboard', [
	'dashboardControllers',
	'dashboardServices',
	'ngRoute'
	//'ui.bootstrap'
]);
//Global Functions available on pages
app.run(function($rootScope) {

	$(function () {
      $('.saps-datepicker').datetimepicker({
          format: 'DD/MM/YYYY'
      });
	});

	$rootScope.switchVisibility = function() {
		for(var index=0; index < arguments.length; index++){
			
			var elementId = arguments[index];
			console.log('Changing visibility for : '+elementId);
			if(	"string" === typeof elementId){
				var element = $("#"+elementId);
			    if(element.hasClass( "sb-hidden" )){
			    	element.removeClass("sb-hidden");
			    }else{
			    	element.addClass("sb-hidden");
			    }
			}
		}
	};
	$rootScope.validateDate = function (date){

	    re = /^[0-3]?[0-9]\/[01]?[0-9]\/[12][90][0-9][0-9]$/

	    if(date == '' || !date.match(re)) {
	      console.log('Invalid date');
	      return false;
	    }
	    console.log('Valid date');
	    return true;
	};
	$rootScope.parseDate = function (date) {
		
		var arrDate = date.split("/");

		// console.log("arrDate: "+JSON.stringify(arrDate))

		var d = parseInt(arrDate[0], 10),
		    m = parseInt(arrDate[1], 10),
		    y = parseInt(arrDate[2], 10);
		// console.log("Creating date: d"+d+" - m"+m+" - y"+y)
		return new Date(y, m - 1, d);
	};

	function loadDefaultLang(){
		$rootScope.languageOptions = langLoader.getLangAvailables();
		//console.log("Lang opt "+JSON.stringify($rootScope.languageOptions))
		var lang = langLoader.getDefault();
		if(lang !== undefined){
			console.log("Lang chosen "+JSON.stringify($rootScope.languageOptions[langLoader.defaultIndex]))
			$rootScope.languageContent = lang.content;
			$rootScope.languageChosen = $rootScope.languageOptions[langLoader.defaultIndex];
		}
	}
	loadDefaultLang();

	$rootScope.heatMap = {
		transparency:0.5,
		colours:[
			{"minValue":undefined,"maxValue":0,"r":255,"g":255,"b":178},
			{"minValue":1,"maxValue":300,"r":254,"g":217,"b":118},
			{"minValue":301,"maxValue":500,"r":254,"g":178,"b":76},
			{"minValue":501,"maxValue":700,"r":253,"g":141,"b":60},
			{"minValue":701,"maxValue":900,"r":240,"g":59,"b":32},
			{"minValue":901,"maxValue":undefined,"r":189,"g":0,"b":38},
		]
	}
	
});

app.constant("appConfig", {
	"urlSapsService":"http://localhost:8080/",
	"submissionPath":"images",
	"regionPath":"regions",
	"regionDetailsPath":"regions/details",
	"emailPath":"email",
	"LOGIN_SUCCEED":"login.succeed",
	"LOGIN_FAILED":"login.faild",
	"LOGOUT_SUCCEED":"logout.succed",
	"DEFAULT_SB_VERSION":"version-001",
	"DEFAULT_SB_TAG":"tag-001",
	"SATELLITE_OPTS":[
		{"label":"Landsat 5", "value":"landsat_5"},
		{"label":"Landsat 7", "value":"landsat_7"},
		{"label":"Landsat 8", "value":"landsat_8"}
	],
	"MODAL_OPENED":"modalOpened",
	"MODAL_CLOSED":"modalClosed"
});


app.config(function($logProvider){
  $logProvider.debugEnabled(true);
});
app.config(function($routeProvider){

	var checkUser = function($location, AuthenticationService){
		if(!AuthenticationService.getCheckUser()){
			$location.path("/");
		}
	}

	$routeProvider
	// route for the home page
	.when('/', {
	    templateUrl : '/pages/login.html',
	})
	.when('/new-user', {
	    templateUrl : '/pages/create_user.html',
	})
	.when('/regions-map', {
		resolve: {
			"check": checkUser
		},
	    templateUrl : '/pages/regions_map.html',
	})
	.when('/submissions-list', {
		resolve: {
			"check": checkUser
		},
	    templateUrl : '/pages/submissions_list.html',
	})
	.when('/test', {
		resolve: {
			"check": checkUser
		},
	    templateUrl : '/pages/teste.html',
	})
	.when('/help', {
		resolve: {
			"check": checkUser
		},
	    templateUrl : '/pages/help.html',
	})
	.otherwise({
        redirectTo: '/'
     });
});

app.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});
