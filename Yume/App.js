import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/Home';
import MenuScreen from './screens/Menu';
import DeliveryScreen from './screens/Delivery';
import { useNavigation } from '@react-navigation/native';
import { OrderProvider } from './context/OrderContext';

const Stack = createNativeStackNavigator();

function NavBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" style={styles.icon} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('Menu')}
      >
        <Icon name="bowl-rice" style={styles.icon} />
        <Text style={styles.navText}>Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('Delivery')}
      >
        <Icon name="motorcycle" style={styles.icon} />
        <Text style={styles.navText}>Delivery</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Delivery" component={DeliveryScreen} />
        </Stack.Navigator>

        {/* Render NavBar at the bottom */}
        <NavBar />
      </NavigationContainer>
    </OrderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navButton: {
    padding: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#e65100',
    marginBottom: 4,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  }
});
