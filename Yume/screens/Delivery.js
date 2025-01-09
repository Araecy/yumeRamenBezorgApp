import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { useOrders } from '../context/OrderContext';
import { useState } from 'react';

export default function DeliveryScreen() {
  const { orders, totalAmount, removeFromOrder, clearOrders } = useOrders();
  const [fadeAnims, setFadeAnims] = useState(() => 
    new Array(orders.length).fill(null).map(() => new Animated.Value(1))
  );

  const handleCheckout = () => {
    Alert.alert(
      'Confirm Order',
      'Would you like to place this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Place Order',
          onPress: () => {
            // Here you would typically send the order to a backend
            Alert.alert('Order Placed!', 'Your ramen is being prepared.');
            clearOrders();
          },
        },
      ]
    );
  };

  const handleRemoveWithAnimation = (itemId, index) => {
    const newFadeAnims = [...fadeAnims];
    Animated.timing(newFadeAnims[index], {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      removeFromOrder(itemId);
      newFadeAnims.splice(index, 1);
      setFadeAnims(newFadeAnims);
    });
  };

  const renderOrderItem = (item, index) => (
    <Animated.View 
      key={item.id}
      style={[
        styles.orderItem,
        { opacity: fadeAnims[index] }
      ]}
    >
      <View style={styles.orderItemInfo}>
        <Text style={styles.orderItemName}>{item.name}</Text>
        <Text style={styles.orderItemBasePrice}>Base price: €{item.basePrice}</Text>
        {item.extras && item.extras.length > 0 && (
          <View style={styles.extrasContainer}>
            {item.extras.map((extra, i) => (
              <Text key={i} style={styles.extraItem}>
                + {extra.quantity}x {extra.name} (€{(extra.price * extra.quantity).toFixed(2)})
              </Text>
            ))}
          </View>
        )}
        <Text style={styles.orderItemPrice}>
          Total: €{item.totalPrice}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={() => handleRemoveWithAnimation(item.id, index)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1629397685944-9ffa66c9b458?w=1600' }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroTitle}>Fast Delivery</Text>
          <Text style={styles.heroSubtitle}>Hot Ramen to Your Door</Text>
        </LinearGradient>
      </View>

      {/* Order Summary */}
      {orders.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          {orders.map(renderOrderItem)}
          
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Total: €{totalAmount.toFixed(2)}</Text>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyOrder}>
          <Text style={styles.emptyOrderText}>No items in your order</Text>
        </View>
      )}

      {/* Delivery Info */}
      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Delivery Hours</Text>
          <Text style={styles.infoText}>Monday - Sunday</Text>
          <Text style={styles.infoText}>11:00 - 22:00</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Delivery Area</Text>
          <Text style={styles.infoText}>Within 5km radius</Text>
          <Text style={styles.infoHighlight}>Free delivery over €25</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroSection: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  heroSubtitle: {
    color: theme.colors.primary,
    fontSize: 18,
    marginBottom: theme.spacing.lg,
  },
  section: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  infoTitle: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  infoText: {
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: theme.spacing.xs,
  },
  infoHighlight: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: theme.spacing.sm,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  orderItemBasePrice: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  orderItemPrice: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  removeButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  totalSection: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  totalText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyOrder: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyOrderText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  extrasContainer: {
    marginTop: 4,
  },
  extraItem: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginLeft: 8,
  },
});