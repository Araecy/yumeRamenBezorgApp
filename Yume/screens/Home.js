import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useOrders } from '../context/OrderContext';
import { useNavigation } from '@react-navigation/native';
import { useState, useRef } from 'react';
import { theme } from '../theme';

export default function HomeScreen() {
  const { addToOrder } = useOrders();
  const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const popularItems = [
    {
      id: 'p1',
      name: "Chef's Special Ramen",
      price: "15.99",
      description: "Our most popular signature ramen with premium ingredients",
      image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800',
      isPopular: true
    },
    {
      id: 'p2',
      name: "Deluxe Tonkotsu",
      price: "14.99",
      description: "Rich and creamy pork bone broth with extra chashu",
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      isPopular: true
    },
    {
      id: 'p3',
      name: "Spicy Miso Special",
      price: "13.99",
      description: "Spicy miso broth with special toppings",
      image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800',
      isPopular: true
    },
  ];

  const handleItemPress = (item) => {
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: selectedItem?.image }}
            style={styles.modalImage}
          />
          <View style={styles.modalInfo}>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
            <Text style={styles.modalDescription}>{selectedItem?.description}</Text>
            <Text style={styles.modalPrice}>€{selectedItem?.price}</Text>
            
            <View style={styles.highlightBox}>
              <Text style={styles.highlightTitle}>Chef's Note</Text>
              <Text style={styles.highlightText}>
                This is one of our most beloved dishes, crafted with premium ingredients 
                and traditional techniques passed down through generations.
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.actionButton, styles.orderButton]}
                onPress={() => {
                  // Format the order properly before adding
                  const formattedOrder = {
                    ...selectedItem,
                    totalPrice: parseFloat(selectedItem.price),
                    basePrice: selectedItem.price,
                    extras: [] // Add empty extras array for consistency
                  };
                  addToOrder(formattedOrder);
                  setModalVisible(false);
                  Alert.alert('Added to Order', 'Item has been added to your order basket');
                }}
              >
                <Text style={styles.buttonText}>Quick Order</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.customizeButton]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Menu');
                }}
              >
                <Text style={styles.buttonText}>Customize & Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=1600' }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroTitle}>Authentic Japanese Ramen</Text>
          <Text style={styles.heroSubtitle}>Delivered to Your Door</Text>
        </LinearGradient>
      </View>

      {/* Popular Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Popular</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularItems}>
          {popularItems.map((item) => (
            <Animated.View
              key={item.id}
              style={[
                styles.popularItemContainer,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <TouchableOpacity
                style={styles.popularItem}
                onPress={() => handleItemPress(item)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.popularItemImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.itemGradient}
                >
                  <Text style={styles.popularItemTitle}>{item.name}</Text>
                  <Text style={styles.popularItemPrice}>€{item.price}</Text>
                </LinearGradient>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Popular</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Featured Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featuresGrid}>
          {[
            { title: 'Fresh Daily', icon: '🍜' },
            { title: 'Quick Delivery', icon: '🚚' },
            { title: 'Best Quality', icon: '⭐' },
            { title: 'Authentic', icon: '🏯' }
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Special Offers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Offers</Text>
        <View style={styles.offersGrid}>
          <TouchableOpacity style={styles.offerCard}>
            <LinearGradient
              colors={['#e65100', '#fb8c00']}
              style={styles.offerGradient}
            >
              <Text style={styles.offerTitle}>Student Deal</Text>
              <Text style={styles.offerDescription}>20% off on weekdays</Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* More offers... */}
        </View>
      </View>
      {renderModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingBottom: 30, // Add padding at bottom for scrolling
  },
  heroSection: {
    height: 300, // Reduced height to eliminate black space
    position: 'relative',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Add this
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#e65100',
    fontSize: 18,
    marginBottom: 20,
  },
  section: {
    padding: 20,
    marginBottom: 20, // Add consistent bottom margin
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  popularItems: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  popularItem: {
    marginRight: 15,
    width: 150,
  },
  popularItemImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover', // Add this
  },
  popularItemTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  popularItemPrice: {
    color: '#e65100',
    fontSize: 14,
    fontWeight: 'bold',
  },
  offersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center the offers
    gap: 15,
    paddingBottom: 20, // Add padding at bottom
  },
  offerCard: {
    width: '45%', // Keep width percentage
    height: 130,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  offerGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'flex-end',
  },
  offerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offerDescription: {
    color: 'white',
    fontSize: 14,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#e65100',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalInfo: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 15,
  },
  modalPrice: {
    fontSize: 20,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  highlightBox: {
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  highlightTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  highlightText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButton: {
    backgroundColor: theme.colors.primary,
  },
  customizeButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popularItemContainer: {
    marginRight: 15,
  },
  itemGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 15,
    justifyContent: 'flex-end',
    borderRadius: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center the grid
    gap: 15,
    padding: 10,
  },
  featureItem: {
    width: '45%', // Keep width percentage
    aspectRatio: 1, // Make items square
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
  },
  featureIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  featureTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});