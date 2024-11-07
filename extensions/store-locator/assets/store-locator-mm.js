async function fetchStores() {
  let coordiantes = [];
  try {
    const response = await fetch("/apps/testproxy"); // api for the get request
    const data = await response.json();
    let storeList = ``;
    data.stores.forEach((store, index) => {
      if (store.storeName) {
        if (store.location.coordinates) {
          coordiantes.push({
            lng: store.location.coordinates[0],
            lat: store.location.coordinates[1],
          });
        }
        storeList += `<li class="single-store-data store-${index}">
              <div class="store-name">${store.storeName}</div>
              <div class="store-city-state">${store.city}, ${store.state}, ${store.zipCode}</div>
              <div class="store-country">${store.country}, ${store.state}</div>
          </li>`;
      }
    });

    storeList = "<ul>" + storeList + "</ul>";
    document.querySelector(".store-container-am").innerHTML = storeList;
  } catch (error) {
    console.error("Error fetching store data:", error);
  }

  return coordiantes;
}

// async function myMap_google() {
//   const longLat = await fetchStores();
//   console.log(longLat);
//   var mapProp = {
//     center: new google.maps.LatLng(33.988877, -118.311896),
//     zoom: 10,
//   };

//   var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

//   longLat.map((data) => {
//     marker = new google.maps.Marker({
//       position: data,
//       label: "A",
//       map: map,
//     });
//   });
// }

const svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="red" version="1.1" id="Capa_1" width="25px" height="25px" viewBox="0 0 395.71 395.71" xml:space="preserve"><g>
	<path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738   c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388   C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191   c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"/>
</g>
</svg>`;

const olaMaps = new OlaMapsSDK.OlaMaps({
  apiKey: "JiyFD7qzLOQyaDdL7Cm4E3TdzBRgYzSIObU8R3Gy",
});

const myMap = olaMaps.init({
  style:
    "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
  container: "olaMap",
  center: [77.61648476788898, 25.931423492103944],
  zoom: 4,
});

const popup = olaMaps
  .addPopup({ offset: [0, -30], anchor: "bottom" })
  .setHTML("<div>This is Popup</div>");

olaMaps
  .addMarker({
    offset: [0, 6],
    anchor: "bottom",
    color: "red",
    draggable: false,
  })
  .setLngLat([77.6196390456908, 12.93321052215299])
  .setPopup(popup)
  .addTo(myMap);

async function initMarker() {
  const longLat = await fetchStores();
  longLat.map((data) => {
    olaMaps
      .addMarker({
        offset: [0, 6],
        anchor: "bottom",
        color: "red",
        draggable: true,
      })
      .setLngLat([data.lng, data.lat])
      .setPopup(popup)
      .addTo(myMap);
  });
}

initMarker();

document
  .querySelector(".find-store-button")
  ?.addEventListener("click", async () => {
    let pinCode = document.querySelector(".zip-code-input").value;
    const response = await fetch(`/apps/testproxy?id=${pinCode}`); // api for the get request
    const data = await response.json();
    const olaMaps = new OlaMapsSDK.OlaMaps({
      apiKey: "JiyFD7qzLOQyaDdL7Cm4E3TdzBRgYzSIObU8R3Gy",
    });

    const myMap = olaMaps.init({
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: "olaMap",
      center: data.stores[0].location.coordinates,
      zoom: 5,
    });

    let storeList = "";
    data.stores.map((storeItem, index) => {
      if (index > 5) return;
      storeList += `<li class="single-store-data store-${index}" data-index=${index}>
              <div class="store-name">${storeItem.storeName}</div>
              <div class="store-city-state">${storeItem.city}, ${storeItem.state}, ${storeItem.zipCode}</div>
              <div class="store-country">${storeItem.country}, ${storeItem.state}</div>
          </li>`;
      addMarkerMap(storeItem, index, myMap);
    });
    storeList = "<ul>" + storeList + "</ul>";
    document.querySelector(".store-container-am").innerHTML = storeList;

    addHoverEffect();
  });

function addMarkerMap(storeItem, index, myMap) {
  var customMarker = document.createElement("div");
  customMarker.innerHTML = svgString;

  customMarker.classList.add(`popup-${index}`);
  const popup = olaMaps
    .addPopup({ offset: [0, -30], anchor: "bottom" })
    .setHTML(`<div>${storeItem.storeName}</div>`);

  olaMaps
    .addMarker({
      element: customMarker,
      offset: [0, 6],
      anchor: "bottom",
      color: "red",
      draggable: false,
    })
    .setLngLat(storeItem.location.coordinates)
    .setPopup(popup)
    .addTo(myMap);
}

function addHoverEffect() {
  document.querySelectorAll(".single-store-data").forEach((element) => {
    element.addEventListener("mouseenter", (e) => {
      const indx = e.currentTarget.getAttribute("data-index");
      document.querySelector(`.popup-${indx}`).classList.add("active-p");
    });
    element.addEventListener("mouseleave", (e) => {
      const indx = e.currentTarget.getAttribute("data-index");
      document.querySelector(`.popup-${indx}`).classList.remove("active-p");
    });
  });
}
