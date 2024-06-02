import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window")

const pinLength = 4
const pinContainer = width / 2
const pinSize = pinContainer / pinLength
const dialNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"]
const dialPadSize = width * 0.2
const dialFontSize = dialPadSize / 3

export type RootStackParamList = {
  Pin: undefined;
  Home: undefined;
};

type PinScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Pin'>;

const arraysEqual = (arr1: number[], arr2: number[]) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

const DialPad = ({ onPress }: { onPress: (item: typeof dialNums[number]) => void }) => {
  return (
    <FlatList
      numColumns={3}
      style={{ flexGrow: 0 }}
      data={dialNums}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => {
        return <TouchableOpacity
          onPress={() => { onPress(item) }}
        >
          <View
            style={styles.DialPad}
          >
            {item === "del" ? <Ionicons
              name='backspace-outline'
              size={dialFontSize}
            />
              : <Text style={{ fontSize: dialFontSize }}>{item}</Text>
            }
          </View>
        </TouchableOpacity>
      }}
    />
  )
}

export default function PinScreen() {
  const [pin, setPin] = useState<number[]>([])
  const [error, setError] = useState(false)
  const [code, setCode] = useState([1, 1, 1, 1])
  const [errorCount, setErrorCount] = useState(0)
  const navigation = useNavigation<PinScreenNavigationProp>();
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const checkErrorState = async () => {
      const errorTimestamp = await AsyncStorage.getItem('errorTimestamp');
      const storedErrorCount = await AsyncStorage.getItem('errorCount');
      if (storedErrorCount) {
        setErrorCount(parseInt(storedErrorCount, 10));
      }
      if (errorTimestamp) {
        const timeDiff = Date.now() - parseInt(errorTimestamp, 10);
        if (timeDiff < 3000) {
          setIsWaiting(true);
          setTimeout(() => {
            setIsWaiting(false);
            AsyncStorage.removeItem('errorTimestamp');
            setErrorCount(0);
            AsyncStorage.setItem('errorCount', '0');
          }, 3000 - timeDiff);
        }
      }
    };

    checkErrorState();
  }, []);

  const handleError = async () => {
    setError(true);
    const newErrorCount = errorCount + 1;
    setErrorCount(newErrorCount);
    await AsyncStorage.setItem('errorCount', newErrorCount.toString());
    setPin([]);
    if (newErrorCount >= 3) {
      setIsWaiting(true);
      const timestamp = Date.now().toString();
      await AsyncStorage.setItem('errorTimestamp', timestamp);
      setTimeout(() => {
        setIsWaiting(false);
        setError(false);
        setErrorCount(0);
        AsyncStorage.removeItem('errorTimestamp');
        AsyncStorage.setItem('errorCount', '0');
      }, 3000); // Reset error state after 3 seconds
    }
  };

  return (
    <>
      {isWaiting
        ? <View style={styles.container}><Text>3 Saniye gozlede a bala</Text></View>
        : <View style={styles.container}>
          <View style={styles.PinView}>{[...Array(pinLength).keys()].map(i => {
            const isSelected = pin[i] !== undefined;
            return (<View key={`pin-${i}`}
              style={{ width: pinSize, height: isSelected ? pinSize : 2, backgroundColor: "red" }}></View>)
          }
          )}</View>
          <Text>{error ? "Pincode is incorrect" : ""}</Text>
          <DialPad onPress={(item) => {
            if (item === "del") {
              if (!(pin.length === 0)) {
                setPin(pin.slice(0, pin.length - 1))
              }
              else {
                return
              }
            }
            else if (typeof item === 'number') {
              if (pin.length === pinLength) return;
              const newPin = [...pin, item];
              setPin(newPin);
              if (arraysEqual(newPin, code)) {
                navigation.navigate("Home")
                setError(false)
                setErrorCount(0)
                setPin([])
                console.log(errorCount);

              }
              else if (pin.length === pinLength - 1 && !(arraysEqual(newPin, code))) {
                // setError(true)
                // setErrorCount(errorCount + 1)
                // setPin([])
                // console.log(errorCount + 1);
                handleError()
              }
            }
          }} />
        </View>
        // : <View style={styles.container}><Text>Salam</Text></View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  DialPad: {
    width: dialPadSize,
    height: dialPadSize,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  PinView: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
    marginBottom: 50
  }
});
