import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { Colors } from '../theme/colors';
import { FontFamilies } from '../theme/typography';
import type { PrayerName } from '../checkins/types';

export type PrayerIdentifier = PrayerName | 'dhuhr';

export interface CelestialSkylineProps {
  /** The currently active or highlighted prayer */
  activePrayer?: PrayerIdentifier;
  /** Component height in dp (defaults to 175) */
  height?: number;
  /** Optional container style */
  style?: StyleProp<ViewStyle>;
  /** Optional testID */
  testID?: string;
  /** Optional callback when a prayer node is selected/tapped */
  onSelectPrayer?: (prayer: PrayerName) => void;
}

interface ArcNode {
  name: PrayerName;
  label: string;
  t: number;
  x: number;
  y: number;
  labelY: number;
  isCelestialSun: boolean;
}

const ARC_NODES: ArcNode[] = [
  {
    name: 'fajr',
    label: 'Fajr',
    t: 0.1,
    x: 60,
    y: 104,
    labelY: 84,
    isCelestialSun: false, // Dawn crescent & morning star
  },
  {
    name: 'zuhr',
    label: 'Dhuhr',
    t: 0.5,
    x: 180,
    y: 54,
    labelY: 28,
    isCelestialSun: true, // Midday radiant sun
  },
  {
    name: 'asr',
    label: 'Asr',
    t: 0.7,
    x: 240,
    y: 66,
    labelY: 44,
    isCelestialSun: true, // Afternoon warm sun
  },
  {
    name: 'maghrib',
    label: 'Maghrib',
    t: 0.85,
    x: 285,
    y: 92,
    labelY: 70,
    isCelestialSun: true, // Sunset golden-rose sun
  },
  {
    name: 'isha',
    label: 'Isha',
    t: 0.96,
    x: 318,
    y: 120,
    labelY: 98,
    isCelestialSun: false, // Night luminous crescent
  },
];

/** Celestial trajectory arc spanning the sky */
const CELESTIAL_ARC_PATH = 'M 30,132 Q 180,-24 330,132';

/**
 * Creates an authentic pointed Ottoman/Mughal ogee dome SVG path.
 */
function makeDomePath(
  cx: number,
  baseY: number,
  width: number,
  height: number
): string {
  const hw = width / 2;
  const topY = baseY - height;
  return (
    `M ${cx - hw},${baseY} ` +
    `C ${cx - hw * 1.08},${baseY - height * 0.4} ${cx - hw * 0.15},${topY + height * 0.12} ${cx},${topY} ` +
    `C ${cx + hw * 0.15},${topY + height * 0.12} ${cx + hw * 1.08},${baseY - height * 0.4} ${cx + hw},${baseY} Z`
  );
}

/**
 * Creates an authentic slender minaret SVG path with balcony and conical spire.
 */
function makeMinaretPath(
  cx: number,
  baseY: number,
  shaftW: number,
  balconyY: number,
  spireTopY: number
): string {
  const hw = shaftW / 2;
  const balHW = hw + 2.5;
  const balH = 3;
  return (
    `M ${cx - hw},${baseY} ` +
    `L ${cx - hw * 0.9},${balconyY + balH} ` +
    `L ${cx - balHW},${balconyY + balH} ` +
    `L ${cx - balHW},${balconyY} ` +
    `L ${cx - hw * 0.75},${balconyY} ` +
    `L ${cx - hw * 0.75},${balconyY - 5} ` +
    `L ${cx},${spireTopY} ` +
    `L ${cx + hw * 0.75},${balconyY - 5} ` +
    `L ${cx + hw * 0.75},${balconyY} ` +
    `L ${cx + balHW},${balconyY} ` +
    `L ${cx + balHW},${balconyY + balH} ` +
    `L ${cx + hw * 0.9},${balconyY + balH} ` +
    `L ${cx + hw},${baseY} Z`
  );
}

