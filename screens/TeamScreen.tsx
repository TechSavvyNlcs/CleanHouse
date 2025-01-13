import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import Swiper from 'react-native-swiper';
import {useNavigation} from '@react-navigation/native';
import * as RNLocalize from 'react-native-localize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const translations = {
    en: {
        whoAreWe: 'Who Are We?',
        teamIntro:
            'Hello! We are Hayoon Cho and Bitna Kim, the creators of this app. As long-time teammates, we’ve developed strong collaboration skills through numerous projects. Living on Jeju Island, we are deeply committed to environmental preservation and have firsthand experience with its unique waste management system, especially the CleanHouse facilities. This inspired us to create CleanHouse to highlight their crucial role in protecting the environment.',
        ourActivities: 'Our Activities',
        teamMembers: [
            {name: 'Bitna Kim', image: require('../assets/Team_Bitna.png')},
            {name: 'Hayoon Cho', image: require('../assets/Team_Hayoon.png')},
        ],
        teamImages: [
            {image: require('../assets/Team1.jpeg'), description: 'Presenting at a national statistics competition and winning the middle school division.'},
            {image: require('../assets/Team2.png'), description: 'Receiving an award at the Kangaroo STEAM Conference.'},
            {image: require('../assets/Team_stat.png'), description: 'Creating a poster on the issue of elderly exclusion caused by kiosks.'},
            {image: require('../assets/Team_stat2.png'), description: 'Designing a Google Form survey to collect research data.'},
            {image: require('../assets/Team_survey.png'), description: 'Conducting field surveys to assess usability challenges with kiosks.'},
            {image: require('../assets/Team_survey2.png'), description: 'Additional field surveys on kiosk usability issues.'},
        ],
        teamActivities: [
            'Participated in national competitions like the “World Statistics Competition” and international conferences such as the “Kangaroo STEAM Conference.”',
            'Created posters and infographics highlighting issues like elderly exclusion from kiosk systems.',
            'Carried out in-depth research through interviews and surveys, analyzing data with graphs and detailed reports.',
        ],
    },
    ko: {
        whoAreWe: '우리는 누구인가요?',
        teamIntro:
            '안녕하세요! 저희는 이 앱의 제작자인 조하윤과 김빛나입니다. 오랜 팀원으로서 여러 프로젝트를 통해 강한 협업 능력을 키웠습니다. 제주도에 살면서 저희는 환경 보호에 깊이 전념하고 있으며, 특히 CleanHouse 시설과 같은 독특한 폐기물 관리 시스템을 직접 경험했습니다. 이러한 경험은 CleanHouse 앱을 만들어 환경 보호에 중요한 역할을 강조하도록 영감을 주었습니다.',
        ourActivities: '우리의 활동',
        teamMembers: [
            {name: '김빛나', image: require('../assets/Team_Bitna.png')},
            {name: '조하윤', image: require('../assets/Team_Hayoon.png')},
        ],
        teamImages: [
            {image: require('../assets/Team1.jpeg'), description: '국내 통계 대회에서 발표 중, 중등부 수상.'},
            {image: require('../assets/Team2.png'), description: '캥거루 STEAM 컨퍼런스에서 수상.'},
            {image: require('../assets/Team_stat.png'), description: '키오스크로 인한 노인 소외 문제를 주제로 한 포스터 제작.'},
            {image: require('../assets/Team_stat2.png'), description: '구글 설문조사 폼을 만드는 모습.'},
            {image: require('../assets/Team_survey.png'), description: '키오스크 사용 불편함에 대한 설문조사 진행.'},
            {image: require('../assets/Team_survey2.png'), description: '키오스크 사용 불편함에 대한 추가 설문조사 진행.'},
        ],
        teamActivities: [
            '국내 통계 대회 및 캥거루 STEAM 컨퍼런스와 같은 글로벌 대회에 참가.',
            '세계 문제를 조명하는 인포그래픽과 발표 자료 제작.',
            '인터뷰와 설문조사를 통해 정보를 수집하고 그래프로 정리하여 연구 진행.',
        ],
    },
};

const TeamScreen = () => {
    const navigation = useNavigation();
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const locales = RNLocalize.getLocales();
        if (locales && locales.length > 0) {
            setLanguage(locales[0].languageCode === 'ko' ? 'ko' : 'en');
        }
    }, []);

    const t = translations[language];

    return (
        <ScrollView style={styles.container}>
            {/* Home Button */}
            <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.navigate('Home')}>
                <Icon name="home" size={24} color="#333" />
            </TouchableOpacity>
            

            {/* Who Are We Section */}
            <View style={styles.whoAreWeContainer}>
                <Text style={styles.whoAreWeTitle}>{t.whoAreWe}</Text>
                <View style={styles.teamContainer}>
                    {t.teamMembers.map((member, index) => (
                        <View key={index} style={styles.member}>
                            <Image source={member.image} style={styles.memberImage} />
                            <Text style={styles.memberName}>{member.name}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.teamIntro}>{t.teamIntro}</Text>
            </View>

            {/* Our Activities Section */}
            <View style={styles.activitiesContainer}>
                <Text style={styles.activitiesTitle}>{t.ourActivities}</Text>
                <Swiper
                    autoplay
                    showsPagination={true}
                    dotStyle={styles.dot}
                    activeDotStyle={styles.activeDot}
                    style={styles.swiper}>
                    {t.teamImages.map((item, index) => (
                        <View key={index} style={styles.slide}>
                            <Image source={item.image} style={styles.image} />
                            <Text style={styles.imageDescription}>{item.description}</Text>
                        </View>
                    ))}
                </Swiper>
                {t.teamActivities.map((activity, index) => (
                    <View key={index} style={styles.activityItem}>
                        <Text style={styles.activityBullet}>•</Text>
                        <Text style={styles.activityText}>{activity}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    homeButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    whoAreWeContainer: {
        marginTop: 80,
        paddingHorizontal: 20,
    },
    whoAreWeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
    teamContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    member: {
        alignItems: 'center',
    },
    memberImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 5,
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    teamIntro: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
    },
    activitiesContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    activitiesTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
    swiper: {
        height: 250,
        borderRadius: 10,
        overflow: 'hidden',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    imageDescription: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        fontSize: 14,
        color: '#FFF',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        paddingVertical: 5,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    dot: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: '#4CAF50',
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 3,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    activityBullet: {
        fontSize: 16,
        color: '#4CAF50',
        marginRight: 8,
    },
    activityText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
});

export default TeamScreen;
