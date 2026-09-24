import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);

  return null;
}