/** Pre-computed architectural paths for crisp rendering */
const SILHOUETTE_PATHS = {
  // Distant subtle layer
  distantSkyline:
    'M 0,165 Q 45,152 90,162 T 180,154 T 270,160 T 360,155 L 360,175 L 0,175 Z',
  distantDomeLeft: makeDomePath(138, 158, 32, 22),
  distantDomeRight: makeDomePath(222, 158, 32, 22),
  distantMinaretLeft: makeMinaretPath(28, 160, 6, 126, 112),
  distantMinaretRight: makeMinaretPath(332, 160, 6, 126, 112),

  // Foreground complex
  grandDome: makeDomePath(180, 154, 58, 38),
  flankMinaretLeft: makeMinaretPath(145, 155, 7.5, 122, 104),
  flankMinaretRight: makeMinaretPath(215, 155, 7.5, 122, 104),
  interDomeLeft: makeDomePath(112, 156, 36, 24),
  interDomeRight: makeDomePath(248, 156, 36, 24),
  outerMinaretLeft: makeMinaretPath(78, 158, 7, 126, 108),
  outerMinaretRight: makeMinaretPath(282, 158, 7, 126, 108),
  outerDomeLeft: makeDomePath(42, 158, 28, 18),
  outerDomeRight: makeDomePath(318, 158, 28, 18),
};

