import React, {useEffect, useState} from 'react'; // Importing React and necessary hooks for managing state.
import {View, StyleSheet, Dimensions} from 'react-native'; // Importing CSS to be used later for design. 
import {useNavigation} from '@react-navigation/native'; // Navigation hook to navigate between screens.
import Onboarding from 'react-native-onboarding-swiper'; // Library for Onboarding Screen functionality.
import LottieView from 'lottie-react-native'; // Library for utilising necessary animations. 
import {setItem} from '../utils/asyncStorage'; // Custom utility function to save data to AsyncStorage (Helps Onboarding Screen to be showed only once at first experience).
import * as RNLocalize from 'react-native-localize'; // Library to detect device language & region settings. 

const {width} = Dimensions.get('window'); // Get screen width to 'dynamically' set animation sizes.

//Translations (Eng, Kor)
const translations = {
	en: {
		page1Title: 'Having trouble saving the world?', 
		page1Subtitle: 'Sorting trash isn’t the easiest thing\n to do, especially in Jeju.',
		page2Title: 'The "Clean House" system',
		page2Subtitle:
			'Helps residents manage waste effectively\nbut comes with strict regulations.',
		page3Title: 'Don’t worry, we are here to help!',
		page3Subtitle: 'Meet "Sorty", your guide to better waste sorting!',
	},
	ko: {
		page1Title: '세상을 구하는 일이 어려우신가요?',
		page1Subtitle: '쓰레기 분리배출은 특히 제주에서 쉽지 않은 일입니다.',
		page2Title: '"클린 하우스" 시스템',
		page2Subtitle: '주민들이 효과적으로 폐기물을 관리하도록 돕지만\n엄격한 규정을 따릅니다.',
		page3Title: '걱정하지 마세요, 저희가 도와드릴게요!',
		page3Subtitle: '"Sorty"와 함께 분리배출을 더 잘할 수 있어요!',
	},
};

const OnboardingScreen = () => {
	const navigation = useNavigation(); // Get navigation instance to navigate to other screens.
	const [language, setLanguage] = useState('en'); // State to hold current language (default is different depending on devices).

	useEffect(() => { // UseEffect hook to detect & set the device's preferred language.
		const locales = RNLocalize.getLocales(); 
		if (locales && locales.length > 0) { 
			// If a preferred language exists, set it to either 'ko' or default to 'en'.
			setLanguage(locales[0].languageCode === 'ko' ? 'ko' : 'en'); 
		}
	}, []);
	// 'Handler' function is executed when onboarding is complete.
	const handleDone = () => {
		navigation.navigate('Home'); // Navigation back to 'HomeScreen'.
		setItem('onboarded', '1'); // Save 'onboarded' status in AsyncStorage to avoid showing onboarding again.
	};

	const translation = translations[language];

	return (
		<View style={styles.container}>
			<Onboarding
				onDone={handleDone}
				onSkip={handleDone}
				containerStyles={styles.onboardingContainer}
				pages={[
					{
						backgroundColor: '#a7f3d0',
						image: (
							<View style={styles.imageContainer}>
								<LottieView
									source={require('../assets/animations/recycle_1.json')}
									autoPlay
									loop
									style={styles.lottie}
								/>
							</View>
						),
						title: translation.page1Title,
						subtitle: translation.page1Subtitle,
						titleStyles: styles.title,
						subTitleStyles: styles.subtitle,
					},
					{
						backgroundColor: '#fef3c7',
						image: (
							<View style={styles.imageContainer}>
								<LottieView
									source={require('../assets/animations/recycle_2.json')}
									autoPlay
									loop
									style={styles.lottie}
								/>
							</View>
						),
						title: translation.page2Title,
						subtitle: translation.page2Subtitle,
						titleStyles: styles.title,
						subTitleStyles: styles.subtitle,
					},
					{
						backgroundColor: '#a78bfa',
						image: (
							<View style={styles.imageContainer}>
								<LottieView
									source={require('../assets/animations/recycle_book.json')}
									autoPlay
									loop
									style={styles.lottie}
								/>
							</View>
						),
						title: translation.page3Title,
						subtitle: translation.page3Subtitle,
						titleStyles: styles.title,
						subTitleStyles: styles.subtitle,
					},
				]}
			/>
		</View>
	);
};
// Stylesheet for the components.
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	onboardingContainer: {
		paddingHorizontal: 20,
	},
	imageContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 20,
	},
	lottie: {
		width: width * 0.6,
		height: width * 0.6,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		textAlign: 'center',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: '#555',
		textAlign: 'center',
		lineHeight: 22,
	},
});

export default OnboardingScreen; // Export the component as default.
