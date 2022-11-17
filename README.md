# mapProject
Package for this project
- npm install
- npm install react-native-geolocation-service
- npm install --save-exact react-native-permissions
- npm install react-native-maps --save-exact
# File app.js
## Import package
```js
   import React, { useEffect, useState, useRef } from 'react';
   import { SafeAreaView, StatusBar, StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
   import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
   import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
   import Geolocation from 'react-native-geolocation-service';
   import { customStyleMap } from '../Styles/Map';
```
# Use Google Map API And Current Location
## Config in android/app/src/main/AndroidManifest.xml file.
```js
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="Your Google maps API Key Here"/>
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```
## Map Views
```js
   enableLatestRenderer();

  <MapView
    initialRegion={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  />
  
 ```
## create state
```js
const [location, setLocation] = useState(null);
```
## Request gps permission 
```js 
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
```js 
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
```js 
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
```js 
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
# Get API Location
## Create State and Use Ref
```js
  const [items, setItems] = useState([]);
  const mapRef = useRef(null);
```
## Example API Website
```js
   https://www.melivecode.com/
```
## Get API
```js
  useEffect(() => {
    fetch('https://www.melivecode.com/api/attractions')
      .then(res => res.json())
      .then(result => {
        //console.log(result)
        setItems(result);
      });
  }, []);
```
## Animate To Region
```js
  const go = (latitude, longitude) => {
       mapRef.current.animateToRegion({
         latitude: latitude,
         longitude: longitude,
         latitudeDelta: 2,
         longitudeDelta: 2,
      });
  };
  
  <MapView
      ...
      ref={mapRef}
      ...
   >
```
## Render Items For Flatlist
```js
   const renderItem = ({item}) => (
      <View style={styles.margin}>
         <View style={{backgroundColor:"rgba(0, 0, 0, 0.4)"}}>
         <TouchableOpacity onPress={() => go(item.latitude, item.longitude)}>
           <Text style={styles.labelList}>
             {item.name}
           </Text>
           <Image
             source={{uri: item.coverimage}}
             style={{width: 300, height: 150}}
           />
         </TouchableOpacity>
         </View>
      </View>
   );
```
## Check Items length of API Data
```js
  if (items.length === 0) {
    return (
      <View>
        <Text>Loading....</Text>
      </View>
    );
  }
```
## Main app.js
## Map Item List
```js 
   <MapView>
   
         ...
         
         {items.map((item, index) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.name}
            />
          ))}
          
         ...
         
   </MapView>
```
## Show FlatList
```js
   <View style={styles.listview}>
        <FlatList
          style={styles.flatList}
          horizontal={true}
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentInset={{ right: 20, top: 0, left: 0, bottom: 0 }}
        />
    </View>
```
## StyleSheet
```js
   const styles = StyleSheet.create({
   
     ...
     
     listview: {
       position: 'absolute',
       alignSelf:"flex-end"
     },
     flatList: {
       marginVertical:626
     },
     margin: {
       padding: 5,
     },
     labelList:{
       color:"white",
       fontWeight:"bold",
       textShadowColor:'black',
       textShadowOffset:{width: 2.1, height: 0.2},
       textShadowRadius:1,
       marginBottom:10,
       textAlign:"center",
     }
     
     ...
     
   });
```
# referfence
 - https://dev.to/cecheverri4/google-maps-geolocation-and-unit-test-on-react-native-4eim?fbclid=IwAR27uwZybpCTZlxHZtbF6yCk0qmcA6Uq23dSyhssz235LaYjcOpDLyT9Hjw
 - https://github.com/react-native-maps/react-native-maps
