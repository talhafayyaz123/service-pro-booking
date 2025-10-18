export const onShowOnMapClick = () => {
  const locationMap = document.getElementById('location_map')
  if (locationMap) {
    locationMap.scrollIntoView({
      behavior: 'smooth',
    })
  }
}
