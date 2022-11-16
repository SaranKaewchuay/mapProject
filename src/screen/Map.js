import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { customStyleMap } from '../Styles/Map';

const App = () => {
  const [location, setLocation] = useState(null);
  //--------------------------------------------------------
  const [items, setItems] = useState([]);
  const mapRef = useRef(null);
  //--------------------------------------------------------

  const handleLocationPermission = async () => {
    let permissionCheck = '';
    if (Platform.OS === 'ios') {
      permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (permissionCheck === RESULTS.DENIED) {
        const permissionRequest = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        permissionRequest === RESULTS.GRANTED
          ? console.warn('Location permission granted.')
          : console.warn('Location perrmission denied.');
      }
    }

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

  //--------------------------------------------------------

  useEffect(() => {
    fetch('https://www.melivecode.com/api/attractions')
      .then(res => res.json())
      .then(result => {
        //console.log(result)
        setItems(result);
      });
  }, []);

  const go = (latitude, longitude) => {
    // Get API Location
    mapRef.current.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 2,
      longitudeDelta: 2,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.margin}>
      <TouchableOpacity onPress={() => go(item.latitude, item.longitude)}>
        <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 10 }}>
          {item.name}
        </Text>
        <Image
          source={{ uri: item.coverimage }}
          style={{ width: 300, height: 150 }}
        />
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <View>
        <Text>Loading....</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {location && (
        <MapView
          ref={mapRef}
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
        </MapView>
      )}
      <View style={styles.listview}>
        <FlatList
          style={styles.flatList}
          horizontal={true}
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
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
  },
  listview: {
    position: 'absolute',
    buttom: 0,
  },
  flatList: {
    marginTop: 600,
  },
  margin: {
    padding: 5,
  }
});

export default App;