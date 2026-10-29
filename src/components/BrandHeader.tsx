import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';

interface BrandHeaderProps {
  onBack?: () => void;
  backText?: string;
  showBack?: boolean;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  onBack,
  backText = 'Back',
  showBack = true,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            testID="header-back-button"
          >
            {backText !== 'Done' && (
              <ChevronLeft size={16} color={Colors.primary} strokeWidth={2.4} />
            )}
            <Text style={styles.backText}>{backText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.centerContainer}>
        <Image
          source={require('../../assets/momen-pro-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.rightPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  leftContainer: {
    width: 64,
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    fontWeight: '500',
    color: Colors.primary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 82,
    height: 65,
  },
  rightPlaceholder: {
    width: 64,
  },
});