export const CelestialSkyline: React.FC<CelestialSkylineProps> = ({
  activePrayer = 'zuhr',
  height = 175,
  style,
  testID = 'celestial-skyline',
  onSelectPrayer,
}) => {
  const normalizedActive: PrayerName =
    activePrayer?.toLowerCase() === 'dhuhr'
      ? 'zuhr'
      : (activePrayer?.toLowerCase() as PrayerName) || 'zuhr';

  const activeNode =
    ARC_NODES.find((node) => node.name === normalizedActive) ?? ARC_NODES[1];

  // Specific aura colors per prayer time
  const getPrayerTheme = (name: PrayerName) => {
    switch (name) {
      case 'fajr':
        return {
          glowColor: '#7DD3FC',
          outerColor: '#38BDF8',
          coreColor: '#E0F2FE',
        };
      case 'zuhr':
        return {
          glowColor: '#FBBF24',
          outerColor: '#D4AF37',
          coreColor: '#FFF9E6',
        };
      case 'asr':
        return {
          glowColor: '#F59E0B',
          outerColor: '#D4AF37',
          coreColor: '#FFFBEB',
        };
      case 'maghrib':
        return {
          glowColor: '#FB923C',
          outerColor: '#EA580C',
          coreColor: '#FFF7ED',
        };
      case 'isha':
      default:
        return {
          glowColor: '#93C5FD',
          outerColor: '#60A5FA',
          coreColor: '#FFFFFF',
        };
    }
  };

  const activeTheme = getPrayerTheme(normalizedActive);

  return (
    <View style={[styles.container, { height }, style]} testID={testID}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 360 175"
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          {/* Atmospheric sky gradient: emerald/twilight to dark background #051410 */}
          <LinearGradient id="atmosphericSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#0B3026" stopOpacity="1" />
            <Stop offset="30%" stopColor="#08261E" stopOpacity="1" />
            <Stop offset="65%" stopColor="#061B15" stopOpacity="1" />
            <Stop offset="100%" stopColor={Colors.darkBg} stopOpacity="1" />
          </LinearGradient>

          {/* Dynamic Celestial Sky Aura radiating from active body */}
          <RadialGradient
            id="celestialAura"
            cx={`${(activeNode.x / 360) * 100}%`}
            cy={`${(activeNode.y / 175) * 100}%`}
            r="45%"
          >
            <Stop
              offset="0%"
              stopColor={activeTheme.glowColor}
              stopOpacity="0.32"
            />
            <Stop
              offset="45%"
              stopColor={activeTheme.glowColor}
              stopOpacity="0.10"
            />
            <Stop offset="100%" stopColor={Colors.darkBg} stopOpacity="0" />
          </RadialGradient>

          {/* Glowing Sun Radial Gradients */}
          <RadialGradient id="sunGlowOuter" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0%"
              stopColor={activeTheme.glowColor}
              stopOpacity="0.6"
            />
            <Stop
              offset="45%"
              stopColor={activeTheme.outerColor}
              stopOpacity="0.25"
            />
            <Stop
              offset="100%"
              stopColor={activeTheme.outerColor}
              stopOpacity="0"
            />
          </RadialGradient>

          <RadialGradient id="sunGlowMid" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFF9E6" stopOpacity="0.9" />
            <Stop
              offset="50%"
              stopColor={activeTheme.glowColor}
              stopOpacity="0.5"
            />
            <Stop
              offset="100%"
              stopColor={activeTheme.outerColor}
              stopOpacity="0"
            />
          </RadialGradient>

          {/* Luminous Moon Radial Gradients */}
          <RadialGradient id="moonGlowOuter" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0%"
              stopColor={activeTheme.glowColor}
              stopOpacity="0.5"
            />
            <Stop
              offset="50%"
              stopColor={activeTheme.outerColor}
              stopOpacity="0.2"
            />
            <Stop offset="100%" stopColor="#051410" stopOpacity="0" />
          </RadialGradient>

          {/* Window Warm Glow Gradient */}
          <LinearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFE082" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#D4AF37" stopOpacity="0.35" />
          </LinearGradient>
        </Defs>

        {/* 1. Atmospheric Sky Background */}
        <Rect
          x="0"
          y="0"
          width="360"
          height="175"
          fill="url(#atmosphericSky)"
        />

        {/* Dynamic Celestial Ambient Aura */}
        <Rect x="0" y="0" width="360" height="175" fill="url(#celestialAura)" />

        {/* Subtle Celestial Stars in the upper twilight sky */}
        <G opacity="0.6">
          <Circle cx="22" cy="28" r="0.8" fill="#E5C88E" />
          <Circle cx="48" cy="52" r="0.6" fill="#F4EDDF" />
          <Circle cx="96" cy="22" r="0.7" fill="#E5C88E" />
          <Circle cx="136" cy="18" r="0.9" fill="#FFFDF9" />
          <Circle cx="224" cy="20" r="0.8" fill="#FFFDF9" />
          <Circle cx="266" cy="28" r="0.6" fill="#E5C88E" />
          <Circle cx="312" cy="38" r="0.8" fill="#F4EDDF" />
          <Circle cx="342" cy="24" r="0.7" fill="#E5C88E" />
          {/* Subtle twinkling 4-point sparkle stars */}
          <Path
            d="M 152,14 L 153,17 L 156,18 L 153,19 L 152,22 L 151,19 L 148,18 L 151,17 Z"
            fill="#FFF9E6"
            opacity="0.75"
          />
          <Path
            d="M 295,22 L 295.8,24.5 L 298.5,25.5 L 295.8,26.5 L 295,29 L 294.2,26.5 L 291.5,25.5 L 294.2,24.5 Z"
            fill="#FFE299"
            opacity="0.65"
          />
        </G>

        {/* 2. Celestial Arc Trajectory */}
        {/* Soft Trajectory Glow */}
        <Path
          d={CELESTIAL_ARC_PATH}
          stroke="rgba(212, 175, 55, 0.14)"
          strokeWidth="4"
          fill="none"
        />
        {/* Dotted/Dashed Trajectory Line */}
        <Path
          d={CELESTIAL_ARC_PATH}
          stroke="rgba(212, 175, 55, 0.42)"
          strokeWidth="1.5"
          strokeDasharray="4,6"
          fill="none"
        />

        {/* 3. Mosque Domes & Minarets Silhouette along Horizon */}
        {/* Background Distant Layer (Atmospheric Emerald) */}
        <G fill="#07281F" opacity="0.48">
          <Path d={SILHOUETTE_PATHS.distantSkyline} />
          <Path d={SILHOUETTE_PATHS.distantDomeLeft} />
          <Path d={SILHOUETTE_PATHS.distantDomeRight} />
          <Path d={SILHOUETTE_PATHS.distantMinaretLeft} />
          <Path d={SILHOUETTE_PATHS.distantMinaretRight} />
        </G>

        {/* Foreground Main Mosque Complex (Matches #051410 dark background) */}
        <G fill={Colors.darkBg}>
          <Path d={SILHOUETTE_PATHS.outerDomeLeft} />
          <Path d={SILHOUETTE_PATHS.outerDomeRight} />
          <Path d={SILHOUETTE_PATHS.interDomeLeft} />
          <Path d={SILHOUETTE_PATHS.interDomeRight} />
          <Path d={SILHOUETTE_PATHS.grandDome} />

          <Path d={SILHOUETTE_PATHS.outerMinaretLeft} />
          <Path d={SILHOUETTE_PATHS.outerMinaretRight} />
          <Path d={SILHOUETTE_PATHS.flankMinaretLeft} />
          <Path d={SILHOUETTE_PATHS.flankMinaretRight} />

          {/* Solid Base Wall connecting to the bottom horizon */}
          <Rect x="0" y="154" width="360" height="21" fill={Colors.darkBg} />
        </G>

        {/* Delicate Golden Finials & Spires (Hilal Crescents) */}
        <G
          stroke="rgba(212, 175, 55, 0.75)"
          strokeWidth="0.9"
          fill="rgba(212, 175, 55, 0.85)"
        >
          {/* Grand Dome Finial + Crescent */}
          <Line x1="180" y1="116" x2="180" y2="108" />
          <Circle cx="180" cy="107" r="1.3" />
          {/* Flank Minarets */}
          <Line x1="145" y1="104" x2="145" y2="98" />
          <Circle cx="145" cy="97" r="1.1" />
          <Line x1="215" y1="104" x2="215" y2="98" />
          <Circle cx="215" cy="97" r="1.1" />
          {/* Intermediate Domes */}
          <Line x1="112" y1="132" x2="112" y2="126" />
          <Circle cx="112" cy="125" r="1.0" />
          <Line x1="248" y1="132" x2="248" y2="126" />
          <Circle cx="248" cy="125" r="1.0" />
          {/* Outer Minarets */}
          <Line x1="78" y1="108" x2="78" y2="103" />
          <Circle cx="78" cy="102" r="1.0" />
          <Line x1="282" y1="108" x2="282" y2="103" />
          <Circle cx="282" cy="102" r="1.0" />
        </G>

        {/* Warm Backlit Arched Prayer Windows */}
        <G fill="url(#windowGlow)">
          <Path d="M 172.5,165.5 L 172.5,162.5 A 1.5,1.5 0 0,1 175.5,162.5 L 175.5,165.5 Z" />
          <Path d="M 178.5,165.5 L 178.5,161 A 1.5,1.5 0 0,1 181.5,161 L 181.5,165.5 Z" />
          <Path d="M 184.5,165.5 L 184.5,162.5 A 1.5,1.5 0 0,1 187.5,162.5 L 187.5,165.5 Z" />
          <Path d="M 110.5,165.5 L 110.5,163 A 1.3,1.3 0 0,1 113.5,163 L 113.5,165.5 Z" />
          <Path d="M 246.5,165.5 L 246.5,163 A 1.3,1.3 0 0,1 249.5,163 L 249.5,165.5 Z" />
        </G>

        {/* 4. Prayer Marker Nodes & Celestial Sun/Moon */}
        {ARC_NODES.map((node) => {
          const isActive = node.name === normalizedActive;

          if (isActive) {
            return (
              <G key={node.name}>
                {/* Active Prayer Label */}
                <SvgText
                  x={node.x}
                  y={node.labelY}
                  textAnchor="middle"
                  fill={Colors.darkGold}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily={FontFamilies.sansBold}
                >
                  {node.label}
                </SvgText>
                {/* Active Indicator Underline Dot */}
                <Circle
                  cx={node.x}
                  cy={node.labelY + 5}
                  r="1.4"
                  fill={Colors.darkGold}
                />

                {/* Celestial Body: Sun or Moon */}
                {node.isCelestialSun ? (
                  /* Glowing Celestial Sun */
                  <G>
                    {/* Outer Radiant Aura */}
                    <Circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="url(#sunGlowOuter)"
                    />
                    {/* Concentric Glow Pulse */}
                    <Circle
                      cx={node.x}
                      cy={node.y}
                      r="13"
                      fill="url(#sunGlowMid)"
                    />
                    {/* Halo Orbit Ring */}
                    <Circle
                      cx={node.x}
                      cy={node.y}
                      r="8.5"
                      stroke={activeTheme.outerColor}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      fill="none"
                      opacity="0.8"
                    />

                    {/* Sun Rays */}
                    <G
                      stroke={activeTheme.glowColor}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.85"
                    >
                      <Line
                        x1={node.x}
                        y1={node.y - 7.5}
                        x2={node.x}
                        y2={node.y - 10.5}
                      />
                      <Line
                        x1={node.x}
                        y1={node.y + 7.5}
                        x2={node.x}
                        y2={node.y + 10.5}
                      />
                      <Line
                        x1={node.x - 7.5}
                        y1={node.y}
                        x2={node.x - 10.5}
                        y2={node.y}
                      />
                      <Line
                        x1={node.x + 7.5}
                        y1={node.y}
                        x2={node.x + 10.5}
                        y2={node.y}
                      />
                      <Line
                        x1={node.x - 5.3}
                        y1={node.y - 5.3}
                        x2={node.x - 7.5}
                        y2={node.y - 7.5}
                      />
                      <Line
                        x1={node.x + 5.3}
                        y1={node.y - 5.3}
                        x2={node.x + 7.5}
                        y2={node.y - 7.5}
                      />
                      <Line
                        x1={node.x - 5.3}
                        y1={node.y + 5.3}
                        x2={node.x - 7.5}
                        y2={node.y + 7.5}
                      />
                      <Line
                        x1={node.x + 5.3}
                        y1={node.y + 5.3}
                        x2={node.x + 7.5}
                        y2={node.y + 7.5}
                      />
                    </G>

                    {/* Core Sun Disc */}
                    <Circle
                      cx={node.x}
                      cy={node.y}
                      r="5.2"
                      fill={activeTheme.coreColor}
                    />
                  </G>
                ) : (
                  /* Glowing Celestial Crescent Moon */
                  <G>
                    {/* Outer Lunar Aura */}
                    <Circle
                      cx={node.x}
                      cy={node.y}
                      r="19"
                      fill="url(#moonGlowOuter)"
                    />
                    {/* Halo Orbit Ring */}
                    <Circle
                      cx={node.x}
                      cy={node.y}
                      r="9"
                      stroke={activeTheme.outerColor}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      fill="none"
                      opacity="0.7"
                    />

                    {/* Crescent Moon Path */}
                    <G
                      transform={`translate(${node.x - 6.6}, ${node.y - 6.6}) scale(0.55)`}
                    >
                      <Path
                        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                        fill={activeTheme.coreColor}
                        stroke={activeTheme.outerColor}
                        strokeWidth="0.8"
                      />
                    </G>

                    {/* Companion Star */}
                    <G
                      transform={`translate(${node.x + 4.5}, ${node.y - 5.5}) scale(0.35)`}
                    >
                      <Path
                        d="M12 2L14 9L21 12L14 15L12 22L10 15L3 12L10 9Z"
                        fill={activeTheme.coreColor}
                      />
                    </G>
                  </G>
                )}
              </G>
            );
          }

          // Inactive Prayer Node along the arc
          return (
            <G key={node.name}>
              {/* Prayer Label */}
              <SvgText
                x={node.x}
                y={node.labelY}
                textAnchor="middle"
                fill="rgba(148, 168, 160, 0.78)"
                fontSize="10"
                fontWeight="500"
                fontFamily={FontFamilies.sansMedium}
              >
                {node.label}
              </SvgText>

              {/* Node Circular Marker */}
              <Circle
                cx={node.x}
                cy={node.y}
                r="4.2"
                fill="#07221A"
                stroke="rgba(212, 175, 55, 0.45)"
                strokeWidth="1.1"
              />
              <Circle
                cx={node.x}
                cy={node.y}
                r="1.8"
                fill="rgba(212, 175, 55, 0.75)"
              />
            </G>
          );
        })}
      </Svg>

      {/* Optional touch overlay for user taps on prayers */}
      {onSelectPrayer && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {ARC_NODES.map((node) => (
            <TouchableOpacity
              key={node.name}
              style={[
                styles.touchTarget,
                {
                  left: `${(node.x / 360) * 100}%`,
                  top: `${(node.y / 175) * 100}%`,
                },
              ]}
              onPress={() => onSelectPrayer(node.name)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Select prayer ${node.label}`}
              testID={`celestial-prayer-${node.name}`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: Colors.darkBg,
  },
  touchTarget: {
    position: 'absolute',
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
  },
});

export default CelestialSkyline;

