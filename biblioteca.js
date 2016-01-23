

function load_map(lat,lon) {

    var myLatlng = new google.maps.LatLng(lat, lon);

    var myOptions = {
        zoom: 12,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($("#map_canvas").get(0), myOptions);

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
        //alert("Dentro del addListener de load_map, lat y long:"+posicion.lat()+posicion.lng());
        mostrarClima(posicion.lat(),posicion.lng());
    });  
}


function geocodeResult(results, status) {

    // Verificamos el estatus
    if (status == 'OK') {
        // Si hay resultados encontrados, centramos y repintamos el mapa
        // esto para eliminar cualquier pin antes puesto
        var mapOptions = {
            center: results[0].geometry.location,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        map = new google.maps.Map($("#map_canvas").get(0), mapOptions);
        
        // fitBounds acercará el mapa con el zoom adecuado de acuerdo a lo buscado
        map.fitBounds(results[0].geometry.viewport);
        
        // Dibujamos un marcador con la ubicación del primer resultado obtenido
        marker = new google.maps.Marker({
            position: results[0].geometry.location, 
            map: map,
            draggable: true, 
            animation: google.maps.Animation.DROP
        });

        marker.setIcon('https://dl.dropboxusercontent.com/u/20056281/Iconos/male-2.png');

        infoWindow = new google.maps.InfoWindow();

        infoMark(marker);
        var posicion = marker.getPosition();
        //alert("Dentro del addListener de load_map, lat y long:"+posicion.lat()+posicion.lng());
        mostrarClima(posicion.lat(),posicion.lng());

        google.maps.event.addListener(marker, 'mouseup', function(){
           
            infoMark(marker);
            var posicion = marker.getPosition();
            //alert("Dentro del addListener de load_map, lat y long:"+posicion.lat()+posicion.lng());
            mostrarClima(posicion.lat(),posicion.lng());
        });

    } 

    else {
        // En caso de no haber resultados o que haya ocurrido un error
        // lanzamos un mensaje con el error
        //alert("Geocoding no tuvo éxito debido a: " + status);
    
        alert("Ciduad Inexistente!!");

    }

    $("#address").val("");
}



//Función que conecta con la api de clima
function mostrarClima(latitud,longitud){




    //alert("Dentro de muestra clima!!"); Entra!!!!

    var config = "?units=si&lang=es"; //units=si o units=ca????

    var url="https://api.forecast.io/forecast/18d55f569c782af0f78c9b4156afeb37/" + latitud + "," + longitud + config;

    
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: function (datoOrigen) {
        data = JSON.stringify(datoOrigen);
        clima = JSON.parse(data); 
        $("#currently-summary").html("Descripción: " + clima.currently.summary);
        $("#currently-temperature").html("Temperatura: " + clima.currently.temperature + " ºC");
        $("#currently-apparentTemperature").html("Sensación Térmica: " + clima.currently.apparentTemperature + " ºC");
        $("#currently-windSpeed").html("Velocidad del Viento: " + clima.currently.windSpeed + " km/h");
        $("#currently-windBearing").html("Orientación del Viento: " + clima.currently.windBearing + "º :: " + orientacion((parseInt(clima.currently.windBearing))));
        $("#currently-humidity").html("Humedad: " + clima.currently.humidity*100 +"%");
        $("#currently-dewPoint").html("Punto de Rocio: " + clima.currently.dewPoint + " ºC");
        $("#currently-pressure").html("Presión: " + clima.currently.pressure + " hPa");
        
        //$("#currently-windSpeed").html("Velocidad del Viento: " + clima.currently.windSpeed);
       
      },
      error: function(){
            alert("AJAX mal recibido..");
      }
      
    });

    function orientacion(grados){
            alert(grados);
            switch (grados){
                case grados>0 && grados<=90:
                    return "NorEste";
                break;
                case grados>90 && grados<180:
                    return "SudEste";
                break;
                case (grados>180 && grados<=270):
                    return "SudOeste";
                break;                
                case (grados>270 && grados<=360):
                    return "NorOeste";
                break;
                default:
                    return "Error de Coordenadas!";
            }
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




