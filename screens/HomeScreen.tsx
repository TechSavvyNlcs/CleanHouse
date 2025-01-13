import React, {useState, useEffect, useRef} from 'react';
import {
	View,
	TouchableOpacity,
	Platform,
	PermissionsAndroid,
	Image,
	StyleSheet,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import firebase from 'firebase/compat/app';
import {getDatabase, ref, onValue} from 'firebase/database';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import * as RNLocalize from 'react-native-localize';

const firebaseConfig = {
	apiKey: 'AIzaSyANrTR0avqh99Rgr4b6VPS3WiN41H_-y2o',
	authDomain: 'cleanhouse-51b07.firebaseapp.com',
	projectId: 'cleanhouse-51b07',
	storageBucket: 'cleanhouse-51b07.appspot.com',
	messagingSenderId: '996562465948',
	appId: '1:996562465948:web:59a48edb71789577916959',
	measurementId: 'G-KFHXFZ10RL',
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

async function requestPermission() {
	try {
		if (Platform.OS === 'ios') {
			return await Geolocation.requestAuthorization('always');
		}
		if (Platform.OS === 'android') {
			return await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			);
		}
	} catch (e) {
		console.log(e);
	}
}

const translations = {
	en: {
		searchPlaceholder: 'Search for a place...',
		searchButton: 'Search',
		selectedLocation: 'Selected Location',
		actionButtonHome: 'Our Team',
		actionButtonGuide: 'Guide',
		actionButtonAI: 'AI',
	},
	ko: {
		searchPlaceholder: '장소를 검색하세요...',
		searchButton: '검색',
		selectedLocation: '선택된 위치',
		actionButtonHome: '팀 소개',
		actionButtonGuide: '가이드',
		actionButtonAI: 'AI',
	},
};

const HomeScreen = () => {
	const navigation = useNavigation();
	const [location, setLocation] = useState();
	const [selectedMarker, setSelectedMarker] = useState();
	const [markers, setMarkers] = useState([]);
	const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);
	const [language, setLanguage] = useState('en');
	const mapRef = useRef(null);
	const db = getDatabase();
	const starCountRef = ref(db);

	useEffect(() => {
		const locales = RNLocalize.getLocales();
		if (locales && locales.length > 0) {
			setLanguage(locales[0].languageCode === 'ko' ? 'ko' : 'en');
		}

		onValue(starCountRef, snapshot => {
			const data = snapshot.val();
			setMarkers(data);
		});

		requestPermission().then(result => {
			if (result === 'granted') {
				Geolocation.getCurrentPosition(
					pos => {
						setLocation(pos.coords);
					},
					error => {
						console.log(error);
					},
					{
						enableHighAccuracy: true,
						timeout: 3600,
						maximumAge: 3600,
					},
				);
			}
		});
	}, []);

	const animateToRegion = ({latitude, longitude}) => {
		if (mapRef.current) {
			mapRef.current.animateToRegion(
				{
					latitude,
					longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				},
				1000,
			);
		}
	};

	const translation = translations[language];

	return (
		<View style={styles.container}>
			{isSearchBarExpanded ? (
				<View style={styles.searchContainer}>
					<GooglePlacesAutocomplete
						minLength={2}
						placeholder={translation.searchPlaceholder}
						query={{
							key: 'AIzaSyDqg3pcVisnOuryLNh6HXWSO4dU0zLrmGQ',
							language: language,
							components: 'country:kr',
						}}
						nearbyPlacesAPI="GoogleReverseGeocodingQuery"
						keyboardShouldPersistTaps="handled"
						fetchDetails={true}
						onPress={(data, details) => {
							if (details?.geometry?.location) {
								const tappedMarker = {
									latitude: details.geometry.location.lat,
									longitude: details.geometry.location.lng,
								};
								setSelectedMarker(tappedMarker);
								animateToRegion(tappedMarker);
							}
						}}
						onFail={error => console.log(error)}
						onNotFound={() => console.log('no results')}
						keepResultsAfterBlur={true}
						enablePoweredByContainer={false}
						styles={autocompleteStyles}
					/>
					<TouchableOpacity
						style={styles.closeButton}
						onPress={() => setIsSearchBarExpanded(false)}>
						<Icon name="close" size={30} color="#000" />
					</TouchableOpacity>
				</View>
			) : (
				<TouchableOpacity
					style={styles.searchIconContainer}
					onPress={() => setIsSearchBarExpanded(true)}>
					<Icon name="search" size={30} color="#000" />
				</TouchableOpacity>
			)}
			<MapView
				ref={mapRef}
				style={styles.map}
				provider={PROVIDER_GOOGLE}
				initialRegion={{
					latitude: 33.286217,
					longitude: 126.283165,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				showsUserLocation={true}
				showsMyLocationButton={true}
				zoomEnabled={true}
				zoomControlEnabled={true}
				onPress={() => setIsSearchBarExpanded(false)}>
				{markers.map((marker, index) => (
					<Marker
						key={index}
						coordinate={{latitude: marker.위도, longitude: marker.경도}}
						title={marker.위치}
						description={marker.주소}>
						<Image
							source={require('../assets/marker.png')}
							style={styles.markerImage}
						/>
					</Marker>
				))}
				{selectedMarker && (
					<Marker
						coordinate={selectedMarker}
						title={translation.selectedLocation}
					/>
				)}
			</MapView>
			<ActionButton
				buttonColor="rgba(231,76,60,1)"
				offsetX={10}
				offsetY={80}
				style={styles.actionButton}>
				<ActionButton.Item
					buttonColor="#1abc9c"
					title={translation.actionButtonAI}
					onPress={() => navigation.navigate('AI')}>
					<Icon name="hub" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor="#3498db"
					title={translation.actionButtonGuide}
					onPress={() => navigation.navigate('Guide')}>
					<Icon name="map" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor="#9b59b6"
					title={translation.actionButtonHome}
					onPress={() => navigation.navigate('Team')}>
					<Icon name="diversity-1" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor="#aabc9c"
					title= 'TEST'
					onPress={() => navigation.navigate('Test')}>
					<Icon name="settings" style={styles.actionButtonIcon} />
				</ActionButton.Item>
			</ActionButton>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchContainer: {
		position: 'absolute',
		top: 10,
		left: 10,
		right: 10,
		zIndex: 1,
		backgroundColor: '#fff',
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		padding: 8,
	},
	searchIconContainer: {
		position: 'absolute',
		top: 10,
		left: 10,
		zIndex: 1,
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 8,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	closeButton: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 2,
	},
	map: {
		flex: 1,
	},
	markerImage: {
		width: 48,
		height: 48,
		resizeMode: 'contain',
	},
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
});

const autocompleteStyles = {
	textInputContainer: {
		backgroundColor: 'transparent',
		borderTopWidth: 0,
		borderBottomWidth: 0,
	},
	textInput: {
		height: 40,
		color: '#5d5d5d',
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		paddingHorizontal: 10,
	},
	predefinedPlacesDescription: {
		color: '#1faadb',
	},
};

export default HomeScreen;
