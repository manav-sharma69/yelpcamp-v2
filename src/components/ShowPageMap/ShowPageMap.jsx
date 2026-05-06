'use client'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'
import React from 'react'
import style from './style.module.css'

export default function ShowPageMap({ latlong, title, location }) {
  const mapContainer = React.useRef(null)
  const map = React.useRef(null)
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY

  const coords = { lng: latlong[1], lat: latlong[0] }

  React.useEffect(() => {
    if (map.current) return // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [coords.lng, coords.lat],
      zoom: 15,
      // disabled these controls because of z-index issues
      navigationControl: false,
      geolocateControl: false,
      dragPan: false
    })

    new maptilersdk.Marker()
      .setLngLat([coords.lng, coords.lat])
      .setPopup(
        new maptilersdk.Popup({ offset: 25 }).setHTML(
          `<h3>${title}</h3><p>${location}</p>`
        )
      )
      .addTo(map.current)
  }, [coords.lat, coords.lng])

  return (
    <div className={style['map-wrap']}>
      <div className={style['map']} ref={mapContainer} />
    </div>
  )
}
