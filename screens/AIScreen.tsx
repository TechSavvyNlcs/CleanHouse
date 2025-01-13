import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import {useTensorflowModel} from 'react-native-fast-tflite';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as RNLocalize from 'react-native-localize';

global.Buffer = global.Buffer || require('buffer').Buffer;

const {width} = Dimensions.get('window');

const translations = {
  en: {
    selectImage: 'Select from Gallery',
    takePhoto: 'Take Photo',
    noPermission: 'Please allow camera access to use this feature.',
    resultTitle: 'Classification Result',
    noImage: 'Please take or select a photo.',
  },
  ko: {
    selectImage: '갤러리에서 선택',
    takePhoto: '사진 촬영',
    noPermission: '카메라 권한을 허용해주세요.',
    resultTitle: '분리수거 종류',
    noImage: '사진을 촬영하거나 선택해주세요.',
  },
};

const AIScreen = () => {
  const navigation = useNavigation();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const [language, setLanguage] = useState('en');
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const objectDetection = useTensorflowModel(require('../assets/models/model.tflite'));
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission =
        Platform.OS === 'android'
          ? await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
            )
          : await Camera.requestCameraPermission();

      setCameraPermission(cameraPermission === 'authorized');
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const locales = RNLocalize.getLocales();
    if (locales && locales.length > 0) {
      setLanguage(locales[0].languageCode === 'ko' ? 'ko' : 'en');
    }
  }, []);

  const t = translations[language];

  const selectImageFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        selectionLimit: 1,
      });
      if (result.assets && result.assets.length > 0) {
        const selected = result.assets[0];
        setSelectedImage(selected.uri);
        classifyImage(selected.base64);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to select image from gallery');
    }
  };

  const classifyImage = async (base64Image) => {
    if (!model) {
      Alert.alert('Model not loaded', 'Please wait for the model to load.');
      return;
    }

    try {
      const inputBuffer = Buffer.from(base64Image, 'base64');
      const uint8Array = new Uint8Array(inputBuffer);

      const modelWidth = 224;
      const modelHeight = 224;
      const channels = 3;

      const resizedImage = new Float32Array(modelWidth * modelHeight * channels);
      for (let i = 0; i < resizedImage.length; i++) {
        resizedImage[i] = uint8Array[i % uint8Array.length] / 255.0;
      }

      const outputs = model.runSync([resizedImage]);

      const labels = ['Plastic', 'Paper', 'Daily Disposals'];
      const probabilities = outputs[0];
      const maxIndex = probabilities.indexOf(Math.max(...probabilities));

      if (probabilities[maxIndex] < 0.5) {
        setClassificationResult('Other');
      } else {
        setClassificationResult(labels[maxIndex]);
      }
    } catch (error) {
      console.error('Classification error:', error);
      Alert.alert('Error', 'Failed to classify image');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        setSelectedImage(`file://${photo.path}`);
        // Convert the image to base64 and classify
        // You'll need to implement this part based on your requirements
        setIsCameraActive(false);
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const renderResultCard = () => {
    if (!classificationResult) return null;

    const getIcon = () => {
      switch (classificationResult.toLowerCase()) {
        case 'plastic':
          return 'bottle-soda';
        case 'paper':
          return 'newspaper';
        case 'daily disposals':
          return 'trash-can';
        default:
          return 'help-circle';
      }
    };

    return (
      <View style={styles.resultCard}>
        <Icon name={getIcon()} size={40} color="#4CAF50" />
        <Text style={styles.resultTitle}>{t.resultTitle}</Text>
        <Text style={styles.resultValue}>{classificationResult}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isCameraActive && cameraPermission && device ? (
        <View style={styles.cameraContainer}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isCameraActive}
            ref={cameraRef}
            photo={true}
          />
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.closeCameraButton}
              onPress={() => setIsCameraActive(false)}>
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {/* 홈 버튼 */}
          <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.navigate('Home')}>
                <Icon name="home" size={24} color="#333" />
            </TouchableOpacity>

          {/* 이미지 프리뷰 영역 */}
          <View style={styles.previewArea}>
            {selectedImage ? (
              <Image source={{uri: selectedImage}} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Icon name="image-plus" size={50} color="#ccc" />
                <Text style={styles.placeholderText}>{t.noImage}</Text>
              </View>
            )}
          </View>

          {/* 결과 카드 */}
          {renderResultCard()}

          {/* 하단 버튼 그룹 */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cameraButton]}
              onPress={() => setIsCameraActive(true)}>
              <Icon name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>{t.takePhoto}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.galleryButton]}
              onPress={selectImageFromGallery}>
              <Icon name="image" size={24} color="#fff" />
              <Text style={styles.buttonText}>{t.selectImage}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!cameraPermission && (
        <Text style={styles.permissionText}>{t.noPermission}</Text>
      )}
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
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  previewArea: {
    flex: 1,
    marginTop: 60,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: width - 40,
    height: width - 40,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  placeholderContainer: {
    width: width - 40,
    height: width - 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
  },
  galleryButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeCameraButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  permissionText: {
    color: '#f44336',
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
  },
});

export default AIScreen;
