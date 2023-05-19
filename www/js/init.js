(function ($) {
  $(function () {
    $(".tabs").tabs({ swipeable: true });
    $("#searchForm").submit(function (event) {
      event.preventDefault(); // Prevenir el envío del formulario
      var groupQuery = $("#groupInput").val();
      var url =
        "https://musicbrainz.org/ws/2/artist/?query=" +
        groupQuery +
        "&limit=10"; // Ejemplo de URL con parámetros de búsqueda

      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
      })
        .done(function (data) {
          var groupResults = data.artists; // Utiliza el objeto 'data' devuelto por la solicitud AJAX

          var resultsList = $("#resultsList");
          resultsList.empty();

          for (var i = 0; i < groupResults.length; i++) {
            var group = groupResults[i];
            var groupId = group.id;
            var groupName = group.name;
            var listItem = $("<li>")
              .text(groupName)
              .attr("data-group-id", groupId); // Agregar el atributo data-group-id al elemento de la lista
            resultsList.append(listItem);
          }

          resultsList.on("click", "li", function () {
            var groupId = $(this).data("group-id"); // Obtener el ID del grupo seleccionado

            var groupDetailsUrl =
              "https://musicbrainz.org/ws/2/artist/" + groupId;

            $.ajax({
              method: "GET",
              url: groupDetailsUrl,
              dataType: "json",
            })
              .done(function (groupData) {
                var groupDetails = groupData;
                console.log(groupDetails);
                var tabContent2 = $("#test-swipe-2");
                tabContent2.empty();

                var groupContainer = $("<div>").addClass("group-details");
                var groupName = $("<h2>")
                  .addClass("class-name")
                  .text(groupDetails.name);
                var groupType = $("<p>")
                  .addClass("class-type")
                  .text("Tipo: " + groupDetails.type);
                var groupCountry = $("<p>")
                  .addClass("class-country")
                  .text(
                    "País: " +
                      groupDetails.country +
                      " - " +
                      groupDetails.area.name
                  );

                if (groupDetails.type == "Person") {
                  var gender = $("<p>")
                    .addClass("class-gender")
                    .text("Género: " + groupDetails.gender);
                }

                groupContainer.append(
                  groupName,
                  groupType,
                  groupCountry,
                  gender
                );

                var albumUrl =
                  "https://musicbrainz.org/ws/2/release-group?artist=" +
                  groupId +
                  "&type=album";

                $.ajax({
                  method: "GET",
                  url: albumUrl,
                  dataType: "json",
                })
                  .done(function (albumData) {
                    var albums = albumData["release-groups"];

                    var albumsContainer =
                      $("<div>").addClass("albums-container");
                    albumsContainer.empty();
                    var tituloAlbumsContainer = albumsContainer.append(
                      $("<h2>Listado de álbumes</h2>")
                    );
                    var albumsList = $("<ul>").addClass("albums-list");

                    for (var i = 0; i < albums.length; i++) {
                      var album = albums[i];
                      var albumTitle = album.title;
                      var albumListItem = $("<li>").text(albumTitle);
                      albumsList.append(albumListItem);
                    }

                    albumsContainer.append(albumsList);
                    tabContent2.empty().append(groupContainer, albumsContainer);

                    $(".tabs").tabs("select", "test-swipe-2");
                  })
                  .fail(function () {
                    alert("Error al obtener los álbumes del artista");
                  });
              })
              .fail(function () {
                alert("AJAX request failed! ERROR");
              });
          });
        })
        .fail(function () {
          alert("AJAX request failed! ERROR");
        });
    });
  });
})(jQuery);

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
}
