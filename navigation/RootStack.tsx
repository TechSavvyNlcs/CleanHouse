import React, { useState,useEffect } from "react";
import { Platform  } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from "react-native-splash-screen";
import HomeScreen from '../screens/HomeScreen';
import GuideScreen from '../screens/GuideScreen';
import OnboardingScreen from '../screens/OnboardingScreen'
import TeamScreen from '../screens/TeamScreen'
import AIScreen from "../screens/AIScreen";
import TestScreen from '../screens/TestScreen'
import { getItem } from "../utils/asyncStorage";

const Stack = createNativeStackNavigator();
let initialRouteName = 'Onboarding';
function RootStack() {

  const [showOnboarding, setShowOnboarding] = useState(null);
  useEffect(() => {
    if (Platform.OS === "android") { SplashScreen.hide(); } 
    else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000); 
    }

    checkAlreadyOnboarded();
  }, []);

  const checkAlreadyOnboarded = async ()=> {
    let onboarded = await getItem('onboarded');
    if (onboarded==1){
      setShowOnboarding(false);
    }else {
      setShowOnboarding(true);
    }
  }

  if (showOnboarding==null){
    return null;
  }

  if (showOnboarding){ initialRouteName = 'Onboarding'; } 
  else {  initialRouteName = 'Home';}
  return (
    <Stack.Navigator initialRouteName = {initialRouteName}>
      <Stack.Screen name="Onboarding" options={{headerShown : false }} component={OnboardingScreen} />
      <Stack.Screen name="Home" options = {{headerShown : false }} component={HomeScreen} />
      <Stack.Screen name="Guide" options = {{headerShown : false }}  component={GuideScreen} />
      <Stack.Screen name="Team" options = {{headerShown : false }}  component={TeamScreen} />
      <Stack.Screen name="AI" options = {{headerShown : false }}  component={AIScreen} />
      <Stack.Screen name="Test" options = {{headerShown : false }}  component={TestScreen} />
    </Stack.Navigator>
  );
}

export default RootStack;