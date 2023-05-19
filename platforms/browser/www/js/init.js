(function($){
  $(function(){
    $('.tabs').tabs({"swipeable":true});
    $('#searchForm').submit(function(event) {
      event.preventDefault(); // Prevenir el envío del formulario
      var groupQuery = $('#groupInput').val();
      var url = "https://musicbrainz.org/ws/2/artist/?query=" + groupQuery + "&limit=10"; // Ejemplo de URL con parámetros de búsqueda

      $.ajax({
        method: "GET",
        url: url,
        dataType: "json"
      }).done(function (data) {
        var groupResults = data.artists; // Utiliza el objeto 'data' devuelto por la solicitud AJAX

        var resultsList = $('#resultsList');
        resultsList.empty();

        for (var i = 0; i < groupResults.length; i++) {
          var group = groupResults[i];
          var groupId = group.id;
          var groupName = group.name;
          var listItem = $('<li>').text(groupName).attr('data-group-id', groupId); // Agregar el atributo data-group-id al elemento de la lista
          resultsList.append(listItem);
        }

        // Evento de clic en los elementos de la lista
        resultsList.on('click', 'li', function() {
          var groupId = $(this).data('group-id'); // Obtener el ID del grupo seleccionado

          // Realizar otra solicitud AJAX para obtener los detalles del grupo por su ID
          var groupDetailsUrl = "https://musicbrainz.org/ws/2/artist/" + groupId;

          $.ajax({
            method: "GET",
            url: groupDetailsUrl,
            dataType: "json"
          }).done(function (groupData) {
            // Aquí puedes acceder a los detalles del grupo en el objeto 'groupData'
            var groupDetails = groupData; // Por ejemplo, asignamos todos los detalles a una variable

            // Cargar y mostrar los detalles del grupo en la pestaña 2
            var tabContent2 = $('#test-swipe-2');
            tabContent2.empty(); // Limpiar el contenido existente en la pestaña 2

            // Crear elementos HTML para mostrar los detalles
            var groupContainer = $('<div>').addClass('group-details');
            var groupName = $('<h2>').addClass('class-name').text(groupDetails.name);
            var groupType = $('<p>').addClass('class-type').text('Tipo: ' + groupDetails.type);
            var groupCountry = $('<p>').addClass('class-country').text('País: ' + groupDetails.country);

            if (groupDetails.type == "Person") {
            var gender = $('<p>').addClass('class-gender').text('Género: ' + groupDetails.gender);
            }

            // Agregar los elementos al contenedor principal
            groupContainer.append(groupName, groupType, groupCountry, gender);
            tabContent2.append(groupContainer);

            $('.tabs').tabs('select', 'test-swipe-2'); // Cambiar a la pestaña 2
          }).fail(function () {
            alert("AJAX request failed! ERROR");
          });
        });
      }).fail(function () {
        alert("AJAX request failed! ERROR");
      });
    });
  }); // end of document ready
})(jQuery); // end of jQuery name space

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    //document.getElementById('deviceready').classList.add('ready');
}


