import React from "react";
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dayjs from "dayjs";




// Fix Leaflet default icon issue in many bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});



export default function SalesmanMap({ groupedData }) {
  // Extract marker data
  const markers = Object.entries(groupedData)
    .flatMap(([date, visits]) =>
      visits.map((visit) => ({
        date,
        lat: parseFloat(visit.location_lat),
        lng: parseFloat(visit.location_lng),
        address: visit.location_address,
        dealerName: visit.is_new_dealer ? visit.new_dealer_details : visit.dealer_name ,
        newDealer: visit.is_new_dealer,
        activitiesDone: visit.activities_done,
        time: dayjs(visit.created_at).add(5.5, "hour")
  .format("hh:mm A"),

        otherDetails: visit.other_details || ""
      }))
    )
    .filter(
      (m) => !isNaN(m.lat) && !isNaN(m.lng) // remove invalid coords
    );

  // Center map on first marker or fallback coords
  const center = markers.length
    ? [markers[0].lat, markers[0].lng]
    : [23.41412, 88.51143];

  return (
    <MapContainer center={center} 
    zoom={10}
     scrollWheelZoom={false} // disables zoom on scroll
      doubleClickZoom={false} // disables zoom on double-click
    style={{ height: "350px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="©FRN"
      />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lng]} >
          <Popup>
         
            <strong>{marker.newDealer ? "New Dealer" :  "Existing Dealer"}</strong> 
             <br />
            <strong>Date:</strong> {marker.date}
            <br />
            <strong>Time:</strong> {marker.time}
            <br />
            <strong>Dealer:</strong> {marker.dealerName}
            <br />
            <strong>Address:</strong> {marker.address}
            <br />
            <strong>Activities:</strong> {marker.activitiesDone}

            {marker.otherDetails && (
              <>
                <br />
                <strong>Details:</strong> {marker.otherDetails}
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
