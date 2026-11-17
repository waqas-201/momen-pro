import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Check, Compass, MapPin, Shield, X } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';
import { useOnboarding } from '../context/OnboardingContext';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';

interface SchoolOption {
  key: 'hanafi' | 'shafii' | 'maliki' | 'hanbali';
  label: string;
  arabic: string;
  timingNote: string;
}

const SCHOOLS: SchoolOption[] = [
  {
    key: 'hanafi',
    label: 'Hanafi',
    arabic: 'حَنَفِي',
    timingNote: 'Later ‘Asr (double shadow)',
  },
  {
    key: 'shafii',
    label: 'Shafi‘i',
    arabic: 'شَافِعِي',
    timingNote: 'Standard ‘Asr (single shadow)',
  },
  {
    key: 'maliki',
    label: 'Maliki',
    arabic: 'مَالِكِي',
    timingNote: 'Standard ‘Asr (single shadow)',
  },
  {
    key: 'hanbali',
    label: 'Hanbali',
    arabic: 'حَنۢبَلِي',
    timingNote: 'Standard ‘Asr (single shadow)',
  },
];

interface PopularCity {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

const POPULAR_CITIES: PopularCity[] = [
  { name: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },
  { name: 'Madinah', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692 },
  { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784 },
  { name: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587 },
  { name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011 },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.139, longitude: 101.6869 },
  { name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
  { name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
];

export const PrayerSettingsStep: React.FC = () => {
  const {
    fiqh,
    setFiqh,
    locationName,
    setLocationName,
    coordinates,
    setCoordinates,
  } = useOnboarding();

  const [locating, setLocating] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestDeviceLocation = async () => {
    setLocationError(null);
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission denied. Please select your city manually.');
        setLocating(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoordinates({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      // Reverse geocode city name
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const item = geocode[0];
        const city = item.city || item.region || item.subregion || 'Local Horizon';
        const country = item.country ? `, ${item.country}` : '';
        setLocationName(`${city}${country}`);
      } else {
        setLocationName('Current Location');
      }
    } catch {
      setLocationError('Could not fetch GPS. You can select your city manually below.');
    } finally {
      setLocating(false);
    }
  };

  const selectCity = (city: PopularCity) => {
    setCoordinates({ latitude: city.latitude, longitude: city.longitude });
    setLocationName(`${city.name}, ${city.country}`);
    setShowCityPicker(false);
    setLocationError(null);
  };

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <View style={styles.container} testID="flow-step-prayer-settings">
      <QuranicReflection
        arabicText="فَأَقِمْ وَجْهَكَ لِلدِّينِ حَنِيفًا"
        reference="Surah Ar-Rum · 30:30 · excerpt"
        translation="“So direct your face toward the religion, upright in faith.”"
      />

      <StageBeat beat={1} style={styles.header}>
        <Text style={styles.heading}>Your Tradition & Horizon</Text>
        <Text style={styles.subheading}>
          Prayer times depend on your local horizon and school of jurisprudence.
        </Text>
      </StageBeat>

      {/* School of Thought (Fiqh) Section */}
      <StageBeat beat={2} style={styles.section}>
        <Text style={styles.sectionLabel}>SCHOOL OF JURISPRUDENCE (FIQH)</Text>
        <View style={styles.schoolsGrid}>
          {SCHOOLS.map((school) => {
            const isSelected = fiqh === school.key;
            return (
              <TouchableOpacity
                key={school.key}
                style={[styles.schoolCard, isSelected && styles.schoolCardSelected]}
                onPress={() => setFiqh(school.key)}
                activeOpacity={0.8}
                testID={`fiqh-option-${school.key}`}
              >
                <View style={styles.schoolCardHeader}>
                  <Text
                    style={[
                      styles.schoolArabic,
                      isSelected && styles.schoolArabicSelected,
                    ]}
                  >
                    {school.arabic}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Check size={11} color="#061612" strokeWidth={3.2} />
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.schoolLabel,
                    isSelected && styles.schoolLabelSelected,
                  ]}
                >
                  {school.label}
                </Text>
                <Text
                  style={[
                    styles.schoolNote,
                    isSelected && styles.schoolNoteSelected,
                  ]}
                >
                  {school.timingNote}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </StageBeat>

      {/* Location Section */}
      <StageBeat beat={2} style={styles.locationContainer}>
        <Text style={styles.sectionLabel}>LOCAL PRAYER HORIZON</Text>

        <View style={styles.locationCard}>
          {coordinates && locationName ? (
            /* Detected State */
            <View style={styles.locationDetectedRow}>
              <View style={styles.locationIconCircle}>
                <MapPin size={17} color={Colors.darkGold} strokeWidth={2.4} />
              </View>
              <View style={styles.locationInfoCol}>
                <Text style={styles.locationDetectedName} numberOfLines={1}>
                  {locationName}
                </Text>
                <Text style={styles.locationDetectedSub}>
                  Precision coordinates active · Calculated offline
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCityPicker(true)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                testID="change-city-btn"
              >
                <Text style={styles.changeLinkText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Unset State */
            <View style={styles.locationUnsetCol}>
              <TouchableOpacity
                style={styles.enableButton}
                onPress={requestDeviceLocation}
                disabled={locating}
                activeOpacity={0.85}
                testID="enable-device-location-btn"
              >
                {locating ? (
                  <ActivityIndicator size="small" color="#061612" />
                ) : (
                  <>
                    <Compass size={16} color="#061612" strokeWidth={2.4} />
                    <Text style={styles.enableButtonText}>
                      Enable Device Location
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowCityPicker(true)}
                activeOpacity={0.7}
                style={styles.manualLinkWrap}
                testID="choose-city-manually-btn"
              >
                <Text style={styles.manualLinkText}>
                  or select city manually
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {locationError && (
            <Text style={styles.errorText}>{locationError}</Text>
          )}

          {/* Privacy & Compliance Assurance */}
          <View style={styles.reassuranceRow}>
            <Shield size={12} color={Colors.darkGold} strokeWidth={2.2} />
            <Text style={styles.reassuranceText}>
              Coordinates stay strictly on device to compute sun angles offline.
            </Text>
          </View>
        </View>
      </StageBeat>

      {/* Manual City Selector Modal */}
      <Modal
        visible={showCityPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCityPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCityPicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalSheet} testID="city-picker-modal">
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Your City</Text>
                  <TouchableOpacity
                    onPress={() => setShowCityPicker(false)}
                    style={styles.modalCloseBtn}
                  >
                    <X size={17} color={Colors.darkTextSecondary} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.searchInput}
                  placeholder="Search city or country..."
                  placeholderTextColor={Colors.darkTextMuted}
                  value={citySearch}
                  onChangeText={setCitySearch}
                  autoCorrect={false}
                />

                <ScrollView style={styles.citiesList} showsVerticalScrollIndicator={false}>
                  {filteredCities.map((city) => (
                    <TouchableOpacity
                      key={`${city.name}-${city.country}`}
                      style={styles.cityItem}
                      onPress={() => selectCity(city)}
                      activeOpacity={0.7}
                    >
                      <MapPin size={15} color={Colors.darkGold} strokeWidth={2} />
                      <Text style={styles.cityName}>
                        {city.name}, <Text style={styles.countryName}>{city.country}</Text>
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 12,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  heading: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
    color: '#083B32',
    letterSpacing: -0.2,
  },
  subheading: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: 'center',
    color: '#57534E',
    paddingHorizontal: 10,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 10,
    letterSpacing: 1.1,
    color: '#083B32',
    opacity: 0.85,
  },
  schoolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  schoolCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#DFDCD2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  schoolCardSelected: {
    borderColor: '#C8A86B',
    backgroundColor: '#F5EFE3',
  },
  schoolCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  schoolArabic: {
    fontFamily: FontFamilies.amiriBold,
    fontSize: 18,
    color: '#78716C',
  },
  schoolArabicSelected: {
    color: '#083B32',
  },
  checkBadge: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#C8A86B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolLabel: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 13.5,
    color: '#57534E',
  },
  schoolLabelSelected: {
    color: '#083B32',
  },
  schoolNote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
    color: '#78716C',
  },
  schoolNoteSelected: {
    color: '#083B32',
  },
  locationContainer: {
    gap: 8,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#DFDCD2',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 9,
  },
  locationUnsetCol: {
    alignItems: 'center',
    gap: 8,
  },
  enableButton: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#C8A86B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  enableButtonText: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 13,
    color: '#061612',
  },
  manualLinkWrap: {
    paddingVertical: 2,
  },
  manualLinkText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11.5,
    color: '#083B32',
    textDecorationLine: 'underline',
  },
  locationDetectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(200, 168, 107, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfoCol: {
    flex: 1,
  },
  locationDetectedName: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 13.5,
    color: '#083B32',
  },
  locationDetectedSub: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10.5,
    color: '#78716C',
  },
  changeLinkText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 12,
    color: '#C8A86B',
  },
  errorText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 10.5,
    color: '#DC2626',
    textAlign: 'center',
  },
  reassuranceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F4EDDF',
  },
  reassuranceText: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
    color: '#78716C',
    flex: 1,
    lineHeight: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 10, 8, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 360,
    maxHeight: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 19,
    color: '#083B32',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#DFDCD2',
    paddingHorizontal: 12,
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    color: '#083B32',
  },
  citiesList: {
    maxHeight: 260,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4EDDF',
  },
  cityName: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 13,
    color: '#083B32',
  },
  countryName: {
    fontFamily: FontFamilies.sansRegular,
    color: '#78716C',
  },
});
