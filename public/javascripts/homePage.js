function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

$(document).ready(function () {
  if (!localStorage.getItem("token")) {
    window.location.href = "/landing";
  }

  let randomLat = getRandomInRange(-90, 90, 3);
  let randomLong = getRandomInRange(-180, 180, 3);
  const map = L.map("map");
  map.setView([randomLat, randomLong], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1,
  }).addTo(map);

  $("form").submit(function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const plainFormData = Object.fromEntries(formData.entries());
    const ipToFetch = plainFormData.ip;
    let fetchIp;
    if (ipToFetch) {
      fetchIp = fetch(`/api/v1/ip/${ipToFetch}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    } else {
      fetchIp = fetch(`/api/v1/ip`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    }
    fetchIp
      .then((res) => res.json())
      .then((data) => {
        map.setView([data.latitude, data.longitude], 10);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20,
          minZoom: 2,
          tileSize: 512,
          zoomOffset: -1,
        }).addTo(map);
        const circle = L.circle([data.latitude, data.longitude], {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.5,
          radius: 10000,
        }).addTo(map);
        circle.bindPopup(
          `${data.city || data.county}, ${data.region}, ${data.country_code}`
        );
      })
      .catch((err) => {
        console.error(err);
        window.location.href = "/landing?isLogin=true";
      });
  });
});
