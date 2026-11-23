import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
} from 'lucide-react-native';
import { FontFamilies } from '../theme/typography';
import { QuranicReflection } from '../components/QuranicReflection';
import { StageBeat } from '../flow/StageBeat';
import { useOnboarding } from '../context/OnboardingContext';
import {
  DHIKR_CATEGORIES,
  type DhikrCategory,
  type DhikrSubItem,
} from './dhikrData';

export const RemembranceStep: React.FC = () => {
  const { adhkarRoutines, setAdhkarRoutines } = useOnboarding();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    morning: true, // Start with morning expanded so user sees the accordion capability immediately
  });

  const isNoneSelected =
    adhkarRoutines.length === 1 && adhkarRoutines[0] === 'No current routine';

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const isSubItemSelected = (itemId: string): boolean => {
    return adhkarRoutines.includes(itemId);
  };

  const toggleSubItem = (itemId: string) => {
    setAdhkarRoutines((prev) => {
      const filtered = prev.filter((id) => id !== 'No current routine');
      if (filtered.includes(itemId)) {
        const next = filtered.filter((id) => id !== itemId);
        return next.length > 0 ? next : ['No current routine'];
      } else {
        return [...filtered, itemId];
      }
    });
  };

  const toggleCategoryAll = (category: DhikrCategory) => {
    const itemIds = category.items.map((i) => i.id);
    const allSelected = itemIds.every((id) => adhkarRoutines.includes(id));

    setAdhkarRoutines((prev) => {
      const filtered = prev.filter((id) => id !== 'No current routine');
      if (allSelected) {
        // Deselect all items in this category
        const next = filtered.filter((id) => !itemIds.includes(id));
        return next.length > 0 ? next : ['No current routine'];
      } else {
        // Select all items in this category
        const newSet = new Set([...filtered, ...itemIds]);
        return Array.from(newSet);
      }
    });
  };

  const handleSelectNone = () => {
    setAdhkarRoutines(['No current routine']);
  };

  const getStationIcon = (id: string) => {
    const props = { size: 16, color: '#083B32', strokeWidth: 2.2 };
    switch (id) {
      case 'waking_up':
        return <Sunrise {...props} />;
      case 'morning':
        return <Sun {...props} />;
      case 'after_prayer':
        return <Sparkles {...props} />;
      case 'evening':
        return <Sunset {...props} />;
      case 'before_sleep':
        return <Moon {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <View style={styles.mainContent}>
      <QuranicReflection
        arabicText="اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا"
        reference="Surah Al-Ahzab · 33:41 · excerpt"
        translation="“Remember Allah with much remembrance.”"
      />

      <View style={styles.questionSection}>
        <Text style={styles.title}>Do you practice daily dhikr?</Text>
        <Text style={styles.subtitle}>
          Choose your stations from dawn to night. Tap chevron to customize specific azkar.
        </Text>
      </View>

      <StageBeat style={styles.scrollWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {DHIKR_CATEGORIES.map((category) => {
            const isExpanded = Boolean(expandedCategories[category.id]);
            const selectedCount = category.items.filter((item) =>
              isSubItemSelected(item.id)
            ).length;
            const totalCount = category.items.length;
            const isAllSelected = selectedCount === totalCount;
            const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;

            return (
              <View
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCount > 0
                    ? styles.categoryCardSelected
                    : styles.categoryCardUnselected,
                ]}
              >
                {/* Category Header Row */}
                <View style={styles.categoryHeader}>
                  <TouchableOpacity
                    style={styles.categoryMainTouch}
                    onPress={() => toggleCategoryAll(category)}
                    activeOpacity={0.75}
                    testID={`routine-category-${category.id}`}
                  >
                    <View style={styles.iconCircle}>
                      {getStationIcon(category.id)}
                    </View>

                    <View style={styles.titleInfo}>
                      <View style={styles.titleRow}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        <Text style={styles.arabicBadge}>{category.arabicTitle}</Text>
                      </View>
                      <Text style={styles.timeLabel}>{category.timeLabel}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Actions on right: status count & check & chevron */}
                  <View style={styles.headerActions}>
                    <TouchableOpacity
                      onPress={() => toggleCategoryAll(category)}
                      style={[
                        styles.selectionCountPill,
                        selectedCount > 0
                          ? styles.selectionCountPillActive
                          : styles.selectionCountPillInactive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.selectionCountText,
                          selectedCount > 0
                            ? styles.selectionCountTextActive
                            : styles.selectionCountTextInactive,
                        ]}
                      >
                        {selectedCount === 0
                          ? '0'
                          : `${selectedCount}/${totalCount}`}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => toggleCategoryAll(category)}
                      style={[
                        styles.indicatorCircle,
                        isAllSelected
                          ? styles.indicatorCircleActive
                          : isPartiallySelected
                          ? styles.indicatorCirclePartial
                          : styles.indicatorCircleInactive,
                      ]}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                    >
                      {isAllSelected && (
                        <Check size={10} color="#FFFFFF" strokeWidth={3} />
                      )}
                      {isPartiallySelected && (
                        <View style={styles.partialDot} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => toggleExpand(category.id)}
                      style={styles.chevronButton}
                      activeOpacity={0.6}
                      hitSlop={{ top: 10, bottom: 10, left: 8, right: 10 }}
                      testID={`routine-expand-${category.id}`}
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} color="#083B32" strokeWidth={2.4} />
                      ) : (
                        <ChevronDown size={16} color="#78716C" strokeWidth={2.4} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Sub-items Accordion */}
                {isExpanded && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.categoryDesc}>
                      {category.description}
                    </Text>

                    <View style={styles.subItemsList}>
                      {category.items.map((subItem: DhikrSubItem) => {
                        const isSelected = isSubItemSelected(subItem.id);
                        return (
                          <TouchableOpacity
                            key={subItem.id}
                            style={[
                              styles.subItemRow,
                              isSelected
                                ? styles.subItemRowSelected
                                : styles.subItemRowUnselected,
                            ]}
                            onPress={() => toggleSubItem(subItem.id)}
                            activeOpacity={0.75}
                            testID={`routine-item-${subItem.id}`}
                          >
                            <View style={styles.subItemInfo}>
                              <Text
                                style={[
                                  styles.subItemName,
                                  isSelected && styles.subItemNameSelected,
                                ]}
                              >
                                {subItem.name}
                              </Text>
                              <Text style={styles.subItemArabic}>
                                {subItem.arabicSnippet}
                              </Text>
                              <Text style={styles.subItemNote}>
                                {subItem.hadithNote}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.subItemIndicator,
                                isSelected
                                  ? styles.indicatorCircleActive
                                  : styles.indicatorCircleInactive,
                              ]}
                            >
                              {isSelected && (
                                <Check size={9} color="#FFFFFF" strokeWidth={3} />
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          {/* No current routine option */}
          <TouchableOpacity
            style={[
              styles.noRoutineCard,
              isNoneSelected
                ? styles.categoryCardSelected
                : styles.categoryCardUnselected,
            ]}
            onPress={handleSelectNone}
            activeOpacity={0.8}
            testID="routine-no-current-routine"
          >
            <View style={styles.noRoutineInfo}>
              <Text
                style={[
                  styles.noRoutineTitle,
                  isNoneSelected && styles.noRoutineTitleActive,
                ]}
              >
                No current routine — I want to start fresh
              </Text>
              <Text style={styles.noRoutineSubtitle}>
                Begin your journey gently; you can adopt routines anytime.
              </Text>
            </View>

            <View
              style={[
                styles.indicatorCircle,
                isNoneSelected
                  ? styles.indicatorCircleActive
                  : styles.indicatorCircleInactive,
              ]}
            >
              {isNoneSelected && (
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </StageBeat>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  questionSection: {
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 3,
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamilies.serifSemiBold,
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'center',
    color: '#083B32',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: '#57534E',
    paddingHorizontal: 12,
  },
  scrollWrapper: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 16,
    gap: 8,
  },
  categoryCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DA',
  },
  categoryCardSelected: {
    backgroundColor: '#FCFAF6',
    borderColor: '#C8A86B',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 52,
  },
  categoryMainTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5EFE3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 168, 107, 0.4)',
  },
  titleInfo: {
    flex: 1,
    gap: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  categoryTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 13,
    color: '#083B32',
  },
  arabicBadge: {
    fontFamily: FontFamilies.amiriBold,
    fontSize: 12,
    color: '#C8A86B',
    lineHeight: 16,
  },
  timeLabel: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10.5,
    color: '#78716C',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 6,
  },
  selectionCountPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  selectionCountPillInactive: {
    backgroundColor: '#F4EDDF',
    borderColor: '#DFDCD2',
  },
  selectionCountPillActive: {
    backgroundColor: '#083B32',
    borderColor: '#083B32',
  },
  selectionCountText: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 10,
  },
  selectionCountTextInactive: {
    color: '#78716C',
  },
  selectionCountTextActive: {
    color: '#FAF9F6',
  },
  indicatorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorCircleInactive: {
    borderWidth: 1,
    borderColor: '#DFDCD2',
    backgroundColor: 'transparent',
  },
  indicatorCirclePartial: {
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    backgroundColor: '#F5EFE3',
  },
  indicatorCircleActive: {
    borderWidth: 1,
    backgroundColor: '#083B32',
    borderColor: '#083B32',
  },
  partialDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C8A86B',
  },
  chevronButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  accordionContent: {
    borderTopWidth: 1,
    borderTopColor: '#F0ECE1',
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 8,
  },
  categoryDesc: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 11,
    lineHeight: 14,
    color: '#78716C',
    fontStyle: 'italic',
  },
  subItemsList: {
    gap: 6,
  },
  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  subItemRowUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFECE4',
  },
  subItemRowSelected: {
    backgroundColor: '#F7F2E7',
    borderColor: '#C8A86B',
  },
  subItemInfo: {
    flex: 1,
    gap: 2,
  },
  subItemName: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 12,
    color: '#083B32',
  },
  subItemNameSelected: {
    color: '#083B32',
  },
  subItemArabic: {
    fontFamily: FontFamilies.amiriRegular,
    fontSize: 13,
    color: '#8A6D3B',
    lineHeight: 18,
    writingDirection: 'rtl',
  },
  subItemNote: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10,
    lineHeight: 13,
    color: '#78716C',
  },
  subItemIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRoutineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 2,
  },
  noRoutineInfo: {
    flex: 1,
    gap: 1,
    marginRight: 10,
  },
  noRoutineTitle: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 12.5,
    color: '#57534E',
  },
  noRoutineTitleActive: {
    color: '#083B32',
    fontWeight: '600',
  },
  noRoutineSubtitle: {
    fontFamily: FontFamilies.sansRegular,
    fontSize: 10.5,
    color: '#78716C',
  },
});
