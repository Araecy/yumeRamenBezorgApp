import { View, Text, ImageBackground, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Alert, Animated } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { useOrders } from '../context/OrderContext';

export default function MenuScreen() {
  const navigation = useNavigation();
  const { addToOrder, orders } = useOrders();

  const menuItems = [
    {
      id: 'p1',
      name: "Chef's Special Ramen",
      price: "15.99",
      description: "Our most popular signature ramen with premium ingredients",
      image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1",
      isPopular: true
    },
    {
      id: 'p2',
      name: "Deluxe Tonkotsu",
      price: "14.99",
      description: "Rich and creamy pork bone broth with extra chashu",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
      isPopular: true
    },
    {
      id: 'p3',
      name: "Spicy Miso Special",
      price: "13.99",
      description: "Spicy miso broth with special toppings",
      image: "https://images.unsplash.com/photo-1552611052-33e04de081de",
      isPopular: true
    },
    {
      id: 1,
      name: "Tonkotsu Ramen",
      price: "13.99",
      description: "Rich pork bone broth with chashu, egg, and noodles",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624"
    },
    {
      id: 2,
      name: "Miso Ramen",
      price: "12.99",
      description: "Savory miso broth with corn, butter, and pork",
      image: "https://images.unsplash.com/photo-1552611052-33e04de081de"
    },
    {
      id: 3,
      name: "Shoyu Ramen",
      price: "11.99",
      description: "Classic soy sauce based broth with chicken",
      image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1"
    },
    {
      id: 4,
      name: "Spicy Ramen",
      price: "14.99",
      description: "Fiery spicy broth with ground pork and bamboo",
      image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e"
    },
    {
      id: 5,
      name: "Veggie Ramen",
      price: "12.99",
      description: "Vegetable broth with mushrooms and tofu",
      image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb"
    }
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [expandAnimation] = useState(new Animated.Value(0));
  
  const extraOptions = [
    { id: 'egg', name: 'Extra Egg', price: 1.50 },
    { id: 'noodles', name: 'Extra Noodles', price: 2.00 },
    { id: 'chashu', name: 'Extra Chashu', price: 3.00 },
    { id: 'bamboo', name: 'Bamboo Shoots', price: 1.50 },
    { id: 'corn', name: 'Corn', price: 1.00 },
  ];

  const updateQuantity = (extraId, change) => {
    setQuantities(prev => ({
      ...prev,
      [extraId]: Math.max(0, (prev[extraId] || 0) + change)
    }));
  };

  const calculateTotalPrice = (basePrice) => {
    const extrasTotal = Object.entries(quantities).reduce((total, [extraId, quantity]) => {
      const extra = extraOptions.find(opt => opt.id === extraId);
      return total + (extra ? extra.price * quantity : 0);
    }, 0);
    return (parseFloat(basePrice) + extrasTotal).toFixed(2);
  };

  const toggleExpand = (itemId) => {
    if (expandedId === itemId) {
      // Animate closing
      Animated.timing(expandAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setExpandedId(null);
        setQuantities({}); // Reset quantities when closing
      });
    } else {
      // Reset quantities and animate opening for new item
      setQuantities({}); // Reset quantities when opening new item
      setExpandedId(itemId);
      Animated.timing(expandAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderMenuItem = ({ item }) => (
    <View>
      <TouchableOpacity 
        style={[styles.card, item.isPopular && styles.popularCard]} 
        onPress={() => toggleExpand(item.id)}
      >
        <Image 
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>€{item.price}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>Popular</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {expandedId === item.id && (
        <Animated.View style={[
          styles.expandedSection,
          {
            opacity: expandAnimation,
            maxHeight: expandAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500] // Adjust max height as needed
            }),
            transform: [{
              translateY: expandAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }]
          }
        ]}>
          <Text style={styles.customizeTitle}>Customize Your Ramen</Text>
          <View style={styles.extrasContainer}>
            {extraOptions.map(option => (
              <View key={option.id} style={styles.extraOptionRow}>
                <View style={styles.extraOptionInfo}>
                  <Text style={styles.extraOptionText}>
                    {option.name} (€{option.price.toFixed(2)} each)
                  </Text>
                </View>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(option.id, -1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {quantities[option.id] || 0}
                  </Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(option.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.orderSection}>
            <Text style={styles.totalPrice}>
              Total: €{calculateTotalPrice(item.price)}
            </Text>
            <TouchableOpacity
              style={styles.addToOrderButton}
              onPress={() => {
                const extras = Object.entries(quantities)
                  .filter(([_, quantity]) => quantity > 0)
                  .map(([extraId, quantity]) => {
                    const extra = extraOptions.find(opt => opt.id === extraId);
                    return {
                      ...extra,
                      quantity,
                      totalPrice: parseFloat((extra.price * quantity).toFixed(2))
                    };
                  });
                
                const basePrice = parseFloat(item.price);
                const extrasTotal = extras.reduce((total, extra) => total + extra.totalPrice, 0);
                const finalTotal = parseFloat((basePrice + extrasTotal).toFixed(2));
                
                addToOrder({
                  ...item,
                  extras,
                  totalPrice: finalTotal,
                  basePrice: item.price,
                });
                setQuantities({});
                setExpandedId(null);
              }}
            >
              <Text style={styles.addToOrderText}>Add to Order</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleOrder = (item) => {
    addToOrder(item);
    setModalVisible(false);
    
    // Show feedback toast or alert
    Alert.alert('Added to Order', 'Item has been added to your order basket');
  };

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=1600' }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={['transparent', theme.colors.background]}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroTitle}>Our Menu</Text>
          <Text style={styles.heroSubtitle}>Authentic Japanese Flavors</Text>
        </LinearGradient>
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id.toString()}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categories</Text>
            {/* Add category filters here if needed */}
          </View>
        }
      />

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Image 
                    source={{ uri: selectedItem.image }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.modalTitle}>Order {selectedItem.name}?</Text>
                  <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                  <Text style={styles.modalPrice}>€{selectedItem.price}</Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.orderButton} onPress={() => handleOrder(selectedItem)}>
                      <Text style={styles.orderButtonText}>Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* Add Floating Order Button when there are items */}
      {orders.length > 0 && (
        <TouchableOpacity 
          style={styles.orderFloatingButton}
          onPress={() => navigation.navigate('Delivery')}
        >
          <Text style={styles.orderFloatingText}>
            View Order ({orders.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  heroSection: {
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: 'white',
    fontSize: 18,
  },
  filterSection: {
    padding: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  headerText: {
    color: 'white',
    fontSize: 32,
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 80, // Add padding for navigation bar
  },
  card: {
    flexDirection: 'row',
    margin: 8,
    padding: 15,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text, // Add this
  },
  itemPrice: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Update this
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text, // Update this
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: theme.colors.textSecondary, // Update this
  },
  modalPrice: {
    fontSize: 18,
    color: '#e65100',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  orderButton: {
    flex: 1,
    backgroundColor: '#e65100',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  orderFloatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  orderFloatingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  expandedSection: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 8,
    marginTop: -8,
    marginBottom: 8,
    padding: 15,
    borderBottomLeftRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    overflow: 'hidden', // Add this to handle animation cleanly
  },
  customizeTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  extrasContainer: {
    gap: 8,
  },
  extraOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  extraOptionInfo: {
    flex: 1,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    backgroundColor: theme.colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    color: theme.colors.text,
    fontSize: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  extraOptionText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  extraOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  orderSection: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addToOrderButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.sm,
  },
  addToOrderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  popularCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});