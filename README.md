# mapProject
Package for this project
- npm install
- npm install react-native-geolocation-service
- npm install --save-exact react-native-permissions
- npm install react-native-maps --save-exact
# File app.js
## Import package
```
   import React, { useEffect, useState, useRef } from 'react';
   import { SafeAreaView, StatusBar, StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
   import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
   import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
   import Geolocation from 'react-native-geolocation-service';
   import { customStyleMap } from '../Styles/Map';
```
## create state
```
const [location, setLocation] = useState(null);
```
## Request gps permission 
``` 
    const handleLocationPermission = async () => {
    let permissionCheck = '';

    if (Platform.OS === 'android') {
      permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (permissionCheck === RESULTS.DENIED) {
        const permissionRequest = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        permissionRequest === RESULTS.GRANTED
          ? console.warn('Location permission granted.')
          : console.warn('Location perrmission denied.');
      }
    }
  };
```
## Request gps permission 
``` 
    const handleLocationPermission = async () => {
    let permissionCheck = '';

    if (Platform.OS === 'android') {
      permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (permissionCheck === RESULTS.DENIED) {
        const permissionRequest = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        permissionRequest === RESULTS.GRANTED
          ? console.warn('Location permission granted.')
          : console.warn('Location perrmission denied.');
      }
    }
  };
  
   useEffect(() => {
    handleLocationPermission();
   }, []);
```
## getCurrentPosition using Geolocation
``` 
    useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);
```
## Main app.js
``` 
    return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {location && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}

          showsUserLocation={true}
          customMapStyle={customStyleMap}
          paddingAdjustmentBehavior="automatic"
          showsMyLocationButton={true}
          showsBuildings={true}
          maxZoomLevel={20}
          loadingEnabled={true}
          loadingIndicatorColor="#fcb103"
          loadingBackgroundColor="#242f3e">
        </MapView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default App;
```
# referfence
 - https://dev.to/cecheverri4/google-maps-geolocation-and-unit-test-on-react-native-4eim?fbclid=IwAR27uwZybpCTZlxHZtbF6yCk0qmcA6Uq23dSyhssz235LaYjcOpDLyT9Hjw
