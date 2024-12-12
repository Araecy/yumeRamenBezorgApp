
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Layout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: 'black' },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'gray',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color}) => <Icon name="user" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({color}) => <Icon name="cutlery" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="delivery"
        options={{
          title: 'Delivery',
          tabBarIcon: ({color}) => <Icon name="truck" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}