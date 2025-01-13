import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import {useTensorflowModel} from 'react-native-fast-tflite';

global.Buffer = global.Buffer || require('buffer').Buffer;

const TestScreen = () => {
  const navigation = useNavigation();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
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

	  console.log(outputs);
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

  return (
    <View style={styles.container}>
      {isCameraActive && cameraPermission && device ? (
        <View style={styles.cameraContainer}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isCameraActive}
            ref={cameraRef}
          />
          <Button
            title="Close Camera"
            onPress={() => setIsCameraActive(false)}
          />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Button title="Home" onPress={() => navigation.navigate('Home')} />
          <Button
            title="Onboarding"
            onPress={() => navigation.navigate('Onboarding')}
          />
          <Button
            title="Open Camera"
            onPress={() => setIsCameraActive(true)}
          />
          <Button title="Select from Gallery" onPress={selectImageFromGallery} />
          {selectedImage && (
            <View style={styles.imagePreview}>
              <Text>Selected Image:</Text>
              <Image source={{uri: selectedImage}} style={styles.image} />
            </View>
          )}
          {classificationResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Classification Result:</Text>
              <Text style={styles.resultText}>{classificationResult}</Text>
            </View>
          )}
        </View>
      )}
      {!cameraPermission && (
        <Text style={styles.permissionText}>
          Please allow camera access to use this feature.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default TestScreen;
