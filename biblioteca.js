

function load_map(lat,lon) {

    var myLatlng = new google.maps.LatLng(lat, lon);

    var myOptions = {
        zoom: 12,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($("#map_canvas").get(0), myOptions);

    var input =(document.getElementById('address'));

    var types = document.getElementById('type-selector');

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    
    marker = new google.maps.Marker({
        position: myLatlng, 
        title: 'Usted está aquí!', 
        map: map,
        draggable: true, 
        animation: google.maps.Animation.DROP
    });

    marker.setIcon('https://dl.dropboxusercontent.com/u/20056281/Iconos/male-2.png');

    infoWindow = new google.maps.InfoWindow();

    infoMark(marker);

    google.maps.event.addListener(marker, 'mouseup', function(){
        infoMark(marker);
        var posicion = marker.getPosition();
        mostrarClima(posicion.lat(),posicion.lng());
    });  


    /* codigo de autocompletado*/
    var autocomplete = new google.maps.places.Autocomplete(input);
    
    autocomplete.bindTo('bounds', map);


    autocomplete.addListener('place_changed', function() {
        
        var place = autocomplete.getPlace();
        
        if (!place.geometry) {
          window.alert("Lugar o ubicación erronea!!!");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } 
        
        marker.setPosition(place.geometry.location);

        var posicion =place.geometry.location;

        map.setZoom(12);

        infoMark(marker);

        mostrarClima(posicion.lat(),posicion.lng());
    });

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      function setupClickListener(id, types) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
          autocomplete.setTypes(types);
        });
    }// fin de la funcion AddListener

      setupClickListener('changetype-all', []);
      setupClickListener('changetype-address', ['address']);
      setupClickListener('changetype-establishment', ['establishment']);
     // setupClickListener('changetype-geocode', ['geocode']);

}// Fin de la funcion load map



//Función que conecta con la api de clima
function mostrarClima(latitud,longitud){


    var config = "?units=si&lang=es"; 

    var url="https://api.forecast.io/forecast/18d55f569c782af0f78c9b4156afeb37/" + latitud + "," + longitud + config;

    
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: function (datoOrigen) {
        data = JSON.stringify(datoOrigen);
        clima = JSON.parse(data); 
        $("#currently-summary").html(clima.currently.summary);
        $("#currently-temperature").html(redondear(clima.currently.temperature) + " ºC");
        $("#currently-apparentTemperature").html(redondear(clima.currently.apparentTemperature) + " ºC");
        $("#currently-windSpeed").html(redondear(clima.currently.windSpeed) + " km/h");
        $("#currently-windBearing").html(orientacion(clima.currently.windBearing));
        $("#currently-humidity").html(Math.round(clima.currently.humidity*100) +" %");
       // $("#currently-dewPoint").html("Punto de Rocio: " +redondear(clima.currently.dewPoint) + " ºC");
        $("#currently-pressure").html(Math.round(clima.currently.pressure) + " hPa");
               
      },
      error: function(){
            alert("AJAX mal recibido..");
      }
      
    });


    function redondear(numero){

        return numero.toFixed(1);
    }

    function orientacion(grados){


        if((grados>=0 && grados<6)|| (grados>354 && grados<=360))
            respuesta="N (Norte)";

        if(grados>=6 && grados<17)
            respuesta="NpE (Norte por Este)";

        if(grados>=17 && grados<=28)
            respuesta="NNE (Nornoreste)";

        if(grados>28 && grados<=39)
            respuesta="NEpN (Noreste por Norte)";

        if(grados>39 && grados<51)
            respuesta="NE (Noreste)";
        
        if(grados>=51 && grados<62)
            respuesta="NEpE (Noreste por Este)";

        if(grados>=62 && grados<=73)
            respuesta="ENE (Estenoreste)";
                        
        if(grados>73 && grados<=84)
            respuesta="EpN (Este por Norte)";
                            
        if(grados>84 && grados<96)
            respuesta="E (Este)";

        if(grados>=96 && grados<107)
            respuesta="EpS (Este por sur)";

        if(grados>=107 && grados<=118)
            respuesta="ESE (Estesureste)";

        if(grados>118 && grados<=129)
            respuesta="SEpE (Sureste por Este)";

        if(grados>129 && grados<141)
            respuesta="SE (Sureste)";

        if(grados>=141 && grados<150)
            respuesta="SEpS (Sureste por Sur)";

        if(grados>=150 && grados<=163)
            respuesta="SSE (Sursureste)";

        if(grados>163 && grados<=174)
            respuesta="SpE (Sur por Este)";

        if(grados>174 && grados<186)
            respuesta="S (Sur)";

        if(grados>=186 && grados<197)
            respuesta="SpO (Sur por Oeste)";

        if(grados>=197 && grados<=208)
            respuesta="SSO (Sursuroste)";

        if(grados>208 && grados<=219)
            respuesta="SOpS (Suroeste por Sur)";
        
        if(grados>219 && grados<231)
            respuesta="SO (Suroeste)";
        
        if(grados>=231 && grados<242)
            respuesta="SOpO (Suroeste por Oeste)";
        
        if(grados>=242 && grados<=253)
            respuesta="OSO (Oestesuroeste)";
        
        if(grados>253 && grados<=264)
            respuesta="OpS (Oeste por Sur)";
        
        if(grados>264 && grados<276)
            respuesta="O (Oeste)";
        
        if(grados>=276 && grados<287)
            respuesta="OpN (Oeste por Norte)";

        if(grados>=287 && grados<=298)
            respuesta="ONO (Oestenoroeste)";

        if(grados>298 && grados<=309)
            respuesta="NOpO (Noroeste por Oeste)";

        if(grados>309 && grados<321)
            respuesta="NO (Noroeste)";
        
        if(grados>=321 && grados<332)
            respuesta="NOpN (Noroeste por Norte)";

        if(grados>=332 && grados<=343)
            respuesta="NNO (Nornoroeste)";

        if(grados>343 && grados<=354)
            respuesta="NpO (Norte por Oeste)";

        if(grados<0 || grados>360)
            respuesta="Error de Coordenadas!";

        return respuesta;    
    }

}



function infoMark(marker) {
        
    var markerLatLng = marker.getPosition();
    
    infoWindow.setContent([
    'Coordenadas de la posición actual'+"<br/>",
     "Lat:"+markerLatLng.lat(),
     ' y ',
     "Lon:"+markerLatLng.lng(),
     "<br/>"+'Arrastrar para actualizar la posición'
    ].join(''));

    infoWindow.open(map, marker);
}




