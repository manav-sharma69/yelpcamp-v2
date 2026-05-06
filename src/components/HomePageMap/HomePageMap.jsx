'use client'
import { getCampgrounds } from '@/utils/actions/campgroundsCrud'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'
import React from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import style from './style.module.css'

import Link from '@/components/Link'
import { Box, Flex, Text } from '@radix-ui/themes'

function PopUp({ name, id, price, reviews }) {
  return (
    <>
      <Link href={`/camp/${id}`}>
        <Text color="indigo">{name}</Text>
      </Link>
      <Flex direction={'row'} align={'center'} justify={'between'}>
        <Text as="p">${price}</Text>
        {reviews === 0 ? (
          <Text as="p">No Reviews</Text>
        ) : (
          <Flex align={'center'} gapX={'2'}>
            <Box>
              <Text size={'3'}>&#9733;</Text>
            </Box>
            <Box>
              <Text size={'2'}>{reviews}</Text>
            </Box>
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default function HomePageMap({ style: displayStyle }) {
  const mapContainer = React.useRef(null)
  const map = React.useRef(null)
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY

  React.useEffect(() => {
    async function asyncEffect() {
      const data = await getCampgrounds()
      const geoData = createGeoJSONData(data)
      initializeMap(map, mapContainer, geoData)
    }
    asyncEffect()
  }, [])

  return (
    <div style={displayStyle} data-name="map-style-wrapper">
      <div className={style['map-wrap']} data-name="map-wrap">
        <div
          className={style['map']}
          ref={mapContainer}
          data-name="map-container"
        />
      </div>
    </div>
  )
}

function createGeoJSONData(campgrounds) {
  const geoJSONDataArr = campgrounds.map((campground) => {
    const { lat_long, name, id, price } = campground
    return {
      type: 'Feature',
      properties: {
        id,
        name,
        price,
        reviews: Number.parseFloat(campground['average_rating'])
      },
      geometry: {
        type: 'Point',
        coordinates: [lat_long[1], lat_long[0]]
      }
    }
  })

  return {
    type: 'FeatureCollection',
    features: geoJSONDataArr
  }
}

function initializeMap(map, mapContainer, campgroundsGeoJSON) {
  if (map.current) return // stops map from intializing more than once

  map.current = new maptilersdk.Map({
    container: mapContainer.current,
    style: maptilersdk.MapStyle.BRIGHT,
    center: [-103.59179687498357, 40.66995747013945],
    zoom: 3
  })

  map.current.on('load', function () {
    map.current.addSource('campgrounds', {
      type: 'geojson',
      data: campgroundsGeoJSON,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    })

    map.current.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'campgrounds',
      filter: ['has', 'point_count'],
      paint: {
        // Use step expressions (https://docs.maptiler.com/gl-style-specification/expressions/#step)
        // with three steps to implement three types of circles:
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#00BCD4',
          10,
          '#2196F3',
          30,
          '#3F51B5'
        ],
        'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 30, 25]
      }
    })

    map.current.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'campgrounds',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    })

    map.current.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'campgrounds',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    })

    // inspect a cluster on click
    map.current.on('click', 'clusters', async (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      })
      const clusterId = features[0].properties.cluster_id
      const zoom = await map.current
        .getSource('campgrounds')
        .getClusterExpansionZoom(clusterId)
      map.current.easeTo({
        center: features[0].geometry.coordinates,
        zoom
      })
    })

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.current.on('click', 'unclustered-point', function (e) {
      const { id, name, price, reviews } = e.features[0].properties
      const coordinates = e.features[0].geometry.coordinates.slice()

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }

      // pass JSX for popup as HTML
      const div = document.createElement('div')
      const root = createRoot(div)
      flushSync(() => {
        root.render(
          <PopUp id={id} name={name} price={price} reviews={reviews} />
        )
      })

      new maptilersdk.Popup()
        .setLngLat(coordinates)
        .setDOMContent(div)
        .addTo(map.current)
    })

    map.current.on('mouseenter', 'clusters', () => {
      map.current.getCanvas().style.cursor = 'pointer'
    })
    map.current.on('mouseleave', 'clusters', () => {
      map.current.getCanvas().style.cursor = ''
    })
    map.current.on('mouseenter', 'unclustered-point', () => {
      map.current.getCanvas().style.cursor = 'pointer'
    })
    map.current.on('mouseleave', 'unclustered-point', () => {
      map.current.getCanvas().style.cursor = ''
    })
  })
}
