import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as RNLocalize from 'react-native-localize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Sound from 'react-native-sound';

const {width, height} = Dimensions.get('window');

const dayMarkers = {
    Mon: { text: 'Mon', color: '#FF5733' },
    Tue: { text: 'Tue', color: '#33C1FF' },
    Wed: { text: 'Wed', color: '#75FF33' },
    Thu: { text: 'Thu', color: '#FFC133' },
    Fri: { text: 'Fri', color: '#8D33FF' },
    Sat: { text: 'Sat', color: '#FF33A2' },
    Sun: { text: 'Sun', color: '#FF3333' },
    Everyday: { text: 'Everyday', color: '#4CAF50' },
    월: { text: '월', color: '#FF5733' },
    화: { text: '화', color: '#33C1FF' },
    수: { text: '수', color: '#75FF33' },
    목: { text: '목', color: '#FFC133' },
    금: { text: '금', color: '#8D33FF' },
    토: { text: '토', color: '#FF33A2' },
    일: { text: '일', color: '#FF3333' },
    매일: { text: '매일', color: '#4CAF50' },
};

const translations = {
    en: {
        materials: [
            {
                title: 'Schedule',
                days: [],
                pageAudio: '',
                steps: [
                    {
                       
                        images: [
                            require('../assets/Schedule.png'),
                        ],
                    },
                ],
            },
            {
                title: 'Plastic',
                days: ['Mon', 'Wed', 'Fri', 'Sun'],
                pageAudio: 'how_to_recycle_plastic.mp3',
                steps: [
                    {
                        subtitle: '1. Sort Your Plastic',
                        images: [
                            require('../assets/Plastic.png'),
                        ],
                    },
                    {
                        subtitle: '2. Clean the Plastic',
                        images: [
                            require('../assets/clean_plastic.png')
                        ],
                    },
                    {
                        subtitle: '3. Remove Non-Recyclable Parts',
                        images: [
                            require('../assets/non_recyclable_parts.png')
                        ],
                    },
                ],
            },
            {
                title: 'Paper',
                days: ['Tue', 'Thu', 'Sat'],
                pageAudio: 'how_to_recycle_paper.mp3',
                steps: [
                    {
                        subtitle: '1. Sort Your Paper',
                        images: [
                            require('../assets/Paper.png'),
                        ],
                    },
                    {
                        subtitle: '2. Clean the Paper',
                        images: [
                            require('../assets/Paper3.png')
                        ],
                    },
                    {
                        subtitle: '3. Flatten and Bundle',
                        images: [
                            require('../assets/Paper4.png')
                        ],
                    },
                ],
            },
            {
                title: 'Vinyl',
                days: ['Fri', 'Sun'],
                pageAudio: 'how_to_recycle_vinyl.mp3',
                steps: [
                    {
                        subtitle: '1. Identify Vinyl Items',
                        images: [
                            require('../assets/Vinyl1.png'),
                        ],
                    },
                    {
                        subtitle: '2. Prepare Vinyl for Recycling',
                        images: [
                            require('../assets/Vinyl2.png')
                        ],
                    },
                ],
            },
            {
                title: 'Daily Disposals',
                days: ['Everyday'],
                pageAudio: 'how_to_recycle_daily_disposals.mp3',
                steps: [
                    {
                        subtitle: '1. Identify Daily Disposals',
                        images: [
                            require('../assets/Daily1.png'),
                        ],
                    },
                    {
                        subtitle: '2. Prepare Daily Disposal for Disposing',
                        images: [
                            require('../assets/Daily2.png'),
                            require('../assets/Daily3.png')
                        ],
                    },
                ],
            },
        ],
    },
    ko: {
        materials: [
            {
                title: '분리배출 요일',
                days: [],
                pageAudio: '',
                steps: [
                    {
                       
                        images: [
                            require('../assets/Schedule.png'),
                        ],
                    },
                ],
            },
            {
                title: '플라스틱류',
                days: ['월', '수', '금', '일'],
                pageAudio: 'how_to_recycle_plastic_k.mp3',
                steps: [
                    {
                        subtitle: '1. 플라스틱 분류하기',
                        images: [
                            require('../assets/Plastic.png'),
                        ],
                    },
                    {
                        subtitle: '2. 플라스틱 씻기',
                        images: [
                            require('../assets/clean_plastic.png')
                        ],
                    },
                    {
                        subtitle: '3. 재활용 불가능한 부분 제거하기',
                        images: [
                            require('../assets/non_recyclable_parts.png')
                        ],
                    },
                ],
            },
            {
                title: '종이류',
                days: ['화', '목', '토'],
                pageAudio: 'how_to_recycle_paper_k.mp3',
                steps: [
                    {
                        subtitle: '1. 종이 분류하기',
                        images: [
                            require('../assets/Paper.png'),
                        ],
                    },
                    {
                        subtitle: '2. 종이 씻기',
                        images: [
                            require('../assets/Paper3.png')
                        ],
                    },
                    {
                        subtitle: '3. 펼쳐서 묶기',
                        images: [
                            require('../assets/Paper4.png')
                        ],
                    },
                ],
            },
            {
                title: '비닐류',
                days: ['금', '일'],
                pageAudio: 'how_to_recycle_vinyl_k.mp3',
                steps: [
                    {
                        subtitle: '1. 비닐 항목 식별하기',
                        images: [
                            require('../assets/Vinyl1.png'),
                        ],
                    },
                    {
                        subtitle: '2. 비닐 재활용 준비하기',
                        images: [
                            require('../assets/Vinyl2.png')
                        ],
                    },
                ],
            },
            {
                title: '일반 쓰레기',
                days: ['매일'],
                pageAudio:'how_to_recycle_daily_disposals_k.mp3',
                steps: [
                    {
                        subtitle: '1. 일반 쓰레기 항목 식별하기',
                        images: [
                            require('../assets/Daily1.png'),
                        ],
                    },
                    {
                        subtitle: '2. 일반 쓰레기 배출 준비하기',
                        images: [
                            require('../assets/Daily2.png'),
                            require('../assets/Daily3.png')
                        ],
                    },
                ],
            },
        ],
    },
};

