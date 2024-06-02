// import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Ionicons } from "@expo/vector-icons"
// import { useState } from 'react';
// import  NavigationContainer  from '@react-navigation/native';
// import  createStackNavigator  from '@react-navigation/native-stack';
// const { width } = Dimensions.get("window")

// const pinLength = 4
// const pinContainer = width / 2
// const pinSize = pinContainer / pinLength
// const dialNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"]
// const dialPadSize = width * 0.2
// const dialFontSize = dialPadSize / 3

// const arraysEqual = (arr1: number[], arr2: number[]) => {
//   if (arr1.length !== arr2.length) return false;
//   for (let i = 0; i < arr1.length; i++) {
//     if (arr1[i] !== arr2[i]) return false;
//   }
//   return true;
// };

// const DialPad = ({ onPress }: { onPress: (item: typeof dialNums[number]) => void }) => {
//   return (
//     <FlatList
//       numColumns={3}
//       style={{ flexGrow: 0 }}
//       data={dialNums}
//       keyExtractor={(_, index) => index.toString()}
//       renderItem={({ item }) => {
//         return <TouchableOpacity
//           onPress={() => { onPress(item) }}
//         >
//           <View
//             style={styles.DialPad}
//           >
//             {item === "del" ? <Ionicons
//               name='backspace-outline'
//               size={dialFontSize}
//             />
//               : <Text style={{ fontSize: dialFontSize }}>{item}</Text>
//             }
//           </View>
//         </TouchableOpacity>
//       }}
//     />
//   )
// }

// export default function App() {
//   const [pin, setPin] = useState<number[]>([])
//   console.log(pin);
//   const code = [1, 1, 1, 1]

//   return (
//     <View style={styles.container}>
//       <View style={styles.PinView}>{[...Array(pinLength).keys()].map(i => {
//         const isSelected = pin[i] !== undefined;
//         return (<View key={`pin-${i}`}
//           style={{ width: pinSize, height: isSelected ? pinSize : 2, backgroundColor: "red" }}></View>)
//       }
//       )}</View>
//       <DialPad onPress={(item) => {
//         if (item === "del") {
//           if (!(pin.length === 0)) {
//             setPin(pin.slice(0, pin.length - 1))
//             // setPin([])
//           }
//           else {
//             return
//           }
//         }
//         else if (typeof item === 'number') {
//           if (pin.length === pinLength) return;
//           const newPin = [...pin, item];
//           setPin(newPin);
//           if (arraysEqual(newPin, code)) {
//             console.log("Alindi");
//           }
//         }
//       }} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   DialPad: {
//     width: dialPadSize,
//     height: dialPadSize,
//     borderWidth: 1,
//     borderColor: "black",
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   PinView: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     gap: 5,
//     marginBottom: 50
//   }
// });

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './app/screens/home/Home';
import PinScreen from './app/screens/pin/Pin';

const MainStack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer >
        <MainStack.Navigator initialRouteName="Pin">
          <MainStack.Screen name="Pin" component={PinScreen} />
          <MainStack.Screen name="Home" component={Home} />
        </MainStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>

  )
}

export default App

const styles = StyleSheet.create({})