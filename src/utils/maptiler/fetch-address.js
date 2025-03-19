'use server';

export async function fetchAddress(lat, long) {
  const ENDPOINT = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`;

  try {
    let data = await fetch(ENDPOINT);
    let res = await data.json();
    return `${res.address?.state}, ${res.address?.country}`;
  }
  catch (e) {
    console.log(e);
    return '';
  }
}