import React from 'react';
import { AppLoading } from 'expo'
import {StatusBar} from 'react-native'

//Fore ReacNative View is like the Div Html Tag
import { StyleSheet, Text, View } from 'react-native';

import {Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto'
import {Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu'

import Routes from './src/routes'

export default function App() {

  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_500Medium, Ubuntu_700Bold})

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    //This is a fragment that dont create a new element on screen
    <>
      <StatusBar />
      <Routes />
    </>
  );
}

//ReacNative will use this JSON as the CSS
//The syntax is almost the same
//One of major differences is that instead of using backgroud-color,
//you go for bakcgroundColor wich C capitalyzed
//And for values use quotes
//There is also no css inheritance system
//And you need to add the style to every component (you cant create a style "VIEW" and expect all views will render the way you desire)
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/