$(document).ready(function(error) {


	function addMap(src) {
		var s = document.createElement('script');
		s.setAttribute('src', src)
		document.body.appendChild(s);
	}


    addMap('https://maps.googleapis.com/maps/api/js?key=AIzaSyDI49E-6C3QN-Tegec6XYlWaK79RN2cKlM&libraries=drawing,places&callback=initMap');


    $('.modal').modal();
    $('select').formSelect();

})

	Vue.component('sidebar', {
		template: `<div>

						<language-card v-for="l in languagesAdded" lan="{l}"></language-card>
				   </div>`
	});



	Vue.component('better-card', {
    	props: ['lan', 'shapes', 'slan'],
		template: `  <div class="row" >
					    <div class="col s12">
					      <div class="card blue" v-bind:class="{'darken-4': lan == slan}">
					        <div class="card-content white-text">
					          <span class="card-title">{{lan}}<a v-if="lan != slan" class="waves-effect waves-light orange darken-1 btn" v-on:click="$emit('select-langauge', lan)">Select</a></span>
					         <p>Contributions</p>
		
					          
					          <ul class="collection">
					          	<li class="collection-item avatar" v-for="p in shapes">
					          		<a href="#!" v-on:click="p.moveTo()">
						          		<i class="material-icons circle">adjust</i>
						          		<span class="title">{{p.type}}</span>
						          		<p>Contexts not completed</p>
					          		</a>
								    <a href="#!" class="secondary-content" v-on:click="p.deleteShape()"><i class="material-icons">delete</i></a>
					          	</li>
						        
					          </ul>

					        </div>
					        <div class="card-action">
					          
					        </div>
					      </div>
					    </div>
					  </div>
           `
	});

    Vue.component('language-marker', {
    	props: ['item'],
		template: '<li>Another Test</li>'
	});

    var LangaugeData = ['English', 'Spanish', 'German']


    var vm = new Vue({

    	//app initial
    	data: {
    		languages: LangaugeData,
    		langaugePicked: null,
    		languagesAdded: [],
    		selected: '',
    		allData: {},
    	},
    	methods: {
    		addLanguage: function() {
    			let s = this.selected;
    			if (s != '' && this.languagesAdded.indexOf(s) < 0) {
    				this.languagesAdded.push(s);
    				Vue.set(vm.allData, s, []);
    				this.selectLanguage(s);
    			}
    		},
    		selectLanguage: function(l) {
					let lastSelect = this.langaugePicked;
					this.langaugePicked = l;
					this.drawLang(lastSelect, l);
    		},
    		selectPolygon: function(move) {
    			move(26.2034,-98.2300);
				},
				drawLang: function(lastSelect, newSelect) {
					this.allData[lastSelect].forEach( function(s) {
						s.erase();
					});
					this.allData[newSelect].forEach( function(s) {
						s.draw();
					});

				}
    	},
		el: '#langscapeApp',
	});


function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}