const GuideScreen = () => {
    const [language, setLanguage] = useState('en');
    const [currentPage, setCurrentPage] = useState(0);
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    const sound = useRef(null);

    useEffect(() => {
        const locales = RNLocalize.getLocales();
        if (locales && locales.length > 0) {
            setLanguage(locales[0].languageCode === 'ko' ? 'ko' : 'en');
        }
    }, []);

    useEffect(() => {
        const currentMaterial = translations[language].materials[currentPage];
        if (sound.current) {
            sound.current.stop(() => sound.current.release());
        }
        sound.current = new Sound(currentMaterial.pageAudio, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.error('Failed to load sound', error);
                return;
            }
            sound.current.play((success) => {
                if (!success) {
                    console.error('Sound playback failed');
                }
            });
        });

        return () => {
            if (sound.current) {
                sound.current.stop(() => sound.current.release());
            }
        };
    }, [language, currentPage]);

    const t = translations[language];
    const currentMaterial = t.materials[currentPage];

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => {
                            if (sound.current) {
                                sound.current.stop(() => sound.current.release());
                            }
                            navigation.navigate('Home');
                        }}>
                        <Icon name="home" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.dayMarkContainer}>
                        {currentMaterial.days.map((day, index) => (
                            <Text
                                key={index}
                                style={[
                                    styles.dayMarkText,
                                    { backgroundColor: dayMarkers[day]?.color || '#000' },
                                ]}
                            >
                                {dayMarkers[day]?.text || day}
                            </Text>
                        ))}
                    </View>
                </View>

                <ScrollView style={styles.scrollContent} ref={scrollViewRef}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{currentMaterial.title}</Text>
                    </View>

                    {currentMaterial.steps.map((step, index) => (
                        <View key={index} style={styles.stepContainer}>
                            <Text style={styles.subtitle}>{step.subtitle}</Text>
                            <View style={styles.imagesContainer}>
                                {step.images.map((image, imgIndex) => (
                                    <Image 
                                        key={imgIndex} 
                                        source={image} 
                                        style={styles.fitToWidthImage} 
                                    />
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.bottomButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.prevButton]}
                        onPress={() => handlePageChange(currentPage > 0 ? currentPage - 1 : t.materials.length - 1)}>
                        <Icon name="chevron-left" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.pageIndicatorText}>{currentPage + 1} / {t.materials.length}</Text>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.nextButton]}
                        onPress={() => handlePageChange((currentPage + 1) % t.materials.length)}>
                        <Icon name="chevron-right" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    homeButton: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dayMarkContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    dayMarkText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
        marginLeft: 5,
    },
    scrollContent: {
        flex: 1,
        marginTop: 10,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#333',
        textDecorationLine: 'underline',
    },
    stepContainer: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    imagesContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    fitToWidthImage: {
        width: width * 0.8,
        height: height * 0.8,
        resizeMode: 'contain',
    },
    bottomButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
    },
    actionButton: {
        padding: 12,
        borderRadius: 15,
        backgroundColor: '#4CAF50',
    },
    pageIndicatorText: {
        fontSize: 19.2,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default GuideScreen;