//GOOGLE MAP INITILIZE
function initMap() {

		var markers = [];
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });


        function moveToLocation(lat, lng){
		    var center = new google.maps.LatLng(lat, lng);
		    map.panTo(center);
		}

        var drawingManager = new google.maps.drawing.DrawingManager({
          //drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'circle', 'polygon', 'rectangle']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
          circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: .3,
            strokeWeight: 5,
            clickable: true,
            editable: true,
            zIndex: 1
          },
          polygonOptions: {
          	clickable: true,
          	editable: true,
          	draggable:true
          }
        });

        var mapDiv = document.getElementById('map');
        google.maps.event.addDomListener(mapDiv, 'click', function() {
          if (vm.languagesAdded.length === 0) {
          	alert('You need to Add a Language');
          }
        });





        //add update funcitons for when the circles are updated
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
		  if (event.type == 'circle') {
		  	let count = vm.allData[vm.langaugePicked].length + 1;
		  	let lattitude = event.overlay.getCenter().lat();
		  	let longitude = event.overlay.getCenter().lng();
				let r = event.overlay.getRadius();
				let newId = makeid();
		  	let c = {
					id: newId,
		  		lat: lattitude,
		  		lng: longitude,
		  		radius: r,
					type: 'circle',
					shape: event.overlay,
		  		visible: true,
		  		draw: function() {
		  			var circle = new google.maps.Circle({
		  				fillColor: '#ffff00',
			            fillOpacity: .3,
			            strokeWeight: 5,
			            map: map,
			            center: {lat: lattitude, lng: longitude},
			            radius: r,
			            clickable: true,
           				editable: true,

						});
							this.shape = circle;				
		  		},
		  		deleteShape: function() {
						for (var i = 0; i< vm.allData[vm.langaugePicked].length; i++) {
							if (this.id === vm.allData[vm.langaugePicked][i].id) {
								vm.allData[vm.langaugePicked].splice(i,1);
								this.shape.setMap(null);
							}
						}
					},
					erase: function() {
						this.shape.setMap(null);
					},
		  		moveTo: function() {
		  			moveToLocation(this.shape.getCenter().lat(), this.shape.getCenter().lng())
		  		}
		  	}
		    Vue.set(vm.allData[vm.langaugePicked], vm.allData[vm.langaugePicked].length, c);
		    // vm.allData = Object.assign({},vm.allData, {})
		  } else {
		  	let verticesData = event.overlay.getPath();
		  	// Iterate over the vertices.
			  for (var i =0; i < verticesData.getLength(); i++) {
			    var xy = verticesData.getAt(i);
			    console.log('Coordinate ' + i + ':' + xy.lat() + ',' + xy.lng() );
			  }
				let newId = makeid();
				let s = {
						id: newId,
						shape: event.overlay,
						vertices: event.overlay.getPath(),
						visible: true,
						type: 'polygon',
						draw: function() {
							var polygon = new google.maps.Polygon({
								fillColor: '#ffff00',
										fillOpacity: .3,
										strokeWeight: 5,
										map: map,
										paths: this.shape.getPath(),
										clickable: true,
										editable: true,
										draggable:true
							});
								this.shape = polygon;				
						},
						deleteShape: function() {
							for (var i = 0; i< vm.allData[vm.langaugePicked].length; i++) {
								if (this.id === vm.allData[vm.langaugePicked][i].id) {
									vm.allData[vm.langaugePicked].splice(i,1);
									this.shape.setMap(null);
								}
							}
						},
						erase: function() {
							this.shape.setMap(null);
						},
						moveTo: function() {
							var xy = this.shape.getPath().getAt(0);
							moveToLocation(xy.lat(), xy.lng());
						}

				}
				 Vue.set(vm.allData[vm.langaugePicked], vm.allData[vm.langaugePicked].length, s);
		  }
		});



        //This is where the data is suppose to log gglog
        map.data.loadGeoJson('convertcsv.json');














        // Create the search box and link it to the UI element.
  		var input = /** @type {HTMLInputElement} */( document.getElementById('pac-input'));
  		map.controls[google.maps.ControlPosition.LEFT_TOP].push(input);

        var searchBox = new google.maps.places.SearchBox(
		    /** @type {HTMLInputElement} */(input));

		  // [START region_getplaces]
		  // Listen for the event fired when the user selects an item from the
		  // pick list. Retrieve the matching places for that item.
		  google.maps.event.addListener(searchBox, 'places_changed', function() {
		    var places = searchBox.getPlaces();

		    if (places.length == 0) {
		      return;
		    }
		    for (var i = 0, marker; marker = markers[i]; i++) {
		      marker.setMap(null);
		    }

		    // For each place, get the icon, place name, and location.
		    markers = [];
		    var bounds = new google.maps.LatLngBounds();
		    for (var i = 0, place; place = places[i]; i++) {
		      var image = {
		        url: place.icon,
		        size: new google.maps.Size(71, 71),
		        origin: new google.maps.Point(0, 0),
		        anchor: new google.maps.Point(17, 34),
		        scaledSize: new google.maps.Size(25, 25)
		      };

		      // Create a marker for each place.
		      var marker = new google.maps.Marker({
		        map: map,
		        icon: image,
		        title: place.name,
		        position: place.geometry.location
		      });

		      markers.push(marker);

		      bounds.extend(place.geometry.location);
		    }

		    map.fitBounds(bounds);
		  });
		  // [END region_getplaces]

		  // Bias the SearchBox results towards places that are within the bounds of the
		  // current map's viewport.
		  google.maps.event.addListener(map, 'bounds_changed', function() {
		    var bounds = map.getBounds();
		    searchBox.setBounds(bounds);
		  });
        drawingManager.setMap(map);
			}
			
			